IDRegistry.genItemID("aw_magic_ingot"); 
Item.createItem("aw_magic_ingot", "aw.item.aw_magic_ingot", {name: "aw_magic_ingot", meta: 0}, {stack: 64});

IDRegistry.genItemID("aw_brain"); 
Item.createItem("aw_brain", "aw.item.brain", {name: "aw_brain", meta: 0}, {stack: 16});

IDRegistry.genItemID("spider_legs"); 
Item.createItem("spider_legs", "aw.item.spider_legs", {name: "spider_legs", meta: 0}, {stack: 64});

IDRegistry.genItemID("aw_mysterious_powder"); 
Item.createItem("aw_mysterious_powder", "aw.item.mysterious_powder", {name: "aw_mysterious_powder", meta: 0}, {stack: 64});

IDRegistry.genItemID("witherbone"); 
Item.createItem("witherbone", "aw.item.witherbone", {name: "witherbone", meta: 0}, {stack: 64});

IDRegistry.genItemID("aw_dragon_powder"); 
Item.createItem("aw_dragon_powder", "aw.item.dragon_powder", {name: "aw_dragon_powder", meta: 0}, {stack: 64});

IDRegistry.genItemID("crystal_powder"); 
Item.createItem("crystal_powder", "aw.item.crystal_powder", {name: "crystal_powder", meta: 0}, {stack: 16});

IDRegistry.genItemID("dead_essence"); 
Item.createItem("dead_essence", "aw.item.dead_essence", {name: "dead_essence", meta: 0}, {stack: 16});


IDRegistry.genItemID("magic_crystal"); 
Item.createItem("magic_crystal", "aw.item.magic_crystal", {name: "magic_crystal", meta: 0}, {stack: 4});

IDRegistry.genItemID("magic_plate");
Item.createItem("magic_plate", "aw.item.magic_plate", {name: "magic_plate", meta: 0}, {stack:4});

Callback.addCallback('EntityDeath', function (entity, attacker, damageType) {
    if(Entity.getTypeName(entity) == "minecraft:zombie<>"){
        let pos = Entity.getPosition(entity);
        if(Math.random()<=0.1){
            BlockSource.getDefaultForActor(entity).spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.aw_brain, 1, 0, null);
        }
    }else if(Entity.getTypeName(entity) == "minecraft:spider<>"){
    	let pos = Entity.getPosition(entity);
        if(Math.random()<=0.1){
            BlockSource.getDefaultForActor(entity).spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.spider_legs, 1, 0, null);
        }else if(Math.random()<=0.1){
        	BlockSource.getDefaultForActor(entity).spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.dead_essence, 1, 0, null);
        }
    }
});