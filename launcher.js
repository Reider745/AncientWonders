ConfigureMultiplayer({
	isClientOnly: false
});
IMPORT("DependenceHelper");
new Dependence(__name__)
	.addDependence("DungeonUtility", "https://icmods.mineprogramming.org/mod?id=783")
	.setLaunch(function(all_api,api) {
		Launch({
			StructureLoader: api.StructureLoader,
			Structure: api.Structure,
			StructureUtility: api.StructureUtility,
			ItemGenerate: api.ItemGeneration,
			StructurePiece: api.StructurePiece
		});
	});