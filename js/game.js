var game = new Vue({
	el: "#game",
	data: {
		show_title: 1,
		show_pop: 0,
		pop_type: "",
		pop_title: "",
		show_game: 0,
		game_player: 1,
        game_round: 1,
        info_talk: "",
		checkerboard: [
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,2,1,0,0,0],
			[0,0,0,1,2,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0]
		]
		
	},
	methods: {
		start_game: function(){
			this.show_pop = 1
			this.show_title = 0
			this.pop_title = "选择难度"
			this.pop_type = "choose_level"
		},
		about_game: function(){
			this.show_pop = 1
			this.show_title = 0
			this.pop_title = "关于游戏"
			this.pop_type = "about"
		},
		menu: function(){
			this.show_pop = 1
			this.show_title = 0
			this.pop_title = "菜单"
			this.pop_type = "game"
		},
		close_pop: function(){
			this.show_pop = 0
			if(this.show_game == 0){
				this.show_title = 1
			}
		},
		return_title: function(){
			this.show_title = 1
			this.show_game = 0
			this.show_pop = 0
		},
		start_level: function(level){
            loadModel();
			this.show_pop = 0
			this.show_title = 0
			this.show_game = 1
			GameControl = new Core()
			PlayerA = new HumanPlayer()
			PlayerB = new MinimaxAIPlayer()
			ADisplay = new GameDisplay()
			GameControl.Initialize(PlayerA,PlayerB,ADisplay)
		},
		place_chess: function(x, y){
			/*
			console.log(x + ' ' + y)
			this.game_player ? this.$set(this.checkerboard[x], y, 2) : this.$set(this.checkerboard[x], y, 1),
			this.game_player = !this.game_player
			*/
			APlayer = GameControl.Players[0]
			APlayer.PlaceChess(x, y)
        },
	},
	created: function(){
		
	}
})