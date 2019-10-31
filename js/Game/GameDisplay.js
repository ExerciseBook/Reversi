/**
 * 游戏主渲染模块
 */
class GameDisplay extends Display{

    /**
     * 构造函数
     */
    constructor(){
        super();
    }

    /**
     * 本方法会在棋盘更新时被触发
     */
    CheckerBoardUpdate(e){
		let i;
		let j;
		let CheckerBoard = e.NewCheckerBoard
		for(i=0; i<8; i++){
			for(j=0; j<8; j++){
				if(e.NewCheckerBoard[i][j] == e.Players[0]){
					CheckerBoard[i][j] = 0;
				}else if(e.NewCheckerBoard[i][j] == e.Players[1]){
					CheckerBoard[i][j] = 1;
				}
			}
		}
		game.checkerboard = CheckerBoard;
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