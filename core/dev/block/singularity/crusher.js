IDRegistry.genBlockID("magic_crusher");
Block.createBlock("magic_crusher", [ {name: "aw.block.magic_crusher", texture: [["stone", 0]], inCreative: true} ]);

let MagicCrusherUI = createUI({
	drawing: [
{type: "text", x: 380, y: 40, text: Translation.translate("aw.block.magic_crusher"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}},
		{type: "bitmap", bitmap: "furnace_bar_guide", x: 415, y: 180, scale: 8}
	],
	elements: {
		"slotInput": {type: "slot", x: 200, y: 190, size: 100},
		"slotResult": {type: "slot", x: 650, y: 190, size: 100},
	}
});

MagicCore.setPlaceBlockFunc(BlockID.magic_crusher, null, null, {tab: "singularity", name: "magic_crusher"});
SingularityAPI.setBlockInputName(BlockID.magic_crusher, "base", true);
crusher.setBlockModel(BlockID.magic_crusher);

let MagicCrusher = {
	recipes: [],
	addRecipe(obj){
		this.recipes.push(obj);
	}
};

let ICore
ModAPI.addAPICallback("ICore", function(api){
	ICore = api;
});

Callback.addCallback("ModsLoaded", function(){
	MagicCrusher.addRecipe({
		input: {
			id: ItemID.enchantment_forest_flower
		},
		result: {
			id: ItemID.aw_petal_powder,
			count: 1
		},
		clone: true
	});
	
	if(ICore){
		let macerator = ICore.Recipe.recipeData["macerator"];
		let keys = Object.keys(macerator);
		for(let i in keys){
			let key = keys[i];
			MagicCrusher.addRecipe({
				input: {
					id: parseInt(key.split(":")[0])
				},
				result: {
					id: macerator[key].id,
					count: macerator[key].count
				},
				clone: macerator[key].count < 4
			});
		}
	}
});

ModAPI.addAPICallback("RecipeViewer", function(api){
	var RVTypeAW = (function(_super){
		__extends(RVTypeAW, _super);
		function RVTypeAW(nameRv, icon, key, content){
			return _super.call(this, nameRv, icon, content) || this;
		}
		RVTypeAW.prototype.getAllList = function() {
			let list = [];
			let recipes = MagicCrusher.recipes;
			for(let i in recipes){
				let obj = recipes[i];
				list.push({
					input: [{id: obj.input.id, data: 0,count: 1}],
					output: [{id: obj.result.id,data: 0,count: obj.result.count}]
				});
			}
			return list;
		};
		return RVTypeAW;
	}(api.RecipeType));
	api.RecipeTypeRegistry.register("BlockID.magic_crusher", new RVTypeAW(Translation.translate("aw.block.magic_crusher"), BlockID.magic_crusher, "BlockID.magic_crusher", {
		drawing: [
			{type: "bitmap", bitmap: "furnace_bar_guide", x: 415, y: 180, scale: 8},
		],
		elements: {
			input0: {type: "slot", x: 200, y: 190, size: 100},
			output0: {type: "slot", x: 650, y: 190, size: 100},
		}
	}));
});

TileEntity.registerPrototype(BlockID.magic_crusher, {
	useNetworkItemContainer: true,
	defaultValues: {
		aspect: 0,
		aspectMax: 500,
	},
	tick(){
		if(World.getThreadTime() % 100 != 0)
			return;
		let clone = 1;
		for(let i = 1;i <= 10;i++)
			if(this.blockSource.getBlockId(this.x, this.y-i, this.z) == BlockID.aw_enchanted_rune_copying)
				clone++;
		
		let input = this.container.getSlot("slotInput");
		let result = this.container.getSlot("slotResult");
		
		if(this.data.aspect < 15*clone)
			return;
		
		for(let i in MagicCrusher.recipes){
			let recipe = MagicCrusher.recipes[i];
			if(input.id == recipe.input.id && (result.id == 0 || result.id == recipe.result.id)){
				this.data.aspect-=15*clone;
				this.container.setSlot("slotInput", input.id, input.count-1, 0);
				this.container.setSlot("slotResult", recipe.result.id, result.count+(recipe.clone ? recipe.result.count*clone : recipe.result.count), 0);
				this.container.validateAll();
				break;
			}
		}
		
		this.container.sendChanges();
		StorageInterface.checkHoppers(this);
	},
	getScreenName(player, coords){
		if(ScrutinyAPI.isScrutiny(player, "aw", "singularity", "magic_crusher"))
			return "main";
	},
	getScreenByName(screenName){
		return MagicCrusherUI;
	}
});
StorageInterface.createInterface(BlockID.magic_crusher, {
	slots: {
		"input0": {input: true, output: false},
		"output0": {input: false, output: true}
	}
});