/**
 * 蒙特卡洛树搜索（确信）
 */
class MCTSAIPlayer extends AIPlayer{

    /**
     * 搜索最大耗时
     */
    SearchTimeLimitation = 10 * 1000;

    /**
     * 构造函数
     */
    constructor(){
        super();
    }

    /**
     * 搜索状态树根
     */
    StatusRoot = {};

    /**
     * 事件 游戏开始
     * 
     * 在游戏开始的时候本事件会被触发
     * 
     * 可在此处编写玩家初始化需要执行的内容
     * 
     * @param {Event} e 
     */
    Event_GameStart(e){
    } 

    /**
     * 事件 游戏回合
     * 
     * 在游戏轮到新的玩家下棋的时候本事件会被触发
     * 
     * 在判断完是轮到你下棋的时候即可调用 PlaceChess 方法下棋。
     * 
     * @param {Event} e 
     */
    Event_Round(e){
        this.StatusUpdate( this.CloneTheGameControl(e.GameControl) );
        if (e.Operator==this) {
            //轮到我下棋
            let NextPosition = this.MCTSSearch();
            console.log(NextPosition);
            if (NextPosition != null) this.PlaceChess(NextPosition.X, NextPosition.Y);
        } else {
            //没有轮到我下棋
        }
    }
    
    /**
     * 事件 游戏结束
     * 
     * 在游戏结束的时候本事件会被触发
     * 
     * @param {Event} e 
     */
    Event_GameEnd(e){
        return null;
    }

    /**
     * 更新当前状态树根节点
     */
    StatusUpdate(Simulation){

        // 让俺现在这个棋盘走到的是哪一个状态
        if ((this.StatusRoot == undefined) || (this.StatusRoot == null)) {
            this.StatusRoot = new MCTSAIPlayer_StatusNode( this.CloneTheGameControl(Simulation) );
        }

        let NowStatus = null;
        for (let i in this.StatusRoot.Children) {
            if (i.StatusEquals(Simulation)) {
                NowStatus = i;
                break;
            }
        }

        if (NowStatus == null) {
            this.StatusRoot = new MCTSAIPlayer_StatusNode( this.CloneTheGameControl(Simulation) );
        } else {
            this.StatusRoot = NowStatus;
        }

    }

    /**
     * 蒙特卡洛树搜索
     * 
     * @param {*} GameControl 
     * 
     * @return {*} 下子坐标
     */
    MCTSSearch() {

        // 记录开始时间
        let SearchStartTime = new Date().getTime();
        let SearchFlag = true;

        // 可以接受的最大的搜索时间
        while ( (this.SearchTimeLimitation > new Date().getTime() - SearchStartTime) && (SearchFlag) ) {
            this.ExpendSearch();
        }

        // 选一个ok的情况来走吧qwq
        return this.GetNextPosition(this.StatusRoot);
    };
    
    /**
     * 挑一个最妙的下一步来走
     */
    GetNextPosition(NowStatus){
        
        let NextPosition
        NextPosition = {X:NaN, Y:NaN, Value:-Infinity}

        for (let i in NowStatus.Children) {
            let Value = i.GetRate;

            if ( Value > NextPosition.Value ) {
                NextPosition.X = i.Move.X;
                NextPosition.Y = i.Move.Y;
                NextPosition.Value = Value;
            }

        }

        return NextPosition;
    }

    /**
     * 给这个树添枝加叶（确信）
     */
    ExpendSearch(){
        
    }

    /**
     * 估值函数
     * 
     * @param {*} Simulation 
     */
    Evaluation(Simulation) {
        let value = super.Evaluation(Simulation);
        if (value > 0) return 1;
        if (value < 0) return -1;
        return 0;
    }

    /**
     * 获取所有的落子点
     * 
     * @param {*} _Simulation 
     * @param {*} ID 
     */
    GetPossiableMoves(_Simulation,ID) {
        let ret = [];

        let Map = _Simulation.GetRenderingCheckerBoard();

        let i;
        let j;
        for (i=0;i<8;i++){
            for (j=0;j<8;j++){
                if ( ( (ID==0) && ((Map[i][j]&2)==2) ) || ( (ID==1) && ((Map[i][j]&4)==4) ) ) {
                    let NewSimulation = this.CloneTheGameControl(_Simulation);
                    NewSimulation.Players[ ID ].PlaceChess(i,j);
                    ret.push({X:i, Y:j, Value:this.SearchEvaluation(NewSimulation,ID)});
                }
            }
        }

        return ret;
    }
    
}