const base_transfer = function(output, tile){
	if(World.getThreadTime() % 20 == 0)
		ParticlesAPI.spawnLine(ParticlesAPI.part2, tile.x, tile.y, tile.z, output.x, output.y, output.z, 15, tile.dimension);
}
var SingularityAPI = {
	getOutputBlock: function(name, x, y, z, r, region, noyblock){
		noyblock = noyblock || [];
		return SingularityAPIJava.getOutputBlock(name,x,y,z,r,region, noyblock);
	},
	getInputBlock: function(name, x, y, z, r, region, noyblock){
		noyblock = noyblock || [];
		return SingularityAPIJava.getInputBlock(name,x,y,z,r,region, noyblock);
	},
	setBlockInputName: function(id, name, bool){
		SingularityAPIJava.setBlockInputName(id, name, bool)
	},
	setBlockOutputName: function(id, name, bool){
		SingularityAPIJava.setBlockOutputName(id, name, bool);
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
		if(tile.data.aspect - value <= 0) return;
		if(tiles) if(tiles.blockSource) if(tiles.data.aspect+value<=tiles.data.aspectMax){
			tile.data.aspect-=value;
			tiles.data.aspect+=value;
			func(tiles, tile)
		}
	},
	transfers(tile, tiles, value, func){
		for(let i in tiles){
			if(tile.data.aspect - value <= 0) return;
			if(tiles[i]) if(tiles[i].blockSource) if(tiles[i].data.aspect+value<=tiles[i].data.aspectMax){
				tile.data.aspect-=value;
				tiles[i].data.aspect+=value;
				func(tiles[i], tile)
			} 
		}
	},
	getDistante(p1, p2){
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
	},
	itemUse(player, item, block, count, coords, bool){
		bool = bool || false;
		if(Entity.getSneaking(player)&&item.id==ItemID.staff_singularity&&SingularityAPIJava.isInputs("output",block)){
			item.extra = item.extra || new ItemExtraData();
			let pos = {
				x: item.extra.getInt("x", 0),
				y: item.extra.getInt("y", 0),
				z: item.extra.getInt("z", 0)
			};
			if(this.getDistante(pos, coords) > count){
				Mp.tipMessage(player, Translation.translate("aw.tip_message.binding_staff_singularity_error")+count)
				return {x:0,y:0,z:0};
			}
			if(bool)
				Mp.tipMessage(player, Translation.translate("aw.tip_message.binding_staff_singularity"))
			return pos;
		}
		return {
			x: 0,
			y: 0,
			z: 0
		};
	}
};
