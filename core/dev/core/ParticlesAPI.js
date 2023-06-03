Math.sign = Math.sign || function(x) {
	x = +x;
	if(x === 0)
		return x; 
	return x > 0 ? -0.1 : 0.1; 
}

Network.addClientPacket("aw.game.tipMessage", function(packetData) {
	Game.tipMessage(packetData);
});

var Mp = {
	spawnParticle(type, x, y, z, vx, vy, vz, ax, ay, az, dim){
		ParticlesCore.spawnParticle(dim, type, x, y, z, vx, vy, vz);
	},
	spawnArrayParticle(array, dim){
		ParticlesCore.spawnParticles(dim, array);
	},
	tipMessage(player, text){
		let client = Network.getClientForPlayer(player);
		if(client)
			client.send("aw.game.tipMessage", text);
	}
};

let ParticlesType = {};

let color = {
  r: 0,
  g: 0,
  b: 0
};
Callback.addCallback("LocalTick", function(){
  color.r = color.r + .0125 <= 1 ? color.r + .0125 : 0;
  color.g = color.g + .0025 <= 1 ? color.g + .0025 : 0;
  color.b = color.b + .025 <= 1 ? color.b + .025 : 0;
   Particles.getParticleTypeById(ParticlesType.colors).setColor(color.r, color.g, color.b, 1);
 Particles.getParticleTypeById(ParticlesType.indicator).setColor(color.r, color.g, color.b, 1);
});

