IDRegistry.genBlockID("clone_scroll");
Block.createBlock("clone_scroll", [ {name: "aw.block.clone_scroll", texture: [["aw_magic_brick", 0]], inCreative: true} ]);

ScrollClone().setBlockModel(BlockID.clone_scroll, 0);
RitualAPI.addPedestal(BlockID.clone_scroll);

const widthCloneText = new com.zhekasmirnov.innercore.api.mod.ui.types.Font({size:60}).getTextWidth("Clone", 1);

let CloneScrollUI = createUI({
	drawing: [
		{type: "text", x: 380, y: 40, text: Translation.translate("aw.block.clone_scroll"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}},
	],
	elements: {
		"scroll":{type: "slot", x: 200, y: 100, size: 65},
		"frame":{type:"frame", bitmap: "classic_button_up", x: 270, y: 100, scale: 3, width: widthCloneText+10, height: 65, clicker: {
			onClick(_, container){
				container.sendEvent("clone", {});
			}
		}},
		"frameText":{type:"text", x: 275, y: 100, z: 1, text: "Clone", font: {size: 60, color: android.graphics.Color.rgb(0, 0, 0)}},
		"text":{type:"text", x: 180, y: 170, text: "", multiline: true, font: {size: 15, color: android.graphics.Color.rgb(0, 0, 0)}}
	}
});
SingularityAPI.setBlockOutputName(BlockID.clone_scroll, "output", true);

let CloneScrollRecipe = {
	recipes: {},
	get(scroll){
		return (this.recipes[scroll]||[]).slice(0);
	},
	add(scroll, recipes){
		this.recipes[scroll] = recipes;
		return this;
	}
};
Callback.addCallback("ModsLoaded", function(){
	ModAPI.addAPICallback("RecipeViewer", function(api){
		var RVTypeAW = (function(_super){
			__extends(RVTypeAW, _super);
			function RVTypeAW(nameRv, icon, content){
				let _this = _super.call(this, nameRv, icon, content) || this;
				return _this;
			}
			RVTypeAW.prototype.getAllList = function() {
				let list = [];
				for(let key in CloneScrollRecipe.recipes){
					let tips = "\n";
					let items = CloneScrollRecipe.recipes[key];
					for(let i in items)
						tips += "\n"+Translation.translate(Item.getName(items[i], 0));
					list.push({
						output: [{id: Number(key), data: 0, count: 1, tips: tips}],
						input: [],
					});
				}
				return list;
			};
			RVTypeAW.prototype.slotTooltip = function(name, item, tips){
				return name+(tips||"");
			}
			return RVTypeAW
  	}(api.RecipeType));
  	api.RecipeTypeRegistry.register(""+BlockID.clone_scroll, new RVTypeAW(Translation.translate("aw.block.clone_scroll"), BlockID.clone_scroll, {
  		drawing: [],
  		elements: {
  			output0: {x: 450, y: 200, size: 100},
  		}
  	}));
  });
});

CloneScrollRecipe.add(ItemID.sroll1, [ItemID.rune2, ItemID.rune_absorption])
	.add(ItemID.sroll2, [ItemID.rune_life, ItemID.rune_absorption])
	.add(ItemID.sroll3, [ItemID.rune3, ItemID.rune_absorption])
	.add(ItemID.sroll4, [ItemID.rune5, ItemID.rune5, ItemID.rune_absorption])
	.add(ItemID.sroll5, [ItemID.rune4, ItemID.rune3])
	.add(ItemID.sroll6, [ItemID.rune4, ItemID.rune4, ItemID.rune_absorption])
	.add(ItemID.sroll7, [ItemID.rune4, ItemID.rune4, ItemID.rune_absorption, ItemID.rune3])
	.add(ItemID.sroll8, [ItemID.sroll11, ItemID.rune_dead])
	.add(ItemID.sroll9, [ItemID.rune2, ItemID.rune_absorption])
	.add(ItemID.sroll10, [ItemID.sroll4, ItemID.rune5])
	.add(ItemID.sroll11, [ItemID.sroll10, ItemID.rune5])
	.add(ItemID.sroll12, [ItemID.sroll6, ItemID.rune4])
	.add(ItemID.sroll13, [ItemID.sroll12, ItemID.rune4])
	.add(ItemID.sroll15, [ItemID.rune3, ItemID.rune3, ItemID.rune_life])
	.add(ItemID.sroll16, [ItemID.sroll15, ItemID.rune_life])
	.add(ItemID.sroll17, [ItemID.sroll11, ItemID.rune_dead])
	.add(ItemID.sroll18, [ItemID.sroll10, ItemID.rune_dead])
	.add(ItemID.sroll19, [ItemID.sroll12, ItemID.rune_life])
	.add(ItemID.sroll20, [ItemID.sroll15, ItemID.sroll16, ItemID.rune_greed])
	.add(ItemID.sroll21, [ItemID.rune_dead, ItemID.rune5, ItemID.rune_greed, VanillaItemID.bone])
	.add(ItemID.sroll22, [ItemID.sroll8, ItemID.sroll18])
	.add(ItemID.sroll23, [ItemID.sroll8, ItemID.sroll22])
	.add(ItemID.sroll26, [ItemID.sroll18, ItemID.sroll4])
	.add(ItemID.sroll27, [VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust])
	.add(ItemID.sroll28, [VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust])
	.add(ItemID.sroll29, [ItemID.sroll4, ItemID.sroll6])
	.add(ItemID.sroll32, [ItemID.sroll26, ItemID.rune4])
	.add(ItemID.sroll33, [ItemID.sroll32, ItemID.rune4])
	.add(ItemID.sroll34, [ItemID.sroll32, ItemID.sroll33])
	.add(ItemID.sroll35, [ItemID.sroll23, ItemID.sroll34])
	.add(ItemID.sroll36, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll37, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll38, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll39, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll40, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll41, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll42, [ItemID.rune_absorption, ItemID.rune4, ItemID.rune3])
	.add(ItemID.sroll43, [ItemID.sroll42, ItemID.rune4])
	.add(ItemID.sroll44, [ItemID.sroll43, ItemID.rune5])
	.add(ItemID.sroll45, [ItemID.sroll29, ItemID.sroll10])
	.add(ItemID.sroll46, [ItemID.sroll45, ItemID.sroll42])
	.add(ItemID.sroll47, [ItemID.sroll46, ItemID.sroll18]);

