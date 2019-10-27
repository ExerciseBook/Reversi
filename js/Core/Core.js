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
     * 构造函数
     * 
     * 并没啥卵用
     */
    constructor() {
    }

    /**
     * 显示渲染控件
     */
    DisplayControl;
    
    /**
     * 游戏初始化
     * 
     * @param {Player} PlayerA 黑房玩家
     * @param {Player} PlayerB 白方玩家
     * @param {Display} ADisplay
     */
    Initialize(PlayerA,PlayerB,ADisplay){
        this.CheckerBoard=[
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,null   ,null   ,null   ,null   ,null],
            [null   ,null   ,null   ,PlayerA,PlayerB,null   ,null   ,null],
            [null   ,null   ,null   ,PlayerB,PlayerA,null   ,null   ,null],
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
        
        this.DisplayControl.CheckerBoardUpdate(AGameDisplayCheckerUpdatEvent);

        // 广播游戏开始事件
        this.Event_BroadCast_GameStart();

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
            if (APlayer==this.CheckerBoard[i][j]) {
                HasSelf = true;
                Self = {x:i,y:j};
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

        if (this.CheckerBoard[x][y]!=null) return false;
        
        let i=0;
        let j=0;
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
        if (his.CanPlaceAChess(this.Players[NextStatus])) {
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


        if ( (this.GameStatus!=0) && (this.GameStatus!=1) ) return -3;

        if ( ( (this.GameStatus==0) && (APlayer==this.Players[0]) ) || ( (this.GameStatus==1) && (APlayer==this.Players[1]) ) ) {

            let ReverseEvent = new GameCoreReverseEvent() ;
            if (!this.VerifyPlacing(APlayer,x,y,ReverseEvent)){
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

            this.DisplayControl.CheckerBoardUpdate(AGameDisplayCheckerUpdatEvent);


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
     * 2 黑方可落子点
     * 
     * 3 白方可落子点
     * 
     * -1 空白点
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

                    let e = new GameCoreReverseEvent() ;
                    if (this.VerifyPlacing(Players[0],i,j,e)) {
                        Row.push(2);
                    } else if (this.VerifyPlacing(Players[1],i,j,e)) {
                        Row.push(3);
                    } else Row.push(-1);

                } else {
                    throw new Error("WDNMD.");
                }
            }
            RenderingCheckerBoard.push(Row);
        }

        return RenderingCheckerBoard;
    }
    
    async Event_BroadCast_GameStart(){
        let AGameStartEvent = new GameStartEvent();
        AGameStartEvent.GameControl = this;
        this.DisplayControl.Event_GameStart(AGameStartEvent);

        AGameStartEvent = new GameStartEvent();
        AGameStartEvent.GameControl = this;
        this.Players[0].Event_GameStart(AGameStartEvent);

        AGameStartEvent = new GameStartEvent();
        AGameStartEvent.GameControl = this;
        this.Players[1].Event_GameStart(AGameStartEvent);
    }

    async Event_BroadCast_Round(){
        let AGameRoundEvent = new GameRoundEvent();
        AGameRoundEvent.GameControl = this;
        if (this.GameStatus==0){
            AGameRoundEvent.Operator = this.Players[0];
        } else if (this.GameStatus==1) {
            AGameRoundEvent.Operator = this.Players[1];
        } else AGameRoundEvent.Operator = null;

        let AnotherGameRoundEvent = new GameRoundEvent();
        AnotherGameRoundEvent.GameControl = AGameRoundEvent.GameControl;
        AnotherGameRoundEvent.Operator = AGameRoundEvent.Operator;
        this.DisplayControl.Event_Round(AnotherGameRoundEvent);

        AnotherGameRoundEvent = new GameRoundEvent();
        AnotherGameRoundEvent.GameControl = AGameRoundEvent.GameControl;
        AnotherGameRoundEvent.Operator = AGameRoundEvent.Operator;
        this.Players[0].Event_Round(AnotherGameRoundEvent);

        AnotherGameRoundEvent = new GameRoundEvent();
        AnotherGameRoundEvent.GameControl = AGameRoundEvent.GameControl;
        AnotherGameRoundEvent.Operator = AGameRoundEvent.Operator;
        this.Players[1].Event_Round(AnotherGameRoundEvent);
    }

    async Event_BroadCast_GameEnd(){
        let AGameEndEvent = new GameEndEvent();
        AGameEndEvent.GameControl = this;
        if ( this.GameStatus==8 ) {
            AGameEndEvent.Winner = this;
        } if ( this.GameStatus==9 ) {
            AGameEndEvent.Winner = this.Players[0];
        } if ( this.GameStatus==10 ) {
            AGameEndEvent.Winner = this.Players[1];
        } else {
            throw new Error("WDNMD.");
        };
        AGameEndEvent.Scores=this.GetScores;

        let AnotherEndEvent = new notherEndEvent();
        AnotherEndEvent.GameControl = AGameEndEvent.GameControl;
        AnotherEndEvent.Winner = AGameEndEvent.Winner;
        AnoterEndEvent.Scores = [AGameEndEvent.Scores[0],AGameEndEvent.Scores[1]];
        this.DisplayControl.Event_GameEnd(AGameEndEvent);

        AnotherEndEvent = new notherEndEvent();
        AnotherEndEvent.GameControl = AGameEndEvent.GameControl;
        AnotherEndEvent.Winner = AGameEndEvent.Winner;
        AnoterEndEvent.Scores = [AGameEndEvent.Scores[0],AGameEndEvent.Scores[1]];
        this.Players[0].Event_GameEnd(AGameEndEvent);

        AnotherEndEvent = new notherEndEvent();
        AnotherEndEvent.GameControl = AGameEndEvent.GameControl;
        AnotherEndEvent.Winner = AGameEndEvent.Winner;
        AnoterEndEvent.Scores = [AGameEndEvent.Scores[0],AGameEndEvent.Scores[1]];
        this.Players[1].Event_GameEnd(AGameEndEvent);
    }
}
