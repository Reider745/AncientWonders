/*Network.addClientPacket("client.emitter", function(packet){
//try{
	if(Player.getDimension() != packet.dim)
		return;
	let emitter = ProjectTile.allEmitter[packet.id];
	if(!emitter){
		emitter = new Particles.ParticleEmitter(packet.x, packet.y, packet.z);
		ProjectTile.allEmitter[packet.id] = emitter;
		emitter.setEmitRelatively(true);
		emitter.emit(packet.part, 0, 0, 0, 0);
	}
	emitter.moveTo(packet.pos.x,packet.pos.y,packet.pos.z);
//}catch(e){}
});
Network.addClientPacket("client.emitter.end", function(p){
	if(ProjectTile.allEmitter[p.id])
		delete ProjectTile.allEmitter[p.id];
});*/
Network.addClientPacket("client.project_tile.spawn", function(data){
	if(Player.getDimension() != data.dim)
		return;
	let project_tile = ProjectTile.all[data.name];
	project_tile.spawnClient(data.part, data.x, data.y, data.z, data.ax, data.ay, data.az, data.duration);
});
let ProjectTile = {
	getMilliseconds(tick){
		return (tick/20)*1000;
	},
	allEmitter: {},
	all: {},
	
	create(name, func){
		func = func || function(){};
		let clientFunc = function(){};
		let endServer = function(){};
		let endClient = function(){};
		
		this.setServerLogic = function(func_){
			func = func_;
			return this;
		}
		
		this.setEndServerLogic = function(end){
			endServer = end;
			return this;
		}
		
		this.setEndClientLogic = function(end){
			endClient = end;
			return this;
		}
		
		this.setClientLogic = function(func_){
			clientFunc = func_;
			return this;
		}
		
		ProjectTile.all[name] = this;
		this.spawn = function(part, x, y, z, ax, ay, az, player, region, duration){
			ax = ax*120;
			ay = ay*120;
			az = az*120;
			
			let dimension = Entity.getDimension(player);
			Network.sendToAllClients("client.project_tile.spawn", {
				dim: dimension,
				name: name,
				part: part,
				x: x,
				y: y,
				z: z,
				ax: ax,
				ay: ay,
				az: az,
				duration: duration
			});
			let posEnd;
			let time_tick = duration / 1000 * 20;
			Updatable.addUpdatable({
				tick: 0,
				cancel(){
					this.remove = true;
					endServer(region, player, posEnd, this);
				},
				update(){
					if(this.tick <= time_tick){
						let v = this.tick / time_tick;
						let pos = {
							x: x+(ax*v),
							y: y+(ay*v),
							z: z+(az*v)
						};
						if(!region.isChunkLoadedAt(pos.x, pos.z)){
							this.remove = true;
							endServer(region, player, posEnd, this);
							return;
						}
						posEnd = pos;
						if(!World.canTileBeReplaced(region.getBlockId(pos.x,pos.y,pos.z), region.getBlockData(pos.x,pos.y,pos.z))){
							this.remove = true;
							endServer(region, player, posEnd, this);
							return;
						}
						func(region, pos, player, this, v);
						
						this.tick++;
					}else{
						this.remove = true;
						endServer(region, player, posEnd, this);
					}
				}
			});
		}
		this.spawnClient = function(part, x, y, z, ax, ay, az, duration){
			ax = ax;
			ay = ay;
			az = az;
			part = typeof part == "number" ? part : ParticlesStorage.get(part);
			let emitter = new Particles.ParticleEmitter(x, y, z);
			emitter.setEmitRelatively(true);
			emitter.emit(part, 0, 0, 0, 0);
			
			let posEnd;
			let region = BlockSource.getCurrentClientRegion();
			let player = Player.get();
			
			let animation = createAnimation(duration, function(v, anim){
				let pos = {
					x: x+(ax*v),
					y: y+(ay*v),
					z: z+(az*v)
				};
				if(!region.isChunkLoadedAt(pos.x, pos.z)){
					anim.cancel();
					return;
				}
				posEnd = pos;
				emitter.moveTo(pos.x,pos.y,pos.z);
				if(!World.canTileBeReplaced(region.getBlockId(pos.x,pos.y,pos.z), region.getBlockData(pos.x,pos.y,pos.z)))
					anim.cancel();
				clientFunc(region, pos, player, anim, v);
			});
			animation.addListener({
				onAnimationEnd(){
					endClient(region, player, posEnd, animation);
					emitter.release();
				}
			});
		}
	},
	damageToProjectTile(pos, attacker, type, damage, range, func){
		func = func || function(){};
		let ents = Entity.getAllInRange(pos, range||1.5);
		let dimension = Entity.getDimension(attacker);
		for(let i in ents){
			let ent = ents[i];
			if(attacker != ent && Entity.getDimension(ent) == dimension){
				MagicCore.damage(ent, type, damage);
				func(ent);
			}
		}
	}
};

