//r - радиус
//i - индекс
//n - количество точек

function getPosPolygon(r, i, n){
	let fraction = (2 * Math.PI * i) / n;
	return {
		x: r * Math.cos(fraction),
		y: r * Math.sin(fraction)
	}
}

let step = 2;
let polygon_count = 14;
let line_radius = .05;

function rebuildCacheSingularityLine(){
	let points = [];
		
	for(let p = 0;p <= polygon_count;p++)
		points.push(getPosPolygon(line_radius, p, polygon_count));
		
	return points;
}

let points_polygon = rebuildCacheSingularityLine();
let index_pre = polygon_count-1;

let FUNCS_MESH = [
	function(mesh, pos, pre_pos, vz, post){
		mesh.addVertex(pos.x, pos.y, vz);
		mesh.addVertex(pre_pos.x, pre_pos.y, post);
	},
	function(mesh, pos, pre_pos, vz, post){
		mesh.addVertex(pre_pos.x, pre_pos.y, vz);
					
		mesh.addVertex(pre_pos.x, pre_pos.y, vz);
		mesh.addVertex(pre_pos.x, pre_pos.y, post);
		mesh.addVertex(pos.x, pos.y, post);
				
		mesh.addVertex(pos.x, pos.y, vz);
		mesh.addVertex(pos.x, pos.y, post);
	}
];

function buildLineMesh(x1, y1, z1, x2, y2, z2){
	const mesh = new RenderMesh();
	
	const dx = x2-x1;
	const dy = y2-y1;
	const dz = z2-z1;
	
	const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
	
	const move = radius/step;
	let vz = 0;
	
	for(let i = 0;i < step;i++){
		let post = vz + move;
		
		let pos = points_polygon[0];
		mesh.addVertex(pos.x, pos.y, vz);
		mesh.addVertex(pos.x, pos.y, post);
		
		for(let p = 1;p < polygon_count;p++){
			let pos = points_polygon[p];
			
			mesh.addVertex(pos.x, pos.y, vz);
			mesh.addVertex(pos.x, pos.y, post);
			
			FUNCS_MESH[(p+1) % 2](mesh, pos, points_polygon[p-1], vz, post)
		}
		
		let pre_pos = points_polygon[index_pre];
		pos = points_polygon[polygon_count];
		
		mesh.addVertex(pos.x, pos.y, vz);
		mesh.addVertex(pos.x, pos.y, post);
		mesh.addVertex(pre_pos.x, pre_pos.y, vz);
					
		mesh.addVertex(pre_pos.x, pre_pos.y, vz);
		mesh.addVertex(pre_pos.x, pre_pos.y, post);
		mesh.addVertex(pos.x, pos.y, post);
		
		vz = post;
	}
	
	rotateMesh(mesh, x1, x2, y1, y2, dx, dy, dz, radius);
	mesh.translate(x1, y1, z1);
	
	return mesh;
}

let SingularityLines = {
	lines: {},
	
	buildKey(x1, y1, z1, x2, y2, z2){
		return x1+":"+y1+":"+z1+":"+x2+":"+y2+":"+z2;
	},
	
	add(dim, x1, y1, z1, x2, y2, z2){
		let key = this.buildKey(x1-.5, y1-.5, z1-.5, x2-.5, y2-.5, z2-.5);
		let obj = {visibility: false, mesh: buildLineMesh(x1, y1, z1, x2, y2, z2), key: key, dim: dim, x1: x1, y1: y1, z1: z1, x2: x2, y2: y2, z2: z2}
		this.lines[key] = obj;
		return obj;
	},
	
	can(key){
		return !!this.lines[key];
	},
	
	remove(key){
		delete this.lines[key];
	},
	
	setVisibility(key, value){
		if(this.lines[key])
			this.lines[key].visibility = value;
	},
	
	rebuildCache(){
		for(let key in this.lines){
			let line = this.lines[key];
			with(line){
				line.mesh = buildLineMesh(x1, y1, z1, x2, y2, z2);
			}
		}
		
		this.update();
	},
	
	animation: new Animation.Base(0, 0, 0),
	mesh: new RenderMesh(),
	
	update(){ 
		this.mesh.clear();
		let is = Player.getArmorSlot(GLASSEES_SLOT).id == ItemID.aw_glasses && Player.getCarriedItem().id == ItemID.staff_singularity;
		let current_dim = Player.getDimension();
	
		for(let key in this.lines){
			let obj = this.lines[key];
			if(obj.dim == current_dim && (obj.visibility || is))
				this.mesh.addMesh(obj.mesh, 0, 0, 0);
		}
		
		this.animation.describe({
			mesh: this.mesh,
			material: "aspects_transfer_aw"
		});
		
		this.animation.load();
	},
	Client(){
		this.events = {
			addLine(data){
				let lines = this.lines = this.lines || {};
				let line = SingularityLines.add(this.dimension, this.x+.5, this.y+.5, this.z+.5, data.x+.5, data.y+.5, data.z+.5);
				lines[line.key] = line;
			},
			visibility(data){
				let lines = this.lines = this.lines || {};
				for(let i in data.lines){
					let line = data.lines[i];
					lines[line.key].visibility = data.status;
				}
				SingularityLines.update();
			},
			remove(data){
				SingularityLines.remove(data.key);
				let lines = this.lines = this.lines || {};
				delete lines[data.key];
			}
		}
		
		this.unload = function(){
			let lines = this.lines = this.lines || {};
			for(let key in lines)
				SingularityLines.remove(key);
		}
	},
	
	addLineForTile(tile, x, y, z){
		tile.networkEntity.send("addLine", {x: x, y: y, z: z});
	},
	
	removeLineForTile(tile, pos){
		tile.networkEntity.send("remove", pos);
	},
	
	visibilityLineForTile(tile, lines){
		tile.networkEntity.send("visibility", {lines: lines, status: true});
	},
	
	hidenLineForTile(tile, lines){
		tile.networkEntity.send("visibility", {lines: lines, status: false});
	}
};

