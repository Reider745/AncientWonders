if(!Game.isDedicatedServer()){
	Callback.addCallback("ItemUse", function(coords, item, block, isExternal, player) {
		if(item.id == ItemID.bookk){
			let region = BlockSource.getDefaultForActor(player)
			if(Structure.isStructure("aw_ritual_0", coords.x, coords.y, coords.z, region)){
				Structure.destroy("aw_ritual_0", coords.x, coords.y, coords.z, region);
				region.spawnEntity(coords.x,coords.y, coords.z, "aw:boss0");
			}
		}
	});
}