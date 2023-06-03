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

function updateClient(value){
	let result = [];
	
	let player = Player.get();
	let region = BlockSource.getCurrentClientRegion();
	
	for(let i in ProjectTile.clients){
		let data = ProjectTile.clients[i];
		
		let pos = {
			x: data.x+(data.ax*value),
			y: data.y+(data.ay*value),
			z: data.z+(data.az*value)
		};
		data.x = pos.x;
		data.y = pos.y;
		data.z = pos.z;
		data.time -= data.duration*(value/(data.duration/1000));
		if(data.time <= 0){
			data.type.endClient(region, data.player, data.posEnd);
			continue;
		}
		/*if(!region.isChunkLoadedAt(pos.x, pos.z) || data.duration < 0){
			data.type.endClient(region, data.player, data.posEnd);
			continue;
		}*/
	  
		data.posEnd = pos;
		data.emitter.moveTo(pos.x,pos.y,pos.z);
		data.type.clientFunc(region, pos, data.player, value);
		/*let res = data.type.clientFunc(region, pos, data.player, value);
		if(!World.canTileBeReplaced(region.getBlockId(pos.x,pos.y,pos.z), region.getBlockData(pos.x,pos.y,pos.z)) || res){
			data.type.endClient(region, data.player, data.posEnd);
			continue;
		}*/
		result.push(data);
	}
	ProjectTile.clients = result;
}

function updateServer(value){
	let result = [];
	for(let i in ProjectTile.server){
		let data = ProjectTile.server[i];
		
		let pos = {
			x: data.x+(data.ax*value),
			y: data.y+(data.ay*value),
			z: data.z+(data.az*value)
		};
		data.x = pos.x;
		data.y = pos.y;
		data.z = pos.z;
		data.time -= data.duration*(value/(data.duration/1000));
		
		if(!data.region.isChunkLoadedAt(pos.x, pos.z) || data.time <= 0){
			data.type.endServer(data.region, data.player, data.posEnd);
			continue;
		}
	  
		data.posEnd = pos;
		let res = data.type.func(data.region, pos, data.player, value);
		if(!World.canTileBeReplaced(data.region.getBlockId(pos.x,pos.y,pos.z), data.region.getBlockData(pos.x,pos.y,pos.z)) || res){
			data.type.endServer(data.region, data.player, data.posEnd);
			continue;
		}
		result.push(data);
	}
	ProjectTile.server = result;
}

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
	
	clients: [],
	server: [],
	
	create(name, func){
		this.func = func || function(){};
		this.clientFunc = function(){};
		this.endServer = function(){};
		this.endClient = function(){};
		
		this.setServerLogic = function(func_){
			this.func = func_;
			return this;
		}
		
		this.setEndServerLogic = function(end){
			this.endServer = end;
			return this;
		}
		
		this.setEndClientLogic = function(end){
			this.endClient = end;
			return this;
		}
		
		this.setClientLogic = function(func_){
			this.clientFunc = func_;
			return this;
		}
		
		ProjectTile.all[name] = this;
		this.spawn = function(part, x, y, z, ax, ay, az, player, region, duration){
			ax = ax;
			ay = ay;
			az = az;
			
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
			ProjectTile.server.push({
				x: x,
				y: y,
				z: z,
				ax: ax,
				ay: ay,
				az: az,
				
				region: region,
				player: player,
				
				duration: duration,
				time: duration,
				
				type: this,
			});
		}
		this.spawnClient = function(part, x, y, z, ax, ay, az, duration){
			part = typeof part == "number" ? part : ParticlesStorage.get(part);
			let emitter = new Particles.ParticleEmitter(x, y, z);
			emitter.setEmitRelatively(true);
			emitter.emit(part, 0, 0, 0, 0);
		 
			ProjectTile.clients.push({
				x: x,
				y: y,
				z: z,
				ax: ax,
				ay: ay,
				az: az,
				
				part: part,
				emitter: emitter,
				
				duration: duration,
				time: duration,
				
				type: this,
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

function threadUpdate(func){
	const ValueAnimator = android.animation.ValueAnimator;
	const Handler = android.os.Handler;
	const Looper = android.os.Looper;
	const System = java.lang.System;
	
	let pre_time;
	
	let animator = ValueAnimator.ofFloat(0, 1);
	animator.setDuration(1000);
	animator.setRepeatCount(ValueAnimator.INFINITE);
	animator.addUpdateListener(function(){
		//try {
			let time = System.currentTimeMillis();
			func((time - pre_time) / 1000);
			pre_time = time;
	/*	}catch(e) {
			alert(e);
		}*/
	});
	
	let handler = new Handler(Looper.getMainLooper());
	handler.post(function(){
		pre_time = System.currentTimeMillis();
		animator.start();
	});
};

threadUpdate(updateClient);
//threadUpdate(updateServer);


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
	.setServerLogic(function(region, pos, player){
		let res;
		ProjectTile.damageToProjectTile(pos, player, "magic", 5, 1.5, function(ent){
			res = true;
		});
		return;
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