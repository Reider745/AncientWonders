let MagicHills = new Dimensions.CustomDimension("magic_hills", 1045); 
MagicHills.setSkyColor(100/255, 100/255, 100/255) 
MagicHills.setFogColor(100/255, 100/255, 100/255); 

let Dimension = {
	rm: 100,
	gm: 100,
	bm: 100,
	r: 150,
	g: 150,
	b: 150
}
function getColor(name){
	let value = (Math.random()-Math.random());
	return Dimension[name] + value < Dimension[name+"m"] ? Dimension[name+"m"] : Dimension[name] + value
}

Callback.addCallback("LocalTick", function(){
	Dimension.r = getColor("r")
	Dimension.g = getColor("g");
	Dimension.b = getColor("b");
	MagicHills.setSkyColor(Dimension.r/255, Dimension.g/255, Dimension.b/255);
	MagicHills.setFogColor(Dimension.r/255, Dimension.g/255, Dimension.b/255);
})

MagicHills.setGenerator(Dimensions.newGenerator({
generateVanillaStructures: false,
	layers: [{
		//minY: 0, maxY: 128, 
		//yConversion: [[1, .1], [.5, -.2], [-1, .7]],
		minY: 0, maxY: 200, 
		yConversion: [[.8, .1], [.5, -.2], [-.7, .5], [1, -5]],
		material: {base: 1, surface: {id:VanillaBlockID.dirt, data: 0, width:3}, cover: VanillaBlockID.grass}, 
		noise: {
			octaves: {count: 2, scale: 40}
		}
	}]
}));
//Callback.addCallback("ItemUse", function(coords, item){
	//if(item.id==265)
//Dimensions.transfer(Player.get(), MagicHills.id)
//})
