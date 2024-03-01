IDRegistry.genBlockID("aw_magic_storage");
Block.createBlock("aw_magic_storage", [ {name: "aw.block.aw_magic_storage", texture: [["stone", 0]], inCreative: true} ]);

SingularityAPI.setBlockInputName(BlockID.aw_magic_storage, "base", true);
SingularityAPI.setBlockOutputName(BlockID.aw_magic_storage, "base", true);
magic_storage.setBlockModel(BlockID.aw_magic_storage);

MagicCore.setPlaceBlockFunc(BlockID.aw_magic_storage, null, null, {tab: "singularity", name: "magic_storage"});

TileEntity.registerPrototype(BlockID.aw_magic_storage, {
	defaultValues: {
		aspect: 0,
		aspectMax: 10000,
		arr: null,
	},
	client: new SingularityLines.Client(),
	init(){
		SingularityAPI.init(this);
	},
	tick(){
		SingularityAPI.transfers(this, 2, base_transfer);
	},
	click(id, count, data, coords, player){
		SingularityAPI.click(this, coords, player);
	}
});
