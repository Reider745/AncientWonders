let elements = {};
(function(xi, yi, size){
	let cont = elements;
	let slot = 0;
	for(let y = 0;y < 4;y++)
		for(let x = 0;x < 9;x++){
			elements[""+slot] = {type: "slot", x: xi+((size+5)*x), y: yi + (y*(size+5)), size: size, isValid(id){
				return id != ItemID.aw_backpack;
			}, onItemChanged(cont){
				cont.validateAll();
			}};
			slot++;
		}
})(150, 50, 65);
let BackpackUI = createUI({
	drawing: [
		{type: "text", x: 380, y: 40, text: Translation.translate("aw.item.aw_backpack"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}}
	],
	elements:elements
});

function getWindow(name, win){
	return win;
}

ModAPI.addAPICallback("ClassicUI", function(api){
	getWindow = api.getWindow;
});

IDRegistry.genItemID("aw_backpack"); 
Item.createItem("aw_backpack", "aw.item.aw_backpack", {name: "aw_backpack", meta: 0}, {stack: 1});

ItemContainer.registerScreenFactory("aw_backpack", function(){
	return getWindow("aw_item_backpack", BackpackUI, {});
});

let Backpack = {
	getContainerByExtra(extra){
		extra = extra || new ItemExtraData();
		let container = new ItemContainer();
		let items = Wands.getArrByExtra(extra);
		for(let i in items){
			let item = items[i];
			container.setSlot(i, item.id, item.count, item.data, item.extra);
		}
		container.setClientContainerTypeName("aw_backpack");
		let slot;
		container.addServerOpenListener(function(self, client){
			slot = new PlayerActor(client.getPlayerUid()).getSelectedSlot();
		});
		container.addServerCloseListener(function(self, client){
			let actor = new PlayerActor(client.getPlayerUid());
			let item = actor.getInventorySlot(slot);
			actor.setInventorySlot(slot, item.id, item.count, item.data, Backpack.getExtraByContainer(self, item.extra));
		});
		return container;
	},
	getExtraByContainer(container, extra){
		extra = extra || new ItemExtraData();
		let items = [];
		for(let i = 0; i < 36;i++)
			items.push(container.getSlot(String(i)));
		return Wands.getExtraByArr(items, extra);
	}
};

Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(item.id == ItemID.aw_backpack)
		Backpack.getContainerByExtra(item.extra)
			.openFor(Network.getClientForPlayer(player), "main");
});

IDRegistry.genItemID("regularBag"); 
Item.createItem("regularBag", "aw.item.regularbag", {name: "regular_bag", meta: 0}, {stack: 16});

function Bag(id, lootmin, lootmax){
    this.items = [];
    this.addItem = function(chance, id, count, data, extra){
        count = count || {};
        count.min = count.min || 1;
        count.max = count.max || 1;
        data = data || 0
        extra = extra || null;
        this.items.push({chance: chance, id: id, data: data, max: count.max, min: count.min, extra: extra});
    }
    let this_ = this;
    Callback.addCallback('ModsLoaded', function(){
    ModAPI.addAPICallback("RecipeViewer", function(api){
    	var RVTypeAW = (function(_super){
  			__extends(RVTypeAW, _super);
  		  function RVTypeAW(nameRv, icon, content){
     		 let _this = _super.call(this, nameRv, icon, content) || this;
     		 return _this;
   		 }
  		  RVTypeAW.prototype.getAllList = function() {
    			let list = [];
    			for(let i in this_.items){
    				let item = this_.items[i];
    				list.push({
    					output: [{id: item.id, data: item.data, count: 1, tips: "\nchance: "+(item.chance*100)+"%\ncount: "+item.min+" - "+item.max}],
    					input: [],
    				});
    			}
      		return list;
   		 };
   		 RVTypeAW.prototype.slotTooltip = function(name, item, tips){
   		 	return name+(tips||"");
   		 }
    		return RVTypeAW;
  		}(api.RecipeType));
  		api.RecipeTypeRegistry.register(""+id, new RVTypeAW(Translation.translate("aw.gui.rv.bagdrop"), id, {
  			elements: {
  				output0: {x: 440, y: 150, size: 120},
  			}
  		}));
  		});
  	});
    let _this = this;
    Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
        if(item.id == id){
            Entity.setCarriedItem(player, item.id, item.count-1, item.data, item.extra);
            for(let a = Math.floor(Math.random() * (lootmax - lootmin)) + lootmin;a >= 1;a+=0){
                for(let i in _this.items){
                    if(Math.random() <= _this.items[i].chance){
                        BlockSource.getDefaultForActor(player).spawnDroppedItem(coords.x, coords.y+1, coords.z, _this.items[i].id, Math.floor(Math.random() * (_this.items[i].max - _this.items[i].min)) + _this.items[i].min, _this.items[i].data, _this.items[i].extra);
                        a--;
                    }
                }
            }
        }
    });
}

