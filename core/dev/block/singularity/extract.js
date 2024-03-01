IDRegistry.genBlockID("singularity_extract");
Block.createBlock("singularity_extract", [ {name: "aw.block.singularity_extractor", texture: [["stone", 0]], inCreative: true} ])
RenderAPI.setSingularityExtractor(BlockID.singularity_extract);
MagicCore.setPlaceBlockFunc(BlockID.singularity_extract, {
	magic: 5
});
SingularityAPI.setBlockOutputName(BlockID.singularity_extract, "base", true);
TileEntity.registerPrototype(BlockID.singularity_extract, {
	defaultValues: {
		aspect: 0,
		aspectMax: 1000,
		add: 1,
		arr:null
	},
	client: new SingularityLines.Client(),
	init(){
		SingularityAPI.init(this);
	},
	tick(){
		if(World.getThreadTime() % 5 == 0){
			if(this.blockSource.getBlockId(this.x, this.y-2, this.z) == BlockID.singularity_shrinker){
				let tile = World.getTileEntity(this.x, this.y-2, this.z, this.blockSource);
				if(!tile)
					tile = World.addTileEntity(this.x, this.y-2, this.z, this.blockSource);
				
				let add = this.data.aspect + Math.ceil(tile.data.singularity/500)
				if(add <= this.data.aspectMax){
					this.data.aspect+=add;
					tile.data.singularity -= .001*add;
							
					if(this.data.singularity < 0) 
						this.data.singularity = 0;
								
					this.data.add = Math.ceil(tile.data.singularity/250);
				}else
					this.data.add = 1;
			}else
				this.data.add = 1;
		}
		SingularityAPI.transfers(this, 2, base_transfer);
	},
	click(id, count, data, coords, player){
		SingularityAPI.click(this, coords, player);
	}
});

