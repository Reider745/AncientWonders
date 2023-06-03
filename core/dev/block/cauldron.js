IDRegistry.genBlockID("cauldronAw");
Block.createBlock("cauldronAw", [ {name: "aw.block.cauldron", texture: [["bowl", 1]], inCreative: true, renderlayer: 1} ]);

RenderAPI.setCauldron(BlockID.cauldronAw);
Block.setDestroyLevel("cauldronAw", 0);
ToolAPI.registerBlockMaterial(BlockID.cauldronAw, "stone", 0, false);

const cachedParticleTypes = []
function getParticleType(descriptor){
	const hash = new java.lang.String(JSON.stringify(descriptor)).hashCode()
	const cache = cachedParticleTypes[hash]
	if(cache !== undefined)
		return cache
	const type = Particles.registerParticleType({
 	 texture: "aw_magis",
	  render: 2,
  	size: [2, 2],
 	 lifetime: [50, 50],
 	 color: [descriptor.r/255, descriptor.g/255, descriptor.b/255, 1],
	  animators: {
  	  size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
 	 }
	});
	cachedParticleTypes[hash] = type;
	return type
}

Network.addClientPacket("aw.spawnCauldron", function(data){
	if(Entity.getDimension(Player.get()) != data.dimension)
		return;
	Particles.addParticle(getParticleType(data), data.x+Math.random(), data.y+1, data.z+Math.random(), 0, Math.random()/10, 0);
});

function spawnCauldron(dimension, x, y, z, r, g, b){
	Network.sendToAllClients("aw.spawnCauldron", {
		dimension: dimension,
		x: x,
		y: y,
		z: z,
		r: r,
		g: g,
		b: b
	});
}

TileEntity.registerPrototype(BlockID.cauldronAw, {
	defaultValues: {
		r: 0,
		g: 180,
		b: 244,
		items: [],
		wate: 0,
		heat: 0,
		particleId: 0,
	},
	client: {
		updateModel(){
			let r = this.networkData.getInt("r");
			let g = this.networkData.getInt("g");
			let b = this.networkData.getInt("b");
			let wate = this.networkData.getInt("wate");
			let mesh = (function(){
				let meshFile = new RenderMesh();
				meshFile.setColor(r/255,g/255,b/255, .8);
				if(wate >= 1)
					meshFile.importFromFile(__dir__ + "/assets/model/water_cauldron.obj", "obj", {
						scale: [.25, 0.00016 * wate, .25]
					});
				meshFile.fitIn(0, -2.1, 0, 1, 1, 1, true);
				return meshFile;
			})();
			this.model.describe({
				mesh: mesh,
				material: "crucible_block_aw",
				skin: "terrain-atlas/water_placeholder.png"
			});
		},
		load(){
			this.model = new Animation.Base(this.x, this.y+1, this.z);
			this.updateModel();
			let that = this;
			this.networkData.addOnDataChangedListener(function(data, isExternal){
				that.updateModel();
				that.model.load();
			});
			this.model.load();
		},
		unload(){
			this.model.destroy();
		}
	},
	init(){
		if(this.data.wate >= 1)
			this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
	},
	tick(){
		if(this.data.wate >= 1){
			if(this.data.heat >= 100){
				if(Math.random() <= .4)
					spawnCauldron(this.dimension, this.x, this.y, this.z, this.data.r, this.data.g, this.data.b);
				if(Math.random() >= .1)
					return;
				this.data.wate--;
				this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
				if(this.data.wate <= 0){
					this.data.r = 0;
					this.data.g = 180;
					this.data.b = 244;
					this.data.items = [];
				}
			}
			if(CauldronFireBlock.indexOf(this.blockSource.getBlockId(this.x, this.y-1, this.z))!=-1&&this.data.heat <= 101){
				this.data.heat++;
			}else if(this.data.heat >= 1){
				this.data.heat--;
			}
		}else if(this.data.heat >= 1){
			this.data.heat--;
		}
	},
	click(id, count, data, coords, player){
		Game.prevent();
		if(!ScrutinyAPI.isScrutiny(player, "aw", "basics", "cauldron"))
			return;
		if(Entity.getSneaking(player)){
			this.data.wate=0;
			this.data.heat = 0;
			this.data.r = 0;
			this.data.g = 180;
			this.data.b = 244;
			this.data.items = [];
			this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
			return;
		}
		let item = Entity.getCarriedItem(player)
		if(item.id == 850 && this.data.wate <= 999){
			this.data.wate=1000;
			this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
			this.data.heat = 0;
			Entity.setCarriedItem(player, 325, 1, 0);
			return;
		}
		if(item.id == ItemID.aw_bottle_empty && this.data.wate>=200&& (this.data.r >= 1 || this.data.g >= 1 || this.data.b >= 1)){
			this.data.wate-=200;
			this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
			let extra = Wands.getExtraByArr(this.data.items);
			extra.putInt("R", this.data.r < 0 ? 0 : this.data.r);
			extra.putInt("G", this.data.g < 0 ? 0 : this.data.g);
			extra.putInt("B", this.data.b < 0 ? 0 : this.data.b);
			extra.putString("RGB", extra.getInt("R", 0)+"."+extra.getInt("G", 0)+"."+extra.getInt("B", 0));
			Entity.setCarriedItem(player, ItemID.aw_bottle_potion, 1, 0, extra);
			return;
		}
		let prot = Potion.getPrototype(item.id)
		if(prot.id != -1 && (this.data.r >= 1 || this.data.g >= 1 || this.data.b >= 1) && this.data.wate >= 1 && this.data.heat >= 100){
			if(Potion.potionsType[prot.type].installation(coords, item, player, this.data)){
				this.data.r += prot.color.r;
				this.data.g += prot.color.g;
				this.data.b += prot.color.b;
				this.data.items.push(item);
			}else{
				this.data.r = 0;
				this.data.g = 0;
				this.data.b = 0;
			}
			Entity.setCarriedItem(player, item.id, item.count-1, item.data, item.extra);
			this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
			return;
		}
	},
	animation(r, g, b, wate){
		this.networkData.putInt("r", r||0);
		this.networkData.putInt("g", g||0);
		this.networkData.putInt("b", b||0);
		this.networkData.putInt("wate", wate || 0);
		this.networkData.sendChanges();
	}
})