let Bag1 = new Bag(ItemID.regularBag, 1, 2);



IDRegistry.genItemID("piece1"); 
Item.createItem("piece1", "aw.item.piece_magic", {name: "piece", meta: 0}, {stack: 4});

IDRegistry.genItemID("piece2"); 
Item.createItem("piece2", "aw.item.piece_protection", {name: "piece", meta: 0}, {stack: 4});

IDRegistry.genItemID("piece3"); 
Item.createItem("piece3", "aw.item.piece_necromancy", {name: "piece", meta: 0}, {stack: 4});


IDRegistry.genItemID("loreClass1"); 
Item.createItem("loreClass1", "aw.item.lore_class_mage", {name: "piece", meta: 2}, {stack: 1});
Item.setGlint(ItemID.loreClass1, true);

IDRegistry.genItemID("loreClass2"); 
Item.createItem("loreClass2", "aw.item.lore_class_warrior", {name: "piece", meta: 2}, {stack: 1});
Item.setGlint(ItemID.loreClass2, true);

IDRegistry.genItemID("loreClass3"); 
Item.createItem("loreClass3", "aw.item.lore_class_necromancer", {name: "piece", meta: 2}, {stack: 1});
Item.setGlint(ItemID.loreClass3, true);

Item.registerUseFunctionForID(ItemID.piece1, function(coords, item, block, player) {
    var client = Network.getClientForPlayer(player);
    if(client != null){
        MagicCore.piece(player, "magic");
    }
});
Item.registerUseFunctionForID(ItemID.piece2, function(coords, item, block, player) {
    var client = Network.getClientForPlayer(player);
    if(client != null){
        MagicCore.piece(player, "protection");
    }
});
Item.registerUseFunctionForID(ItemID.piece3, function(coords, item, block, player) {
    var client = Network.getClientForPlayer(player);
    if(client != null){
        MagicCore.piece(player, "necromancer");
    }
});

Item.registerUseFunctionForID(ItemID.loreClass1, function(coords, item, block, player) {
    var client = Network.getClientForPlayer(player);
    if(client != null){
        if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "classMage")){
        if(!MagicCore.isClass(player)){
            classPlayer[player] = Class["mage"];
            delItem(player, {id:0,data:0,count:1}) ;
            client.send("aw.classPlayer", {
                player: player, 
                Class:  "mage",
                message: true
            });
        }else{
            translateMessage(player, "aw.message.cannot_class");
        }
        }else{
            translateMessage(player, "aw.message.need_study", [["name", "classMage"]]);
        }
    }
});
Item.registerUseFunctionForID(ItemID.loreClass2, function(coords, item, block, player) {
    var client = Network.getClientForPlayer(player);
    if(client != null){
        if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "classWarrior")){
        if(!MagicCore.isClass(player)){
            classPlayer[player] = Class["warrior"];
            delItem(player, {id:0,data:0,count:1}) ;
            client.send("aw.classPlayer", {
                player: player, 
                Class:  "warrior",
                message: true 
            });
        }else{
            translateMessage(player, "aw.message.cannot_class");
        }
        }else{
            translateMessage(player, "aw.message.need_study", [["name", "classWarrior"]]);
        }
    }
});
Item.registerUseFunctionForID(ItemID.loreClass3, function(coords, item, block, player) {
    var client = Network.getClientForPlayer(player);
    if(client != null){
        if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "classNecromancer")){
        if(!MagicCore.isClass(player)){
            classPlayer[player] = Class["necromancer"];
            delItem(player, {id:0,data:0,count:1}) ;
            client.send("aw.classPlayer", {
                player: player, 
                Class:  "necromancer",
                message: true
            });
        }else{
            translateMessage(player, "aw.message.cannot_class");
        }
        }else{
            translateMessage(player, "aw.message.need_study", [["name", "classNecromancer"]]);

        }
    }
});

