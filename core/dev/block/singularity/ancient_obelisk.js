IDRegistry.genBlockID("ancient_bottom_obelisk");
Block.createBlock("ancient_bottom_obelisk", [ {name: "aw.block.ancient_bottom_obelisk", texture: [["stone", 0]], inCreative: true} ])
RenderAPI.setBottomObelisk(BlockID.ancient_bottom_obelisk);
RenderAPI.setItemObelisk(BlockID.ancient_bottom_obelisk);
IDRegistry.genBlockID("ancient_top_obelisk");
Block.createBlock("ancient_top_obelisk", [ {name: "aw.block.ancient_top_obelisk", texture: [["stone", 0]], inCreative: false} ])
RenderAPI.setTopObelisk(BlockID.ancient_top_obelisk);
Block.registerDropFunctionForID(BlockID.ancient_top_obelisk, function(){
	return [[BlockID.ancient_bottom_obelisk, 1, 0]];
});
MagicCore.setPlaceBlockFunc(BlockID.ancient_bottom_obelisk, {
	magic: 10
}, function(coords, item, block, player, region){
	if(region.getBlockId(coords.relative.x, coords.relative.y+1, coords.relative.z)==0){
		region.setBlock(coords.relative.x, coords.relative.y+1, coords.relative.z, BlockID.ancient_top_obelisk);
	}else{
		let pos = Entity.getPosition(player);
    region.spawnDroppedItem(pos.x, pos.y, pos.z, item.id, 1, item.data, item.extra)
    region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, 0);
	}
})
Callback.addCallback("DestroyBlock", function(coords, block, player){
	if(block.id == BlockID.ancient_bottom_obelisk){
		BlockSource.getDefaultForActor(player).setBlock(coords.x, coords.y+1,coords.z, 0, 0)
	}else if(block.id == BlockID.ancient_top_obelisk){
		BlockSource.getDefaultForActor(player).setBlock(coords.x, coords.y-1,coords.z, 0, 0)
	}
})
SingularityAPI.setBlockOutputName(BlockID.ancient_bottom_obelisk, "output", true);
TileEntity.registerPrototype(BlockID.ancient_bottom_obelisk, {
	defaultValues: {
		add: 1,
		aspect: 0,
		aspectMax: 1000
	},
	getEnts(){
		let mobs = [];
		let ents = Entity.getAllInRange({x:this.x,y:this.y,z:this.z}, 8);
		for(let i in ents){
			if(Network.getConnectedPlayers().indexOf(ents[i]) != -1 && Entity.getDimension(ents[i])==this.dimension)
				mobs.push(ents[i])
		}
		return mobs;
	},
	tick(){
		//if(World.getThreadTime()%__config__.get("tickUpdate")==0){
			if(this.data.aspect-this.data.add>=.1 && this.data.add!=0){
				let ents = this.getEnts();
				for(let i in ents){
					if(ScrutinyAPI.isScrutiny(ents[i], "aw", "basics", "singularity")){
						let c = MagicCore.getValue(ents[i])
						let pos = Entity.getPosition(ents[i]);
						if(c.aspects+this.data.add <= c.aspectsNow){
							this.data.aspect-=this.data.add;
							c.aspects+=this.data.add;
							 ParticlesAPI.coords(ParticlesAPI.part2, this.x, this.y, this.z, pos.x, pos.y, pos.z, 40, this.dimension)
						}
						MagicCore.setParameters(ents[i], c, false);
					}
				}
			}
		//}
	}
});

