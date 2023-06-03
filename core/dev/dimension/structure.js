let DISTANCE = __config__.get("structure.DISTANCE") || 150;

ItemGenerate.newGenerator("aw_default");
ItemGenerate.addItem("aw_default", ItemID.piece1, .8, {max: 1})
ItemGenerate.addItem("aw_default", ItemID.piece2, .8, {max: 1})
ItemGenerate.addItem("aw_default", ItemID.piece3, .8, {max: 1})
ItemGenerate.addItem("aw_default", ItemID.loreClass1, .02, {max: 1})
ItemGenerate.addItem("aw_default", ItemID.loreClass2, .02, {max: 1})
ItemGenerate.addItem("aw_default", ItemID.loreClass3, .02, {max: 1})
ItemGenerate.addItem("aw_default", VanillaItemID.bone, .9, {max: 3});
ItemGenerate.addItem("aw_default", VanillaItemID.rotten_flesh, 1, {max: 2});
ItemGenerate.addItem("aw_default", 264, .02, {max: 2});
ItemGenerate.addItem("aw_default", 265, 1, {max: 2});
ItemGenerate.addItem("aw_default", 322, .02, {max: 1});
ItemGenerate.addItem("aw_default", 266, .04, {max: 3});
ItemGenerate.addItem("aw_default", ItemID.rune1, .2, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.rune2, .2, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.rune3, .2, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.rune4, .2, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll6, .05, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll4, .05, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll9, .05, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll1, .03, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll2, .03, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll3, .03, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll7, .02, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll5, .02, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.piece4, .9, {max: 1});
ItemGenerate.addItem("aw_default", ItemID.tanatos, .01, {max: 1});
ItemGenerate.addItem("aw_default", ItemID.RobeOfTheAzureWizard, .01, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.necromancer_helmet, .005, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.necromancer_chestplate, .005, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.necromancer_leggings, .005, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.necromancer_boots, .005, {max: 1}, 0);

ModAPI.addAPICallback("ICore", function(){
	ItemGenerate.addItem("aw_default", ItemID.iridiumChunk, .05, {min: 2, max: 5});
	ItemGenerate.addItem("aw_default", ItemID.ingotCopper, .6, {min: 1, max: 2});
	ItemGenerate.addItem("aw_default", ItemID.ingotTin, .5, {min: 1, max: 2});
});
	
ItemGenerate.setPrototype("aw_default", {
	generate(pos, rand, slot, item, region, random, packet){
		if(item.id == ItemID.piece4){
			let obj = ScrutinyGeneration.get(random);
			let extra = new ItemExtraData();
			extra.putString("window", obj.win);
			extra.putString("tab", obj.tab);
			extra.putString("name", obj.name);
			extra.putString("name2", obj.name2);
			World.getContainer(pos.x, pos.y, pos.z, region).setSlot(slot, item.id, item.count, item.data, extra);
		}
	}
});
	
ItemGenerate.newGenerator("aw_default_2");
ItemGenerate.addItem("aw_default_2", 264, .04, {max: 3});
ItemGenerate.addItem("aw_default_2", 265, 1, {max: 3});
ItemGenerate.addItem("aw_default_2", 322, .03, {max: 2});
ItemGenerate.addItem("aw_default_2", ItemID.SpellSet31, .3, {max: 1});
ItemGenerate.addItem("aw_default_2", 266, .25, {max: 3});
ItemGenerate.addItem("aw_default_2", ItemID.acolyteStaff, .4, {max: 1});
ItemGenerate.addItem("aw_default_2", VanillaItemID.bone, .9, {max: 1, slotMax: 3});
ItemGenerate.addItem("aw_default_2", VanillaItemID.rotten_flesh, 1, {max: 1, slotMax: 3});
ItemGenerate.addItem("aw_default_2", ItemID.regularBag, .3, {max: 3});
ItemGenerate.addItem("aw_default_2", ItemID.magic_crystal, .3, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_glasses, .01, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.rune_absorption, 0.1, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.rune_greed, .01, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_potions_book, .5, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_bottle_potion, .1, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.decor10, .1, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_magic_stick, .05, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_magic_shovel, .05, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_magic_staff, .05, {max: 1});

