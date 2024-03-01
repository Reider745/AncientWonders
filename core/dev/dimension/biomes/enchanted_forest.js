let biomes = [1, 4, 5, 27, 155, 19];

const BiomeParticle = [
	Particles.registerParticleType({
 	 texture: "aw_singularity",
	  render: 0,
  	size: [.25, .5],
 	 lifetime: [50, 50],
 	 color: [0, 191/255, 1, 1],
	  animators: {
  	  size: {fadeOut: .4, fadeln:.1, start: 0, end: 1}
 	 }
	}),
	Particles.registerParticleType({
 	 texture: "aw_singularity",
	  render: 0,
  	size: [.25, .5],
 	 lifetime: [50, 50],
 	 color: [1, 0.64, 0, 1],
	  animators: {
  	  size: {fadeOut: .4, fadeln:.1, start: 0, end: 1}
 	 }
	})
];
Callback.addCallback("LocalTick", function(){
	let id = BiomeParticle[Math.floor(Math.random() * BiomeParticle.length)];
	let pos = Entity.getPosition(Player.get());
	if(BlockSource.getCurrentClientRegion().getBiome(pos.x, pos.z) == Enchanted_forest.id)
		for(let i = 0;i < 4;i++)
			Particles.addParticle(id, pos.x + Math.random() * 30 - 15, pos.y + Math.random() * 6 - 3, pos.z + Math.random() * 30 - 15, Math.random()/40, Math.random()/40, Math.random()/40);
});

const Enchanted_forest = new CustomBiome("aw_enchanted_forest")
	.setGrassColor(0, 191/255, 1)
	.setFoliageColor(0, 191/255, 1)
	.setSkyColor(0, 191/255, 1)
	.setWaterColor(0, 191/255, 1)
	.setTemperatureAndDownfall(.1, .5);

	
Callback.addCallback("GenerateChunk", function(chunkX, chunkZ, random, dimensionId, chunkSeed, worldSeed, dimensionSeed){
	if(World.getBiome(chunkX*16, chunkZ*16) == Enchanted_forest.id)
		for(let x = 0;x <= 16;x++){
for(let y = 0;y <= 16;y++){
			let coords = GenerationUtils.findSurface(chunkX*16 + x, 96, chunkZ*16 + y);
			if(World.getBlock(coords.x, coords.y+1, coords.z).id==0&&random.nextInt(4)<=1){
				World.setBlock(coords.x, coords.y+1, coords.z, 31, random.nextInt(2));
if(random.nextInt(100) <= 1)
World.setBlock(coords.x, coords.y+1, coords.z, BlockID.enchantment_forest_flower, 0);

}
}
		}
	for(let i = 0;i < 2+random.nextInt(2);i++){
		let pos = Structure.getRandomCoords(chunkX, chunkZ, random, null, dimensionSeed);
		if(World.getBiome(pos.x, pos.z) == Enchanted_forest.id)
			Structure.setStructure("enchanted_forest_wood_"+random.nextInt(8), pos.x, pos.y, pos.z, BlockSource.getCurrentWorldGenRegion());
	}
});

//это не должно было войти в релиз
/*Network.addServerPacket("test", function(p){
	const size = 1024;
	const seed = Math.floor(Math.random()*10000);
	alert("start, size: "+size+", seed: "+seed)
	let bitmap = android.graphics.Bitmap.createBitmap(size, size, android.graphics.Bitmap.Config.ARGB_4444);
	for(let x = 0;x < size;x++){
		for(let z = 0;z < size;z++){
			//let perlin = GenerationUtils.getPerlinNoise(x*16, 0, z*16, 100, 1/1024, 3);
			let perlin = GenerationUtils.getPerlinNoise(x*16, 0, z*16, seed, 1/1512, 3)
			if(perlin < .75)
				bitmap.setPixel(x, z, android.graphics.Color.rgb(perlin, perlin, perlin))
			else
				bitmap.setPixel(x, z, android.graphics.Color.rgb(255, 0, 0))
		}
		Game.message((x/size)*100+"%")
	}
	FileTools.WriteImage(__dir__+size+".png", bitmap)
	Game.message("end")
});

Callback.addCallback("NativeCommand", function(str){
	let cmd = str.split(".")
	if(cmd[0]!="/g")
		return;
	Network.sendToServer("test", {
		size: cmd[1]
	})
});*/


Callback.addCallback("GenerateBiomeMap", function(chunkX, chunkZ, random, dimensionId, chunkSeed, worldSeed, dimensionSeed){
	if(dimensionId != 0)
		return;
	let X = Math.floor(chunkX) * 16;
	let Z = Math.floor(chunkZ) * 16;

	let biome = World.getBiomeMap(X, Z);
	if(biomes.indexOf(biome) != -1 || GenerationUtils.getPerlinNoise(X, 0, Z, dimensionSeed, 1/1512, 3) < .75)
		return;
	for(let x = 0; x < 16; x++)
		for(let z = 0; z < 16; z++)
			World.setBiomeMap(X+x, Z+z, Enchanted_forest.id);
});
