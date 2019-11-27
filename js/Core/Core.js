/**
 * 游戏核心类
 * 
 * 主要负责游戏的主要功能实现
 */
class Core{
    /**
     * 游戏状态
     * 
     * -1 等待开始
     * 0 游戏中 等待黑方落子
     * 1 游戏中 等待白方落子
     * 9 黑方获胜
     * 10 白方获胜
     * 8 平局
     */
    GameStatus;

    /**
     * 棋盘
     * 
     * Player CheckerBoard[8][8]
     */
    CheckerBoard=[[],[],[],[],[],[],[],[]];

    /**
     * 玩家池
     * 
     * Player[0] 黑方玩家
     * 
     * Player[1] 白方玩家
     */
    Players=[];

    /**
     * 显示渲染控件
     */
    DisplayControl;

    /**
     * 操作锁
     */
    _Mutex = false;

    /**
     * 构造函数
     * 
     * 并没啥卵用
     */
    constructor() {
        this._Mutex = false;
    }

    
    /**
     * 游戏初始化
     * 
     * @param {Player} PlayerA 黑房玩家
     * @param {Player} PlayerB 白方玩家
     * @param {Display} ADisplay
     */
    Initialize(PlayerA,PlayerB,ADisplay){
        if (this._Mutex) return;
        this._Mutex = true;

        this.CheckerBoard=[
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,PlayerB,PlayerA,null   ,null   ,null],
            [null   ,null   ,null   ,PlayerA,PlayerB,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null]
        ];

        this.GameStatus=0;

        this.Players=[PlayerA,PlayerB];

        PlayerA.GameControl = this;
        PlayerA.Identity = 0;

        PlayerB.GameControl = this;
        PlayerB.Identity = 1;

        this.DisplayControl = ADisplay;
        this.DisplayControl.GameControl = this;


        // 广播棋盘更新事件
        let AGameDisplayCheckerUpdatEvent = new GameDisplayCheckerUpdatEvent();
        AGameDisplayCheckerUpdatEvent.GameControl = this;
        AGameDisplayCheckerUpdatEvent.OldCheckerBoard = this.GetCheckerBoard();
        AGameDisplayCheckerUpdatEvent.GameStatus = this.GameStatus;
        AGameDisplayCheckerUpdatEvent.NewCheckerBoard = this.GetCheckerBoard();
        AGameDisplayCheckerUpdatEvent.NewRenderingCheckerBoard = this.GetRenderingCheckerBoard();
        AGameDisplayCheckerUpdatEvent.Players = [this.Players[0], this.Players[1]];
        AGameDisplayCheckerUpdatEvent.Scores = this.GetScores();
        
        this.DisplayControl.CheckerBoardUpdate(AGameDisplayCheckerUpdatEvent);

        // 广播游戏开始事件
        this.Event_BroadCast_GameStart();

        this._Mutex = false;

