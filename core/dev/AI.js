/*let prot = {};
let EntityReg = {
    setPrototype: function (type, obj){
        obj.tick = obj.tick || function(ent){};
        obj.damage = obj.damage || function(attacker, victim, damageValue, damageType, someBool1, someBool2){};
        prot[type] = obj;
    },
    getPrototype: function (ent){
      return prot[Entity.getTypeName(ent)];
    },
};
Callback.addCallback("tick", function(){
	if(World.getThreadTime()%__config__.get("tickUpdate")==0){
		try{
   	 let ents = Optimization.getAllWhiteList(Object.keys(prot))
    	for(let i = 0;i < ents.size();i++){
    		EntityReg.getPrototype(ents.get(i)).tick(ents.get(i));
    	}
    }catch(e){
    	alert(e)
    }
	}
});*/

let prot = {};
let EntityReg = {
	setPrototype(type, obj){
		obj.tick = obj.tick || function(ent){};
		obj.damage = obj.damage || function(attacker, victim, damageValue, damageType, someBool1, someBool2){};
		prot[type] = obj;
	},
	getPrototype(ent){
		return prot[Entity.getTypeName(ent)];
	}
};

const tickUpdate = __config__.get("tickUpdate");
let listEntity = {};
Callback.addCallback("EntityAdded", function(entity){
	let prot = EntityReg.getPrototype(entity);
	if(prot){
		if(prot.optimization)
			var upd = {
				update(){
					prot.tick(entity);
				}
			};
		else
			var upd = {
				update(){
					if(World.getThreadTime() % tickUpdate == 0)
						prot.tick(entity);
				}
			};
		listEntity[entity] = upd;
		Updatable.addUpdatable(upd);
	}
});
Callback.addCallback("EntityRemoved", function(entity){
	if(EntityReg.getPrototype(entity))
		listEntity[entity].remove = true;

});
Callback.addCallback("LevelLeft", function(){
	listEntity = {};
});

const upt = Math.floor(20/__config__.get("tickUpdate"))

Callback.addCallback('EntityHurt', function (attacker, victim, damageValue, damageType, someBool1, someBool2) {
 if(prot[Entity.getTypeName(victim)])
   EntityReg.getPrototype(victim).damage(attacker, victim, damageValue, damageType, someBool1, someBool2);
});

EntityReg.setPrototype("aw:stone_golem<>", {
	tick(ent){
		EffectAPI.add(ent,"dead",20, 20)
	},
	damage(attacker, ent, damageValue, damageType){
		
	}
});

EntityReg.setPrototype("aw:tanatos<>", {
	tick(ent){
		EffectAPI.add(ent,"dead",20, 30)
		if(Entity.getTarget(ent) == -1){
			let ents = Entity.getAllInRange(Entity.getPosition(ent), 20);
			let r = Math.floor(Math.random()*(ents.length-1));
			if(Entity.getTypeName(ents[r]) != Entity.getTypeName(ent) && Entity.getTypeName(ents[r]) != "minecraft:item<>")
				Entity.setTarget(ent, ents[r]);
		}else{
			if(Math.random()<=0.005*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll20,data:0},{id:ItemID.sroll23,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.025*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll23,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.1*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll22,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.005*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll26,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.05*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll32,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.025*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll34,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.025*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll22,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.008*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll16,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
		}
	},
	damage(attacker, ent, damageValue, damageType){
		Entity.setTarget(ent, attacker);
		if(Entity.getHealth(ent) <= Entity.getMaxHealth(ent)/2&&!(damageType==111||damageType==112))
			Game.prevent();
	}
})
/*if(__config__.get("beta_mode")){
EntityReg.setPrototype("aw:tanatos<>", {
    tick: function(ent){

        if(Entity.getTarget(ent) == -1){

            let ents = Entity.getAllInRange(Entity.getPosition(ent), 20);

            let r = Math.floor(Math.random()*(ents.length-1));

            if(Entity.getTypeName(ents[r]) != Entity.getTypeName(ent) && Entity.getTypeName(ents[r]) != "minecraft:item<>") Entity.setTarget(ent, ents[r]);

        }else{

            if(Math.random()<=0.005){

                Wands.emitterEntity(ent, {

                    srollType: ItemID.sroll2,

                    sroll: [ItemID.sroll20]

                });

                Wands.emitterEntity(ent, {

                    srollType: ItemID.sroll2,

                    sroll: [ItemID.sroll20, ItemID.sroll27, ItemID.sroll23]

                });

            }

            if(Math.random()<=0.2){

                Wands.emitterEntity(ent, {

                    srollType: ItemID.sroll2,

                    sroll: [ItemID.sroll22]

                });

            }

        }

    },

    damage: function(attacker, ent, damageValue, damageType, someBool1, someBool2){

        Entity.setTarget(ent, attacker);

        if(damageType == 5){

            Game.prevent();

        }else if(damageType == 3){

            Game.prevent();

        }

        if(Math.random()<=0.2){

            Wands.emitterEntity(ent, {

                srollType: ItemID.sroll2,

                sroll: [ItemID.sroll21]

            });

        }

    }

});

}*/
function attack(ent){
    let pos = Entity.getPosition(ent);
    pos.y += 5;
    let group = new ParticlesCore.Group();
    let region = BlockSource.getDefaultForActor(ent);
    for(let i = 0;i <= Math.floor(Math.random()*5)+5;i++){
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(ent));
        vel.x += Math.random() - Math.random();
        vel.y += Math.random() - Math.random();
        vel.z += Math.random() - Math.random();
        for(let i = 0;i<50;i++){
            let coord = {
                x: pos.x+(i * vel.x / 2),
                y: pos.y+(i * vel.y / 2),
                z: pos.z+(i * vel.z / 2)

            };
            let ent3 = Entity.getAllInRange(coord, 4);
            for(let i1 in ent3){
                if(ent3[i1] != ent) MagicCore.damage(ent3[i1], "magic", 40);
            }
             if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                break;
            }
            group.add(ParticlesAPI.part3, coord.x, coord.y, coord.z);
        }
    }
    group.send(region);
}

