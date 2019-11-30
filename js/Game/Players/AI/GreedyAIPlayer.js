/**
 * 贪心算法模拟
 */
class GreedyAIPlayer extends AIPlayer{

    /**
     * 构造函数
     */
    constructor(){
        super();
        this.Evaluation=this.ScoresDiff;
    }

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
        if (e.Operator==this) {
            //轮到我下棋

            let Next = {x:0, y:0, Scores:-114514};
            let Count = 0;
            let i;
            let j;
            for (i=0;i<8;i++){
                for (j=0;j<8;j++){
                    let Simulation = this.CloneTheGameControl(e.GameControl);
                    if ( Simulation.Players[ this.Identity ].PlaceChess(i,j) == 0 ) {
                        let value = this.Evaluation(Simulation);

                        if ( value > Next.Scores ) {
                            Count=1;
                        } else if ( value == Next.Scores) {
                            Count++;
                        }

                        if (Math.random() < 1.0/Count) {
                            Next.x = i;
                            Next.j = j;
                            Next.Scores = value;
                        }
                    }
                }
            }

            this.PlaceChess(Next.x,Next.j);

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
    }

}