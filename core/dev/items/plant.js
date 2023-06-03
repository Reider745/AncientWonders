IDRegistry.genItemID("enchantment_forest_flower"); 
Item.createItem("enchantment_forest_flower", "aw.item.enchantment_forest_flower", {name: "enchantment_forest_flower", meta: 0}, {stack: 64});

IDRegistry.genItemID("aw_petal_powder"); 
Item.createItem("aw_petal_powder", "aw.item.petal_powder", {name: "aw_petal_powder", meta: 0}, {stack: 64});

Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
let region = BlockSource.getDefaultForActor(player);
let tile = region.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
let id = region.getBlockId(coords.relative.x, coords.relative.y-1, coords.relative.z);
if(item.id == ItemID.enchantment_forest_flower && !Game.isActionPrevented() && World.canTileBeReplaced(tile.id, tile.data) && (id == 2 || id == 3)){
region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.enchantment_forest_flower);
delItem(player, item);
}
}, 1);
