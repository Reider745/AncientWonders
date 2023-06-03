IDRegistry.genBlockID("bowlWishes");
Block.createBlock("bowlWishes", [ {name: "aw.block.bowl", texture: [["bowl", 1]], inCreative: true, renderlayer: 1} ]);

Block.setDestroyLevel("bowlWishes", 0);
ToolAPI.registerBlockMaterial(BlockID.bowlWishes, "stone", 0, false);

let meshBowl = new RenderMesh();
meshBowl.importFromFile(__dir__+"/assets/model/bowl.obj", "obj", null)
meshBowl.setBlockTexture("bowl", 0);
var renderBowl = new ICRender.Model(); 
var modelBowl = new BlockRenderer.Model(meshBowl);  
renderBowl.addEntry(modelBowl);
BlockRenderer.setStaticICRender(BlockID.bowlWishes, -1, renderBowl); 


TileEntity.registerPrototype(BlockID.bowlWishes, {
    defaultValues: {
        active: false,
        player: -1
    },
    tick: function(){
        if(this.data.active){
            if(ScrutinyAPI.isScrutiny(this.data.player, "aw", "basics", "bowlWishes")){
                Mp.spawnParticle(ParticlesAPI.part2, this.x+Math.random(), this.y + .4, this.z + Math.random(), 0, Math.random()/10, 0, 0, 0, 0, this.dimension);
                if(Math.random()<=0.001){
                    this.data.active = false;
                    delete classPlayer[this.data.player];
                }
            }
        }
    },
    click: function(id, count, data, coords, player){
        let item = Entity.getCarriedItem(player);
        if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "bowlWishes")){
            if(!this.data.active && item.id == ItemID.rune5 && MagicCore.isClass(player)){
                this.data.active = true;
                this.data.player = player;
                Entity.setCarriedItem(player, item.id, item.count-1, item.data);
            }
        }else{
            PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", "bowlWishes"]]));
        }
    }
});


