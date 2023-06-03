ModAPI.addAPICallback("AncientWondersAPI", function(){
RitualAPI.registerEffectType("default", function(packet){
	let pos = {
		x: packet.coords.x,
		y: packet.coords.y,
		z: packet.coords.z 
	};
	pos.y+=1.5;
	pos.z+=.5;
	pos.x+=.5;
	let group = new ParticlesCore.Group();
	for(let c = 0;c<=1;c++){
		let step = 360 / 60+(Math.floor(Math.random()*10));
		for(i = 0;i < 360;i+=step){
    	let x = pos.x + .5 * Math.cos(i);
      let z = pos.z - .5 * Math.sin(i);
      let y = pos.y + Math.random() / 8;
      let vector = {
      	x: -(pos.x - x) / 3,
        y: -(pos.y - y) / 3,
      	z: -(pos.z - z) / 3
    	};
       group.add(ParticlesAPI.part1Colision, x, y, z, vector.x, vector.y, vector.z);
  	}
	}
	group.send(Entity.getDimension(packet.player));
});
RitualAPI.registerEffectType("default_2", function(packet){
	BlockSource.getDefaultForActor(packet.player).spawnEntity(packet.coords.x, packet.coords.y+1, packet.coords.z, "minecraft:lightning_bolt")
});
RitualAPI.addRecipe("ritual_1", "aw_magic_ingot", [VanillaItemID.iron_ingot, VanillaItemID.iron_ingot, ItemID.magic_crystal, ItemID.rune4], {
	id: ItemID.aw_magic_ingot,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 10,
	protection: 10
});
RitualAPI.addRecipe("ritual_1", "rune_life", [ItemID.rune4, ItemID.rune4, ItemID.magic_plate, ItemID.rune4], {
	id: ItemID.rune_life,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 10
});
RitualAPI.addRecipe("ritual_1", "rune_dead", [ItemID.rune5, ItemID.rune5, ItemID.magic_plate, ItemID.rune5], {
	id: ItemID.rune_dead,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	necromancer: 10
});
RitualAPI.addRecipe("ritual_1", "sroll42", [ItemID.aw_magic_ingot, ItemID.rune_greed, ItemID.magic_crystal, ItemID.rune_absorption], {
	id: ItemID.sroll42,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 10,
	protection: 20
});
RitualAPI.addRecipe("ritual_1", "enchanted_stone", [VanillaBlockID.stone, VanillaBlockID.stone, ItemID.aw_petal_powder, ItemID.aw_petal_powder], {
	id: BlockID.aw_enchanted_stone,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 10
});
RitualAPI.addRecipe("ritual_1", "aw_dragon_powder", [ItemID.aw_petal_powder, ItemID.aw_petal_powder, ItemID.dead_essence, ItemID.rune5], {
	id: ItemID.aw_dragon_powder,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 250,
	magic: 15,
	necromancer: 5,
	protection: 5
});
RitualAPI.addRecipe("ritual_2", "magic_crusher", [BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.rune_absorption, ItemID.rune_greed, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot], {
	id: BlockID.magic_crusher,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 5,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "magic_smithy", [ItemID.aw_magic_ingot, ItemID.aw_magic_ingot, 98, 98, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot], {
	id: BlockID.magic_smithy,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 400,
	magic: 15,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "fire_king", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, 298], {
	id: ItemID.fire_king,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 15,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "fire_king_chestplate", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, 299], {
	id: ItemID.fire_king_chestplate,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 15,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "fire_king_leggings", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, 300], {
	id: ItemID.fire_king_leggings,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 15,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "fire_king_boots", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, 301], {
	id: ItemID.fire_king_boots,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 15,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "bandit_helmet", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, 298], {
	id: ItemID.bandit_helmet,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 10,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "bandit_chestplate", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, 299], {
	id: ItemID.bandit_chestplate,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 10,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "bandit_leggings", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, 300], {
	id: ItemID.bandit_leggings,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 10,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "bandit_boots", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, 301], {
	id: ItemID.bandit_boots,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 10,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "magicController", [ItemID.rune1, ItemID.rune2, ItemID.rune3, ItemID.rune4, ItemID.magic_plate, ItemID.magic_plate, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot], {
	id: BlockID.magicController,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "aw_mysterious_powder", [ItemID.rune1, ItemID.rune2, ItemID.rune3, ItemID.rune4], {
	id: ItemID.aw_mysterious_powder,
	data: 0,
	count: 1,
	extra: null
}, {
	magic: 15
}, ["default_2", "default"]);
RitualAPI.addRecipe("ritual_1", "staff_singularity", [VanillaItemID.stick, ItemID.aw_mysterious_powder, ItemID.magic_crystal, VanillaItemID.iron_ingot], {
	id: ItemID.staff_singularity,
	data: 0,
	count: 1,
	extra: null
}, {
	magic: 10,
	necromancer: 5
},["default_2", "default_2", "default"]);
RitualAPI.addRecipe("ritual_2", "rune6", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2], {
	id: ItemID.rune6,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "cauldronAw", [ItemID.aw_mysterious_powder, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, ItemID.magic_plate, VanillaItemID.iron_ingot, VanillaItemID.iron_ingot, VanillaItemID.iron_ingot], {
	id: BlockID.cauldronAw,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 350,
	magic: 10,
	protection: 5,
	necromancer: 3
});
RitualAPI.addRecipe("ritual_2", "ancient_bottom_obelisk", [ItemID.rune1, ItemID.rune2, ItemID.rune3, ItemID.rune4, VanillaBlockID.stone, VanillaBlockID.stone, VanillaBlockID.stonebrick, VanillaBlockID.stonebrick], {
	id: BlockID.ancient_bottom_obelisk,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 8,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "rune5", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1], {
	id: ItemID.rune5,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 300,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll10", [ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.sroll4, ItemID.sroll4, ItemID.sroll4, ItemID.sroll4], {
	id: ItemID.sroll10,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll11", [ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.sroll10, ItemID.sroll10, ItemID.sroll10, ItemID.sroll10], {
	id: ItemID.sroll11,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll8", [ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.sroll11, ItemID.sroll11, ItemID.sroll11, ItemID.sroll11], {
	id: ItemID.sroll8,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20
});
/*RitualAPI.addRecipe("ritual_2", "sroll14", [ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.sroll9, ItemID.sroll9, ItemID.sroll9, ItemID.sroll9], {
	id: ItemID.sroll14,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20
});*/
RitualAPI.addRecipe("ritual_2", "sroll12", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.sroll6, ItemID.sroll6, ItemID.sroll6, ItemID.sroll6], {
	id: ItemID.sroll12,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll13", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.sroll12, ItemID.sroll12, ItemID.sroll12, ItemID.sroll12], {
	id: ItemID.sroll13,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 10
});
RitualAPI.addRecipe("ritual_2", "sroll18", [ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.sroll4, ItemID.sroll4, ItemID.sroll4, ItemID.sroll4], {
	id: ItemID.sroll18,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 15
});
RitualAPI.addRecipe("ritual_2", "sroll19", [ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.sroll6, ItemID.sroll6, ItemID.sroll6, ItemID.sroll6], {
	id: ItemID.sroll19,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll22", [ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.sroll8, ItemID.sroll8, ItemID.sroll8, ItemID.sroll8], {
	id: ItemID.sroll22,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 300,
	magic: 15
});
RitualAPI.addRecipe("ritual_2", "sroll21", [ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.sroll10, ItemID.sroll10, ItemID.sroll10, ItemID.sroll10], {
	id: ItemID.sroll21,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 300,
	magic: 15
});
RitualAPI.addRecipe("ritual_2", "sroll23", [ItemID.sroll4, ItemID.sroll4, ItemID.sroll4, ItemID.sroll4, ItemID.sroll8, ItemID.sroll8, ItemID.sroll8, ItemID.sroll8], {
	id: ItemID.sroll23,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 300,
	magic: 15
});
RitualAPI.addRecipe("ritual_2", "sroll24", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4], {
	id: ItemID.sroll24,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 2000,
	magic: 20,
	necromancer: 10
});
RitualAPI.addRecipe("ritual_2", "sroll24", [46, 46, 46, 46, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3], {
	id: ItemID.sroll26,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "sroll29", [VanillaItemID.diamond, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, ItemID.rune4, ItemID.rune4, VanillaItemID.redstone, 266, 266], {
	id: ItemID.sroll29,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 10
});
RitualAPI.addRecipe("ritual_2", "sroll32", [VanillaBlockID.magma, VanillaBlockID.magma, VanillaBlockID.magma, VanillaBlockID.magma, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5], {
	id: ItemID.sroll32,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll33", [ItemID.sroll33, , VanillaBlockID.magma, ItemID.sroll32, VanillaBlockID.magma, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5], {
	id: ItemID.sroll33,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll34", [VanillaBlockID.magma, VanillaBlockID.magma, VanillaBlockID.magma, VanillaBlockID.magma, ItemID.sroll33, ItemID.sroll33, ItemID.rune5, ItemID.rune5], {
	id: ItemID.sroll34,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 2000,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll35", [ItemID.sroll34, ItemID.sroll34, ItemID.sroll33, ItemID.sroll33, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5], {
	id: ItemID.sroll35,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 2000,
	magic: 20,
	protection: 30
});

RitualAPI.addRecipe("ritual_2", "sroll45", [ItemID.aw_petal_powder, ItemID.aw_petal_powder, ItemID.aw_petal_powder, ItemID.aw_petal_powder, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_greed, ItemID.rune_greed], {
	id: ItemID.sroll45,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 10,
	protection: 5
});
RitualAPI.addRecipe("ritual_2", "sroll46", [ItemID.sroll45, ItemID.sroll45, ItemID.magic_plate, ItemID.magic_plate, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_greed, ItemID.rune_greed], {
	id: ItemID.sroll46,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 10,
	protection: 5
});

RitualAPI.addRecipe("ritual_2", "magis_stick", [ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.stick, VanillaItemID.stick, ItemID.rune3, ItemID.acolyteStaff, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust], {
	id: ItemID.magis_stick,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 20
});

RitualAPI.addRecipe("ritual_2", "magis_sword", [ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.stick, VanillaItemID.stick, ItemID.rune1, ItemID.acolyteStaff, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust], {
	id: ItemID.magis_sword,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	protection: 30
});

RitualAPI.addRecipe("ritual_2", "magis_pocox", [ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.stick, VanillaItemID.stick, ItemID.rune5, ItemID.acolyteStaff, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust], {
	id: ItemID.magis_pocox,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	necromancer: 20
});
RitualAPI.addRecipe("ritual_2", "SpellSet31", [VanillaItemID.paper, VanillaItemID.paper, ItemID.rune1, ItemID.rune2, ItemID.rune3, ItemID.rune4, VanillaItemID.paper, VanillaItemID.paper], {
	id: ItemID.SpellSet31,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll36", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune1], {
	id: ItemID.sroll36,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_2", "sroll37", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune2], {
	id: ItemID.sroll37,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_2", "sroll38", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune3], {
	id: ItemID.sroll38,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_2", "sroll39", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune4], {
	id: ItemID.sroll39,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_2", "clone_scroll", [ItemID.rune_life, ItemID.rune_life, BlockID.aw_magic_stone, BlockID.aw_magic_stone, BlockID.aw_magic_brick, BlockID.aw_magic_brick, BlockID.aw_magic_brick, BlockID.aw_magic_brick], {
	id: BlockID.clone_scroll,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 2000,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll40", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune5], {
	id: ItemID.sroll37,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_2", "sroll41", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune6], {
	id: ItemID.sroll38,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_3", "magis_stick_2_lvl", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, ItemID.magis_stick, VanillaItemID.redstone, VanillaItemID.redstone, ItemID.rune3, ItemID.rune3], {
	id: ItemID.magis_stick_2_lvl,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	protection: 30
});
RitualAPI.addRecipe("ritual_3", "magis_sword_2_lvl", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, ItemID.magis_sword, VanillaItemID.redstone, VanillaItemID.redstone, ItemID.rune1, ItemID.rune1], {
	id: ItemID.magis_sword_2_lvl,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	necromancer: 30
});
RitualAPI.addRecipe("ritual_3", "magis_pocox_2_lvl", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, ItemID.magis_pocox, VanillaItemID.redstone, VanillaItemID.redstone, ItemID.rune5, ItemID.rune5], {
	id: ItemID.magis_pocox_2_lvl,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 30
});
RitualAPI.addRecipe("ritual_3", "diamond", [VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal], {
	id: VanillaItemID.diamond,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 30
});
RitualAPI.addRecipe("ritual_3", "nether_star", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, ItemID.magic_plate, VanillaItemID.diamond, VanillaItemID.diamond, VanillaItemID.diamond, VanillaItemID.diamond, VanillaItemID.diamond, VanillaItemID.diamond], {
	id: VanillaItemID.nether_star,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 30
});
RitualAPI.addRecipe("ritual_3", "bowlWishes", [VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaBlockID.gold_block, VanillaBlockID.gold_block, VanillaBlockID.gold_block, VanillaBlockID.gold_block], {
	id: BlockID.bowlWishes,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 400,
	magic: 30
});

RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_fire", [ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_fire,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});
RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_earth", [ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_earth,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});
RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_wind", [ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_wind,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});
RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_light", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_light,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});
RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_darkness", [ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_darkness,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});
RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_copying", [ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_copying,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});

RitualAPI.addRecipe("ritual_3", "sroll43", [ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: ItemID.sroll43,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 20
});

RitualAPI.addRecipe("ritual_3", "sroll44", [ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: ItemID.sroll44,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 20
});

RitualAPI.addRecipe("ritual_3", "MagicConnector", [ItemID.rune_life, ItemID.rune_dead, ItemID.magic_plate, ItemID.magic_plate, ItemID.magic_plate, ItemID.magic_plate, VanillaBlockID.planks, VanillaBlockID.planks, VanillaBlockID.planks, ItemID.rune5, VanillaBlockID.planks, VanillaBlockID.planks], {
	id: BlockID.MagicConnector,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 20
});

RitualAPI.addRecipe("ritual_3", "decor9", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, ItemID.magic_plate, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot], {
	id: ItemID.decor9,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 5
});

