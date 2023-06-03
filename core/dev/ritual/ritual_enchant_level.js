RitualAPI.register("enchant_level", {
	stru: "aw_ritual_enchant_level",
	enable: false 
}, {
	getResult(tile, coords, result, player, region){
		let item = tile.data.item;
		let all = item.extra.getEnchants();
		let keys = Object.keys(all);
		let key = keys[Math.floor(Math.random()*keys.length)];
		item.extra.addEnchant(key, all[key]+1);
		return item;
	},
	isStartRitual(tile, coords, player, region){
		return tile.data.item.extra && tile.data.item.extra.getEnchantCount() > 0;
	},
	getParameters(tile, coords, parameters, player, region){
		parameters = JSON.parse(JSON.stringify(parameters));
		let level = 0;
		let all = tile.data.item.extra ? tile.data.item.extra.getEnchants() : {1: 1};
		for(let key in all)
			level += all[key];
		parameters.aspects = level * level * parameters.aspects;
		return parameters;
	}
});

RitualAPI.add("enchant_level", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal], null, {
	protection: 40,
	aspects: 100
});