IDRegistry.genItemID("pelmeni"); 
Item.createFoodItem("pelmeni", "aw.item.pelmeni", {name: "dumplings", meta: 0}, {stack: 16, food: 10, isTech: true});

IDRegistry.genItemID("staff_singularity"); 
Item.createItem("staff_singularity", "aw.item.staff_singularity", {name: "singularity", meta: 0}, {stack: 1});
IAHelper.makeAdvancedAnim(ItemID.staff_singularity, "singularity", 1, [0, 1, 2, 3]);
Item.setToolRender(ItemID.staff_singularity, true);
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(Entity.getSneaking(player) && item.id==ItemID.staff_singularity){
		item.extra = item.extra || new ItemExtraData()
		item.extra.putInt("x", coords.x);
		item.extra.putInt("y", coords.y);
		item.extra.putInt("z", coords.z);
		translateTipMessage(player, "aw.tip_message.staff_singularity");
		Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra)
	}
})

IDRegistry.genItemID("tanatos"); 
Item.createItem("tanatos", "aw.item.tanatos_stone", {name: "tanatos", meta: 0}, {stack: 1});
IAHelper.makeAdvancedAnim(ItemID.tanatos, "tanatos", 1, [0, 1, 2, 3]);
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(ScrutinyAPI.isScrutiny(player, "aw", "riches", "tanatos")){
		if(item.id != ItemID.tanatos)
			return;
		for(let i = 0;i <= 10;i++)
			ParticlesAPI.spawnCircle(ParticlesAPI.part4, coords.x, coords.y+1, coords.z, i / 2, 11 * i, 2, Entity.getDimension(player));
		let mob = BlockSource.getDefaultForActor(player).spawnEntity(coords.x, coords.y + 1, coords.z, "aw:tanatos");
		Entity.setCarriedItem(mob, ItemID.aw_dead, 1, 0);
  	Entity.setCarriedItem(player, 0, 0, 0);
	}
});

IDRegistry.genItemID("aw_amylet");
Item.createArmorItem("aw_amylet", "aw.item.amylet" , {name: "aw_poic", meta: 0}, {type: "helmet", armor: 2, durability: 699, texture: "armor/noy.png"}); 
Item.setEnchantType(ItemID.aw_amylet, Native.EnchantType.helmet, 14);
Item.addRepairItemIds(ItemID.aw_amylet, [334]);
MagicCore.setArmor(ItemID.aw_amylet, "magic", 0, {scrutiny: "amylet", tab: "riches"});

MagicCore.setArmorMagic(ItemID.aw_amylet, "magic", 5);
IDRegistry.genItemID("aw_amylet2");
Item.createArmorItem("aw_amylet2", "aw.item.amylet" , {name: "aw_poic", meta: 1}, {type: "helmet", armor: 2, durability: 699, texture: "armor/noy.png"}); 

Item.setEnchantType(ItemID.aw_amylet2, Native.EnchantType.helmet, 14);
Item.addRepairItemIds(ItemID.aw_amylet2, [334]);
MagicCore.setArmorMagic(ItemID.aw_amylet2, "dead", 10);
MagicCore.setArmor(ItemID.aw_amylet2, "magic", 0, {scrutiny: "amylet", tab: "riches"});

IDRegistry.genItemID("aw_amylet3");
Item.createArmorItem("aw_amylet3", "aw.item.amylet" , {name: "aw_poic", meta: 2}, {type: "helmet", armor: 2, durability: 699, texture: "armor/noy.png"}); 

Item.setEnchantType(ItemID.aw_amylet3, Native.EnchantType.helmet, 14);
Item.addRepairItemIds(ItemID.aw_amylet3, [334]);
MagicCore.setArmor(ItemID.aw_amylet3, "magic", 0, {scrutiny: "amylet", tab: "riches"});

