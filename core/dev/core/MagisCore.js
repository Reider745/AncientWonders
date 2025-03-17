Network.addClientPacket("aw.classPlayer", function(packetData) {
   if(packetData.message)
   	 Game.message(TranslationLoad.get("aw.message.selected_class", [["name", packetData.Class]]));
    classPlayer[packetData.player] = Class[packetData.Class];
});
var classPlayer = {};
Saver.addSavesScope("class",
	function read(scope) {
  	classPlayer = scope.classPlayer || {};
    let players = Object.keys(classPlayer);
    for(let p in players){
    	let kc = Object.keys(classPlayer[players[p]]);
    	let kp = Object.keys(Class[classPlayer[players[p]].name]);
    	for(let i in kp){
    		if(!classPlayer[players[p]][kp[i]])
    			classPlayer[players[p]][kp[i]] = Class[classPlayer[players[p]].name][kp[i]];
    		if(classPlayer[players[p]][kp[i]+"Max"])
    			if(classPlayer[players[p]][kp[i]+"Max"] != Class[classPlayer[players[p]].name][kp[i]+ "Max"]){
    				classPlayer[players[p]][kp[i]+"Max"] = Class[classPlayer[players[p]].name][kp[i]+ "Max"];
    				if(classPlayer[players[p]][kp[i]] >= classPlayer[players[p]][kp[i]+"Max"])
    					classPlayer[players[p]][kp[i]] = classPlayer[players[p]][kp[i]+"Max"];
    			}
    	}
    }
    Wands.data = scope.wandData || {};
    Illusion.load(scope.illusion);
  },
  function save() {
let obj = {
    	classPlayer: classPlayer,
      wandData: Wands.data,
      spellSet: Wands.spellSet
      //potion: Potion.potions
    };
   Illusion.save(obj);
  	return obj;
  }
);
Callback.addCallback("LevelLeft", function () {
	classPlayer = {};
});
var Class = {
    
};
function delItem(player, item){
    Entity.setCarriedItem(player, item.id, item.count-1, item.data);
}
function delItem2(player, item){
    let pa = new PlayerActor(player);
    if(pa.getGameMode() == 0){
        Entity.setCarriedItem(player, item.id, item.count-1, item.data);
    }
}
var MagicCore = {
	useCallback: {},
	setNoyUseCallback(item, obj, name){
		item=item||{};
		item.id=item.id||0;
		item.data=item.data||0;
		item.count=item.count||1;
		obj=obj||{};
		this.useCallback[item.id]=[obj,name];
	},
	isUseCallback(player, item, name){
		let prot = this.useCallback[item.id]||[]
		return (!!AncientWonders.isParameters(player, prot[0]||{}, true)) && prot[1] != name;
	},
	armors: {},
    setArmor(id, parameter, value, scrutiny){
    	this.armors[id] = {
    		parameter: parameter,
    		value: value
    	}
    	addInformation(id, "aw.message.required_level", [["name", parameter],["level", value]]);
    	Armor.registerOnTakeOnListener(id, function(item, slot, player){
    		let actor = new PlayerActor(player);
    		let coords = Entity.getPosition(player);
    		let region = BlockSource.getDefaultForActor(player);
    		let data = MagicCore.getValue(player);
    		if(scrutiny){
    			if(ScrutinyAPI.isScrutiny(player, scrutiny.win||"aw", scrutiny.tab||"basics", scrutiny.scrutiny||"book") && data[parameter] >= value && MagicCore.isClass(player))
    				return
    		}else if(data[parameter] >= value && MagicCore.isClass(player)){
    			return;
    		}
    		if(scrutiny)
    			translateMessage(player, "aw.message.give_study", [["scrutiny", scrutiny.scrutiny||"book"]]);
    		actor.setArmor(slot, 0, 0, 0, null);
    		actor.addItemToInventory(id, 1, item.data, item.extra, true);
    		translateMessage(player, "aw.message.required_level", [["name", parameter],["level", value]]);
    	});
    }, 
    usings: {},
    setUsingItem: function (item, parameter, value){
        this.usings[item.id+":"+item.data] = [parameter, value];
    },
    getAllClass(){
    	return Class;
    },
    getAllPlayersClass(){
    	return classPlayer;
    },
    isClass(player){
    	return !!classPlayer[player];
    }, 
    isExistsClass: function(){
        return !(classPlayer == {});
    }, 
    getValue(player){
    	if(this.isClass(player))
    		return classPlayer[player];
    	else
    		return AncientWonders.getDefaultClass();
    }, 
    piece: function(player, parameter, value){
        value = value || 1;
        if(this.isClass(player)){
            let cv = MagicCore.getValue(player);
            if(cv[parameter] + value <= cv[parameter+"Max"]){
            	let item = Entity.getCarriedItem(player);
                delItem2(player, {id:item.id,data:item.data,count:item.count});
                cv[parameter] += value;
                translateMessage(player, "aw.message.parameter_update", [["name", parameter],["value", value],["new", cv[parameter]]]);
                MagicCore.setParameters(player, cv);
            }else{
                translateMessage(player, "aw.message.parameter_noy_update", [["name", parameter]]);
            }
        }else{
            translateMessage(player, "aw.message.have_class");
        }
    }, 
    setParameters: function (player, obj, value){
    	value = value || 0;
        if(this.isClass(player)){
            let r = Math.floor(Math.random()*value);
            if(obj.aspectsNow + r <= obj.aspectsMax && value)
            	obj.aspectsNow += r;
            classPlayer[player] = obj;
            Network.sendToAllClients("aw.sp", classPlayer);
        }
    },
    armorMagic: {},
    armorType: {},
    registerArmorMagicType(type, obj){
    	obj = obj || {};
    	this.armorType[type] = {
    		isDamage: obj.isDamage || function(){return true},
    		enchant: obj.enchant,
    		damage: obj.damage || function(ent, type, orgDmg, dmg, arm, attacker){
    			Entity.damageEntity(ent, dmg, obj.cause||0,{
    				attacker: attacker
    			});
    		},
    		cause: obj.cause||0
    	};
    },
    setArmorMagic(id, type, value){
        this.armorMagic[id] = {
            type: type,
            value: value
        };
    },
    getArmorMagic(ent){
        let arm = {};
        let keys = Object.keys(Native.ArmorType);
        for(let i in keys){
        	let slot = Entity.getArmorSlot(ent, parseInt(i));
        	if(this.armorMagic[slot.id]){
        		let obj = this.armorMagic[slot.id]
        		if(!arm[obj.type])
        			arm[obj.type] = obj.value;
        		else
        			arm[obj.type] += obj.value;
        		if(slot.extra && obj.enchant)
        			arm[obj.type] += slot.extra.getEnchantLevel(obj.enchant);
        	}
        }
        keys = Object.keys(EffectAPI.entity[ent]||{});
        for(let i in keys){
        	if(this.armorType[keys[i]])
        		arm[keys[i]] = (arm[keys[i]]||0) + EffectAPI.getLevel(ent, keys[i]);
        }
        return arm;
    },
    damage(ent, type, damage, packet, attacker){
    	packet = packet || {};
if(Entity.getTypeName(ent) == "minecraft:item<>") return;
    	attacker = attacker || ent;
        let arm = this.getArmorMagic(ent);
        let keys = Object.keys(arm);
        for(let i in keys){
        	if(this.armorType[keys[i]]){
        		let prot = this.armorType[keys[i]];
        		if(keys[i] == type){
        			if(damage - arm[keys[i]] <= 0)
        				return;
        			if(prot.isDamage(ent, type, damage, damage - arm[keys[i]], arm, attacker, packet))
        				prot.damage(ent, type, damage, damage - arm[keys[i]], arm, attacker, packet);
        			return;
        		}
        	}
        }
        let prot = this.armorType[type];
        if(prot.isDamage(ent, type, damage, damage, {}, attacker,packet))
        	prot.damage(ent, type, damage, damage, {}, attacker, packet);
    },
    setPlaceBlockFunc(id, obj, func, scrutiny){
    	obj = obj || {};
    	scrutiny = scrutiny || {};
    	scrutiny.win = scrutiny.win || "aw";
    	scrutiny.tab = scrutiny.tab || "basics";
    	scrutiny.name = scrutiny.name || "singularity";
    	func = func || function(){}
    	Block.registerPlaceFunction(id, function(coords, item, block, player, region){
    		if(Game.isActionPrevented())
    			return;
      let replace = region.getBlock(coords.x, coords.y, coords.z);
      if(World.canTileBeReplaced(replace.id, replace.data))
        coords.relative = coords;
    		Game.prevent();
    		if(!AncientWonders.isParameters(player, obj) || !ScrutinyAPI.isScrutiny(player, scrutiny.win, scrutiny.tab, scrutiny.name)){
    			AncientWonders.message(player, obj);
    			let pos = Entity.getPosition(player);
    			region.spawnDroppedItem(pos.x, pos.y, pos.z, item.id, 1, item.data, item.extra)
    		}else if(region.getBlockId(coords.x, coords.y, coords.z) != BlockID.rityalPedestal){
    			region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, id);
    			func(coords, item, block, player, region)
    		}
    	});
    }
};
Callback.addCallback("ServerPlayerTick", function(player, isPlayerDead){
    let item = Entity.getCarriedItem(player);
    let pos = Entity.getPosition(player);
    if(MagicCore.usings[item.id+":"+item.data]){
        let arr = MagicCore.usings[item.id+":"+item.data];
        if(MagicCore.getValue(player)[arr[0]] < arr[1]){
        	Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
            new PlayerActor(player).setSelectedSlot(Math.floor(Math.random()*9))
            translateMessage(player, "aw.message.required_level", [["name", arr[0]],["level", arr[1]]]);
        } 
    }
});
Network.addServerPacket("aw.sp", function(client, data){
    classPlayer = data;
});
MagicCore.registerArmorMagicType("magic", {
	enchant: magic_protection.id,
	cause: 111
});
MagicCore.registerArmorMagicType("dead", {
	enchant: dead_protection.id,
	isDamage(ent, type, orgDmg, dmg, arm){
		if(arm[type])
			return true;
  if(Entity.getHealth(ent) > 0)
		Entity.setHealth(ent, 0);
		return false;
	},
	cause: 112
});