//if(this["CustomEnchant"]){
	ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .2, {max: 1}, 0, (function(){
		let extra = new ItemExtraData();
extra.addEnchant(aspects_restoration.id, 1);
return extra;
	})());
	
	ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .1, {max: 1}, 0, (function(){
		let extra = new ItemExtraData();
		extra.addEnchant(aspects_restoration.id, 2);
		return extra;
	})());
ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .05, {max: 1}, 0, (function(){
	let extra = new ItemExtraData();
	extra.addEnchant(magic_protection.id, 2);
	return extra;
})());
ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .05, {max: 1}, 0, (function(){
	let extra = new ItemExtraData();
	extra.addEnchant(magic_protection.id, 1);
	return extra;
})());
ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .05, {max: 1}, 0, (function(){
	let extra = new ItemExtraData();
	extra.addEnchant(dead_protection.id, 2);
	return extra;
})());
ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .05, {max: 1}, 0, (function(){
	let extra = new ItemExtraData();
	extra.addEnchant(dead_protection.id, 1);
	return extra;
})());
//}

const EVENT_SPAWN_POTION = [ItemID.aw_brain, VanillaItemID.gunpowder];
const INGREDIENT_SPAWN_POTION = [ItemID.enchantment_forest_flower, VanillaItemID.rabbit_foot, VanillaItemID.sugar, VanillaItemID.blaze_powder, VanillaItemID.spider_eye, VanillaItemID.spider_eye, VanillaItemID.spider_eye];
const UPDATE_SPAWN_POTION = [VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, ItemID.aw_petal_powder, ItemID.aw_petal_powder, 0, 0, 0, ItemID.aw_dragon_powder];

ItemGenerate.setPrototype("aw_default_2", {
	generate(pos, rand, slot, item, region, random, packet){
		if(item.id == ItemID.aw_bottle_potion){
			let items = [{id: EVENT_SPAWN_POTION[randInt(0, EVENT_SPAWN_POTION.length)], count: 1, data: 0}, {id: INGREDIENT_SPAWN_POTION[randInt(0, INGREDIENT_SPAWN_POTION.length)], count: 1, data: 0}];
			let update = UPDATE_SPAWN_POTION[randInt(0, UPDATE_SPAWN_POTION.length)];
			if(update != 0) items.push({id: update, count: 1, data: 0});
			let extra = Wands.getExtraByArr(items);
			let color = Potion.mathColorPotion(items);
			extra.putInt("R", color.r < 0 ? 0 : color.r);
			extra.putInt("G", color.g < 0 ? 0 : color.g);
			extra.putInt("B", color.b < 0 ? 0 : color.b);
			extra.putString("RGB", extra.getInt("R", 0)+"."+extra.getInt("G", 0)+"."+extra.getInt("B", 0));
			World.getContainer(pos.x, pos.y, pos.z, region).setSlot(slot, item.id, item.count, item.data, extra);
		}
	}
});

ModAPI.addAPICallback("ICore", function(){
	ItemGenerate.addItem("aw_default_2", ItemID.iridiumChunk, .05, {min: 2, max: 5});
	ItemGenerate.addItem("aw_default_2", ItemID.ingotCopper, .6, {min: 1, max: 2});
	ItemGenerate.addItem("aw_default_2", ItemID.ingotTin, .5, {min: 1, max: 2});
});


