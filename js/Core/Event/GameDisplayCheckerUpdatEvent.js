/**
 * 事件参数 游戏结束事件
 */
class GameDisplayCheckerUpdatEvent extends Event{
    /**
     * 构造函数
     */
    constructor(){
        super();
    }

    /**
     * 更新前的棋盘
     */
    OldCheckerBoard=[[],[],[],[],[],[],[],[]];

    /**
     * 更新后的棋盘
     */
    NewCheckerBoard=[[],[],[],[],[],[],[],[]];;

    /**
     * 玩家池
     * 
     * Player[0] 黑方玩家
     * 
     * Player[1] 白方玩家
     */
    Players=[];


}