function buildLightboltMeshForRadius(rad, setting){
	const mesh = new RenderMesh();
	with(setting){
		const step = rad * (1 / count_kink);
		
		let x = 0, y = 0, x_post = 0, y_post = 0;
		const z_min_modi = branching_z_modification[0], z_max_modi = branching_z_modification[1];
		
		for(let z = 0, z_post = step;z <= rad;z += step, z_post += step){
			y_post = Math.random() / kink_strength - Math.random() / kink_strength;
			x_post = Math.random() / kink_strength - Math.random() / kink_strength;
			
			mesh.addVertex(x, y, z);
			mesh.addVertex(x+size, y, z);
			mesh.addVertex(x_post+size, y_post, z_post);
		
			mesh.addVertex(x, y, z);
			mesh.addVertex(x_post+size, y_post, z_post);
			mesh.addVertex(x_post, y_post, z_post);
			
			if(Math.random() <= chance_branching){
				let z_modi = z + step * (Math.random() * (z_max_modi - z_min_modi)) + z_min_modi;
				let kink_x = Math.random() / kink_strength - Math.random() / kink_strength;
				let kink_y = Math.random() / kink_strength - Math.random() / kink_strength;
				
				mesh.addVertex(x, y, z);
				mesh.addVertex(x+size, y, z);
				mesh.addVertex(kink_x+size, kink_y, z_modi);
		
				mesh.addVertex(x, y, z);
				mesh.addVertex(kink_x+size, kink_y, z_modi);
				mesh.addVertex(kink_x, kink_y, z_modi);
			}
			
			x = x_post;
			y = y_post;
		}
	}
	
	return mesh;
}

function buildLightboltMesh(x1, y1, z1, x2, y2, z2, setting){
	const mesh = new RenderMesh();
	
	const dx = x2-x1;
	const dy = y2-y1;
	const dz = z2-z1;
	
	const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
	
	buildLightboltMeshForRadius(radius, setting);
	
	rotateMesh(mesh, x1, x2, y1, y2, dx, dy, dz, radius);
	mesh.translate(x1, y1, z1);
		
	return mesh;
}

let Lightbolt = {
	types: {},
	
	anim_cache: {},
	
	updateNode(node){
		const mesh = new RenderMesh();
		let newList = [];
		
		for(let i in node.lightbolts){
			let lightbolt = node.lightbolts[i];
			if(lightbolt.visibility){
				let lightbolt = node.lightbolts[i];
				mesh.addMesh(lightbolt.mesh);
				newList.push(lightbolt);
			}
		}
		
		if(newList.length == 0)
			delete this.anim_cache[node.id];
		
		node.lightbolts = newList;
		
		node.anim.describe({
			mesh: mesh
		});
		node.anim.load();
	},
	
	spawnClient(name, x1, y1, z1, x2, y2, z2){
		const type = this.types[name]
		const setting = type.setting;
		const mesh_ = type.getLightboltMesh(x1, y1, z1, x2, y2, z2);
		
		const dx = x2-x1;
		const dy = y2-y1;
		const dz = z2-z1;
	
		const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
		
		const mesh = new RenderMesh();
		mesh.addMesh(mesh_);
	
		rotateMesh(mesh, x1, x2, y1, y2, dx, dy, dz, radius);
		mesh.translate(x1, y1, z1);
		
		switch(setting.animation_cache_type){
			case 0:
				let anim = new Animation.Base(0, 0, 0);
				anim.describe({
					mesh: mesh
				});
				anim.load();
				setTimeoutLocal(function(){
					anim.destroy();
				}, setting.life_time);
			break;
			case 1:
				let id = x1+":"+y1+":"+z1;
				let node = this.anim_cache[id];
				if(!node){
					node = {
						id: id,
						anim: new Animation.Base(0, 0, 0),
						lightbolts: []
					};
					this.anim_cache[id] = node;
				}
				node.lightbolts.push({
					name: name,
					life_time: setting.life_time,
					mesh: mesh,
					x1: x1,
					y1: y1,
					z1: z1,
					x2: x2,
					y2: y2,
					z2: z2,
					visibility: true
				});
				node.update = true;
			break;
		}
	},
	
	registerType(name, type){
		this.types[name] = type;
	}
};

