/**
 * 显示核心类 | 接口类
 * 
 * 主要负责显示渲染
 */
class Display{

    /**
     * 控制核心
     */
    GameControl;

    /**
     * 本方法会在棋盘更新时被触发
     */
    CheckerBoardUpdate(){
        console.log("未定义棋盘更新事件");
    }

    /**
     * 事件 游戏开始
     * 
     * 在游戏开始的时候本事件会被触发
     * 
     * 可在此处编写显示初始化需要执行的内容
     * 
     * @param {Event} e 
     */
    Event_GameStart(e){
        console.log(e);
    } 

    /**
     * 事件 游戏回合
     * 
     * 在游戏轮到新的玩家下棋的时候本事件会被触发
     * 
     * 可以在此处添加渲染提示标语的代码
     * 
     * @param {Event} e 
     */
    Event_Round(e){
        console.log(e);
    }
    
    /**
     * 事件 游戏结束
     * 
     * 在游戏结束的时候本事件会被触发
     * 
     * @param {Event} e 
     */
    Event_GameEnd(e){
        console.log(e);
    }

}

