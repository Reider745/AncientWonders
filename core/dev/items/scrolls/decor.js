let decor = Wands.registerSrollDecoration(ItemID.decor1);
decor.addType("usingReleased", function(packet){
	let pos = packet.coords;
	let dim = Entity.getDimension(packet.entity);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x-.5, pos.y-.5, pos.z-.5, 0.5, 11, 2, dim);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x-.5, pos.y-0.8-.5, pos.z-.5, 0.7, 11, 2, dim);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x-.5, pos.y-0.3 - .5, pos.z-.5, 1.1, 11, 2, dim);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x-.5, pos.y-0.1-.5, pos.z-.5, 1.1, 11, 2, dim);
});
decor.addType("EntityInteract", function(packet){
	let pos = packet.coords;
	let dim = Entity.getDimension(packet.entity);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x -.5, pos.y-1+.3, pos.z-.5, 0.5, 11, 2, dim);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x -.6, pos.y-0.8+.3, pos.z-.5, 0.7, 11, 2, dim);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x - .5, pos.y-0.3+.3, pos.z-.5, 1.1, 11, 2, dim);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x -.5, pos.y-0.1+.3, pos.z-.5, 1.1, 11, 2, dim);
});
decor.addType("itemUse", function(packet){
	let pos = packet.coords;
	let dim = Entity.getDimension(packet.entity);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-1+2, pos.z, 0.5, 11, 2, dim);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.8+2, pos.z, 0.7, 11, 2, dim);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.3+2, pos.z, 1.1, 11, 2, dim);
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.1+2, pos.z, 1.1, 11, 2, dim);
});

decor = Wands.registerSrollDecoration(ItemID.decor2);
decor.addType("usingReleased", function(packet){
	let pos = packet.coords;
	let dim = Entity.getDimension(packet.entity);
	for(let i = 0;i <= 10;i++)
		ParticlesAPI.spawnCircle(ParticlesAPI.part4, pos.x-.5, pos.y+1-2.8, pos.z-.5, i / 2, 11 * i, 2, dim);
});
decor.addType("EntityInteract", function(packet){
	let pos = packet.coords;
	let dim = Entity.getDimension(packet.entity);
	for(let i = 0;i <= 10;i++)
		ParticlesAPI.spawnCircle(ParticlesAPI.part4, pos.x - .5, pos.y-.1, pos.z-.5, i / 2, 11 * i, 2, dim);
});
decor.addType("itemUse", function(packet){
	let dim = Entity.getDimension(packet.entity);
	let pos = packet.coords;
	for(let i = 0;i <= 10;i++)
		ParticlesAPI.spawnCircle(ParticlesAPI.part4, pos.x, pos.y+1, pos.z, i / 2, 11 * i, 2, dim);
});

decor = Wands.registerSrollDecoration(ItemID.decor3);
decor.addType("usingReleased", function(packet){
	let pos = packet.coords;
	let group = new ParticlesCore.Group();
	for(let i = 0;i <= 40;i++){
		let coords = {
			x: pos.x + (Math.random()*8 - Math.random()*8),
			y: pos.y + (Math.random()*8 - Math.random()*8),
			z: pos.z + (Math.random()*8 - Math.random()*8)
		};
		let v = ParticlesAPI.getVector(pos, coords);
		group.add(ParticlesAPI.part2, coords.x, coords.y, coords.z, (v.x / 50), (v.y / 50), (v.z / 50));
	}
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let pos = packet.coords;
	let group = new ParticlesCore.Group();
	for(let i = 0;i <= 40;i++){
		let coords = {
			x: pos.x + (Math.random()*8 - Math.random()*8),
			y: pos.y + (Math.random()*8 - Math.random()*8),
			z: pos.z + (Math.random()*8 - Math.random()*8)
		};
		let v = ParticlesAPI.getVector(pos, coords);
		group.add(ParticlesAPI.part2, coords.x, coords.y, coords.z, (v.x / 50), (v.y / 50), (v.z / 50));
	}
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let pos = packet.coords;
	let group = new ParticlesCore.Group();
	for(let i = 0;i <= 40;i++){
		let coords = {
			x: pos.x + (Math.random()*8 - Math.random()*8),
			y: pos.y + (Math.random()*8 - Math.random()*8),
			z: pos.z + (Math.random()*8 - Math.random()*8)
		};
		let v = ParticlesAPI.getVector(pos, coords);
		group.add(ParticlesAPI.part2, coords.x, coords.y, coords.z, (v.x / 50), (v.y / 50), (v.z / 50));
	}
	group.send(Entity.getDimension(packet.entity));
});

