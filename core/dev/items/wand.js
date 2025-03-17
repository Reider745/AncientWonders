IDRegistry.genItemID("acolyteStaff"); 
Item.createItem("acolyteStaff", "aw.item.acolyte_staff", {name: "acolyte_staff", meta: 0}, {stack: 1});

IDRegistry.genItemID("magis_stick"); 
Item.createItem("magis_stick", "aw.item.magic_stick", {name: "magis_stick", meta: 0}, {stack: 1});

IDRegistry.genItemID("magis_stick_2_lvl"); 
Item.createItem("magis_stick_2_lvl", "aw.item.magic_stick_2_lvl", {name: "magis_stick_2_lvl", meta: 0}, {stack: 1});

IDRegistry.genItemID("aw_magic_stick"); 
Item.createItem("aw_magic_stick", "aw.item.aw_magic_stick", {name: "magic_stick", meta: 0}, {stack: 1});

IDRegistry.genItemID("magis_sword"); 
Item.createItem("magis_sword", "aw.item.magic_sword", {name: "magis_sword", meta: 0}, {stack: 1});

ToolAPI.addToolMaterial("aw_magic_sword", {
	durability: 2220,
	level: 3,
	efficiency: 0,
	damage: 2,
	enchantability: 14
});
ToolLib.setTool(ItemID.magis_sword, "aw_magic_sword", ToolType.sword);

IDRegistry.genItemID("magis_sword_2_lvl"); 
Item.createItem("magis_sword_2_lvl", "aw.item.magic_sword_2_lvl", {name: "magis_sword_2_lvl", meta: 0}, {stack: 1});

ToolAPI.addToolMaterial("aw_magic_sword_2", {
	durability: 4220,
	level: 5,
	efficiency: 0,
	damage: 5,
	enchantability: 14
});
ToolLib.setTool(ItemID.magis_sword_2_lvl, "aw_magic_sword_2", ToolType.sword);

IDRegistry.genItemID("aw_magic_shovel"); 
Item.createItem("aw_magic_shovel", "aw.item.magic_shovel", {name: "magic_shovel", meta: 0}, {stack: 1});

ToolAPI.addToolMaterial("aw_magic_shovel", {
	durability: 4220,
	level: 5,
	efficiency: 8,
	damage: 8,
	enchantability: 14
});
ToolLib.setTool(ItemID.aw_magic_shovel, "aw_magic_shovel", ToolType.shovel);

IDRegistry.genItemID("magis_pocox"); 
Item.createItem("magis_pocox", "aw.item.magic_staff", {name: "magis_pocox", meta: 0}, {stack: 1});

IDRegistry.genItemID("magis_pocox_2_lvl"); 
Item.createItem("magis_pocox_2_lvl", "aw.item.magic_staff_2_lvl", {name: "magic_staff_2_lvl", meta: 0}, {stack: 1});

IDRegistry.genItemID("aw_magic_staff"); 
Item.createItem("aw_magic_staff", "aw.item.magic_staff", {name: "magic_staff", meta: 0}, {stack: 1});

IDRegistry.genItemID("aw_dead"); 
Item.createItem("aw_dead", "aw.item.death", {name: "aw_dead", meta: 0}, {stack: 1});
Item.setFireResistant(ItemID.aw_dead, true);
Item.setExplodable(ItemID.aw_dead, true);

ToolAPI.addToolMaterial("godDead", {
    durability: 3000,
    level: 5,
    efficiency: 6,
    damage: 8,
    enchantability: 14
});
ToolLib.setTool(ItemID.aw_dead, "godDead", ToolType.sword);

Item.addCreativeGroup("wand", Translation.translate("aw.creative_group.wand"), [
	  ItemID.acolyteStaff,
	  ItemID.magis_stick,
	  ItemID.magis_stick_2_lvl,
	  ItemID.aw_magic_stick,
	  ItemID.magis_sword,
	  ItemID.magis_sword_2_lvl,
	  ItemID.aw_magic_shovel,
	  ItemID.magis_pocox,
	  ItemID.magis_pocox_2_lvl,
	  ItemID.aw_magic_staff
]);