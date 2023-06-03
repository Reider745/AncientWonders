IDRegistry.genBlockID("transmitter");
Block.createBlock("transmitter", [ {name: "aw.block.transmitter", texture: [["stone", 0]], inCreative: true} ]);

SingularityAPI.setBlockOutputName(BlockID.transmitter, "output", true);
RenderAPI.setTransmitter(BlockID.transmitter);
TileEntity.registerPrototype(BlockID.transmitter, {
	defaultValues: {
		aspect: 0,
		aspectMax: 50,
		arr: null
	},
	init(){
		if(!this.data.arr)
		 this.data.arr = []
	},
	tick: function(){
		if(!this.data.arr)
			this.data.arr = this.data.arr || [];
		for(let i in this.data.arr)
			SingularityAPI.transfersBlock(this, World.getTileEntity(this.data.arr[i].x, this.data.arr[i].y, this.data.arr[i].z, this.blockSource),2/this.data.arr.length,base_transfer);
	},
	click(id, count, data, coords, player){
		this.data.arr = this.data.arr || []
		let pos = SingularityAPI.itemUse(player, Entity.getCarriedItem(player), BlockID.singularity_extract, 3, coords, true);
		for(let i in this.data.arr)
			if(this.data.arr[i].x == pos.x && this.data.arr[i].y == pos.y && this.data.arr[i].z == pos.z)
				return;
		if(pos.x != 0 && pos.y != 0 && pos.z != 0)
			this.data.arr.push(pos);
	}
});

