IDRegistry.genBlockID("enchantment_forest_flower");
Block.createBlock("enchantment_forest_flower", [ {name: "aw.item.enchantment_forest_flower", texture: [["enchantment_forest_flower", 0]], inCreative: false} ], {
base: 18,
sound: "grass"
});

Block.registerDropFunctionForID(BlockID.enchantment_forest_flower, function(){
return [[ItemID.enchantment_forest_flower, 1, 0]];
});

Block.setDestroyTime(BlockID.enchantment_forest_flower, 1/20);

ToolAPI.registerBlockMaterial(BlockID.enchantment_forest_flower, "plant", 0);

RenderAPI.setPlantModel(BlockID.enchantment_forest_flower, 0, "enchantment_forest_flower", 0);
