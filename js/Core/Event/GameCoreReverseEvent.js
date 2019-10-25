/**
 * 事件参数 游戏核心 落棋事件
 */
class GameCoreReverseEvent extends Event{
    /**
     * 构造函数
     */
    constructor(){
        super();
        this.Reverses=[];
        this.Player=null;
    }

    /**
     * 被翻转的棋子的清单
     */
    Reverses=[];

    /**
     * 操作玩家
     */
    Player=null;
}