let SingularityShrinkerUI = createUI({
	drawing: [
		{type: "text", x: 380, y: 40, text: Translation.translate("aw.block.singularity_shrinker"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}}
	],
	elements: {
		"slotRune": {type: "slot", x: 450, y: 250, size: 100},
		"textSinLvl": {type: "text", x: 220, y: 100, width: 400, height: 60, text: "0"},
		
		"textSinAspect": {type: "text", x: 220, y: 165, width: 400, height: 60, text: "0"}
		
	},
});

IDRegistry.genBlockID("singularity_shrinker");
Block.createBlock("singularity_shrinker", [ {name: "aw.block.singularity_shrinker", texture: [["stone", 0]], inCreative: true} ]);
RenderAPI.setSingularityShrinker(BlockID.singularity_shrinker);

MagicCore.setPlaceBlockFunc(BlockID.singularity_shrinker, {
	magic: 5
});
TileEntity.registerPrototype(BlockID.singularity_shrinker, {
	useNetworkItemContainer: true,
	defaultValues: {
		singularity: 0
	},
	tick: function(){
		StorageInterface.checkHoppers(this);
		let slotRune = this.container.getSlot("slotRune");

		if(!!runes_singularity[""+slotRune.id]){
			this.data.singularity+=runes_singularity[slotRune.id]*slotRune.count;
this.container.setSlot("slotRune", 0, 0, 0, null);
		}
		if(Math.random()<=.2 && this.data.singularity>=.1) this.data.singularity-=.05;
		if(this.data.singularity>=0.1 && World.getThreadTime()% 5 == 0){
			Mp.spawnParticle(ParticlesAPI.part_singularity, this.x+.5, this.y+1.5, this.z+.5, 0, 0, 0, 0, 0, 0, this.dimension);
			Mp.spawnParticle(ParticlesAPI.singularity_particle, this.x+Math.random(), this.y+1+Math.random(), this.z+Math.random(), 0, 1/20, 0, 0, 0, 0, this.dimension);
		}
		if(this.data.singularity < 0) this.data.singularity = 0
		this.container.setText("textSinLvl", this.data.singularity);
		this.container.setText("textSinAspect", Math.ceil(this.data.singularity/250));
		this.container.sendChanges();
	},
	getScreenName: function(player, coords){
		if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "singularity"))
    	return "main";
  },
  getScreenByName: function(screenName){
    return SingularityShrinkerUI;
  }
});
StorageInterface.createInterface(BlockID.singularity_shrinker, {
	slots: {
		"slotRune": {input: true}
	}
});