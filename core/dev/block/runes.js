var BLOCK_TYPE_STONE = Block.createSpecialType({
    solid: true,
    renderlayer: 3,
    destroytime: 1.5,
    explosionres: 20,
    translucency: 0,
    base: 1
});

IDRegistry.genBlockID("aw_enchanted_stone");
Block.createBlock("aw_enchanted_stone", [ {name: "aw.block.enchanted_stone", texture: [["aw_enchanted_stone", 0]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_stone, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_fire");
Block.createBlock("aw_enchanted_rune_fire", [ {name: "aw.item.rune_fire", texture: [["aw_enchanted_stone", 1]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_fire, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_earth");
Block.createBlock("aw_enchanted_rune_earth", [ {name: "aw.item.rune_earth", texture: [["aw_enchanted_stone", 2]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_earth, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_wind");
Block.createBlock("aw_enchanted_rune_wind", [ {name: "aw.item.rune_wind", texture: [["aw_enchanted_stone", 3]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_wind, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_light");
Block.createBlock("aw_enchanted_rune_light", [ {name: "aw.item.rune_light", texture: [["aw_enchanted_stone", 4]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_light, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_darkness");
Block.createBlock("aw_enchanted_rune_darkness", [ {name: "aw.item.rune_darkness", texture: [["aw_enchanted_stone", 5]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_darkness, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_copying");
Block.createBlock("aw_enchanted_rune_copying", [ {name: "aw.item.rune_copying", texture: [["aw_enchanted_stone", 6]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_copying, "stone", 1);

function registerRune(id, r){
	TileEntity.registerPrototype(id, {
		tick(){
			if(World.getThreadTime() % 20 == 0){
				let ents = Entity.getAll();
				for(let i in ents){
					let ent = ents[i];
					let pos = Entity.getPosition(ent);
					if(Entity.getDistanceToCoords(ent, this) < r && EffectAPI.getLevel(ent, "noy_magic_immunity") <= 0)
						EffectAPI.add(ent, "noy_magic", 22, 1);
				}
			}
		}
	});
}

registerRune(BlockID.aw_enchanted_rune_fire, 5);
registerRune(BlockID.aw_enchanted_rune_earth, 5);
registerRune(BlockID.aw_enchanted_rune_wind, 5);
registerRune(BlockID.aw_enchanted_rune_light, 5);
registerRune(BlockID.aw_enchanted_rune_darkness, 10);
registerRune(BlockID.aw_enchanted_rune_copying, 15);

Item.addCreativeGroup("runeblocks", Translation.translate("aw.creative_group.rune"), [
	BlockID.aw_enchanted_rune_fire,
	BlockID.aw_enchanted_rune_earth,
	BlockID.aw_enchanted_rune_wind,
	BlockID.aw_enchanted_rune_light,
	BlockID.aw_enchanted_rune_darkness,
	BlockID.aw_enchanted_rune_copying
]);
