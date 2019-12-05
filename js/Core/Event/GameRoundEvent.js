/**
 * 事件参数 回合事件
 */
class GameRoundEvent extends Event{
    /**
     * 构造函数
     */
    constructor(){
        super();
    }

    /**
     * 轮到哪一方下棋
     */
    Operator;

    /**
     * 上一次是谁下棋
     */
    LastOperator;

    /**
     * 他下的是啥棋
     */
    LastMove= {X:NaN, Y:NaN};
    
}