ThreadHelp.registerForGame("client-liqhtbolt-timer", function(){
	for(let key in Lightbolt.anim_cache){
		let node = Lightbolt.anim_cache[key];
		
		for(let i in node.lightbolts){
			let lightbolt = node.lightbolts[i];
			lightbolt.life_time-=5;
			
			if(lightbolt.life_time < 0){
				lightbolt.visibility = false;
				node.update = true;
			}
		}
		
		node.update && Lightbolt.updateNode(node);
	}

}, 5 / 20 * 1000);

Network.addClientPacket("aw.lightbolt_update", function(lightbolts){
	for(let i in lightbolts)
		with(lightbolts[i]){
			Lightbolt.spawnClient(type, x1, y1, z1, x2, y2, z2);
		}
});
let NetworkLightbolt = {
	lightbolts: {},
	
	spawn(region, type, x1, y1, z1, x2, y2, z2){
		this.lightbolts[type+":"+x1+":"+y1+":"+z1+":"+x2+":"+y2+":"+z2] = {
			players: getVisibalePlayers(region, x1, y1, z1, RADIUS_VISIBILITY),
			type: type,
			x1: x1,
			y1: y1,
			z1: z1,
			x2: x2,
			y2: y2,
			z2: z2
		};
	},
	
	send(){
		let list = NetworkLightbolt.lightbolts;
		NetworkLightbolt.lightbolts = {};
		let send_players = {}
		
		for(let key in list){
			let lightbolt = list[key];
			
			for(let i in lightbolt.players){
				let player = lightbolt.players[i];
				
				send_players[player] = send_players[player] || [];
				
				send_players[player].push(lightbolt);
			}
			
			lightbolt.players = [];
		}
		
		for(let key in send_players){
			let client = Network.getClientForPlayer(Number(key));
			client && client.send("aw.lightbolt_update", send_players[key]);
		}
	}
};

ThreadHelp.registerForGame("server-liqhtbolt", NetworkLightbolt.send, 500);

Callback.addCallback("LevelLeft", function(){
	NetworkLightbolt.lines = {};
});

function LightboltType(name, setting){
	setting.animation_cache_type = setting.animation_cache_type || 0;
	setting.cache_count = setting.cache_count || 15;
	let mesh_cache = [];
	const rand = new Random();
	
	this.name = name;
	this.setting = setting;
	
	this.rebuildCache = function(){
		mesh_cache = [];
		if(!setting.radius || setting.radius <= 0) return;
		
		for(let i = 0;i < setting.cache_count;i++)
			mesh_cache.push(buildLightboltMeshForRadius(setting.radius, setting));
	}
	
	this.rebuildCache();
	
	this.getLightboltMesh = function(x1, y1, z1, x2, y2, z2){
		if(setting.radius)
			return mesh_cache[rand.nextInt(mesh_cache.length)];
		
		const dx = x2-x1;
		const dy = y2-y1;
		const dz = z2-z1;
	
		const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
		
		return buildLightboltMeshForRadius(radius, setting);
	}
	
	this.spawnClient = function(pos1, pos2){
		this.spawnFullClient(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
	}
	
	this.spawnServer = function(region, pos1, pos2){
		this.spawnFullServer(region, pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
	}
	
	this.spawnFullClient = function(x1, y1, z1, x2, y2, z2){
		Lightbolt.spawnClient(name, x1, y1, z1, x2, y2, z2);
	}
	
	this.spawnFullServer = function(region, x1, y1, z1, x2, y2, z2){
		NetworkLightbolt.spawn(region, name, x1, y1, z1, x2, y2, z2);
	};
	
	this.spawn = this.spawnFullServer;
	
	Lightbolt.registerType(name, this);
}

/*

Пример

let test = new LightboltType("test", {
	//отрисовка
	animation_cache_type: 1,
	life_time: 70,
	size: 1/16,
	
	//изломы
	count_kink: 10,
	kink_strength: 4,
	chance_branching: .4,
	branching_z_modification: [.5, 1.1],
	
	//хеширование меша
	cache_count: 15,
	radius: 5//если указано, то длина молнии постоянно одинаковая, но модель хешируется, благодаря чему отрисовка начинается быстрее
});

Callback.addCallback("ItemUse", function(pos, item, block, is, player){
	centerBlockPos(pos);
	test.spawnServer(
		BlockSource.getDefaultForActor(player),
		pos, randPos(pos, 5)
	);
});
*/