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
     * 盐酸随缘估值函数
     * https://github.com/Chlorie/TairitsuBot/blob/master/coolq-app/src/tasks/othello/codename_tairitsu.cpp
     */

    CountBits(State){
        let Result = 0;
        while (State != 0) {
            if (State & 1n) Result++;
            State = State >> 1n;
        }
        return Result;
    }

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

    EvaluationStableDisks(Simulation, Player){
        let TopMask = 0xff00000000000000n;
        let LeftMask = 0x8080808080808080n;
        let BottomMask = 0x00000000000000ffn;
        let RightMask = 0x0101010101010101n;
        let InvertLeftMask = 0x7f7f7f7f7f7f7f7fn;
        let InvertRightMask = 0xfefefefefefefefen;

        let Self = Simulation.GetBitCheckerBoard(Player);
        let Occupied = Simulation.GetBitCheckerBoard(Simulation.Players[this.Identity]) | Simulation.GetBitCheckerBoard(Simulation.Players[1-this.Identity]);

        let Corners = Self & 0x8100000000000081n; // Corners occupied by [self]

        let Stable = Corners; // Stable disks
        let InitialUp = Corners;
        let InitialDown = Corners;
        let InitialLeft = Corners;
        let InitialRight = Corners;
        for (let i = 0; i < 6; i++)
        {
            InitialUp |= InitialUp << 8n & Self;
            InitialDown |= InitialDown >> 8n & Self;
            InitialLeft |= (InitialLeft & InvertLeftMask) << 1n & Self;
            InitialRight |= (InitialRight & InvertRightMask) >> 1n & Self;
        }
        Stable |= (InitialUp | InitialDown | InitialLeft | InitialRight); // Corners and sides

        let Northwest = Stable;
        let Southeast = Stable;
        let North = Stable;
        let South = Stable;
        let Northeast = Stable;
        let Southwest = Stable;
        let West = Stable;
        let East = Stable;

        for (let i = 0; i < 6; i++)
        {
            Northwest |= (Northwest & InvertLeftMask) << 9n & Self;
            Southeast |= (Southeast & InvertRightMask) >> 9n & Self;
            North |= North << 8n & Self;
            South |= South >> 8n & Self;
            Northeast |= (Northeast & InvertRightMask) << 7n & Self;
            Southwest |= (Southwest & InvertLeftMask) >> 9n & Self;
            West |= (West & InvertLeftMask) << 1n & Self;
            East |= (East & InvertRightMask) >> 1n & Self;
        }

        Stable |= (Northwest | Southeast) & (North | South) & (Northeast | Southwest) & (West | East);

        if ((Occupied & TopMask) == TopMask) Stable |= Self & TopMask;
        if ((Occupied & LeftMask) == LeftMask) Stable |= Self & LeftMask;
        if ((Occupied & BottomMask) == BottomMask) Stable |= Self & BottomMask;
        if ((Occupied & RightMask) == RightMask) Stable |= Self & RightMask;

        return this.CountBits(Stable);
    }

    EvaluationBalancedEdgeReward(Simulation, Player){
        let Total = 0;
        
        if (Simulation.CheckerBoard[0][3]==Player && Simulation.CheckerBoard[0][4]==Player) // Upper
        {
            if (!(Simulation.CheckerBoard[0][2]==Player) && !(Simulation.CheckerBoard[0][5]==Player)) // Length-2
                Total += 20;
            else if (Simulation.CheckerBoard[0][2]==Player && Simulation.CheckerBoard[0][5]==Player)
            {
                if (!(Simulation.CheckerBoard[0][1]==Player) && !(Simulation.CheckerBoard[0][6]==Player)) // Length-4
                    Total += 30;
                else if (Simulation.CheckerBoard[0][1]==Player && Simulation.CheckerBoard[0][6]==Player) // Length-6
                    Total += 40;
            }
        }

        if (Simulation.CheckerBoard[3][0]==Player && Simulation.CheckerBoard[4][0]==Player) // Left
        {
            if (!(Simulation.CheckerBoard[2][0]==Player) && !(Simulation.CheckerBoard[5][0]==Player)) // Length-2
                Total += 20;
            else if (Simulation.CheckerBoard[2][0]==Player && Simulation.CheckerBoard[5][0]==Player)
            {
                if (!(Simulation.CheckerBoard[1][0]==Player) && !(Simulation.CheckerBoard[6][0]==Player)) // Length-4
                    Total += 30;
                else if (Simulation.CheckerBoard[1][0]==Player && Simulation.CheckerBoard[6][0]==Player) // Length-6
                    Total += 40;
            }
        }

        if (Simulation.CheckerBoard[7][3]==Player && Simulation.CheckerBoard[7][4]==Player) // Lower
        {
            if (!(Simulation.CheckerBoard[7][2]==Player) && !(Simulation.CheckerBoard[7][5]==Player)) // Length-2
                Total += 20;
            else if (Simulation.CheckerBoard[7][2]==Player && Simulation.CheckerBoard[7][5]==Player)
            {
                if (!(Simulation.CheckerBoard[7][1]==Player) && !(Simulation.CheckerBoard[7][6]==Player)) // Length-4
                    Total += 30;
                else if (Simulation.CheckerBoard[7][1]==Player && Simulation.CheckerBoard[7][6]==Player) // Length-6
                    Total += 40;
            }
        }

        if (Simulation.CheckerBoard[3][7]==Player && Simulation.CheckerBoard[4][7]==Player) // Right
        {
            if (!(Simulation.CheckerBoard[2][7]==Player) && !(Simulation.CheckerBoard[5][7]==Player)) // Length-2
                Total += 20;
            else if (Simulation.CheckerBoard[2][7]==Player && Simulation.CheckerBoard[5][7]==Player)
            {
                if (!(Simulation.CheckerBoard[1][7]==Player) && !(Simulation.CheckerBoard[6][7]==Player)) // Length-4
                    Total += 30;
                else if (Simulation.CheckerBoard[1][7]==Player && Simulation.CheckerBoard[6][7]==Player) // Length-6
                    Total += 40;
            }
        }

        return Total;

    }

    EvaluationIsBeginning(Simulation){
        // No need to care about mobility in the beginning
        let Occupied = Simulation.GetBitCheckerBoard(Simulation.Players[0]) | Simulation.GetBitCheckerBoard(Simulation.Players[1]);
        
        if (!(Occupied & 0xff818181818181ffn)) return false; // Edge occupied
        return (Occupied & 0x00003c3c3c3c0000n) != 0x00003c3c3c3c0000n; // "Sweet 16"
    }

    EvaluationImmobilityPunish(Simulation, Player){
        let Count = this.GetPossiableMoves(Simulation, Player.Identity).length;
        switch (Count){
            case 3: return 10;
            case 2: return 30;
            case 1: return 100;
            case 0: return 200;
            default: return 0;
        }
    }

    EvaluationMain(Simulation, Player) {
        
        let Scores = 0;
        let i;
        let j;
        for (i=0;i<8;i++){
            for (j=0;j<8;j++){
                if ( (Simulation.CheckerBoard[i][j] != null) && (Simulation.CheckerBoard[i][j].Identity == Player.Identity) ) {
                    Scores += this.EvaluationWeight[i][j];
                };
            }
        }

        Scores += this.EvaluationStableDisks(Simulation, Player);
        Scores += this.EvaluationBalancedEdgeReward(Simulation, Player);
        if (!this.EvaluationIsBeginning(Simulation)) Scores -= this.EvaluationImmobilityPunish(Simulation, Player);

        return Scores;
    }

    /**
     * 估值函数
     * 
     * @param {*} Simulation 
     */
    Evaluation(Simulation){
        return this.EvaluationMain(Simulation, Simulation.Players[this.Identity]) - this.EvaluationMain(Simulation, Simulation.Players[1-this.Identity]);
    }


    /**
     * 分数差
     * 
     * @param {*} Simulation 
     */
    ScoresDiff(Simulation){
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