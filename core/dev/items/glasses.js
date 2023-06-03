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
				if(region.getBlock(x,y,z).id == id)
					if(tile){
						let te = TileEntity.getTileEntity(x, y, z, region);
						arr.push([x, y, z, (te||{}).data || {}]);
					}else
						arr.push([x, y, z, {}]);
	return arr;
}
 
(function(){
	let cache = {};
	Network.addClientPacket("aw.glasses.update", function(data){
		let keys = Object.keys(cache);
		for(let i in keys)
			cache[keys[i]].destroy();
		cache = {};
		for(let i in data){
			let pos = {
				x: Math.floor(data[i][0]),
				y: Math.floor(data[i][1]),
				z: Math.floor(data[i][2])
			};
			let id = pos.x+"."+pos.y+"."+pos.z;
			let item = Entity.getCarriedItem(Player.get());
			if(!Potion.isIngredient(item))
				continue;
			data[i][3].items = data[i][3].items || [];
			cache[id] = new Animation.Base(pos.x+.5, pos.y+1.7, pos.z+.5);
			cache[id].describe({
				mesh: Potion.isIngredientInstallation(pos, item, Player.get(), data[i][3]) ?Glasses.getModelYes() : Glasses.getModelNoy(),
				skin: "terrain-atlas/concrete_white.png"
			});
			cache[id].load();
		}
	});
	Network.addClientPacket("aw.glasses.end", function(data){
		let keys = Object.keys(cache);
		for(let i in keys)
			cache[keys[i]].destroy();
		cache = {};
	});
})();

Armor.registerOnTickListener(ItemID.aw_glasses, function(item, slot, player){
	if(World.getThreadTime() % 5 == 0){
		let region = BlockSource.getDefaultForActor(player);
		let arr = getBlocks(Entity.getPosition(player), 
			region, 3, BlockID.cauldronAw, true);
		let client = Network.getClientForPlayer(player);
		if(client)
			client.send("aw.glasses.update", arr);
	}
});
Armor.registerOnTakeOffListener(ItemID.aw_glasses, function(item, slot, player){
	let client = Network.getClientForPlayer(player);
	if(client)
		client.send("aw.glasses.end", {});
})