let ProjectTileFire = new ProjectTile.create("fire")
	.setServerLogic(function(region, pos, player){
		ProjectTile.damageToProjectTile(pos, player, "magic", 8, 1);
	});


let ProjectTileStarfall = new ProjectTile.create("starfall")
	.setServerLogic(function(region, pos, player){
		ProjectTile.damageToProjectTile(pos, player, "magic", 10);
	})
	.setEndServerLogic(function(region, player, pos){
		ProjectTile.damageToProjectTile(pos, player, "magic", 20, 10);
	})
	.setEndClientLogic(function(region, player, pos){
		for(let i = 0;i < 14;i++)
			ParticlesAPI.spawnCircleClient(ParticlesType.part2, pos.x, pos.y+(0.2*i)+1, pos.z, i / 1.3, 11 * i, 2);
	});


let ProjectTileSnow_1 = new ProjectTile.create("snow_1")
	.setServerLogic(function(region, pos, player){
		ProjectTile.damageToProjectTile(pos, player, "magic", 20, 1.5, function(ent){
			Entity.addEffect(ent, Native.PotionEffect.movementSlowdown , 0, 50, 1, true, false);
			if(EffectAPI.getLevel(ent, "noy_magic_immunity") <= 0)
				EffectAPI.add(ent, "noy_magic", 60, 1)
		});
	})
	.setClientLogic(function(region, pos){
		Particles.addParticle(ParticlesType.snow, pos.x+(Math.random()-Math.random()), pos.y+(Math.random()-Math.random()), pos.z+(Math.random()-Math.random()), 0, 0, 0);
	});


let BOOM = new ProjectTile.create("boom")
	.setServerLogic(function(region, pos, player){
		ProjectTile.damageToProjectTile(pos, player, "magic", 4);
	})
	.setClientLogic(function(region, pos){
		Particles.addParticle(ParticlesType.project, pos.x+(Math.random()-Math.random()), pos.y+(Math.random()-Math.random()), pos.z+(Math.random()-Math.random()), 0, 0, 0);
	});
	
	
	
function spawnPizdes(pos, region, player){
	let count = Math.floor(Math.random()*15)+15;
	for(let i = 0;i < count;i++){
		BOOM.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, player, region, ProjectTile.getMilliseconds(100));
	}
}
let ProjectTileFireBoom = new ProjectTile.create("fire_boom")
	.setServerLogic(function(region, pos, player, anim){ 
		ProjectTile.damageToProjectTile(pos, player, "magic", 5, 1.5, function(ent){
			anim.cancel();
		});
	})
	.setEndServerLogic(function(region, player, pos){
		spawnPizdes(pos, region, player);
	});
/*let ProjectTileFireBoom = new ProjectTile.create("fire_boom", function(region, pos, player, anim, v){
	let ents = Entity.getAllInRange(pos, 1.5);
	for(let i in ents)
		if(player != ents[i]){
			let ent = ents[i];
			MagicCore.damage(ent, "magic", 5);
			spawnPizdes(pos, region, player);
			anim.cancel();
		}
		
	let block = region.getBlock(pos.x, pos.y, pos.z);
	if((block.id != 0 || !World.canTileBeReplaced(block.id, block.data))||v == 1){
		spawnPizdes(pos, region, player);
		anim.cancel();
	}
});*/