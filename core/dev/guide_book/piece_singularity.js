ScrutinyAPI.addTab("aw", "singularity", {
	id: 7,
	icon: BlockID.magic_crusher,
	title: "aw.guide.tab.singularity",
	title_color: android.graphics.Color.rgb(1, 215/255, 0),
	isVisual: function(player,  windowName){
		return ScrutinyAPI.isScrutiny(player, windowName, "basics", "singularity")
	},
	auto_size: true 
});

Callback.addCallback("LevelDisplayed", function(){
	ScrutinyAPI.addScrutiny("aw", "singularity", "magic_storage", {
		x: 10,
		y: 10,
		size: 100,
		line: [],
		item: {
			id: BlockID.aw_magic_storage,
		},
		bookPost: {
			left: [
				{text: "aw.guide.magic_storage.title", size: 25},
				{text: "aw.guide.magic_storage.info", size: 15},
			],
			right: []
		}
	});
	
	ScrutinyAPI.addScrutiny("aw", "singularity", "magic_crusher", {
		x: 150,
		y: 10,
		size: 100,
		line: [],
		item: {
			id: BlockID.magic_crusher,
		},
		bookPost: {
			left: [
				{text: "aw.guide.magic_crusher.title", size: 25},
				{text: "aw.guide.magic_crusher.info", size: 15},
			],
			right: []
		}
	});
	
	ScrutinyAPI.addScrutiny("aw", "singularity", "clone_scroll", {
		x: 330,
		y: 210,
		size: 100,
		line: [],
		item: {
			id: BlockID.clone_scroll,
		},
		bookPost: {
			left: [
				{text: "aw.block.clone_scroll", size: 25},
				{text: "aw.guide.clone_scroll", size: 15},
			],
			right: []
		}
	});
});