Callback.addCallback("StructureLoadOne", function(){
	let Village = new Structure.advanced("aw_village_0").setPrototype({
		after(x, y, z, region, packet){
			
		}
	});
	Callback.addCallback("ItemUse", function(coords, item){
		if(item.id == 280)
			Village.setStructure(coords.x, coords.y, coords.z);
	});
});