Callback.addCallback("StructureLoadOne", function(){
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_cursed_tower",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.Cursed_Tower"),
		structure: new Structure.advanced("aw_cursed_tower").setPrototype({
			after(x, y, z, region, packet){
				if(region.getBlockId(x, y+13, z) == VanillaBlockID.mob_spawner){
  				let tag = region.getBlockEntity(x, y+13, z).getCompoundTag();
    			tag.putString("EntityIdentifier", "minecraft:skeleton");
    			region.getBlockEntity(x, y+13, z).setCompoundTag(tag);
				}
        ItemGenerate.fill("aw_default_2", x-2, y+1, z+2, packet.random, region);
        ItemGenerate.fill("aw_default_2", x+2, y+1, z+2, packet.random, region);
        ItemGenerate.fill("aw_default_2", x-2, y+1, z-2, packet.random, region);
        ItemGenerate.fill("aw_default_2", x+2, y+1, z-2, packet.random, region);
        ItemGenerate.fill("aw_default_2", x, y+1, z, packet.random, region);
        
        ItemGenerate.fill("aw_default", x-3, y+10, z, packet.random, region);
        ItemGenerate.fill("aw_default", x+3, y+10, z, packet.random, region);
        ItemGenerate.fill("aw_default", x, y+10, z+3, packet.random, region);
        ItemGenerate.fill("aw_default", x, y+10, z-3, packet.random, region);
        region.setBlock(x, y-1, z, VanillaBlockID.tnt);
        region.setBlock(x, y-2, z, VanillaBlockID.tnt);
        region.setBlock(x, y-3, z, VanillaBlockID.tnt);
			}
		})
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_magic_temple",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.magic_temple"),
		structure: new Structure.advanced("aw_magic_temple").setPrototype({
			after(x, y, z, region, packet){
				ItemGenerate.fill("aw_default_2", x, y+1, z, packet.random, region);
			}
		})
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_house_of_magicians",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.House_of_magicians"),
		structure: new Structure.advanced("aw_house_of_magicians")
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_temple",
		distance: DISTANCE,
		isSet: false,
		chance: __config__.getNumber("structure.Temple"),
		structure: new Structure.advanced("aw_temple").setPrototype({
			after(x, y, z, region, packet){
				ItemGenerate.fill("aw_default", x, y+1, z, packet.random, region);
			}
		})
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_tower_of_evil",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.Tower_of_evil"),
		structure: new Structure.advanced("aw_tower_of_evil").setPrototype({
			after(x, y, z, region, packet){
				ItemGenerate.fill("aw_default", x, y+1, z, packet.random, region);
			}
		})
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_ordinary_temple",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.Ordinary_temple"),
	
		structure: new Structure.advanced("aw_ordinary_temple").setPrototype({
			after(x, y, z, region, packet){
				ItemGenerate.fill("aw_default", x, y+2, z-1, packet.random, region);
				ItemGenerate.fill("aw_default", x, y+2, z, packet.random, region);
				ItemGenerate.fill("aw_default", x+1, y+2, z, packet.random, region);
				ItemGenerate.fill("aw_default", x+1, y+2, z-1, packet.random, region);
			}
		})
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_ordinary_temple",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.Tower_of_darkness"),
		structure: new Structure.advanced("aw_tower_of_darkness").setPrototype({
			after(x, y, z, region, packet){
				ItemGenerate.fill("aw_default", x, y, z-1, packet.random, region);
				ItemGenerate.fill("aw_default", x, y, z+1, packet.random, region);
				ItemGenerate.fill("aw_default", x+1, y, z, packet.random, region);
				ItemGenerate.fill("aw_default", x-1, y, z, packet.random, region);
			}
		})
	}))
});
	