        // 广播游戏回合事件
        this.Event_BroadCast_Round();
    }
    
    /**
     * 返回当前棋盘
     */
    GetCheckerBoard(){
        let CheckBoard = [];
        
        let i=0;
        let j=0;
        for (i=0;i<8;i++) {
            let Row = [];
            for (j=0;j<8;j++) {
                Row.push(this.CheckerBoard[i][j]);
            }
            CheckBoard.push(Row);
        }

        return CheckBoard;
    }

    /**
     * 判断这个方向是否会有棋子被翻转
     * 
     * @param {Player} APlayer 
     * @param {int} x 
     * @param {int} y 
     * @param {int} DirectionX 
     * @param {int} DirectionY 
     * @param {Event} e 
     * 
     * @return {boolean} true:有 false:无
     */
    VerfyPlacing_Direction(APlayer,x,y,DirectionX,DirectionY,e){
        let i = x;
        let j = y;

        let HasSelf = false;
        let Self = {x:x,y:y};
        let HasReverse = false;
        let ReverseList = [];


        while ( (0<=i) && (i<8) && (0<=j) && (j<8) ) {
            i+=DirectionX;
            j+=DirectionY;
            if ( !((0<=i) && (i<8) && (0<=j) && (j<8)) ) break;
            if (this.CheckerBoard[i][j]==null){
                break;
            }
            if (APlayer==this.CheckerBoard[i][j]) {
                HasSelf = true;
                Self = {x:i,y:j};
                break;
            }
        }

        if (!HasSelf) return false;

        i = Self.x;
        j = Self.y;
        while ( (i!=x) || (j!=y) ) {
            i-=DirectionX;
            j-=DirectionY;
            
            if ( (this.CheckerBoard[i][j]!=null) && (APlayer!=this.CheckerBoard[i][j]) ) {
                HasReverse = true;
                ReverseList.push({x:i,y:j});
            }
        }

        if (!HasReverse) return false;

        e.Reverses.push({Direction:{x:DirectionX,y:DirectionY},ReverseList:ReverseList});
        return true;

    }


    /**
     * 判断落子位置是否合法
     * 
     * @param {Player} APlayer 
     * @param {int} x 
     * @param {int} y 
     * @param {Event} e
     * 
     * @return {boolean} true:落子位置合法 false:落子位置非法
     */
    VerifyPlacing(APlayer,x,y,e){
        e.GameControl = this;
        e.Player = APlayer;

        /// 判断欲落子点是否已被占用
        if (this.CheckerBoard[x][y]!=null) return false;

        let i=0;
        let j=0;
        let flag=false;
        /// 判断是否和棋盘现有棋子相邻
        for (i=-1;i<=1;i++) {
            for (j=-1;j<=1;j++) {
                if ( (i==0) && (j==0) ) continue;
                if ( (0<=x+i) && (x+i<8) && (0<=y+j) && (y+j<8) ) {
                    if (this.CheckerBoard[x+i][y+j]!=null) {
                        flag = true;
                    }
                }
            }
            if (flag) break;
        }

        if (flag==false) return false;

        /// 判断落子后是否可以翻转棋盘上已有的棋子

        for (i=-1;i<=1;i++) {
            for (j=-1;j<=1;j++) {
                if ( (i==0) && (j==0) ) continue;
                this.VerfyPlacing_Direction(APlayer,x,y,i,j,e);
            }
        }

        //console.log(e.Reverses[0].ReverseList);
        //console.log(e.Reverses[0].Direction);

        if (e.Reverses.length==0) return false;

        return true;
    }

    /**
     * 更新棋盘
     * 
     * @param {Event} e 
     */
    UpdateCheckerBoard(e){
        let i;
        let j;
        for (i=0;i<e.Reverses.length;i++) {
            //console.log(e.Reverses[i]);
            for (j=0;j<e.Reverses[i].ReverseList.length;j++) {
                this.CheckerBoard[e.Reverses[i].ReverseList[j].x][e.Reverses[i].ReverseList[j].y]=e.Player;
            }
        }
    }

    /**
     * 判断这个玩家是否可以落子
     * 
     * @param {Player} APlayer 
     */
    CanPlaceAChess(APlayer){
        let i;
        let j;

        for (i=0;i<8;i++){
            for (j=0;j<8;j++){
                let e = new GameCoreReverseEvent() ;
                if (this.VerifyPlacing(APlayer,i,j,e)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 获取得分
     * 
     * @return {int[]} 得分
     */
    GetScores(){
        let scores=[0,0];

        let i;
        let j;
        // 游戏结束
        for (i=0;i<8;i++){
            for (j=0;j<8;j++){
                if (this.CheckerBoard[i][j]==this.Players[0]){
                    scores[0]++;
                } else if (this.CheckerBoard[i][j]==this.Players[1]){
                    scores[1]++;
                }
            }
        }

        return scores;
    }


    /**
     * 更新游戏状态
     */
    UpdateGameStatus(){
        if ( (this.GameStatus!=0) && (this.GameStatus!=1) )  return this.GameStatus;

        let score=[0,0]

        let NextStatus = 1-this.GameStatus;
        if (this.CanPlaceAChess(this.Players[NextStatus])) {
            this.GameStatus = NextStatus;
            return this.GameStatus;
        }

        NextStatus = this.GameStatus;
        if (this.CanPlaceAChess(this.Players[NextStatus])) {
            this.GameStatus = NextStatus;
            return this.GameStatus;
        }

        score = this.GetScores();

        if (score[0]>score[1]) {
            this.GameStatus = 9;
        } else if (score[0]==score[1]) {
            this.GameStatus = 8;
        } else if (score[0]<score[1]) {
            this.GameStatus = 10;
        }
        return this.GameStatus;

    }

    /**
     * 落子
     * 
     * @param {Player} APlayer 
     * @param {int} x 
     * @param {int} y 
     * 
     * @return {int} 0:正常 -2:落子位置非法 -1:信息非法 -3:游戏状态失效
     */
    PlaceChess(APlayer,x,y){
        if (this._Mutex) return -5;

        if ( ((typeof(x) == "number") && (parseInt(x) == x)) && ((typeof(y) == "number") && (parseInt(y) == y)) ) {} else {return -4;}

        if ( (this.GameStatus!=0) && (this.GameStatus!=1) ) {
            return -3;
        }

        if ( ( (this.GameStatus==0) && (APlayer==this.Players[0]) ) || ( (this.GameStatus==1) && (APlayer==this.Players[1]) ) ) {
            this._Mutex = true;

            let ReverseEvent = new GameCoreReverseEvent() ;
            if (!this.VerifyPlacing(APlayer,x,y,ReverseEvent)){
                this._Mutex = false;
                return -2;
            };
            

            // 广播棋盘更新事件
            let AGameDisplayCheckerUpdatEvent = new GameDisplayCheckerUpdatEvent();
            AGameDisplayCheckerUpdatEvent.GameControl = this;
            AGameDisplayCheckerUpdatEvent.OldCheckerBoard = this.GetCheckerBoard();

            this.CheckerBoard[x][y]=APlayer;
            this.UpdateCheckerBoard(ReverseEvent);
            this.UpdateGameStatus();

            AGameDisplayCheckerUpdatEvent.GameStatus = this.GameStatus;
            AGameDisplayCheckerUpdatEvent.NewCheckerBoard = this.GetCheckerBoard();
            AGameDisplayCheckerUpdatEvent.NewRenderingCheckerBoard = this.GetRenderingCheckerBoard();
            AGameDisplayCheckerUpdatEvent.Players = [this.Players[0], this.Players[1]];
            AGameDisplayCheckerUpdatEvent.Scores = this.GetScores();

            this.DisplayControl.CheckerBoardUpdate(AGameDisplayCheckerUpdatEvent);

            this._Mutex = false;

            if ( (this.GameStatus==0) || (this.GameStatus==1) ) {
                // 游戏尚未结束
                // 广播游戏回合事件
                this.Event_BroadCast_Round();
            } else if ( (this.GameStatus==8) || (this.GameStatus==9) || (this.GameStatus==10) ) {
                // 游戏结束
                // 广播游戏结束事件
                this.Event_BroadCast_GameEnd();
            } else {
                throw new Error("WDNMD.");
            }
            
            return 0;

        } else {
            this._Mutex = false;
            return -1;

        }

    }

    /**
     * 获取数字版棋盘
     * 
     * 0 黑棋
     * 
     * 1 白棋
     * 
     * &2 == 2 黑方可落子点
     * 
     * &4 == 4 白方可落子点
     * 
     * &8 == 8 空白点
     * 
     * @return {int[][]} 棋盘
     */
    GetRenderingCheckerBoard(){
        let CheckerBoard=this.GetCheckerBoard();
        let Players=this.Players;

        let RenderingCheckerBoard=[];

        let i;
        let j;
        for (i=0;i<8;i++) {
            let Row=[];
            for (j=0;j<8;j++){
                if (CheckerBoard[i][j]==Players[0]) {
                    Row.push(0);
                } else if (CheckerBoard[i][j]==Players[1]) {
                    Row.push(1);
                } else if (CheckerBoard[i][j]==null) {

                    let e = new GameCoreReverseEvent();
                    let s = 8;
                    if (this.VerifyPlacing(Players[0],i,j,e)) {
                        s = (s | 2);
                    };
                    e = new GameCoreReverseEvent();
                    if (this.VerifyPlacing(Players[1],i,j,e)) {
                        s = (s | 4);
                    };
                    Row.push(s);
                } else {
                    throw new Error("WDNMD.");
                }
            }
            RenderingCheckerBoard.push(Row);
        }

        return RenderingCheckerBoard;
    }
    
    async Event_BroadCast_GameStart(){
        let AGameStartEvent0 = new GameStartEvent();
        AGameStartEvent0.GameControl = this;
        Event_BroadCast_GameStart_Active(this.DisplayControl,AGameStartEvent0);

        let AGameStartEvent1 = new GameStartEvent();
        AGameStartEvent1.GameControl = this;
        Event_BroadCast_GameStart_Active(this.Players[0],AGameStartEvent1);

        let AGameStartEvent2 = new GameStartEvent();
        AGameStartEvent2.GameControl = this;
        Event_BroadCast_GameStart_Active(this.Players[1],AGameStartEvent2);
    }

    async Event_BroadCast_Round(){
        let AGameRoundEvent = new GameRoundEvent();
        AGameRoundEvent.GameControl = this;
        if (this.GameStatus==0){
            AGameRoundEvent.Operator = this.Players[0];
        } else if (this.GameStatus==1) {
            AGameRoundEvent.Operator = this.Players[1];
        } else AGameRoundEvent.Operator = null;

        let AnotherGameRoundEvent0 = new GameRoundEvent();
        AnotherGameRoundEvent0.GameControl = AGameRoundEvent.GameControl;
        AnotherGameRoundEvent0.Operator = AGameRoundEvent.Operator;
        setTimeout(() => {
            Event_BroadCast_Round_Active(this.DisplayControl,AnotherGameRoundEvent0);
        }, 50); 

        let AnotherGameRoundEvent1 = new GameRoundEvent();
        AnotherGameRoundEvent1.GameControl = AGameRoundEvent.GameControl;
        AnotherGameRoundEvent1.Operator = AGameRoundEvent.Operator;
        setTimeout(() => {
            Event_BroadCast_Round_Active(this.Players[0],AnotherGameRoundEvent1);
        }, 100)
        

        let AnotherGameRoundEvent2 = new GameRoundEvent();
        AnotherGameRoundEvent2.GameControl = AGameRoundEvent.GameControl;
        AnotherGameRoundEvent2.Operator = AGameRoundEvent.Operator;
        setTimeout(() => {
            Event_BroadCast_Round_Active(this.Players[1],AnotherGameRoundEvent2);
        }, 150)
    }

    async Event_BroadCast_GameEnd(){
        let AGameEndEvent = new GameEndEvent();
        AGameEndEvent.GameControl = this;
        if ( this.GameStatus==8 ) {
            AGameEndEvent.Winner = this;
        } else if ( this.GameStatus==9 ) {
            AGameEndEvent.Winner = this.Players[0];
        } else if ( this.GameStatus==10 ) {
            AGameEndEvent.Winner = this.Players[1];
        } else {
            throw new Error("WDNMD.");
        };
        AGameEndEvent.Scores=this.GetScores();

        let AnotherEndEvent0 = new GameEndEvent();
        AnotherEndEvent0.GameControl = AGameEndEvent.GameControl;
        AnotherEndEvent0.Winner = AGameEndEvent.Winner;
        AnotherEndEvent0.Scores = [AGameEndEvent.Scores[0],AGameEndEvent.Scores[1]];
        Event_BroadCast_GameEnd_Active(this.DisplayControl,AnotherEndEvent0);

        let AnotherEndEvent1 = new GameEndEvent();
        AnotherEndEvent1.GameControl = AGameEndEvent.GameControl;
        AnotherEndEvent1.Winner = AGameEndEvent.Winner;
        AnotherEndEvent1.Scores = [AGameEndEvent.Scores[0],AGameEndEvent.Scores[1]];
        Event_BroadCast_GameEnd_Active(this.Players[0],AnotherEndEvent1);

        let AnotherEndEvent2 = new GameEndEvent();
        AnotherEndEvent2.GameControl = AGameEndEvent.GameControl;
        AnotherEndEvent2.Winner = AGameEndEvent.Winner;
        AnotherEndEvent2.Scores = [AGameEndEvent.Scores[0],AGameEndEvent.Scores[1]];
        Event_BroadCast_GameEnd_Active(this.Players[1],AnotherEndEvent2);
    }

    /**
     * 克隆游戏状态
     * 
     * @param {*} Status 
     */
    Clone(Status){
        let Simulation = new Core();
        Simulation.GameStatus = this.GameStatus;
        Simulation.Players = [Status.Players[0], Status.Players[1]];

        Simulation.CheckerBoard=[
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null]
        ];

        let i;
        let j;
        for (i=0;i<8;i++){
            for (j=0;j<8;j++){
                if (this.CheckerBoard[i][j]==this.Players[0]) {
                    Simulation.CheckerBoard[i][j] = Simulation.Players[0];
                } else if (this.CheckerBoard[i][j]==this.Players[1]) {
                    Simulation.CheckerBoard[i][j] = Simulation.Players[1];
                };

            }
        }

        Simulation.DisplayControl = Status.DisplayControl;

        Simulation.Players[0].GameControl = Simulation;
        Simulation.Players[0].Identity = 0;

        Simulation.Players[1].GameControl = Simulation;
        Simulation.Players[1].Identity = 1;
        
        return Simulation;
    }

    StatusEquals(Another) {
        if (this.GameStatus != Another.GameStatus) return false;

        let i;
        let j;
        for (i=0;i<8;i++){
            for (j=0;j<8;j++){

                if (this.CheckerBoard[i][j]==this.Players[0]) {
                    if (Another.CheckerBoard[i][j]!=Another.Players[0]) return false;
                } else if (this.CheckerBoard[i][j]==this.Players[1]) {
                    if (Another.CheckerBoard[i][j]!=Another.Players[1]) return false;
                } else if (this.CheckerBoard[i][j]==null) {
                    if (Another.CheckerBoard[i][j]!=null) return false;
                } else {
                    throw new Error("WDNMD.");
                }

            }
        }

        return true;
    }
}


async function Event_BroadCast_GameStart_Active(module,e){
    module.Event_GameStart(e);
}

async function Event_BroadCast_Round_Active(module,e){
    module.Event_Round(e);
}

async function Event_BroadCast_GameEnd_Active(module,e){
    module.Event_GameEnd(e);
}