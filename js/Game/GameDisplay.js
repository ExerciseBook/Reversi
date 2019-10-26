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


    }


    
}