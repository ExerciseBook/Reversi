/**
 * 蒙特卡洛树搜索（确信）
 */
class MCTSAIPlayer extends AIPlayer{

    /**
     * 搜索最大耗时
     */
    SearchTimeLimitation = 20 * 1000;

    /**
     * 最大迭代深度
     */
    Max_Depth = 6;

    /**
     * 构造函数
     */
    constructor(){
        super();
    }

    /**
     * 搜索状态树根
     */
    StatusRoot = null;

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
        this.StatusRoot = null;
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

        console.log(this.StatusRoot.GetRate());

        if (e.Operator==this) {
            //轮到我下棋
            let NextPosition = this.MCTSSearch();
            while (isNaN(NextPosition.X)){
                this.StatusUpdate( this.CloneTheGameControl(e.GameControl) );
                NextPosition = this.MCTSSearch();
            } 

            console.log(this.StatusRoot.Total, NextPosition);

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
        this.StatusRoot=null;
        return null;
    }

    /**
     * 更新当前状态树根节点
     */
    StatusUpdate(Simulation){

        // 让俺现在这个棋盘走到的是哪一个状态
        if ((this.StatusRoot == undefined) || (this.StatusRoot == null)) {
            this.StatusRoot = new MCTSAIPlayer_StatusNode( this.CloneTheGameControl(Simulation), this );
        }

        let NowStatus = null;
        for (let i of this.StatusRoot.Children) {
            if (i.Status.StatusEquals(Simulation)) {
                NowStatus = i;
                break;
            }
        }

        if (NowStatus == null) {
            this.StatusRoot = new MCTSAIPlayer_StatusNode( this.CloneTheGameControl(Simulation), this );
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
            if (this.ExpendSearch()==0) SearchFlag = false;
        }

        // 选一个ok的情况来走吧qwq
        return this.GetNextPosition(this.StatusRoot);
    };
    
    /**
     * 挑一个最妙的下一步来走
     */
    GetNextPosition(NowStatus){
        if (NowStatus.Children.length == 0) return {X:NaN, Y:NaN, Value:-Infinity}

        let NextPosition
        NowStatus.ChildrenSort();
        NextPosition = {X:NaN, Y:NaN, Value:-Infinity}

        for (let i of NowStatus.Children) {
            //if (((i.Status.GameStatus==1) && (this.Identity==0)) || ((i.Status.GameStatus==0) && (this.Identity==1))) {
                NextPosition.X = i.Move.X;
                NextPosition.Y = i.Move.Y;
                NextPosition.Value = i.GetRate();
                break;
            //}
        }

        return NextPosition;

    }

    /**
     * 给这个树添枝加叶（确信）
     */
    ExpendSearch(){
        return this.ExpendSearchMain(this.StatusRoot,0);
    }

    /**
     * 给这棵树添枝加叶的主要执行部分
     * 
     * @param {*} NowStatus 
     * @param {*} Depth
     * 
     * @return {*} 1 扩展成功 | 0 扩展失败
     */
    ExpendSearchMain(NowStatus, Depth){
        if (Depth > this.Max_Depth) return 0;

        if (NowStatus.Children.length == 0) {
            /// NowStatus 为叶子结点
            ///  1. 待扩展 | 返回扩展成功 
            ///  2. 已结束 | 返回扩展失败
            let NowSimulation = NowStatus.Status;
            if ( (NowSimulation.GameStatus==0) || (NowSimulation.GameStatus==1) ) {
                ///  1. 待扩展 | 返回扩展成功 

                let PossiableMoves = this.GetPossiableMoves(NowSimulation,NowSimulation.GameStatus);
                for (let APossiavleMove of PossiableMoves) {
                    /// 创建新的游戏状态
                    let NewSimulation = this.CloneTheGameControl(NowSimulation);
                    NewSimulation.Players[NewSimulation.GameStatus].PlaceChess(APossiavleMove.X,APossiavleMove.Y);

                    /// 将新的游戏状态绑定到本结点下
                    let NewChildren = new MCTSAIPlayer_StatusNode(NewSimulation, this);
                    NewChildren.Move={X:APossiavleMove.X, Y:APossiavleMove.Y};
                    NowStatus.Children.push(NewChildren);
                    //console.log(NewChildren);

                    /// 更新新的结点的状态
                    NewChildren.Update();
                }

                NowStatus.Update();

                return 1;
            } else {
                ///  2. 已结束 | 返回扩展失败
                return 0;
            }
        } else {

            NowStatus.ChildrenSort();
            let TargetCount = Math.max(Math.ceil( NowStatus.Children.length) / 4, 1);
            let Count = 0;
            
            for (let Next of NowStatus.Children) {
                if (this.ExpendSearchMain(Next,Depth+1) == 1) {
                    if (++Count >= TargetCount){
                        break;
                    }
                }
            }
            
            if (Count != 0) {
                NowStatus.Update();
                return 1;
            } else {
                return 0;
            }

        }
        return 0;
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