IDRegistry.genItemID("rune1"); 
Item.createItem("rune1", "aw.item.rune_fire", {name: "rune", meta: 1}, {stack: 1});
Item.setGlint(ItemID.rune1, true);

IDRegistry.genItemID("rune2"); 
Item.createItem("rune2", "aw.item.rune_earth", {name: "rune", meta: 2}, {stack: 1});
Item.setGlint(ItemID.rune2, true);

IDRegistry.genItemID("rune3"); 
Item.createItem("rune3", "aw.item.rune_wind", {name: "rune", meta: 3}, {stack: 1});
Item.setGlint(ItemID.rune3, true);

IDRegistry.genItemID("rune4"); 
Item.createItem("rune4", "aw.item.rune_light", {name: "rune", meta: 4}, {stack: 1});
Item.setGlint(ItemID.rune4, true);

IDRegistry.genItemID("rune5"); 
Item.createItem("rune5", "aw.item.rune_darkness", {name: "rune", meta: 5}, {stack: 1});
Item.setGlint(ItemID.rune5, true);

IDRegistry.genItemID("rune6"); 
Item.createItem("rune6", "aw.item.rune_copying", {name: "rune", meta: 6}, {stack: 1});
Item.setGlint(ItemID.rune6, true);

IDRegistry.genItemID("rune_absorption"); 
Item.createItem("rune_absorption", "aw.item.rune_absorption", {name: "rune_absorption", meta: 0}, {stack: 1});
Item.setGlint(ItemID.rune_absorption, true);

IDRegistry.genItemID("rune_greed"); 
Item.createItem("rune_greed", "aw.item.rune_greed", {name: "rune_greed", meta: 0}, {stack: 1});
Item.setGlint(ItemID.rune_greed, true);

IDRegistry.genItemID("rune_life"); 
Item.createItem("rune_life", "aw.item.rune_life", {name: "rune_life", meta: 0}, {stack: 1});
Item.setGlint(ItemID.rune_life, true);

IDRegistry.genItemID("rune_dead"); 
Item.createItem("rune_dead", "aw.item.rune_dead", {name: "rune_dead", meta: 0}, {stack: 1});
Item.setGlint(ItemID.rune_dead, true);

Item.addCreativeGroup("rune", Translation.translate("aw.creative_group.rune"), [
    ItemID.rune1,
    ItemID.rune2,
    ItemID.rune3,
    ItemID.rune4, 
    ItemID.rune5, 
    ItemID.rune6,
    ItemID.rune_absorption,
    ItemID.rune_greed,
    ItemID.rune_life,
    ItemID.rune_dead
]);