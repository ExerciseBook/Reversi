/**
 * 蒙特卡洛树搜索 状态结点
 */
class MCTSAIPlayer_StatusNode{
    Status = null;

    Children = [];

    Win = 0;

    Total = 0;

    Move = {X:-1 , Y:-1};

    constructor(Status){
        this.Status = Status;
    }

    GetRate(){
        if (this.Total = 0) return 0;
        return this.Win / this.Total;
    }
}