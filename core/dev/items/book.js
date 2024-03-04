IDRegistry.genItemID("bookk"); 
Item.createItem("bookk", "aw.item.book", {name: "book", meta: 0}, {stack: 1});

IDRegistry.genItemID("scrutiny_book");
Item.createItem("scrutiny_book", "aw.item.scrutiny_book", {name: "scrutiny_book", meta: 0}, {stack: 1});

void function(){
	let book = new Book("book_class");
	
	function addText(page, text, size){
		page.add(true, "text", text, new Text()
				.setSize(size));
	}

	Network.addClientPacket("aw.book_class", function(data){
		let page = new Page();
	
		addText(page, "aw.gui.book_title", 1.5);
		
		let draws = BookAPI.draws[data.name] || {};
		let player = Player.get();
		let i = 0;
		
		for(let key in draws)
			addText(page, draws[key](data, player, i++, key), 1.1);
	
		book.addPage("default", page);
		book.openClient();
	});
}();

let BookAPI = {
	draws: {},
	drawFunc(ClassName, parameter, func){
		if(!this.draws[ClassName])
			this.draws[ClassName] = {};
		this.draws[ClassName][parameter] = func;
	},
	
	copy(new_class, org_class){
		let draws = this.draws;
		
		if(!draws[new_class])
			draws[new_class] = {};
			
		if(!draws[org_class])
			draws[org_class] = {};
			
		for(let key in draws[org_class])
			draws[new_class][key] = draws[org_class][key];
	},
	open(player){
		let client = Network.getClientForPlayer(player);
		client && client.send("aw.book_class", MagicCore.getValue(player));
	}
};

BookAPI.drawFunc("noy", "message", function(classData, player, i, nameParameter){
	return Translation.translate("aw.gui.book_class_noy")
});

Callback.addCallback("ItemUse", function(coords, item, block, is, player){
	if(item.id == ItemID.bookk && !Game.isActionPrevented() && RitualAPI.pedestals.indexOf(block.id) == -1 && block.id != BlockID.MagicConnector && block.id != BlockID.magicController){
		if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "book")){
			if(Entity.getSneaking(player)){
				let data = MagicCore.getValue(player);
				translateMessage(player, data.aspects + "/" + data.aspectsNow);
			}else
				BookAPI.open(player)
		}else
			translateMessage(player, "aw.message.need_study", [["name", "book"]]);
	}
}, -10);