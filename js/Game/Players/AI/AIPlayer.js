/**
 * AI 玩家类
 */
class AIPlayer extends Player{

    /**
     * 构造函数
     */
    constructor(){
        super();


    }

    /**
     * 克隆游戏状态
     */
    CloneTheGameControl(GameControl){
        return GameControl.Clone(
                {
                    Players: [
                        new VirtualPlayer(),
                        new VirtualPlayer()
                    ],
                    DisplayControl: new VirtualDisplay()
                }
            );
    }


    /**
     * 盐酸随缘估值函数权重数组
     * https://github.com/Chlorie/TairitsuBot/blob/master/coolq-app/src/tasks/othello/codename_tairitsu.cpp#L24
     */
    EvaluationWeight=[
        [ 50, -25,  20,  10,  10,  20, -25,  50],
        [-25, -50, -15, -10, -10, -15, -50, -25],
        [ 20, -15,  10,   3,   3,  10, -15,  20],
        [ 10, -10,   3,   1,   1,   3, -10,  10],
        [ 10, -10,   3,   1,   1,   3, -10,  10],
        [ 20, -15,  10,   3,   3,  10, -15,  20],
        [-25, -50, -15, -10, -10, -15, -50, -25],
        [ 50, -25,  20,  10,  10,  20, -25,  50]
    ];


    /**
     * 估值函数
     */
    Evaluation(Simulation){
        let Scores = 0;
        let i;
        let j;
        for (i=0;i<8;i++){
            for (j=0;j<8;j++){
                if (Simulation.CheckerBoard[i][j] == null) {
                    continue;
                } else if (Simulation.CheckerBoard[i][j].Identity == this.Identity) {
                    Scores += this.EvaluationWeight[i][j];
                } else if (Simulation.CheckerBoard[i][j].Identity == this.Identity) {
                    Scores -= this.EvaluationWeight[i][j];
                }
            }
        }

        return Scores;
    }
}