let Potion = {
	mathColorPotion(items){
		let color = {
			r: 0,
			g: 180,
			b: 244
		};
		for(let i in items){
			let prot = this.getPrototype(items[i].id);
			color.r += prot.color.r;
			color.g += prot.color.g;
			color.b += prot.color.b;
		}
		return color;
	},
    potions: {},
    potionsType: {},
    setPrototype(obj){
    	obj.color = obj.color || {};
    	obj.color.r = obj.color.r || 0;
    	obj.color.g = obj.color.g || 0;
    	obj.color.b = obj.color.b || 0;
    	obj.type = obj.type || "ingredient";
    	obj.setFunction = obj.setFunction || function(){}
    	this.potions[obj.id] = obj;
    },
    getPrototype(id){
    	return this.potions[id] || {id:-1};
    },
    registerPotionType(type, obj){
    	this.potionsType[type] = obj;
    },
	run(player, item){
		Entity.setCarriedItem(player, ItemID.aw_bottle_empty, 1, 0);
		let ingredients = Wands.getArrByExtra(item.extra);
		let protEventI;
		for(let i in ingredients){
			let prot = Potion.getPrototype(ingredients[i].id)
			if(prot.type == "event" || i){
				if(prot.type == "event")
					protEventI = i;
				let ents = Potion.getPrototype(ingredients[protEventI].id).getEntitys(item, player, i, ingredients)
				//if(i+1 <= ingredients.length-1){
					//i++;
					for(let e in ents){
						prot = Potion.getPrototype(ingredients[i].id)
						prot.setFunction({
							i: i,
							ingredients: ingredients,
							player: player,
							entity: ents[e],
							potion: item,
							item: ingredients[i],
							getLevel(){
								let count = 0;
								for(let a = i;a < ingredients.length;a++){
									let protUpdate = Potion.getPrototype(ingredients[a].id)
									if(protUpdate.level)
										count+=protUpdate.level;
									if(protUpdate.type == "power")
										a = ingredients.length;
								}
								return count;
							},
							getTime(){
								let count = 0;
								for(let a = i;a < ingredients.length;a++){
									let protUpdate = Potion.getPrototype(ingredients[a].id)
									if(protUpdate.time)
										count+=protUpdate.time;
									if(protUpdate.type == "power")
										a = ingredients.length;
									}
								return count;
							}
						})
				//	}
				}
			}
		}
	},
	isIngredient(item){
		return !!Potion.getPrototype(item.id).type;
	},
	isIngredientInstallation(coords, item, player, arr){
		return Potion.potionsType[Potion.getPrototype(item.id).type].installation(coords, item, player, arr);
	}
};
