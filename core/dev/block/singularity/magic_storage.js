IDRegistry.genBlockID("aw_magic_storage");
Block.createBlock("aw_magic_storage", [ {name: "aw.block.aw_magic_storage", texture: [["stone", 0]], inCreative: true} ]);

SingularityAPI.setBlockOutputName(BlockID.aw_magic_storage, "output", true);
magic_storage.setBlockModel(BlockID.aw_magic_storage);

MagicCore.setPlaceBlockFunc(BlockID.aw_magic_storage, null, null, {tab: "singularity", name: "magic_storage"});

TileEntity.registerPrototype(BlockID.aw_magic_storage, {
	defaultValues: {
		aspect: 0,
		aspectMax: 10000,
		arr: null,
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
