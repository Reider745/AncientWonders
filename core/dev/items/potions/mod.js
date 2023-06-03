
Potion.setPrototype({
	id: ItemID.aw_brain,
	type: "event",
	color: {
		r: 9*3,
		g: -15*3,
		b: -12*3
	},
	getEntitys(item, player, i, ingredients){
		return [player];
	}
})
Potion.setPrototype({
	id: VanillaItemID.gunpowder,
	type: "event",
	color: {
		r: 9*3,
		g: -15*3,
		b: -12*3
	},
	getEntitys(item, player, i, ingredients){
		let arr = Entity.getAllInRange(Entity.getPosition(player),3)
		let mobs = []
		for(let e in arr){
			if(Entity.getDimension(player)==Entity.getDimension(arr[e]))
				mobs.push(arr[e])
		}
		return mobs;
	}
})
Potion.setPrototype({
	id: ItemID.aw_mysterious_powder,
	type: "power",
	color: {
		r: 8*3,
		g: 8*3,
		b: 8*3
	}
})
Potion.setPrototype({
	id: ItemID.spider_legs,
	type: "spider_legs",
	level: 1,
	color: {
		r: 40,
		g: -50,
		b: 20
	},
	setFunction(packet){
		
	}
})

Potion.setPrototype({
	id: ItemID.dead_essence,
	color: {
		r: -10,
		g: 40,
		b: 10
	},
	setFunction(packet){
		EffectAPI.add(packet.entity, "dead", packet.getTime()+500, packet.getLevel()+5)
	}
})
Potion.setPrototype({
	id: ItemID.crystal_powder,
	color: {
		r: 20,
		g: -30,
		b: 40
	},
	setFunction(packet){
		EffectAPI.add(packet.entity, "magic", packet.getTime()+500, packet.getLevel()+5)
	}
})

Potion.setPrototype({
	id: ItemID.witherbone,
	color: {//меняем цвет
		r: -80,
		g: -80,
		b: -80
	},
	setFunction(packet){
  EffectAPI.clear(packet.entity, "noy_magic");
		EffectAPI.add(packet.entity, "noy_magic_immunity", packet.getTime()+150, packet.getLevel()+2)
	}
})
Potion.setPrototype({
	id: ItemID.aw_dragon_powder,
	type: "update",
	level: 3,
	time: 1000,
	color: {
		r: -40,
		g: -40,
		b: 60
	},
	setFunction(packet){
		
	}
})
Potion.setPrototype({
	id: ItemID.aw_petal_powder,
	type: "update",
	level: 0,
	time: 400,
	color: {
		r: -10,
		g: 30,
		b: 30
	},
	setFunction(packet){
		
	}
});
Potion.setPrototype({
	id: ItemID.magic_crystal,//id
	color: {//меняем цвет
		r: -10,
		g: -20,
		b: 50
	},
	setFunction(packet){
		EffectAPI.add(packet.entity, "aspects", packet.getTime()+200, packet.getLevel()+2)//выдаём эффект востановление аспектов
	}
})
Potion.setPrototype({
	id: ItemID.enchantment_forest_flower,
	color: {
		r: 25,
		g: -40,
		b: 30
	},
setFunction(packet){
		Entity.addEffect(packet.entity, Native.PotionEffect.invisibility, packet.getLevel()+1, packet.getTime()+800, false, false)
	}
})