let entId = {};

EntityReg.setPrototype("aw:skeleton<>", {
    tick: function (ent){
        if(Entity.getTarget(ent) == -1){
            let ents = Entity.getAllInRange(Entity.getPosition(ent), 20);
            let r = Math.floor(Math.random()*(ents.length-1));
            if(ents[r] != entId[ent] && Entity.getTypeName(ents[r]) != Entity.getTypeName(ent) && Entity.getTypeName(ents[r]) != "minecraft:item<>") Entity.setTarget(ent, ents[r]);
        }else if(Math.random() <= 0.1){
            let pos = Entity.getPosition(ent);
            let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(ent));
            let group = new ParticlesCore.Group();
            let region = BlockSource.getDefaultForActor(ent);
            for(let i = 0;i<20;i++){
                let coord = {
                    x: pos.x+(i * vel.x / 2),
                    y: pos.y+1.5+(i * vel.y / 2),
                    z: pos.z+(i * vel.z / 2)
                };
                let ent3 = Entity.getAllInRange(coord, 2);
                for(let i1 in ent3){
                    if(ent3[i1] != ent) MagicCore.damage(ent3[i1], "magic", 4);
                }
                 if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                    break;
                }
                group.add(ParticlesAPI.part3, coord.x, coord.y, coord.z);
            }
            group.send(region);
       }
    },
    damage: function (attacker, ent, damageValue, damageType, someBool1, someBool2){
        let ents = Entity.getAllInRange(Entity.getPosition(ent), 30);
        let r = Math.floor(Math.random()*ents.length-1);
        if(ents[r] != entId[ent]) Entity.setTarget(ent, attacker);
    }
});

