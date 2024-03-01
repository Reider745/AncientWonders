function angleFor2dVector(x1, y1, x2, y2){
	let v = Math.acos((x1*x2+y1*y2) / (Math.sqrt(x1 * x1 + y1 * y1)*Math.sqrt(x2 * x2 + y2 * y2)))
	return isNaN(v) ? 0 : v;
}

function angleFor3dVector(x1, y1, z1, x2, y2, z2){
	let v = Math.acos((x1*x2+y1*y2+z1*z2) / (Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1)*Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2)));
	return isNaN(v) ? 0 : v;
}

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

const step = 30;
const polygon_count = 20;

const points_polygon = (function(){
	let points = [];
		
	for(let p = 0;p <= polygon_count;p++)
		points.push(getPosPolygon(.05, p, polygon_count));
		
	return points;
})();
const index_pre = polygon_count-1;

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
			
			if((p+1) % 2 == 0){
				mesh.addVertex(pos.x, pos.y, vz);
				pos = points_polygon[p-1];
				mesh.addVertex(pos.x, pos.y, post);
			}else{
				let pre_pos = points_polygon[p-1];
				mesh.addVertex(pre_pos.x, pre_pos.y, vz);
					
				mesh.addVertex(pre_pos.x, pre_pos.y, vz);
				mesh.addVertex(pre_pos.x, pre_pos.y, post);
				mesh.addVertex(pos.x, pos.y, post);
				
				mesh.addVertex(pos.x, pos.y, vz);
				mesh.addVertex(pos.x, pos.y, post);
			}
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
	
	const angleXZ = angleFor2dVector(0, radius, dx, dz);
	
	if(dx == 0 && dz == 0)
		var angleY = Math.PI/2;
	else
		var angleY = angleFor3dVector(dx, 0, dz, dx, dy, dz);
	
	mesh.rotate(0 < y2-y1 ? -angleY : angleY, 0 < x2-x1 ? -angleXZ : angleXZ, 0);
	mesh.translate(x1, y1, z1);
	
	return mesh;
}

