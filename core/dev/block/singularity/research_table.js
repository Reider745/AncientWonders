IDRegistry.genBlockID("research_table");
Block.createBlock("research_table", [ {name: "aw.block.research_table", texture: [["plant", 0]], inCreative: true} ]);
ResearchTable.setBlockModel(BlockID.research_table);
let ResearchTableUI = createUI({
	drawing: [
{type: "text", x: 380, y: 40, text: Translation.translate("aw.block.research_table"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}},
		{type: "bitmap", bitmap: "furnace_bar_guide", x: 415, y: 180, scale: 8},
	],
	elements: {
		"slotInputPaper": {type: "slot", x: 200, y: 100, size: 140},
		"slotInputScrutiny": {type: "slot", x: 200, y: 250, size: 140},
		"slotResult": {type: "slot", x: 650, y: 195, size: 100},
		
    "textAspects": {type: "text", x: 395, y: 110, text: "", font: {color: android.graphics.Color.rgb(0, 0, 0), size: 25}},
    "textScrutiny": {type: "text", x: 640, y: 295, text: "", font: {color: android.graphics.Color.rgb(0, 0, 0), size: 25}}
	}
});
SingularityAPI.setBlockOutputName(BlockID.research_table, "output", true);
TileEntity.registerPrototype(BlockID.research_table, {
    useNetworkItemContainer: true,
    defaultValues: {
    	aspect: 0,
			aspectMax: 500
    },
    tick: function(){
    	StorageInterface.checkHoppers(this);
    	let slotResult = this.container.getSlot("slotResult");
    	let slotScrutiny = this.container.getSlot("slotInputScrutiny");
    	this.container.setText("textScrutiny", (slotResult.extra || new ItemExtraData()).getString("name2", ""));
    	this.container.setText("textAspects", "aspects"+(slotScrutiny.extra || new ItemExtraData()).getString("aspect", 5));
    	this.container.validateAll();
    	this.craft();
    	this.container.sendChanges();
    },
    craft: function(){
    	let slotPaper = this.container.getSlot("slotInputPaper");
    	let slotScrutiny = this.container.getSlot("slotInputScrutiny");
    	let slotResult = this.container.getSlot("slotResult");
    	if(slotPaper.id == VanillaItemID.paper){
    		if(slotScrutiny.id == ItemID.piece4){
    			if(slotResult.id == 0){
    				let aspect = (slotScrutiny.extra || new ItemExtraData()).getInt("aspect", 5);
    				if(this.data.aspect >= aspect){
    					this.data.aspect-=aspect;
    					let scrut = arrScrut[Math.floor(Math.random()*arrScrut.length)];
    					let e = new ItemExtraData();
    					e.putString("window", scrut.win);
    					e.putString("tab", scrut.tab);
    					e.putString("name", scrut.name);
   				 	e.putString("name2", scrut.name2); 
   					 e.putInt("aspect", aspect+5);
    						this.container.setSlot("slotResult", ItemID.piece4, 1, 0, e);
    						this.container.setSlot("slotInputPaper", slotPaper.id, slotPaper.count-1, slotPaper.data, slotPaper.extra);
    						this.container.setSlot("slotInputScrutiny", slotScrutiny.id, slotScrutiny.count-1, slotScrutiny.data, slotScrutiny.extra);
    				}
    			}
    		}
    	}
    },
    getScreenName: function(player, coords){
        return "main";
    },
    getScreenByName: function(screenName){
        return ResearchTableUI;
    }
});
StorageInterface.createInterface(BlockID.research_table, {
	slots: {
		"slotInputPaper": {input: true, isValid: function(item, side, tileEntity){
			return side == 1;
    }},
		"slotInputScrutiny": {input: true, isValid: function(item, side, tileEntity){
			return side > 1;
    }},
		"slotResult": {output: true}
	}
});



