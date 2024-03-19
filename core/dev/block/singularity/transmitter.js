IDRegistry.genBlockID("transmitter");
Block.createBlock("transmitter", [ {name: "aw.block.transmitter", texture: [["stone", 0]], inCreative: true} ]);

let lightbolt_transmitter = new LightboltType("lightbolt_transmitter", {
	animation_cache_type: 1,
	life_time: 45,
	size: 1/20,
	count_kink: 8,
	kink_strength: 4,
	chance_branching: .4,
	branching_z_modification: [.5, 1.1],
	cache_count: 15,
	radius: 1
});

let LIGUIDBOLT_TRANSMITTER = true;

void function(){
	let setting = lightbolt_transmitter.setting;
	
	function initForConfig(config){
		LIGUIDBOLT_TRANSMITTER = config.get("enabled_liguidbolt");
		setting.life_time = config.get("life_time");
		setting.radius = config.get("radius");
		setting.count_kink = config.get("count_kink");
		setting.cache_count = config.get("cache_count");
		
		lightbolt_transmitter.rebuildCache();
	}

	GraphicsSetting.register("Liguidbolt transmitter", {
		init(config, builder){
			config.put("enabled_liguidbolt", true);
			config.put("life_time", setting.life_time);
			config.put("radius", setting.radius);
			config.put("cache_count", setting.cache_count);
			config.put("count_kink", setting.count_kink);
			
			builder.addCheckBox("Enabled", "enabled_liguidbolt");
			builder.addSlider("Life time", "life_time", 5, 70, 5);
			builder.addSlider("Count kink", "count_kink", 1, 12, 1);
			builder.addSlider("Radius", "radius", 0, 1.5, .1);
			builder.addSlider("Cache count", "cache_count", 1, 50, 1);
			
			initForConfig(config);
		},
		change: initForConfig
	});
}();

RenderAPI.setTransmitter(BlockID.transmitter);
SingularityAPI.registerTile(BlockID.transmitter, {
	isOutput: true,
	isInput: true,
	
	client: {
		tick(){
			if(LIGUIDBOLT_TRANSMITTER && this.networkData.getInt("aspects") > 0 && World.getThreadTime() % 10 == 0){
				let pos = centerBlockPos(this);
				lightbolt_transmitter.spawnClient(pos, randPos(pos, 1));
			}
		}
	},
	
	tick(){
		if(LIGUIDBOLT_TRANSMITTER && World.getThreadTime() % 20 == 0){
			this.networkData.putInt("aspects", this.data.aspect);
			this.networkData.sendChanges();
		}
	}
});