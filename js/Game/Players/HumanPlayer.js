/**
 * 人类玩家类
 */
class HumanPlayer extends Player{

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
        console.log(this.Identity,e);
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
        
        console.log(this.Identity,e);

        if (e.Operator==this) {
            //轮到我下棋
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
        console.log(this.Identity,e);
    }


}