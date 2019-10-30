/**
 * 极大极小值搜索 与 ALpha - Beta 剪枝
 */
class MinimaxAIPlayer extends AIPlayer{

    /**
     * 决策树迭代深度
     */
    Max_Depth = 4;

    /**
     * 构造函数
     */
    constructor(){
        super();
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
            let NextPosition = this.MaxMinSearch( this.CloneTheGameControl(e.GameControl), 0, -Infinity, Infinity);
            console.log(NextPosition);
            this.PlaceChess(NextPosition.X, NextPosition.Y);
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

    /**
     * 
     * @param {*} GameControl 
     * @param {*} Depth 
     * 
     * @return {*} 下子坐标
     */
    MaxMinSearch(Simulation, Depth, Alpha, Beta) {
        /// Depth
        /// 偶数
        ///     己方    Simulation.Players[this.Identity]
        ///     取大    Max
        /// 奇数
        ///     敌方    Simulation.Players[1-this.Identity]
        ///     取小    Min
        
        let PossiableMoves;

        if ( (Depth & 1) == 0){
            // 偶数
            PossiableMoves = this.GetPossiableMoves(Simulation,this.Identity).sort(this.RandomSort);
        } else {
            // 奇数
            PossiableMoves = this.GetPossiableMoves(Simulation,1-this.Identity).sort(this.RandomSort);
        }
       

        if ( (Depth > this.Max_Depth) || (PossiableMoves.length == 0) ) {
            let Scores = Simulation.GetScores();
            let value = Scores[ this.Identity ] - Scores[ 1-this.Identity ] ;
            if (Depth == 0) {
                throw new Error("WDNMD.");
            }
            return {X:NaN, Y:NaN, Value:value};
        }

        if ( (Depth & 1) == 0){
            // 偶数
            let Ans = {X:NaN, Y:NaN, Value:-Infinity};

            for (let APossiavleMove of PossiableMoves) {
                let NewSimulation = this.CloneTheGameControl(Simulation);
                
                NewSimulation.Players[ this.Identity ].PlaceChess(APossiavleMove.X,APossiavleMove.Y);

                let PossiableAns = this.MaxMinSearch(NewSimulation, Depth+1, Alpha, Beta);
                PossiableAns.X = APossiavleMove.X;
                PossiableAns.Y = APossiavleMove.Y;
                
                if (PossiableAns.Value > Ans.Value) {
                    Ans = PossiableAns;
                }

                Alpha = Math.max(Alpha, Ans.Value);

                if (Alpha >= Beta) break;

            }

            return Ans;
        } else {
            // 奇数
            let Ans = {X:NaN, Y:NaN, Value:Infinity};

            for (let APossiavleMove of PossiableMoves) {
                let NewSimulation = this.CloneTheGameControl(Simulation);
                
                NewSimulation.Players[ 1-this.Identity ].PlaceChess(APossiavleMove.X,APossiavleMove.Y);

                let PossiableAns = this.MaxMinSearch(NewSimulation, Depth+1, Alpha, Beta);
                PossiableAns.X = APossiavleMove.X;
                PossiableAns.Y = APossiavleMove.Y;
                
                if (PossiableAns.Value < Ans.Value) {
                    Ans = PossiableAns;
                }

                Beta = Math.min(Beta, Ans.Value);

                if (Alpha >= Beta) break;

            }

            return Ans;
        }

    };

    RandomSort(a, b) {
        return Math.random()>.5 ? -1 : 1;
    }

    GetPossiableMoves(_Simulation,ID) {
        let ret = [];

        let Map = _Simulation.GetRenderingCheckerBoard();

        let i;
        let j;
        for (i=0;i<8;i++){
            for (j=0;j<8;j++){
                if ( ( (ID==0) && ((Map[i][j]&2)==2) ) || ( (ID==1) && ((Map[i][j]&4)==4) ) ) 
                    ret.push({X:i, Y:j});
            }
        }

        return ret;
    }
    
}