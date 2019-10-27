/**
 * 游戏主渲染模块
 */
class GameDisplay extends Display{

    /**
     * 构造函数
     */
    constructor(){
        super();

        /**
         * 本方法会在棋盘更新时被触发
         */
        this.CheckerBoardUpdate=function(e){
            ///巴拉巴拉
            console.log(e);

            let CheckerBoard = document.getElementById('ELEM_CheckerBoard');
            console.log(CheckerBoard);

            let content="";
            let i;
            let j;
            for (i=0;i<8;i++) {
                content=content+"<tr height=\"20\">";
                for (j=0;j<8;j++) {
                    content=content+"<td bgcolor=\""
                    
                    if (e.NewCheckerBoard[i][j] == e.Players[0]) {
                        content=content+"black";
                    } else if (e.NewCheckerBoard[i][j] == e.Players[1]) {
                        content=content+"white";
                    } else content=content+"blue";

                    content=content+"\" width=\"20\"/>"
                }
                content=content+"</tr>";
            }

            CheckerBoard.innerHTML=content;
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
        this.Event_GameStart=function(e){
            console.log(e);
            let Sign = document.getElementById('ELEM_Sign');
            Sign.innerHTML="游戏开始";
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
        this.Event_Round=function(e){
            console.log(e);
            let Sign = document.getElementById('ELEM_Sign');
            let s = "";

            if (e.Operator == e.GameControl.Players[0]) {
                s = "1P 黑方回合";
            } else if (e.Operator == e.GameControl.Players[1]) {
                s = "2P 白方回合";
            } else {
                throw new Error("WDNMD.");
            }

            Sign.innerHTML=s;
        }
        
        /**
         * 事件 游戏结束
         * 
         * 在游戏结束的时候本事件会被触发
         * 
         * @param {Event} e 
         */
        this.Event_GameEnd=function(e){
            console.log(e);
            let Sign = document.getElementById('ELEM_Sign');

            // e.Winner.Scores[] // 得分
            let s = ""+e.Winner.Scores[0]+":"+e.Winner.Scores[1]+" ";

            if (e.Winner == e.GameControl.Players[0]) {
                //1P 黑方胜
                s=s+"1P 黑方胜";
            } else if (e.Winner == e.GameControl.Players[2]) {
                //2P 白方胜
                s=s+"2P 白方胜";
            } else if (e.WInner == e.GameControl) {
                //平局
                s=s+"平局";
            }

            Sign.innerHTML=s;
            

        }

    }


    
}