ItemGenerate.registerRecipeViewer("aw_default")
ItemGenerate.registerRecipeViewer("aw_default_2")
/*
a very outdated piece of code



let Fortress1 = new DungeonAPI("fortress/1.json");
Fortress1.setPrototype({
    isSetBlock: function(x, y, z, id, data, identifier, packet, dimension){
        if(id == 98){
            switch(packet.random.nextInt(3)){
		            	case 0:
			            	World.setBlock(x, y, z, 98, 0);
			           break;
		          		case 1:
			            	World.setBlock(x, y, z, 98, 1);
		          	 break;
	          			case 2:
			          		World.setBlock(x, y, z, 98, 2);
			           break;
			       }
        }else{
            return true;
        }
    }
});
let Fortress2 = new DungeonAPI("fortress/2.json");
Fortress2.setPrototype({
    isSetBlock: function(x, y, z, id, data, identifier, packet, dimension){
        if(id == 98){
            switch(packet.random.nextInt(3)){
		            	case 0:
			            	World.setBlock(x, y, z, 98, 0);
			           break;
		          		case 1:
			            	World.setBlock(x, y, z, 98, 1);
		          	 break;
	          			case 2:
			          		World.setBlock(x, y, z, 98, 2);
			           break;
			       }
        }else{
            return true;
        }
    }, 
    after: function(x, y, z, rotation, packet, dimension){
        if(World.getBlockID(x-6, y+4, z)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x-6, y, z, 0, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x-12, y, z, 0,  dimension, packet);
                 }else{
                     Fortress3.setStructure(x-12, y, z, 0,  dimension, packet);
                     ItemGenerate.fillChestSit(x-12, y+1, z, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x+6, y+4, z)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x+6, y, z, 0, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x+12, y, z, 0,  dimension, packet);
                 }else{
                     Fortress3.setStructure(x+12, y, z, 0,  dimension, packet);
                     ItemGenerate.fillChestSit(x+12, y+1, z, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x, y+4, z+6)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x, y, z+6, 3, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y, z+12, 0,  dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y, z+12, 0,  dimension, packet);
                     ItemGenerate.fillChestSit(x, y+1, z+12, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x, y+4, z-6)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x, y, z-6, 3, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y, z-12, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y, z-12, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x, y+1, z-12, packet.random, dimension);
                 }
            }
        }
    }
});
let Fortress3 = new DungeonAPI("fortress/3.json");
Fortress3.setPrototype({
    isSetBlock: function(x, y, z, id, data, identifier, packet, dimension){
        if(id == 98){
            switch(packet.random.nextInt(3)){
		            	case 0:
			            	World.setBlock(x, y, z, 98, 0);
			           break;
		          		case 1:
			            	World.setBlock(x, y, z, 98, 1);
		          	 break;
	          			case 2:
			          		World.setBlock(x, y, z, 98, 2);
			           break;
			       }
        }else{
            return true;
        }
    }, 
    after: function(x, y, z, rotation, packet, dimension){
        if(World.getBlockID(x-6, y+4, z)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x-6, y, z, 0, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x-12, y, z, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x-12, y, z, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x-12, y+1, z, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x+6, y+4, z)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x+6, y, z, 0, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x+12, y, z, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x+12, y, z, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x+12, y+1, z, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x, y+4, z+6)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x, y, z+6, 3, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y, z+12, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y, z+12, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x, y+1, z+12, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x, y+4, z-6)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x, y, z-6, 3, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y, z-12, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y, z-12, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x, y+1, z-12, packet.random, dimension);
                 }
            }
        }
    }
});
let Fortress0 = new DungeonAPI("fortress/0.json");
Fortress0.setPrototype({
    isSetBlock: function(x, y, z, id, data, identifier, packet, dimension){
        if(id == 98){
            switch(packet.random.nextInt(3)){
		            	case 0:
			            	World.setBlock(x, y, z, 98, 0);
			           break;
		          		case 1:
			            	World.setBlock(x, y, z, 98, 1);
		          	 break;
	          			case 2:
			          		World.setBlock(x, y, z, 98, 2);
			           break;
			       }
        }else{
            return true;
        }
    }, 
    after: function(x, y, z, rotation, packet, dimension){
        if(packet.random.nextInt(1)<=1){
            Fortress1.setStructure(x+6, y-8, z, 0, dimension, packet);
             if(packet.random.nextInt(1)<=1){
                 if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x+12, y-8, z, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x+12, y-8, z, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x+12, y-7, z, packet.random, dimension);
                 }
             }
        }
        if(packet.random.nextInt(100)<=40){
            Fortress1.setStructure(x-6, y-8, z, 0, dimension, packet);
            if(packet.random.nextInt(100)<=30){
                 if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x-12, y-8, z, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x-12, y-8, z, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x-12, y-7, z, packet.random, dimension);
                 }
            }
        }
        if(packet.random.nextInt(100)<=50){
            Fortress1.setStructure(x, y-8, z+6, 1, dimension, packet);
            if(packet.random.nextInt(100)<=40){
                 if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y-8, z-12, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y-8, z-12, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x, y-7, z-12, packet.random, dimension);
                 }
            }
        }
        if(packet.random.nextInt(100)<=50){
            Fortress1.setStructure(x, y-8, z-6, 1, dimension, packet);
            if(packet.random.nextInt(100)<=40){
                 if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y-8, z+12, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y-8, z+12, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x, y-7, z+12, packet.random, dimension);
                 }
            }
        }
    }
});
Callback.addCallback("GenerateChunk", function(chunkX, chunkZ, random, id){
    if(random.nextInt(__config__.getNumber("structure.fortress")) < 1){
        let coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(16), 96, chunkZ*16 + random.nextInt(16));
        Fortress0.setStructure(coords.x, coords.y, coords.z, 0, id, {random: random, rooms: random.nextInt(10)+10});
    } 
});*/


ItemGenerate.setItemIntegration(ItemID.RobeOfTheAzureWizard, .005, {max: 1}, 0);
ItemGenerate.setItemIntegration(ItemID.tanatos, .005, {max: 1}, 0);
ItemGenerate.setItemIntegration(ItemID.loreClass1, .01, {max: 1});
ItemGenerate.setItemIntegration(ItemID.loreClass2, .01, {max: 1});
ItemGenerate.setItemIntegration(ItemID.loreClass3, .01, {max: 1});
ItemGenerate.setItemIntegration(ItemID.magic_crystal, .1, {max: 1});

