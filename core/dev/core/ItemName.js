if(!Game.isDedicatedServer())
	var CustomName = com.core.api.Item;
else
	var CustomName = {
		overrideName(){}
	};

Network.addClientPacket("ItemName.setNameClient", function(data){
	for(let key in data){
		let obj = data[key];
		if(!ItemName.names[obj.id])
			ItemName.names[obj.id] = Translation.translate(Item.getName(obj.id, 0));
		if(obj.add)
			CustomName.overrideName(obj.id, String(ItemName.names[obj.id] + obj.name));
		else
			CustomName.overrideName(obj.id, String(obj.name));
	}
});

let canLoadedCoreUtility = false;

Callback.addCallback("ServerPlayerLoaded", function(player){
	if(canLoadedCoreUtility) return;
	let client = Network.getClientForPlayer(player);
	if(client)
		client.send("ItemName.setNameClient", ItemName.customs);
});

var ItemName = {
	customs: {},
	names: {},
	setName(id, name, add){
		this.customs[id] = {
			id: id,
			name: name,
			add: !!add
		};
	}
};

ModAPI.addAPICallback("CoreUtility", function(api){
	canLoadedCoreUtility = true;
	
	for(let key in ItemName.customs){
		let obj = ItemName.customs[key];
		if(obj.add)
			api.ToolTip.addToolTip(obj.id, -1, String(obj.name));
		else
			CustomName.overrideName(obj.id, String(obj.name));
	}
});
