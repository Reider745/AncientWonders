Callback.addCallback("ItemUse", function(coords, item, block, isExternal, player) {
    if(item.id == ItemID.bookk){
        if(Structure.isStructure("aw_ritual_0", coords.x, coords.y, coords.z, BlockSource.getDefaultForActor(player))){
             Structure.destroy("aw_ritual_0", coords.x, coords.y, coords.z, BlockSource.getDefaultForActor(player));
            var b = BlockSource.getDefaultForActor(player);
            b.spawnEntity(coords.x,coords.y, coords.z, "aw:boss0");
        }
    }
});
