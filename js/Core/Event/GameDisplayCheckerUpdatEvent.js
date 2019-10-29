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
    NewCheckerBoard=[[],[],[],[],[],[],[],[]];

    /**
     * 更新后的棋盘 // 渲染版本
     * 
     * 0 黑棋
     * 
     * 1 白棋
     * 
     * &2 == 2 黑方可落子点
     * 
     * &4 == 4 白方可落子点
     * 
     * &8 == 8 空白点
     */
    NewRenderingCheckerBoard=[[],[],[],[],[],[],[],[]];

    /**
     * 玩家池
     * 
     * Player[0] 黑方玩家
     * 
     * Player[1] 白方玩家
     */
    Players=[];

    /**
     * 得分
     */
    Scores=[];

}