EntityReg.setPrototype("aw:boss0<>", {
    tick: function (ent){  
  //  if(World.getThreadTime()%20){
        if(Math.random()<=0.01){
            Wands.emitterEntity(ent, {
            	wand: {
            		id: ItemID.magis_stick,
            		data: 0,
            		count: 1,
            	},
              event: ItemID.sroll2,
              spells: [{id:ItemID.sroll19,data:0}],
              packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
            });
        }
        if(Math.random()<=0.01*upt){
            Wands.emitterEntity(ent, {
            	wand: {
            		id: ItemID.magis_stick,
            		data: 0,
            		count: 1,
            	},
              event: ItemID.sroll2,
              spells: [{id:ItemID.sroll5,data:0}],
              packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
            });
        }
        if(Entity.getTarget(ent) != -1){
            if(Math.random()<=0.1*upt){
                Wands.emitterEntity(ent, {
                	wand: {
            				id: ItemID.magis_stick,
            				data: 0,
            				count: 1,
            			},
                  event: ItemID.sroll2,
                  spells: [{id:ItemID.sroll18,data:0}],
             		 packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
                });
            }
            let ents = Entity.findNearest(Entity. getPosition(ent), 1, 4);
            if(ents){
                Entity.setTarget(ent, ents);
                let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(ent));
                Entity.addVelocity(ents, vel.x, vel.y, vel.z);
                Wands.emitterEntity(ent, {
                	wand: {
            				id: ItemID.magis_stick,
            				data: 0,
            				count: 1,
            			},
                  event: ItemID.sroll2,
                  spells: [{id:ItemID.sroll16,data:0}],
              		packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
                });
                attack(ent);
            }
            ents = Entity.getAllInRange(Entity.getPosition(ent), 30, [1]);
            for(let i in ents){
                let range = Entity.getDistanceToEntity(ent, ents[i], [Entity. getType(Entity.getTarget(ent))]);
                if(range >= 20){
                    if(Math.random()<=0.5){
                        Entity.setTarget(ent, ents[i]);
                        Wands.emitterEntity(ent, {
                        	wand: {
            								id: ItemID.magis_stick,
            								data: 0,
            								count: 1,
            							},
                          event: ItemID.sroll2,
                          spells: [{id:ItemID.sroll16,data:0}],
             						 packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
                        });
                        Wands.emitterEntity(ent, {
                        	wand: {
            								id: ItemID.magis_stick,
            								data: 0,
            								count: 1,
            							},
                          event: ItemID.sroll2,
                          spells: [{id:ItemID.sroll15,data:0}],
           						   packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
                        });
                    }else{
                        Wands.emitterEntity(ent, {
                        	wand: {
            								id: ItemID.magis_stick,
            								data: 0,
            								count: 1,
            							},
                          event: ItemID.sroll2,
                          spells: [{id:ItemID.sroll5,data:0}],
             						 packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
                        });
                    }
                }else{
                    Entity.setTarget(ent, ents[i]);
                }
            }
        }else{
            let ents = Entity.getAllInRange(Entity.getPosition(ent), 35);
            Entity.setTarget(ent, ents[Math.floor(Math.random()*(ents.length-1))]);
        }
      //}
    },
    damage: function(attacker, ent, damageValue, damageType, someBool1, someBool2){
        if(attacker) Entity.setTarget(ent, attacker);
        if(damageType == 5){
            Game.prevent();
        }else if(damageType == 3){
            Game.prevent();
        }
        if(Math.random()<=0.2){
            Wands.emitterEntity(ent, {
            	wand: {
            		id: ItemID.magis_stick,
            	  data: 0,
            		count: 1,
            	},
              event: ItemID.sroll2,
              spells: [{id:ItemID.sroll20,data:0}],
              packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
            });
        }
    }
});

Callback.addCallback('EntityDeath', function (entity, attacker, damageType) {
    if(Entity.getTypeName(entity) == "aw:boss0<>"){
        let B = BlockSource.getDefaultForActor(entity);
        let pos = Entity.getPosition(entity);
        if(Math.random()<=0.2){
            B.spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.sroll17, 1, 0, null);
        }
        if(Math.random()<=0.6){
            B.spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.sroll20, 1, 0, null);

        }
        if(Math.random()<=0.5){
            B.spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.sroll15, 1, 0, null);
        }
        B.spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.sroll16, 1, 0, null);
    }else if(Entity.getTypeName(entity) == "minecraft:wither_skeleton<>"){
let B = BlockSource.getDefaultForActor(entity);
let pos = Entity.getPosition(entity);
B.spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.witherbone, 1, 0, null);
}
});
ModAPI.addAPICallback("RecipeViewer", function(api){
	var RVTypeAW = (function(_super){
  	__extends(RVTypeAW, _super);
    function RVTypeAW(name, icon, content){
      let _this = _super.call(this, name, icon, content) || this;
      return _this;
    }
    RVTypeAW.prototype.getAllList = function() {
      return [{
      	input: [],
    		output: [{id:ItemID.sroll17,data:0,count:1}]},{
      	input: [],
    		output: [{id:ItemID.sroll20,data:0,count:1}]},{
      	input: [],
    		output: [{id:ItemID.sroll15,data:0,count:1}]},{
      	input: [],
    		output: [{id:ItemID.sroll16,data:0,count:1}]}
			];
    };
    return RVTypeAW;
  }(api.RecipeType));
	api.RecipeTypeRegistry.register("aw_boss_drop", new RVTypeAW(Translation.translate("aw.gui.rv.aw_boss_drop"), VanillaItemID.rotten_flesh, {
		elements: {
			output0: {x: 440, y: 150, size: 120},
		}
	}));
});
