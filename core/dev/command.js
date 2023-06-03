function getPlayerByName(name){
	let players = Network.getConnectedPlayers();
	for(let i in players)
		if(Entity.getNameTag(players[i])==name)
			return players[i];
}
Network.addServerPacket("class.clear", function(p){
	if(__config__.get("debug.command"))
		delete classPlayer[getPlayerByName(p)]
});

Network.addServerPacket("scrutiny.clear", function(p){
	if(__config__.get("debug.command")){
		let scru = ScrutinyAPI_V2.scrutiny;
		let wins = Object.keys(scru);
		for(let w in wins){
			let tabs = Object.keys(scru[wins[w]]);
			for(let t in tabs){
				if(scru[wins[w]][tabs[t]].player[getPlayerByName(p)])
					delete scru[wins[w]][tabs[t]].player[getPlayerByName(p)];
			}
		}
	}
});

Callback.addCallback("NativeCommand", function(str){
	let cmd = str.split(" ");
	if(cmd[0] == "/aw")
		if(cmd[1] == "class"){
			if(cmd[2] == "clear")
				Network.sendToServer("class.clear", cmd[3])
		}else if(cmd[1] == "scrutiny"){
			if(cmd[2] == "clear")
				Network.sendToServer("scrutiny.clear", cmd[3])
		}
})