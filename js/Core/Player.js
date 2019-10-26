/**
 * 玩家核心类 | 接口类
 * 
 * 主要负责实现玩家基本功能框架
 */
class Player{
    /**
     * 控制核心
     */
    GameControl;

    /**
     * 0:黑方
     * 1:白方
     * 
     * int Identity
     */
    Identity;

    /**
     * 落子
     * CheckerBoard[x][y]
     * 
     * @param {int} x 第一参数
     * @param {int} y 第二参数
     * 
     * @return {int} 0:正常 -2:落子位置非法 -1:信息非法 -3:游戏状态失效
     */
    PlaceChess(x,y){
        return this.GameControl.PlaceChess(this,x,y);
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