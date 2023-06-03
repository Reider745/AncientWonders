IDRegistry.genItemID("aw_bottle_empty"); 
Item.createItem("aw_bottle_empty", "aw.item.bottle_empty", {name: "aw_bottle_empty", meta: 0}, {stack: 1});

IDRegistry.genItemID("aw_bottle_potion"); 
Item.createItem("aw_bottle_potion", "aw.item.bottle_potion", {name: "aw_bottle_potion", meta: 0}, {stack: 1});
Item.setUseAnimation(ItemID.aw_bottle_potion, 2);
Item.setMaxUseDuration(ItemID.aw_bottle_potion, 30);

(function(){
	let hashModel = [];
	const orgPotion = ItemModel.getFor(ItemID.aw_bottle_potion, 0);
	
	function getModel(item){
		const uniqueKey = new java.lang.String(item.extra.getString("RGB", "0.0.0")).hashCode();
		const cache = hashModel[uniqueKey];
		if(cache)
			return cache;
		const coords = [];
		coords.push({x: 0, y: 0, r: 1, g: 1, b: 1, a: 1, w: 1, h: .5});
		coords.push({x: 0, y: .5, r: item.extra.getInt("R", 0)/255, g: item.extra.getInt("G", 0)/255, b: item.extra.getInt("B", 0)/255, a: .8, w: 1, h: .5});
		const mesh = [new RenderMesh(), new RenderMesh()];
		mesh.forEach(function(m, i){
			let z;
			for(let j = 0; j < coords.length; j++){
				z = i & 1 ? -0.001 * (coords.length - j) : 0.001 * (coords.length - j);
				m.setColor(coords[j].r, coords[j].g, coords[j].b, coords[j].a);
				let w = coords[j].w;
				let h = coords[j].h;
				m.setNormal(1, 1, 0);
				m.addVertex(0, 1, z, coords[j].x, coords[j].y);
				m.addVertex(1, 1, z, coords[j].x + w, coords[j].y);
				m.addVertex(0, 0, z, coords[j].x, coords[j].y + h);
				m.addVertex(1, 1, z, coords[j].x + w, coords[j].y);
				m.addVertex(0, 0, z, coords[j].x, coords[j].y + h);
				m.addVertex(1, 0, z, coords[j].x + w, coords[j].y + h);
			}
			if((i & 1) === 0){
				m.translate(0.4, -0.1, 0.2);
				m.rotate(0.5, 0.5, 0.5, 0, -2.1, 0.4);
				m.scale(2, 2, 2);
			}
		});
		const model = ItemModel.newStandalone();
		const path = "items-opaque/aw_bottle_potion_3.png";
		model.setModel(mesh[0], path);
		model.setUiModel(mesh[1], path);
		model.setSpriteUiRender(true);
		model.setModUiSpriteName("aw_bottle_potion", 0);
		hashModel[uniqueKey] = model;
		return model;
	}
	orgPotion.setModelOverrideCallback(function(item){
		try{
			item.extra = item.extra || new ItemExtraData();
			return getModel(item);
		}catch(e){alert(e)}
	});
})();
Callback.addCallback("ItemUsingComplete", function(item, player){
	if(item.id==ItemID.aw_bottle_potion)
		Potion.run(player, item);
});