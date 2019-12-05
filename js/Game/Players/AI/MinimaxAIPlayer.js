/**
 * 极大极小值搜索 与 ALpha - Beta 剪枝
 */
class MinimaxAIPlayer extends AIPlayer{

    /**
     * 决策树迭代深度
     */
    Max_Depth = 2;

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
            
            //while (isNaN(NextPosition.X)){
            //    NextPosition = this.MaxMinSearch( this.CloneTheGameControl(e.GameControl), 0, -Infinity, Infinity);
            //} 

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
     * @param {*} Alpha
     * @param {*} Beta
     * 
     * @return {*} 下子坐标
     */
    MaxMinSearch(Simulation, Depth, Alpha, Beta) {
        /// Simulation.GameStatus == this.Identity
        ///     己方    Simulation.Players[this.Identity]
        ///     取大    Max
        /// Simulation.GameStatus == 1-this.Identity
        ///     敌方    Simulation.Players[1-this.Identity]
        ///     取小    Min

        let PossiableMoves;

        if ( Simulation.GameStatus == this.Identity ){
            // 己方
            PossiableMoves = this.GetPossiableMoves(Simulation,this.Identity).sort(this.SearchOrderComparator);
        } else if ( Simulation.GameStatus == (1-this.Identity) ) {
            // 敌方
            PossiableMoves = this.GetPossiableMoves(Simulation,1-this.Identity).sort(this.SearchOrderComparator);
        } else {
            let value = this.ScoresDiff(Simulation);
            if (value != 0) {
                return {X:NaN, Y:NaN, Value:value*Infinity};
            } else {
                return {X:NaN, Y:NaN, Value:0};
            }
        };
       

        if ( (Depth > this.Max_Depth) || (PossiableMoves.length == 0) ) {
            let value = this.Evaluation(Simulation);
            if (Depth == 0) {
                throw new Error("WDNMD.");
            }
            return {X:NaN, Y:NaN, Value:value};
        }

        if ( Simulation.GameStatus == this.Identity ){
            // 己方
            let First = true;
            let Ans = {X:NaN, Y:NaN, Value:-Infinity};

            for (let APossiavleMove of PossiableMoves) {
                let NewSimulation = this.CloneTheGameControl(Simulation);
                
                NewSimulation.Players[ this.Identity ].PlaceChess(APossiavleMove.X,APossiavleMove.Y);

                let PossiableAns = this.MaxMinSearch(NewSimulation, Depth+1, Alpha, Beta);
                PossiableAns.X = APossiavleMove.X;
                PossiableAns.Y = APossiavleMove.Y;
                
                if ((PossiableAns.Value > Ans.Value) || First) {
                    Ans = PossiableAns;
                    First = false;
                }

                Alpha = Math.max(Alpha, Ans.Value);

                if (Alpha >= Beta) break;

            }

            return Ans;
        } else {
            // 敌方
            let First = true;
            let Ans = {X:NaN, Y:NaN, Value:Infinity};

            for (let APossiavleMove of PossiableMoves) {
                let NewSimulation = this.CloneTheGameControl(Simulation);
                
                NewSimulation.Players[ 1-this.Identity ].PlaceChess(APossiavleMove.X,APossiavleMove.Y);

                let PossiableAns = this.MaxMinSearch(NewSimulation, Depth+1, Alpha, Beta);
                PossiableAns.X = APossiavleMove.X;
                PossiableAns.Y = APossiavleMove.Y;
                
                if ((PossiableAns.Value < Ans.Value) || First) {
                    Ans = PossiableAns;
                    First = false;
                }

                Beta = Math.min(Beta, Ans.Value);

                if (Alpha >= Beta) break;

            }

            return Ans;
        }

    };
    
    /**
     * 搜索优先次序比较器
     * 
     * @param {*} a 
     * @param {*} b 
     */
    SearchOrderComparator(a, b) {
        if (a.Value>b.Value) {
            return -1;
        } else if (a.Value<b.Value) {
            return 1;
        };
        return Math.random()>.5 ? -1 : 1;
    }

}