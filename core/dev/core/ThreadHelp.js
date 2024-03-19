const Thread = java.lang.Thread;

let ThreadHelp = {
	threads: {},
	startGame: false,
	
	init(){
		this.startGame = true;
		
		for(let name in this.threads){
			let local_name = name;
			let arr = this.threads[name];
			
			let func = arr[0];
			let period = arr[1];
	
			Threading.initThread(name, function(){
				while(ThreadHelp.startGame){
					try{
						func();
						Thread.sleep(period);
					}catch(e){
						Debug.m(local_name+" "+e)
					}
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