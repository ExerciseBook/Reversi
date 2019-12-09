var LIVE2DCUBISMCORE = Live2DCubismCore
//如果资源在CDN，一定要写http://或者https://否则会以本域名请求且为相对路径
//模型的model3.json文件路径
var baseModelPath = "live2d/";
var modelPath;
//Application全局变量
var app = null;
//模型渲染的位置
var tag_target = '.live2d';
//待机的动作索引
var idleIndex;
//登录的动作索引，只针对动作文件中有idel字段的
var loginIndex;
//回港动作，只针对碧蓝航线等有回港动作，动作文件中有home字段
var homeIndex;
//模型偏移位置
var model_x = 50;
var model_y = 40;
//渲染模型的宽高
var modelWidth = 1000;
var modelHight = 700;
//渲染模型的比例
var scale = 500;
//测试用，加载时间起点，不保证准确性
var startTime = null;
//第一种方式初始化模型，通过model3.json的内容去导入
function initModelConfig(modelJson){
    var fileReferences = modelJson.FileReferences;
    var mocPath =  fileReferences.Moc;
    loadMoc(mocPath);
    var textures = fileReferences.Textures;
    loadTextures(textures);
    var phyPath = fileReferences.Physics;
    loadPhyPath(phyPath);
    for (var key in fileReferences.Motions) {
        loadMotions(fileReferences.Motions[key]);
    }
    PIXI.loader.reset();
    PIXI.utils.destroyTextureCache();
    PIXI.loader
        .on("start", loadStartHandler)
        .on("progress", loadProgressHandler)
        .on("complete", loadCompleteHandler)
        .load(function (loader, resources) {
        var canvas = document.querySelector(tag_target);
        var view = canvas.querySelector('canvas');
        if(app != null){app.stop();}
        app = new PIXI.Application(modelWidth, modelHight, {transparent: true ,view: view});
        var moc = Live2DCubismCore.Moc.fromArrayBuffer(resources['moc'].data);
        var builder = new LIVE2DCUBISMPIXI.ModelBuilder();
        builder.setMoc(moc);
        builder.setTimeScale(1);
        var textureIndex = 0;
        for (var key in resources) {
            if(key.indexOf('texture')!= -1){
                builder.addTexture(textureIndex++ , resources[key].texture);
            }
        }
        if(resources['physics']){ builder.setPhysics3Json(resources['physics'].data); }
        var model = builder.build();
        app.stage.addChild(model);
        app.stage.addChild(model.masks);
        var motions = setMotions(model,resources);
        setMouseTrick(model,app,canvas,motions);
        setOnResize(model,app);
    });
}
//加载MOC文件
function loadMoc(mocPath){
    if(typeof(mocPath) !== 'undefined'){
        PIXI.loader.add('moc', modelPath.substr(0, modelPath.lastIndexOf('/') + 1) + mocPath, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
    }else{
        console.log('Not find moc');
    }
}
//加载 texture 文件
function loadTextures(textures){
    if(textures.length >0){
        for (var i = 0; i < textures.length; i++) {
            //loadTextures;
            PIXI.loader.add('texture' + ( i + 1) , modelPath.substr(0, modelPath.lastIndexOf('/') + 1) + textures[i]);
        }
    }else{
        console.log("Not find textures");
    }
}
// 加载physics文件
function loadPhyPath(phyPath){
    if(typeof(phyPath) !== 'undefined'){
        PIXI.loader.add('physics', modelPath.substr(0, modelPath.lastIndexOf('/') + 1) + phyPath, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
    }else{
        console.log('Not find physics');
    }
}
//加载动作文件
function loadMotions(motions){
    //动作总数
    var motionCount = 0 ;
    if(motions.length >0){
        for (var i = 0; i < motions.length; i++) {
            PIXI.loader.add('motion'+ ( motionCount + 1) , modelPath.substr(0, modelPath.lastIndexOf('/') + 1) + motions[i].File, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
            if(motions[i].File.indexOf('idle')!= -1){
                idleIndex = motionCount;
            }else if(motions[i].File.indexOf('login') != -1){
                loginIndex = motionCount;
            }else if(motions[i].File.indexOf('home') != -1){
                homeIndex = motionCount;
            }
            motionCount ++ ;
        }
    }else{
        console.error('Not find motions');
    }
}
//另一种初始化模型方式
function initModel(data){
    var model3Obj = {data:data,url: modelPath.substr(0, modelPath.lastIndexOf('/') + 1)};
    //清除loader内的内容，并清除缓存中的内容
    PIXI.loader.reset();
    PIXI.utils.destroyTextureCache();
    for (var key in data.FileReferences.Motions) {
        loadMotions(data.FileReferences.Motions[key]);
    }
    //调用此方法直接加载，并传入设置模型的回调方法
    new LIVE2DCUBISMPIXI.ModelBuilder().buildFromModel3Json(
      PIXI.loader
        .on("start", loadStartHandler)
        .on("progress", loadProgressHandler)
        .on("complete", loadCompleteHandler),
      model3Obj,
      setModel
    );  
}
//设置模型的回调方法
function setModel(model){
    var canvas = document.querySelector(tag_target);
    var view = canvas.querySelector('canvas');
    //重复加载模型是，先停止渲染，否则后台WebGL会报警告
    if(app != null){app.stop();}
    app = new PIXI.Application(modelWidth, modelHight, {transparent: true ,view:view});
    app.stage.addChild(model);
    app.stage.addChild(model.masks);
    var motions = setMotions(model,PIXI.loader.resources);
    setMouseTrick(model,app,canvas,motions);
    setOnResize(model,app);
}
//设置模型动作
function setMotions(model,resources){
    //动作数组，存放格式化好的动作数据
    var motions = [];
    for (var key in resources) {
        if(key.indexOf('motion') != -1){
            motions.push(LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(resources[key].data)); 
        }
    }
    var timeOut;
    if(motions.length > 0){
        window.clearTimeout(timeOut);
        model.animator.addLayer("motion", LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1.0);
        if(null != loginIndex && null != idleIndex){//如果有登录和待机动作，则在登录动作完成后切换到待机动作
            model.animator.getLayer("motion").play(motions[loginIndex]);
            timeOut = setTimeout( function(){model.animator.getLayer("motion").play(motions[idleIndex]);}, motions[loginIndex].duration * 1000 );
        }else{
            //如果没有登录动作，则默认播放第一个动作
            model.animator.getLayer("motion").play(motions[0]);
        }
    }
    return motions;
}
//设置鼠标追击
function setMouseTrick(model,app,canvas,motions){
    var rect = canvas.getBoundingClientRect();
    var center_x = modelWidth/2 + rect.left, center_y = modelHight/2 + rect.top;
    var mouse_x = center_x, mouse_y = center_y;
    var angle_x = model.parameters.ids.indexOf("ParamAngleX");
    if(angle_x < 0){ angle_x = model.parameters.ids.indexOf("PARAM_ANGLE_X"); }
    var angle_y = model.parameters.ids.indexOf("ParamAngleY");
    if(angle_y < 0){ angle_y = model.parameters.ids.indexOf("PARAM_ANGLE_Y"); }
    var eye_x = model.parameters.ids.indexOf("ParamEyeBallX");
    if(eye_x < 0){ eye_x = model.parameters.ids.indexOf("PARAM_EYE_BALL_X"); }
    var eye_y = model.parameters.ids.indexOf("ParamEyeBallY");
    if(eye_y < 0){ eye_y = model.parameters.ids.indexOf("PARAM_EYE_BALL_Y"); }
    app.ticker.add(function (deltaTime) {
        rect = canvas.getBoundingClientRect();
        center_x = modelWidth/2 + rect.left, center_y = modelHight/2 + rect.top;
        var x = mouse_x - center_x;
        var y = mouse_y - center_y;
        model.parameters.values[angle_x] = x * 0.1;
        model.parameters.values[angle_y] = -y * 0.1;
        model.parameters.values[eye_x] = x * 0.005;
        model.parameters.values[eye_y] = -y * 0.005;
        model.update(deltaTime);
        model.masks.update(app.renderer);
    });
    /*
    var scrollElm = bodyOrHtml();
    var mouseMove;
    document.body.addEventListener("mousemove", function(e){
        window.clearTimeout(mouseMove);
        mouse_x = e.pageX - scrollElm.scrollLeft;
        mouse_y = e.pageY - scrollElm.scrollTop;
        mouseMove =  window.setTimeout(function(){mouse_x = center_x , mouse_y = center_y} , 5000);
    });
    var timeOut;
    document.body.addEventListener("click", function(e){
        window.clearTimeout(timeOut);
        if(motions.length == 0){ return; }
        if(rect.left < mouse_x && mouse_x < (rect.left + rect.width) && rect.top < mouse_y && mouse_y < (rect.top + rect.height)){
            //var rand = Math.floor(Math.random() * motions.length);
            model.animator.getLayer("motion").stop();
            model.animator.getLayer("motion").play(motions[1]);
            //如果有登录动作，则在随机播放动作结束后回到待机动作
            if(null != idleIndex){
                timeOut = setTimeout( function(){model.animator.getLayer("motion").play(motions[idleIndex]);}, motions[rand].duration * 1000 );
            }
        }
    });
    var onblur = false;
    var onfocusTime;
    sessionStorage.setItem('Onblur', '0');
    window.onblur = function(e){
        if('0' == sessionStorage.getItem('Onblur')){
            onfocusTime = setTimeout(function(){sessionStorage.setItem('Onblur','1');},30000);
        }
    };
    window.onfocus = function(e){
        window.clearTimeout(onfocusTime);
        if(motions.length > 0){
            if('1' == sessionStorage.getItem('Onblur')){
                model.animator.getLayer("motion").stop();
                if(null != loginIndex && null != idleIndex){//如果有回港和待机动作，则在登录动作完成后切换到待机动作
                    model.animator.getLayer("motion").play(motions[homeIndex]);
                    onfocusTime = setTimeout( function(){model.animator.getLayer("motion").play(motions[idleIndex]);sessionStorage.setItem('Onblur', '0');}, motions[homeIndex].duration * 1000 );
                }else{
                    //如果没有，则默认播放第一个动作
                    model.animator.getLayer("motion").play(motions[0]);
                }
            }
        }
    };
    */
}
//设置浏览器onResize事件
function setOnResize(model, app){
    var onResize = function (event) {
        if (event === void 0) { event = null; }
            var width = modelWidth;
            var height = modelHight;
            app.view.style.width = width + "px";
            app.view.style.height = height + "px";
            app.renderer.resize(width, height);
            model.position = new PIXI.Point(modelWidth/2 + model_x, modelHight/2 + model_y);
            model.scale = new PIXI.Point(scale,scale);
            model.masks.resize(app.view.width, app.view.height);
    };
    onResize();
    window.onresize = onResize;
}
//获取页面内容方法
function bodyOrHtml(){
    if('scrollingElement' in document){ return document.scrollingElement; }
    if(navigator.userAgent.indexOf('WebKit') != -1){ return document.body; }
    return document.documentElement;
}
//加载模型开始时Handler
function loadStartHandler(){
    //优化加载开始计时
    startTime = new Date();
    console.log("Start loading Model at " + startTime);
}
//加载模型Handler，监控加载进度
function loadProgressHandler(loader) {
    console.log("progress: " + Math.round(loader.progress) + "%");
}
//加载模型结束Handler
function loadCompleteHandler(){
    var loadTime = new Date().getTime() - startTime.getTime();
    console.log('Model initialized in '+ loadTime/1000 + ' second');
    PIXI.loader.off("start", loadStartHandler);//监听事件在加载完毕后取消
    PIXI.loader.off("progress", loadProgressHandler);//监听事件在加载完毕后取消
    PIXI.loader.off("complete", loadCompleteHandler);//监听事件在加载完毕后取消
}
//简单发送AJAX异步请求读取json文件
function loadModel(modelName){
    if(modelName == 'fran21'){
        //模型偏移位置
        model_x = 100;
        model_y = -30;
    }else{
        model_x = 50;
        model_y = 40;
    }
    //拼接路径
    //如果model3的文件形如baseModelPath/xxx/xxx.model3.json则下面不用修改，否则按照文件路径进行修改
    modelPath =  baseModelPath + modelName + "/" + modelName + ".model3.json";
    var ajax = null;
    if(window.XMLHttpRequest){ajax = new XMLHttpRequest();}else if(window.ActiveObject){
        ajax = new ActiveXObject("Microsoft.XMLHTTP");
    }else{
        throw new Error('loadModelJsonError');
    }  
    ajax.open('GET', modelPath, true);
    ajax.send();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){  
            if(ajax.status == 200){ 
                var data = JSON.parse(ajax.responseText)
                //initModelConfig(data);
                initModel(data);
            }else{
                console.error('Response error,Code:' + ajax.status);
            }
        }
    };
}