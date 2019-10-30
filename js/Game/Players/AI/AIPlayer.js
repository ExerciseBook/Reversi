/**
 * AI 玩家类
 */
class AIPlayer extends Player{

    /**
     * 构造函数
     */
    constructor(){
        super();


    }

    /**
     * 克隆游戏状态
     */
    CloneTheGameControl(GameControl){
        return GameControl.Clone(
                {
                    Players: [
                        new VirtualPlayer(),
                        new VirtualPlayer()
                    ],
                    DisplayControl: new VirtualDisplay()
                }
            );
    }


}