void function(){
	const CONF = "singularity_";

	function initForConfig(config){
		step = config.get(CONF+"step");
		polygon_count = config.get(CONF+"polygon_count");
		line_radius = config.get(CONF+"line_radius");
		
		points_polygon = rebuildCacheSingularityLine();
		index_pre = polygon_count-1;
		
		SingularityLines.rebuildCache();
	}

	GraphicsSetting.register("Singularity lines", {
		init(config, builder){
			config.put(CONF+"step", step);
			config.put(CONF+"polygon_count", polygon_count);
			config.put(CONF+"line_radius", line_radius);
			
			builder.addSlider("Step", CONF+"step", 2, 14, 1);
			builder.addSlider("Polygon count", CONF+"polygon_count", 4, 60, 1);
			builder.addSlider("Line radius", CONF+"line_radius", .01, 1.5, .01);

			initForConfig(config);
		},
		change: initForConfig
	});
}();

Network.addClientPacket("aw.singularity_lines_update", function(lines){
	for(let key in lines)
		SingularityLines.setVisibility(key, lines[key]);
	SingularityLines.update();
});

let NetworkSingularity = {
	lines: {},
	
	visibilityLineForTile(tile, line){
		let lines = this.lines[tile.dimension] = this.lines[tile.dimension] || {};
		line.visibility = true;
		lines[line.key] = line;
	},
	
	hidenLineForTile(tile, line){
		let lines = this.lines[tile.dimension] = this.lines[tile.dimension] || {};
		line.visibility = false;
		lines[line.key] = line;
	},
	
	send(){
		let list = NetworkSingularity.lines;
		NetworkSingularity.lines = {};
		let players = Network.getConnectedPlayers();
		
		for(let key in list){
			let lines = list[key];
			let dimension = Number(key);
			
			for(let i in players){
				let player = players[i];
				let send = {};
				let pos = Entity.getPosition(player);
				
				if(Entity.getDimension(player) != dimension)
					continue;
					
				for(let a in lines){
					let line = lines[a];
					
					if(Math.sqrt(Math.pow(pos.x - line.x, 2) + Math.pow(pos.y - line.y, 2) + Math.pow(pos.z - line.z, 2)) < RADIUS_VISIBILITY)
						send[line.key] = line.visibility;
					else
						send[line.key] = false;
				}
				
				let client = Network.getClientForPlayer(player);
				client && client.send("aw.singularity_lines_update", send);
			}
		}
	}
};

ThreadHelp.registerForGame("server-singularity-lines", NetworkSingularity.send, 500);

Callback.addCallback("LevelLeft", function(){
	NetworkSingularity.lines = {};
});