let AmyletMagic = new AncientWonders.Bonus("amylet")
	.register();

Callback.addCallback("ServerPlayerTick", function(player){
	if(World.getThreadTime() % 20 != 0) return;
	
	AmyletMagic.setMagic(player, 0);
	AmyletMagic.setProtection(player, 0);
	AmyletMagic.setNecromancer(player, 0);
	switch(Entity.getArmorSlot(player, 0).id){
		case ItemID.aw_amylet:
			AmyletMagic.setMagic(player, 5);
		break;
		case ItemID.aw_amylet2:
			AmyletMagic.setNecromancer(player, 5);
		break;
		case ItemID.aw_amylet3:
			AmyletMagic.setProtection(player, 5);
		break;
	}
});

IDRegistry.genItemID("aw_amylet4");
Item.createArmorItem("aw_amylet4", "aw.item.amylet" , {name: "aw_poic", meta: 3}, {type: "helmet", armor: 2, durability: 699, texture: "armor/noy.png"}); 

Item.setEnchantType(ItemID.aw_amylet4, Native.EnchantType.helmet, 14);
Item.addRepairItemIds(ItemID.aw_amylet4, [334]);
MagicCore.setArmorMagic(ItemID.aw_amylet4, "magic", 5);
MagicCore.setArmor(ItemID.aw_amylet4, "magic", 0, {scrutiny: "amylet", tab: "riches"});

Armor.registerOnTickListener(ItemID.aw_amylet4, function(item, slot, player) {
    if(Math.random()<=0.05){
        let c = MagicCore.getValue(player);
        if(c.aspectsNow >= c.aspects + 2) c.aspects+=2;
    }
});

if(__config__.getBool("beta_mode")){
IDRegistry.genItemID("beltAw");
Item.createArmorItem("beltAw", "aw.item.belt" , {name: "aw_poic", meta: 4}, {type: "leggings", armor: 2, durability: 699, texture: "armor/noy.png"}); 
Item.setEnchantType(ItemID.beltAw, Native.EnchantType.leggings, 14);
Item.addRepairItemIds(ItemID.beltAw, [334]);
MagicCore.setArmorMagic(ItemID.beltAw, "dead", 20);
}

IDRegistry.genItemID("piece4"); 
Item.createItem("piece4", "aw.item.piece_knowledge", {name: "piece", meta: 1}, {stack: 1});
Item.registerNameOverrideFunction(ItemID.piece4, function(item, name) {
    let extra = item.extra || new ItemExtraData();
    return name + extra.getString("name2", "всё")
});

function addScrut(window, tab, name, name2, chance){
    let e = new ItemExtraData();
    e.putString("window", window);
    e.putString("tab", tab);
    e.putString("name", name);
    e.putString("name2", name2);
    Callback.addCallback("AddScrutiny", function(_window, _tab, _name){
if(window + tab + name == _window + _tab + _name)
   ScrutinyAPI_V2.windows[window].tabs[tab].scrutinys[name].name = name2;
});
    arrScrut.push({
        win: window,
        tab: tab,
        name: name,
        name2: name2,
        chance: chance || 0.05
    });
    Item.addToCreative(ItemID.piece4, 1, 1, e);
}
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
    if(item.id == ItemID.piece4 && item.extra){
        if(ScrutinyAPI.giveScrutiny(player, ""+item.extra.getString("window", "aw"), ""+item.extra.getString("tab", "magic"), ""+item.extra.getString("name", "name"), true)){
            Entity.setCarriedItem(player, 0, 0, 0, null);
            translateMessage(player, "aw.message.scrutiny", [["name", item.extra.getString("name2", "name")]]);
        }else{
        	translateMessage(player, "aw.message.scrutiny_give_noy", [["name", item.extra.getString("name2", "name")]]);
        }
    }else if(item.id == ItemID.piece4){
        for(let i in arrScrut){
            ScrutinyAPI.giveScrutiny(player, arrScrut[i].win, arrScrut[i].tab, arrScrut[i].name, false);
        }
        translateMessage(player, "aw.message.scrutiny_all");
    }
});
Item.addCreativeGroup("scrutiny", Translation.translate("aw.creative_group.scrutiny"), [
	  ItemID.piece4
]);
