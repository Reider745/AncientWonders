IDRegistry.genItemID("bookk"); 
Item.createItem("bookk", "aw.item.book", {name: "book", meta: 0}, {stack: 1});

IDRegistry.genItemID("scrutiny_book");
Item.createItem("scrutiny_book", "aw.item.scrutiny_book", {name: "scrutiny_book", meta: 0}, {stack: 1});

Network.addClientPacket("aw.open", function(packetData) {
    new UI.Container().openAs(new UI.StandartWindow(packetData.gui));
});

let BookAPI = {
	draws: {},
	drawFunc(ClassName, parameter, func){
		if(!this.draws[ClassName])
			this.draws[ClassName] = {};
		this.draws[ClassName][parameter] = func;
	},
	getGui(player){
		let c = MagicCore.getValue(player);
		let elem = {
			"close": {type: "closeButton", x: 930, y: 10, bitmap: "btn_close", scale: 3}, 
			"title": {type: "text", x: 50, y: 40, text: Translation.translate("aw.gui.book_title"), font: {size: 20}},
		};
		if(!this.draws[c.name]) 
			this.draws[c.name] = {};
		let keys = Object.keys(this.draws[c.name]);
		let x = 50;
		let y = 65;
		for(let i in keys){
			let output = this.draws[c.name][keys[i]](c, player, i, keys[i]);
				elem["text"+i] = {type: "text", text: output, x: x, y: y, font:{size:15}};
				y+=18;
				if(y >= UI.getScreenHeight()){
					x = 550;
					y = 40;
				}
		}
  	return {
  		standart: {
  			background: {
  				bitmap: "book_background",
  				color: android.graphics.Color.argb(256, 0, 0, 0)
  			}
  		},
  		drawing: [],
  		elements: elem
  	};
	},
	copy(new_class, org_class){
		if(!this.draws[new_class])
			this.draws[new_class] = {};
		if(!this.draws[org_class])
			this.draws[org_class] = {};
		let keys = Object.keys(this.draws[org_class]);
		for(let i in keys)
			this.draws[new_class][keys[i]] = this.draws[org_class][keys[i]];
	},
	open(player){
		let client = Network.getClientForPlayer(player);
    if(client){
   	 client.send("aw.open", {
     	 player: player,
     	 gui: BookAPI.getGui(player)
      }); 
    }
	}
};
BookAPI.drawFunc("noy", "message", function(classData, player, i, nameParameter){
	return Translation.translate("aw.gui.book_class_noy")
});
/*(function(){
	let playerClass = ["mage", "warrior", "necromancer"];
for(let i in playerClass){
BookAPI.drawFunc(playerClass[i], "name", function(classData, player, i, nameParameter){
	return Translation.translate("aw.gui.book_class") + ": "+classData["name"]
});
BookAPI.drawFunc(playerClass[i], "magic", function(classData, player, i, nameParameter){
	return Translation.translate("magic") + ": "+classData["magic"]+"/"+classData["magicMax"]
});
BookAPI.drawFunc(playerClass[i], "protection", function(classData, player, i, nameParameter){
	return Translation.translate("protection") + ": "+classData["protection"]+"/"+classData["protectionMax"]
});
BookAPI.drawFunc(playerClass[i], "necromancer", function(classData, player, i, nameParameter){
	return Translation.translate("necromancer") + ": "+classData["necromancer"]+"/"+classData["necromancerMax"]
});
BookAPI.drawFunc(playerClass[i], "aspects", function(classData, player, i, nameParameter){
	return Translation.translate("aspects") + ": "+classData["aspectsNow"]+"/"+classData["aspectsMax"]
});
}})();*/
Callback.addCallback("ItemUse", function(coords, item, block, isExternal, player){
    if(item.id == ItemID.bookk && block.id != BlockID.MagicConnector && block.id != BlockID.magicController){
        if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "book")){
    var client = Network.getClientForPlayer(player);
        if(client) {
            if(!Entity.getSneaking(player)){
                if(RitualAPI.pedestals.indexOf(block.id) == -1){
                BookAPI.open(player);
                } 
          }else{
            let c = MagicCore.getValue(player);
               PlayerAC.message(player, c.aspects + "/" + c.aspectsNow);
            }
        }
        }else{
        PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", "book"]]));
    }
    }
});
