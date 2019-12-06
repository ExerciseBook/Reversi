/**
 * 虚拟渲染模块
 */
class VirtualDisplay extends Display{

    /**
     * 构造函数
     */
    constructor(){
        super();
    }

    /**
     * 本方法会在棋盘更新时被触发
     */
    CheckerBoardUpdate(e){
    }

    /**
     * 事件 游戏开始
     * 
     * 在游戏开始的时候本事件会被触发
     * 
     * 可在此处编写显示初始化需要执行的内容
     * 
     * @param {Event} e 
     */
    Event_GameStart(e){
    }

    /**
     * 事件 游戏回合
     * 
     * 在游戏轮到新的玩家下棋的时候本事件会被触发
     * 
     * 可以在此处添加渲染提示标语的代码
     * 
     * @param {Event} e 
     */
    Event_Round(e){
    }
    
    /**
     * 事件 游戏结束
     * 
     * 在游戏结束的时候本事件会被触发
     * 
     * @param {Event} e 
     */
    Event_GameEnd(e){
    }

    
}