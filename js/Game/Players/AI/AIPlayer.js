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
        let Simulation = new Core();
        Simulation.GameStatus = GameControl.GameStatus;
        Simulation.Players = [new VirtualPlayer(), new VirtualPlayer()];

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
                if (GameControl.CheckerBoard[i][j]==GameControl.Players[0]) {
                    Simulation.CheckerBoard[i][j] = Simulation.Players[0];
                } else if (GameControl.CheckerBoard[i][j]==GameControl.Players[1]) {
                    Simulation.CheckerBoard[i][j] = Simulation.Players[1];
                };

            }
        }



        Simulation.DisplayControl = new VirtualDisplay();

        Simulation.Players[0].GameControl = Simulation;
        Simulation.Players[0].Identity = 0;

        Simulation.Players[1].GameControl = Simulation;
        Simulation.Players[1].Identity = 1;
        
        return Simulation;
    }


}