decor = Wands.registerSrollDecoration(ItemID.decor5);
decor.addType("usingReleased", function(packet){
	let vector = Entity.getLookVector(packet.entity);
	let coords = packet.coords;
  coords.x -= vector.x * 4;
  coords.y -= vector.y * 4;
  coords.z -= vector.z * 4;
  let group = new ParticlesCore.Group();
  for(let r = 0;r <= 20;r++)
  	group.add(ParticlesAPI.colors, coords.x+((Math.random()*5)-(Math.random()*5)), coords.y, coords.z+((Math.random()*5)-(Math.random()*5)), vector.x / 4, vector.y / 4, vector.z / 4, 0, 0, 0);
  group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let vector = Entity.getLookVector(packet.entity);
	let coords = packet.coords;
  coords.x -= vector.x * 4;
  coords.y -= vector.y * 4;
  coords.z -= vector.z * 4;
  let group = new ParticlesCore.Group();
  for(let r = 0;r <= 20;r++)
  	group.add(ParticlesAPI.colors, coords.x+((Math.random()*5)-(Math.random()*5)), coords.y, coords.z+((Math.random()*5)-(Math.random()*5)), vector.x / 4, vector.y / 4, vector.z / 4, 0, 0, 0);
  group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let vector = Entity.getLookVector(packet.entity);
	let coords = packet.coords;
  coords.x -= vector.x * 4;
  coords.y -= vector.y * 4;
  coords.z -= vector.z * 4;
  let group = new ParticlesCore.Group();
  for(let r = 0;r <= 20;r++)
  	group.add(ParticlesAPI.colors, coords.x+((Math.random()*5)-(Math.random()*5)), coords.y, coords.z+((Math.random()*5)-(Math.random()*5)), vector.x / 4, vector.y / 4, vector.z / 4, 0, 0, 0);
  group.send(Entity.getDimension(packet.entity));
});

decor = Wands.registerSrollDecoration(ItemID.decor4);
decor.addType("usingReleased", function(packet){
	let coords = packet.coords;
	coords.x+=.5;
  coords.y+=1-2.3;
  coords.z+=.5;
  let step = 360 / 100;
  let group = new ParticlesCore.Group();
  for(i = 0;i < 360;i+=step){
  	let x = coords.x + (i/20) * Math.cos(i / 8);
    let z = coords.z - (i/20) * Math.sin(i / 8);
    group.add(ParticlesAPI.colors, x, coords.y, z, 0, 0.0001*i, 0, 0, 0, 0);
  }
  group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let coords = packet.coords;
	coords.x+=.5;
  coords.y+=1;
  coords.z+=.5;
  let step = 360 / 100;
  let group = new ParticlesCore.Group();
  for(i = 0;i < 360;i+=step){
  	let x = coords.x + (i/20) * Math.cos(i / 8);
    let z = coords.z - (i/20) * Math.sin(i / 8);
    group.add(ParticlesAPI.colors, x, coords.y, z, 0, 0.0001*i, 0, 0, 0, 0);
  }
  group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let coords = packet.coords;
	coords.x+=.5;
  coords.y+=1;
  coords.z+=.5;
  let step = 360 / 100;
  let group = new ParticlesCore.Group();
  for(i = 0;i < 360;i+=step){
  	let x = coords.x + (i/20) * Math.cos(i / 8);
    let z = coords.z - (i/20) * Math.sin(i / 8);
    group.add(ParticlesAPI.colors, x, coords.y, z, 0, 0.0001*i, 0, 0, 0, 0);
  }
  group.send(Entity.getDimension(packet.entity));
});

decor = Wands.registerSrollDecoration(ItemID.decor6);
decor.addType("usingReleased", function(packet){
	playAnimation(packet.player, "animation.aw.decor.one", 3)
});
decor.addType("EntityInteract", function(packet){
	playAnimation(packet.player, "animation.aw.decor.one", 3)
});
decor.addType("itemUse", function(packet){
	playAnimation(packet.player, "animation.aw.decor.one", 3)
});

