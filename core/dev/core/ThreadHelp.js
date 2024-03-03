const Thread = java.lang.Thread;

let ThreadHelp = {
	threads: {},
	startGame: false,
	
	init(){
		this.startGame = true;
		
		for(let name in this.threads){
			let arr = this.threads[name];
			
			let func = arr[0];
			let period = arr[1];
	
			Threading.initThread(name, function(){
				while(ThreadHelp.startGame){
					func();
					Thread.sleep(period);
				}
			});
		}
	},
	
	registerForGame(name, func, period){
		this.threads[name] = [func, period||1000];
	}
};

Callback.addCallback("ServerLevelLoaded", function(){
	ThreadHelp.init();
});
Callback.addCallback("LevelLeft", function(){
	ThreadHelp.startGame = false;
});