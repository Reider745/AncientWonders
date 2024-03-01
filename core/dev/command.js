function getPlayerByName(name){
	let players = Network.getConnectedPlayers();
	for(let i in players){
		let player = players[i];
		if(String(Entity.getNameTag(player)) == name)
			return player;
	}
	return null;
}

function parseCommand(symbols){
	let args = [""];
	let str = false;
	for(let i in symbols){
		let symbol = symbols[i];
		
		if(symbol == " " && !str)
			args.push("");
			
		if(symbol == "\""){
			str = !str;
			continue;
		}
		if(symbol != " " || str)
			args[args.length - 1] += symbol;
	}
	return args;
}

function CommandRegistry(name){
	this.name = name;
	
	let _types = [];
	let _runClient = function(){};
	let _runServer = function(){};
	let _more_entity = false;
	let _args = [];
	let _description = "";
	
	this.getDescription = function(){
		return translate(_description);
	}
	
	this.setDescription = function(description){
		_description = description;
		return this;
	}
	
	let showed_command = true;
	
	this.setShowedCommand = function(value){
		showed_command = value;
		return this;
	}
	
	this.canShowedCommand = function(){
		return showed_command;
	}
	
	this.setTypesArgs = function(){
		_types = arguments;
		return this;
	}
	
	this.setMoreEntity = function(more_entity){
		_more_entity = more_entity;
		return this;
	}
	
	this.getTypesArgs = function(){
		return _types;
	}
	
	this.setArgs = function(args, player, pos){
		_args = [];
		if(_types.length != args.length)
			return translate("aw.command.not_enough_arguments");
		
		for(let i in args){
			let type = _types[i];
			if(!Array.isArray(type))
				type = type.split(":")[0];
			let value = args[i];
			
			if(type == "number"){
				try{
					_args.push(parseInt(value));
				}catch(e){return translate("aw.command.invalid_number");}
			}else if(type == "mobs" || type == "player"){
				let mob = this.getMobsFor(value, player, pos);
				
				if(_more_entity){
					if(mob === null) 
						return translate("aw.command.mobs_not_found");
					_args.push(mob);
				}else{
					if(mob.length > 1) 
						return translate("aw.command.not_allowed_mobs");
					if(mob[0] === null) 
						return translate("aw.command.mob_not_found");
					_args.push(mob[0]);
				}
			}else if(type == "boolean"){
				switch(value){
					case "true":
						_args.push(true);
					break;
					case "false":
						_args.push(false);
					break;
					default:
						return translate("aw.command.invalid_value");
				}
			}else if(Array.isArray(type)){
				if(type.indexOf(value) == -1)
					return translate("aw.command.invalid_type", [["name", value]]);
				_args.push(value);
			}else
				_args.push(value);
		}
		
		return "complete";
	}
	
	this.getMobsFor = function(value, player, pos){
		let entitys = Network.getConnectedPlayers();
		switch(value){
			case "@s":
				return [player];
				
			case "@r":
				return [entitys[Math.floor(Math.random()*entitys.length)]];
				
			case "@p":
				if(!pos) return null;
				
				let closest = {
					entity: null,
          dis: 999999999
        };
        
        for(let i in entitys){
        	let entity = entitys[i];
        	let dis = Entity.getDistanceToCoords(entity, pos);
        	
        	if(dis < closest.dis) {
        		closest.entity = entity;
        		closest.dis = dis;
					}
				}
				
				return [Number(closest.entity)];
			break;
			
			case "@a":
				return entitys;
				
			default:
				return [getPlayerByName(value)];
		}
	}
	
	this.send = function(){
		Network.sendToServer("command."+name, {
			args: _args
		});
		return this;
	}
	
	this.setRunClient = function(func){
		_runClient = func;
		return this;
	}
	
	this.runClient = function(){
		return _runClient.call(this, _args);
	}
	
	
	this.setRunServer = function(func){
		_runServer = func;
		return this;
	}
	
	this.runServer = function(client, args){
		return _runServer.call(this, client, args);
	}
	
	this.successfully = function(player){
		if(player)
			PlayerAC.message(player, translate("aw.command.successfully"));
		else
			Game.message(translate("aw.command.successfully"));
	}
}

CommandRegistry.commands = {};

CommandRegistry.create = function(cmd){
	if(!Game.isDedicatedServer())
		Network.addServerPacket("command."+cmd.name, function(client, data){
			cmd.runServer(client, data.args);
		});
	
	CommandRegistry.commands["/"+cmd.name] = cmd;
}

const CommandDefault = {
	CLIENT(){
		this.send();
		return true;
	}
};

Callback.addCallback("NativeCommand", function(str){
	let args = parseCommand(str.split(""));
	let name = args.shift();
	
	let cmd = CommandRegistry.commands[name];
	if(cmd){
		let player = Number(Player.get());
		let status = cmd.setArgs(args, player, Entity.getPosition(player));
		if(status != "complete"){
			Game.message(status);
			Game.prevent();
			return;
		}
		if(cmd.runClient())
			Game.prevent();
	}
});


CommandRegistry.create(new CommandRegistry("aw_help")
	.setDescription("aw.command.description.aw_help")
	.setRunClient(function(){
		let message = "=======Ancient wonders=======";
		
		for(let i in CommandRegistry.commands){
			let command = CommandRegistry.commands[i];
			if(!command.canShowedCommand()) continue;
			
			let message_to_command = "\n/"+command.name;
			let types = command.getTypesArgs();
			for(let a in types){
				let type = types[a];
				if(Array.isArray(type)){
					let enum_values = "";
					for(let b in type)
						enum_values+=type[b]+(b === ""+(type.length-1) ? "" : ",");
						message_to_command += " "+enum_values;
				}else
					message_to_command += " "+type;
			}
				
			let description = command.getDescription();
			if(description != "")
				message_to_command += " - "+description
			message += message_to_command;
		}
		
		Game.message(message);
		return true;
	}));
	
CommandRegistry.create(new CommandRegistry("aw_stats")
	.setDescription("aw.command.description.aw_stats")
	.setTypesArgs(["dev", "new"], "player")
	.setRunServer(function(client, args){
		switch(args[0]){
			case "dev":
				AncientWonders.setPlayerClass(args[1], "developer");
			break;
			case "new":
				AncientWonders.setPlayerClass(args[1]);
			break;
		}
		this.successfully(args[1]);
	})
	.setRunClient(CommandDefault.CLIENT));
	
CommandRegistry.create(new CommandRegistry("scrutiny_save")
	.setDescription("aw.command.description.scrutiny_save")
	.setTypesArgs("boolean")
	.setRunServer(function(client, args){
		ScrutinyAPI.save = args[0];
		this.successfully(client.getPlayerUid());
	})
	.setRunClient(CommandDefault.CLIENT));