decor = Wands.registerSrollDecoration(ItemID.decor7);
decor.addType("usingReleased", function(packet){
	let pos = packet.coords;
	pos.y-=1.5;
	let group = new ParticlesCore.Group();
	for(let c = 0;c<=1;c++){
		let step = 360 / 60+(Math.floor(Math.random()*10));
		for(i = 0;i < 360;i+=step){
   	 let x = pos.x + .5 * Math.cos(i);
      let z = pos.z - .5 * Math.sin(i);
      let y = pos.y + Math.random() / 8;
      let vector = {
      	x: -(pos.x - x) / 3,
        y: -(pos.y - y) / 3,
        z: -(pos.z - z) / 3
      };
      group.add(ParticlesAPI.part1Colision, x, y, z, vector.x, vector.y, vector.z);
    }
	}
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let pos = packet.coords;
	pos.y-=.5;
	let group = new ParticlesCore.Group();
	for(let c = 0;c<=1;c++){
		let step = 360 / 60+(Math.floor(Math.random()*10));
		for(i = 0;i < 360;i+=step){
   	 let x = pos.x + .5 * Math.cos(i);
      let z = pos.z - .5 * Math.sin(i);
      let y = pos.y + Math.random() / 8;
      let vector = {
      	x: -(pos.x - x) / 3,
        y: -(pos.y - y) / 3,
        z: -(pos.z - z) / 3
      };
      group.add(ParticlesAPI.part1Colision, x, y, z, vector.x, vector.y, vector.z);
    }
	}
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let pos = packet.coords;
	pos.y+=1.5;
	pos.z+=.5;
	pos.x+=.5;
	let group = new ParticlesCore.Group();
	for(let c = 0;c<=1;c++){
		let step = 360 / 60+(Math.floor(Math.random()*10));
		for(i = 0;i < 360;i+=step){
   	 let x = pos.x + .5 * Math.cos(i);
      let z = pos.z - .5 * Math.sin(i);
      let y = pos.y + Math.random() / 8;
      let vector = {
      	x: -(pos.x - x) / 3,
        y: -(pos.y - y) / 3,
        z: -(pos.z - z) / 3
      };
      group.add(ParticlesAPI.part1Colision, x, y, z, vector.x, vector.y, vector.z);
    }
	}
	group.send(Entity.getDimension(packet.entity));
});
decor = Wands.registerSrollDecoration(ItemID.decor8);
decor.addType("usingReleased", function(packet){
	let group = new ParticlesCore.Group();
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.colors, packet.coords.x+Math.random(), packet.coords.y+Math.random(), packet.coords.z+Math.random(), 0, 0, 0);
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let group = new ParticlesCore.Group();
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.colors, packet.coords.x+Math.random(), packet.coords.y+Math.random(), packet.coords.z+Math.random(), 0, 0, 0);
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let group = new ParticlesCore.Group();
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.colors, packet.coords.x+Math.random(), packet.coords.y+Math.random(), packet.coords.z+Math.random(), 0, 0, 0);
	group.send(Entity.getDimension(packet.entity));
});
decor = Wands.registerSrollDecoration(ItemID.decor9);
decor.addType("usingReleased", function(packet){
	let pos = Entity.getPosition(packet.entity);
	let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
	let region = BlockSource.getDefaultForActor(packet.entity);
	let group = new ParticlesCore.Group();
	for(let i = 0;i<50;i++){
	 	let coord = {
	 	 	x: pos.x+(i * vel.x / 2),
	 	 	y: pos.y+(i * vel.y / 2),
	 	 	z: pos.z+(i * vel.z / 2)
		};
		if(region.getBlockId(coord.x,coord.y,coord.z) != 0){
			group.add(ParticlesAPI.indicator, coord.x-vel.x, coord.y-vel.y, coord.z-vel.z, 0, 0, 0);
			break;
		}
	}
	group.send(region);
});
decor.addType("EntityInteract", function(packet){
	let pos = Entity.getPosition(packet.entity);
	let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
	let region = BlockSource.getDefaultForActor(packet.entity);
	let group = new ParticlesCore.Group();
	for(let i = 0;i<50;i++){
	 	let coord = {
	 	 	x: pos.x+(i * vel.x / 2),
	 	 	y: pos.y+(i * vel.y / 2),
	 	 	z: pos.z+(i * vel.z / 2)
		};
		if(region.getBlockId(coord.x,coord.y,coord.z) != 0){
			group.add(ParticlesAPI.indicator, coord.x-vel.x, coord.y-vel.y, coord.z-vel.z, 0, 0, 0);
			break;
		}
	}
	group.send(region);
});
decor.addType("itemUse", function(packet){
	Mp.spawnParticle(ParticlesAPI.indicator, packet.coords.vec.x, packet.coords.vec.y, packet.coords.vec.z, 0, 0, 0, 0, 0, 0, Entity.getDimension());
});

decor = Wands.registerSrollDecoration(ItemID.decor10);
decor.addType("usingReleased", function(packet){
	let group = new ParticlesCore.Group();
	let pos = Entity.getPosition(packet.entity);
	let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.aspect_particle, pos.x-.5+Math.random(), pos.y-.5+Math.random(), pos.z-.5+Math.random(), vel.x/15, vel.y/15, vel.z/15);
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let group = new ParticlesCore.Group();
	let pos = Entity.getPosition(packet.player);
	let vel = ParticlesAPI.getVector(pos, Entity.getPosition(packet.entity));
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.aspect_particle, pos.x-.5+Math.random(), pos.y-.5+Math.random(), pos.z-.5+Math.random(), vel.x/15, vel.y/15, vel.z/15);
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let group = new ParticlesCore.Group();
	let pos = Entity.getPosition(packet.entity);
	let end = packet.coords;
	end.x+=.5;
	end.y+=.5;
	end.z+=.5;
	let vel = ParticlesAPI.getVector(Entity.getPosition(packet.entity), end);
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.aspect_particle, pos.x-.5+Math.random(), pos.y-.5+Math.random(), pos.z-.5+Math.random(), vel.x/15, vel.y/15, vel.z/15);
	group.send(Entity.getDimension(packet.entity));
});