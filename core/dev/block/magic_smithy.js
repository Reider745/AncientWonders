IDRegistry.genBlockID("magic_smithy");
Block.createBlock("magic_smithy", [ {name: "aw.block.magic_smithy", texture: [["stone", 0]], inCreative: true}]);

Block.setDestroyLevel("magic_smithy", 0);
ToolAPI.registerBlockMaterial(BlockID.magic_smithy, "stone", 0, false);

let ModelAnimation = RenderAPI.ModelAnimation;
let MagicSmithy = {
	start: (function(){
		let model = new RenderAPI.Model();
		model.addBoxByBlock("down", 0, 0, 0, 1, 1/16, 1, 98, 0);
		model.addBoxByBlock("up", 0, 15/16, 0, 1, 1, 1, 98, 0);
		model.addBoxByBlock("pillar_0", 0, 1/16, 0, 2/16, 15/16, 2/16, VanillaBlockID.obsidian, 0);
		model.addBoxByBlock("pillar_1", 14/16, 1/16, 14/16, 1, 15/16, 1, VanillaBlockID.obsidian, 0);
		model.addBoxByBlock("pillar_2", 14/16, 1/16, 0, 1, 15/16, 2/16, VanillaBlockID.obsidian, 0);
		model.addBoxByBlock("pillar_3", 0, 1/16, 14/16, 2/16, 15/16, 1, VanillaBlockID.obsidian, 0);
		
		model.addBoxByBlock("down_1", 1/16, 1/16, 1/16, 15/16, 2/16, 15/16, 98, 0);
		model.addBoxByBlock("up_1", 1/16, 14/16, 1/16, 15/16, 15/16, 15/16, 98, 0);
		return model;
	})(),
	end: null,
	recipes: [],
	addRecipe(item1, item2, result, time, func){
		this.recipes.push({
			items: [item1||1, item2||1],
			result: result,
			time: time||150,
			func: func
		})
	},
	get(item1, item2){
		let arr = this.recipes;
		for(let i in arr)
			if(RitualAPI.isRecipe([item1,item2],arr[i].items))
				return arr[i];
		return null;
	},
	isRecipe(container, data){
		let slot1 = container.getSlot("slot1");
		let slot2 = container.getSlot("slot2");
		let slot3 = container.getSlot("slot3");
		let arr = this.recipes;
		for(let i in arr){
			let result = arr[i].result||arr[i].func(arr[i]);
			if(RitualAPI.isRecipe([slot1.id,slot2.id],arr[i].items)&&slot3.id==0){
				if(data.time <= arr[i].time){
					if(data.aspect - 1 >= 0){
						data.aspect-=1;
					}else{
						if(data.time > 0)
							data.time--;
						container.setScale("bar", data.time/arr[i].time);
						return true;
					}
					data.time++;
					container.setScale("bar", data.time/arr[i].time);
					return true;
				}
				container.setSlot("slot1", slot1.id, slot1.count-1, slot1.data, slot1.extra);
				container.setSlot("slot2", slot2.id, slot2.count-1, slot2.data, slot2.extra);
				container.setSlot("slot3", result.id||1,slot3.count+(result.count||1),result.data||0,result.extra||null)
				container.validateAll();
				data.time = 0;
				return false;
			}
		}
		data.time = 0;
		container.setScale("bar", 0);
		return false;
	}
};
//(function(start){
	let model = new RenderAPI.Model();
	model.setBoxes(JSON.parse(JSON.stringify(MagicSmithy.start.getBoxes())));
	
	model.addBoxByBlock("down_1", 1/16, 1/16, 1/16, 15/16, 8/16, 15/16, VanillaBlockID.obsidian, 0);
	model.addBoxByBlock("up_1", 1/16, 8/16, 1/16, 15/16, 15/16, 15/16, VanillaBlockID.obsidian, 0);
	
	MagicSmithy.end = model;