ParticlesStorage.setGroup("aw").add("aspect_particle", Particles.registerParticleType({
	texture: "aspect_particle",
	render: 3,
	size: [2, 4],
	lifetime: [80, 100], 
	animators: {
		size:{fadeOut: .5, fadeIn:0.2, start:0.8, end:0},
		icon: {start: 0, end: 1, period: 19, fadeIn: 1}
	}
})).add("magic_particle", Particles.registerParticleType({
	texture: "magic_particle",
	render: 3,
	size: [2, 4],
	lifetime: [80, 100], 
	animators: {
		size:{fadeOut: .5, fadeIn:0.2, start:0.8, end:0},
		icon: {start: 0, end: 1, period: 19, fadeIn: 1}
	}
})).add("singularity_particle", Particles.registerParticleType({
	texture: "singularity_particle",
	render: 3,
	size: [2, 4],
	lifetime: [80, 100], 
	animators: {
		size:{fadeOut: .5, fadeIn:0.2, start:0.8, end:0},
		icon: {start: 0, end: 1, period: 19, fadeIn: 1}
	}
})).add("colors", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime: [50, 50],
	color: [color.r, color.g, color.b, 1],
	animators: {
		size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
	}
})).add("snow", Particles.registerParticleType({
	texture: "aw_snowgrave_0",
	render: 2,
	size: [2, 2],
	lifetime: [30, 40],
	animators: {
		size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
	}
})).add("snowProjectTile", Particles.registerParticleType({
	texture: "aw_snowgrave_2",
	render: 2,
	size: [2, 2],
	lifetime: [100, 100],
	animators: {
		size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
	}
})).add("indicator", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime: [1000, 1000],
	color: [color.r, color.g, color.b, 1],
	animators: {
		size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
	}
})).add("ProjectTile", Particles.registerParticleType({
	texture: "project",
	render: 2,
	size: [8, 8],
	lifetime:[100, 100],
	animators: {
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("project", Particles.registerParticleType({
	texture: "project",
	render: 2,
	size: [2, 2],
	lifetime:[3, 3],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("project2", Particles.registerParticleType({
	texture: "project",
	render: 2,
	size: [8, 8],
	lifetime:[3, 3],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part1", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime:[50, 50],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part1Colision", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [10, 20],
	lifetime:[50, 55],
	collision: true,
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part2", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime:[50, 50],
	color: [84, 5, 5, 1],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part3", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime:[50, 50],
	color: [255, 255, 0, 1],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part4", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime:[50, 50],
	color: [227, 0, 72, 1],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part5", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime:[1,1],
	color: [227, 0, 72, 1] 
})).add("part_singularity", Particles.registerParticleType({
	texture: "aw_singularity",
	render: 2,
	size:[4, 4],
	lifetime: [30, 30],
	color: [10/255, 10/255, 110/255, 1],
	animators: {
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("fog", Particles.registerParticleType({
	texture: "aw_fog",
	render: 2,
	size: [8, 12],
	lifetime: [500, 550],
	animators: {
		size: {fadeOut: .1, fadeln:.1, start: 0, end: 0}
 	}
})).setGroup(null);

var ParticlesAPI = {
	getVector(pos1, pos2){
		return ParticlesCore.getVector(pos1, pos2);
	},
	coords(part, x1, y1, z1, x2, y2, z2, time, dim){
		ParticlesCore.spawnCoords(dim, part, x1, y1, z1, x2, y2, z2, time)
	},
	spawnLine(part, x1, y1, z1, x2, y2, z2, count, dim){
		ParticlesCore.spawnLine(dim, part, x1+.5, y1+.5, z1+.5, x2+.5, y2+.5, z2+.5, count);
	},
	spawnCircle(particles, x, y, z, radius, count, rotation, dim){
		let angle = 0;
		let step = 360 / count;
		let group = new ParticlesCore.Group();
		if(rotation == 0){
			for(i = 0;i < 360;i+=step){
				let x1 = x + radius * Math.cos(i);
				let y1 = y - radius * Math.sin(i);
				group.add(particles, x1 + 0.5, y1 + 0.5, z + 0.5);
			}
		}else if(rotation == 1){
			for(i = 0;i < 360;i+=step){
				let z1 = z + radius * Math.cos(i);
				let y1 = y - radius * Math.sin(i);
				group.add(particles, x + 0.5, y1 + 0.5, z1 + 0.5);
			}
		}else if(rotation == 2){
			for(i = 0;i < 360;i+=step){
				let x1 = x + radius * Math.cos(i);
				let z1 = z - radius * Math.sin(i);
				group.add(particles, x1 + 0.5, y + 0.5, z1 + 0.5);
			}
		}
		group.send(dim);
	},
	spawnCircleClient(particles, x, y, z, radius, count, rotation){
		let angle = 0;
		let step = 360 / count;
		if(rotation == 0){
			for(i = 0;i < 360;i+=step){
				let x1 = x + radius * Math.cos(i);
				let y1 = y - radius * Math.sin(i);
				Particles.addParticle(particles, x1 + 0.5, y1 + 0.5, z + 0.5, 0, 0, 0);
			}
		}else if(rotation == 1){
			for(i = 0;i < 360;i+=step){
				let z1 = z + radius * Math.cos(i);
				let y1 = y - radius * Math.sin(i);
				Particles.addParticle(particles, x + 0.5, y1 + 0.5, z1 + 0.5, 0, 0, 0);
			}
		}else if(rotation == 2){
			for(i = 0;i < 360;i+=step){
				let x1 = x + radius * Math.cos(i);
				let z1 = z - radius * Math.sin(i);
				Particles.addParticle(particles, x1 + 0.5, y + 0.5, z1 + 0.5, 0, 0, 0);
			}
		}
	},
	spawnCircleVector(time, particle, x, y, z, radius, count, dim){
		let angle = 0;
		let step = 360 / count;
		let group = new ParticlesCore.Group();
		for(i = 0;i < 360;i+=step){
			let x1 = x + radius * Math.cos(i);
			let z1 = z - radius * Math.sin(i);
			group.add(particles, x1 + 0.5, y + 0.5, z1 + 0.5, -Math.sign(x1 - x), 0, -Math.sign(z1 - z));
		}
		group.send(dim);
	},
	spawnShellEnt(part, ent, distante, damage){
		let pos = Entity.getPosition(ent);
		let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(ent));
		let region = BlockSource.getDefaultForActor(ent);
		let group = new ParticlesCore.Group();
		for(let i = 0;i<distante;i++){
			let coord = {
				x: pos.x+(i * vel.x / 2),
				y: pos.y+0.5+(i * vel.y / 2),
				z: pos.z+(i * vel.z / 2)
			};
			let ent3 = Entity.getAllInRange(coord, 2);
			for(let i1 in ent3)
				if(ent3[i1] != ent)
					MagicCore.damage(ent3[i1], "magic", damage);
			if(region.getBlockId(coord.x,coord.y,coord.z)!=0)
				break;
			group.add(part, coord.x, coord.y, coord.z);
		}
		group.send(region);
	},
	spawnCircle2(particles, x, y, z, radius, count, time){
		let circle = 0;
		for(let i = 0;i<=count;i++){
			setTimeout(function(){
				let x1 = x + radius * Math.cos(circle);
				let z1 = z - radius * Math.sin(circle);
				Mp.spawnParticle(particles, x1 + 0.5, y + 0.5, z1 + 0.5, 0, 0, 0);
				circle+=360/count/i;
			}, time * i * 2);
		}
	},
};
(function(){
	let all = ParticlesStorage.getAll("aw");
	for(let i in all){
		ParticlesAPI[all[i]] = all[i];
		ParticlesType[all[i]] = ParticlesStorage.get(all[i]);
	}
})();