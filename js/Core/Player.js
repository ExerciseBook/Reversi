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
     */
    PlaceChess(x,y){
        return this.GameControl.PlaceChess(this,x,y);
    }

    /**
     * 事件 游戏开始
     * 
     * @param {Event} e 
     */
    Event_GameStart(e){
    } 

    /**
     * 事件 轮到我落子
     * 
     * @param {Event} e 
     */
    Event_Round(e){
    }
    
    /**
     * 事件 游戏结束
     * 
     * @param {Event} e 
     */
    Event_GameEnd(e){
    }
}