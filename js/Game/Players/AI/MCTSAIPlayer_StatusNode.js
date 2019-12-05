/**
 * 蒙特卡洛树搜索 状态结点
 */
class MCTSAIPlayer_StatusNode{

    /**
     * 当前结点存储的游戏状态
     */
    Status = null;

    /**
     * 当前结点的子结点列表
     */
    Children = [];

    /**
     * 优势数
     */
    Win = 0;

    /**
     * 总共数
     */
    Total = 0;

    /**
     * 从父亲结点到本结点的落子点
     */
    Move = {X:-1 , Y:-1};

    /**
     * 游戏身份
     */
    Identity = -1;

    /**
     * 由哪个玩家使得游戏进入本状态
     */
    ThisMove = -1;

    /**
     * 玩家实例
     */
    ControlPlayer = null;

    /**
     * 优势
     */
    Evaluation = 0;

    /**
     * 普通的构造函数
     */
    constructor(Status,ControlPlayer,ThisMove){
        this.Status = Status;
        this.Identity = ControlPlayer.Identity;
        this.ControlPlayer = ControlPlayer;
        this.ThisMove = ThisMove;
    }

    /**
     * 本结点的置信度
     */
    GetRate(){
        let Value = 0;

        if (this.Total == 0) return 0.5;
        if ( ( this.ControlPlayer.Identity==this.ThisMove ) ) {
            /// 由自己进入本状态
            Value = this.Win / this.Total;
        } else /*if ( this.ControlPlayer.Identity!=this.ThisMove )*/ {
            /// 不是由自己进入本状态
            Value = 1-(this.Win / this.Total);
        };
        
        //return 1 / (1 + Math.exp(-Value / 50));

        return Value;

        /*
        if (Value<=-200) {
            return 0;
        } else if (Value<=200) {
            return Value/400 + 0.5
        } else return 1;
        */
    }
    
    /**
     * 给子结点排序
     */
    ChildrenSort(){
        this.Children.sort(this.ChildrenComparator);
    }
     
    /**
     * 子节点排序比较器
     * 
     * @param {*} a 
     * @param {*} b 
     */
    ChildrenComparator(a, b) {
        let ARate = a.GetRate();
        let BRate = b.GetRate();

        if (Math.abs(ARate - BRate)>=1e-8) {
            if (ARate > BRate) return 1;
            if (BRate < ARate) return -1;
        }

        if (a.Evaluation > b.Evaluation) return -1;
        if (a.Evaluation < b.Evaluation) return 1;

        if (a.Total > b.Total) return -1;
        if (a.Total < b.Total) return 1;

        return Math.random()>.5 ? -1 : 1;
    }

    ChildrenSortWithUCT(Depth){
        this.Children.sort( this.ChildrenWithUCTComparator );
    }

    ChildrenWithUCTComparator(a,b){
        let AValue = a.Win/a.Total + 1.4142135623730950488016887242097 * Math.sqrt( Math.log2(a.ControlPlayer.StatusRoot.Total) / a.Total )
        let BValue = b.Win/b.Total + 1.4142135623730950488016887242097 * Math.sqrt( Math.log2(b.ControlPlayer.StatusRoot.Total) / b.Total )

        if (Math.abs(AValue - BValue)>=1e-8) {
            if (AValue > BValue) return 1;
            if (AValue < BValue) return -1;
        }

        if (a.Evaluation > b.Evaluation) return -1;
        if (a.Evaluation < b.Evaluation) return 1;

        return Math.random()>.5 ? -1 : 1;
    }

    /**
     * 更新状态
     */
    Update(){
        this.Win=0;
        this.Total=0;

        if (this.Children.length>0) {

            this.ChildrenSort();

            for (let i of this.Children) {
                this.Total+= i.Total;
                //this.Win+= i.Win;
            }

            this.Win = this.Children[this.Children.length-1].Win/this.Children[this.Children.length-1].Total * this.Total;

        } else {
            this.Total=1;
            let Simulation = this.Status;
            if ( (Simulation.GameStatus==0) || (Simulation.GameStatus==1) ) {
                /// 游戏未结束
                this.Evaluation = Simulation.Players[this.Identity].Evaluation(Simulation);
                //this.Win = this.Evaluation / 2216 + 0.5;
                this.Win = 1 / (1 + Math.exp(-this.Evaluation / 150) );
                if (this.Win < 0) this.Win = 0;
                if (this.Win > 1) this.Win = 1;
                
            } else {
                /// 游戏已结束
                if (Simulation.GameStatus == 8) {
                    this.Win=0.5;
                } else if ((Simulation.GameStatus == 9) && (this.Identity==0)) {
                    this.Win=1;
                } else if ((Simulation.GameStatus == 10) && (this.Identity==1)) {
                    this.Win=1;
                } else if ((Simulation.GameStatus == 9) && (this.Identity==1)) {
                    this.Win=0;
                } else if ((Simulation.GameStatus == 10) && (this.Identity==0)) {
                    this.Win=0;
                } else {
                    this.Win=0.5;
                    //throw new Error("WDNMD");
                }
            }
        }

    }
    
}