let SingularityLines = {
	lines: {},
	
	buildKey(x1, y1, z1, x2, y2, z2){
		return x1+":"+y1+":"+z1+":"+x2+":"+y2+":"+z2;
	},
	
	add(x1, y1, z1, x2, y2, z2){
		let key = this.buildKey(x1-.5, y1-.5, z1-.5, x2-.5, y2-.5, z2-.5);
		let obj = {visibility: false, mesh: buildLineMesh(x1, y1, z1, x2, y2, z2), key: key}
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
	
	animation: new Animation.Base(0, 0, 0),
	mesh: new RenderMesh(),
	
	update(){ 
		this.mesh.clear();
		let i = 0;
		for(let key in this.lines){
			let obj = this.lines[key];
			if(obj.visibility){
				this.mesh.addMesh(obj.mesh, 0, 0, 0);
				i++;
			}
		}
		this.animation.describe({
			mesh: this.mesh,
			material: "aspects_transfer_aw"
		});
		
		this.animation.load();
	},
	Client(){
		let lines = [];
		let lines_ = {};
		
		this.events = {
			addLine(data){
				let line = SingularityLines.add(this.x+.5, this.y+.5, this.z+.5, data.x+.5, data.y+.5, data.z+.5);
				lines.push(line);
				lines_[line.key] = line;
			},
			visibility(data){
				for(let i in data.lines){
					let pos = data.lines[i];
					lines_[SingularityLines.buildKey(this.x, this.y, this.z, pos.x, pos.y, pos.z)].visibility = data.status;
				}
				SingularityLines.update();
			}
		}
		
		this.unload = function(){
			for(let i in lines)
				SingularityLines.remove(lines[i].key);
		}
	},
	
	addLineForTile(tile, x, y, z){
		tile.networkEntity.send("addLine", {x: x, y: y, z: z});
	},
	
	visibilityLineForTile(tile, lines){
		tile.networkEntity.send("visibility", {lines: lines, status: true});
	},
	
	hidenLineForTile(tile, lines){
		tile.networkEntity.send("visibility", {lines: lines, status: false});
	}
};

/*let coords_item_use = [0, 0, 0];
let first = true;
let animation_ = new Animation.Base(0, 0, 0);

Callback.addCallback("ItemUse", function(coords, item, block, is, player){
	if(item.id != 263) return;
	
	if(first){
		coords_item_use = coords;
		first = false;
	}else{
		let mesh = buildLineMesh(coords_item_use.x+.5, coords_item_use.y+.5, coords_item_use.z+.5, coords.x+.5, coords.y+.5, coords.z+.5);
		
		animation_.describe({
			mesh: mesh,
			material: "aspects_transfer_aw"
		});
		animation_.load();
		
		first = true;
	}
});*/

const base_transfer = function(output, tile){
//	let angle = Entity.get
	//if(World.getThreadTime() % 20 == 0)
		//ParticlesAPI.spawnLine(ParticlesAPI.part2, tile.x, tile.y, tile.z, output.x, output.y, output.z, 15, tile.dimension);
}
let SingularityAPI = {
	input: {},
	output: {},
	
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
	
	getTiles(arr, region){
		let tiles = [];
		for(let i in arr){
			let tile = World.getTileEntity(arr[i].x, arr[i].y, arr[i].z, region);
			if(!tile) tile = World.addTileEntity(arr[i].x, arr[i].y, arr[i].z, region)
			tiles.push(tile);
		}
		return tiles;
	},
	transfersBlock(tile, tiles, value, func){
		if(tile.data.aspect - value > 0 && tiles && tiles.blockSource && tiles.data.aspect+value <= tiles.data.aspectMax){
			tile.data.aspect-=value;
			tiles.data.aspect+=value;
			
			func(tiles, tile);
			return true;
		}
		return false;
	},
	
	init(tile){
		let arr = tile.data.arr || [];
		for(let i in arr){
			let pos = arr[i];
			SingularityLines.addLineForTile(tile, pos.x, pos.y, pos.z);
		}
	}, 
	
	transfers(tile, value, func){
		let arr = tile.data.arr || [];
		value /= arr.length;
		
		let visilibity = [];
		let hiden = [];
		
		for(let i in arr){
			let pos = arr[i];
			
			if(this.transfersBlock(tile, World.getTileEntity(pos.x, pos.y, pos.z, tile.blockSource), value, func))
				visilibity.push(pos);
			else
				hiden.push(pos);
		}
		
		if(World.getThreadTime() % 20 == 0){
			SingularityLines.visibilityLineForTile(tile, visilibity);
			SingularityLines.hidenLineForTile(tile, hiden);
		}
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
		
		SingularityLines.addLineForTile(tile, pos.x, pos.y, pos.z);
		tile.data.arr.push(pos);
	},
	
	getDistante(p1, p2){
		return Math.sqrt(Math.pow(p1.x+.5 - p2.x+.5, 2) + Math.pow(p1.y+.5 - p2.y+.5, 2) + Math.pow(p1.z+.5 - p2.z+.5, 2));
	},
	
	itemUse(player, item, block, count, coords, bool){
		bool = bool || false;
		let region = BlockSource.getDefaultForActor(player);
		if(!Entity.getSneaking(player) && item.id == ItemID.staff_singularity && this.isOutputs("base", block)){
			item.extra = item.extra || new ItemExtraData();
			let pos = {
				x: item.extra.getInt("x", 0),
				y: item.extra.getInt("y", 0),
				z: item.extra.getInt("z", 0)
			};
			if(this.getDistante(pos, coords) > count || !this.isInputs("base", region.getBlockId(pos.x, pos.y, pos.z))){
				Mp.tipMessage(player, TranslationLoad.get("aw.tip_message.binding_staff_singularity_error", [["value", count]]));
				return null;
			}
			if(bool)
				Mp.tipMessage(player, Translation.translate("aw.tip_message.binding_staff_singularity"))
			return pos;
		}
		return null;
	}
};