RitualAPI.addRecipe("ritual_1", "sroll47", [ItemID.sroll32, ItemID.sroll33, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot], {
	id: ItemID.sroll47,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 5
});

RitualAPI.addRecipe("ritual_1", "aw_magic_storage", [BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone, ItemID.magic_plate, ItemID.magic_plate], {
	id: BlockID.aw_magic_storage,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 25
});
RitualAPI.addRecipe("ritual_1", "decor8", [ItemID.decor9, ItemID.decor9, ItemID.rune4, ItemID.rune4], {
	id: ItemID.decor8,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 5
});

RitualAPI.addRecipe("ritual_1", "name_tag", [VanillaItemID.book, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper], {
	id: VanillaItemID.name_tag,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 10,
	magic: 5
});
RitualAPI.addRecipe("ritual_1", "decor7", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.glowstone_dust, ItemID.rune1], {
	id: ItemID.decor7,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor6", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.glowstone_dust, ItemID.rune3], {
	id: ItemID.decor6,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor5", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.redstone, ItemID.rune4], {
	id: ItemID.decor5,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor4", [VanillaItemID.redstone, VanillaItemID.diamond, VanillaItemID.redstone, ItemID.rune4], {
	id: ItemID.decor4,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor3", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.glowstone_dust, ItemID.rune4], {
	id: ItemID.decor3,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor2", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.redstone, ItemID.rune5], {
	id: ItemID.decor2,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor1", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.glowstone_dust, ItemID.rune5], {
	id: ItemID.decor1,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "rune2", [1, 1, 1, 1], {
	id: ItemID.rune2,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 10,
	magic: 70
});
RitualAPI.addRecipe("ritual_1", "rune1", [3, 3, 1, 1], {
	id: ItemID.rune1,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 10,
	protection: 70
});
RitualAPI.addRecipe("ritual_1", "rune4", [VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, 1, 1], {
	id: ItemID.rune4,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 10,
	necromancer: 70
});
RitualAPI.addRecipe("ritual_1", "rune3", [VanillaItemID.redstone, VanillaItemID.redstone, 1, 1], {
	id: ItemID.rune3,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 10,
	necromancer: 5,
	magic: 30,
	protection: 30
});
RitualAPI.addRecipe("ritual_1", "acolyteStaff", [ItemID.magic_crystal, VanillaItemID.stick, VanillaItemID.stick, VanillaBlockID.planks], {
	id: ItemID.acolyteStaff,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 10,
});
RitualAPI.addRecipe("ritual_1", "magic_crystal", [VanillaItemID.diamond, VanillaItemID.diamond, 1, 1], {
	id: ItemID.magic_crystal,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5,
	necromancer: 5,
	protection: 5
});
RitualAPI.addRecipe("ritual_1", "magic_plate", [ItemID.magic_crystal, ItemID.magic_crystal, 1, 1], {
	id: ItemID.magic_plate,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 10
});
});
ModAPI.addAPICallback("DungeonUtility",function(){
RitualAPI.register("ritual_1", {
	stru: "aw_ritual_1",
	title: Translation.translate("aw.gui.rv.ritual_1lvl"),
	content: {
		elements: {
			output0: {x: 440, y: 150, size: 120},
			input0: {x: 315, y: 25, size: 100},
      input1: {x: 315, y: 300, size: 100},
      input2: {x: 590, y: 25, size: 100},
      input3: {x: 590, y: 300, size: 100},
		}
	}
});
RitualAPI.register("ritual_2",  {
	stru: "aw_ritual_2",
	title: Translation.translate("aw.gui.rv.ritual_2lvl"),
	content: {
		elements: {
			output0: {x: 440, y: 150, size: 120},
			input0: {x: 315, y: 25, size: 100},
      input1: {x: 315, y: 300, size: 100},
      input2: {x: 590, y: 25, size: 100},
      input3: {x: 590, y: 300, size: 100},
      input4: {x: 440, y: 0, size: 120},
      input5: {x: 440, y: 300, size: 120}, 
      input6: {x: 590, y: 150, size: 120},
      input7: {x: 290, y: 150, size: 120},
		}
	}
});
RitualAPI.register("ritual_3",  {
	stru: "aw_ritual_3",
	title: Translation.translate("aw.gui.rv.ritual_3lvl"),
	content: {
		elements: {
			output0: {x: 440, y: 150, size: 120},
			input0: {x: 315, y: 25, size: 100},
      input1: {x: 315, y: 300, size: 100},
      input2: {x: 590, y: 25, size: 100},
      input3: {x: 590, y: 300, size: 100},
      input4: {x: 440, y: 0, size: 120},
      input5: {x: 440, y: 300, size: 120}, 
      input6: {x: 590, y: 150, size: 120},
      input7: {x: 290, y: 150, size: 120},
      
      input8: {x: 200, y: 25, size: 100},
      input9: {x: 200, y: 300, size: 100},
      input10: {x: 700, y: 25, size: 100},
      input11: {x: 700, y: 300, size: 100},
		}
	}
});
});
