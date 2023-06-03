let arrScrut = [];
let ScrutinyGeneration = {
	scrutinys: [],
	add(window, tab, name, name2, chance){
		arrScrut.push({
			win: window,
			tab: tab,
			name: name,
			name2: name2,
			chance: chance
		});
	},
	del(window, tab, name){
		for(let i in arrScrut){
			let obj = arrScrut[i];
			if(obj.win==window && obj.tab==tab && obj.name == name){
				arrScrut.slice(i, i);
				return;
			}
		}
	},
	get(random){
		random = random || new java.util.Random();
		while(true){
			for(let i in arrScrut){
				let obj = arrScrut[i];
				if(random.nextFloat() <= obj.chance)
					return obj;
			}
		}
	}
};
