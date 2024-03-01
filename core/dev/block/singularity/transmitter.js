IDRegistry.genBlockID("transmitter");
Block.createBlock("transmitter", [ {name: "aw.block.transmitter", texture: [["stone", 0]], inCreative: true} ]);

SingularityAPI.setBlockInputName(BlockID.transmitter, "base", true);
SingularityAPI.setBlockOutputName(BlockID.transmitter, "base", true);
RenderAPI.setTransmitter(BlockID.transmitter);
TileEntity.registerPrototype(BlockID.transmitter, {
	defaultValues: {
		aspect: 0,
		aspectMax: 50,
		arr: null
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