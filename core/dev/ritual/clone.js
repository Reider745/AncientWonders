
    Callback.addCallback("ItemUse", function(coords, item, block, isExternal, player) {
        if(item.id == ItemID.bookk){
            var b = BlockSource.getDefaultForActor(player);
            if(b.getBlockId(coords.x, coords.y, coords.z) == BlockID.rityalPedestal){
                if(b.getBlockId(coords.x+2, coords.y, coords.z+2) == BlockID.rityalPedestal){
                    if(b.getBlockId(coords.x-2, coords.y, coords.z+2) == BlockID.rityalPedestal){
                         if(b.getBlockId(coords.x+2, coords.y, coords.z-2) == BlockID.rityalPedestal){
                             if(b.getBlockId(coords.x-2, coords.y, coords.z-2) == BlockID.rityalPedestal){
                                if(TileEntity.getTileEntity(coords.x+2, coords.y, coords.z+2, b).data.item.id == ItemID.rune6){
                                     if(TileEntity.getTileEntity(coords.x-2, coords.y, coords.z+2, b).data.item.id == ItemID.rune6){
                                         if(TileEntity.getTileEntity(coords.x+2, coords.y, coords.z-2, b).data.item.id == ItemID.rune6){
                                             if(TileEntity.getTileEntity(coords.x-2, coords.y, coords.z-2, b).data.item.id == ItemID.rune6){
                                                 if(TileEntity.getTileEntity(coords.x, coords.y, coords.z, b).data.item.id != 0){
                                                  let d = MagicCore.getValue(player);
                                                  if(d.Aspects>=500){
                                                 if(d.magis>=30){
                                                     
      let Itemm = TileEntity.getTileEntity(coords.x, coords.y, coords.z, b).data.item;
      let pa = new PlayerActor(player);
                              if(pa.getGameMode()==0){
                                  TileEntity.getTileEntity(coords.x, coords.y, coords.z, b).drop(player);
                              }else{
                                 TileEntity.getTileEntity(coords.x, coords.y, coords.z, b).drop(player);
                                  b.spawnDroppedItem(coords.x, coords.y+1, coords.z, Itemm.id, 1, Itemm.data);
                              }b.spawnDroppedItem(coords.x, coords.y+1, coords.z, Itemm.id, 1, Itemm.data);
                    d.Aspects -= 500;
                    if(Math.random()<=0.5){
                        if(d.AspectsNow + 500 <= d.AspectsMax){
                            d.AspectsNow+=500;
                        }else{
                            d.AspectsNow=d.AspectsMax;
                        }        
                        MagicCore.setParameters(player, d);                                                                                             
                                                     }
                                                    }else{
                                                        
                                                        
                                                 PlayerAC.message(player, Translation.translate("aw.message.ritualMagic30"))       
                                                    }
                                                }else{
                                                    
                                                  PlayerAC.message(player, Translation.translate("aw.message.ritualAspect500"))  
                                                }
                                            } 
                                        } 
                                    } 
                               } 
                            } 
                        } 
                    } 
                } 
            }
        }
       } 
    });