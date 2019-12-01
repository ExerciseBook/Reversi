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
        if (
            ( this.Status.GameStatus==0   && this.Identity==1 ) || 
            ( this.Status.GameStatus==1   && this.Identity==0 ) ||  
            ( this.Status.GameStatus==9   && this.Identity==1 ) ||  
            ( this.Status.GameStatus==10  && this.Identity==0 )
        ) {
            return this.Win / this.Total;
        } else if (
            ( this.Status.GameStatus==0   && this.Identity==0 ) || 
            ( this.Status.GameStatus==1   && this.Identity==1 ) ||  
            ( this.Status.GameStatus==9   && this.Identity==0 ) ||  
            ( this.Status.GameStatus==10  && this.Identity==1 )
        ) {
            return 1-(this.Win / this.Total);
        } else return this.Win / this.Total;
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
        let A = {Win:a.Win, Total:a.Total};
        let B = {Win:b.Win, Total:b.Total};

        if (
            ( a.Status.GameStatus==0   && a.Identity==0 ) || 
            ( a.Status.GameStatus==1   && a.Identity==1 ) ||  
            ( a.Status.GameStatus==9   && a.Identity==0 ) ||  
            ( a.Status.GameStatus==10  && a.Identity==1 )
        ) {
            A.Win = -A.Win;
        };

        if (
            ( b.Status.GameStatus==0   && b.Identity==0 ) || 
            ( b.Status.GameStatus==1   && b.Identity==1 ) ||  
            ( b.Status.GameStatus==9   && b.Identity==0 ) ||  
            ( b.Status.GameStatus==10  && b.Identity==1 )
        ) {
            B.Win = -B.Win;
        };

        let LHS = A.Win * B.Total;
        let RHS = A.Total * B.Win;

        if (LHS > RHS) return -1;
        if (LHS < RHS) return 1;
        return Math.random()>.5 ? -1 : 1;
    }

    /**
     * 更新状态
     */
    Update(){
        this.Win=0;
        this.Total=0;

        if (this.Children.length>0) {
            let InfCount = 0;
            for (let i of this.Children){
                if (i.Win == Infinity) {
                    InfCount++;
                } else if (i.Win == -Infinity) {
                    InfCount--;
                } else {
                    this.Win+=i.Win;
                }
                this.Total+=i.Total;
            };
            if (InfCount*this.Total>0)
                this.Win = this.Win + (2**InfCount)*this.Total*1000;
            else if (InfCount*this.Total<0)
                this.Win = this.Win - (2**(-InfCount))*this.Total*1000;
        } else {
            this.Total=1;
            let Simulation = this.Status;
            if ( (Simulation.GameStatus==0) || (Simulation.GameStatus==1) ) {
                /// 游戏未结束
                this.Win = Simulation.Players[this.Identity].Evaluation(Simulation);
                /*if (this.Win>0) {
                    this.Win = 1;
                } else if (this.Win) {
                    this.Win = 0;
                } else {
                    this.Win = 0.5;
                }*/
            } else {
                /// 游戏已结束
                if (Simulation.GameStatus == 8) {
                    this.Win=0;
                } else if ((Simulation.GameStatus == 9) && (this.Identity==0)) {
                    this.Win=Infinity;
                } else if ((Simulation.GameStatus == 10) && (this.Identity==1)) {
                    this.Win=Infinity;
                } else if ((Simulation.GameStatus == 9) && (this.Identity==1)) {
                    this.Win=-Infinity;
                } else if ((Simulation.GameStatus == 10) && (this.Identity==0)) {
                    this.Win=-Infinity;
                } else {
                    //throw new Error("WDNMD");
                }
            }
        }

    }
    
}