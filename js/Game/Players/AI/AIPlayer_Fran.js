/**
 * 蕾米莉亚 AI
 */
class AIPlayer_Fran extends MCTSAIPlayer{
    /**
     * 构造函数
     */
    constructor(){
        super();
        
        loadModel('fran21');
    }


}