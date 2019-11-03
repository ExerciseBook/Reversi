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
		console.log(e)
		let i;
		let j;
		let OldCheckerBoard = e.OldCheckerBoard;
		let NewCheckerBoard = e.NewCheckerBoard;
		for(i=0; i<8; i++){
			for(j=0; j<8; j++){
				if(e.NewCheckerBoard[i][j] == e.Players[0]){
					NewCheckerBoard[i][j] = 0;
				}else if(e.NewCheckerBoard[i][j] == e.Players[1]){
					NewCheckerBoard[i][j] = 1;
				}
			}
		}
		for(i=0; i<8; i++){
			for(j=0; j<8; j++){
				if(e.OldCheckerBoard[i][j] == e.Players[0]){
					OldCheckerBoard[i][j] = 0;
				}else if(e.OldCheckerBoard[i][j] == e.Players[1]){
					OldCheckerBoard[i][j] = 1;
				}
			}
		}
        game.checkerboard = OldCheckerBoard;
        game.info_talk = "少女祈祷中……"
		setTimeout(()=>{
            game.checkerboard = NewCheckerBoard;
            game.info_talk = ""
		},2000)
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
        game.info_talk = "又来了不知天高地厚的家伙么"
        setTimeout(()=>{
            game.info_talk = ""
        },2000)
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