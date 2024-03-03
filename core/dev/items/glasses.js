IDRegistry.genItemID("aw_glasses"); 
Item.createArmorItem("aw_glasses", "aw.item.glasses", {name: "glasses", meta: 0}, {type: "helmet", armor: 1, durability: 699, texture: "armor/noy.png"})
MagicCore.setArmor(ItemID.aw_glasses, "magic", 20, {scrutiny: "glasses", tab: "riches"});
MagicCore.setArmorMagic(ItemID.aw_glasses, "magic", 9);
Item.setEnchantType(ItemID.aw_glasses, Native.EnchantType.chestplate, 14);

let Glasses = {
	getModelYes(){
		let mesh = new RenderMesh();
		mesh.setColor(0, 1, 0, 1);
		return RenderUtil.meshCopy(yes.getRenderMesh(), mesh);
	},
	getModelNoy(){
		let mesh = new RenderMesh();
		mesh.setColor(1, 0, 0, 1);
		return RenderUtil.meshCopy(noy.getRenderMesh(), mesh);
	}
};

function getBlocks(pos, region, radius, id, tile){
	let arr = [];
	pos.x = Math.floor(pos.x);
	pos.y = Math.floor(pos.y);
	pos.z = Math.floor(pos.z);
	for(let x = pos.x - radius;x < pos.x + radius;x++)
		for(let y = pos.y - radius;y < pos.y + radius;y++)
			for(let z = pos.z - radius;z < pos.z + radius;z++)
				if(region.getBlockId(x,y,z) == id)
					if(tile){
						let te = TileEntity.getTileEntity(x, y, z, region);
						arr.push([x, y, z, (te||{}).data || {}]);
					}else
						arr.push([x, y, z, {}]);
	return arr;
}
 
(function(){
	let cache = {};
	let singularity_staff;
	let model = new RenderUtil.Model();
	let size = 1/16
	
	model.add(0, 0, 0, 1, size, size);
	model.add(0, 0, 0, size, size, 1);
	model.add(1-size, 0, size, 1, size, 1);
	model.add(size, 0, 1-size, 1, size, 1);
	
	model.add(0, 1-size, 0, 1, 1, size);
	model.add(0, 1-size, 0, size, 1, 1);
	model.add(1-size, 1-size, size, 1, 1, 1);
	model.add(size, 1-size, 1-size, 1, 1, 1);
	
	model.add(0, size, 0, size, 1-size, size);
	model.add(1-size, size, 1-size, 1, 1-size, 1);
	model.add(1-size, 0, 0, 1, 1-size, size);
	model.add(0, 0, 1-size, size, 1-size, 1);
	
	let meshStaff = model.getRenderMesh();
	
	Network.addClientPacket("aw.glasses.update", function(data){
		for(let key in cache)
			cache[key].destroy();
		cache = {};
		singularity_staff && singularity_staff.destroy();
		
		let item = Player.getCarriedItem();
		if(item.id == ItemID.staff_singularity){
			let pos = SingularityAPI.getPosForStaff(item.extra || new ItemExtraData());
			singularity_staff = new Animation.Base(pos.x+.5, pos.y+.5, pos.z+.5);
			singularity_staff.describe({
					mesh: meshStaff,
					material: "aspects_transfer_aw"
			});
			singularity_staff.load();
			return;
		}else if(!Potion.isIngredient(item))
			return;
		
		
		for(let i in data){
			let info = data[i];
			let pos = {
				x: Math.floor(info[0]),
				y: Math.floor(info[1]),
				z: Math.floor(info[2])
			};
				
			let items = info[3].items || [];
			let anim = cache[pos.x+"."+pos.y+"."+pos.z] = new Animation.Base(pos.x+.5, pos.y+1.7, pos.z+.5);
			anim.describe({
				mesh: Potion.isIngredientInstallation(pos, item, Player.get(), {
					items: items
				}) ? Glasses.getModelYes() : Glasses.getModelNoy(),
				skin: "terrain-atlas/concrete_white.png"
			});
			anim.load();
		}
	});
	Network.addClientPacket("aw.glasses.end", function(data){
		for(let key in cache)
			cache[key].destroy();
		cache = {};
		singularity_staff && singularity_staff.destroy();
	});
})();


const GLASSEES_SLOT = Native.ArmorType.helmet;
ThreadHelp.registerForGame("aw-glasses", function(){
	let players = Network.getConnectedPlayers();
	for(let p in players){
		let player = players[p];
		
		let item = Entity.getArmorSlot(player, GLASSEES_SLOT);
		if(item.id == ItemID.aw_glasses){
			let region = BlockSource.getDefaultForActor(player);
			let arr = getBlocks(Entity.getPosition(player), region, 3, BlockID.cauldronAw, true);
		
			let client = Network.getClientForPlayer(player);
			client && client.send("aw.glasses.update", arr);
		}
	}
}, 5 / 20 * 1000);

Armor.registerOnTakeOffListener(ItemID.aw_glasses, function(item, slot, player){
	let client = Network.getClientForPlayer(player);
	client && client.send("aw.glasses.end", {});
})
