let players_use_wand = {};

var Wands = {
	//var
	stick: {},
	icon: [],
	prot: {},
	decor: {},
	
	//wand
	addStick(obj){
		obj.bonus = obj.bonus || {};
    obj.scrutiny = obj.scrutiny || {};
    if(!obj.scrutiny.name){
    	obj.scrutiny.enable = true;
    }else{
      obj.scrutiny.enable = false;
    }
    obj.scrutiny.name = obj.scrutiny.name || "";
    obj.scrutiny.tab = obj.scrutiny.tab || "basics";
    obj.scrutiny.window = obj.scrutiny.window || "aw";
    obj.use = obj.use || function(){};
    obj.scroll_max = obj.scroll_max || 1;
    this.stick[obj.id] = obj;
    Item.setToolRender(obj.id, true);
    Item.setMaxUseDuration(obj.id, obj.time);
    Item.setUseAnimation(obj.id, Native.ItemAnimation.bow);
    Item.registerIconOverrideFunction(obj.id, function(item, name){
    	if(item.extra){
     	 let extra = item.extra || new ItemExtraData();
        let texture = {
        	name: extra.getString("texture", obj.texture.name || "noy"),
          meta: extra.getInt("meta", obj.texture.meta || 0),
        };
        return {name: texture.name, meta: texture.meta}
      } 
    });
    Item.registerNameOverrideFunction(obj.id, function(item, name, translation) {
    	item.extra = item.extra || new ItemExtraData();
      name = name + "\n " + Translation.translate(Item.getName(Network.serverToLocalId(item.extra.getInt("event", 0)), item.data));
      let spells = Wands.getArrByExtra(item.extra);
      for(let i in spells){
      	let spell = spells[i];
      	let id = Network.serverToLocalId(spell.id);
      	name = name + "\n " + Wands.getPrototype(id).getName(Translation.translate(Item.getName(id, spell.data)), item, spell);
      }
    	return name;
    });
	},
	getStick(id){
		return this.stick[id];
	},
	addIcon(id, name, meta){
		this.icon.push({
    	name: name,
      meta: meta,
      id: id
    });
	},
	addIconAll(name, meta){
		let keys = Object.keys(this.stick);
    for(let i in keys){
    	this.addIcon(parseInt(keys[i]), name, meta);
    }
	},
	getIconArr(id){
		if(this.stick[id]){
    	let arr = [];
      arr[0] = {
      	name: this.stick[id].texture.name || "noy",
        meta: this.stick[id].texture.meta || 0
      };
      for(let i in this.icon){
      	if(id == this.icon[i].id) arr.push(this.icon[i]);
      }
      return arr;
    }else{
      return [];
 	 }
	},
	
	addEvent(item, player, name, packet){
		packet = packet || {};
		packet.coordsOriginal = packet.coordsOriginal || {};
		packet.coordsOriginal.x = packet.coordsOriginal.x || 0;
		packet.coordsOriginal.y = packet.coordsOriginal.y || 0;
		packet.coordsOriginal.z = packet.coordsOriginal.z || 0;
		packet.coordsOriginal.relative = packet.coordsOriginal.relative || {
			x: 0,
			y: 0,
			z: 0
		};
		packet.coordsOriginal.vec = packet.coordsOriginal.vec || {
			x: 0,
			y: 0,
			z: 0
		};
		Threading.initThread("Wand", function(){
			try{
		if(Wands.stick[item.id]){
			let extra = item.extra || new ItemExtraData();
			let wand = Wands.getStick(item.id);
			if(wand.scrutiny.enable || ScrutinyAPI.isScrutiny(player, wand.scrutiny.window, wand.scrutiny.tab, wand.scrutiny.name)){

				if(players_use_wand[player])
					return;
				
				let event = Wands.getPrototype(extra.getInt("event", 0));
				if(event.event != name)
					return;
				if(extra.getInt("event", 0)==0){
        	translateMessage(player, "aw.message.use_empty");
        	return;
        }else if(wand.sound){
        	playSound(wand.sound, player, 16);
        }
        
        players_use_wand[player] = true;
        
        let spells = Wands.getArrByExtra(extra);
        if(wand.startUsing)
        	wand.startUsing(packet);
        for(let i = 0;i < Math.min(spells.length,wand.scroll_max);i++){
        	if(Wands.isCompatibility(extra.getInt("event", 0), spells[i].id)){
        			
        		let prot = Wands.getPrototype(spells[i].id);
        		if(prot.scrutiny.enable && !ScrutinyAPI.isScrutiny(player, prot.scrutiny.window, prot.scrutiny.tab, prot.scrutiny.name)){
        			translateMessage(player, "aw.message.need_study", [["name", prot.scrutiny.name]]);
        			continue;
        		}
        		if(AncientWonders.isParameters(player, prot.activate, wand.bonus)){
        			let c = MagicCore.getValue(player);
        			if(0 <= prot.activate.aspects - (wand.bonus.aspects||0)){
        				c.aspects -= prot.activate.aspects - (wand.bonus.aspects||0);
        				MagicCore.setParameters(player, c, 5);
        			}
              
              packet.sroll = spells;
              packet.srollType = extra.getInt("event", 0);
              packet.type = name;
              packet.wand = item;
             
              event.using(packet);
              wand.use(packet);
              packet.item = spells[i];
              packet.spellI = i;
              	
              packet.coords = {x:packet.coordsOriginal.x+(packet.x||0),y:packet.coordsOriginal.y+(packet.y||0),z:packet.coordsOriginal.z+(packet.z||0), side: packet.coordsOriginal.side||0, relative: {
              	x:packet.coordsOriginal.relative.x+(packet.x||0),
              	y:packet.coordsOriginal.relative.y+(packet.y||0),
              	z:packet.coordsOriginal.relative.z+(packet.z||0)
              }, vec: {
              	x:packet.coordsOriginal.vec.x+(packet.x||0),
              	y:packet.coordsOriginal.vec.y+(packet.y||0),
              	z:packet.coordsOriginal.vec.z+(packet.z||0)
              }};
              java.lang.Thread.sleep((prot.time||0)*50);
              if(prot.setFunction)
              	prot.setFunction(packet);
        		}else{
        			AncientWonders.message(player, prot.activate, wand.bonus, function(player, obj, bonus, name){
        			return ["aw.message.wand", [["name", name], ["value", obj[name] - (bonus[name]||0)], ["scroll", Item.getName(spells[i].id)]]];
        		})
        		}
        	}else{
        		translateMessage(player, "aw.message.wand.not_compatible_with", [["event", Item.getName(extra.getInt("event", 0))],["scroll", Item.getName(spells[i].id)]]);
        	}
        }
        if(spells.length == 0){
        	translateMessage(player, "aw.message.use_empty");
        }
        
        delete players_use_wand[player];
			}else{
      	translateMessage(player, "aw.message.need_study", [["name", wand.scrutiny.name]]);
			}
		}
		}catch(e){
			alert(e)
			Logger.Log(e);
			Logger.Flush();
			delete players_use_wand[player];
		}
		});
	},
	emitterEntity(entity, obj){
		if(EffectAPI.getLevel(entity, "noy_magic") > 0)
			return;
		obj.coordsOriginal = obj.coordsOriginal || {};
		obj.coordsOriginal.x = obj.coordsOriginal.x || 0;
		obj.coordsOriginal.y = obj.coordsOriginal.y || 0;
		obj.coordsOriginal.z = obj.coordsOriginal.z || 0;
		obj.coordsOriginal.relative = obj.coordsOriginal.relative || {
			x: 0,
			y: 0,
			z: 0
		};
		obj.coordsOriginal.vec = obj.coordsOriginal.vec || {
			x: 0,
			y: 0,
			z: 0
		};
		Threading.initThread("Wand", function(){
			try{
		obj.wand.extra = obj.wand.extra || new ItemExtraData();
		obj.wand.extra = Wands.getExtraByArr(obj.spells);
		obj.wand.extra.putInt("event", obj.event);
		let time = 0;
		for(let i in obj.spells){
			obj.spells[i].extra = obj.spells[i].extra || new ItemExtraData();
			obj.packet.sroll = obj.spells;
      obj.packet.srollType = obj.event;
      obj.packet.spellI = i;
      obj.packet.type = Wands.getPrototype(obj.event).event;
      obj.packet.wand = obj.wand;
      obj.packet.item = obj.spells[i];
      Wands.getPrototype(obj.event).using(obj.packet);
      let prot = Wands.getPrototype(obj.spells[i].id);
    	obj.packet.spellI = i;
    	obj.packet.item = obj.spells[i];
      obj.coords = {x:obj.coordsOriginal.x+(obj.x||0),y:obj.coordsOriginal.y+(obj.y||0),z:obj.coordsOriginal.z+(obj.z||0), side: obj.coordsOriginal.side||0, relative: {
      	x:obj.coordsOriginal.relative.x+(obj.x||0),
      	y:obj.coordsOriginal.relative.y+(obj.y||0),
        z:obj.coordsOriginal.relative.z+(obj.z||0)
       }, vec: {
       	x:obj.coordsOriginal.vec.x+(obj.x||0),
       	y:obj.coordsOriginal.vec.y+(obj.y||0),
       	z:obj.coordsOriginal.vec.z+(obj.z||0)
			}};
      java.lang.Thread.sleep((prot.time||0)*50);
    	if(prot.setFunction)
      	prot.setFunction(obj.packet);
		}
		}catch(e){
			alert(e)
			Logger.LogError(e);
			Logger.Flush();
		}
		});
	},
	
	//sroll
	getPrototype(id){
		return this.prot[id] || {type: "event",event: "noy",installation: function (player, item){}};
	},
	setPrototype(id, obj){
		obj.activate = obj.activate || {};
    obj.scrutiny = obj.scrutiny || {};
    obj.scrutiny.enable = !!obj.scrutiny.name;
    obj.scrutiny.name = obj.scrutiny.name || "";
    obj.scrutiny.tab = obj.scrutiny.tab || "basics";
    obj.scrutiny.window = obj.scrutiny.window || "aw"
    obj.getName = obj.getName || function(name){return name;}
    this.prot[id] = obj;
	},
	registerSrollDecoration(id){
		this.decor[id] = {
    	types: [],
    	def: "usingReleased"
    };
    this.setPrototype(id, {
    	type: "function", 
      compatibility: [],
      setFunction: function(packet){
      	for(let i in Wands.decor[id].types)
        	if(packet.type == Wands.decor[id].types[i].type)
         	   return Wands.decor[id].types[i].func(packet);
        let def = Wands.decor[id].def;
        for(let i in Wands.decor[id].types)
        	if(Wands.decor[id].types[i].type == def)
       		 return Wands.decor[id].types[i].func(packet);
      },
      installation: function(player, item){
        delItem(player, item);
      }
    });
    return {
    	id: id,
      addType: function(name, func){
     	 Wands.decor[this.id].types.push({
        	type: name,
          func: func
        });
        return this;
      },
      setDefault(name){
      	Wands.decor[this.id].def = name;
      	return this;
      },
      getObject: function(){
      	return Wands.decor[this.id];
      },
      getId: function(){
        return this.id;
      }
    };
	},
	getSrollDecoration(id){
		if(this.decor[id]){
    	return {
      	id: id,
        addType: function(name, func){
       	 Wands.decor[this.id].types.push({
          	type: name,
            func: func
          });
        },
        getObject: function(){
        	return Wands.decor[this.id];
        },
        getId: function(){
        	return this.id;
        }
      };
    }else{
      return {};
    }
	},
	isCompatibility(id1, id2){
		let code1 = this.getPrototype(id1);
    let code2 = this.getPrototype(id2);
    let compatibility = {};
    for(let i in code2.compatibility){
    	let name = code2.compatibility[i];
      compatibility[name] = name;
    }
    if(id1 == compatibility[id1]){
    	return false;
    }else{
      return true;
    }
	},
	addCompatibility(id, type){
		this.prot[id].compatibility.push(type);
	},
	
	//subsidiary
	getArrByExtra(extra){
		extra = extra || new ItemExtraData();
		let length = extra.getInt("length", 0);
		let arr = [];
		for(let i = 0;i < length;i++){
			arr.push({
				id: extra.getInt("itemId"+i, 0),
				data: extra.getInt("itemData"+i, 0),
				count: extra.getInt("itemCount"+i, 0),
				extra: (function(){
					let extraArr = new ItemExtraData();
					let extraStr = extra.getString("itemExtra"+i, "null");
					if(extraStr == "null")
						return extraArr;
					extraArr.setAllCustomData(extraStr);
					return extraArr;
				})()
			});
		}
		return arr;
	},
	getExtraByArr(arr, extra){
		extra = extra || new ItemExtraData();
		extra.putInt("length", arr.length);
		for(let i in arr){
			extra.putInt("itemId"+i, arr[i].id);
			extra.putInt("itemData"+i, arr[i].data);
			extra.putInt("itemCount"+i, arr[i].count === undefined ? 1 : arr[i].count);
			if(arr[i].extra)
				extra.putString("itemExtra"+i, arr[i].extra.getAllCustomData());
		}
		return extra;
	},
  addSpellSet(arr, name){
    name = name || "";
    let srolls = [];
    for(let i in arr){
    	srolls.push({id: arr[i], data: 0, extra: new ItemExtraData()});
    }
    let extra = this.getExtraByArr(srolls);
    extra.putString("name", name);
    Item.addToCreative(ItemID.SpellSet31, 1, 0, extra);
    return extra;
  },
  addWandCreative(id, event,arr){
  	let extra = Wands.getExtraByArr(arr);
		extra.putInt("event", event);
		Item.addToCreative(id, 1, 0, extra);
  }
};
Network.addClientPacket("aw.w", function(packetData) {
    Wcode = packetData;
});

