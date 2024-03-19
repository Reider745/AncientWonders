let GraphicsSetting = {
	settings: {},

	register(name, obj){
		obj.init = obj.init || function(){};
		obj.change = obj.change || function(){};
		
		if(this.api){
			with(this.api){
				builder.addSectionDivider(name, 20);
				obj.init(config, builder);
			}
		}
		this.settings[name] = obj;
	}
};

ModAPI.addAPICallback("RuntimeSetting", function(api){
	with(api){
		let setting = new Setting(__dir__);
		let config = new ConfigStorage(__dir__+"runtime_config.json");
		let builder = new BuilderConfig(config);
		
		GraphicsSetting.api = {
			config: config,
			builder: builder
		};
		
		for(let name in GraphicsSetting.settings){
			let setting = GraphicsSetting.settings[name];
			
			builder.addSectionDivider(name, 20);
			
			setting.init(config, builder);
		}
		
		setting.setBuilderConfig(builder);
		
		setting.setChangeSetting(function(){
			for(let name in GraphicsSetting.settings)
				GraphicsSetting.settings[name]
					.change(config);
		});
	}
});