ModAPI.addAPICallback("CoreUtility", function(api){
	new api.ActorDamageCause(111)
		.setDeadMessage(function(type, name, actor){
			return TranslationLoad.get("aw.message.player_dead_1", [["name", name]]);
		});
	new api.ActorDamageCause(112)
		.setDeadMessage(function(type, name, actor){
			return TranslationLoad.get("aw.message.player_dead_2", [["name", name]]);
		});
});

MagicCore.setArmorMagic(306, "magic", 1);
MagicCore.setArmorMagic(307, "magic", 1);
MagicCore.setArmorMagic(308, "magic", 1);
MagicCore.setArmorMagic(309, "magic", 1);

MagicCore.setArmorMagic(314, "magic", 2);
MagicCore.setArmorMagic(315, "magic", 2);
MagicCore.setArmorMagic(316, "magic", 2);
MagicCore.setArmorMagic(317, "magic", 2);

MagicCore.setArmorMagic(310, "magic", 1);
MagicCore.setArmorMagic(311, "magic", 2);
MagicCore.setArmorMagic(312, "magic", 2);
MagicCore.setArmorMagic(313, "magic", 1);

MagicCore.setArmor(310, "protection", 50);
MagicCore.setArmor(311, "protection", 50);
MagicCore.setArmor(312, "protection", 50);
MagicCore.setArmor(313, "protection", 50);

