IMPORT("ToolLib");
IMPORT("SoundLib");
IMPORT("StorageInterface");
IMPORT("ItemAnimHelper");
IMPORT("RenderUtil");
IMPORT("ParticlesCore");
IMPORT("BookHelper");

const Random = java.util.Random;
const RADIUS_VISIBILITY = 35;

//Данный метод в хорике всегда возвращает false, на сервере true
/*
Вырезанный контент на сервере

команды
мобы, боссы
не сгораемый и не взрываемая коса
*/
Game.isDedicatedServer = Game.isDedicatedServer || function(){
	return false;
};

//надо переписаить, но не хочу(
function getProtPedestal(size){
	return {
		defaultValues: {
        item: null
    }, 
    init: function(){
        this.isItem();
        this.animation(this.data.item);
    },
    client: {
        updateModel: function() {
            var id = Network.serverToLocalId(this.networkData.getInt("itemId"));
            var data = this.networkData.getInt("itemData");
            let extra = this.networkData.getString("itemExtra");
            if(extra == "null") 
            	extra = undefined;
            else{
            	let result = new ItemExtraData();
            	result.setAllCustomData(extra);
            	extra = result;
            }
            this.model.describeItem({
                id: id,
                count: 1,
                data: data, 
                size: size || 1,
                extra: extra
            });
        },
        load: function() {
            this.model = new Animation.Item(this.x + .5, this.y + 1.55, this.z + .5);
            this.updateModel();
            this.model.loadCustom(AnimationType.VANILLA());
            var that = this;
            this.networkData.addOnDataChangedListener(function(data, isExternal) {
                that.updateModel();
            });
        },
        unload: function() {
            this.model.destroy();
        }
    },
    animation: function(item){
    	if(item.count < 1){
    		item.id = 0;
    		item.data = 0;
    	}
        this.networkData.putInt("itemId", item.id);
        this.networkData.putInt("itemData", item.data);
        this.networkData.putString("itemExtra", item.extra ?item.extra.getAllCustomData() : "null");
        this.networkData.sendChanges();
        let _item = this.data.item;
        this.data.item = {
            id: item.id,
            data: item.data,
            count: item.count,
            extra: item.extra || null
        };
        return _item;
    }, 
    setItem(item){
    	return this.animation(item);
    },
    getItem(){
    	return this.data.item;
    },
    drop: function(player){
        this.networkData.putInt("itemId", 0);
        this.networkData.putInt("itemData", 0);
        this.networkData.sendChanges();
        this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, this.data.item.id, 1, this.data.item.data, this.data.item.extra || null);
        this.data.item = {
            id: 0,
            data: 0,
            extra: null
        };
    }, 
    destroyAnimation: function(){
        this.networkData.putInt("itemId", 0);
        this.networkData.putInt("itemData", 0);
        this.networkData.sendChanges();
        this.data.item = {
            id: 0,
            data: 0,
            count: 0,
            extra: null
        };
    }, 
    isItem: function(){
        if(!this.data.item) this.data.item = {id: 0, data: 0, extra: null, count: 0};
        if(!this.data.item.id) this.data.item.id = 0;
        if(!this.data.item.data) this.data.item.data = 0;
        if(!this.data.item.count) this.data.item.count = 0;
        if(!this.data.item.extra) this.data.item.extra = null;
    },
    destroyBlock: function(coords, player){
        this.drop();
    }
	};
}

function objectFix(prot1, prot2){
	let result = {};
	for(let key in prot1)
		result[key] = prot1[key];
	for(let key in prot2)
		result[key] = prot2[key];
	return result;
}

let RenderAPI = RenderUtil;

ItemModel.setCurrentCacheGroup("AncientWonders", "release 1.3.2");

let madin_tashu = Particles.registerParticleType({
		texture: "madin_tashu",
		render: 2,
		size: [2, 2],
		lifetime: [100, 100],
		animators: {
			size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
		}
	})

function createUI(obj){
	let title = obj.drawing.shift();
	for(let i in obj.drawing)
		obj.drawing[i].x += 200;
	for(let i in obj.elements)
		obj.elements[i].x += 200;
	return new UI.StandartWindow({
		standart: {
			header: {
				text: {
					text: title.text
				},
			},
			inventory: {
				standart: true
			},
			background: {
				standart: true
			}
		},
		drawing: obj.drawing,
		elements: obj.elements
	});
}

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



function playAnimation(player, anim, time){
	Commands.exec('/playanimation "'+Entity.getNameTag(player)+'" '+anim+' null '+time)
}

var PlayerModule = WRAP_NATIVE("PlayerModule");
if(!Game.isDedicatedServer())
	var ItemModule = WRAP_NATIVE("ItemModule");
else
	var ItemModule = {
		setFireResistant(id, value){},
		setExplodable(id, value){},
		getArmorValue(id){
			return 0;
		}
	};

Network.addClientPacket("Player.animation.aw", function(name){
    PlayerModule.startSpinAttack();
});

function startSpinAttack(player){
    let client = Network.getClientForPlayer(player);
    if(client != null){
        client.send("Player.animation.aw", {});
    }
}

ScrutinyAPI.save = __config__.getBool("debug.saveScrutiny");

SoundManager.init(16);
SoundManager.setResourcePath(__dir__ + "/assets/sounds/");
if(__config__.get("sound.enabled")){
SoundManager.registerSound("magic_0", "wand/magic_0.ogg", false);
SoundManager.registerSound("magic_1", "wand/magic_1.ogg", false);
SoundManager.registerSound("magic_2", "wand/magic_2.ogg", false);
SoundManager.registerSound("magic_3", "wand/magic_3.ogg", false);
SoundManager.registerSound("magic_4", "wand/magic_4.ogg", false);
}

Network.addClientPacket("aw.entityPlay", function(name){
    SoundManager.playSound(name.name, __config__.get("sound.volume"));
});

Network.addServerPacket("aw.serverSendPlay", function(client, data){
    if(client != null){
        client.send("aw.entityPlay", {name:data.name});
    }
})

Network.addClientPacket("aw.soundPlay", function(packet) {
    let ents = Entity.getAllInRange(packet.coords, packet.radius);
    for(let i in ents){
        if(Network.getConnectedPlayers().indexOf(ents[i])){
            let client = Network.getClientForPlayer(ents[i]);
            Network.sendToServer("aw.serverSendPlay", {
                name: packet.name
            });
        }
    }
});

function playSound(name, player, radius){
    let client = Network.getClientForPlayer(player);
    if(client != null){
        client.send("aw.soundPlay", {
            coords: Entity.getPosition(player),
            name: name,
            radius: radius
        });
    }
}



Callback.addCallback("LevelDisplayed", function(){
   setTimeoutLocal(function(){
   	Game.message(Translation.translate("aw.message.entrance"));
	}, 40);
});
