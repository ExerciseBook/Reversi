# 黑白棋

## 文件夹结构
```
├─css
├─docs
├─image
└─js
    ├─Core // 游戏核心部件
    │  │  Core.js // 游戏核心
    │  │  Display.js // 显示组件基类
    │  │  Player.js // 玩家组件基类
    │  │
    │  └─Event // 事件模块
    │          Event.js // 事件组件基类
    │          GameCoreReverseEvent.js // [游戏核心用] 棋子翻转事件
    │          GameDisplayCheckerUpdatEvent.js // [显示组件用] 棋盘更新事件
    │          GameEndEvent.js // [显示组件用] [玩家组件用] 游戏结束事件
    │          GameRoundEvent.js // [显示组件用] [玩家组件用] 游戏回合事件
    │          GameStartEvent.js // [显示组件用] [玩家组件用] 游戏结束事件
    │
    └─Game // 游戏的具体组件实现逻辑
```


## 游戏生命周期
游戏生命周期大概划分为下面几个状态：
1. 游戏初始化并开始
2. 回合模式
3. 游戏结束

以下列初始化代码为例：
```JavaScript
    GameControl = new Core();   // 创建一个游戏核心 // /js/Core/Core.js

    PlayerA = new Player(); // 创建玩家一 // /js/Core/Player.js
    PlayerB = new Player(); // 创建玩家二 // /js/Core/Player.js
    ADisplay = new Display(); // 创建渲染组件 // /js/Core/Display.js
    /// 注： /js/Core/Player.js 和 /js/Core/Display.js 只有函数声明而没有具体的实现代码
    /// 请继承一个新的类并把具体实现代码补充完整
    /// 可见 /js/Game/ 中的例子

    GameControl.Initialize(PlayerA,PlayerB,ADisplay); // 游戏初始化
```



### 游戏初始化并开始
```JavaScript
初始化开始
└───┐
    V
    GameControl.Initialize() // /js/Core/Core.js : Core.Initialize()
    │
    │ 初始化棋盘
    │ 初始化玩家数据
    │ 初始化游戏状态
    │
    └───┐
        V
        ADisplay.CheckerBoardUpdate() 
        │   /// /js/Core/Display.js : Display.CheckerBoardUpdate()
        │   /// 棋盘刷新事件
        │   /// 将初始化结束后的棋盘等其他参数传递给这个函数
    ┌───┘    
    └───┐
        V
        ADisplay.Event_GameStart() 
        │   /// /js/Core/Display.js : Display.Event_GameStart()
        PlayerA.Event_GameStart() 
        │   /// /js/Core/Player.js : Player.Event_GameStart()
        PlayerB.Event_GameStart() 
        │   /// /js/Core/Player.js : Player.Event_GameStart()
        │
        │   /// 游戏开始事件
    ┌───┘    
    └───┐
        V
        ADisplay.Event_Round() 
        │   /// /js/Core/Display.js : Display.Event_Round()
        PlayerA.Event_Round() 
        │   /// /js/Core/Player.js : Player.Event_Round()
        PlayerB.Event_Round() 
        │   /// /js/Core/Player.js : Player.Event_Round()
        │
        │   /// 游戏回合事件
    ┌───┘ 
┌───┘ 
V
初始化结束
```

### 游戏回合
```JavaScript
玩家下棋
└───┐
    V
    APlayer.PlaceChess() // /js/Core/Player.js : Player:PlaceChess() // 某玩家执行下棋操作
    └───┐
        V
        GameControl.PlaceChess() // /js/Core/Core.js : Core:PlaceChess()
        │
        │
        │ 判断落子合法性
        │
        ├───┐
        │   │ ↓ 不合法
        │   │
        │   V
        │   终止处理
        │
        │ ↓ 合法
        │
        │ 执行落子操作
        │ 获取下一回合游戏状态
        │ 
        └───┐
            V
            ADisplay.CheckerBoardUpdate() 
            │   /// /js/Core/Display.js : Display.CheckerBoardUpdate()
            │   /// 棋盘刷新事件
            │   /// 将初始化结束后的棋盘等其他参数传递给这个函数
        ┌───┘  
        │ 
        │ 
        │ 判断下一回合游戏状态
        ├───┐
        │   │ ↓ 游戏继续
        │   │
        │   │
        │   V
        │   ADisplay.Event_Round() 
        │   │   /// /js/Core/Display.js : Display.Event_Round()
        │   PlayerA.Event_Round() 
        │   │   /// /js/Core/Player.js : Player.Event_Round()
        │   PlayerB.Event_Round() 
        │   │   /// /js/Core/Player.js : Player.Event_Round()
        │   │
        │   │   /// 游戏回合事件
        │   │
        │   V
        │   回合结束
        │
        │ 
        └───┐
            │ ↓ 游戏结束
            │
            V
            ADisplay.Event_GameEnd() 
            │   /// /js/Core/Display.js : Display.Event_GameEnd()
            PlayerA.Event_GameEnd() 
            │   /// /js/Core/Player.js : Player.Event_GameEnd()
            PlayerB.Event_GameEnd() 
            │   /// /js/Core/Player.js : Player.Event_GameEnd()
            │
            │   /// 游戏结束事件
        ┌───┘ 
        V
        游戏结束
```