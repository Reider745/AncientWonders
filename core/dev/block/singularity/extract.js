IDRegistry.genBlockID("singularity_extract");
Block.createBlock("singularity_extract", [ {name: "aw.block.singularity_extractor", texture: [["stone", 0]], inCreative: true} ])
RenderAPI.setSingularityExtractor(BlockID.singularity_extract);
MagicCore.setPlaceBlockFunc(BlockID.singularity_extract, {
	magic: 5
});
TileEntity.registerPrototype(BlockID.singularity_extract, {
	defaultValues: {
		aspect: 0,
		aspectMax: 1000,
		add: 1,
		pos:{x:0,y:0,z:0}
	},
	tick: function(){
		if(World.getThreadTime()%__config__.get("tickUpdate")==0){
			if(this.blockSource.getBlockId(this.x, this.y-2, this.z)==BlockID.singularity_shrinker){
				let tile = World.getTileEntity(this.x, this.y-2, this.z, this.blockSource);
				if(!tile)
					tile = World.addTileEntity(this.x, this.y-2, this.z, this.blockSource)
					if(this.data.aspect+Math.ceil(tile.data.singularity/500)<=this.data.aspectMax){
							this.data.aspect+=Math.ceil(tile.data.singularity/500);
							tile.data.singularity-=.0005*Math.ceil(tile.data.singularity/250);
							this.data.add = Math.ceil(tile.data.singularity/250);
					}else{
							this.data.add = 1;
					}
				}else{
					this.data.add = 1;
				}
				
		SingularityAPI.transfersBlock(this, World.getTileEntity(this.data.pos.x, this.data.pos.y, this.data.pos.z, this.blockSource), this.data.add, function(output, tile){
			ParticlesAPI.spawnLine(ParticlesAPI.part2, tile.x, tile.y, tile.z, output.x, output.y, output.z, 30, tile.dimension);
		});
		}
	},
	click(id, count, data, coords, player){
		this.data.pos = SingularityAPI.itemUse(player, Entity.getCarriedItem(player), BlockID.singularity_extract, 10, coords, true);
	}
});