const base_transfer = function(output, tile){
	if(World.getThreadTime() % 20 == 0)
		ParticlesAPI.spawnLine(ParticlesAPI.part2, tile.x, tile.y, tile.z, output.x, output.y, output.z, 15, tile.dimension);
}
let SingularityAPI = {
	input: {},
	output: {},
	
	registerTile(id, tile){
		let init = tile.init || function(){};
		let tick = tile.tick || function(){};
		let click = tile.click || function(){};
		
		tile.defaultValues = tile.defaultValues || {};
		tile.defaultValues.aspect = tile.defaultValues.aspect || 0;
		tile.defaultValues.aspectMax = tile.defaultValues.aspectMax || 50;
		
		function extended(obj, add){
			for(let key in add){
				let value = add[key];
				let value_org = obj[key];
			
				if(!value_org){
					obj[key] = value
					continue;
				}
			
				if(typeof value_org == "function")
					obj[key] = function(){
						value.apply(this, arguments);
						value_org.apply(this, arguments);
					}
				else if(!Array.isArray(value_org))
					extended(value_org, value);
			}
		}
		
		let client = tile.client || {};
		extended(client, new SingularityLines.Client());
		tile.client = client;
		
		tile.init = function(){
			SingularityAPI.init(this);
			init.apply(this, arguments);
		}
		
		let transfee_max = tile.transfee_max || 2;
		tile.tick = function(){
			SingularityAPI.transfers(this, transfee_max, base_transfer);
			tick.apply(this, arguments);
		}
		
		tile.click = function(id, count, data, coords, player){
			SingularityAPI.click(this, coords, player);
			click.apply(this, arguments);
		}
		
		tile.isOutput && this.setBlockOutputName(id, tile.output_name || "base", true);
		tile.isInput && this.setBlockInputName(id, tile.input_name || "base", true);
		TileEntity.registerPrototype(id, tile);
	},
	
	setBlockInputName: function(id, name, bool){
		this.input[name] = this.input[name] || {};
		this.input[name][id] = bool;
	},
	setBlockOutputName: function(id, name, bool){
		this.output[name] = this.output[name] || {};
		this.output[name][id] = bool;
	},
	
	isInputs(name, id){
		return this.input[name] && this.input[name][id];
	},
	isOutputs(name, id){
		return this.output[name] && this.output[name][id];
	},
	
	transfersBlock(tile, tiles, value, pos){
		if(tile.data.aspect - value > 0 && tiles.blockSource && tiles.data.aspect+value <= tiles.data.aspectMax){
			tile.data.aspect-=value;
			tiles.data.aspect+=value;
			
			tile.data.activated = World.getThreadTime();
			return NetworkSingularity.visibilityLineForTile(tile, pos);
		}
		if(!tile.data.activated || World.getThreadTime() - tile.data.activated > 20)
			NetworkSingularity.hidenLineForTile(tile, pos);
	},
	
	init(tile){
		let arr = tile.data.arr || [];
		for(let i in arr){
			let pos = arr[i];
			SingularityLines.addLineForTile(tile, pos.x, pos.y, pos.z);
		}
	}, 
	
	transfers(tile, value){
		let tiles = [];
		let arr = tile.data.arr || [];
		value /= arr.length;
		
		for(let i in arr){
			let pos = arr[i];
			
			let input = World.getTileEntity(pos.x, pos.y, pos.z, tile.blockSource);
			if(input && this.isInputs("base", input.blockID)){
				this.transfersBlock(tile, input, value, pos);
				tiles.push(pos);
			}else
				SingularityLines.removeLineForTile(tile, pos);
		}
		
		tile.data.arr = tiles;
	},
	
	click(tile, coords, player){
		tile.data.arr = tile.data.arr || []
		let pos = SingularityAPI.itemUse(player, Entity.getCarriedItem(player), tile.blockID, 3, coords, true);
		if(!pos) 
			return;
			
		for(let i in tile.data.arr){
			let pos_ = tile.data.arr[i];
			if(pos_.x == pos.x && pos_.y == pos.y && pos_.z == pos.z)
				return;
		}

		pos.key = SingularityLines.buildKey(tile.x, tile.y, tile.z, pos.x, pos.y, pos.z);
		SingularityLines.addLineForTile(tile, pos.x, pos.y, pos.z);
		tile.data.arr.push(pos);
	},
	
	getPosForStaff(extra){
		return  {
			x: extra.getInt("x", 0),
			y: extra.getInt("y", 0),
			z: extra.getInt("z", 0)
		};
	},
	
	itemUse(player, item, block, count, coords, bool){
		bool = bool || false;
		let region = BlockSource.getDefaultForActor(player);
		if(!Entity.getSneaking(player) && item.id == ItemID.staff_singularity && this.isOutputs("base", block)){
			let pos = this.getPosForStaff(item.extra || new ItemExtraData());
			if(Entity.getDistanceBetweenCoords(pos, coords) > count || !this.isInputs("base", region.getBlockId(pos.x, pos.y, pos.z))){
				translateTipMessage(player, "aw.tip_message.binding_staff_singularity_error", [["value", count]]);
				return null;
			}
			if(bool)
				translateTipMessage(player, "aw.tip_message.binding_staff_singularity");
			return pos;
		}
		return null;
	}
};