//})(MagicSmithy.start)
(function(){
	let arr = [ItemID.piece1, ItemID.piece2, ItemID.piece3];
	for(let i in arr){
		for(let ii in arr){
			if(!MagicSmithy.get(arr[i], arr[ii]))
				MagicSmithy.addRecipe(arr[i], arr[ii], null, null, function(recipe){
					let scrut = arrScrut[Math.floor(Math.random()*arrScrut.length)];
					let e = new ItemExtraData();
					e.putString("window", scrut.win);
					e.putString("tab", scrut.tab);
					e.putString("name", scrut.name);e.putString("name2", scrut.name2);
					e.putInt("aspect", 100);
					return {
						id: ItemID.piece4,
						extra: e
					}
				})
		}
	}
	for(let i in arrRune){
		MagicSmithy.addRecipe(arrRune[i], arrRune[i], null, null, function(recipe){
			return {id: arrRune[Math.floor(Math.random()*arrRune.length)]}
		});
	}
})()
let MagicSmithyUI = createUI({
	drawing: [
{type: "text", x: 380, y: 40, text: Translation.translate("aw.block.magic_smithy"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}},
		{type: "bitmap", bitmap: "arrow_bar_background", x: 405, y: 205 , scale: 7}
	],
	elements: {
		"slot1": {type: "slot", x: 300, y: 150, size: 100},
		"slot2": {type: "slot", x: 300, y: 260, size: 100},
		"slot3": {type: "slot", x: 600, y: 205, size: 100},
		"bar": {type: "scale", bitmap: "arrow_bar_scale", x: 405, y: 205 , scale: 7, value: 0}
	}
});
BlockRenderer.enableCoordMapping(BlockID.magic_smithy, -1, MagicSmithy.start.getICRenderModel())

SingularityAPI.setBlockOutputName(BlockID.magic_smithy, "output", true);
TileEntity.registerPrototype(BlockID.magic_smithy, {
	useNetworkItemContainer: true,
	defaultValues: {
		aspect: 0,
		aspectMax: 200,
		time: 0
	},
	client: {
		updateModel(){
			let id = Network.serverToLocalId(this.networkData.getInt("itemId"));
			let data = this.networkData.getInt("itemData");
			this.model.describeItem({
				id: id,
				count: 1,
				data: data,
				size: .5,
				rotation: [Math.PI / 2, 0, 0]
			});
			id = Network.serverToLocalId(this.networkData.getInt("itemId_2"));
			data = this.networkData.getInt("itemData_2");
			this.model_2.describeItem({
				id: id,
				count: 1,
				data: data,
				size: .5,
				rotation: [Math.PI / 2, 0, 0]
			});
		},
		load(){
			this.animation = this.animation || new ModelAnimation();
			this.animation.setTime(80);
			this.animation.setModel(MagicSmithy.start, MagicSmithy.end);
			
			this.model = new Animation.Item(this.x + .5, this.y + .5, this.z + .5);
			this.model_2 = new Animation.Item(this.x + .5, this.y + .6, this.z + .5);
			
			this.updateModel();
			this.model.load();
			this.model_2.load()
			
			let thas = this;
			this.networkData.addOnDataChangedListener(function(data, isExternal){
				thas.bool = thas.networkData.getBoolean("bool")
				thas.updateModel();
			});
		},
		tick(){
			if(this.bool)
			this.animation.updateModel(this.x,this.y,this.z, true);
		},
		unload(){
			BlockRenderer.unmapAtCoords(this.x,this.y,this.z)
			this.model.destroy();
			this.model_2.destroy();
		}
	},
	tick(){
		if(World.getWorldTime()%2==0){
			if(MagicSmithy.isRecipe(this.container, this.data))
				this.updateModel(true);
			else
				this.updateModel(false);
			this.container.sendChanges();
		}
	},
	updateModel(value){
		this.data.bool = !!value;
		this.networkData.putBoolean("bool", this.data.bool)
		let item = this.container.getSlot("slot1")
		let item2 = this.container.getSlot("slot2")
		this.networkData.putInt("itemId", item.id);
		this.networkData.putInt("itemData", item.data);
		this.networkData.putInt("itemId_2", item2.id);
		this.networkData.putInt("itemData_2", item2.data);
		this.networkData.sendChanges();
	},
	getScreenName(player, coords){
		return "main";
	},
	getScreenByName(screenName){
		return MagicSmithyUI;
	}
});
