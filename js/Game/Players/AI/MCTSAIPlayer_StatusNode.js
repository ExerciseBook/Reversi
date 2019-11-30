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
     * 普通的构造函数
     */
    constructor(Status,Identity){
        this.Status = Status;
        this.Identity = Identity;
    }

    /**
     * 本结点的置信度
     */
    GetRate(){
        if (this.Total == 0) return 0;
        return this.Win / this.Total;
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
        let LHS = a.Win * b.Total;
        let RHS = a.Total * b.Win;

        if (LHS > RHS) return 1;
        if (LHS < RHS) return -1;
        return Math.random()>.5 ? -1 : 1;
    }

    /**
     * 更新状态
     */
    Update(){
        this.Win=0;
        this.Total=0;

        if (this.Children.length>0) {
            for (let i of this.Children){
                this.Win+=i.Win;
                this.Total+=i.Total;
            };            
        } else {
            this.Total=1;
            let Simulation = this.Status;
            if ( (Simulation.GameStatus==0) || (Simulation.GameStatus==1) ) {
                /// 游戏未结束
                let Value = Simulation.Players[this.Identity].Evaluation(Simulation);
                if (Value > 0) {
                    this.Win+=1;
                } else if (Value == 0) {
                    this.Win+=0.5;
                }
            } else {
                /// 游戏已结束
                if (Simulation.GameStatus == 8) {
                    this.Win+=0.5 
                } else if ((Simulation.GameStatus == 9) && (this.Identity==0)) {
                    this.Win+=1
                } else if ((Simulation.GameStatus == 10) && (this.Identity==1)) {
                    this.Win+=1
                } else {
                    //throw new Error("WDNMD");
                }
            }
        }
        /*
        this.Win=0;
        this.Total=this.Children.length;
        for (let i of this.Children){
            let Simulation = i.Status;
            if ( (Simulation.GameStatus==0) || (Simulation.GameStatus==1) ) {
                /// 游戏未结束
                let Value = Simulation.Players[this.Identity].Evaluation(Simulation);
                if (Value > 0) {
                    this.Win+=1;
                } else if (Value == 0) {
                    this.Win+=0.5;
                }
            } else {
                /// 游戏已结束
                if (Simulation.GameStatus == 10) {
                    this.Win+=0.5 
                } else if ((Simulation.GameStatus & 1) == this.Identity) {
                    this.Win+=1
                }
            }
        }
        */
    }
    
}