MagicCore.setArmor(314, "protection", 40);
MagicCore.setArmor(315, "protection", 40);
MagicCore.setArmor(316, "protection", 40);
MagicCore.setArmor(317, "protection", 40);

MagicCore.setArmor(306, "protection", 30);
MagicCore.setArmor(307, "protection", 30);
MagicCore.setArmor(308, "protection", 30);
MagicCore.setArmor(309, "protection", 30);

MagicCore.setArmor(302, "protection", 20);
MagicCore.setArmor(303, "protection", 20);
MagicCore.setArmor(304, "protection", 20);
MagicCore.setArmor(305, "protection", 20);

MagicCore.setArmor(298, "protection", 10);
MagicCore.setArmor(299, "protection", 10);
MagicCore.setArmor(300, "protection", 10);
MagicCore.setArmor(301, "protection", 10);

MagicCore.setUsingItem({id: 276, data: 0}, "protection", 45);
MagicCore.setUsingItem({id: 269, data: 0}, "protection", 5);
MagicCore.setUsingItem({id: 272, data: 0}, "protection", 15);
MagicCore.setUsingItem({id: 267, data: 0}, "protection", 25);
MagicCore.setUsingItem({id: 283, data: 0}, "protection", 30);
MagicCore.setUsingItem({id: 368, data: 0}, "magic", 5);
MagicCore.setUsingItem({id: 381, data: 0}, "magic", 10);
MagicCore.setUsingItem({id: 432, data: 0}, "magic", 20);
MagicCore.setUsingItem({id: 322, data: 0}, "necromancer", 10);
MagicCore.setUsingItem({id: 373, data: 0}, "magic", 30);
MagicCore.setUsingItem({id: 438, data: 0}, "magic", 35);
MagicCore.setUsingItem({id: 441, data: 0}, "magic", 40);

MagicCore.setNoyUseCallback({id:271},{
	protection: 5
}, "PlayerAttack")
MagicCore.setNoyUseCallback({id:275},{
	protection: 15
}, "PlayerAttack")
MagicCore.setNoyUseCallback({id:258},{
	protection: 25
}, "PlayerAttack")
MagicCore.setNoyUseCallback({id:286},{
	protection: 30
}, "PlayerAttack")
MagicCore.setNoyUseCallback({id:279},{
	protection: 40
}, "PlayerAttack")
MagicCore.setNoyUseCallback({id:835},{
	protection: 50
}, "PlayerAttack")

Callback.addCallback("PlayerAttack", function(player){
	let item = Entity.getCarriedItem(player);
	if(!MagicCore.isUseCallback(player, item, "PlayerAttack"))
		Game.prevent();
});

if(this["__version__"]){
  MagicCore.setArmor(764, "protection", 55);
  MagicCore.setArmor(834, "protection", 55);
  MagicCore.setArmor(725, "protection", 55);
  MagicCore.setArmor(813, "protection", 55);
  MagicCore.setArmorMagic(764, "dead", 5);
	MagicCore.setArmorMagic(834, "dead", 6);
	MagicCore.setArmorMagic(725, "dead", 6);
	MagicCore.setArmorMagic(813, "dead", 5);
	MagicCore.setUsingItem({id: 727, data: 0}, "protection", 55);
}
