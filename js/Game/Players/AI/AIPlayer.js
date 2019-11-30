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
     * 估值函数
     * 
     * @param {*} Simulation 
     */
    Evaluation(Simulation){
        let Scores = Simulation.GetScores();
        return Scores[ this.Identity ] - Scores[ 1-this.Identity ] ;
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

    /**
     * 搜索优先次序权重
     */
    SearchValueWeight=[
        [64,32,16, 8, 8,16,32,64],
        [32,16, 8, 4, 4, 8,16,32],
        [16, 8, 4, 2, 2, 4, 8,16],
        [ 8, 4, 2, 1, 1, 2, 4, 8],
        [ 8, 4, 2, 1, 1, 2, 4, 8],
        [16, 8, 4, 2, 2, 4, 8,16],
        [32,16, 8, 4, 4, 8,16,32],
        [64,32,16, 8, 8,16,32,64]
    ];

    /**
     * 搜索优先次序计算器
     * 
     * @param {*} Simulation 
     * @param {*} ID 
     */
    SearchEvaluation(Simulation,ID){

        if (Simulation.Gamestatus!=1 && Simulation.Gamestatus!=2) return 0;

        let Scores = 0;
        let i;
        let j;
        for (i=0;i<8;i++){
            for (j=0;j<8;j++){
                if (Simulation.CheckerBoard[i][j] == null) {
                    continue;
                } else if (Simulation.CheckerBoard[i][j].Identity == Simulation.Players[ ID ] ) {
                    Scores += this.SearchValueWeight[i][j];
                } else if (Simulation.CheckerBoard[i][j].Identity == Simulation.Players[ 1-ID ] ) {
                    Scores -= this.SearchValueWeight[i][j];
                }
            }
        }

        return Scores;
    }
    
}