Network.addClientPacket("aw.ws", function(packetData) {
    Wands.data = packetData;
});
Network.addClientPacket("aw.text", function(packetData) {
    Game.message(packetData);
});
Network.addClientPacket("aw.setFly", function(packetData) {
    Player.setFlying(packetData.bool);
    Player.setFlyingEnabled(packetData.bool);
});
var PlayerAC = {
    message: function (player, text){
        var client = Network.getClientForPlayer(player);
        if(client != null){
            client.send("aw.text", text);
        }
    },
    setFly: function(player, bool){
        if(Player.isPlayer(player)){
            let client = Network.getClientForPlayer(player);
            if(client != null){
                client.send("aw.setFly", {
                    bool: bool
                });
            }
        }
    }
};
Callback.addCallback("ItemUse", function(coords, item, block, isExternal, player){
	if(block.id!=BlockID.MagicConnector){
		if(EffectAPI.getLevel(player, "noy_magic") <= 0)
			Wands.addEvent(item, player, "itemUse", {coordsOriginal: coords, block: block, player: player, entity: player});
	}
});
Callback.addCallback("ItemUsingComplete", function(item, player){
	if(EffectAPI.getLevel(player, "noy_magic") <= 0)
		Wands.addEvent(item, player, "usingReleased", {coordsOriginal: Entity.getPosition(player), block: {id:0,data:0}, player: player, entity: player});
});
Callback.addCallback("EntityInteract", function(entity, player){
	let item = Entity.getCarriedItem(player);
	if(EffectAPI.getLevel(player, "noy_magic") <= 0)
		Wands.addEvent(item, player, "EntityInteract", {coordsOriginal: Entity.getPosition(entity), block: {id:0,data:0}, player: player, entity: entity});
});