for(let i = 1;i <= 10;i++)
	CloneScrollRecipe.add(ItemID["decor"+i], [VanillaItemID.paper, VanillaItemID.paper, ItemID.rune4, ItemID.rune4, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust]);
	

function getItemToInventory(player, it, slots){
	let actor = new PlayerActor(player);
	for(let i = 0;i < 36;i++){
		let item = actor.getInventorySlot(i);
		if(slots.indexOf(i) != -1) continue;
		if(item.id == it) return i;
	}
	return -1;
}

TileEntity.registerPrototype(BlockID.clone_scroll, objectFix(getProtPedestal(.8), {
	useNetworkItemContainer: true,
	defaultValues: {
		aspect: 0,
		aspectMax: 500
	},
	client: objectFix(getProtPedestal(.8).client, {
		containerEvents: {
			updateText(container, window, content, data){
				if(content)
					content.elements.text.text = data.text;
			}
		}
	}),
	containerEvents: {
		updateText(data){
			this.container.sendEvent("updateText", data);
		},
		clone(data, client){
			if(!data.free && this.data.aspect < 2){
				this.container.sendEvent("updateText", {
					text: Translation.translate("aw.clone_scroll.not_aspect")
				});
				return;
			}
			if(!data.free) this.data.aspect -= 2;
			let player = client.getPlayerUid();
			let slots = [];
			let input = this.container.getSlot("scroll");
			let items = CloneScrollRecipe.get(input.id);
			if(items){
				for(let i in items){
					let slot = getItemToInventory(player, items[i], slots);
					if(slot == -1){
						this.container.sendEvent("updateText", {
					text: Translation.translate("aw.clone_scroll.not_item")
				});
						return;
					}
					slots[i] = slot;
				}
				let actor = new PlayerActor(player);
				for(let i in slots){
					let slot = slots[i];
					let item = actor.getInventorySlot(slot);
					actor.setInventorySlot(slot, item.id, item.count-1, item.data, item.extra);
				}
				actor.addItemToInventory(input.id, 1, input.data, input.extra, true);
				this.container.sendChanges();
			}
		}
	},
	setItem(item){
		this.container.setSlot("scroll", item.id, item.count, item.data, item.extra||null);
		this.data.item = item;
	},
	tick(){
		StorageInterface.checkHoppers(this);
		if(World.getThreadTime() % 30 != 0) return;
		let input = this.container.getSlot("scroll");
		this.animation(input);
		let items = CloneScrollRecipe.get(input.id);
		if(items){
			let text = Translation.translate(Item.getName(input.id, input.data))+":\n\n";
			for(let i in items)
				text += Translation.translate(Item.getName(items[i], 0))+"\n";
			this.container.sendEvent("updateText", {text: text});
		}else
			this.container.sendEvent("updateText", {text: ""});
		this.container.sendChanges();
	},
	getScreenName(player, coords){
		let item = Entity.getCarriedItem(player);
		if(item.id != ItemID.bookk && ScrutinyAPI.isScrutiny(player, "aw", "singularity", "clone_scroll"))
			return "main";
	},
	getScreenByName(screenName){
		return CloneScrollUI;
	}
}));

StorageInterface.createInterface(BlockID.clone_scroll, {
	slots: {
		"scroll": {input: true, output: true}
	}
});