Potion.setPrototype({
	id: VanillaItemID.rabbit_foot,
	color: {
		r: -20*3,
		g: 10*3,
		b: -15*3
	},
	setFunction(packet){
		Entity.addEffect(packet.entity, Native.PotionEffect.jump, packet.getLevel(), packet.getTime()+160, false, false)
	}
})
Potion.setPrototype({
	id: VanillaItemID.sugar,
	color: {
		r: 30,
		g: 30,
		b: -30
	},
	setFunction(packet){
		Entity.addEffect(packet.entity, Native.PotionEffect.movementSpeed, packet.getLevel(), packet.getTime()+160, false, false)
	}
})
Potion.setPrototype({
	id: VanillaItemID.blaze_powder,
	color: {
		r: 40,
		g: -30,
		b: 10
	},
	setFunction(packet){
		Entity.addEffect(packet.entity, Native.PotionEffect.damageBoost, packet.getLevel(), packet.getTime()+160, false, false)
	}
})
Potion.setPrototype({
	id: VanillaItemID.spider_eye,
	color: {
		r: 40,
		g: -30,
		b: 10
	},
	setFunction(packet){
		Entity.addEffect(packet.entity, Native.PotionEffect.poison, packet.getLevel(), packet.getTime()+160, false, false)
	}
})

Potion.setPrototype({
	id: VanillaItemID.redstone,
	type: "update",
	time: 160,
	level: -1,
	color: {
		r: -16*3,
		g: 12*3,
		b: 3*3
	},
	setFunction(packet){
		
	}
})

Potion.setPrototype({
	id: VanillaItemID.glowstone_dust,
	type: "update",
	level: 2,
	time: -80,
	color: {
		r: 16*3,
		g: -9*3,
		b: -12*3
	},
	setFunction(packet){
		
	}
})