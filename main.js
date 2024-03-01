/*
BUILD INFO:
  dir: core/dev
  target: main.js
  files: 86
*/



// file: TranslationLoad.js

function comment(input){
	let RE_BLOCKS = new RegExp([
		/\/(\*)[^*]*\*+(?:[^*\/][^*]*\*+)*\//.source,
		/\/(\/)[^\n]*$/.source,
		 /"(?:[^"\\]*|\\[\S\s])*"|'(?:[^'\\]*|\\[\S\s])*'|`(?:[^`\\]*|\\[\S\s])*`/.source,
		 /(?:[$\w\)\]]|\+\+|--)\s*\/(?![*\/])/.source,
		 /\/(?=[^*\/])[^[/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[/\\]*)*?\/[gim]*/.source
	].join('|'), 'gm');
	return a = input.replace(RE_BLOCKS, function(match, mlc, slc){
		return mlc ? ' ' : slc ? '' : match;
	});
}

function readJson(path){
	return JSON.parse(comment(FileTools.ReadText(path)));
}

let DefaultHttpClient = org.apache.http.impl.client.DefaultHttpClient;
let HttpGet = 
org.apache.http.client.methods.HttpGet;
let ByteArrayOutputStream = java.io.ByteArrayOutputStream;
let HttpStatus = org.apache.http.HttpStatus;
//let Base64 = java.util.Base64;
let Base64 = android.util.Base64;
let Jstring = java.lang.String;

function isConnection(){
	let cm = UI.getContext().getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
	let netInfo = cm.getActiveNetworkInfo();
	return netInfo != null && netInfo.isConnectedOrConnecting()
}

function sendHttp(http){
	if(!isConnection()) return null;
	try{
		let httpclient = new DefaultHttpClient();
		let response = httpclient.execute(new HttpGet(http));
		let statusLine = response.getStatusLine();
		if(statusLine.getStatusCode() == HttpStatus.SC_OK){
			let out = new ByteArrayOutputStream(); 
			response.getEntity().writeTo(out);
			let result = String(out.toString());
			out.close(); 
			return result
		}
		response.getEntity().getContent().close();
	}catch(e){return null;}
	return null;
}

const TranslationLoad = {
	loadJson(lang, translations, json){
		for(let key in json){
			let translate = json[key];
			let all_translate = translations[key] || {};
			all_translate[lang] = translate;
			translations[key] = all_translate;
		}
	},
	
	auto_translate: true,
	
	yandexTranslate(lang, text){
		return "";
		//return sendHttp("https://translate.yandex.net/api/v1.5/tr.json/translate?key=<API-ключ>&text="+text+"&lang=ru-"+lang+"&options=1").text
	},
	
	load(path, defaultLang, type){
		let translations =  {};
		let files = FileTools.GetListOfFiles(path, "lang");
		switch(type){
			case 0:
				for(let i in files){
					let file = readJson(files[i]);
					TranslationLoad.loadJson(
						file.type, 
						translations, 
						file.translations
					);
				}
			break;
			case 1:
				for(let i in files){
					let path = String(files[i]);
					let file = readJson(path);
					TranslationLoad.loadJson(
						path.split("/").pop().split(".")[0],
						translations,
						file
					);
				}
			break;
		}
		
		
		function reload(){
			let current = Translation.getLanguage();
			for(let key in translations){
				if(TranslationLoad.auto_translate){
					let all_translate = translations[key];
					if(all_translate[current]==undefined)
						all_translate[current] = "";
					Translation.addTranslation(key, all_translate);
				}else{
					let all_translate = translations[key];
					all_translate[current] = all_translate[current] || all_translate[defaultLang];
					Translation.addTranslation(key, all_translate);
				}
			}
		}
		
		Callback.addCallback("LevelPreLoaded", function(){
			reload();
		});
		reload();
	},
	create(key){
		return {
			text: Translation.translate(key),
			set(name, value){
				this.text = this.text.replace("{"+name+"}", value)
			},
			get(){
				return this.text;
			}
		}
	},
	get(key, arr){
		let str = this.create(key);
		for(let i in arr)
			str.set(arr[i][0], arr[i][1]);
		return str.get();
	},
};
function translate(key, arr){
	return TranslationLoad.get(key, arr||[]);
}
TranslationLoad.load(__dir__+"assets/lang", "en", 0);
TranslationLoad.load(__dir__+"assets/lang/potions", "en", 0);
TranslationLoad.load(__dir__+"assets/lang/command", "en", 1);
TranslationLoad.load(__dir__+"assets/lang/chat", "en", 1);




// file: core/ScrutinyAPI_v2.js

/*
Автор: Reider ___
Внимание! Запрещено:
    1.Распространение библиотеки на сторонних источниках без указание ссылки на официальное сообщество
    2.Изменение кода, за исключением имеени библиотеки(которое используется для импорта в мод)
    3.Явное копирование кода

    Используя библиотеку вы автоматически соглашаетесь с этими правилами.
    группа - https://vk.com/club186544580
*/
Saver.addSavesScope("Save.lib.ScrutinyAPI",
    function read(scope) {
        if(ScrutinyAPI.save) ScrutinyAPI_V2.scrutiny = scope.save || {};
    },
    function save() {
        return {
            save: ScrutinyAPI_V2.scrutiny,
        };
    }
);
Callback.addCallback("LevelLeft", function () {
	ScrutinyAPI_V2.scrutiny = {};
});
Network.addClientPacket("SC.API.open", function(packetData) {
	ScrutinyAPI_V2.open(packetData.player, packetData.name, packetData.id)
});
Network.addClientPacket("SC.API.give", function(packetData) {
	if(packetData.server != Player.get())
		ScrutinyAPI_V2.scrutiny = packetData.value;
});
let sh = UI.getScreenHeight();
let ScrutinyWindow = {
	left: sh * 0.3,
	right: sh * 0.3,
	top: sh * 0.05,
	bottom: sh * 0.1,
	size_y: sh - (this.top + this.bottom),
	height: 540
};
let ScrutinyAPI_V2 = {
	windows: {},
	scrutiny: {},
	players: {},
	register(name, obj){
		obj = obj || {};
		this.windows[name] = {
			tabs:{},
			scale: obj.scale||3,
			frame: obj.frame||"default_frame_bg_dark",
			default_tab: obj.default_tab||"",
			default_bitmap: obj.default_bitmap||"classic_frame_bg_light_border",
			default_bitmap_click:obj.default_bitmap_click||"workbench_frame3"
		};
	},
	setTab(window, tab, obj){
		obj.title = obj.title || "",
		obj.id = obj.id || 0;
		obj.icon = obj.icon || 0;
		obj.width = obj.width || 0;
		obj.height = obj.height || 0;
		obj.isVisual = obj.isVisual||function(){return true};
		obj.scrutinys = {};
		obj.name=tab;
		if(!this.windows[window])
			this.register(window)
		this.windows[window].tabs[tab]=obj;
	},
	setScrutiny(window, tab, scrutiny, obj){
		obj=obj||{};
		obj.name=obj.name||scrutiny;
		obj.scrutiny=scrutiny;
		obj.size=obj.size||100;
		obj.cellX=obj.cellX||0;
		obj.cellY=obj.cellY||0;
		obj.x=obj.x||((obj.size+10)*obj.cellX)-obj.size+10;
		obj.y=obj.y||((obj.size+10)*obj.cellY)-obj.size+10;
		obj.icon=obj.icon||{};
		obj.icon.id=obj.icon.id||0;
		obj.icon.data=obj.icon.data||0;
		obj.lines=obj.lines||[];
		obj.isVisual=obj.isVisual||[];
		obj.isDone=obj.isDone||[];
		obj.bitmap=obj.bitmap||this.windows[window].default_bitmap;
		obj.bitmap_click=obj.bitmap_click||this.windows[window].default_bitmap_click;
		if(this.windows[window].tabs[tab].auto_size){
			if(this.windows[window].tabs[tab].height < obj.y / 2 + obj.size + 20)
				this.windows[window].tabs[tab].height = obj.y / 2 + obj.size + 20;
			
			if(this.windows[window].tabs[tab].width < obj.x / 2 + obj.size + 20)
				this.windows[window].tabs[tab].width = obj.x / 2 + obj.size + 20;
		}
		this.windows[window].tabs[tab].scrutinys[scrutiny]=obj;
		Callback.invokeCallback("AddScrutiny", window, tab, scrutiny);
	},
	isScrutiny(player, window, tab, name){
		if(!this.scrutiny[window])
			this.scrutiny[window] = {};
		if(!this.scrutiny[window][tab])
			this.scrutiny[window][tab] = {
				player: {}
			};
		if(!this.scrutiny[window][tab].player[player])
			this.scrutiny[window][tab].player[player] = {};
		return this.scrutiny[window][tab].player[player][name];
	},
	isVisual(window_name, arr, player){
		let tab = this.windows[window_name].tabs;
		for(let i in arr){
			if(!!!tab[arr[i][0]].scrutinys[arr[i][1]].full_check)
				for(let ii in tab[arr[i][0]].scrutinys[arr[i][1]].lines){
					let scrutiny_name = tab[arr[i][0]].scrutinys[arr[i][1]].lines[ii];
					if(!this.isScrutiny(player, window_name, arr[i][0], scrutiny_name) && this.isVisual(window_name, tab[arr[i][0]].scrutinys[scrutiny_name].isVisual, player))
						return false;
				}
			if(!!!tab[arr[i][0]].scrutinys[arr[i][1]].full_check)
				for(let ii in tab[arr[i][0]].scrutinys[arr[i][1]].isVisual){
					let scrutiny_name = tab[arr[i][0]].scrutinys[arr[i][1]].isVisual[ii][1];
					let tab_name = tab[arr[i][0]].scrutinys[arr[i][1]].isVisual[ii][0];
					if(!this.isScrutiny(player, window_name, tab_name, scrutiny_name) && !this.isVisual(window_name, tab[tab_name].scrutinys[scrutiny_name].isVisual, player))
						return false;
				}
			if(!this.isScrutiny(player, window_name, arr[i][0], arr[i][1]) && this.isVisual(window_name, tab[arr[i][0]].scrutinys[arr[i][1]].isVisual, player))
				return false;
		}
		return true;
	},
	give(player, window, tab, name, bool){
		bool = bool || false;
		if(!this.scrutiny[window]){
			this.scrutiny[window] = {};
		}
		if(!this.scrutiny[window][tab]){
			this.scrutiny[window][tab] = {
				player: {}
			};
		}
		if(!this.scrutiny[window][tab].player[player]){
			this.scrutiny[window][tab].player[player] = {};
		}
		let arr = this.windows[window].tabs[tab].scrutinys[name].isDone;
		if(bool){
			if(this.isScrutiny(player, window, tab, name))
				return false;
			for(let i in arr){
				if(!(this.isScrutiny(player, window, arr[i][0], arr[i][1])&&this.isVisual(window, this.windows[window].tabs[arr[i][0]].scrutinys[arr[i][1]].isVisual, player)))
					return false;
			}
		}
		this.scrutiny[window][tab].player[player][name] = true;
		Callback.invokeCallback("Scrutiny_give", window, tab, name, player);
		Network.sendToAllClients("SC.API.give", {
			value: ScrutinyAPI_V2.scrutiny,
			server: parseInt(""+Player.get())
		});
		return true;
	},
	getStr(str, count){
		let chars = str.split("");
		let a = 1;
		for(let i in chars){
			if(i >= count * a){
				a++
				let arr = chars.splice(i, chars.length-1);
				chars.push("\n");
				for(let l in arr)
					chars.push(arr[l]);
			}
		}
		let string = "";
		for(let i in chars)
			string+=chars[i];
		return string;
	},
	elements: {},
	registerDrawingElement(name, func){
		this.elements[name] = func;
	},
	useDrawingElement(name, obj, x, y, container, i, pos){
		return this.elements[name](obj, x, y, container, i, pos);
	},
	getGuiBook(name, player, content, group, container, id, obj){
		let elements = {
			"close": {type: "button", x: 900, y: 0, bitmap: "classic_close_button", scale: 5, clicker: {
				onClick(){
					ScrutinyAPI_V2.open(player, name, id)
				}
			}}
		}
		let books = Object.keys(obj);
		let y_max = 380;
		for(let a in books){
			let start_x = {left: 35, right: 550}[books[a]]
			let elems = obj[books[a]]
			let y = 25;
			for(let i in elems){
				let data = elems[i];
				let obj = ScrutinyAPI_V2.useDrawingElement(data.type||"text", data, start_x, y, container, i, books[a]);
				y+=obj.y;
				for(let ii in obj.elem)
					elements["elem"+i+books[a]+ii] = obj.elem[ii];
			}
			if(y_max < y)
				y_max = y;
		}
		group.addWindowInstance("book", new UI.Window({
			location: {
				padding: {
					bottom: ScrutinyWindow.bottom-10,
					top: ScrutinyWindow.top-10,
					right: ScrutinyWindow.right-10,
					left: ScrutinyWindow.left-10
				},
				//scrollY: y_max,
				scrollX: 100,
				forceScrollY: true,
				forceScrollX: true
			},
			drawing: [
				{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)},
				{type: "bitmap", bitmap: "book_background", within: 1000, height: y_max},
			],
			elements: elements
		}))
	},
	client_open_tab: "",
	updateIcon(obj){
		if(ScrutinyAPI_V2.client_open_tab == obj.tab.name){
			obj.i++;
			if(obj.i >= obj.icon.ids.length)
				obj.i = 0;
			obj.container.setSlot(obj.name_slot, obj.icon.ids[obj.i][0], 1, obj.icon.ids[obj.i][1]);
			setTimeout(ScrutinyAPI_V2.updateIcon, obj.icon.time||10, obj);
		}
	},
	getGuiTab(name, player, content, tab, group, container){
		content.elements = {};
		content.drawing = [
			{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)}
		];
		let scrutinys = Object.keys(tab.scrutinys);
		for(let i in scrutinys){
			let scrutiny = tab.scrutinys[scrutinys[i]];
			if(!this.isVisual(name,scrutiny.isVisual,player))
				continue;
			content.elements["scrutiny_"+scrutiny.scrutiny+tab.name] = {type: "slot", x: scrutiny.x, y: scrutiny.y, visual: true, bitmap: this.isScrutiny(player, name, tab.name, scrutiny.scrutiny) ? scrutiny.bitmap_click : scrutiny.bitmap, size: scrutiny.size, clicker: {
				onClick(){
					if(ScrutinyAPI_V2.isScrutiny(player, name, tab.name, scrutiny.scrutiny) && scrutiny.book_post){
						ScrutinyAPI_V2.getGuiBook(name, player, content, group, container, tab.name, scrutiny.book_post)
					}else if(scrutiny.book_pre){
						ScrutinyAPI_V2.getGuiBook(name, player, content, group, container, tab.name, scrutiny.book_pre)
					}
				},
				onLongClick(){
					alert(Translation.translate(scrutiny.name));
				}
			}}
			let icon = scrutiny.icon;
			let name_slot = "scrutiny_"+scrutiny.scrutiny+tab.name;
			if(icon.ids){
				container.setSlot(name_slot, icon.ids[0][0], 1, icon.ids[0][1]);
				let i = 0;
				setTimeout(ScrutinyAPI_V2.updateIcon, icon.time||10, {
					tab: tab,
					icon: icon,
					name_slot: name_slot,
					i: i,
					container: container
				});
			}else
				container.setSlot(name_slot, icon.id, 1, icon.data);
			for(let i in scrutiny.lines){
				let _scrutiny = this.windows[name].tabs[tab.name].scrutinys[scrutiny.lines[i]]
				if(!this.isVisual(name,_scrutiny.isVisual,player))
					continue;
				content.drawing.push({type: "line", width: 10, x1: _scrutiny.x+(_scrutiny.size/2), y1: _scrutiny.y+(_scrutiny.size/2), x2: scrutiny.x+(scrutiny.size/2), y2: scrutiny.y+(scrutiny.size/2), color: scrutiny.line_color || android.graphics.Color.rgb(0, 0, 0)})
			}
		}
		return content;
	},
	getGuiClient(window_name, player, container, id){
		let group = new UI.WindowGroup();
		let window = new UI.Window({
			location: {
				padding: {
					bottom: ScrutinyWindow.bottom,
					top: ScrutinyWindow.top,
					right: ScrutinyWindow.right,
					left: ScrutinyWindow.left
				}
			},
			drawing: [
				{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)}
			],
			elements: {
				"close": {type: "close_button", x: 850, y: -25, bitmap: ScrutinyAPI_V2.windows[window_name].close_bitmap||"classic_close_button", scale: 5}
			}
		});
		let tabs = Object.keys(this.windows[window_name].tabs);
		let window_tab = new UI.Window({
			location: {
				padding: {
					bottom: ScrutinyWindow.bottom+20,
					top: ScrutinyWindow.top+30,
					right: ScrutinyWindow.right+70,
					left: ScrutinyWindow.left+70
				},
				scrollY: 100,
				scrollX: 100,
				forceScrollY: true,
				forceScrollX: true
			},
			drawing: [
				{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)}
			],
			elements: {
			}
		});
		let content = window.getContent();
		let index = content.drawing.length;
		content.drawing.push({type: "frame", bitmap: this.windows[window_name].frame, x: 75, y: -2, z: -1, scale: this.windows[window_name].scale, width: 0, height: 50});
		//content.drawing.push({type: "frame", bitmap: this.windows[window_name].frame, x: 855, y: -2, z: -1, scale: this.windows[window_name].scale, width: 60, height: 50});
		for(let i in tabs){
			let tab = this.windows[window_name].tabs[tabs[i]];
			if(!tab.isVisual(player, window_name))
				continue;
			let clicker = {
				onClick(){
					let content = window.getContent();
					window_tab.setContent(ScrutinyAPI_V2.getGuiTab(window_name, player, window_tab.getContent(), tab, group, container))
					content.drawing[index].width = (Translation.translate(tab.title).replace(/\s/g, '').length*20)+20;
					content.elements["tab_title"] = {type: "text", x: 90, y: 8, text: Translation.translate(tab.title), font: {color: tab.title_color || android.graphics.Color.rgb(1, 1, 1)}}
					window.setContent(content);
					window_tab.getLocation().setScroll(tab.width, tab.height);
					window_tab.updateScrollDimensions();
					ScrutinyAPI_V2.client_open_tab = tab.name;
				}
			}
			if(this.windows[window_name].default_tab == tabs[i] || id == tabs[i])
				clicker.onClick();
			if(tab.id < 6){
				content.drawing.push({type: "frame", bitmap: this.windows[window_name].frame, x: 0, y: 30+(tab.id*(ScrutinyWindow.height/6)), scale: this.windows[window_name].scale, width: Math.floor(ScrutinyWindow.height/6), height: Math.floor(ScrutinyWindow.height/6)})
				content.elements["tab_"+tabs[i]]={type: "slot", x: 0, y: 30+(tab.id*(ScrutinyWindow.height/6)), bitmap:"_default_slot_empty",size:90,visual: true, clicker: clicker};
			}else{
				content.drawing.push({type: "frame", bitmap: this.windows[window_name].frame, x: 910, y: 30+(tab.id*(ScrutinyWindow.height/6))-ScrutinyWindow.height, scale: this.windows[window_name].scale, width: Math.floor(ScrutinyWindow.height/6), height: Math.floor(ScrutinyWindow.height/6)})
				content.elements["tab_"+tabs[i]]={type: "slot", x: 910, y: 30+(tab.id*(ScrutinyWindow.height/6))-ScrutinyWindow.height, bitmap:"_default_slot_empty",size:90,visual: true, clicker: clicker};
			}
			container.setSlot("tab_"+tabs[i], tab.icon, 1, 0)
		}
		content.drawing.push({type: "frame", x: 80, y: 30, width: 840, height: ScrutinyWindow.height, bitmap: this.windows[window_name].frame, scale: this.windows[window_name].scale})
		window.setContent(content);
		group.addWindowInstance("bitmap", window);
		group.addWindowInstance("tab", window_tab);
		group.addWindowInstance("book", new UI.Window({
			location: {
				padding: {
					bottom:10000,
					top:1000,
					right:1000,
					left:1000
				},
				scrollY: 100,
				scrollX: 100,
				forceScrollY: true,
				forceScrollX: true
			},
			drawing: [
				{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)},
				{type: "bitmap", bitmap: "book_background", within: 1000, height: 500},
			],
			elements: {
				"close": {type: "button", x: 900, y: 0, bitmap: "classic_close_button", scale: 5, clicker: {
					onClick(position, container, tileEntity, window){
						window.getLocation().setPadding(10000, 10000, 10000, 10000)
						group.getWindow("book").updateWindowPositionAndSize();
					}
				}},
			}
		}))
		return group;
	},
	getContainer(player){
		if(!this.players[player])
			this.players[player] = new UI.Container();
		return this.players[player];
	},
	open(player, name, id){
		let container = this.getContainer(player);
		container.openAs(this.getGuiClient(name, player, container, id))
	},
	openServer(player, name, id){
		let client = Network.getClientForPlayer(player)
		if(client)
			client.send("SC.API.open", {name:name,player:player,id:id})
	}
};
ScrutinyAPI_V2.registerDrawingElement("text", function(obj, x, y){
	let text = Translation.translate(obj.text||"");
	return {
		y: 10+((obj.size||25)*Math.ceil(text.split("").length / (obj.chars||Math.floor(310 / (obj.size / 2))))),
		elem: [{type:"text", text: ScrutinyAPI_V2.getStr(text, obj.chars || Math.floor(310 / (obj.size / 2)))||"", size: obj.size||25, x: x, y: y, multiline: true}]
	};
});
ScrutinyAPI_V2.registerDrawingElement("slots", function(obj, x, y, container, i, pos){
	let slots = []
	if(obj.slots)
		obj.items = [];
	for(let ii in obj.slots){
		obj.size = obj.slots[ii].size;
		obj.items.push(obj.slots[ii].item)
	}
	for(let ii in obj.items){
		slots.push({type: "slot", bitmap: obj.bitmap||"_default_slot_empty", x: x+((obj.size||30)*ii), y: y, size: obj.size||30, visual: true});
		container.setSlot("elem"+i+pos+((parseInt(ii)||0)+(obj.i||0)), obj.items[ii].id || 0, 1, obj.items[ii].data || 0);
	}
	return {
		y: obj.size||30,
		elem: slots
	};
});
ScrutinyAPI_V2.registerDrawingElement("slot", function(obj, x, y, container, i, pos){
	return ScrutinyAPI_V2.useDrawingElement("slots", obj, x, y, container, i, pos);
});
ScrutinyAPI_V2.registerDrawingElement("custom", function(obj, x, y, container, i, pos){
	return obj.getElemet(x, y, container, i, pos);
});
ScrutinyAPI_V2.registerDrawingElement("dynamic", function(obj, x, y, container, i, pos){
	let elems = [];
	let max = 0;
	let arr = obj.getElemet(x, y, container, i, pos);
	for(let ii in arr){
		obj.i = elems.length;
		let data = ScrutinyAPI_V2.useDrawingElement(arr[ii].type||"text", arr[ii], x, y+max, container, i, pos);
		max += data.y;
		for(let a in data.elem)
			elems.push(data.elem[a]);
	}
	return {
		y: max,
		elem: elems
	};
});

var JAVA_ANIMATOR = android.animation.ValueAnimator;
var JAVA_HANDLER = android.os.Handler;
var LOOPER_THREAD = android.os.Looper;
var JAVA_HANDLER_THREAD = new JAVA_HANDLER(LOOPER_THREAD.getMainLooper());

function createAnimation(_duration, _updateFunc){
	let animation = JAVA_ANIMATOR.ofFloat([0,1]);
	animation.setDuration(_duration);
	if(_updateFunc)
		animation.addUpdateListener({
			onAnimationUpdate(updatedAnim){
				_updateFunc(updatedAnim.getAnimatedValue(), updatedAnim);
			}
		});
	JAVA_HANDLER_THREAD.post({
		run(){
			animation.start();
		}
	})
	return animation;
}
function AchievementAPI(){
	let container = new UI.Container();
	let window = new UI.Window({
		location: {
			x: 650,
			width: 350,
			y: 0,
			height: 150
		},
		drawing: [{type: "color", color: android.graphics.Color.argb(0, 0, 0, 0)}],
		elements: {}
	});
	window.setDynamic(true);
	window.setAsGameOverlay(true);
	window.setTouchable(false);
	
	
	let time = 1000;
	let y_max = 15;
	let y_default = 0;
	let expectation = 60;
	
	this.setTime = function(time, expectation){
		this.time = time;
		this.expectation = expectation;
	}
	this.getGui = function(title, description, item){
		item = item || {};
		y_default = -600;
		let content = window.getContent();
		content.elements.background = {type: "image", bitmap: "achievement_background", x: 0, y:y_default, scale: 1.5}
		content.elements.slot = {type: "slot", bitmap: "_default_slot_empty", x: 13, y: y_default-5, size: 160};
		content.elements.title = {type: "text", text: title, x: 170, y: y_default+45, font: {color: android.graphics.Color.argb(1, 1, 1, 1), size: 55}}
		content.elements.description = {type: "text", text: description, x: 20, y: y_default+250, font: {color: android.graphics.Color.argb(1, 0, 1, 0), size: 50}}
		container.setSlot("slot", item.id||0, 1, item.data||0)
	}
	this.give = function(title, description, item){
		try{
		let content = window.getContent();
		this.getGui(title, description, item);
		container.openAs(window);
		let animation = createAnimation(time, function(value){
			content.elements.background.y = y_default+((y_max-y_default) * value);
			content.elements.title.y = (y_default+((y_max-y_default) * value))+20;
			content.elements.slot.y = (y_default+((y_max-y_default) * value));
			content.elements.description.y = (y_default+((y_max-y_default) * value))+170;
			window.forceRefresh();
		});
		animation.addListener({
			onAnimationEnd(){
				setTimeoutLocal(function(){
					let anim = createAnimation(time, function(value){
						let keys = Object.keys(content.elements);
						for(let i in keys)
							content.elements.background.y = y_default+((y_max-y_default) * (1-value));
							content.elements.title.y = (y_default+((y_max-y_default) * (1-value)))+20;
							content.elements.slot.y = (y_default+((y_max-y_default) * (1-value)));
							content.elements.description.y = (y_default+((y_max-y_default) * (1-value)))+170;
						window.forceRefresh();
					});
					animation.addListener({
						onAnimationEnd(){
							container.close();
						}
					});
				}, expectation);
			}
		});
		}catch(e){
			
		}
	}
}
let Achievement = new AchievementAPI();
Network.addClientPacket("aw.achievement.give", function(data){
	let scrutiny = ScrutinyAPI_V2.windows[data.window].tabs[data.tab].scrutinys[data.name]
	Achievement.give(scrutiny.name, TranslationLoad.get("aw.message.scrutiny", [["name", scrutiny.name]]), scrutiny.icon)
});
let AchievementAPI_;
ModAPI.addAPICallback("FTBQuests", function(api){
	AchievementAPI_ = api.AchievementAPI;
});
let ScrutinyAPI = {
	save: true,
	register(name, obj){
		ScrutinyAPI_V2.register(name, obj);
	},
	addTab(window, name, obj){
		ScrutinyAPI_V2.setTab(window, name, obj);
	},
	isScrutiny(player, window, tab, name){
		return ScrutinyAPI_V2.isScrutiny(player, window, tab, name)
	},
	giveScrutiny(player, window, tab, name, bool){
		let value = ScrutinyAPI_V2.give(player, window, tab, name, bool);
		if(value){
			if(AchievementAPI_){
				let scrutiny = ScrutinyAPI_V2.windows[window].tabs[tab].scrutinys[name];
				scrutiny.icon.count = 1;
				AchievementAPI_.give(player, scrutiny.name, TranslationLoad.get("aw.message.scrutiny", [["name", scrutiny.name]]), scrutiny.icon)
				return value;
			}
			let client = Network.getClientForPlayer(player);
			if(client)
				client.send("aw.achievement.give", {
					window: window,
					tab: tab,
					name: name
				})
		}
		return value;
	},
	addScrutiny(window, tab, name, obj){
		ScrutinyAPI_V2.setScrutiny(window, tab, name, {
			name: obj.name,
			x: obj.x,
			y: obj.y,
			cellX: obj.cellX,
			cellY: obj.cellY,
			size: obj.size,
			icon: obj.item,
			lines: obj.line,
			line_color: obj.line_color,
			isDone: (function(arr2){
				let arr = [];
				for(let i in arr2){
					if(typeof(arr2[i])=="string")
						arr.push([tab, arr2[i]]);
					else
						arr.push([arr2[i].tab, arr2[i].name]);
				}
				return arr;
			})(obj.isDone || obj.isVisual),
			isVisual: (function(arr2){
				let arr = [];
				for(let i in arr2){
					if(typeof(arr2[i])=="string")
						arr.push([tab, arr2[i]]);
					else
						arr.push([arr2[i].tab, arr2[i].name]);
				}
				return arr;
			})(obj.isVisual),
			book_post: obj.bookPost,
			book_pre: obj.bookPre
		})
	},
	open(player, name){
		ScrutinyAPI_V2.openServer(player, name)
	}
};

/*ScrutinyAPI_V2.register("test", {
	scale: 2.5,
	default_tab: "test0",
	frame: "frame"
});
ScrutinyAPI_V2.setTab("test", "test0", {
	id: 0,
	width: 700,
	title: "test 0",
	icon: 1
})
ScrutinyAPI_V2.setTab("test", "test2", {
	id: 2,
	width: 700,
	title: "test 2",
	icon: 5,
	isVisual(player, window_name){
		return ScrutinyAPI_V2.isScrutiny(player, window_name, "test0", "test");
	}
})
ScrutinyAPI_V2.setScrutiny("test", "test2", "test", {
	name: "test scrutiny",
	size: 100,
	x: 100,
	y: 100,
	icon: {
		id: 5,
		data: 1
	}
})
ScrutinyAPI_V2.setScrutiny("test", "test0", "test", {
	name: "test scrutiny",
	size: 100,
	x: 100,
	y: 100,
	icon: {
		id: 265
	}
})
ScrutinyAPI_V2.setScrutiny("test", "test0", "test2", {
	name: "test scrutiny",
	size: 100,
	x: 300,
	y: 100,
	icon: {
		id: 263
	}
})
ScrutinyAPI_V2.setScrutiny("test", "test0", "test3", {
	name: "test scrutiny",
	size: 100,
	x: 150,
	y: 300,
	lines: ["test", "test2"],
	isDone: [["test0", "test2"], ["test0", "test"]],
	isVisual: [["test0", "test2"]],
	icon: {
		id: 264
	},
	book_pre: {
		left: [
			{type: "text", text: "Жопа", size: 40}
		],
		right: [
			{type: "text", text: "Жопа 2", size: 40},
			{type: "slots", items: [{id:263},{id:264}], size: 40}
		]
	},
	book_post: {
		left: [
			{type: "text", text: "Уже не жопа", size: 30},
			{type: "text", text: "Какой-то длинный текст, Какой-то длинный текст, Какой-то длинный текст, Какой-то длинный текст.", size: 25},
			{type: "text", text: "Какой-то длинный текст, Какой-то длинный текст, Какой-то длинный текст, Какой-то длинный текст.", size: 25},
			{type: "text", text: "тест", size: 30},
			{type: "slots", items: [{id:263},{id:264}]}
		],
		right: [
			{type: "text", text: "уже не жопа 2", size: 30}
		]
	}
})
ScrutinyAPI_V2.setScrutiny("test", "test0", "test4", {
	name: "test scrutiny",
	size: 100,
	x: 350,
	y: 300,
	lines: ["test3"],
	isDone: [["test0", "test3"]],
	icon: {
		id: 264
	}
})
Callback.addCallback("ItemUse", function(coords,item,block,isExter,player){
	if(item.id==264){
		ScrutinyAPI_V2.open(player, "test");
	}else if(item.id == 263){
		ScrutinyAPI_V2.give(player, "test", "test0", "test3")
		ScrutinyAPI_V2.give(player, "test", "test0", "test")
		ScrutinyAPI_V2.give(player, "test", "test0", "test2")
	}
});*/




// file: header.js

IMPORT("ToolLib");
IMPORT("SoundLib");
IMPORT("StorageInterface");
IMPORT("ItemAnimHelper");
IMPORT("RenderUtil");
IMPORT("ParticlesCore");
IMPORT("BookHelper");

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

const Bitmap = android.graphics.Bitmap;
const Color = android.graphics.Color;

function randInt(min, max){
	return Math.floor(Math.random()*(max-min))+min;
}

function argbToHex(alpha, red, green, blue) {
  let alphaHex = alpha.toString(16).toUpperCase();
  let redHex = red.toString(16).toUpperCase();
  let greenHex = green.toString(16).toUpperCase();
  let blueHex = blue.toString(16).toUpperCase();

  alphaHex = alphaHex.length < 2 ? "0" + alphaHex : alphaHex;
  redHex = redHex.length < 2 ? "0" + redHex : redHex;
  greenHex = greenHex.length < 2 ? "0" + greenHex : greenHex;
  blueHex = blueHex.length < 2 ? "0" + blueHex : blueHex;

  return "#" + alphaHex + redHex + greenHex + blueHex;
}

function parseColor(a, r, g, b){
	return Color.parseColor(argbToHex(Math.floor(a*255), Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)))
}

const setTimeout = function(func, ticks, obj){
	obj = obj || {};
	var upd = {
		ticks: 0,
		update(){
			this.ticks++
			if(this.ticks >= ticks){
				 func(obj);
				 this.remove = true
			}
		}
	};
	Updatable.addUpdatable(upd);
}
const setTimeoutLocal = function(func, ticks, obj){
	obj = obj || {};
	var upd = {
		ticks: 0,
		update(){
			this.ticks++
			if(this.ticks >= ticks){
				 func(obj);
				 this.remove = true
			}
		}
	};
	Updatable.addLocalUpdatable(upd);
}

function getProtPedestal(size){
	return {
		defaultValues: {
        item: {
            id: 0,
            data: 0,
            extra: null,
            count: 0
        }
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

function connectBitmap(input, output, size){
	let result = Bitmap.createBitmap(size, size * input.length, Bitmap.Config.ARGB_8888);
	
	for(let i in input){
		let bitmap = FileTools.ReadImage(input[i]);
		for(let x = 0;x < size;x++)
			for(let y = 0;y < size;y++){
				result.setPixel(x, y+i*size, bitmap.getPixel(x, y));
			}
	}
	
	FileTools.WriteImage(output, result);
}
const ATLAS = __dir__+"assets/particle-atlas/";
function _connectBitmapToAssets(input, output, size){
	let _input = [];
	for(let i in input)
		_input.push(ATLAS+input[i]);
	connectBitmap(_input, ATLAS+output, size);
}
function connectBitmapToAssets(name, frames, size){
	let input = [];
	for(let i = 0;i < frames;i++)
		input.push(name+"_"+i+".png");
	_connectBitmapToAssets(input, name+".png", size);
}

/*
connectBitmapToAssets("aw_bottle_potion", 2, 32);
connectBitmapToAssets("singularity_particle", 3, 32);
connectBitmapToAssets("magic_particle", 9, 32);
*/
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



Callback.addCallback("LevelDisplayed", function() {
   setTimeout(function (){
Game.message(Translation.translate("aw.message.entrance"));
}, 40);
});




// file: StructureLoader.js

const path = __dir__+"assets/structure/";
for(let i = 0;i <= 3;i++){
	StructureLoader.load(path+"ritual_"+i+".json", "aw_ritual_"+i, "DungeonAPI_V2");
	StructureLoader.load(path+"fortress/"+i+".json", "aw_fortress_"+i, "DungeonAPI_V2");
	if(i!=3)
		StructureLoader.load(path+"quest/location_"+i+".struct", "aw_location_"+i);
}
for(let i = 0;i <= 8;i++)
	StructureLoader.load(path+"enchanted_forest/wood_"+i+".struct", "enchanted_forest_wood_"+i);
	
for(let i = 0;i < 5;i++)
	StructureLoader.load(path+"village/village_"+i+".struct", "aw_village_"+i);

StructureLoader.load(path+"ritual_enchant_level.struct", "aw_ritual_enchant_level");
	
StructureLoader.load(path+"enchanted_forest/watch_tower.struct", "aw_watch_tower", null, true);
StructureLoader.load(path+"golem.struct", "aw_golem");
StructureLoader.load(path+"Cursed_Tower.dc", "aw_cursed_tower", "DungeonCore");
StructureLoader.load(path+"House_of_magicians.json", "aw_house_of_magicians", "DungeonAPI_V2")
StructureLoader.load(path+"magic_temple.json", "aw_magic_temple", "DungeonAPI_V2")
StructureLoader.load(path+"Ordinary_temple.json", "aw_ordinary_temple", "DungeonAPI_V2");
StructureLoader.load(path+"Temple_of_magicians.json", "aw_house_of_magicians", "DungeonAPI_V2")
StructureLoader.load(path+"Temple.json", "aw_temple", "DungeonAPI_V2");
StructureLoader.load(path+"Tower_of_darkness.json", "aw_tower_of_darkness", "DungeonAPI_V2")
StructureLoader.load(path+"Tower_of_evil.json", "aw_tower_of_evil", "DungeonAPI_V2");




// file: AI.js

/*let prot = {};
let EntityReg = {
    setPrototype: function (type, obj){
        obj.tick = obj.tick || function(ent){};
        obj.damage = obj.damage || function(attacker, victim, damageValue, damageType, someBool1, someBool2){};
        prot[type] = obj;
    },
    getPrototype: function (ent){
      return prot[Entity.getTypeName(ent)];
    },
};
Callback.addCallback("tick", function(){
	if(World.getThreadTime()%__config__.get("tickUpdate")==0){
		try{
   	 let ents = Optimization.getAllWhiteList(Object.keys(prot))
    	for(let i = 0;i < ents.size();i++){
    		EntityReg.getPrototype(ents.get(i)).tick(ents.get(i));
    	}
    }catch(e){
    	alert(e)
    }
	}
});*/

let prot = {};
let EntityReg = {
	setPrototype(type, obj){
		obj.tick = obj.tick || function(ent){};
		obj.damage = obj.damage || function(attacker, victim, damageValue, damageType, someBool1, someBool2){};
		prot[type] = obj;
	},
	getPrototype(ent){
		return prot[Entity.getTypeName(ent)];
	}
};

const tickUpdate = __config__.get("tickUpdate");
let listEntity = {};
Callback.addCallback("EntityAdded", function(entity){
	let prot = EntityReg.getPrototype(entity);
	if(prot){
		if(prot.optimization)
			var upd = {
				update(){
					prot.tick(entity);
				}
			};
		else
			var upd = {
				update(){
					if(World.getThreadTime() % tickUpdate == 0)
						prot.tick(entity);
				}
			};
		listEntity[entity] = upd;
		Updatable.addUpdatable(upd);
	}
});
Callback.addCallback("EntityRemoved", function(entity){
	if(EntityReg.getPrototype(entity))
		listEntity[entity].remove = true;

});
Callback.addCallback("LevelLeft", function(){
	listEntity = {};
});

const upt = Math.floor(20/__config__.get("tickUpdate"))

Callback.addCallback('EntityHurt', function (attacker, victim, damageValue, damageType, someBool1, someBool2) {
 if(prot[Entity.getTypeName(victim)])
   EntityReg.getPrototype(victim).damage(attacker, victim, damageValue, damageType, someBool1, someBool2);
});

EntityReg.setPrototype("aw:stone_golem<>", {
	tick(ent){
		EffectAPI.add(ent,"dead",20, 20)
	},
	damage(attacker, ent, damageValue, damageType){
		
	}
});

EntityReg.setPrototype("aw:tanatos<>", {
	tick(ent){
		EffectAPI.add(ent,"dead",20, 30)
		if(Entity.getTarget(ent) == -1){
			let ents = Entity.getAllInRange(Entity.getPosition(ent), 20);
			let r = Math.floor(Math.random()*(ents.length-1));
			if(Entity.getTypeName(ents[r]) != Entity.getTypeName(ent) && Entity.getTypeName(ents[r]) != "minecraft:item<>")
				Entity.setTarget(ent, ents[r]);
		}else{
			if(Math.random()<=0.005*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll20,data:0},{id:ItemID.sroll23,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.025*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll23,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.1*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll22,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.005*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll26,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.05*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll32,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.025*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll34,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.025*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll22,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
			if(Math.random()<=0.008*upt)
				Wands.emitterEntity(ent, {
					wand: {
						id: ItemID.magis_stick,
						data: 0,
						count: 1,
					},
					event: ItemID.sroll2,
					spells: [{id:ItemID.sroll16,data:0}],
					packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
				});
		}
	},
	damage(attacker, ent, damageValue, damageType){
		Entity.setTarget(ent, attacker);
		if(Entity.getHealth(ent) <= Entity.getMaxHealth(ent)/2&&!(damageType==111||damageType==112))
			Game.prevent();
	}
})
/*if(__config__.get("beta_mode")){
EntityReg.setPrototype("aw:tanatos<>", {
    tick: function(ent){

        if(Entity.getTarget(ent) == -1){

            let ents = Entity.getAllInRange(Entity.getPosition(ent), 20);

            let r = Math.floor(Math.random()*(ents.length-1));

            if(Entity.getTypeName(ents[r]) != Entity.getTypeName(ent) && Entity.getTypeName(ents[r]) != "minecraft:item<>") Entity.setTarget(ent, ents[r]);

        }else{

            if(Math.random()<=0.005){

                Wands.emitterEntity(ent, {

                    srollType: ItemID.sroll2,

                    sroll: [ItemID.sroll20]

                });

                Wands.emitterEntity(ent, {

                    srollType: ItemID.sroll2,

                    sroll: [ItemID.sroll20, ItemID.sroll27, ItemID.sroll23]

                });

            }

            if(Math.random()<=0.2){

                Wands.emitterEntity(ent, {

                    srollType: ItemID.sroll2,

                    sroll: [ItemID.sroll22]

                });

            }

        }

    },

    damage: function(attacker, ent, damageValue, damageType, someBool1, someBool2){

        Entity.setTarget(ent, attacker);

        if(damageType == 5){

            Game.prevent();

        }else if(damageType == 3){

            Game.prevent();

        }

        if(Math.random()<=0.2){

            Wands.emitterEntity(ent, {

                srollType: ItemID.sroll2,

                sroll: [ItemID.sroll21]

            });

        }

    }

});

}*/
function attack(ent){
    let pos = Entity.getPosition(ent);
    pos.y += 5;
    let group = new ParticlesCore.Group();
    let region = BlockSource.getDefaultForActor(ent);
    for(let i = 0;i <= Math.floor(Math.random()*5)+5;i++){
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(ent));
        vel.x += Math.random() - Math.random();
        vel.y += Math.random() - Math.random();
        vel.z += Math.random() - Math.random();
        for(let i = 0;i<50;i++){
            let coord = {
                x: pos.x+(i * vel.x / 2),
                y: pos.y+(i * vel.y / 2),
                z: pos.z+(i * vel.z / 2)

            };
            let ent3 = Entity.getAllInRange(coord, 4);
            for(let i1 in ent3){
                if(ent3[i1] != ent) MagicCore.damage(ent3[i1], "magic", 40);
            }
             if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                break;
            }
            group.add(ParticlesAPI.part3, coord.x, coord.y, coord.z);
        }
    }
    group.send(region);
}

let entId = {};

EntityReg.setPrototype("aw:skeleton<>", {
    tick: function (ent){
        if(Entity.getTarget(ent) == -1){
            let ents = Entity.getAllInRange(Entity.getPosition(ent), 20);
            let r = Math.floor(Math.random()*(ents.length-1));
            if(ents[r] != entId[ent] && Entity.getTypeName(ents[r]) != Entity.getTypeName(ent) && Entity.getTypeName(ents[r]) != "minecraft:item<>") Entity.setTarget(ent, ents[r]);
        }else if(Math.random() <= 0.1){
            let pos = Entity.getPosition(ent);
            let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(ent));
            let group = new ParticlesCore.Group();
            let region = BlockSource.getDefaultForActor(ent);
            for(let i = 0;i<20;i++){
                let coord = {
                    x: pos.x+(i * vel.x / 2),
                    y: pos.y+1.5+(i * vel.y / 2),
                    z: pos.z+(i * vel.z / 2)
                };
                let ent3 = Entity.getAllInRange(coord, 2);
                for(let i1 in ent3){
                    if(ent3[i1] != ent) MagicCore.damage(ent3[i1], "magic", 4);
                }
                 if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                    break;
                }
                group.add(ParticlesAPI.part3, coord.x, coord.y, coord.z);
            }
            group.send(region);
       }
    },
    damage: function (attacker, ent, damageValue, damageType, someBool1, someBool2){
        let ents = Entity.getAllInRange(Entity.getPosition(ent), 30);
        let r = Math.floor(Math.random()*ents.length-1);
        if(ents[r] != entId[ent]) Entity.setTarget(ent, attacker);
    }
});

EntityReg.setPrototype("aw:boss0<>", {
    tick: function (ent){  
  //  if(World.getThreadTime()%20){
        if(Math.random()<=0.01){
            Wands.emitterEntity(ent, {
            	wand: {
            		id: ItemID.magis_stick,
            		data: 0,
            		count: 1,
            	},
              event: ItemID.sroll2,
              spells: [{id:ItemID.sroll19,data:0}],
              packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
            });
        }
        if(Math.random()<=0.01*upt){
            Wands.emitterEntity(ent, {
            	wand: {
            		id: ItemID.magis_stick,
            		data: 0,
            		count: 1,
            	},
              event: ItemID.sroll2,
              spells: [{id:ItemID.sroll5,data:0}],
              packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
            });
        }
        if(Entity.getTarget(ent) != -1){
            if(Math.random()<=0.1*upt){
                Wands.emitterEntity(ent, {
                	wand: {
            				id: ItemID.magis_stick,
            				data: 0,
            				count: 1,
            			},
                  event: ItemID.sroll2,
                  spells: [{id:ItemID.sroll18,data:0}],
             		 packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
                });
            }
            let ents = Entity.findNearest(Entity. getPosition(ent), 1, 4);
            if(ents){
                Entity.setTarget(ent, ents);
                let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(ent));
                Entity.addVelocity(ents, vel.x, vel.y, vel.z);
                Wands.emitterEntity(ent, {
                	wand: {
            				id: ItemID.magis_stick,
            				data: 0,
            				count: 1,
            			},
                  event: ItemID.sroll2,
                  spells: [{id:ItemID.sroll16,data:0}],
              		packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
                });
                attack(ent);
            }
            ents = Entity.getAllInRange(Entity.getPosition(ent), 30, [1]);
            for(let i in ents){
                let range = Entity.getDistanceToEntity(ent, ents[i], [Entity. getType(Entity.getTarget(ent))]);
                if(range >= 20){
                    if(Math.random()<=0.5){
                        Entity.setTarget(ent, ents[i]);
                        Wands.emitterEntity(ent, {
                        	wand: {
            								id: ItemID.magis_stick,
            								data: 0,
            								count: 1,
            							},
                          event: ItemID.sroll2,
                          spells: [{id:ItemID.sroll16,data:0}],
             						 packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
                        });
                        Wands.emitterEntity(ent, {
                        	wand: {
            								id: ItemID.magis_stick,
            								data: 0,
            								count: 1,
            							},
                          event: ItemID.sroll2,
                          spells: [{id:ItemID.sroll15,data:0}],
           						   packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
                        });
                    }else{
                        Wands.emitterEntity(ent, {
                        	wand: {
            								id: ItemID.magis_stick,
            								data: 0,
            								count: 1,
            							},
                          event: ItemID.sroll2,
                          spells: [{id:ItemID.sroll5,data:0}],
             						 packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
                        });
                    }
                }else{
                    Entity.setTarget(ent, ents[i]);
                }
            }
        }else{
            let ents = Entity.getAllInRange(Entity.getPosition(ent), 35);
            Entity.setTarget(ent, ents[Math.floor(Math.random()*(ents.length-1))]);
        }
      //}
    },
    damage: function(attacker, ent, damageValue, damageType, someBool1, someBool2){
        if(attacker) Entity.setTarget(ent, attacker);
        if(damageType == 5){
            Game.prevent();
        }else if(damageType == 3){
            Game.prevent();
        }
        if(Math.random()<=0.2){
            Wands.emitterEntity(ent, {
            	wand: {
            		id: ItemID.magis_stick,
            	  data: 0,
            		count: 1,
            	},
              event: ItemID.sroll2,
              spells: [{id:ItemID.sroll20,data:0}],
              packet: {coordsOriginal: Entity.getPosition(ent), block: {id:0,data:0}, player: ent, entity: ent}
            });
        }
    }
});

Callback.addCallback('EntityDeath', function (entity, attacker, damageType) {
    if(Entity.getTypeName(entity) == "aw:boss0<>"){
        let B = BlockSource.getDefaultForActor(entity);
        let pos = Entity.getPosition(entity);
        if(Math.random()<=0.2){
            B.spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.sroll17, 1, 0, null);
        }
        if(Math.random()<=0.6){
            B.spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.sroll20, 1, 0, null);

        }
        if(Math.random()<=0.5){
            B.spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.sroll15, 1, 0, null);
        }
        B.spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.sroll16, 1, 0, null);
    }else if(Entity.getTypeName(entity) == "minecraft:wither_skeleton<>"){
let B = BlockSource.getDefaultForActor(entity);
let pos = Entity.getPosition(entity);
B.spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.witherbone, 1, 0, null);
}
});
ModAPI.addAPICallback("RecipeViewer", function(api){
	var RVTypeAW = (function(_super){
  	__extends(RVTypeAW, _super);
    function RVTypeAW(name, icon, content){
      let _this = _super.call(this, name, icon, content) || this;
      return _this;
    }
    RVTypeAW.prototype.getAllList = function() {
      return [{
      	input: [],
    		output: [{id:ItemID.sroll17,data:0,count:1}]},{
      	input: [],
    		output: [{id:ItemID.sroll20,data:0,count:1}]},{
      	input: [],
    		output: [{id:ItemID.sroll15,data:0,count:1}]},{
      	input: [],
    		output: [{id:ItemID.sroll16,data:0,count:1}]}
			];
    };
    return RVTypeAW;
  }(api.RecipeType));
	api.RecipeTypeRegistry.register("aw_boss_drop", new RVTypeAW(Translation.translate("aw.gui.rv.aw_boss_drop"), VanillaItemID.rotten_flesh, {
		elements: {
			output0: {x: 440, y: 150, size: 120},
		}
	}));
});




// file: models/yes.js

//create Reider ___ size - 16
let yes = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 1, data = data_default || 0;
	let model = new RenderUtil.Model();
	model.addBoxByBlock("cube", 0.4375, 0, 0.5, 0.5, 0.0625, 0.5625, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0.4375, 0.0625, 0.4375, 0.5, 0.125, 0.5, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0.4375, 0.125, 0.625, 0.5, 0.1875, 0.6875, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0.4375, 0.125, 0.375, 0.5, 0.25, 0.4375, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.4375, 0.0625, 0.5625, 0.5, 0.125, 0.625, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0.4375, 0.25, 0.3125, 0.5, 0.375, 0.375, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	return model;
})();//boxes - 6




// file: models/noy.js

//create Reider ___ size - 16
let noy = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 1, data = data_default || 0;
	let model = new RenderUtil.Model();
	model.addBoxByBlock("cube", 0.5, 0, 0.3125, 0.5625, 0.0625, 0.375, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0.5, 0, 0.6875, 0.5625, 0.0625, 0.75, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0.5, 0.625, 0.3125, 0.5625, 0.6875, 0.375, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0.5, 0.625, 0.6875, 0.5625, 0.6875, 0.75, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.5, 0.0625, 0.375, 0.5625, 0.1875, 0.4375, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0.5, 0.0625, 0.625, 0.5625, 0.1875, 0.6875, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.5, 0.5, 0.375, 0.5625, 0.625, 0.4375, obj["cube_7"] ? obj["cube_7"].texture : texture, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0.5, 0.5, 0.625, 0.5625, 0.625, 0.6875, obj["cube_8"] ? obj["cube_8"].texture : texture, obj["cube_8"] ? obj["cube_8"].data : data);
	model.addBoxByBlock("cube_9", 0.5, 0.1875, 0.4375, 0.5625, 0.3125, 0.5, obj["cube_9"] ? obj["cube_9"].texture : texture, obj["cube_9"] ? obj["cube_9"].data : data);
	model.addBoxByBlock("cube_10", 0.5, 0.1875, 0.5625, 0.5625, 0.3125, 0.625, obj["cube_10"] ? obj["cube_10"].texture : texture, obj["cube_10"] ? obj["cube_10"].data : data);
	model.addBoxByBlock("cube_11", 0.5, 0.375, 0.4375, 0.5625, 0.5, 0.5, obj["cube_11"] ? obj["cube_11"].texture : texture, obj["cube_11"] ? obj["cube_11"].data : data);
	model.addBoxByBlock("cube_12", 0.5, 0.375, 0.5625, 0.5625, 0.5, 0.625, obj["cube_12"] ? obj["cube_12"].texture : texture, obj["cube_12"] ? obj["cube_12"].data : data);
	model.addBoxByBlock("cube_13", 0.5, 0.3125, 0.5, 0.5625, 0.375, 0.5625, obj["cube_13"] ? obj["cube_13"].texture : texture, obj["cube_13"] ? obj["cube_13"].data : data);
	return model;
})();//boxes - 13




// file: models/crusher.js

//create Reider ___ size - 16
let crusher = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 1, data = data_default || 0;
	let model = new RenderUtil.Model();
	model.addBoxByBlock("cube", 0.0625, 0, 0.0625, 0.9375, 0.0625, 0.9375, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0.0625, 0.0625, 0.0625, 0.9375, 0.125, 0.1875, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0, 0.875, 0, 1, 0.9375, 0.1875, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0, 0.875, 0.8125, 1, 0.9375, 1, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.0625, 0.0625, 0.8125, 0.9375, 0.125, 0.9375, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0.0625, 0.0625, 0.1875, 0.1875, 0.125, 0.8125, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.8125, 0.0625, 0.1875, 0.9375, 0.125, 0.8125, obj["cube_7"] ? obj["cube_7"].texture : texture, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0, 0.875, 0.1875, 0.1875, 0.9375, 0.8125, obj["cube_8"] ? obj["cube_8"].texture : texture, obj["cube_8"] ? obj["cube_8"].data : data);
	model.addBoxByBlock("cube_9", 0.8125, 0.875, 0.1875, 1, 0.9375, 0.8125, obj["cube_9"] ? obj["cube_9"].texture : texture, obj["cube_9"] ? obj["cube_9"].data : data);
	model.addBoxByBlock("cube_10", 0.8125, 0, 0, 1, 0.875, 0.1875, obj["cube_10"] ? obj["cube_10"].texture : texture, obj["cube_10"] ? obj["cube_10"].data : data);
	model.addBoxByBlock("cube_11", 0.8125, 0, 0.8125, 1, 0.875, 1, obj["cube_11"] ? obj["cube_11"].texture : texture, obj["cube_11"] ? obj["cube_11"].data : data);
	model.addBoxByBlock("cube_12", 0, 0, 0.8125, 0.1875, 0.875, 1, obj["cube_12"] ? obj["cube_12"].texture : texture, obj["cube_12"] ? obj["cube_12"].data : data);
	model.addBoxByBlock("cube_13", 0, 0, 0, 0.1875, 0.875, 0.1875, obj["cube_13"] ? obj["cube_13"].texture : texture, obj["cube_13"] ? obj["cube_13"].data : data);
	model.addBoxByBlock("cube_14", 0, 0.9375, 0, 1, 1, 1, obj["cube_14"] ? obj["cube_14"].texture : texture, obj["cube_14"] ? obj["cube_14"].data : data);
	model.addBoxByBlock("cube_15", 0.3125, 0.0625, 0.3125, 0.6875, 0.1875, 0.6875, obj["cube_15"] ? obj["cube_15"].texture : texture, obj["cube_15"] ? obj["cube_15"].data : data);
	model.addBoxByBlock("cube_16", 0.375, 0.1875, 0.375, 0.625, 0.25, 0.625, obj["cube_16"] ? obj["cube_16"].texture : texture, obj["cube_16"] ? obj["cube_16"].data : data);
	return model;
})(null, BlockID.aw_enchanted_stone);//boxes - 16




// file: models/magic_storage.js

//create Reider ___ size - 16
let magic_storage = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 1, data = data_default || 0;
	let model = new RenderUtil.Model();
	model.addBoxByBlock("cube", 0, 0, 0, 1, 0.125, 1, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0, 0.875, 0, 1, 1, 1, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0, 0.125, 0, 0.125, 0.875, 0.125, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0.875, 0, 0, 1, 1, 0.125, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.875, 0.125, 0.875, 1, 0.875, 1, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0, 0.125, 0.875, 0.125, 0.875, 1, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.1875, 0.1875, 0.1875, 0.8125, 0.8125, 0.8125, VanillaBlockID.obsidian, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0.25, 0.125, 0.25, 0.75, 0.1875, 0.75, VanillaBlockID.obsidian, obj["cube_8"] ? obj["cube_8"].data : data);
	model.addBoxByBlock("cube_9", 0.25, 0.8125, 0.25, 0.75, 0.875, 0.75, VanillaBlockID.obsidian, obj["cube_9"] ? obj["cube_9"].data : data);
	return model;
})(null, BlockID.aw_enchanted_stone);




// file: models/pedestal_2lvl.js

//create Reider ___ size - 32
let pedestal_2 = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 1, data = data_default || 0;
	let model = new RenderUtil.Model();
	model.addBoxByBlock("cube", 0.03125, 0, 0.03125, 1, 0.0625, 1, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0.0625, 0.03125, 0.0625, 0.9375, 0.125, 0.96875, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0.03125, 1.0625, 0.03125, 0.96875, 1.125, 1, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0.125, 0.125, 0.125, 0.875, 1.0625, 0.90625, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.09375, 0.125, 0.09375, 0.15625, 1.0625, 0.15625, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0.84375, 0.125, 0.875, 0.90625, 1.0625, 0.9375, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.09375, 0.125, 0.875, 0.15625, 1.0625, 0.9375, obj["cube_7"] ? obj["cube_7"].texture : texture, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0.84375, 0.125, 0.09375, 0.90625, 1.0625, 0.15625, obj["cube_8"] ? obj["cube_8"].texture : texture, obj["cube_8"] ? obj["cube_8"].data : data);
	model.addBoxByBlock("cube_9", 0.09375, 0.125, 0.09375, 0.90625, 0.15625, 0.9375, obj["cube_9"] ? obj["cube_9"].texture : texture, obj["cube_9"] ? obj["cube_9"].data : data);
	model.addBoxByBlock("cube_10", 0.09375, 1.03125, 0.09375, 0.90625, 1.0625, 0.9375, obj["cube_10"] ? obj["cube_10"].texture : texture, obj["cube_10"] ? obj["cube_10"].data : data);
	return model;
})(null, "aw_enchanted_stone");//boxes - 10




// file: models/ScrollClone.js

//create Reider ___ size - 16
let ScrollClone = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || BlockID.aw_magic_brick, data = data_default || 0;
	let model = new RenderAPI.Model();
	model.addBoxByBlock("cube", 0, 0, 0, 1, 0.0625, 1, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0.0625, 0.0625, 0.0625, 0.9375, 0.125, 0.9375, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0.125, 0.125, 0.125, 0.25, 0.1875, 0.25, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0.125, 0.125, 0.75, 0.25, 0.1875, 0.875, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.75, 0.125, 0.75, 0.875, 0.1875, 0.875, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0.75, 0.125, 0.125, 0.875, 0.1875, 0.25, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.0625, 0.1875, 0.0625, 0.9375, 0.8125, 0.9375, obj["cube_7"] ? obj["cube_7"].texture : texture, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0, 0.8125, 0, 1, 0.875, 1, BlockID.aw_magic_stone, 0);
	return model;
});//boxes - 8




// file: models/GeneratorIc.js

//create Reider ___ size - 16
let GeneratorIc = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 1, data = data_default || 0;
	let model = new RenderAPI.Model();
	model.addBoxByBlock("cube", 0.3125, 0, 0.3125, 0.6875, 0.0625, 0.6875, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0.3125, 0.9375, 0.3125, 0.6875, 1, 0.6875, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0.3125, 0.3125, 0, 0.6875, 0.6875, 0.0625, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0.9375, 0.3125, 0.3125, 1, 0.6875, 0.6875, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.3125, 0.3125, 0.9375, 0.6875, 0.6875, 1, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0, 0.3125, 0.3125, 0.0625, 0.6875, 0.75, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.375, 0.0625, 0.375, 0.625, 0.9375, 0.625, obj["cube_7"] ? obj["cube_7"].texture : texture, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0.375, 0.375, 0.0625, 0.625, 0.625, 0.9375, obj["cube_8"] ? obj["cube_8"].texture : texture, obj["cube_8"] ? obj["cube_8"].data : data);
	model.addBoxByBlock("cube_9", 0.0625, 0.375, 0.375, 0.9375, 0.625, 0.625, obj["cube_9"] ? obj["cube_9"].texture : texture, obj["cube_9"] ? obj["cube_9"].data : data);
	model.addBoxByBlock("cube_10", 0.25, 0.25, 0.25, 0.75, 0.75, 0.75, obj["cube_10"] ? obj["cube_10"].texture : texture, obj["cube_10"] ? obj["cube_10"].data : data);
	model.addBoxByBlock("cube_11", 0.1875, 0.3125, 0.3125, 0.8125, 0.6875, 0.6875, obj["cube_11"] ? obj["cube_11"].texture : texture, obj["cube_11"] ? obj["cube_11"].data : data);
	model.addBoxByBlock("cube_12", 0.3125, 0.3125, 0.1875, 0.6875, 0.6875, 0.8125, obj["cube_12"] ? obj["cube_12"].texture : texture, obj["cube_12"] ? obj["cube_12"].data : data);
	model.addBoxByBlock("cube_13", 0.3125, 0.1875, 0.3125, 0.6875, 0.8125, 0.6875, obj["cube_13"] ? obj["cube_13"].texture : texture, obj["cube_13"] ? obj["cube_13"].data : data);
	return model;
});//boxes - 13




// file: models/ResearchTable.js

//create Reider ___ size - 16
let ResearchTable = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 5, data = data_default || 0;
	let model = new RenderAPI.Model();
	model.addBoxByBlock("3", 0.0625, 0, 0.0625, 0.1875, 0.875, 0.1875, VanillaBlockID.log, 0);
	model.addBoxByBlock("2", 0.0625, 0, 0.8125, 0.1875, 0.875, 0.9375, VanillaBlockID.log, 0);
	model.addBoxByBlock("1", 0.8125, 0, 0.8125, 0.9375, 0.875, 0.9375, VanillaBlockID.log, 0);
	model.addBoxByBlock("4", 0.8125, 0, 0.0625, 0.9375, 0.875, 0.1875, VanillaBlockID.log, 0);
	model.addBoxByBlock("cube", 0, 0.875, 0, 1, 0.9375, 1, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", -0.0625, 0.9375, -0.0625, 0.125, 1, 1.0625, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0.875, 0.9375, -0.0625, 1.0625, 1, 1.0625, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", -0.0625, 0.9375, 0.875, 1.0625, 1, 1.0625, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", -0.0625, 0.9375, -0.0625, 1.0625, 1, 0.125, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0.0625, 0.6875, 0.0625, 0.125, 0.8125, 0.9375, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.875, 0.6875, 0.0625, 0.9375, 0.8125, 0.9375, obj["cube_7"] ? obj["cube_7"].texture : texture, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0.125, 0.6875, 0.875, 0.9375, 0.8125, 0.9375, obj["cube_8"] ? obj["cube_8"].texture : texture, obj["cube_8"] ? obj["cube_8"].data : data);
	model.addBoxByBlock("cube_9", 0.125, 0.6875, 0.0625, 0.9375, 0.8125, 0.125, obj["cube_9"] ? obj["cube_9"].texture : texture, obj["cube_9"] ? obj["cube_9"].data : data);
	model.addBoxByBlock("s", 0, 1, 0, 0.125, 1.125, 0.125, VanillaBlockID.log, 0);
	model.addBoxByBlock("s_2", 0, 1, 0.875, 0.125, 1.125, 1, VanillaBlockID.log, 0);
	model.addBoxByBlock("s_3", 0.875, 1, 0, 1, 1.125, 0.125, VanillaBlockID.log, 0);
	model.addBoxByBlock("s_4", 0.875, 1, 0.875, 1, 1.125, 1, VanillaBlockID.log, 0);
	return model;
})();//boxes - 17




// file: items/enchant.js

let magic_protection = CustomEnchant.newEnchant("aw_magic_protection", Translation.translate("aw.enchant.magic_protection"))
	.setMinMaxLevel(1, 5)
	.setMasks(12, 3)
	.setIsTreasure(false)
	.setFrequency(1);

let dead_protection = CustomEnchant.newEnchant("aw_dead_protection", Translation.translate("aw.enchant.dead_protection"))
	.setMinMaxLevel(1, 5)
	.setMask(512)
	.setIsTreasure(false)
	.setFrequency(1);

//if(this["CustomEnchant"]){

var aspects_restoration = CustomEnchant.newEnchant("aw.aspects_restoration", Translation.translate("aw.enchant.aspects_restoration"))
	.setMinMaxLevel(1, 5)
	.setMask(16)
	.setIsTreasure(true)
 .setIsDiscoverable(false)
	.setFrequency(1)
 .setMinMaxCost(1, 3, 1, 3)
 .setAttackDamageBonusProvider(function(){return -1;});

var magic_damage = CustomEnchant.newEnchant("aw.magic_damage", Translation.translate("aw.enchant.magic_damage"))
	.setMinMaxLevel(1, 3)
	.setMask(16)
	.setIsTreasure(false)
 .setIsDiscoverable(true)
	.setFrequency(1)
 .setMinMaxCost(1, 3, 1, 3);

Callback.addCallback("PlayerAttack", function(player, ent){
let item = Entity.getCarriedItem(player);
if(item.extra){
MagicCore.damage(ent, "magic", 2*item.extra.getEnchantLevel(magic_damage.id));
}
});


Callback.addCallback("PlayerAttack", function(player, ent){
    let c = MagicCore.getValue(player);
    let item = Entity.getCarriedItem(player);
    if(MagicCore.isClass(player) && item.extra){
        let r = item.extra.getEnchantLevel(aspects_restoration.id)
        if(c.aspects + r <= c.aspectsNow){
            c.aspects += r;
        }else{
            c.spects = c.AspectsNow;
        }
       MagicCore.setParameters(player, c);
    }
});

var addEnchant = function(enchant, level){
for(let i = 1;i <= level;i++){
let extra = new ItemExtraData();
extra.addEnchant(enchant, i);
Item.addToCreative(VanillaItemID.enchantment_book, 1, 0, extra);
}
}
addEnchant(aspects_restoration.id, 5);
addEnchant(magic_damage.id, 3);
//}




// file: core/renderAPI.js

let RenderAPILegacy = {
__plantVertex: [
		[0.15, 0, 0.15, 1, 1],
		[0.85, 0, 0.85, 0, 1],
		[0.85, 1, 0.85, 0, 0],
		[0.15, 0, 0.15, 1, 1],
		[0.15, 1, 0.15, 1, 0],
		[0.85, 1, 0.85, 0, 0],
		[0.15, 0, 0.85, 1, 1],
		[0.85, 0, 0.15, 0, 1],
		[0.85, 1, 0.15, 0, 0],
		[0.15, 0, 0.85, 1, 1],
		[0.15, 1, 0.85, 1, 0],
		[0.85, 1, 0.15, 0, 0]
	],
	setPlantModel(id, data, texture, meta){
		let shape = new ICRender.CollisionShape()
		shape.addEntry().addBox(7 / 8, 1, 7 / 8, 1 / 8, 0, 1 / 8)
		BlockRenderer.setCustomCollisionShape(id, data, shape)
		let render = new ICRender.Model()
		let mesh = new RenderMesh()
		mesh.setBlockTexture(texture, meta || 0)
		for(let i = 0; i < 12; i++){
			let poly = this.__plantVertex[i]
			mesh.addVertex(poly[0], poly[1], poly[2], poly[3], poly[4])
		}
		for(let i = 11; i >= 0; i--){
			let poly = this.__plantVertex[i]
			mesh.addVertex(poly[0], poly[1], poly[2], poly[3], poly[4])
		}
		render.addEntry(mesh)
		BlockRenderer.setStaticICRender(id, data, render)
	},
    SetAltar: function (id){
        var render = new ICRender.Model(); 
        var model = BlockRenderer.createModel();  
        render.addEntry(model);
        model.addBox(1/16, 0, 1/16, 15/16, 0.0625, 15/16, 1, 0);
        model.addBox(2/16, 0.0625, 2/16, 14/16, 0.125, 14/16, 1, 0);
        model.addBox(3/16, 0.125, 3/16, 13/16, 1 - 0.0625, 13/16, 1, 0);
        model.addBox(2/16, 1 - 0.0625, 2/16, 14/16, 1, 14/16, 1, 0);
        BlockRenderer.setStaticICRender(id, -1, render);
    }, 
    importOBJ: function (id, texture, obj){
        var mesh = new RenderMesh();
        mesh.importFromFile(__dir__ + "/assets/model/" + obj, "obj", null);
        mesh.setBlockTexture(texture, 0);
        var renderAPI = new ICRender.Model();
        var modelAPI = new BlockRenderer.Model(mesh);  
        renderAPI.addEntry(modelAPI);
        BlockRenderer.setStaticICRender(id, -1, renderAPI); 
    },
    setCauldron: function(id){
        var render = new ICRender.Model(); 
        var model = BlockRenderer.createModel();  
        render.addEntry(model);
        model.addBox(0, 0, 0, 4/16, 2/16, 4/16, "cauldron_side", 0);
        model.addBox(12/16, 0, 12/16, 1, 2/16, 1, "cauldron_side", 0);
        model.addBox(12/16, 0, 0, 1, 2/16, 4/16, "cauldron_side", 0);
        model.addBox(0, 0, 12/16, 4/16, 2/16, 1, "cauldron_side", 0);
        model.addBox(0, 2/16, 0, 1, 3/16, 1, "cauldron_inner", 0);
        model.addBox(0, 3/16, 0, 1, 1, 1/16, "cauldron_side", 0);
        model.addBox(15/16, 3/16, 1/16, 1, 1, 1, "cauldron_side", 0);
        model.addBox(0, 3/16, 0, 1/16, 1, 1, "cauldron_side", 0);
        model.addBox(1/16, 3/16, 15/16, 15/16, 1, 1, "cauldron_side", 0);
        BlockRenderer.setStaticICRender(id, -1, render);
    },
    setMagicController: function(id){
        var render = new ICRender.Model(); 
        var model = BlockRenderer.createModel();  
        model.addBox(7/16, 0, 7/16, 9/16, 14/16, 9/16, 155, 0);
        model.addBox(0, 0, 0, 1, 2/16, 1, 155, 0);
        model.addBox(2/16, 6/16, 2/16, 14/16, 7/16, 14/16, 155, 0);
        model.addBox(4/16, 10/16, 4/16, 12/16, 11/16, 12/16, 155, 0);
        model.addBox(6/16, 14/16, 6/16, 10/16, 18/16, 10/16, 57, 0);
        render.addEntry(model);
        BlockRenderer.setStaticICRender(id, -1, render);
    },
    setResearchTable: function(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(1/16, 0, 1/16, 3/16, 14/16, 3/16, VanillaBlockID.log, 0);
      model.addBox(13/16, 0, 13/16, 15/16, 14/16, 15/16, VanillaBlockID.log, 0);
      model.addBox(13/16, 0, 1/16, 15/16, 14/16, 3/16, VanillaBlockID.log, 0);
      model.addBox(1/16, 0, 13/16, 3/16, 14/16, 15/16, VanillaBlockID.log, 0);
      model.addBox(0, 14/16, 0, 1, 15/16, 1, 5, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setSingularityShrinker: function(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(0, 0, 0, 1, 3/16, 1, 98, 0);
      model.addBox(2/16, 3/16, 2/16, 14/16, 7/16, 14/16, 1, 0);
      model.addBox(4/16, 7/16, 4/16, 12/16, 11/16, 12/16, VanillaBlockID.obsidian, 0);
      model.addBox(6/16, 11/16, 6/16, 10/16, 1, 10/16, VanillaBlockID.obsidian, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setSingularityExtractor: function(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(0, 11/16, 0, 1, 1, 1, 98, 0);
      model.addBox(2/16, 7/16, 2/16, 14/16, 11/16, 14/16, 1, 0);
      model.addBox(4/16, 3/16, 4/16, 12/16, 7/16, 12/16, VanillaBlockID.obsidian, 0);
      model.addBox(6/16, 0, 6/16, 10/16, 3/16, 10/16, VanillaBlockID.obsidian, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setTransmitter: function(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(5/16, 5/16, 5/16, 11/16, 11/16, 11/16, 1, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setEmpty: function(id){
    	var render = new ICRender.Model(); 
      BlockRenderer.setStaticICRender(id, -1, render);
      var model = BlockRenderer.createModel();  
      render.addEntry(model);
    },
    
    setBottomObelisk(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(1/16, 0, 1/16, 15/16, 7/16, 15/16, VanillaBlockID.stonebrick, 0);
      model.addBox(2/16, 7/16, 2/16, 14/16, 13/16, 14/16, id, 0);
      model.addBox(3/16, 13/16, 3/16, 13/16, 16/16, 13/16, VanillaBlockID.stonebrick, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setTopObelisk(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(3/16, 0, 3/16, 13/16, 2/16, 13/16, VanillaBlockID.stonebrick, 0);
      model.addBox(4/16, 2/16, 4/16, 12/16, 6/16, 12/16, id, 0);
      model.addBox(5/16, 6/16, 5/16, 11/16, 9/16, 11/16, id, 0);
      model.addBox(6/16, 9/16, 6/16, 10/16, 12/16, 10/16, id, 0);
      model.addBox(7/16, 12/16, 7/16, 9/16, 16/16, 9/16, VanillaBlockID.obsidian, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setItemObelisk(id){
    	let itemModel = ItemModel.getFor(id, 0);
    	let model = BlockRenderer.createModel();
    	model.addBox(1/16, 0, 1/16, 15/16, 7/16, 15/16, VanillaBlockID.stonebrick, 0);
      model.addBox(2/16, 7/16, 2/16, 14/16, 13/16, 14/16, id, 0);
      model.addBox(3/16, 13/16, 3/16, 13/16, 16/16, 13/16, VanillaBlockID.stonebrick, 0);
    	
    	model.addBox(3/16, 0+1, 3/16, 13/16, 2/16+1, 13/16, VanillaBlockID.stonebrick, 0);
      model.addBox(4/16, 2/16+1, 4/16, 12/16, 6/16+1, 12/16, id, 0);
      model.addBox(5/16, 6/16+1, 5/16, 11/16, 9/16+1, 11/16, id, 0);
      model.addBox(6/16, 9/16+1, 6/16, 10/16, 12/16+1, 10/16, id, 0);
      model.addBox(7/16, 12/16+1, 7/16, 9/16, 16/16+1, 9/16, VanillaBlockID.obsidian, 0);
    	itemModel.setModel(model);
    	itemModel.setUiModel(model);
    	itemModel.setHandModel(model);
    }
};
(function(){
	for(let key in RenderAPILegacy)
		RenderAPI[key] = RenderAPILegacy[key];
})();




// file: core/ItemName.js

var CustomName = WRAP_JAVA("com.core.api.Item");

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




// file: core/MagisCore.js

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
    	ItemName.setName(id, "\n "+ TranslationLoad.get("aw.message.required_level", [["name", parameter],["level", value]]), true);
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
    			PlayerAC.message(player, TranslationLoad.get("aw.message.give_study", [["scrutiny", scrutiny.scrutiny||"book"]]));
    		actor.setArmor(slot, 0, 0, 0, null);
    		actor.addItemToInventory(id, 1, item.data, item.extra, true);
    		PlayerAC.message(player, TranslationLoad.get("aw.message.required_level", [["name", parameter],["level", value]]));
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
                PlayerAC.message(player, TranslationLoad.get("aw.message.parameter_update", [["name", parameter],["value", value],["new", cv[parameter]]]));
                MagicCore.setParameters(player, cv);
            }else{
                PlayerAC.message(player, TranslationLoad.get("aw.message.parameter_noy_update", [["name", parameter]]));
            }
        }else{
            PlayerAC.message(player, Translation.translate("aw.message.have_class"));
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
            PlayerAC.message(player, TranslationLoad.get("aw.message.required_level", [["name", arr[0]],["level", arr[1]]]));
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




// file: core/ConvertedID.js

var ConverteBlock = {
    textToNumeric: function(id){
        let ids = FileTools.ReadJSON(__packdir__ + "innercore/mods/.staticids");
        let Block = ids.id.blocks[id];
        if(!Block){
            Block = parseInt(id);
        }
        return Block;
    },
    NumericToText: function(id){
        let blocks = FileTools.ReadJSON(__packdir__ + "innercore/mods/.staticids");
        blocks = blocks.id.blocks;
        let d;
        if(id >= 8000){
           key = Object.keys(blocks);
           for(i in key){
               let k = key[i];
               if(blocks[k]==id){
                   d = k;
               }
           }
        }else{
            d = id
        }
        return d;
    }
};
var ConverteItem = {
    textToNumeric: function(id){
        let ids = FileTools.ReadJSON(__packdir__ + "innercore/mods/.staticids");
        let item = ids.id.items[id];
        if(!item){
            item = parseInt(id);
        }
        return item;
    },
    NumericToText: function(id){
        let items = FileTools.ReadJSON(__packdir__ + "innercore/mods/.staticids");
        items = items.id.items;
        let d;
        if(id >= 2000 && id <= 8000){
           key = Object.keys(blocks);
           for(i in key){
               let k = key[i];
               if(items[k]==id){
                   d = k;
               }
           }
        }else{
            d = id
        }
        return d;
    }
};




// file: core/ParticlesAPI.js

Math.sign = Math.sign || function(x) {
	x = +x;
	if(x === 0)
		return x; 
	return x > 0 ? -0.1 : 0.1; 
}

Network.addClientPacket("aw.game.tipMessage", function(packetData) {
	Game.tipMessage(packetData);
});

var Mp = {
	spawnParticle(type, x, y, z, vx, vy, vz, ax, ay, az, dim){
		ParticlesCore.spawnParticle(dim, type, x, y, z, vx, vy, vz);
	},
	spawnArrayParticle(array, dim){
		ParticlesCore.spawnParticles(dim, array);
	},
	tipMessage(player, text){
		let client = Network.getClientForPlayer(player);
		if(client)
			client.send("aw.game.tipMessage", text);
	}
};

let ParticlesType = {};

let color = {
  r: 0,
  g: 0,
  b: 0
};
Callback.addCallback("LocalTick", function(){
  color.r = color.r + .0125 <= 1 ? color.r + .0125 : 0;
  color.g = color.g + .0025 <= 1 ? color.g + .0025 : 0;
  color.b = color.b + .025 <= 1 ? color.b + .025 : 0;
   Particles.getParticleTypeById(ParticlesType.colors).setColor(color.r, color.g, color.b, 1);
 Particles.getParticleTypeById(ParticlesType.indicator).setColor(color.r, color.g, color.b, 1);
});

ParticlesStorage.setGroup("aw").add("aspect_particle", Particles.registerParticleType({
	texture: "aspect_particle",
	render: 3,
	size: [2, 4],
	lifetime: [80, 100], 
	animators: {
		size:{fadeOut: .5, fadeIn:0.2, start:0.8, end:0},
		icon: {start: 0, end: 1, period: 19, fadeIn: 1}
	}
})).add("magic_particle", Particles.registerParticleType({
	texture: "magic_particle",
	render: 3,
	size: [2, 4],
	lifetime: [80, 100], 
	animators: {
		size:{fadeOut: .5, fadeIn:0.2, start:0.8, end:0},
		icon: {start: 0, end: 1, period: 19, fadeIn: 1}
	}
})).add("singularity_particle", Particles.registerParticleType({
	texture: "singularity_particle",
	render: 3,
	size: [2, 4],
	lifetime: [80, 100], 
	animators: {
		size:{fadeOut: .5, fadeIn:0.2, start:0.8, end:0},
		icon: {start: 0, end: 1, period: 19, fadeIn: 1}
	}
})).add("colors", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime: [50, 50],
	color: [color.r, color.g, color.b, 1],
	animators: {
		size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
	}
})).add("snow", Particles.registerParticleType({
	texture: "aw_snowgrave_0",
	render: 2,
	size: [2, 2],
	lifetime: [30, 40],
	animators: {
		size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
	}
})).add("snowProjectTile", Particles.registerParticleType({
	texture: "aw_snowgrave_2",
	render: 2,
	size: [2, 2],
	lifetime: [100, 100],
	animators: {
		size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
	}
})).add("indicator", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime: [1000, 1000],
	color: [color.r, color.g, color.b, 1],
	animators: {
		size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
	}
})).add("ProjectTile", Particles.registerParticleType({
	texture: "project",
	render: 2,
	size: [8, 8],
	lifetime:[100, 100],
	animators: {
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("project", Particles.registerParticleType({
	texture: "project",
	render: 2,
	size: [2, 2],
	lifetime:[3, 3],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("project2", Particles.registerParticleType({
	texture: "project",
	render: 2,
	size: [8, 8],
	lifetime:[3, 3],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part1", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime:[50, 50],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part1Colision", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [10, 20],
	lifetime:[50, 55],
	collision: true,
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part2", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime:[50, 50],
	color: [84, 5, 5, 1],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part3", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime:[50, 50],
	color: [255, 255, 0, 1],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part4", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime:[50, 50],
	color: [227, 0, 72, 1],
	animators: {
		alpha:{fadeIn: .4, fadeOut: .4},
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("part5", Particles.registerParticleType({
	texture: "aw_magis",
	render: 2,
	size: [2, 2],
	lifetime:[1,1],
	color: [227, 0, 72, 1] 
})).add("part_singularity", Particles.registerParticleType({
	texture: "aw_singularity",
	render: 2,
	size:[4, 4],
	lifetime: [30, 30],
	color: [10/255, 10/255, 110/255, 1],
	animators: {
		size:{fadeOut: .5, fadeIn:0.2, start:0, end:0}
	}
})).add("fog", Particles.registerParticleType({
	texture: "aw_fog",
	render: 2,
	size: [8, 12],
	lifetime: [500, 550],
	animators: {
		size: {fadeOut: .1, fadeln:.1, start: 0, end: 0}
 	}
})).setGroup(null);

var ParticlesAPI = {
	getVector(pos1, pos2){
		return ParticlesCore.getVector(pos1, pos2);
	},
	coords(part, x1, y1, z1, x2, y2, z2, time, dim){
		ParticlesCore.spawnCoords(dim, part, x1, y1, z1, x2, y2, z2, time)
	},
	spawnLine(part, x1, y1, z1, x2, y2, z2, count, dim){
		ParticlesCore.spawnLine(dim, part, x1+.5, y1+.5, z1+.5, x2+.5, y2+.5, z2+.5, count);
	},
	spawnCircle(particles, x, y, z, radius, count, rotation, dim){
		let angle = 0;
		let step = 360 / count;
		let group = new ParticlesCore.Group();
		if(rotation == 0){
			for(i = 0;i < 360;i+=step){
				let x1 = x + radius * Math.cos(i);
				let y1 = y - radius * Math.sin(i);
				group.add(particles, x1 + 0.5, y1 + 0.5, z + 0.5);
			}
		}else if(rotation == 1){
			for(i = 0;i < 360;i+=step){
				let z1 = z + radius * Math.cos(i);
				let y1 = y - radius * Math.sin(i);
				group.add(particles, x + 0.5, y1 + 0.5, z1 + 0.5);
			}
		}else if(rotation == 2){
			for(i = 0;i < 360;i+=step){
				let x1 = x + radius * Math.cos(i);
				let z1 = z - radius * Math.sin(i);
				group.add(particles, x1 + 0.5, y + 0.5, z1 + 0.5);
			}
		}
		group.send(dim);
	},
	spawnCircleClient(particles, x, y, z, radius, count, rotation){
		let angle = 0;
		let step = 360 / count;
		if(rotation == 0){
			for(i = 0;i < 360;i+=step){
				let x1 = x + radius * Math.cos(i);
				let y1 = y - radius * Math.sin(i);
				Particles.addParticle(particles, x1 + 0.5, y1 + 0.5, z + 0.5, 0, 0, 0);
			}
		}else if(rotation == 1){
			for(i = 0;i < 360;i+=step){
				let z1 = z + radius * Math.cos(i);
				let y1 = y - radius * Math.sin(i);
				Particles.addParticle(particles, x + 0.5, y1 + 0.5, z1 + 0.5, 0, 0, 0);
			}
		}else if(rotation == 2){
			for(i = 0;i < 360;i+=step){
				let x1 = x + radius * Math.cos(i);
				let z1 = z - radius * Math.sin(i);
				Particles.addParticle(particles, x1 + 0.5, y + 0.5, z1 + 0.5, 0, 0, 0);
			}
		}
	},
	spawnCircleVector(time, particle, x, y, z, radius, count, dim){
		let angle = 0;
		let step = 360 / count;
		let group = new ParticlesCore.Group();
		for(i = 0;i < 360;i+=step){
			let x1 = x + radius * Math.cos(i);
			let z1 = z - radius * Math.sin(i);
			group.add(particles, x1 + 0.5, y + 0.5, z1 + 0.5, -Math.sign(x1 - x), 0, -Math.sign(z1 - z));
		}
		group.send(dim);
	},
	spawnShellEnt(part, ent, distante, damage){
		let pos = Entity.getPosition(ent);
		let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(ent));
		let region = BlockSource.getDefaultForActor(ent);
		let group = new ParticlesCore.Group();
		for(let i = 0;i<distante;i++){
			let coord = {
				x: pos.x+(i * vel.x / 2),
				y: pos.y+0.5+(i * vel.y / 2),
				z: pos.z+(i * vel.z / 2)
			};
			let ent3 = Entity.getAllInRange(coord, 2);
			for(let i1 in ent3)
				if(ent3[i1] != ent)
					MagicCore.damage(ent3[i1], "magic", damage);
			if(region.getBlockId(coord.x,coord.y,coord.z)!=0)
				break;
			group.add(part, coord.x, coord.y, coord.z);
		}
		group.send(region);
	},
	spawnCircle2(particles, x, y, z, radius, count, time){
		let circle = 0;
		for(let i = 0;i<=count;i++){
			setTimeout(function(){
				let x1 = x + radius * Math.cos(circle);
				let z1 = z - radius * Math.sin(circle);
				Mp.spawnParticle(particles, x1 + 0.5, y + 0.5, z1 + 0.5, 0, 0, 0);
				circle+=360/count/i;
			}, time * i * 2);
		}
	},
};
(function(){
	let all = ParticlesStorage.getAll("aw");
	for(let i in all){
		ParticlesAPI[all[i]] = all[i];
		ParticlesType[all[i]] = ParticlesStorage.get(all[i]);
	}
})();




// file: items/book.js

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




// file: core/AncientWonders.js

function ParameterData(){}

ParameterData.create = function(parameter){
	let name = parameter[0].toUpperCase() + parameter.substring(1);
	ParameterData.prototype["set"+name] = function(v){
		this[parameter] = v;
		return this;
	}
}

let AncientWonders = {
	default_return: {name:"noy"},
	ClassType(name, org_name){
		let type = JSON.parse(JSON.stringify(Class[org_name||"noy"] || {}));
		type.name = name;
		Class[name] = type;
		BookAPI.drawFunc(name, "name", function(classData, player, i, nameParameter){
  		return Translation.translate("aw.gui.book_class") + ": "+classData["name"]
  	});
  	BookAPI.copy(name, org_name);
		this.setParameter = function(parameter, value){
			Class[name][parameter] = value;
			if(!AncientWonders.default_return[parameter])
				AncientWonders.default_return[parameter]=0;
			AncientWonders.setIsFunc(parameter);
			return this;
		}
		this.addParameter = function(parameter, min, max){
			this.setParameter(parameter, min);
			BookAPI.drawFunc(name, parameter, function(classData, player, i, nameParameter){
				return Translation.translate(parameter) + ": "+classData[parameter]+"/"+classData[parameter+"Max"]
			});
			
			ParameterData.create(parameter);
			
			return this.setParameter(parameter+"Max", max);
		}
		this.getParameter = function(parameter, value){
			return Class[name][parameter] || 0;
		}
	},
	getClassTypeByName(name){
		return new AncientWonders.ClassType(name, name)
	},
	addParameters: [],
	setAllClassParameter(name, value, bool){
		this.addParameters.push({
			name: name,
			value: value,
			bool: bool
		});
  },
  addAllClassParameter(name, min, max){
  	this.setAllClassParameter(name, min, true);
  	this.setAllClassParameter(name+"Max", max);
  },
	isFunc: {},
	setIsFunc(parameter, func){
		this.isFunc[parameter] = func || function(player, obj, bonus, data, p){
			return (obj[p] - (bonus[p]||0)) > data[p];
		};
	},
	setParameter(type, name, value){
		if(!AncientWonders.default_return[name])
  		AncientWonders.default_return[name]=0;
		if(Class[type])
			Class[type][name] = value;
	},
	getParameter(type, name){
		if(Class[type])
			return Class[type][name];
		return 0;
	},
	addParameter(type, name, min, max){
		this.setParameter(type, name, min);
		this.setParameter(type, name+"Max", max);
		BookAPI.drawFunc(type, name, function(classData, player, i, nameParameter){
			return Translation.translate(name) + ": "+classData[name]+"/"+classData[name+"Max"]
		});
		ParameterData.create(name);
	},
	bonus: [],
	Bonus(id){
		for(let key in ParameterData.prototype){
			let org = ParameterData.prototype[key];
			this[key] = function(player, value){
				let obj = this[player]||{};
				org.call(obj, value);
				this[player] = obj;
			}
		}
		this.id = id;
		this.register = function(){
			AncientWonders.bonus.push(this);
			return this;
		}
		this.deleted = function(){
			for(let i in AncientWonders.bonus){
				let bonus = AncientWonders.bonus[i];
				if(bonus.id == id)
					return AncientWonders.bonus.splice(i, i);
			}
		}
	},
	mathBonus(player, st){
		const result = st||{};
		for(let i in this.bonus){
			const bonus = this.bonus[i][player];
			for(let key in bonus){
				let value = bonus[key]||{};
				if(typeof value == "number")
					result[key] = (result[key]||0) + value;
			}
		}
		return result;
	},
	isParameters(player, obj, bonus){
		bonus = this.mathBonus(player, bonus);
		let data = MagicCore.getValue(player);
		let keys = Object.keys(obj);
		for(let i in keys)
			if(this.isFunc[keys[i]](player, obj, bonus, data, keys[i]))
				return false;
		return true;
	},
	message(player, obj, bonus, message){
		bonus = this.mathBonus(player, bonus);
		message = message || function(player, obj, bonus, name){
			return TranslationLoad.get("aw.message.required_parameter", [["name", name],["level", (obj[name]-(bonus[name]||0))]])
		}
		let data = MagicCore.getValue(player);
		let keys = Object.keys(obj);
		for(let i in keys)
			if(this.isFunc[keys[i]](player, obj, bonus, data, keys[i]))
				PlayerAC.message(player, message(player, obj, bonus, keys[i]));
	},
	getArrMessage(player, obj, bonus, message){
		bonus = this.mathBonus(player, bonus);
		message = message || function(player, obj, bonus, name){
			return TranslationLoad.get("aw.message.required_parameter", [["name", name],["level", (obj[name]-(bonus[name]||0))]])
		}
		let data = MagicCore.getValue(player);
		let keys = Object.keys(obj);
		let arr = [];
		for(let i in keys)
			if(this.isFunc[keys[i]](player, obj, bonus, data, keys[i]))
				arr.push(message(player, obj, bonus, keys[i]));
		return arr;
	},
	setPlayerClass(player, name){
		classPlayer[player] = Class[name];
	},
	getDefaultClass(){
		return this.default_return;
	},
	getDir(){
    return __dir__;
  }
};
Callback.addCallback("ModsLoaded", function(){
	let arr = AncientWonders.addParameters;
	for(let ii in arr){
		let name = arr[ii].name;
		let value = arr[ii].value;
  	let keys = Object.keys(Class);
  	for(let i in keys)
  		if(keys[i]!="noy"){
  			Class[keys[i]][name] = value;
  			if(!AncientWonders.default_return[name])
  				AncientWonders.default_return[name]=0;
  			if(arr[ii].bool){
  				BookAPI.drawFunc(keys[i], name, function(classData, player, i, nameParameter){
						return Translation.translate(name) + ": "+classData[name]+"/"+classData[name+"Max"]
					});
  			}
			}
		AncientWonders.setIsFunc(name);
	}
	Callback.invokeCallback("AddParameters");
});
new AncientWonders.ClassType("mage")
	.addParameter("magic", 5, 100)
	.addParameter("protection", 0, 40)
	.addParameter("necromancer", 0, 10)
	.addParameter("aspects", 0, 100000)
	.setParameter("aspectsNow", 5000);

new AncientWonders.ClassType("warrior")
	.addParameter("magic", 0, 30)
	.addParameter("protection", 10, 100)
	.addParameter("necromancer", 0, 5)
	.addParameter("aspects", 0, 10000)
	.setParameter("aspectsNow", 100);

new AncientWonders.ClassType("necromancer")
	.addParameter("magic", 5, 50)
	.addParameter("protection", 0, 30)
	.addParameter("necromancer", 5, 100)
	.addParameter("aspects", 0, 50000)
	.setParameter("aspectsNow", 5000);

new AncientWonders.ClassType("developer")
	.addParameter("magic", 100, 100)
	.addParameter("protection", 100, 100)
	.addParameter("necromancer", 100, 100)
	.addParameter("aspects", 2e10, 2e10)
	.setParameter("aspectsNow", 2e10);




// file: core/EffectAPI.js

let EffectAPI = {
    effect: {},
    entity: {},
    register: function(obj){
        obj.tick = obj.tick || function(e, t, l){};
        obj.over = obj.over || function(e, l){};
        this.effect[obj.id] = obj;
    },
    add: function(ent, id, time, level){
        if(!this.entity[ent]) this.entity[ent] = {};
        if(this.entity[ent][id]){
            this.entity[ent][id].time = time;
            this.entity[ent][id].level = level;
            this.entity[ent][id].tick = this.effect[id].tick;
            this.entity[ent][id].over = this.effect[id].over;
        }else{
            this.entity[ent][id] = {};
            this.entity[ent][id].time = time;
            this.entity[ent][id].level = level;
            this.entity[ent][id].tick = this.effect[id].tick;
            this.entity[ent][id].over = this.effect[id].over;
        }
    },
    clear: function(ent, id){
try{
        if(typeof id == "string"){
            this.entity[ent][id].over(parseInt(ent), this.entity[ent][id].level);
            delete this.entity[ent][id];
        }else{
            Entity.clearEffect(ent, id)
        }
}catch(e){
}
    },
    clearAll: function(ent){
        Entity.clearEffects(ent);
        if(this.entity[ent]){
            let effects = Object.keys(this.entity[ent]);
            for(let i in effects){
                let obj = this.entity[ent][effects[i]];
                obj.over(ent, obj.level);
            }
            this.entity[ent] = {};
        }
    },
    getLevel(ent, id){
        try{
        return this.entity[ent][id].level;
        }catch(e){
        return 0;
        }
    },
    getEntity: function (ent){
        return this.entity[ent] || {};
    }
};
Callback.addCallback("tick", function(){
    
    let ents = Object.keys(EffectAPI.entity);
    for(let i in ents){
        let effects = Object.keys(EffectAPI.entity[ents[i]]);
        for(let e in effects){
            let obj = EffectAPI.entity[ents[i]][effects[e]];
            obj.time--;
            obj.tick(parseInt(ents[i]), obj.time, obj.level);
            if(obj.time <= 0){
                obj.over(parseInt(ents[i]), obj.level)
                EffectAPI.clear(ents[i], effects[e]);
            }
        }
    }
    
});
EffectAPI.register({
    id: "dead",
    tick: function(ent, time, level){
        
    }
});
EffectAPI.register({
    id: "magic",
    tick: function(ent, time, level){
        
    }
});
EffectAPI.register({
    id: "noy_magic",
    tick: function(ent, time, level){
        
    }
});
EffectAPI.register({
    id: "noy_magic_immunity",
    tick: function(ent, time, level){
        
    }
});
EffectAPI.register({
	id: "aspects",
	tick(ent, time, level){
		if(MagicCore.isClass(ent)){
			let obj = MagicCore.getValue(ent);
			let r = Math.floor(Math.random()*(1*level));
			if(obj.aspects + r <= obj.aspectsNow) 
				obj.aspects += r;
			MagicCore.setParameters(ent, obj);
		}
	}
});
EffectAPI.register({
    id: "fly",
    tick: function(ent, time, level){
        PlayerAC.setFly(ent, true);
    },
    over: function(ent, level){
        PlayerAC.setFly(ent, false);
    }
});




// file: core/PotionAPI.js

let Potion = {
	mathColorPotion(items){
		let color = {
			r: 0,
			g: 180,
			b: 244
		};
		for(let i in items){
			let prot = this.getPrototype(items[i].id);
			color.r += prot.color.r;
			color.g += prot.color.g;
			color.b += prot.color.b;
		}
		return color;
	},
    potions: {},
    potionsType: {},
    setPrototype(obj){
    	obj.color = obj.color || {};
    	obj.color.r = obj.color.r || 0;
    	obj.color.g = obj.color.g || 0;
    	obj.color.b = obj.color.b || 0;
    	obj.type = obj.type || "ingredient";
    	obj.setFunction = obj.setFunction || function(){}
    	this.potions[obj.id] = obj;
    },
    getPrototype(id){
    	return this.potions[id] || {id:-1};
    },
    registerPotionType(type, obj){
    	this.potionsType[type] = obj;
    },
	run(player, item){
		Entity.setCarriedItem(player, ItemID.aw_bottle_empty, 1, 0);
		let ingredients = Wands.getArrByExtra(item.extra);
		let protEventI;
		for(let i in ingredients){
			let prot = Potion.getPrototype(ingredients[i].id)
			if(prot.type == "event" || i){
				if(prot.type == "event")
					protEventI = i;
				let ents = Potion.getPrototype(ingredients[protEventI].id).getEntitys(item, player, i, ingredients)
				//if(i+1 <= ingredients.length-1){
					//i++;
					for(let e in ents){
						prot = Potion.getPrototype(ingredients[i].id)
						prot.setFunction({
							i: i,
							ingredients: ingredients,
							player: player,
							entity: ents[e],
							potion: item,
							item: ingredients[i],
							getLevel(){
								let count = 0;
								for(let a = i;a < ingredients.length;a++){
									let protUpdate = Potion.getPrototype(ingredients[a].id)
									if(protUpdate.level)
										count+=protUpdate.level;
									if(protUpdate.type == "power")
										a = ingredients.length;
								}
								return count;
							},
							getTime(){
								let count = 0;
								for(let a = i;a < ingredients.length;a++){
									let protUpdate = Potion.getPrototype(ingredients[a].id)
									if(protUpdate.time)
										count+=protUpdate.time;
									if(protUpdate.type == "power")
										a = ingredients.length;
									}
								return count;
							}
						})
				//	}
				}
			}
		}
	},
	isIngredient(item){
		return !!Potion.getPrototype(item.id).type;
	},
	isIngredientInstallation(coords, item, player, arr){
		return Potion.potionsType[Potion.getPrototype(item.id).type].installation(coords, item, player, arr);
	}
};




// file: core/WandAPI.js

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
      name = name + "\n " + Translation.translate(Item.getName(item.extra.getInt("event", 0), item.data));
      let spells = Wands.getArrByExtra(item.extra);
      for(let i in spells){
      	name = name + "\n " + Wands.getPrototype(spells[i].id).getName(Translation.translate(Item.getName(spells[i].id, spells[i].data)), item, spells[i]);
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
				if(event.event!= name)
					return;
				if(extra.getInt("event", 0)==0){
        	PlayerAC.message(player, Translation.translate("aw.message.use_empty"));
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
        			PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", prot.scrutiny.name]]));
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
        			return TranslationLoad.get("aw.message.wand", [["name", name], ["value", obj[name] - (bonus[name]||0)], ["scroll", Item.getName(spells[i].id)]]);
        		})
        		}
        	}else{
        		PlayerAC.message(player, TranslationLoad.get("aw.message.wand.not_compatible_with", [["event", Item.getName(extra.getInt("event", 0))],["scroll", Item.getName(spells[i].id)]]));
        	}
        }
        if(spells.length == 0){
        	PlayerAC.message(player, Translation.translate("aw.message.use_empty"));
        }
        
        delete players_use_wand[player];
			}else{
      	PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", wand.scrutiny.name]]));
			}
		}
		}catch(e){
			alert(e)
			Logger.LogError(e);
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
var ProjectTile = {
    reg: function(name){
        return new GameObject("ProjectID"+name, {
            init: function(player, part, vec, pos){
                this.player = player;
                this.pos = pos;
                this.vec = vec;
                this.vec.x/=2;
                this.vec.y/=2;
                this.vec.z/=2;
                this.part = part;
                this.time = 0;
            },
            update: function(){
                this.pos.x += this.vec.x;
                this.pos.y += this.vec.y;
                this.pos.z += this.vec.z;
                Mp.spawnParticle(this.part, this.pos.x, this.pos.y, this.pos.z, 0, 0, 0);
                let ents = Entity.getAllInRange(this.pos, 2);
                for(let i in ents){
                    if(this.player != ents[i]){
                        MagicCore.damage(ents[i], "magic", 8);
                    }
                }
                let block = BlockSource.getDefaultForActor(this.player).getBlock(this.pos.x, this.pos.y, this.pos.z);
                if(block.id != 0){
                    this.destroy();
                }else if(!World.canTileBeReplaced(block.id, block.data)){
                    this.destroy();
                }
                this.time++;
                if(this.time >= 150){
                    this.destroy();
                }
            }
        });
    },
    regStarfall: function(name){
        return new GameObject("ProjectID"+name, {
            init: function(player, part, vec, pos){
                this.player = player;
                this.pos = pos;
                this.vec = vec;
                this.vec.x/=2;
                this.vec.y/=2;
                this.vec.z/=2;
                this.part = part;
                this.time = 0;
            },
            update: function(){
                this.pos.x += this.vec.x;
                this.pos.y += this.vec.y;
                this.pos.z += this.vec.z;
                Mp.spawnParticle(this.part, this.pos.x, this.pos.y, this.pos.z, 0, 0, 0);
                let ents = Entity.getAllInRange(this.pos, 2);
                for(let i in ents){
                    if(this.player != ents[i]){
                        MagicCore.damage(ents[i], "magic", 10);
                    }
                }
                let block = BlockSource.getDefaultForActor(this.player).getBlock(this.pos.x, this.pos.y, this.pos.z);
                if(block.id != 0){
                    for(let i = 0;i <= 13;i++){
                        ents = Entity.getAllInRange(this.pos, 10);
                        for(let i in ents){
                            if(this.player != ents[i]){
                                MagicCore.damage(ents[i], "magic", 20);
                            }
                        }
                         ParticlesAPI.spawnCircle(ParticlesAPI.part2, this.pos.x, this.pos.y+(0.2*i)+1, this.pos.z, i / 1.3, 11 * i, 2);
                    }
                    this.destroy();
                }else if(!World.canTileBeReplaced(block.id, block.data)){
                    for(let i = 0;i <= 13;i++){
                        ents = Entity.getAllInRange(this.pos, 10);
                        for(let i in ents){
                            if(this.player != ents[i]){
                                MagicCore.damage(ents[i], "magic", 40);
                            }
                        }
                         ParticlesAPI.spawnCircle(ParticlesAPI.part3, this.pos.x, this.pos.y+(0.2*i)+1, this.pos.z, i / 1.3, 11 * i, 2);
                    }
                    this.destroy();
                }
                this.time++;
                if(this.time >= 150){
                    this.destroy();
                }
            }
        });
    }
};
let part = ProjectTile.reg("fire-project");
let starfall = ProjectTile.regStarfall("starfall-project");




// file: core/WandHelper.js

function Scrutiny(window, tab, name){
	this.window = window;
	this.tab = tab;
	this.name = name;
}

function Wand(id, texture, meta){
	this.id = id;
	this.time = 20;
	this.texture = {name: texture, meta: meta};
	
	this.setBonus = function(bonus){
		this.bonus = bonus;
		return this;
	}
	this.setTexture = function(name, meta){
		this.texture = {name: name, meta: meta};
		return this;
	}
	this.setSound = function(sound){
		this.sound = sound;
		return this;
	}
	this.setScrutiny = function(scrutiny){
		this.scrutiny = scrutiny;
		return this;
	}
	this.setTime = function(time){
		this.time = time;
		return this;
	}
	this.setScrollMax = function(max){
		obj.scroll_max = max;
		return this;
	}
	this.register = function(){
		Wands.addStick(this);
		return this;
	}
}

function ScrollBase(id){
	this.installation = function(player, item){
		delItem(player, item);
	}
	this.compatibility = [];
	this.setCompatibility = function(compatibility){
		this.compatibility = compatibility;
		return this;
	}
	this.setFunction = function(){}
	this.setUse = function(func){
		this.setFunction = func;
		return this;
	}
	this.setActivate = function(activate){
		this.activate = activate;
		return this;
	}
	this.setScrutiny = function(scrutiny){
		this.scrutiny = scrutiny;
		return this;
	}
	this.register = function(){
		Wands.setPrototype(id, this);
		return this;
	}
}

function Scroll(id){
	ScrollBase.call(this, id);
	this.type = "function";
}

function ScrollEvent(id){
	ScrollBase.call(this, id);
	this.type = "event";
	this.setUse = function(func){
		this.using = func;
	}
}




// file: core/RitualsAPI.js

var RitualAPI = {
	pedestals: [],
	addPedestal(id){
		this.pedestals.push(id);
	},
	isRecipe(recipeInput, r){
		recipe = r.slice(0);
		if(recipeInput.length != recipe.length)
			return false;
		for(let i in recipeInput){
			if(recipe.indexOf(recipeInput[i]) == -1)
				return false 
			else
				recipe[recipe.indexOf(recipeInput[i])] = -1;
		}
		return true;
	},
	recipes: {},
	isRitual(name, stru, x, y, z, region){
		let keys = Object.keys(this.recipes[name]);
		let arr = this.getRecipeRitualWorld(stru, x, y, z, region);
		for(let i in keys){
			if(this.isRecipe(arr, this.recipes[name][keys[i]].recipe))
				return {value: true, name: keys[i], parameters: this.recipes[name][keys[i]].parameters};
		}
		return {value: false, name: "", parameters: {}};
	},
	addRecipe(name, recipeName, arr, result, parameters, partsType, prot){
		result = result || {};
		result.id = result.id || 0;
		recipeName = recipeName || result.id;
		result.data = result.data || 0;
		result.count = result.count || 1;
		result.extra = result.extra || null;
		prot = prot || this.prot[name] || {};
		if(!this.recipes[name]) this.recipes[name] = {};
		this.recipes[name][recipeName] = {recipe: arr, result: result, parameters: parameters||{}, partsType:partsType||["default"], getResult: prot.getResult||function(tile, coords, result){return result;}, isStartRitual: prot.isStartRitual||function(){return false;}, isClear: prot.isClear||function(){return true;}, getParameters: prot.getParameters || function(tile, coords, parameters){return parameters;}, update: prot.update || 50};
	},
	add(name, arr, result, parameters, partsType, prot){
		this.addRecipe(name, null, arr, result, parameters, partsType, prot);
	},
	getRecipeRitualWorld(name, x, y, z, region){
		let stru = Structure.getStructure(name);
		let arr = [];
		for(let i in stru){
			let obj = stru[i];
			if(obj.x+"."+obj.y+"."+obj.z != "0.0.0")
				if(this.pedestals.indexOf(region.getBlockId(obj.x+x,obj.y+y,obj.z+z)) != -1){
					World.addTileEntity(obj.x+x,obj.y+y,obj.z+z, region);
					if(World.getTileEntity(obj.x+x,obj.y+y,obj.z+z, region).data.item.id != 0)
						arr.push(World.getTileEntity(obj.x+x,obj.y+y,obj.z+z, region).data.item.id);
				}else if(region.getBlockId(obj.x+x,obj.y+y,obj.z+z)!=obj.state.id){
					return [];
				}
		}
		return arr;
	},
	clear(name, x, y, z, region){
		let stru = Structure.getStructure(name);
		for(let i in stru){
			let obj = stru[i];
			if(obj.x+"."+obj.y+"."+obj.z != "0.0.0"){
				if(this.pedestals.indexOf(region.getBlockId(obj.x+x,obj.y+y,obj.z+z)) != -1){
					let tile = World.getTileEntity(obj.x+x,obj.y+y,obj.z+z, region);
					let item = tile.getItem();
					item.count--;
					tile.setItem(item);
					//.destroyAnimation();
				}		
			}
		}
	},
	partType: {},
	registerEffectType(type, func, time){
		this.partType[type] = {
			func: func,
			time: time || 0
		};
	},
	setRecipeEffect(ritualName, recipeName, arr){
		RitualAPI.recipes[ritualName][recipeName].partsType = arr;
	},
	playPartTypes(arr, packet){
		let time = 0
		for(let i in arr){
			setTimeout(function(){
				RitualAPI.partType[arr[i]].func(packet)
			}, time);
			time+=this.partType[arr[i]].time;
		}
   return time;
	},
	check(name, stru, coords, player, region){
		let ritual = RitualAPI.isRitual(name, stru, coords.x,coords.y,coords.z, region);
		if(!World.getTileEntity(coords.x,coords.y,coords.z, region) || !ritual.value)
			return;
		let tile = World.getTileEntity(coords.x,coords.y,coords.z, region);
		let obj = RitualAPI.recipes[name][ritual.name];
		let parameters = obj.getParameters(tile, coords, obj.parameters, player, region);
		let is = AncientWonders.isParameters(player, parameters);
		if((tile.data.item.id == 0 || obj.isStartRitual(tile, coords, player, region)) && is){
			let c = MagicCore.getValue(player);
			c.aspects -= parameters.aspects||0;
			MagicCore.setParameters(player, c, obj.update);
			if(obj.isClear(tile, coords, player, region))
				RitualAPI.clear(stru, coords.x,coords.y,coords.z, region);
			tile.blocking = true;
			let result = obj.getResult(tile, coords, obj.result, player, region);
			let time = RitualAPI.playPartTypes(obj.partsType, {
				coords: coords,
				player: player
			});
			setTimeout(function(){
				tile.blocking = false;
				World.getTileEntity(coords.x,coords.y,coords.z, region).setItem(result);
			}, time);
		}else if(!is){
			AncientWonders.message(player, parameters)
		}
	},
	prot: {},
	register(name, rv, prot){
		this.prot[name] = prot;
		if(!this.recipes[name]) this.recipes[name] = {};
		if(rv.enable || rv.enable === undefined) Callback.addCallback('ModsLoaded', function(){
		ModAPI.addAPICallback("RecipeViewer", function(api){
			var RVTypeAW = (function(_super){
  			__extends(RVTypeAW, _super);
  		  function RVTypeAW(nameRv, icon, key, content){
     		 let _this = _super.call(this, nameRv, icon, content) || this;
      		_this.ritualKey = key;
     		 return _this;
   		 }
  		  RVTypeAW.prototype.getAllList = function() {
    			let list = [];
    			let keys = Object.keys(RitualAPI.recipes[this.ritualKey]);
      		for(let i in keys) {
      			let obj = RitualAPI.recipes[this.ritualKey][keys[i]];
      			let input = [];
      			for(let ii in obj.recipe){
      				input.push({id:obj.recipe[ii],data:0,count:1});
      			}
      			let tips = "";
      			for(let key in obj.parameters)
      				tips += "\n"+key+" - "+obj.parameters[key];
       		 list.push({
        			input: input,
         		 output: [{id: obj.result.id,data: obj.result.data,count: obj.result.count, tips: tips}]
        		});
      		}
      		return list;
   		 };
   		 RVTypeAW.prototype.slotTooltip = function(name, item, tips){
   		 	return name+(tips||"");
   		 }
    		return RVTypeAW;
  		}(api.RecipeType));
  		api.RecipeTypeRegistry.register(name, new RVTypeAW(rv.title, rv.block || BlockID.rityalPedestal, name, rv.content));
  		});
		});
		Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
			let region = BlockSource.getDefaultForActor(player);
			if(item.id == ItemID.bookk && RitualAPI.pedestals.indexOf(block.id) != -1){
				RitualAPI.check(name, rv.stru, coords, player, region);
			}
		});
	}
};




// file: core/SingularityAPI.js

function angleFor2dVector(x1, y1, x2, y2){
	let v = Math.acos((x1*x2+y1*y2) / (Math.sqrt(x1 * x1 + y1 * y1)*Math.sqrt(x2 * x2 + y2 * y2)))
	return isNaN(v) ? 0 : v;
}

function angleFor3dVector(x1, y1, z1, x2, y2, z2){
	let v = Math.acos((x1*x2+y1*y2+z1*z2) / (Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1)*Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2)));
	return isNaN(v) ? 0 : v;
}

//r - радиус
//i - индекс
//n - количество точек

function getPosPolygon(r, i, n){
	let fraction = (2 * Math.PI * i) / n;
	return {
		x: r * Math.cos(fraction),
		y: r * Math.sin(fraction)
	}
}

const step = 30;
const polygon_count = 20;

const points_polygon = (function(){
	let points = [];
		
	for(let p = 0;p <= polygon_count;p++)
		points.push(getPosPolygon(.05, p, polygon_count));
		
	return points;
})();
const index_pre = polygon_count-1;

function buildLineMesh(x1, y1, z1, x2, y2, z2){
	const mesh = new RenderMesh();
	
	const dx = x2-x1;
	const dy = y2-y1;
	const dz = z2-z1;
	
	const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
	
	const move = radius/step;
	let vz = 0;
	
	for(let i = 0;i < step;i++){
		let post = vz + move;
		
		let pos = points_polygon[0];
		mesh.addVertex(pos.x, pos.y, vz);
		mesh.addVertex(pos.x, pos.y, post);
		
		for(let p = 1;p < polygon_count;p++){
			let pos = points_polygon[p];
			
			mesh.addVertex(pos.x, pos.y, vz);
			mesh.addVertex(pos.x, pos.y, post);
			
			if((p+1) % 2 == 0){
				mesh.addVertex(pos.x, pos.y, vz);
				pos = points_polygon[p-1];
				mesh.addVertex(pos.x, pos.y, post);
			}else{
				let pre_pos = points_polygon[p-1];
				mesh.addVertex(pre_pos.x, pre_pos.y, vz);
					
				mesh.addVertex(pre_pos.x, pre_pos.y, vz);
				mesh.addVertex(pre_pos.x, pre_pos.y, post);
				mesh.addVertex(pos.x, pos.y, post);
				
				mesh.addVertex(pos.x, pos.y, vz);
				mesh.addVertex(pos.x, pos.y, post);
			}
		}
		
		let pre_pos = points_polygon[index_pre];
		pos = points_polygon[polygon_count];
		
		mesh.addVertex(pos.x, pos.y, vz);
		mesh.addVertex(pos.x, pos.y, post);
		mesh.addVertex(pre_pos.x, pre_pos.y, vz);
					
		mesh.addVertex(pre_pos.x, pre_pos.y, vz);
		mesh.addVertex(pre_pos.x, pre_pos.y, post);
		mesh.addVertex(pos.x, pos.y, post);
		
		vz = post;
	}
	
	const angleXZ = angleFor2dVector(0, radius, dx, dz);
	
	if(dx == 0 && dz == 0)
		var angleY = Math.PI/2;
	else
		var angleY = angleFor3dVector(dx, 0, dz, dx, dy, dz);
	
	mesh.rotate(0 < y2-y1 ? -angleY : angleY, 0 < x2-x1 ? -angleXZ : angleXZ, 0);
	mesh.translate(x1, y1, z1);
	
	return mesh;
}

let SingularityLines = {
	lines: {},
	
	buildKey(x1, y1, z1, x2, y2, z2){
		return x1+":"+y1+":"+z1+":"+x2+":"+y2+":"+z2;
	},
	
	add(x1, y1, z1, x2, y2, z2){
		let key = this.buildKey(x1-.5, y1-.5, z1-.5, x2-.5, y2-.5, z2-.5);
		let obj = {visibility: false, mesh: buildLineMesh(x1, y1, z1, x2, y2, z2), key: key}
		this.lines[key] = obj;
		return obj;
	},
	
	can(key){
		return !!this.lines[key];
	},
	
	remove(key){
		delete this.lines[key];
	},
	
	setVisibility(key, value){
		if(this.lines[key])
			this.lines[key].visibility = value;
	},
	
	animation: new Animation.Base(0, 0, 0),
	mesh: new RenderMesh(),
	
	update(){ 
		this.mesh.clear();
		let i = 0;
		for(let key in this.lines){
			let obj = this.lines[key];
			if(obj.visibility){
				this.mesh.addMesh(obj.mesh, 0, 0, 0);
				i++;
			}
		}
		this.animation.describe({
			mesh: this.mesh,
			material: "aspects_transfer_aw"
		});
		
		this.animation.load();
	},
	Client(){
		let lines = [];
		let lines_ = {};
		
		this.events = {
			addLine(data){
				let line = SingularityLines.add(this.x+.5, this.y+.5, this.z+.5, data.x+.5, data.y+.5, data.z+.5);
				lines.push(line);
				lines_[line.key] = line;
			},
			visibility(data){
				for(let i in data.lines){
					let pos = data.lines[i];
					lines_[SingularityLines.buildKey(this.x, this.y, this.z, pos.x, pos.y, pos.z)].visibility = data.status;
				}
				SingularityLines.update();
			}
		}
		
		this.unload = function(){
			for(let i in lines)
				SingularityLines.remove(lines[i].key);
		}
	},
	
	addLineForTile(tile, x, y, z){
		tile.networkEntity.send("addLine", {x: x, y: y, z: z});
	},
	
	visibilityLineForTile(tile, lines){
		tile.networkEntity.send("visibility", {lines: lines, status: true});
	},
	
	hidenLineForTile(tile, lines){
		tile.networkEntity.send("visibility", {lines: lines, status: false});
	}
};

/*let coords_item_use = [0, 0, 0];
let first = true;
let animation_ = new Animation.Base(0, 0, 0);

Callback.addCallback("ItemUse", function(coords, item, block, is, player){
	if(item.id != 263) return;
	
	if(first){
		coords_item_use = coords;
		first = false;
	}else{
		let mesh = buildLineMesh(coords_item_use.x+.5, coords_item_use.y+.5, coords_item_use.z+.5, coords.x+.5, coords.y+.5, coords.z+.5);
		
		animation_.describe({
			mesh: mesh,
			material: "aspects_transfer_aw"
		});
		animation_.load();
		
		first = true;
	}
});*/

const base_transfer = function(output, tile){
//	let angle = Entity.get
	//if(World.getThreadTime() % 20 == 0)
		//ParticlesAPI.spawnLine(ParticlesAPI.part2, tile.x, tile.y, tile.z, output.x, output.y, output.z, 15, tile.dimension);
}
let SingularityAPI = {
	input: {},
	output: {},
	
	setBlockInputName: function(id, name, bool){
		this.input[name] = this.input[name] || {};
		this.input[name][id] = bool;
	},
	setBlockOutputName: function(id, name, bool){
		this.output[name] = this.output[name] || {};
		this.output[name][id] = bool;
	},
	
	isInputs(name, id){
		return this.input[name] && this.input[name][id];
	},
	isOutputs(name, id){
		return this.output[name] && this.output[name][id];
	},
	
	getTiles(arr, region){
		let tiles = [];
		for(let i in arr){
			let tile = World.getTileEntity(arr[i].x, arr[i].y, arr[i].z, region);
			if(!tile) tile = World.addTileEntity(arr[i].x, arr[i].y, arr[i].z, region)
			tiles.push(tile);
		}
		return tiles;
	},
	transfersBlock(tile, tiles, value, func){
		if(tile.data.aspect - value > 0 && tiles && tiles.blockSource && tiles.data.aspect+value <= tiles.data.aspectMax){
			tile.data.aspect-=value;
			tiles.data.aspect+=value;
			
			func(tiles, tile);
			return true;
		}
		return false;
	},
	
	init(tile){
		let arr = tile.data.arr || [];
		for(let i in arr){
			let pos = arr[i];
			SingularityLines.addLineForTile(tile, pos.x, pos.y, pos.z);
		}
	}, 
	
	transfers(tile, value, func){
		let arr = tile.data.arr || [];
		value /= arr.length;
		
		let visilibity = [];
		let hiden = [];
		
		for(let i in arr){
			let pos = arr[i];
			
			if(this.transfersBlock(tile, World.getTileEntity(pos.x, pos.y, pos.z, tile.blockSource), value, func))
				visilibity.push(pos);
			else
				hiden.push(pos);
		}
		
		if(World.getThreadTime() % 20 == 0){
			SingularityLines.visibilityLineForTile(tile, visilibity);
			SingularityLines.hidenLineForTile(tile, hiden);
		}
	},
	
	click(tile, coords, player){
		tile.data.arr = tile.data.arr || []
		let pos = SingularityAPI.itemUse(player, Entity.getCarriedItem(player), tile.blockID, 3, coords, true);
		if(!pos) 
			return;
			
		for(let i in tile.data.arr){
			let pos_ = tile.data.arr[i];
			if(pos_.x == pos.x && pos_.y == pos.y && pos_.z == pos.z)
				return;
		}
		
		SingularityLines.addLineForTile(tile, pos.x, pos.y, pos.z);
		tile.data.arr.push(pos);
	},
	
	getDistante(p1, p2){
		return Math.sqrt(Math.pow(p1.x+.5 - p2.x+.5, 2) + Math.pow(p1.y+.5 - p2.y+.5, 2) + Math.pow(p1.z+.5 - p2.z+.5, 2));
	},
	
	itemUse(player, item, block, count, coords, bool){
		bool = bool || false;
		let region = BlockSource.getDefaultForActor(player);
		if(!Entity.getSneaking(player) && item.id == ItemID.staff_singularity && this.isOutputs("base", block)){
			item.extra = item.extra || new ItemExtraData();
			let pos = {
				x: item.extra.getInt("x", 0),
				y: item.extra.getInt("y", 0),
				z: item.extra.getInt("z", 0)
			};
			if(this.getDistante(pos, coords) > count || !this.isInputs("base", region.getBlockId(pos.x, pos.y, pos.z))){
				Mp.tipMessage(player, TranslationLoad.get("aw.tip_message.binding_staff_singularity_error", [["value", count]]));
				return null;
			}
			if(bool)
				Mp.tipMessage(player, Translation.translate("aw.tip_message.binding_staff_singularity"))
			return pos;
		}
		return null;
	}
};




// file: core/ScrutinyGeneration.js

let arrScrut = [];
let ScrutinyGeneration = {
	scrutinys: [],
	add(window, tab, name, name2, chance){
		arrScrut.push({
			win: window,
			tab: tab,
			name: name,
			name2: name2,
			chance: chance
		});
	},
	del(window, tab, name){
		for(let i in arrScrut){
			let obj = arrScrut[i];
			if(obj.win==window && obj.tab==tab && obj.name == name){
				arrScrut.slice(i, i);
				return;
			}
		}
	},
	get(random){
		random = random || new java.util.Random();
		while(true){
			for(let i in arrScrut){
				let obj = arrScrut[i];
				if(random.nextFloat() <= obj.chance)
					return obj;
			}
		}
	}
};




// file: core/ProjectTile.js

/*Network.addClientPacket("client.emitter", function(packet){
//try{
	if(Player.getDimension() != packet.dim)
		return;
	let emitter = ProjectTile.allEmitter[packet.id];
	if(!emitter){
		emitter = new Particles.ParticleEmitter(packet.x, packet.y, packet.z);
		ProjectTile.allEmitter[packet.id] = emitter;
		emitter.setEmitRelatively(true);
		emitter.emit(packet.part, 0, 0, 0, 0);
	}
	emitter.moveTo(packet.pos.x,packet.pos.y,packet.pos.z);
//}catch(e){}
});
Network.addClientPacket("client.emitter.end", function(p){
	if(ProjectTile.allEmitter[p.id])
		delete ProjectTile.allEmitter[p.id];
});*/
Network.addClientPacket("client.project_tile.spawn", function(data){
	if(Player.getDimension() != data.dim)
		return;
	let project_tile = ProjectTile.all[data.name];
	project_tile.spawnClient(data.part, data.x, data.y, data.z, data.ax, data.ay, data.az, data.duration);
});
let ProjectTile = {
	getMilliseconds(tick){
		return (tick/20)*1000;
	},
	allEmitter: {},
	all: {},
	
	create(name, func){
		func = func || function(){};
		let clientFunc = function(){};
		let endServer = function(){};
		let endClient = function(){};
		
		this.setServerLogic = function(func_){
			func = func_;
			return this;
		}
		
		this.setEndServerLogic = function(end){
			endServer = end;
			return this;
		}
		
		this.setEndClientLogic = function(end){
			endClient = end;
			return this;
		}
		
		this.setClientLogic = function(func_){
			clientFunc = func_;
			return this;
		}
		
		ProjectTile.all[name] = this;
		this.spawn = function(part, x, y, z, ax, ay, az, player, region, duration){
			ax = ax*120;
			ay = ay*120;
			az = az*120;
			
			let dimension = Entity.getDimension(player);
			Network.sendToAllClients("client.project_tile.spawn", {
				dim: dimension,
				name: name,
				part: part,
				x: x,
				y: y,
				z: z,
				ax: ax,
				ay: ay,
				az: az,
				duration: duration
			});
			let posEnd;
			let time_tick = duration / 1000 * 20;
			Updatable.addUpdatable({
				tick: 0,
				cancel(){
					this.remove = true;
					endServer(region, player, posEnd, this);
				},
				update(){
					if(this.tick <= time_tick){
						let v = this.tick / time_tick;
						let pos = {
							x: x+(ax*v),
							y: y+(ay*v),
							z: z+(az*v)
						};
						if(!region.isChunkLoadedAt(pos.x, pos.z)){
							this.remove = true;
							endServer(region, player, posEnd, this);
							return;
						}
						posEnd = pos;
						if(!World.canTileBeReplaced(region.getBlockId(pos.x,pos.y,pos.z), region.getBlockData(pos.x,pos.y,pos.z))){
							this.remove = true;
							endServer(region, player, posEnd, this);
							return;
						}
						func(region, pos, player, this, v);
						
						this.tick++;
					}else{
						this.remove = true;
						endServer(region, player, posEnd, this);
					}
				}
			});
		}
		this.spawnClient = function(part, x, y, z, ax, ay, az, duration){
			ax = ax;
			ay = ay;
			az = az;
			part = typeof part == "number" ? part : ParticlesStorage.get(part);
			let emitter = new Particles.ParticleEmitter(x, y, z);
			emitter.setEmitRelatively(true);
			emitter.emit(part, 0, 0, 0, 0);
			
			let posEnd;
			let region = BlockSource.getCurrentClientRegion();
			let player = Player.get();
			
			let animation = createAnimation(duration, function(v, anim){
				let pos = {
					x: x+(ax*v),
					y: y+(ay*v),
					z: z+(az*v)
				};
				if(!region.isChunkLoadedAt(pos.x, pos.z)){
					anim.cancel();
					return;
				}
				posEnd = pos;
				emitter.moveTo(pos.x,pos.y,pos.z);
				if(!World.canTileBeReplaced(region.getBlockId(pos.x,pos.y,pos.z), region.getBlockData(pos.x,pos.y,pos.z)))
					anim.cancel();
				clientFunc(region, pos, player, anim, v);
			});
			animation.addListener({
				onAnimationEnd(){
					endClient(region, player, posEnd, animation);
					emitter.release();
				}
			});
		}
	},
	damageToProjectTile(pos, attacker, type, damage, range, func){
		func = func || function(){};
		let ents = Entity.getAllInRange(pos, range||1.5);
		let dimension = Entity.getDimension(attacker);
		for(let i in ents){
			let ent = ents[i];
			if(attacker != ent && Entity.getDimension(ent) == dimension){
				MagicCore.damage(ent, type, damage);
				func(ent);
			}
		}
	}
};

let ProjectTileFire = new ProjectTile.create("fire")
	.setServerLogic(function(region, pos, player){
		ProjectTile.damageToProjectTile(pos, player, "magic", 8, 1);
	});


let ProjectTileStarfall = new ProjectTile.create("starfall")
	.setServerLogic(function(region, pos, player){
		ProjectTile.damageToProjectTile(pos, player, "magic", 10);
	})
	.setEndServerLogic(function(region, player, pos){
		ProjectTile.damageToProjectTile(pos, player, "magic", 20, 10);
	})
	.setEndClientLogic(function(region, player, pos){
		for(let i = 0;i < 14;i++)
			ParticlesAPI.spawnCircleClient(ParticlesType.part2, pos.x, pos.y+(0.2*i)+1, pos.z, i / 1.3, 11 * i, 2);
	});


let ProjectTileSnow_1 = new ProjectTile.create("snow_1")
	.setServerLogic(function(region, pos, player){
		ProjectTile.damageToProjectTile(pos, player, "magic", 20, 1.5, function(ent){
			Entity.addEffect(ent, Native.PotionEffect.movementSlowdown , 0, 50, 1, true, false);
			if(EffectAPI.getLevel(ent, "noy_magic_immunity") <= 0)
				EffectAPI.add(ent, "noy_magic", 60, 1)
		});
	})
	.setClientLogic(function(region, pos){
		Particles.addParticle(ParticlesType.snow, pos.x+(Math.random()-Math.random()), pos.y+(Math.random()-Math.random()), pos.z+(Math.random()-Math.random()), 0, 0, 0);
	});


let BOOM = new ProjectTile.create("boom")
	.setServerLogic(function(region, pos, player){
		ProjectTile.damageToProjectTile(pos, player, "magic", 4);
	})
	.setClientLogic(function(region, pos){
		Particles.addParticle(ParticlesType.project, pos.x+(Math.random()-Math.random()), pos.y+(Math.random()-Math.random()), pos.z+(Math.random()-Math.random()), 0, 0, 0);
	});
	
	
	
function spawnPizdes(pos, region, player){
	let count = Math.floor(Math.random()*15)+15;
	for(let i = 0;i < count;i++){
		BOOM.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, player, region, ProjectTile.getMilliseconds(100));
	}
}
let ProjectTileFireBoom = new ProjectTile.create("fire_boom")
	.setServerLogic(function(region, pos, player, anim){ 
		ProjectTile.damageToProjectTile(pos, player, "magic", 5, 1.5, function(ent){
			anim.cancel();
		});
	})
	.setEndServerLogic(function(region, player, pos){
		spawnPizdes(pos, region, player);
	});
/*let ProjectTileFireBoom = new ProjectTile.create("fire_boom", function(region, pos, player, anim, v){
	let ents = Entity.getAllInRange(pos, 1.5);
	for(let i in ents)
		if(player != ents[i]){
			let ent = ents[i];
			MagicCore.damage(ent, "magic", 5);
			spawnPizdes(pos, region, player);
			anim.cancel();
		}
		
	let block = region.getBlock(pos.x, pos.y, pos.z);
	if((block.id != 0 || !World.canTileBeReplaced(block.id, block.data))||v == 1){
		spawnPizdes(pos, region, player);
		anim.cancel();
	}
});*/




// file: items/item.js

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
            PlayerAC.message(player, Translation.translate("aw.message.cannot_class"));
        }
        }else{
            PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", "classMage"]]));
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
            PlayerAC.message(player, Translation.translate("aw.message.cannot_class"));
        }
        }else{
            PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", "classWarrior"]]));
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
            PlayerAC.message(player, Translation.translate("aw.message.cannot_class"));
        }
        }else{
            PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", "classNecromancer"]]));

        }
    }
});

IDRegistry.genItemID("pelmeni"); 
Item.createFoodItem("pelmeni", "aw.item.pelmeni", {name: "dumplings", meta: 0}, {stack: 16, food: 10, isTech: true});

IDRegistry.genItemID("staff_singularity"); 
Item.createItem("staff_singularity", "aw.item.staff_singularity", {name: "singularity", meta: 0}, {stack: 1});
IAHelper.makeAdvancedAnim(ItemID.staff_singularity, "singularity", 1, [0, 1, 2, 3]);
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(Entity.getSneaking(player) && item.id==ItemID.staff_singularity){
		item.extra = item.extra || new ItemExtraData()
		item.extra.putInt("x", coords.x);
		item.extra.putInt("y", coords.y);
		item.extra.putInt("z", coords.z);
		Mp.tipMessage(player, Translation.translate("aw.tip_message.staff_singularity"))
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
            PlayerAC.message(player, TranslationLoad.get("aw.message.scrutiny", [["name", item.extra.getString("name2", "name")]]));
        }else{
        	PlayerAC.message(player, TranslationLoad.get("aw.message.scrutiny_give_noy", [["name", item.extra.getString("name2", "name")]]));
        }
    }else if(item.id == ItemID.piece4){
        for(let i in arrScrut){
            ScrutinyAPI.giveScrutiny(player, arrScrut[i].win, arrScrut[i].tab, arrScrut[i].name, false);
        }
        PlayerAC.message(player, Translation.translate("aw.message.scrutiny_all"));
    }
});
Item.addCreativeGroup("scrutiny", Translation.translate("aw.creative_group.scrutiny"), [
	  ItemID.piece4
]);




// file: items/wand.js

IDRegistry.genItemID("acolyteStaff"); 
Item.createItem("acolyteStaff", "aw.item.acolyte_staff", {name: "acolyte_staff", meta: 0}, {stack: 1});

IDRegistry.genItemID("magis_stick"); 
Item.createItem("magis_stick", "aw.item.magic_stick", {name: "magis_stick", meta: 0}, {stack: 1});

IDRegistry.genItemID("magis_stick_2_lvl"); 
Item.createItem("magis_stick_2_lvl", "aw.item.magic_stick_2_lvl", {name: "magis_stick_2_lvl", meta: 0}, {stack: 1});

IDRegistry.genItemID("aw_magic_stick"); 
Item.createItem("aw_magic_stick", "aw.item.aw_magic_stick", {name: "magic_stick", meta: 0}, {stack: 1});

IDRegistry.genItemID("magis_sword"); 
Item.createItem("magis_sword", "aw.item.magic_sword", {name: "magis_sword", meta: 0}, {stack: 1});

ToolAPI.addToolMaterial("aw_magic_sword", {
	durability: 2220,
	level: 3,
	efficiency: 0,
	damage: 2,
	enchantability: 14
});
ToolLib.setTool(ItemID.magis_sword, "aw_magic_sword", ToolType.sword);

IDRegistry.genItemID("magis_sword_2_lvl"); 
Item.createItem("magis_sword_2_lvl", "aw.item.magic_sword_2_lvl", {name: "magis_sword_2_lvl", meta: 0}, {stack: 1});

ToolAPI.addToolMaterial("aw_magic_sword_2", {
	durability: 4220,
	level: 5,
	efficiency: 0,
	damage: 5,
	enchantability: 14
});
ToolLib.setTool(ItemID.magis_sword_2_lvl, "aw_magic_sword_2", ToolType.sword);

IDRegistry.genItemID("aw_magic_shovel"); 
Item.createItem("aw_magic_shovel", "aw.item.magic_shovel", {name: "magic_shovel", meta: 0}, {stack: 1});

ToolAPI.addToolMaterial("aw_magic_shovel", {
	durability: 4220,
	level: 5,
	efficiency: 8,
	damage: 8,
	enchantability: 14
});
ToolLib.setTool(ItemID.aw_magic_shovel, "aw_magic_shovel", ToolType.shovel);

IDRegistry.genItemID("magis_pocox"); 
Item.createItem("magis_pocox", "aw.item.magic_staff", {name: "magis_pocox", meta: 0}, {stack: 1});

IDRegistry.genItemID("magis_pocox_2_lvl"); 
Item.createItem("magis_pocox_2_lvl", "aw.item.magic_staff_2_lvl", {name: "magic_staff_2_lvl", meta: 0}, {stack: 1});

IDRegistry.genItemID("aw_magic_staff"); 
Item.createItem("aw_magic_staff", "aw.item.magic_staff", {name: "magic_staff", meta: 0}, {stack: 1});

IDRegistry.genItemID("aw_dead"); 
Item.createItem("aw_dead", "aw.item.death", {name: "aw_dead", meta: 0}, {stack: 1});
ItemModule.setFireResistant(ItemID.aw_dead, true);
ItemModule.setExplodable(ItemID.aw_dead, true);

ToolAPI.addToolMaterial("godDead", {
    durability: 3000,
    level: 5,
    efficiency: 6,
    damage: 8,
    enchantability: 14
});
ToolLib.setTool(ItemID.aw_dead, "godDead", ToolType.sword);

Item.addCreativeGroup("wand", Translation.translate("aw.creative_group.wand"), [
	  ItemID.acolyteStaff,
	  ItemID.magis_stick,
	  ItemID.magis_stick_2_lvl,
	  ItemID.aw_magic_stick,
	  ItemID.magis_sword,
	  ItemID.magis_sword_2_lvl,
	  ItemID.aw_magic_shovel,
	  ItemID.magis_pocox,
	  ItemID.magis_pocox_2_lvl,
	  ItemID.aw_magic_staff
]);




// file: items/material.js

IDRegistry.genItemID("aw_magic_ingot"); 
Item.createItem("aw_magic_ingot", "aw.item.aw_magic_ingot", {name: "aw_magic_ingot", meta: 0}, {stack: 64});

IDRegistry.genItemID("aw_brain"); 
Item.createItem("aw_brain", "aw.item.brain", {name: "aw_brain", meta: 0}, {stack: 16});

IDRegistry.genItemID("spider_legs"); 
Item.createItem("spider_legs", "aw.item.spider_legs", {name: "spider_legs", meta: 0}, {stack: 64});

IDRegistry.genItemID("aw_mysterious_powder"); 
Item.createItem("aw_mysterious_powder", "aw.item.mysterious_powder", {name: "aw_mysterious_powder", meta: 0}, {stack: 64});

IDRegistry.genItemID("witherbone"); 
Item.createItem("witherbone", "aw.item.witherbone", {name: "witherbone", meta: 0}, {stack: 64});

IDRegistry.genItemID("aw_dragon_powder"); 
Item.createItem("aw_dragon_powder", "aw.item.dragon_powder", {name: "aw_dragon_powder", meta: 0}, {stack: 64});

IDRegistry.genItemID("crystal_powder"); 
Item.createItem("crystal_powder", "aw.item.crystal_powder", {name: "crystal_powder", meta: 0}, {stack: 16});

IDRegistry.genItemID("dead_essence"); 
Item.createItem("dead_essence", "aw.item.dead_essence", {name: "dead_essence", meta: 0}, {stack: 16});


IDRegistry.genItemID("magic_crystal"); 
Item.createItem("magic_crystal", "aw.item.magic_crystal", {name: "magic_crystal", meta: 0}, {stack: 4});

IDRegistry.genItemID("magic_plate");
Item.createItem("magic_plate", "aw.item.magic_plate", {name: "magic_plate", meta: 0}, {stack:4});

Callback.addCallback('EntityDeath', function (entity, attacker, damageType) {
    if(Entity.getTypeName(entity) == "minecraft:zombie<>"){
        let pos = Entity.getPosition(entity);
        if(Math.random()<=0.1){
            BlockSource.getDefaultForActor(entity).spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.aw_brain, 1, 0, null);
        }
    }else if(Entity.getTypeName(entity) == "minecraft:spider<>"){
    	let pos = Entity.getPosition(entity);
        if(Math.random()<=0.1){
            BlockSource.getDefaultForActor(entity).spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.spider_legs, 1, 0, null);
        }else if(Math.random()<=0.1){
        	BlockSource.getDefaultForActor(entity).spawnDroppedItem(pos.x, pos.y, pos.z, ItemID.dead_essence, 1, 0, null);
        }
    }
});




// file: items/armor.js

IDRegistry.genItemID("RobeOfTheAzureWizard");
Item.createArmorItem("RobeOfTheAzureWizard" , "aw.item.RobeOfTheAzureWizard", {name: "RobeOfTheAzureWizard", meta: 0}, {type: "chestplate", armor: 6, durability: 2220, texture: "armor/noy.png"});
MagicCore.setArmor(ItemID.RobeOfTheAzureWizard, "magic", 60, {scrutiny: "RobeOfTheAzureWizard", tab: "riches"});
MagicCore.setArmorMagic(ItemID.RobeOfTheAzureWizard, "magic", 10);


IDRegistry.genItemID("fire_king");
Item.createArmorItem("fire_king", "aw.item.fire_king" , {name: "aw_fire_king", meta: 0}, {type: "helmet", armor: 4, durability: 2775, texture: "armor/noy.png"}); 
MagicCore.setArmor(ItemID.fire_king, "magic", 55, {scrutiny: "fire", tab: "riches"});
MagicCore.setArmorMagic(ItemID.fire_king, "dead", 12);

IDRegistry.genItemID("fire_king_chestplate");
Item.createArmorItem("fire_king_chestplate" , "aw.item.fire_chestplate", {name: "aw_fire_king", meta: 1}, {type: "chestplate", armor: 8, durability: 4102, texture: "armor/noy.png"}); 
MagicCore.setArmor(ItemID.fire_king_chestplate, "magic", 60, {scrutiny: "fire", tab: "riches"});
MagicCore.setArmorMagic(ItemID.fire_king_chestplate, "magic", 8);

IDRegistry.genItemID("fire_king_leggings");
Item.createArmorItem("fire_king_leggings", "aw.item.fire_leggings", {name: "aw_fire_king", meta: 2}, {type: "leggings", armor: 6, durability: 3805, texture: "armor/noy.png"});
MagicCore.setArmor(ItemID.fire_king_leggings, "magic", 58, {scrutiny: "fire", tab: "riches"});
MagicCore.setArmorMagic(ItemID.fire_king_leggings, "magic", 6);

IDRegistry.genItemID("fire_king_boots");
Item.createArmorItem("fire_king_boots", "aw.item.fire_boots", {name: "aw_fire_king", meta: 3}, {type: "boots", armor: 4, durability: 2438, texture: "armor/noy.png"});
MagicCore.setArmor(ItemID.fire_king_boots, "magic", 55, {scrutiny: "fire", tab: "riches"});
MagicCore.setArmorMagic(ItemID.fire_king_boots, "dead", 12);


IDRegistry.genItemID("bandit_helmet");
Item.createArmorItem("bandit_helmet", "aw.item.bandit_helmet" , {name: "bandit", meta: 0}, {type: "helmet", armor: 4, durability: 1775, texture: "armor/noy.png"}); 
MagicCore.setArmor(ItemID.bandit_helmet, "protection", 55, {scrutiny: "bandit", tab: "riches"});
MagicCore.setArmorMagic(ItemID.bandit_helmet, "dead", 12);


IDRegistry.genItemID("bandit_chestplate");
Item.createArmorItem("bandit_chestplate" , "aw.item.bandit_chestplate", {name: "bandit", meta: 1}, {type: "chestplate", armor: 8, durability: 3102, texture: "armor/noy.png"}); 
MagicCore.setArmor(ItemID.bandit_chestplate, "protection", 60, {scrutiny: "bandit", tab: "riches"});
MagicCore.setArmorMagic(ItemID.bandit_chestplate, "magic", 7);

IDRegistry.genItemID("bandit_leggings");
Item.createArmorItem("bandit_leggings", "aw.item.bandit_leggings", {name: "bandit", meta: 2}, {type: "leggings", armor: 6, durability: 2805, texture: "armor/noy.png"});
MagicCore.setArmor(ItemID.bandit_leggings, "protection", 58, {scrutiny: "bandit", tab: "riches"});
MagicCore.setArmorMagic(ItemID.bandit_leggings, "magic", 5);

IDRegistry.genItemID("bandit_boots");
Item.createArmorItem("bandit_boots", "aw.item.bandit_boots", {name: "bandit", meta: 3}, {type: "boots", armor: 4, durability: 1438, texture: "armor/noy.png"});
MagicCore.setArmor(ItemID.bandit_boots, "protection", 55, {scrutiny: "bandit", tab: "riches"});
MagicCore.setArmorMagic(ItemID.bandit_boots, "dead", 12);


IDRegistry.genItemID("necromancer_helmet");
Item.createArmorItem("necromancer_helmet", "aw.item.necromancer_helmet" , {name: "necromancer", meta: 0}, {type: "helmet", armor: 4, durability: 1775, texture: "armor/noy.png"}); 
MagicCore.setArmor(ItemID.necromancer_helmet, "necromancer", 15, {scrutiny: "necromancer", tab: "riches"});
MagicCore.setArmorMagic(ItemID.necromancer_helmet, "magic", 3);


IDRegistry.genItemID("necromancer_chestplate");
Item.createArmorItem("necromancer_chestplate" , "aw.item.necromancer_chestplate", {name: "necromancer", meta: 1}, {type: "chestplate", armor: 8, durability: 3102, texture: "armor/noy.png"}); 
MagicCore.setArmor(ItemID.necromancer_chestplate, "necromancer", 20, {scrutiny: "necromancer", tab: "riches"});
MagicCore.setArmorMagic(ItemID.necromancer_chestplate, "dead", 12);

IDRegistry.genItemID("necromancer_leggings");
Item.createArmorItem("necromancer_leggings", "aw.item.bandit_leggings", {name: "necromancer", meta: 2}, {type: "leggings", armor: 6, durability: 2805, texture: "armor/noy.png"});
MagicCore.setArmor(ItemID.necromancer_leggings, "necromancer", 20, {scrutiny: "necromancer", tab: "riches"});
MagicCore.setArmorMagic(ItemID.necromancer_leggings, "dead", 8);

IDRegistry.genItemID("necromancer_boots");
Item.createArmorItem("necromancer_boots", "aw.item.bandit_boots", {name: "necromancer", meta: 3}, {type: "boots", armor: 4, durability: 1438, texture: "armor/noy.png"});
MagicCore.setArmor(ItemID.necromancer_boots, "necromancer", 15, {scrutiny: "necromancer", tab: "riches"});
MagicCore.setArmorMagic(ItemID.necromancer_boots, "magic", 4);

Item.addCreativeGroup("armor", Translation.translate("aw.creative_group.armor"), [
    ItemID.RobeOfTheAzureWizard,
    ItemID.fire_king,
    ItemID.fire_king_chestplate,
    ItemID.fire_king_leggings, 
    ItemID.fire_king_boots, 
    ItemID.bandit_helmet,
    ItemID.bandit_chestplate,
    ItemID.bandit_leggings,
    ItemID.bandit_boots,
    ItemID.necromancer_helmet,
    ItemID.necromancer_chestplate,
    ItemID.necromancer_leggings,
    ItemID.necromancer_boots
]);

Item.setEnchantType(ItemID.RobeOfTheAzureWizard, Native.EnchantType.chestplate, 14);

Item.setEnchantType(ItemID.fire_king, Native.EnchantType.helmet, 14);
Item.setEnchantType(ItemID.fire_king_chestplate, Native.EnchantType.chestplate, 14);
Item.setEnchantType(ItemID.fire_king_leggings, Native.EnchantType.leggings, 14);
Item.setEnchantType(ItemID.fire_king_boots, Native.EnchantType.boots, 14);

Item.setEnchantType(ItemID.bandit_helmet, Native.EnchantType.helmet, 14);
Item.setEnchantType(ItemID.bandit_chestplate, Native.EnchantType.chestplate, 14);
Item.setEnchantType(ItemID.bandit_leggings, Native.EnchantType.leggings, 14);
Item.setEnchantType(ItemID.bandit_boots, Native.EnchantType.boots, 14);

Item.setEnchantType(ItemID.necromancer_helmet, Native.EnchantType.helmet, 14);
Item.setEnchantType(ItemID.necromancer_chestplate, Native.EnchantType.chestplate, 14);
Item.setEnchantType(ItemID.necromancer_leggings, Native.EnchantType.leggings, 14);
Item.setEnchantType(ItemID.necromancer_boots, Native.EnchantType.boots, 14);




// file: items/scroll.js

IDRegistry.genItemID("madin_tashu"); 
Item.createItem("madin_tashu", "aw.item.madin_tashu", {name: "sroll", meta: 0}, {stack: 1, isTech: true});

IDRegistry.genItemID("sroll1"); 
Item.createItem("sroll1", "aw.item.sroll1", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll2"); 
Item.createItem("sroll2", "aw.item.sroll2", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll3"); 
Item.createItem("sroll3", "aw.item.sroll3", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll4"); 
Item.createItem("sroll4", "aw.item.sroll4", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll10"); 
Item.createItem("sroll10", "aw.item.sroll10", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll11"); 
Item.createItem("sroll11", "aw.item.sroll11", {name: "sroll", meta: 1}, {stack: 1});
Item.setGlint(ItemID.sroll11, true);

IDRegistry.genItemID("sroll5"); 
Item.createItem("sroll5", "aw.item.sroll5", {name: "sroll", meta: 4}, {stack: 1});

IDRegistry.genItemID("sroll6"); 
Item.createItem("sroll6", "aw.item.sroll6", {name: "sroll", meta: 4}, {stack: 1});

IDRegistry.genItemID("sroll12"); 
Item.createItem("sroll12", "aw.item.sroll12", {name: "sroll", meta: 4}, {stack: 1});

IDRegistry.genItemID("sroll13"); 
Item.createItem("sroll13", "aw.item.sroll13", {name: "sroll", meta: 2}, {stack: 1});
Item.setGlint(ItemID.sroll13, true);

IDRegistry.genItemID("sroll7"); 
Item.createItem("sroll7", "aw.item.sroll7", {name: "sroll", meta: 4}, {stack: 1});

IDRegistry.genItemID("sroll8"); 
Item.createItem("sroll8", "aw.item.sroll8", {name: "sroll", meta: 3}, {stack: 1});
Item.setGlint(ItemID.sroll8, true);

IDRegistry.genItemID("sroll9"); 
Item.createItem("sroll9", "aw.item.sroll9", {name: "sroll", meta: 4}, {stack: 1});

/*IDRegistry.genItemID("sroll14"); 
Item.createItem("sroll14", "aw.item.sroll14", {name: "sroll", meta: 4}, {stack: 1});
Translation.addTranslation("Scroll: Block Absorption", {ru: "Свиток: поглощения блока"});*/

IDRegistry.genItemID("sroll15"); 
Item.createItem("sroll15", "aw.item.sroll15", {name: "sroll", meta: 2}, {stack: 1});
Item.setGlint(ItemID.sroll15, true);

IDRegistry.genItemID("sroll16"); 
Item.createItem("sroll16", "aw.item.sroll16", {name: "sroll", meta: 4}, {stack: 1});

IDRegistry.genItemID("sroll18"); 
Item.createItem("sroll18", "aw.item.sroll18", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll17"); 
Item.createItem("sroll17", "aw.item.sroll17", {name: "sroll", meta: 1}, {stack: 1});
Item.setGlint(ItemID.sroll17, true);

IDRegistry.genItemID("sroll19"); 
Item.createItem("sroll19", "aw.item.sroll19", {name: "sroll", meta: 4}, {stack: 1});

IDRegistry.genItemID("sroll20"); 
Item.createItem("sroll20", "aw.item.sroll20", {name: "sroll", meta: 2}, {stack: 1});
Item.setGlint(ItemID.sroll20, true);

IDRegistry.genItemID("sroll21"); 
Item.createItem("sroll21", "aw.item.sroll21", {name: "sroll", meta: 5}, {stack: 1});

IDRegistry.genItemID("sroll22"); 
Item.createItem("sroll22", "aw.item.sroll22", {name: "sroll", meta: 5}, {stack: 1});

IDRegistry.genItemID("sroll23"); 
Item.createItem("sroll23", "aw.item.sroll23", {name: "sroll", meta: 3}, {stack: 1});
Item.setGlint(ItemID.sroll23, true);

/*IDRegistry.genItemID("sroll24"); 
Item.createItem("sroll24", "Scroll: Charge Aspects Level 1", {name: "sroll", meta: 4}, {stack: 1});
Translation.addTranslation("Scroll: Charge Aspects Level 1", {ru: "Свиток: заряд аспектами 1 уровень"});

IDRegistry.genItemID("sroll25"); 
Item.createItem("sroll25", "Scroll: Charge Aspects Level 2", {name: "sroll", meta: 2}, {stack: 1});
Translation.addTranslation("Scroll: Charge Aspects Level 2", {ru: "Свиток: заряд аспектами 2 уровень"});
Item.setGlint(ItemID.sroll25, true);*/

IDRegistry.genItemID("sroll26"); 
Item.createItem("sroll26", "aw.item.sroll26", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll29"); 
Item.createItem("sroll29", "aw.item.sroll29", {name: "sroll", meta: 4}, {stack: 1});

/*IDRegistry.genItemID("sroll30"); 
Item.createItem("sroll30", "Scroll: flight", {name: "sroll", meta: 4}, {stack: 1});
Translation.addTranslation("Scroll: flight", {ru: "Свиток: полёта"});

IDRegistry.genItemID("sroll31"); 
Item.createItem("sroll31", "Scroll: protection", {name: "sroll", meta: 4}, {stack: 1});
Translation.addTranslation("Scroll: protection", {ru: "свиток: защиты"});*/

IDRegistry.genItemID("sroll32"); 
Item.createItem("sroll32", "aw.item.sroll32", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll33"); 
Item.createItem("sroll33", "aw.item.sroll33", {name: "sroll", meta: 0}, {stack: 1});
Translation.addTranslation("Scroll: Firestorm", {ru: "Свиток: огненный шторм"});

IDRegistry.genItemID("sroll34"); 
Item.createItem("sroll34", "aw.item.sroll34", {name: "sroll", meta: 1}, {stack: 1});
Item.setGlint(ItemID.sroll34, true);

IDRegistry.genItemID("sroll35"); 
Item.createItem("sroll35", "aw.item.sroll35", {name: "sroll", meta: 1}, {stack: 1});
Item.setGlint(ItemID.sroll35, true);

let arrBlockSroll = [BlockID.magicController, BlockID.rityalPedestal, BlockID.MagicConnector, 1];
IDRegistry.genItemID("sroll36"); 
Item.createItem("sroll36", "aw.item.sroll36", {name: "sroll", meta: 0}, {stack: 1});
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(item.id == ItemID.sroll36 && arrBlockSroll.indexOf(block.id) == -1){
		item.extra = item.extra || new ItemExtraData();
		item.extra.putInt("mode", item.extra.getInt("mode", -1)+2 <= 1 ? item.extra.getInt("mode", -1)+2 : -1);
		Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
	}
});
Item.registerNameOverrideFunction(ItemID.sroll36, function(item, name, translation){
	item.extra = item.extra || new ItemExtraData();
	return name + "\n"+TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
});

IDRegistry.genItemID("sroll37"); 
Item.createItem("sroll37", "aw.item.sroll37", {name: "sroll", meta: 0}, {stack: 1});
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(item.id == ItemID.sroll37 && arrBlockSroll.indexOf(block.id) == -1){
		item.extra = item.extra || new ItemExtraData();
		item.extra.putInt("mode", item.extra.getInt("mode", -1)+2 <= 1 ? item.extra.getInt("mode", -1)+2 : -1);
		Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
	}
});
Item.registerNameOverrideFunction(ItemID.sroll37, function(item, name, translation){
	item.extra = item.extra || new ItemExtraData();
	return name + "\n"+TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
});
IDRegistry.genItemID("sroll38"); 
Item.createItem("sroll38", "aw.item.sroll38", {name: "sroll", meta: 0}, {stack: 1});
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(item.id == ItemID.sroll38 && arrBlockSroll.indexOf(block.id) == -1){
		item.extra = item.extra || new ItemExtraData();
		item.extra.putInt("mode", item.extra.getInt("mode", -1)+2 <= 1 ? item.extra.getInt("mode", -1)+2 : -1);
		Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
	}
});

Item.registerNameOverrideFunction(ItemID.sroll38, function(item, name, translation){
	item.extra = item.extra || new ItemExtraData();
	return name + "\n"+TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
});
IDRegistry.genItemID("sroll39"); 
Item.createItem("sroll39", "aw.item.sroll39", {name: "sroll", meta: 0}, {stack: 1});
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(item.id == ItemID.sroll39 && arrBlockSroll.indexOf(block.id) == -1){
		item.extra = item.extra || new ItemExtraData();
		item.extra.putInt("mode", item.extra.getInt("mode", -1)+2 <= 1 ? item.extra.getInt("mode", -1)+2 : -1);
		Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
	}
});

Item.registerNameOverrideFunction(ItemID.sroll39, function(item, name, translation){
	item.extra = item.extra || new ItemExtraData();
	return name + "\n"+TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
});
IDRegistry.genItemID("sroll40"); 
Item.createItem("sroll40", "aw.item.sroll40", {name: "sroll", meta: 0}, {stack: 1});
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(item.id == ItemID.sroll40 && arrBlockSroll.indexOf(block.id) == -1){
		item.extra = item.extra || new ItemExtraData();
		item.extra.putInt("mode", item.extra.getInt("mode", -1)+2 <= 1 ? item.extra.getInt("mode", -1)+2 : -1);
		Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
	}
});
Item.registerNameOverrideFunction(ItemID.sroll40, function(item, name, translation){
	item.extra = item.extra || new ItemExtraData();
	return name + "\n"+TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
});
IDRegistry.genItemID("sroll41"); 
Item.createItem("sroll41", "aw.item.sroll41", {name: "sroll", meta: 0}, {stack: 1});
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(item.id == ItemID.sroll41 && arrBlockSroll.indexOf(block.id) == -1){
		item.extra = item.extra || new ItemExtraData();
		item.extra.putInt("mode", item.extra.getInt("mode", -1)+2 <= 1 ? item.extra.getInt("mode", -1)+2 : -1);
		Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
	}
});
Item.registerNameOverrideFunction(ItemID.sroll41, function(item, name, translation){
	item.extra = item.extra || new ItemExtraData();
	return name + "\n"+TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
});

IDRegistry.genItemID("sroll41"); 
Item.createItem("sroll41", "aw.item.sroll41", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll42"); 
Item.createItem("sroll42", "aw.item.sroll42", {name: "sroll", meta: 2}, {stack: 1});
Item.setGlint(ItemID.sroll42, true);

IDRegistry.genItemID("sroll43"); 
Item.createItem("sroll43", "aw.item.sroll43", {name: "sroll", meta: 2}, {stack: 1});
Item.setGlint(ItemID.sroll43, true);
Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
	if(item.id == ItemID.sroll43 && arrBlockSroll.indexOf(block.id) == -1){
		let block = BlockSource.getDefaultForActor(player).getBlock(coords.x, coords.y, coords.z);
		item.extra = item.extra || new ItemExtraData();
		item.extra.putInt("id", block.id);
		item.extra.putInt("data", block.id);
		Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
	}
});
Item.registerNameOverrideFunction(ItemID.sroll43, function(item, name, translation){
	item.extra = item.extra || new ItemExtraData();
	return name + ", " + Item.getName(item.extra.getInt("id", 1), item.extra.getInt("data", 0));
});

IDRegistry.genItemID("sroll44"); 
Item.createItem("sroll44", "aw.item.sroll44", {name: "sroll", meta: 2}, {stack: 1});
Item.setGlint(ItemID.sroll44, true);

IDRegistry.genItemID("sroll45"); 
Item.createItem("sroll45", "aw.item.sroll45", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll46"); 
Item.createItem("sroll46", "aw.item.sroll46", {name: "sroll", meta: 1}, {stack: 1});
Item.setGlint(ItemID.sroll46, true);

IDRegistry.genItemID("sroll47"); 
Item.createItem("sroll47", "aw.item.sroll47", {name: "sroll", meta: 2}, {stack: 1});
Item.setGlint(ItemID.sroll47, true);

IDRegistry.genItemID("sroll27"); 
Item.createItem("sroll27", "aw.item.sroll27", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("sroll28"); 
Item.createItem("sroll28", "aw.item.sroll28", {name: "sroll", meta: 0}, {stack: 1});

/*
Свитки 
атаки:
0 - обычные
1 - эпические

вспомогательные:
2 - эпические
4 - обычные

некромантии:
3 - обычные
5 - эпические
*/

//декоративные заклинания 

IDRegistry.genItemID("decor1"); 
Item.createItem("decor1", "aw.item.decor1", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("decor2"); 
Item.createItem("decor2", "aw.item.decor2", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("decor3"); 
Item.createItem("decor3", "aw.item.decor3", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("decor4"); 
Item.createItem("decor4", "aw.item.decor4", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("decor5"); 
Item.createItem("decor5", "aw.item.decor5", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("decor6"); 
Item.createItem("decor6", "aw.item.decor6", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("decor7"); 
Item.createItem("decor7", "aw.item.decor7", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("decor8"); 
Item.createItem("decor8", "aw.item.decor8", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("decor9"); 
Item.createItem("decor9", "aw.item.decor9", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("decor10"); 
Item.createItem("decor10", "aw.item.decor10", {name: "sroll", meta: 0}, {stack: 1});

IDRegistry.genItemID("SpellSet31"); 
Item.createItem("SpellSet31", "aw.item.spell_set", {name: "book_enchanted", meta: 0}, {stack: 1});
Item.setGlint(ItemID.SpellSet31, true);
Item.registerNameOverrideFunction(ItemID.SpellSet31, function(item, name) {
    let extra = item.extra || new ItemExtraData();
    return name + extra.getString("name", "нет имени")
});

Item.addCreativeGroup("events", Translation.translate("aw.creative_group.events"), [
	  ItemID.sroll1,
	  ItemID.sroll2,
	  ItemID.sroll3,
]);
Item.addCreativeGroup("sroll", Translation.translate("aw.creative_group.sroll"),[
	  ItemID.sroll4,
	  ItemID.sroll5,
	  ItemID.sroll6,
	  ItemID.sroll7,
	  ItemID.sroll8,
	  ItemID.sroll9,
	  ItemID.sroll10,
	  ItemID.sroll11,
	  ItemID.sroll12,
	  ItemID.sroll13,
	  ItemID.sroll15,
	  ItemID.sroll16,
	  ItemID.sroll17,
	  ItemID.sroll18,
	  ItemID.sroll19,
	  ItemID.sroll20,
	  ItemID.sroll21,
	  ItemID.sroll22,
	  ItemID.sroll23,
	  ItemID.sroll26,
	  ItemID.sroll29,
	  ItemID.sroll27,
	  ItemID.sroll28,
	  ItemID.sroll29,
	  ItemID.sroll32,
	  ItemID.sroll33,
	  ItemID.sroll34,
	  ItemID.sroll35,
	  ItemID.sroll36,
	  ItemID.sroll37,
	  ItemID.sroll38,
	  ItemID.sroll39,
	  ItemID.sroll40,
	  ItemID.sroll41,
	  ItemID.sroll42,
	  ItemID.sroll43,
	  ItemID.sroll44,
	  ItemID.sroll45,
	  ItemID.sroll46,
ItemID.sroll47
]);
Item.addCreativeGroup("decor", Translation.translate("aw.creative_group.decor"), [
	  ItemID.decor1,
	  ItemID.decor2,
	  ItemID.decor3,
	  ItemID.decor4,
	  ItemID.decor5,
	  ItemID.decor6,
	  ItemID.decor7,
	  ItemID.decor8,
	  ItemID.decor9,
	  ItemID.decor10
]);




// file: items/scrolls/decor.js

let decor = Wands.registerSrollDecoration(ItemID.decor1);
decor.addType("usingReleased", function(packet){
	let pos = packet.coords;
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x-.5, pos.y-.5, pos.z-.5, 0.5, 11, 2, Entity.getDimension(packet.entity));
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x-.5, pos.y-0.8-.5, pos.z-.5, 0.7, 11, 2, Entity.getDimension(packet.entity));
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x-.5, pos.y-0.3 - .5, pos.z-.5, 1.1, 11, 2, Entity.getDimension(packet.entity));
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x-.5, pos.y-0.1-.5, pos.z-.5, 1.1, 11, 2, Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let pos = packet.coords;
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x -.5, pos.y-1+.3, pos.z-.5, 0.5, 11, 2, Entity.getDimension(packet.entity));
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x -.6, pos.y-0.8+.3, pos.z-.5, 0.7, 11, 2, Entity.getDimension(packet.entity));
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x - .5, pos.y-0.3+.3, pos.z-.5, 1.1, 11, 2, Entity.getDimension(packet.entity));
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x -.5, pos.y-0.1+.3, pos.z-.5, 1.1, 11, 2, Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let pos = packet.coords;
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-1+2, pos.z, 0.5, 11, 2, Entity.getDimension(packet.entity));
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.8+2, pos.z, 0.7, 11, 2, Entity.getDimension(packet.entity));
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.3+2, pos.z, 1.1, 11, 2, Entity.getDimension(packet.entity));
	ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.1+2, pos.z, 1.1, 11, 2, Entity.getDimension(packet.entity));
});

decor = Wands.registerSrollDecoration(ItemID.decor2);
decor.addType("usingReleased", function(packet){
	let pos = packet.coords;
	for(let i = 0;i <= 10;i++)
		ParticlesAPI.spawnCircle(ParticlesAPI.part4, pos.x-.5, pos.y+1-2.8, pos.z-.5, i / 2, 11 * i, 2, Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let pos = packet.coords;
	for(let i = 0;i <= 10;i++)
		ParticlesAPI.spawnCircle(ParticlesAPI.part4, pos.x - .5, pos.y-.1, pos.z-.5, i / 2, 11 * i, 2, Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let pos = packet.coords;
	for(let i = 0;i <= 10;i++)
		ParticlesAPI.spawnCircle(ParticlesAPI.part4, pos.x, pos.y+1, pos.z, i / 2, 11 * i, 2, Entity.getDimension(packet.entity));
});

decor = Wands.registerSrollDecoration(ItemID.decor3);
decor.addType("usingReleased", function(packet){
	let pos = packet.coords;
	let group = new ParticlesCore.Group();
	for(let i = 0;i <= 40;i++){
		let coords = {
			x: pos.x + (Math.random()*8 - Math.random()*8),
			y: pos.y + (Math.random()*8 - Math.random()*8),
			z: pos.z + (Math.random()*8 - Math.random()*8)
		};
		let v = ParticlesAPI.getVector(pos, coords);
		group.add(ParticlesAPI.part2, coords.x, coords.y, coords.z, (v.x / 50), (v.y / 50), (v.z / 50));
	}
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let pos = packet.coords;
	let group = new ParticlesCore.Group();
	for(let i = 0;i <= 40;i++){
		let coords = {
			x: pos.x + (Math.random()*8 - Math.random()*8),
			y: pos.y + (Math.random()*8 - Math.random()*8),
			z: pos.z + (Math.random()*8 - Math.random()*8)
		};
		let v = ParticlesAPI.getVector(pos, coords);
		group.add(ParticlesAPI.part2, coords.x, coords.y, coords.z, (v.x / 50), (v.y / 50), (v.z / 50));
	}
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let pos = packet.coords;
	let group = new ParticlesCore.Group();
	for(let i = 0;i <= 40;i++){
		let coords = {
			x: pos.x + (Math.random()*8 - Math.random()*8),
			y: pos.y + (Math.random()*8 - Math.random()*8),
			z: pos.z + (Math.random()*8 - Math.random()*8)
		};
		let v = ParticlesAPI.getVector(pos, coords);
		group.add(ParticlesAPI.part2, coords.x, coords.y, coords.z, (v.x / 50), (v.y / 50), (v.z / 50));
	}
	group.send(Entity.getDimension(packet.entity));
});

decor = Wands.registerSrollDecoration(ItemID.decor5);
decor.addType("usingReleased", function(packet){
	let vector = Entity.getLookVector(packet.entity);
	let coords = packet.coords;
  coords.x -= vector.x * 4;
  coords.y -= vector.y * 4;
  coords.z -= vector.z * 4;
  let group = new ParticlesCore.Group();
  for(let r = 0;r <= 20;r++)
  	group.add(ParticlesAPI.colors, coords.x+((Math.random()*5)-(Math.random()*5)), coords.y, coords.z+((Math.random()*5)-(Math.random()*5)), vector.x / 4, vector.y / 4, vector.z / 4, 0, 0, 0);
  group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let vector = Entity.getLookVector(packet.entity);
	let coords = packet.coords;
  coords.x -= vector.x * 4;
  coords.y -= vector.y * 4;
  coords.z -= vector.z * 4;
  let group = new ParticlesCore.Group();
  for(let r = 0;r <= 20;r++)
  	group.add(ParticlesAPI.colors, coords.x+((Math.random()*5)-(Math.random()*5)), coords.y, coords.z+((Math.random()*5)-(Math.random()*5)), vector.x / 4, vector.y / 4, vector.z / 4, 0, 0, 0);
  group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let vector = Entity.getLookVector(packet.entity);
	let coords = packet.coords;
  coords.x -= vector.x * 4;
  coords.y -= vector.y * 4;
  coords.z -= vector.z * 4;
  let group = new ParticlesCore.Group();
  for(let r = 0;r <= 20;r++)
  	group.add(ParticlesAPI.colors, coords.x+((Math.random()*5)-(Math.random()*5)), coords.y, coords.z+((Math.random()*5)-(Math.random()*5)), vector.x / 4, vector.y / 4, vector.z / 4, 0, 0, 0);
  group.send(Entity.getDimension(packet.entity));
});

decor = Wands.registerSrollDecoration(ItemID.decor4);
decor.addType("usingReleased", function(packet){
	let coords = packet.coords;
	coords.x+=.5;
  coords.y+=1-2.3;
  coords.z+=.5;
  let step = 360 / 100;
  let group = new ParticlesCore.Group();
  for(i = 0;i < 360;i+=step){
  	let x = coords.x + (i/20) * Math.cos(i / 8);
    let z = coords.z - (i/20) * Math.sin(i / 8);
    group.add(ParticlesAPI.colors, x, coords.y, z, 0, 0.0001*i, 0, 0, 0, 0);
  }
  group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let coords = packet.coords;
	coords.x+=.5;
  coords.y+=1;
  coords.z+=.5;
  let step = 360 / 100;
  let group = new ParticlesCore.Group();
  for(i = 0;i < 360;i+=step){
  	let x = coords.x + (i/20) * Math.cos(i / 8);
    let z = coords.z - (i/20) * Math.sin(i / 8);
    group.add(ParticlesAPI.colors, x, coords.y, z, 0, 0.0001*i, 0, 0, 0, 0);
  }
  group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let coords = packet.coords;
	coords.x+=.5;
  coords.y+=1;
  coords.z+=.5;
  let step = 360 / 100;
  let group = new ParticlesCore.Group();
  for(i = 0;i < 360;i+=step){
  	let x = coords.x + (i/20) * Math.cos(i / 8);
    let z = coords.z - (i/20) * Math.sin(i / 8);
    group.add(ParticlesAPI.colors, x, coords.y, z, 0, 0.0001*i, 0, 0, 0, 0);
  }
  group.send(Entity.getDimension(packet.entity));
});

decor = Wands.registerSrollDecoration(ItemID.decor6);
decor.addType("usingReleased", function(packet){
	playAnimation(packet.player, "animation.aw.decor.one", 3)
});
decor.addType("EntityInteract", function(packet){
	playAnimation(packet.player, "animation.aw.decor.one", 3)
});
decor.addType("itemUse", function(packet){
	playAnimation(packet.player, "animation.aw.decor.one", 3)
});

decor = Wands.registerSrollDecoration(ItemID.decor7);
decor.addType("usingReleased", function(packet){
	let pos = packet.coords;
	pos.y-=1.5;
	let group = new ParticlesCore.Group();
	for(let c = 0;c<=1;c++){
		let step = 360 / 60+(Math.floor(Math.random()*10));
		for(i = 0;i < 360;i+=step){
   	 let x = pos.x + .5 * Math.cos(i);
      let z = pos.z - .5 * Math.sin(i);
      let y = pos.y + Math.random() / 8;
      let vector = {
      	x: -(pos.x - x) / 3,
        y: -(pos.y - y) / 3,
        z: -(pos.z - z) / 3
      };
      group.add(ParticlesAPI.part1Colision, x, y, z, vector.x, vector.y, vector.z);
    }
	}
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let pos = packet.coords;
	pos.y-=.5;
	let group = new ParticlesCore.Group();
	for(let c = 0;c<=1;c++){
		let step = 360 / 60+(Math.floor(Math.random()*10));
		for(i = 0;i < 360;i+=step){
   	 let x = pos.x + .5 * Math.cos(i);
      let z = pos.z - .5 * Math.sin(i);
      let y = pos.y + Math.random() / 8;
      let vector = {
      	x: -(pos.x - x) / 3,
        y: -(pos.y - y) / 3,
        z: -(pos.z - z) / 3
      };
      group.add(ParticlesAPI.part1Colision, x, y, z, vector.x, vector.y, vector.z);
    }
	}
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let pos = packet.coords;
	pos.y+=1.5;
	pos.z+=.5;
	pos.x+=.5;
	let group = new ParticlesCore.Group();
	for(let c = 0;c<=1;c++){
		let step = 360 / 60+(Math.floor(Math.random()*10));
		for(i = 0;i < 360;i+=step){
   	 let x = pos.x + .5 * Math.cos(i);
      let z = pos.z - .5 * Math.sin(i);
      let y = pos.y + Math.random() / 8;
      let vector = {
      	x: -(pos.x - x) / 3,
        y: -(pos.y - y) / 3,
        z: -(pos.z - z) / 3
      };
      group.add(ParticlesAPI.part1Colision, x, y, z, vector.x, vector.y, vector.z);
    }
	}
	group.send(Entity.getDimension(packet.entity));
});
decor = Wands.registerSrollDecoration(ItemID.decor8);
decor.addType("usingReleased", function(packet){
	let group = new ParticlesCore.Group();
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.colors, packet.coords.x+Math.random(), packet.coords.y+Math.random(), packet.coords.z+Math.random(), 0, 0, 0);
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let group = new ParticlesCore.Group();
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.colors, packet.coords.x+Math.random(), packet.coords.y+Math.random(), packet.coords.z+Math.random(), 0, 0, 0);
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let group = new ParticlesCore.Group();
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.colors, packet.coords.x+Math.random(), packet.coords.y+Math.random(), packet.coords.z+Math.random(), 0, 0, 0);
	group.send(Entity.getDimension(packet.entity));
});
decor = Wands.registerSrollDecoration(ItemID.decor9);
decor.addType("usingReleased", function(packet){
	let pos = Entity.getPosition(packet.entity);
	let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
	let region = BlockSource.getDefaultForActor(packet.entity);
	let group = new ParticlesCore.Group();
	for(let i = 0;i<50;i++){
	 	let coord = {
	 	 	x: pos.x+(i * vel.x / 2),
	 	 	y: pos.y+(i * vel.y / 2),
	 	 	z: pos.z+(i * vel.z / 2)
		};
		if(region.getBlockId(coord.x,coord.y,coord.z) != 0){
			group.add(ParticlesAPI.indicator, coord.x-vel.x, coord.y-vel.y, coord.z-vel.z, 0, 0, 0);
			break;
		}
	}
	group.send(region);
});
decor.addType("EntityInteract", function(packet){
	let pos = Entity.getPosition(packet.entity);
	let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
	let region = BlockSource.getDefaultForActor(packet.entity);
	let group = new ParticlesCore.Group();
	for(let i = 0;i<50;i++){
	 	let coord = {
	 	 	x: pos.x+(i * vel.x / 2),
	 	 	y: pos.y+(i * vel.y / 2),
	 	 	z: pos.z+(i * vel.z / 2)
		};
		if(region.getBlockId(coord.x,coord.y,coord.z) != 0){
			group.add(ParticlesAPI.indicator, coord.x-vel.x, coord.y-vel.y, coord.z-vel.z, 0, 0, 0);
			break;
		}
	}
	group.send(region);
});
decor.addType("itemUse", function(packet){
	Mp.spawnParticle(ParticlesAPI.indicator, packet.coords.vec.x, packet.coords.vec.y, packet.coords.vec.z, 0, 0, 0, 0, 0, 0, Entity.getDimension());
});

decor = Wands.registerSrollDecoration(ItemID.decor10);
decor.addType("usingReleased", function(packet){
	let group = new ParticlesCore.Group();
	let pos = Entity.getPosition(packet.entity);
	let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.aspect_particle, pos.x-.5+Math.random(), pos.y-.5+Math.random(), pos.z-.5+Math.random(), vel.x/15, vel.y/15, vel.z/15);
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("EntityInteract", function(packet){
	let group = new ParticlesCore.Group();
	let pos = Entity.getPosition(packet.player);
	let vel = ParticlesAPI.getVector(pos, Entity.getPosition(packet.entity));
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.aspect_particle, pos.x-.5+Math.random(), pos.y-.5+Math.random(), pos.z-.5+Math.random(), vel.x/15, vel.y/15, vel.z/15);
	group.send(Entity.getDimension(packet.entity));
});
decor.addType("itemUse", function(packet){
	let group = new ParticlesCore.Group();
	let pos = Entity.getPosition(packet.entity);
	let end = packet.coords;
	end.x+=.5;
	end.y+=.5;
	end.z+=.5;
	let vel = ParticlesAPI.getVector(Entity.getPosition(packet.entity), end);
	for(let i = 0;i < 30;i++)
		group.add(ParticlesAPI.aspect_particle, pos.x-.5+Math.random(), pos.y-.5+Math.random(), pos.z-.5+Math.random(), vel.x/15, vel.y/15, vel.z/15);
	group.send(Entity.getDimension(packet.entity));
});




// file: items/MagicWand.js

IDRegistry.genItemID("awDebugWand"); 
Item.createItem("awDebugWand", "debug wand", {name: "stick", meta: 0}, {stack: 1});
Wands.addStick({
    id: ItemID.awDebugWand,
    time: 5,
    scroll_max: 9999,
    texture: {
        name: "stick"
    },
    bonus: {
        necromancer: 100,
        protection: 100,
        magic: 100,
        aspects: 99999999
    }
});

Wands.addStick({
    id: ItemID.magis_stick, 
    time: 20,
    scroll_max: 2,
    sound: "magic_1",
    scrutiny: {
        name: "magisStick"
    },
    texture: {
        name: "magis_stick"
    },
});
MagicCore.setUsingItem({id: ItemID.magis_stick, data: 0}, "magic", 10);
Wands.addStick({
    id: ItemID.acolyteStaff,
    time: 30,
    sound: "magic_0",
    scroll_max: 1,
    scrutiny: {
        name: "acolyteStaff"
    },
    texture: {
        name: "acolyte_staff"
    },
    bonus: {
        necromancer: -5,
        protection: -5,
        magic: -5,
        aspects: -20
    }
});
Wands.addStick({
    id: ItemID.magis_sword,
    time: 30,
    scroll_max: 2,
    sound: "magic_2",
    scrutiny: {
        name: "magisSword"
    },
    texture: {
        name: "magis_sword"
    },
    bonus: {
        necromancer: 10,
        protection: -10,
        magic: 10,
        aspects: -10
    }
});
MagicCore.setUsingItem({id: ItemID.magis_sword, data: 0}, "protection", 35);
Wands.addStick({
    id: ItemID.magis_pocox,
    time: 20,
    scroll_max: 2,
    sound: "magic_3",
    scrutiny: {
        name: "magisPocox"
    },
    texture: {
        name: "magis_pocox"
    },
    bonus: {
        necromancer: -10,
        protection: 5,
        magic: 10,
        aspects: -5
    }
});

Wands.addStick({
    id: ItemID.aw_dead,
    time: 30,
    scroll_max: 6,
    sound: "magic_4",
    scrutiny: {
    	name: "dead",
    	tab: "riches"
    },
    texture: {
        name: "aw_dead"
    },
    bonus: {
        necromancer: 10,
        protection: 10,
        magic: 10,
        aspects: 10
    }
});

MagicCore.setUsingItem({id: ItemID.magis_pocox, data: 0}, "necromancer", 20);

Wands.addStick({
    id: ItemID.magis_stick_2_lvl,
    time: 25,
    scroll_max: 4,
    sound: "magic_1",
    scrutiny: {
        name: "magisStick2lvl"
    },
    texture: {
        name: "magis_stick_2_lvl"
    },
    bonus: {
        necromancer: 10,
        protection: 5,
        magic: -5,
        aspects: 10
    }
});
MagicCore.setUsingItem({id: ItemID.magis_stick_2_lvl, data: 0}, "magic", 40);

Wands.addStick({
	id: ItemID.aw_magic_stick,
	time: 20,
	scroll_max: 5,
	sound: "magic_1",
	scrutiny: {
		tab: "riches",
		name: "aw_magic_stick"
	},
	texture: {
		name: "magic_stick"
	},
	bonus: {
		necromancer: 5,
		protection: 5,
		magic: 5,
		aspects: 5
	}
});
MagicCore.setUsingItem({id: ItemID.aw_magic_stick, data: 0}, "magic", 60);

Wands.addStick({
    id: ItemID.magis_sword_2_lvl,
    time: 25,
    scroll_max: 4,
    sound: "magic_2",
    scrutiny: {
        name: "magisSword2lvl"
    },
    texture: {
        name: "magis_sword_2_lvl"
    },
    bonus: {
        necromancer: 5,
        protection: -5,
        magic: 10,
        aspects: 5
    }
});
MagicCore.setUsingItem({id: ItemID.magis_sword_2_lvl, data: 0}, "protection", 50);

Wands.addStick({
	id: ItemID.aw_magic_shovel,
	time: 20,
	scroll_max: 5,
	sound: "magic_2",
	scrutiny: {
		tab: "riches",
		name: "aw_magic_shovel"
	},
	texture: {
		name: "magic_shovel"
	},
	bonus: {
		necromancer: 5,
		protection: 5,
		magic: 5,
		aspects: 0
	}
});
MagicCore.setUsingItem({id: ItemID.aw_magic_shovel, data: 0}, "protection", 60);

Wands.addStick({
    id: ItemID.magis_pocox_2_lvl,
    time: 15,
    scroll_max: 4,
    sound: "magic_3",
    texture: {
        name: "magic_staff_2_lvl"
    },
    scrutiny: {
        name: "magisPocox2lvl"
    },
    bonus: {
        necromancer: 5,
        protection: -5,
        magic: 10,
        aspects: 5
    }
});
MagicCore.setUsingItem({id: ItemID.magis_pocox_2_lvl, data: 0}, "necromancer", 40);

Wands.addStick({
	id: ItemID.aw_magic_staff,
	time: 20,
	scroll_max: 5,
	sound: "magic_2",
	scrutiny: {
		tab: "riches",
		name: "aw_magic_staff"
	},
	texture: {
		name: "magic_staff"
	},
	bonus: {
		necromancer: 5,
		protection: 5,
		magic: 5,
		aspects: -5
	}
});
MagicCore.setUsingItem({id: ItemID.aw_magic_staff, data: 0}, "necromancer", 60);

let SpellExtra = {
	extra1: Wands.addSpellSet([ItemID.sroll16, ItemID.sroll27, ItemID.sroll15], Translation.translate("aw.item.name_spell_set.displacement")),
  extra2: Wands.addSpellSet([ItemID.sroll20, ItemID.sroll16, ItemID.sroll27, ItemID.sroll16, ItemID.sroll27, ItemID.sroll17], Translation.translate("aw.item.name_spell_set.swipe")),
};

Bag1.addItem(0.01, ItemID.SpellSet31, {}, 0, SpellExtra.extra1);
Wands.setPrototype(ItemID.sroll1, {
    type: "event", 
    event: "itemUse", 
    using: function(packet){

    },
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll2, {
    type: "event", 
    event: "usingReleased", 
    using: function(packet){

    },
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll3, {
    type: "event", 
    event: "EntityInteract", 
    using: function(packet){

    },
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll4, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollDamage1",
        tab: "sroll"
    },
    activate: {
        necromancer: 10,
        aspects: 10
    },
    setFunction: function(packet){
        MagicCore.damage(packet.entity, "magic", 3);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll5, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollSpeed",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 10,
        aspects: 5
    },
    setFunction: function(packet){
        Entity.addEffect(packet.entity, 1, 2, 240, true, false);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll6, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    activate: {
        magic: 20,
        aspects: 40
    },
    scrutiny: {
        name: "srollHealing1",
        tab: "srollSubsidiary"
    },
    setFunction: function(packet){
        Entity.healEntity(packet.entity, 5);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll7, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollStrength",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 15,
        aspects: 20
    },
    setFunction: function(packet){
        Entity.addEffect(packet.entity, 5, 3, 240, true, false);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll8, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollKill",
        tab: "srollKill"
    },
    activate: {
        necromancer: 20
    },
    setFunction: function(packet){
        let c = MagicCore.getValue(packet.player);
        let helt = Entity.getHealth(packet.entity)*3;
        if(c.aspects >= helt){
            MagicCore.damage(packet.entity, "dead", 40);
            c.aspects -= helt;
            MagicCore.setParameters(packet.player, c);
        }else{
            PlayerAC.message(packet.player, TranslationLoad.get("aw.message.sroll.kill", [["aspects", helt]]));
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll9, {
    type: "function", 
    compatibility: [ItemID.sroll2, ItemID.sroll3],
    scrutiny: {
        name: "srollRegeneration",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 10,
        aspects: 10
    },
    setFunction: function(packet){
        BlockSource.getDefaultForActor(packet.player).destroyBlock(packet.coords.x,packet.coords.y,packet.coords.z, true);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll10, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollDamage2",
        tab: "sroll"
    },
    activate: {
        necromancer: 15,
        aspects: 50
    },
    setFunction: function(packet){
        MagicCore.damage(packet.entity, "magic", 14);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll11, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollDamage3",
        tab: "sroll"
    },
    activate: {
        necromancer: 20,
        aspects: 100
    },
    setFunction: function(packet){
        MagicCore.damage(packet.entity, "magic", 58);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll12, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollHealing2",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 30,
        aspects: 60
    },
    setFunction: function(packet){
        Entity.healEntity(packet.entity, 10);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll13, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollHealing3",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 50,
        aspects: 300
    },
    setFunction: function(packet){
        Entity.healEntity(packet.entity, 40);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
/*Wands.setPrototype(ItemID.sroll14, {
    type: "function", 
    compatibility: [ItemID.sroll2, ItemID.sroll3],
    activate: {
        magic: 30
    },
    setFunction: function(packet){
        let c = MagicCore.getValue(packet.player);
        if(c.Aspects + 10 <= c.AspectsNow){
           BlockSource.getDefaultForActor(packet.entity).destroyBlock(packet.coords.x,packet.coords.y,packet.coords.z, false);
            c.Aspects += 10;
            MagicCore.setParameters(packet.player, c);
        }else if(c.Aspects <= c.AspectsNow){
             BlockSource.getDefaultForActor(packet.entity).destroyBlock(packet.coords.x,packet.coords.y,packet.coords.z, false);
            c.Aspects = c.AspectsNow;
            MagicCore.setParameters(packet.player, c);
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});*/
Wands.setPrototype(ItemID.sroll15, {
    type: "function", 
    compatibility: [ItemID.sroll1, ItemID.sroll3],
    scrutiny: {
        name: "srollTeleportations",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 10,
        protection: 40,
        aspects: 30
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
        startSpinAttack(packet.entity);
        Entity.addVelocity(packet.entity, vel.x * 2, vel.y * 2, vel.z * 2);
        ParticlesAPI.spawnLine(ParticlesAPI.part2, pos.x, pos.y, pos.z, pos.x + (vel.x * 6), pos.y + (vel.y * 6), pos.z + (vel.z * 6), 10, Entity.getDimension(packet.entity));
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll16, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollStorms",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 15,
        protection: 20,
        aspects: 10
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        //Entity.setVelocity(packet.entity, 0, 0, 0);
        Entity.addVelocity(packet.entity, 0, 1, 0);
        ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-1, pos.z, 0.5, 11, 2);
        ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.8, pos.z, 0.7, 11, 2);
        //ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.5, pos.z, 1, 11, 2);
        ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.3, pos.z, 1.1, 11, 2);
        ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.1, pos.z, 1.1, 11, 2);
        //ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y+0.1, pos.z, 1.2, 11, 2);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll17, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollStrongAttack",
        tab: "sroll"
    },
    activate: {
        magic: 20,
        protection: 30,
        aspects: 50
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        let region = BlockSource.getDefaultForActor(packet.entity);
        let group = new ParticlesCore.Group();
        for(let i = 0;i <= 20;i++){
            let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
            vel.x += Math.random() - Math.random();
            vel.y += Math.random() - Math.random();
            vel.z += Math.random() - Math.random();
            for(let i = 0;i<50;i++){
                let coord = {
                    x: pos.x+(i * vel.x / 2),
                    y: pos.y+(i * vel.y / 2),
                    z: pos.z+(i * vel.z / 2)
                };
                let ent3 = Entity.getAllInRange(coord, 4);
                for(let i1 in ent3){
                    if(ent3[i1] != packet.entity) MagicCore.damage(ent3[i1], "magic", 4);
                }
                 if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                    break;
                }
                group.add(ParticlesAPI.part3, coord.x, coord.y, coord.z);
            }
        }
        group.send(region);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll18, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollWeakAttack",
        tab: "sroll"
    },
    activate: {
        magic: 10,
        protection: 15,
        aspects: 20
    },
    setFunction: function(packet){
        ParticlesAPI.spawnShellEnt(ParticlesAPI.part3, packet.entity, 30, 4);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll19, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollRegeneration",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 5,
        protection: 5,
        necromancer: 10,
        aspects: 15
    },
    setFunction: function(packet){
        Entity.addEffect(packet.entity, 10, 4, 300, true, false);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll20, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollMagnet",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 15,
        necromancer: 5,
        aspects: 30
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        let ents = Entity.getAllInRange(pos, 40);
        let group = new ParticlesCore.Group();
        let dim = Entity.getDimension(packet.entity);
        for(let i in ents){
            let pos1 = Entity.getPosition(ents[i]);
            let vel = {
                x: (pos.x - pos1.x) / 4,
                y: (pos.y - pos1.y) / 4,
                z: (pos.z - pos1.z) / 4
            };
            let dimension = Entity.getDimension(ents[i]);
            if(dimension != dim) continue;
            Mp.spawnParticle(ParticlesAPI.part1, pos1.x, pos1.y, pos1.z, vel.x, vel.y, vel.z, 0, 0, 0, dimension);
            Entity.setVelocity(ents[i], vel.x, vel.y, vel.z);
        }
        group.send(dim);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll21, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollSummoning",
        tab: "srollKill"
    },
    activate: {
        magic: 5,
        necromancer: 30,
        aspects: 50
    },
    setFunction: function(packet){
    	let group = new ParticlesCore.Group();
    	let b = BlockSource.getDefaultForActor(packet.entity);
        for(let i = 0;i <= Math.floor(Math.random()*3)+1;i++){
            let pos = Entity.getPosition(packet.entity);
            pos.x += (Math.random() * 8) - (Math.random() * 8);
            pos.z += (Math.random() * 8) - (Math.random() * 8);
            pos = GenerationUtils.findSurface(pos.x, pos.y, pos.z);
            let mob = b.spawnEntity(pos.x, pos.y + 1, pos.z, "aw:skeleton");
            Entity.setCarriedItem(mob, ItemID. magis_stick, 1, 0, null);
            entId[mob] = packet.entity;
            for(i = 0;i <= Math.floor(Math.random()*5)+5;i++){
                group.add(ParticlesAPI.part1, pos.x + Math.random() - Math.random() - 1, pos.y, pos.z + Math.random() - Math.random() - 1, 0, 0.1, 0);
            }
        }
		group.send(b);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll22, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollDeathRay",
        tab: "srollKill"
    },
    activate: {
        magic: 5,
        necromancer: 30,
        aspects: 100
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        pos.y+=0.5;
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
        let region = BlockSource.getDefaultForActor(packet.entity);
        let group = new ParticlesCore.Group();
        for(let i = 0;i<50;i++){
            let coord = {
                x: pos.x+(i * vel.x / 2),
                y: pos.y+(i * vel.y / 2),
                z: pos.z+(i * vel.z / 2)
            };
            let ent3 = Entity.getAllInRange(coord, 2);
            for(let i1 in ent3){
                if(ent3[i1] != packet.entity) MagicCore.damage(ent3[i1], "dead", 40);
            }
             if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                break;
            }
            group.add(ParticlesAPI.part4, coord.x, coord.y, coord.z);
        }
        group.send(region)
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll23, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollRainOfTheDead",
        tab: "srollKill"
    },
    activate: {
        protection: 10,
        necromancer: 40,
        aspects: 250
    },
    setFunction: function(packet){
    	let group = new ParticlesCore.Group();
    	let region = BlockSource.getDefaultForActor(packet.entity);
        for(let i = 0;i<=Math.floor(Math.random()*15);i++){
            let pos = Entity.getPosition(packet.entity);
            pos.x += ((Math.random()*8)-(Math.random()*8));
            pos.y += 5;
            pos.z += ((Math.random()*8)-(Math.random()*8));
            for(let i = 0;i<60;i++){
                let coord = {
                    x: pos.x,
                    y: pos.y+(i * -0.3),
                    z: pos.z
                };
                let ent3 = Entity.getAllInRange(coord, 2);
                for(let i1 in ent3){
                    if(ent3[i1] != packet.entity) MagicCore.damage(ent3[i1], "dead", 40);
                }
                 if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                    break;
                }
                group.add(ParticlesAPI.part4, coord.x, coord.y, coord.z);
            }
        }
        group.send(region);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
/*Wands.setPrototype(ItemID.sroll24, {
    type: "function", 
    compatibility: [ItemID.sroll1, ItemID.sroll3],
    activate: {
        magic: 55,
        necromancer: 15,
    },
    setFunction: function(packet){
        for(let i = 0;i<=Math.floor(Math.random()*15);i++){
            let pos = Entity.getPosition(packet.entity);
            let pos1 = pos;
            pos.x += ((Math.random()*8)-(Math.random()*8));
            pos.y += ((Math.random()*8)-(Math.random()*8));
            pos.z += ((Math.random()*8)-(Math.random()*8));
            let c = MagicCore.getValue(packet.player);
            if(Math.random()<=0.1){
                BlockSource.getDefaultForActor(packet.entity).explode(pos1.x, pos1.y, pos1.z, 4, false)
            }else if(c.AspectsNow >= c.Aspects+3){
                Mp.spawnParticle(ParticlesAPI.part2, pos1.x, pos1.y, pos1.z, 0, 0, 0);
               c.Aspects+=3;
               MagicCore.setParameters(packet.player, c);
            }
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll25, {
    type: "function", 
    compatibility: [ItemID.sroll1, ItemID.sroll3],
    activate: {
        magic: 55,
        necromancer: 50,
    },
    setFunction: function(packet){
        for(let i = 0;i<=Math.floor(Math.random()*18);i++){
            let pos = Entity.getPosition(packet.entity);
            let pos1 = pos;
            pos.x += ((Math.random()*8)-(Math.random()*8));
            pos.y += ((Math.random()*8)-(Math.random()*8));
            pos.z += ((Math.random()*8)-(Math.random()*8));
            let c = MagicCore.getValue(packet.player);
            if(Math.random()<=0.1){
                BlockSource.getDefaultForActor(packet.entity).explode(pos1.x, pos1.y, pos1.z, 4, false)
            }else if(c.AspectsNow >= c.Aspects+6){
                Mp.spawnParticle(ParticlesAPI.part2, pos1.x, pos1.y, pos1.z, 0, 0, 0);
               c.Aspects+=6;
               MagicCore.setParameters(packet.player, c);
            }
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});*/
Wands.setPrototype(ItemID.sroll26, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollExplosive",
        tab: "sroll"
    },
    activate: {
        magic: 20,
        necromancer: 5,
        protection: 40,
        aspects: 30
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
        let region = BlockSource.getDefaultForActor(packet.entity);
        let group = new ParticlesCore.Group();
        for(let i = 0;i<25;i++){
            let coord = {
                x: pos.x+(i * vel.x / 2),
                y: pos.y+0.5+(i * vel.y / 2),
                z: pos.z+(i * vel.z / 2)
            };
             if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                region.explode(coord.x, coord.y, coord.z, 8, false)
                break;
            }
            group.add(ParticlesAPI.part3, coord.x, coord.y, coord.z);
        }
        group.send(region);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll27, {
    type: "function", 
    compatibility: [],
    scrutiny: {
        name: "acolyteStaff",
    },
    time: 10,
    activate: {
        magic: 10,
    },
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll28, {
    type: "function", 
    compatibility: [],
    scrutiny: {
        name: "acolyteStaff",
    },
    time: 20,
    activate: {
        magic: 10,
    },
    installation: function (player, item){
        delItem(player, item);
    }
});

Wands.setPrototype(ItemID.sroll29, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollCleansing",
        tab: "sroll"
    },
    activate: {
        magic: 10,
        protection: 20
    },
    setFunction: function (packet){
        EffectAPI.clearAll(packet.entity);
    },
    installation: function (player, item){
        delItem(player, item);
    }
});
/*Wands.setPrototype(ItemID.sroll30, {
    type: "function", 
    compatibility: [ItemID.sroll1, ItemID.sroll3],
    activate: {
        magic: 15,
        protection: 10
    },
    setFunction: function (packet){
        EffectAPI.add(packet.player, "fly", 20 * 30, 1);
    },
    installation: function (player, item){
        delItem(player, item);
    }
});*/
Wands.setPrototype(ItemID.SpellSet31, {
    type: "function", 
    compatibility: [],
    scrutiny: {
        name: "SpellSet"
    },
    setFunction(packet){
			let extra = packet.wand.extra || new ItemExtraData();
			let wand = Wands.getStick(packet.wand.id);
			if(wand.scrutiny.enable || ScrutinyAPI.isScrutiny(player, wand.scrutiny.window, wand.scrutiny.tab, wand.scrutiny.name)){
				let event = Wands.getPrototype(extra.getInt("event", 0));
        let spells = Wands.getArrByExtra(packet.sroll[packet.spellI].extra);
        let time = 0;
        for(let i in spells){
        	if(Wands.isCompatibility(extra.getInt("event", 0), spells[i].id)){
        			
        		let prot = Wands.getPrototype(spells[i].id);
        		if(prot.scrutiny.enable && !ScrutinyAPI.isScrutiny(packet.entity, prot.scrutiny.window, prot.scrutiny.tab, prot.scrutiny.name)){
        			PlayerAC.message(packet.entity, TranslationLoad.get("aw.message.need_study", [["name", prot.scrutiny.name]]));
        			continue;
        		}
        		if(AncientWonders.isParameters(packet.entity, prot.activate, wand.bonus)){
        			let c = MagicCore.getValue(packet.entity);
        			if(0 <= prot.activate.aspects - (wand.bonus.aspects||0)) c.aspects -= prot.activate.aspects - (wand.bonus.aspects||0);
              MagicCore.setParameters(packet.entity, c);
             
              event.using(packet);
              wand.use(packet);
              packet.item = spells[i];
              	
              packet.coords = {x:packet.coordsOriginal.x+(packet.x||0),y:packet.coordsOriginal.y+(packet.y||0),z:packet.coordsOriginal.z+(packet.z||0)};
              java.lang.Thread.sleep((prot.time||0)*50);
              if(prot.setFunction)
              	prot.setFunction(packet);
        		}else{
        			AncientWonders.message(packet.entity, prot.activate, wand.bonus, function(player, obj, bonus, name){
        			return TranslationLoad.get("aw.message.wand", [["name", name], ["value", obj[name] - (bonus[name]||0)], ["scroll", Item.getName(spells[i].id)]]);
        		})
        		}
        	}else{
        		PlayerAC.message(packet.entity, TranslationLoad.get("aw.message.wand.not_compatible_with", [["event", Item.getName(extra.getInt("event", 0))],["scroll", Item.getName(spells[i].id)]]));
        	}
        }
			}else{
      	PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", wand.scrutiny.name]]));
			}
    },
    getName(name, wand, item){
    	return name + item.extra.getString("name", "нет имени")
    },
    installation: function (player, item){
        delItem(player, item);
    }
});
/*IDRegistry.genBlockID("runeBlockAw");
Block.createBlock("runeBlockAw", [ {name: "rune block", texture: [["runeBlockAw", 0]], inCreative: true, renderlayer: 1} ]);
Translation.addTranslation("rune block", {ru: "рунный блок"});
TileEntity.registerPrototype(BlockID.runeBlockAw, {
    init: function(){
        this.blockSource.setBlock(this.x, this.y, this.z, 0, 0);
    }
});
Wands.setPrototype(ItemID.sroll31, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    activate: {
        magic: 15,
        aspects: 50,
        protection: 60
    },
    setFunction: function(packet){
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
        let bs = BlockSource.getDefaultForActor(packet.entity);
        let pos = Entity.getPosition(packet.entity);
        pos = {
            x: (pos.x-.5)+(vel.x*3),
            y: (pos.y-.5)+(vel.y*3),
            z: (pos.z-.5)+(vel.z*3)
        };
        let arr = [];
        if(bs.getBlockId(pos.x, pos.y, pos.z) == 0){
            bs.setBlock(pos.x, pos.y, pos.z, BlockID.runeBlockAw, 0);
            arr.push({x: pos.x, y: pos.y, z: pos.z});
        } 
        if(bs.getBlockId(pos.x, pos.y+1, pos.z) == 0){
            bs.setBlock(pos.x, pos.y+1, pos.z, BlockID.runeBlockAw, 0);
            arr.push({x: pos.x, y: pos.y+1, z: pos.z});
        } 
        if(bs.getBlockId(pos.x, pos.y-1, pos.z) == 0){
            bs.setBlock(pos.x, pos.y-1, pos.z, BlockID.runeBlockAw, 0);
            arr.push({x: pos.x, y: pos.y-1, z: pos.z});
        } 
        setTimeout(function(){
            for(let i in arr){
                if(bs.getBlockId(arr[i].x, arr[i].y, arr[i].z) == BlockID.runeBlockAw) bs.setBlock(arr[i].x, arr[i].y, arr[i].z, 0, 0);
            }
        }, 60);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});*/
Wands.setPrototype(ItemID.sroll32, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollFireProjectile",
        tab: "sroll"
    },
    activate: {
        magic: 30,
        aspects: 30,
        protection: 30
    },
    setFunction: function(packet){
    	let pos = Entity.getPosition(packet.entity);
			let vector = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
			ProjectTileFire.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, vector.x, vector.y, vector.z, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
        //part.deploy(packet.entity, ParticlesAPI.project, Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity)), Entity.getPosition(packet.entity));
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll34, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollFlameStream",
        tab: "sroll"
    },
    activate: {
        magic: 50,
        aspects: 200,
        protection: 40
    },
    setFunction: function(packet){
        for(let i = 0;i <= Math.floor(Math.random()*10)+10;i++){
            let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
            let pos = Entity.getPosition(packet.entity);
            vel.x += Math.random() - Math.random();
            vel.y += Math.random() - Math.random();
            vel.z += Math.random() - Math.random();
            ProjectTileFire.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, vel.x, vel.y, vel.z, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
            //ProjectTileFire.spawnByObject(packet.entity, ParticlesAPI.project, vel, Entity.getPosition(packet.entity));
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll33, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollFirestorm",
        tab: "sroll"
    },
    activate: {
        magic: 35,
        aspects: 200,
        protection: 35
    },
    setFunction: function(packet){
        for(let i = 0;i <= Math.floor(Math.random()*10)+10;i++){
            let pos = Entity.getPosition(packet.entity);
             pos = {
                 x: pos.x + (Math.random()*8 - Math.random()*8),
                 y: pos.y + 20,
                 z: pos.z + (Math.random()*8 - Math.random()*8)
            };
            ProjectTileFire.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, 0, -5, 0, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll35, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollstarfall",
        tab: "sroll"
    },
    activate: {
        magic: 70,
        aspects: 200,
        protection: 40
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
        for(let i = 0;i<35;i++){
            pos = {
                x: pos.x+(i * vel.x / 2),
                y: pos.y+(i * vel.y / 2),
                z: pos.z+(i * vel.z / 2)
            };
             if(BlockSource.getDefaultForActor(packet.entity).getBlockId(pos.x,pos.y,pos.z)!=0 || i == 50||Entity.getAllInRange(pos, 2)>=1){
                 pos.y+=25;
                 ProjectTileStarfall.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, 0, -6, 0, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100))
                 //starfall.deploy(packet.entity, ParticlesAPI.project2, {x: 0, y: -1.5, z: 0}, pos);
                break;
            }
        }
        
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll36, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 1
	},
	setFunction(packet){
		packet.y = (packet.y||0)+packet.item.extra.getInt("mode", -1)
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
})
Wands.setPrototype(ItemID.sroll37, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 1
	},
	setFunction(packet){
		packet.x = (packet.x||0)+packet.item.extra.getInt("mode", -1)
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
})
Wands.setPrototype(ItemID.sroll38, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 1
	},
	setFunction(packet){
		packet.z = (packet.z||0)+packet.item.extra.getInt("mode", -1)
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
})
Wands.setPrototype(ItemID.sroll39, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 5
	},
	setFunction(packet){
		let region = BlockSource.getDefaultForActor(packet.player);
		let block = region.getBlock(packet.coords.x, packet.coords.y, packet.coords.z);
		let tag = region.getBlockEntity(packet.coords.x, packet.coords.y, packet.coords.z);
		if(tag){
			tag = tag.getCompoundTag();
			tag.putListTag("Items", new NBT.ListTag())
		}
		if(region.getBlock(packet.coords.x, packet.coords.y+packet.item.extra.getInt("mode", -1), packet.coords.z).id==0&&block.id!=0){
			region.setBlock(packet.coords.x, packet.coords.y+packet.item.extra.getInt("mode", -1), packet.coords.z, block);
			region.setBlock(packet.coords.x, packet.coords.y, packet.coords.z, 0);
			if(tag)
				region.getBlockEntity(packet.coords.x, packet.coords.y+packet.item.extra.getInt("mode", -1), packet.coords.z).setCompoundTag(tag);
		}
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
})
Wands.setPrototype(ItemID.sroll40, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 5
	},
	setFunction(packet){
		let region = BlockSource.getDefaultForActor(packet.player);
		let block = region.getBlock(packet.coords.x, packet.coords.y, packet.coords.z);
		let tag = region.getBlockEntity(packet.coords.x, packet.coords.y, packet.coords.z);
		if(tag){
			tag = tag.getCompoundTag();
			tag.putListTag("Items", new NBT.ListTag())
		}
		if(region.getBlock(packet.coords.x+packet.item.extra.getInt("mode", -1), packet.coords.y, packet.coords.z).id==0&&block.id!=0){
			region.setBlock(packet.coords.x+packet.item.extra.getInt("mode", -1), packet.coords.y, packet.coords.z, block);
			region.setBlock(packet.coords.x, packet.coords.y, packet.coords.z, 0);
			if(tag)
				region.getBlockEntity(packet.coords.x+packet.item.extra.getInt("mode", -1), packet.coords.y, packet.coords.z).setCompoundTag(tag);
		}
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
})
Wands.setPrototype(ItemID.sroll41, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 5
	},
	setFunction(packet){
		let region = BlockSource.getDefaultForActor(packet.player);
		let block = region.getBlock(packet.coords.x, packet.coords.y, packet.coords.z);
		let tag = region.getBlockEntity(packet.coords.x, packet.coords.y, packet.coords.z);
		if(tag){
			tag = tag.getCompoundTag();
			tag.putListTag("Items", new NBT.ListTag())
		}
		if(region.getBlock(packet.coords.x, packet.coords.y, packet.coords.z+packet.item.extra.getInt("mode", -1)).id==0&&block.id!=0){
			region.setBlock(packet.coords.x, packet.coords.y, packet.coords.z+packet.item.extra.getInt("mode", -1), block);
			region.setBlock(packet.coords.x, packet.coords.y, packet.coords.z, 0);
			if(tag)
				region.getBlockEntity(packet.coords.x, packet.coords.y, packet.coords.z+packet.item.extra.getInt("mode", -1)).setCompoundTag(tag);
		}
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
});

Wands.setPrototype(ItemID.sroll42, {
	type: "function",
	compatibility: [], 
 scrutiny: {
  name: "fog",
  tab: "sroll"
 },
	activate: {
		magic: 15,
		protection: 40,
		necromancer: 0,
		aspects: 200
	},
	setFunction(packet){
		let arr = [];
		let max = randInt(350, 400);
		let pos = Entity.getPosition(packet.entity);
		let group = new ParticlesCore.Group();
		for(let i = 0;i < max;i++)
			group.add(ParticlesAPI.fog, pos.x+(randInt(0, 15)-randInt(0, 15)), pos.y+(randInt(0, 6)-randInt(0, 6)), pos.z+(randInt(0, 15)-randInt(0, 15)));
		group.send(Entity.getDimension(packet.entity));
	},
	installation(player, item){
		delItem(player, item);
	},
});

Network.addClientPacket("aw.illusion", function(obj){
	if(obj.dimension != Player.getDimension()){
		Illusion.clients[obj.pos.x+":"+obj.pos.y+":"+obj.pos.z+":"+obj.dimension] = obj;
		return;
	}
	obj.animation = new Animation.Item(obj.pos.x+.5, obj.pos.y+.5, obj.pos.z+.5);
	obj.animation.describeItem({
		id: obj.block.id,
		data: obj.block.data,
		size: 1
	});
	obj.animation.load();
	Illusion.clients[obj.pos.x+":"+obj.pos.y+":"+obj.pos.z+":"+obj.dimension] = obj;
});
Network.addClientPacket("aw.illusion.delete", function(obj){
	let data = Illusion.clients[obj.pos.x+":"+obj.pos.y+":"+obj.pos.z+":"+obj.dimension];
	if(!data)
		return;
	if(data.animation)
		data.animation.destroy();
	delete Illusion.clients[obj.pos.x+":"+obj.pos.y+":"+obj.pos.z+":"+obj.dimension];
});

Callback.addCallback("ServerPlayerLoaded", function(p){
	Illusion.load(Illusion.blocks);
});

let Illusion = {
	clients: {},
	blocks: {},
	load(scope){
		for(let i in scope){
			let obj = scope[i];
			let region = BlockSource.getDefaultForDimension(obj.dimension)
			this.blocks[this.getKey(obj.pos.x, obj.pos.y, obj.pos.z, region)] = obj;
			this.loadAnimation(obj.pos.x, obj.pos.y, obj.pos.z, region);
		}
	},
	
	loadAnimation(x, y, z, region){
		let obj = this.blocks[this.getKey(x, y, z, region)];
		if(obj){
			Network.sendToAllClients("aw.illusion", obj);
		}
	},
	
	save(scope){
		let obj = {};
		
		let keys = Object.keys(this.blocks);
		for(let i in keys){
			this.blocks[keys[i]].animation = null;
			obj[keys[i]] = this.blocks[keys[i]];
		}
		
		scope.illusion = obj;
	},
	
	add(x, y, z, block, region){
		if(this.blocks[this.getKey(x, y, z, region)])
			return;
		block = block || {};
		this.blocks[this.getKey(x, y, z, region)] = {
			dimension: Number(region.getDimension()),
			pos: {
				x: Number(x),
				y: Number(y),
				z: Number(z)
			},
			block: {
				id: Number(Block.convertBlockToItemId(block.id || 1)),
				data: Number(block.data || 0)
			}
		};
		this.loadAnimation(x, y, z, region);
	},
	getKey(x, y, z, region){
		return x+":"+y+":"+z+":"+region.getDimension();
	},
	del(x, y, z, region){
		let name = this.getKey(x, y, z, region);
		let obj = this.blocks[name];
		if(obj){
			Network.sendToAllClients("aw.illusion.delete", {
				dimension: obj.dimension,
				pos: obj.pos
			});
			delete this.blocks[name];
		}
	}
};

Wands.setPrototype(ItemID.sroll43, {
	type: "function",
	compatibility: [ItemID.sroll2, ItemID.sroll3],
	activate: {
		magic: 60,
		aspects: 100
	},
	setFunction(packet){
		Illusion.add(packet.coords.x, packet.coords.y, packet.coords.z, {
			id: packet.item.extra.getInt("id", 1),
			data: packet.item.extra.getInt("data", 0)
		}, BlockSource.getDefaultForActor(packet.player));
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
		item.extra = item.extra || new ItemExtraData();
  	return name + ", " + Item.getName(item.extra.getInt("id", 1), item.extra.getInt("data", 0));
	}
});
Wands.setPrototype(ItemID.sroll44, {
	type: "function",
	compatibility: [ItemID.sroll2, ItemID.sroll3],
	activate: {
		magic: 20,
		aspects: 50
	},
	setFunction(packet){
		Illusion.del(packet.coords.x, packet.coords.y, packet.coords.z, BlockSource.getDefaultForActor(packet.player));
	},
	installation(player, item){
		delItem(player, item);
	}
});

Wands.setPrototype(ItemID.sroll45, {
	type: "function",
	compatibility: [ItemID.sroll1],
	scrutiny: {
		name: "freezing",
		tab: "sroll"
	},
	activate: {
		 magic: 25,
		 aspects: 40,
		 protection: 40
	},
	setFunction(packet){
		let pos = Entity.getPosition(packet.entity);
		let vector = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
		ProjectTileSnow_1.spawn(ParticlesAPI.snowProjectTile, pos.x, pos.y, pos.z, vector.x, vector.y, vector.z, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
	},
	installation(player, item){
		delItem(player, item);
	}
});

Wands.setPrototype(ItemID.sroll46, {
	type: "function",
	compatibility: [ItemID.sroll1],
	scrutiny: {
		name: "snowstorm",
		tab: "sroll"
	},
	activate: {
		 magic: 25,
		 aspects: 60,
		 protection: 50
	},
	setFunction(packet){
		let pos = Entity.getPosition(packet.entity);
		let count = Math.floor(Math.random()*10)+10;
		for(let i = 0;i < count;i++){
			ProjectTileSnow_1.spawn(ParticlesAPI.snowProjectTile, pos.x, pos.y, pos.z, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
		}
	},
	installation(player, item){
		delItem(player, item);
	}
});
Wands.setPrototype(ItemID.madin_tashu, {
	type: "function",
	compatibility: [ItemID.sroll1],
	activate: {
		 magic: 0
	},
	setFunction(packet){
		let pos = Entity.getPosition(packet.entity);
		let count = Math.floor(Math.random()*10)+10;
		for(let i = 0;i < count;i++){
			ProjectTileSnow_1.spawn(madin_tashu, pos.x, pos.y, pos.z, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
		}
	},
	installation(player, item){
		delItem(player, item);
	}
});

Wands.setPrototype(ItemID.sroll47, {
	type: "function",
	compatibility: [ItemID.sroll1],
	activate: {
		 magic: 20,
		 protection: 60,
		 aspects: 100
	},
	setFunction(packet){
		let vector = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
		let pos = Entity.getPosition(packet.entity);
		ProjectTileFireBoom.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, vector.x, vector.y, vector.z, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(25));
	},
	installation(player, item){
		delItem(player, item);
	}
});




// file: items/glasses.js

IDRegistry.genItemID("aw_glasses"); 
Item.createArmorItem("aw_glasses", "aw.item.glasses", {name: "glasses", meta: 0}, {type: "helmet", armor: 1, durability: 699, texture: "armor/noy.png"})
MagicCore.setArmor(ItemID.aw_glasses, "magic", 20, {scrutiny: "glasses", tab: "riches"});
MagicCore.setArmorMagic(ItemID.aw_glasses, "magic", 9);
Item.setEnchantType(ItemID.aw_glasses, Native.EnchantType.chestplate, 14);

let Glasses = {
	getModelYes(){
		let mesh = new RenderMesh();
		mesh.setColor(0, 1, 0, 1);
		return RenderUtil.meshCopy(yes.getRenderMesh(), mesh);
	},
	getModelNoy(){
		let mesh = new RenderMesh();
		mesh.setColor(1, 0, 0, 1);
		return RenderUtil.meshCopy(noy.getRenderMesh(), mesh);
	}
};

function getBlocks(pos, region, radius, id, tile){
	let arr = [];
	pos.x = Math.floor(pos.x);
	pos.y = Math.floor(pos.y);
	pos.z = Math.floor(pos.z);
	for(let x = pos.x - radius;x < pos.x + radius;x++)
		for(let y = pos.y - radius;y < pos.y + radius;y++)
			for(let z = pos.z - radius;z < pos.z + radius;z++)
				if(region.getBlock(x,y,z).id == id)
					if(tile){
						let te = TileEntity.getTileEntity(x, y, z, region);
						arr.push([x, y, z, (te||{}).data || {}]);
					}else
						arr.push([x, y, z, {}]);
	return arr;
}
 
(function(){
	let cache = {};
	Network.addClientPacket("aw.glasses.update", function(data){
		let keys = Object.keys(cache);
		for(let i in keys)
			cache[keys[i]].destroy();
		cache = {};
		for(let i in data){
			let pos = {
				x: Math.floor(data[i][0]),
				y: Math.floor(data[i][1]),
				z: Math.floor(data[i][2])
			};
			let id = pos.x+"."+pos.y+"."+pos.z;
			let item = Entity.getCarriedItem(Player.get());
			if(!Potion.isIngredient(item))
				continue;
			data[i][3].items = data[i][3].items || [];
			cache[id] = new Animation.Base(pos.x+.5, pos.y+1.7, pos.z+.5);
			cache[id].describe({
				mesh: Potion.isIngredientInstallation(pos, item, Player.get(), data[i][3]) ?Glasses.getModelYes() : Glasses.getModelNoy(),
				skin: "terrain-atlas/concrete_white.png"
			});
			cache[id].load();
		}
	});
	Network.addClientPacket("aw.glasses.end", function(data){
		let keys = Object.keys(cache);
		for(let i in keys)
			cache[keys[i]].destroy();
		cache = {};
	});
})();

Armor.registerOnTickListener(ItemID.aw_glasses, function(item, slot, player){
	if(World.getThreadTime() % 5 == 0){
		let region = BlockSource.getDefaultForActor(player);
		let arr = getBlocks(Entity.getPosition(player), 
			region, 3, BlockID.cauldronAw, true);
		let client = Network.getClientForPlayer(player);
		if(client)
			client.send("aw.glasses.update", arr);
	}
});
Armor.registerOnTakeOffListener(ItemID.aw_glasses, function(item, slot, player){
	let client = Network.getClientForPlayer(player);
	if(client)
		client.send("aw.glasses.end", {});
})




// file: items/potions/item.js

IDRegistry.genItemID("aw_bottle_empty"); 
Item.createItem("aw_bottle_empty", "aw.item.bottle_empty", {name: "aw_bottle_empty", meta: 0}, {stack: 1});

IDRegistry.genItemID("aw_bottle_potion"); 
Item.createItem("aw_bottle_potion", "aw.item.bottle_potion", {name: "aw_bottle_potion", meta: 0}, {stack: 1});
Item.setUseAnimation(ItemID.aw_bottle_potion, 2);
Item.setMaxUseDuration(ItemID.aw_bottle_potion, 30);

(function(){
	let hashModel = [];
	const orgPotion = ItemModel.getFor(ItemID.aw_bottle_potion, 0);
	
	function getModel(item){
		const uniqueKey = new java.lang.String(item.extra.getString("RGB", "0.0.0")).hashCode();
		const cache = hashModel[uniqueKey];
		if(cache)
			return cache;
		const coords = [];
		coords.push({x: 0, y: 0, r: 1, g: 1, b: 1, a: 1, w: 1, h: .5});
		coords.push({x: 0, y: .5, r: item.extra.getInt("R", 0)/255, g: item.extra.getInt("G", 0)/255, b: item.extra.getInt("B", 0)/255, a: .8, w: 1, h: .5});
		const mesh = [new RenderMesh(), new RenderMesh()];
		mesh.forEach(function(m, i){
			let z;
			for(let j = 0; j < coords.length; j++){
				z = i & 1 ? -0.001 * (coords.length - j) : 0.001 * (coords.length - j);
				m.setColor(coords[j].r, coords[j].g, coords[j].b, coords[j].a);
				let w = coords[j].w;
				let h = coords[j].h;
				m.setNormal(1, 1, 0);
				m.addVertex(0, 1, z, coords[j].x, coords[j].y);
				m.addVertex(1, 1, z, coords[j].x + w, coords[j].y);
				m.addVertex(0, 0, z, coords[j].x, coords[j].y + h);
				m.addVertex(1, 1, z, coords[j].x + w, coords[j].y);
				m.addVertex(0, 0, z, coords[j].x, coords[j].y + h);
				m.addVertex(1, 0, z, coords[j].x + w, coords[j].y + h);
			}
			if((i & 1) === 0){
				m.translate(0.4, -0.1, 0.2);
				m.rotate(0.5, 0.5, 0.5, 0, -2.1, 0.4);
				m.scale(2, 2, 2);
			}
		});
		const model = ItemModel.newStandalone();
		const path = "items-opaque/aw_bottle_potion_3.png";
		model.setModel(mesh[0], path);
		model.setUiModel(mesh[1], path);
		model.setSpriteUiRender(true);
		model.setModUiSpriteName("aw_bottle_potion", 0);
		hashModel[uniqueKey] = model;
		return model;
	}
	orgPotion.setModelOverrideCallback(function(item){
		try{
			item.extra = item.extra || new ItemExtraData();
			return getModel(item);
		}catch(e){alert(e)}
	});
})();
Callback.addCallback("ItemUsingComplete", function(item, player){
	if(item.id==ItemID.aw_bottle_potion)
		Potion.run(player, item);
});




// file: items/potions/types.js

Potion.registerPotionType("event", {
	installation(pos, item, player, data){
		if(data.items.length <= 0)
			return true;
		return data.items[data.items.length-1].id == ItemID.aw_mysterious_powder;
	}
});
Potion.registerPotionType("ingredient", {
	installation(pos, item, player, data){
		if(data.items.length <= 0)
			return false;
		if(Potion.getPrototype(data.items[data.items.length-1].id).id != -1)
			return Potion.getPrototype(data.items[data.items.length-1].id).type == "event" || Potion.getPrototype(data.items[data.items.length-2].id).type == "spider_legs" || Potion.getPrototype(data.items[data.items.length-1].id).type == "spider_legs"
		return false;
	}
});
Potion.registerPotionType("power", {
	installation(pos, item, player, data){
		if(data.items.length <= 0)
			return false;
		if(Potion.getPrototype(data.items[data.items.length-1].id).id != -1)
			return Potion.getPrototype(data.items[data.items.length-1].id).type == "ingredient" || Potion.getPrototype(data.items[data.items.length-1].id).type == "update"
		return false;
	}
});
Potion.registerPotionType("update", {
	installation(pos, item, player, data){
		if(data.items.length <= 0)
			return false;
		if(Potion.getPrototype(data.items[data.items.length-1].id).id != -1)
			return Potion.getPrototype(data.items[data.items.length-1].id).type == "event" || Potion.getPrototype(data.items[data.items.length-1].id).type == "ingredient" || Potion.getPrototype(data.items[data.items.length-2].id).type == "spider_legs" || Potion.getPrototype(data.items[data.items.length-1].id).type == "spider_legs"
		return false;
	}
});
Potion.registerPotionType("spider_legs", {
	installation(pos, item, player, data){
		if(data.items.length <= 0)
			return false;
		if(Potion.getPrototype(data.items[data.items.length-1].id).id != -1)
			return Potion.getPrototype(data.items[data.items.length-1].id).type == "ingredient" || Potion.getPrototype(data.items[data.items.length-1].id).type == "update"
		return false;
	}
});




// file: items/potions/mod.js


Potion.setPrototype({
	id: ItemID.aw_brain,
	type: "event",
	color: {
		r: 9*3,
		g: -15*3,
		b: -12*3
	},
	getEntitys(item, player, i, ingredients){
		return [player];
	}
})
Potion.setPrototype({
	id: VanillaItemID.gunpowder,
	type: "event",
	color: {
		r: 9*3,
		g: -15*3,
		b: -12*3
	},
	getEntitys(item, player, i, ingredients){
		let arr = Entity.getAllInRange(Entity.getPosition(player),3)
		let mobs = []
		for(let e in arr){
			if(Entity.getDimension(player)==Entity.getDimension(arr[e]))
				mobs.push(arr[e])
		}
		return mobs;
	}
})
Potion.setPrototype({
	id: ItemID.aw_mysterious_powder,
	type: "power",
	color: {
		r: 8*3,
		g: 8*3,
		b: 8*3
	}
})
Potion.setPrototype({
	id: ItemID.spider_legs,
	type: "spider_legs",
	level: 1,
	color: {
		r: 40,
		g: -50,
		b: 20
	},
	setFunction(packet){
		
	}
})

Potion.setPrototype({
	id: ItemID.dead_essence,
	color: {
		r: -10,
		g: 40,
		b: 10
	},
	setFunction(packet){
		EffectAPI.add(packet.entity, "dead", packet.getTime()+500, packet.getLevel()+5)
	}
})
Potion.setPrototype({
	id: ItemID.crystal_powder,
	color: {
		r: 20,
		g: -30,
		b: 40
	},
	setFunction(packet){
		EffectAPI.add(packet.entity, "magic", packet.getTime()+500, packet.getLevel()+5)
	}
})

Potion.setPrototype({
	id: ItemID.witherbone,
	color: {//меняем цвет
		r: -80,
		g: -80,
		b: -80
	},
	setFunction(packet){
  EffectAPI.clear(packet.entity, "noy_magic");
		EffectAPI.add(packet.entity, "noy_magic_immunity", packet.getTime()+150, packet.getLevel()+2)
	}
})
Potion.setPrototype({
	id: ItemID.aw_dragon_powder,
	type: "update",
	level: 3,
	time: 1000,
	color: {
		r: -40,
		g: -40,
		b: 60
	},
	setFunction(packet){
		
	}
})
Potion.setPrototype({
	id: ItemID.aw_petal_powder,
	type: "update",
	level: 0,
	time: 400,
	color: {
		r: -10,
		g: 30,
		b: 30
	},
	setFunction(packet){
		
	}
});
Potion.setPrototype({
	id: ItemID.magic_crystal,//id
	color: {//меняем цвет
		r: -10,
		g: -20,
		b: 50
	},
	setFunction(packet){
		EffectAPI.add(packet.entity, "aspects", packet.getTime()+200, packet.getLevel()+2)//выдаём эффект востановление аспектов
	}
})
Potion.setPrototype({
	id: ItemID.enchantment_forest_flower,
	color: {
		r: 25,
		g: -40,
		b: 30
	},
setFunction(packet){
		Entity.addEffect(packet.entity, Native.PotionEffect.invisibility, packet.getLevel()+1, packet.getTime()+800, false, false)
	}
})




// file: items/potions/vanilla.js

Potion.setPrototype({
	id: VanillaItemID.rabbit_foot,
	color: {
		r: -20*3,
		g: 10*3,
		b: -15*3
	},
	setFunction(packet){
		Entity.addEffect(packet.entity, Native.PotionEffect.jump, packet.getLevel(), packet.getTime()+160, false, false)
	}
})
Potion.setPrototype({
	id: VanillaItemID.sugar,
	color: {
		r: 30,
		g: 30,
		b: -30
	},
	setFunction(packet){
		Entity.addEffect(packet.entity, Native.PotionEffect.movementSpeed, packet.getLevel(), packet.getTime()+160, false, false)
	}
})
Potion.setPrototype({
	id: VanillaItemID.blaze_powder,
	color: {
		r: 40,
		g: -30,
		b: 10
	},
	setFunction(packet){
		Entity.addEffect(packet.entity, Native.PotionEffect.damageBoost, packet.getLevel(), packet.getTime()+160, false, false)
	}
})
Potion.setPrototype({
	id: VanillaItemID.spider_eye,
	color: {
		r: 40,
		g: -30,
		b: 10
	},
	setFunction(packet){
		Entity.addEffect(packet.entity, Native.PotionEffect.poison, packet.getLevel(), packet.getTime()+160, false, false)
	}
})

Potion.setPrototype({
	id: VanillaItemID.redstone,
	type: "update",
	time: 160,
	level: -1,
	color: {
		r: -16*3,
		g: 12*3,
		b: 3*3
	},
	setFunction(packet){
		
	}
})

Potion.setPrototype({
	id: VanillaItemID.glowstone_dust,
	type: "update",
	level: 2,
	time: -80,
	color: {
		r: 16*3,
		g: -9*3,
		b: -12*3
	},
	setFunction(packet){
		
	}
})




// file: items/potions/book.js

IDRegistry.genItemID("aw_potions_book"); 
Item.createItem("aw_potions_book", "aw.item.aw_potions_book", {name: "book_written", meta: 0}, {stack: 1});
Item.setGlint(ItemID.aw_potions_book, true);

function openUrl(url){
	let openURL = new android.content.Intent(android.content.Intent.ACTION_VIEW);
	openURL.data = android.net.Uri.parse(url);
	UI.getContext().startActivity(openURL);
}

const Text = BookElements.Style.Text;
const Slot = BookElements.Style.Slot;

function getPotionDescription(id, text){
	return [
		new BookElements.Slot([new Slot(id).setSize(1.5)]),
		new BookElements.Text(Translation.translate(Item.getName(id, 0)), new Text().setSize(1.5)),
		new BookElements.Text(text)
	]
}

function ContentLink(link){
	Text.apply(this);
	this.setColor(0, 0, 1);
	this.setUnderline(true);
	this.setSize(1.4);
	this.setLink(link);
}

let PotionsBook = new Book("potions_book")
	.addPage("default", new Page()
		.add(true, "text", "potions_book.name", new Text()
			.setSize(1.9)
		)
		.add(true, "text", "potions_book.telegram", new Text()
			.setColor(0, 0, 1)
			.setUnderline(true)
			.setSize(1.4)
			.setOnClick(function(){
				openUrl("https://t.me/innercoreDungeonCraft")
			})
		)
		.add(true, "text", "potions_book.vk", new Text()
			.setColor(0, 0, 1)
			.setUnderline(true)
			.setSize(1.4)
			.setOnClick(function(){
				openUrl("https://vk.com/horizonmoddingkernel")
			})
		)
		
		.add(false, "text", "potions_book.content", new Text()
			.setSize(2)
		)
		.add(false, "text", "potions_book.page1", new ContentLink("page1"))
		.add(false, "text", "potions_book.page2", new ContentLink("page2"))
		.add(false, "text", "potions_book.page3", new ContentLink("page3"))
		.add(false, "text", "potions_book.page4", new ContentLink("page4"))
		.add(false, "text", "potions_book.page5", new ContentLink("page5"))
		.add(false, "text", "potions_book.page6", new ContentLink("page6"))
		.add(false, "text", "potions_book.page7", new ContentLink("page7"))
		.add(false, "text", "potions_book.page8", new ContentLink("page8"))
		.add(false, "text", "potions_book.page9", new ContentLink("page9"))
		.add(false, "text", "potions_book.page10", new ContentLink("page10"))
		
		.setPreLink("page10")
		.setNextLink("page1")
	)
	
	.addPage("page1", new Page()
		.add(true, "text", "potions_book.types", new Text()
			.setSize(1.5)
		)
		.add(true, "text", "potions_book.type_descriptions")
		
		.addElement(false, function(){
			return getPotionDescription(ItemID.aw_glasses, "potions_book.glasses");
		})
		
		.setPreLink("default")
		.setNextLink("page2")
	)
	
	.addPage("page2", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.aw_brain, "potions_book.brain");
		})
		
		.addElement(false, function(){
			return getPotionDescription(VanillaItemID.gunpowder, "potions_book.gunpowder");
		})
	
		.setPreLink("page1")
		.setNextLink("page3")
	)
	.addPage("page3", new Page()
		.addElement(true, function(){
			return getPotionDescription(VanillaItemID.rabbit_foot, "potions_book.rabbit_foot")
		})
		
		.addElement(false, function(){
			return getPotionDescription(VanillaItemID.sugar, "potions_book.sugar")
		})
		
		.setPreLink("page2")
		.setNextLink("page4")
	)
	.addPage("page4", new Page()
		.addElement(true, function(){
			return getPotionDescription(VanillaItemID.blaze_powder, "potions_book.blaze_powder")
		})
		
		.addElement(false, function(){
			return getPotionDescription(VanillaItemID.spider_eye, "potions_book.spider_eye")
		})
		
		.setPreLink("page3")
		.setNextLink("page5")
	)
	.addPage("page5", new Page()
		.addElement(true, function(){
			return getPotionDescription(VanillaItemID.redstone, "potions_book.redstone")
		})
		
		.addElement(false, function(){
			return getPotionDescription(VanillaItemID.glowstone_dust, "potions_book.glowstone_dust")
		})
		
		.setPreLink("page4")
		.setNextLink("page6")
	)
	.addPage("page6", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.dead_essence, "potions_book.dead_essence")
		})
		
		.addElement(false, function(){
			return getPotionDescription(ItemID.crystal_powder, "potions_book.crystal_powder")
		})
		
		.setPreLink("page5")
		.setNextLink("page7")
	)
	.addPage("page7", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.witherbone, "potions_book.witherbone")
		})
		
		.addElement(false, function(){
			return getPotionDescription(ItemID.aw_dragon_powder, "potions_book.aw_dragon_powder")
		})
		
		.setPreLink("page6")
		.setNextLink("page8")
	)
	.addPage("page8", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.aw_petal_powder, "potions_book.aw_petal_powder")
		})
		
		.addElement(false, function(){
			return getPotionDescription(ItemID.magic_crystal, "potions_book.magic_crystal")
		})
		
		.setPreLink("page7")
		.setNextLink("page9")
	)
	.addPage("page9", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.enchantment_forest_flower, "potions_book.enchantment_forest_flower")
		})
		.addElement(false, function(){
			return getPotionDescription(ItemID.aw_mysterious_powder, "potions_book.aw_mysterious_powder")
		})
		
		.setPreLink("page8")
		.setNextLink("page10")
	)
	.addPage("page10", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.spider_legs, "potions_book.spider_legs")
		})
		
		.setPreLink("page9")
		.setNextLink("default")
	)
	.registerItem(ItemID.aw_potions_book);




// file: items/plant.js

IDRegistry.genItemID("enchantment_forest_flower"); 
Item.createItem("enchantment_forest_flower", "aw.item.enchantment_forest_flower", {name: "enchantment_forest_flower", meta: 0}, {stack: 64});

IDRegistry.genItemID("aw_petal_powder"); 
Item.createItem("aw_petal_powder", "aw.item.petal_powder", {name: "aw_petal_powder", meta: 0}, {stack: 64});

Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
let region = BlockSource.getDefaultForActor(player);
let tile = region.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
let id = region.getBlockId(coords.relative.x, coords.relative.y-1, coords.relative.z);
if(item.id == ItemID.enchantment_forest_flower && !Game.isActionPrevented() && World.canTileBeReplaced(tile.id, tile.data) && (id == 2 || id == 3)){
region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.enchantment_forest_flower);
delItem(player, item);
}
}, 1);




// file: items/rune.js

IDRegistry.genItemID("rune1"); 
Item.createItem("rune1", "aw.item.rune_fire", {name: "rune", meta: 1}, {stack: 1});
Item.setGlint(ItemID.rune1, true);

IDRegistry.genItemID("rune2"); 
Item.createItem("rune2", "aw.item.rune_earth", {name: "rune", meta: 2}, {stack: 1});
Item.setGlint(ItemID.rune2, true);

IDRegistry.genItemID("rune3"); 
Item.createItem("rune3", "aw.item.rune_wind", {name: "rune", meta: 3}, {stack: 1});
Item.setGlint(ItemID.rune3, true);

IDRegistry.genItemID("rune4"); 
Item.createItem("rune4", "aw.item.rune_light", {name: "rune", meta: 4}, {stack: 1});
Item.setGlint(ItemID.rune4, true);

IDRegistry.genItemID("rune5"); 
Item.createItem("rune5", "aw.item.rune_darkness", {name: "rune", meta: 5}, {stack: 1});
Item.setGlint(ItemID.rune5, true);

IDRegistry.genItemID("rune6"); 
Item.createItem("rune6", "aw.item.rune_copying", {name: "rune", meta: 6}, {stack: 1});
Item.setGlint(ItemID.rune6, true);

IDRegistry.genItemID("rune_absorption"); 
Item.createItem("rune_absorption", "aw.item.rune_absorption", {name: "rune_absorption", meta: 0}, {stack: 1});
Item.setGlint(ItemID.rune_absorption, true);

IDRegistry.genItemID("rune_greed"); 
Item.createItem("rune_greed", "aw.item.rune_greed", {name: "rune_greed", meta: 0}, {stack: 1});
Item.setGlint(ItemID.rune_greed, true);

IDRegistry.genItemID("rune_life"); 
Item.createItem("rune_life", "aw.item.rune_life", {name: "rune_life", meta: 0}, {stack: 1});
Item.setGlint(ItemID.rune_life, true);

IDRegistry.genItemID("rune_dead"); 
Item.createItem("rune_dead", "aw.item.rune_dead", {name: "rune_dead", meta: 0}, {stack: 1});
Item.setGlint(ItemID.rune_dead, true);

Item.addCreativeGroup("rune", Translation.translate("aw.creative_group.rune"), [
    ItemID.rune1,
    ItemID.rune2,
    ItemID.rune3,
    ItemID.rune4, 
    ItemID.rune5, 
    ItemID.rune6,
    ItemID.rune_absorption,
    ItemID.rune_greed,
    ItemID.rune_life,
    ItemID.rune_dead
]);




// file: arr.js

let arrRune = [ItemID.rune1, ItemID.rune2, ItemID.rune3, ItemID.rune4, ItemID.rune5, ItemID.rune6];
let CauldronFireBlock = [VanillaBlockID.fire, 11, 10, VanillaBlockID.magma];
let runes_singularity = {
"ItemID.rune1": 10,
"ItemID.rune2": 10,
"ItemID.rune3": 10,
"ItemID.rune4": 10,
"ItemID.rune5": 20,
"ItemID.rune6": 30,
"ItemID.rune_absorption":200,
"ItemID.rune_greed":200,
"ItemID.rune_life":200,
"ItemID.rune_dead":200,
"BlockID.aw_enchanted_rune_fire": 300,
"BlockID.aw_enchanted_rune_earth": 300,
"BlockID.aw_enchanted_rune_wind": 300,
"BlockID.aw_enchanted_rune_light": 300,
"BlockID.aw_enchanted_rune_darkness": 400,
"BlockID.aw_enchanted_rune_copying": 500,
};

Callback.addCallback("LevelLoaded", function(){
let keys = Object.keys(runes_singularity);
for(let i in keys)
runes_singularity[eval(keys[i])] = runes_singularity[keys[i]];
});




// file: block/runes.js

var BLOCK_TYPE_STONE = Block.createSpecialType({
    solid: true,
    renderlayer: 3,
    destroytime: 1.5,
    explosionres: 20,
    translucency: 0,
    base: 1
});

IDRegistry.genBlockID("aw_enchanted_stone");
Block.createBlock("aw_enchanted_stone", [ {name: "aw.block.enchanted_stone", texture: [["aw_enchanted_stone", 0]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_stone, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_fire");
Block.createBlock("aw_enchanted_rune_fire", [ {name: "aw.item.rune_fire", texture: [["aw_enchanted_stone", 1]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_fire, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_earth");
Block.createBlock("aw_enchanted_rune_earth", [ {name: "aw.item.rune_earth", texture: [["aw_enchanted_stone", 2]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_earth, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_wind");
Block.createBlock("aw_enchanted_rune_wind", [ {name: "aw.item.rune_wind", texture: [["aw_enchanted_stone", 3]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_wind, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_light");
Block.createBlock("aw_enchanted_rune_light", [ {name: "aw.item.rune_light", texture: [["aw_enchanted_stone", 4]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_light, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_darkness");
Block.createBlock("aw_enchanted_rune_darkness", [ {name: "aw.item.rune_darkness", texture: [["aw_enchanted_stone", 5]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_darkness, "stone", 1);

IDRegistry.genBlockID("aw_enchanted_rune_copying");
Block.createBlock("aw_enchanted_rune_copying", [ {name: "aw.item.rune_copying", texture: [["aw_enchanted_stone", 6]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_enchanted_rune_copying, "stone", 1);

function registerRune(id, r){
	TileEntity.registerPrototype(id, {
		tick(){
			if(World.getThreadTime() % 20 == 0){
				let ents = Entity.getAll();
				for(let i in ents){
					let ent = ents[i];
					let pos = Entity.getPosition(ent);
					if(Entity.getDistanceToCoords(ent, this) < r && EffectAPI.getLevel(ent, "noy_magic_immunity") <= 0)
						EffectAPI.add(ent, "noy_magic", 22, 1);
				}
			}
		}
	});
}

registerRune(BlockID.aw_enchanted_rune_fire, 5);
registerRune(BlockID.aw_enchanted_rune_earth, 5);
registerRune(BlockID.aw_enchanted_rune_wind, 5);
registerRune(BlockID.aw_enchanted_rune_light, 5);
registerRune(BlockID.aw_enchanted_rune_darkness, 10);
registerRune(BlockID.aw_enchanted_rune_copying, 15);

Item.addCreativeGroup("runeblocks", Translation.translate("aw.creative_group.rune"), [
	BlockID.aw_enchanted_rune_fire,
	BlockID.aw_enchanted_rune_earth,
	BlockID.aw_enchanted_rune_wind,
	BlockID.aw_enchanted_rune_light,
	BlockID.aw_enchanted_rune_darkness,
	BlockID.aw_enchanted_rune_copying
]);




// file: block/decor.js

IDRegistry.genBlockID("aw_magic_stone");
Block.createBlock("aw_magic_stone", [ {name: "aw.block.aw_magic_stone", texture: [["aw_magic_stone", 0]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_magic_stone, "stone", 1);

IDRegistry.genBlockID("aw_magic_brick");
Block.createBlock("aw_magic_brick", [ {name: "aw.block.aw_magic_brick", texture: [["aw_magic_brick", 0]], inCreative: true}], BLOCK_TYPE_STONE);

ToolAPI.registerBlockMaterial(BlockID.aw_magic_brick, "stone", 1);




// file: block/magic_smithy.js

IDRegistry.genBlockID("magic_smithy");
Block.createBlock("magic_smithy", [ {name: "aw.block.magic_smithy", texture: [["stone", 0]], inCreative: true}]);

Block.setDestroyLevel("magic_smithy", 0);
ToolAPI.registerBlockMaterial(BlockID.magic_smithy, "stone", 0, false);

let ModelAnimation = RenderAPI.ModelAnimation;
let MagicSmithy = {
	start: (function(){
		let model = new RenderAPI.Model();
		model.addBoxByBlock("down", 0, 0, 0, 1, 1/16, 1, 98, 0);
		model.addBoxByBlock("up", 0, 15/16, 0, 1, 1, 1, 98, 0);
		model.addBoxByBlock("pillar_0", 0, 1/16, 0, 2/16, 15/16, 2/16, VanillaBlockID.obsidian, 0);
		model.addBoxByBlock("pillar_1", 14/16, 1/16, 14/16, 1, 15/16, 1, VanillaBlockID.obsidian, 0);
		model.addBoxByBlock("pillar_2", 14/16, 1/16, 0, 1, 15/16, 2/16, VanillaBlockID.obsidian, 0);
		model.addBoxByBlock("pillar_3", 0, 1/16, 14/16, 2/16, 15/16, 1, VanillaBlockID.obsidian, 0);
		
		model.addBoxByBlock("down_1", 1/16, 1/16, 1/16, 15/16, 2/16, 15/16, 98, 0);
		model.addBoxByBlock("up_1", 1/16, 14/16, 1/16, 15/16, 15/16, 15/16, 98, 0);
		return model;
	})(),
	end: null,
	recipes: [],
	addRecipe(item1, item2, result, time, func){
		this.recipes.push({
			items: [item1||1, item2||1],
			result: result,
			time: time||150,
			func: func
		})
	},
	get(item1, item2){
		let arr = this.recipes;
		for(let i in arr)
			if(RitualAPI.isRecipe([item1,item2],arr[i].items))
				return arr[i];
		return null;
	},
	isRecipe(container, data){
		let slot1 = container.getSlot("slot1");
		let slot2 = container.getSlot("slot2");
		let slot3 = container.getSlot("slot3");
		let arr = this.recipes;
		for(let i in arr){
			let result = arr[i].result||arr[i].func(arr[i]);
			if(RitualAPI.isRecipe([slot1.id,slot2.id],arr[i].items)&&slot3.id==0){
				if(data.time <= arr[i].time){
					if(data.aspect - 1 >= 0){
						data.aspect-=1;
					}else{
						if(data.time > 0)
							data.time--;
						container.setScale("bar", data.time/arr[i].time);
						return true;
					}
					data.time++;
					container.setScale("bar", data.time/arr[i].time);
					return true;
				}
				container.setSlot("slot1", slot1.id, slot1.count-1, slot1.data, slot1.extra);
				container.setSlot("slot2", slot2.id, slot2.count-1, slot2.data, slot2.extra);
				container.setSlot("slot3", result.id||1,slot3.count+(result.count||1),result.data||0,result.extra||null)
				container.validateAll();
				data.time = 0;
				return false;
			}
		}
		data.time = 0;
		container.setScale("bar", 0);
		return false;
	}
};
//(function(start){
	let model = new RenderAPI.Model();
	model.setBoxes(JSON.parse(JSON.stringify(MagicSmithy.start.getBoxes())));
	
	model.addBoxByBlock("down_1", 1/16, 1/16, 1/16, 15/16, 8/16, 15/16, VanillaBlockID.obsidian, 0);
	model.addBoxByBlock("up_1", 1/16, 8/16, 1/16, 15/16, 15/16, 15/16, VanillaBlockID.obsidian, 0);
	
	MagicSmithy.end = model;
//})(MagicSmithy.start)
(function(){
	let arr = [ItemID.piece1, ItemID.piece2, ItemID.piece3];
	for(let i in arr){
		for(let ii in arr){
			if(!MagicSmithy.get(arr[i], arr[ii]))
				MagicSmithy.addRecipe(arr[i], arr[ii], null, null, function(recipe){
					let scrut = arrScrut[Math.floor(Math.random()*arrScrut.length)];
					let e = new ItemExtraData();
					e.putString("window", scrut.win);
					e.putString("tab", scrut.tab);
					e.putString("name", scrut.name);e.putString("name2", scrut.name2);
					e.putInt("aspect", 100);
					return {
						id: ItemID.piece4,
						extra: e
					}
				})
		}
	}
	for(let i in arrRune){
		MagicSmithy.addRecipe(arrRune[i], arrRune[i], null, null, function(recipe){
			return {id: arrRune[Math.floor(Math.random()*arrRune.length)]}
		});
	}
})()
let MagicSmithyUI = createUI({
	drawing: [
{type: "text", x: 380, y: 40, text: Translation.translate("aw.block.magic_smithy"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}},
		{type: "bitmap", bitmap: "arrow_bar_background", x: 405, y: 205 , scale: 7}
	],
	elements: {
		"slot1": {type: "slot", x: 300, y: 150, size: 100},
		"slot2": {type: "slot", x: 300, y: 260, size: 100},
		"slot3": {type: "slot", x: 600, y: 205, size: 100},
		"bar": {type: "scale", bitmap: "arrow_bar_scale", x: 405, y: 205 , scale: 7, value: 0}
	}
});
BlockRenderer.enableCoordMapping(BlockID.magic_smithy, -1, MagicSmithy.start.getICRenderModel())

SingularityAPI.setBlockOutputName(BlockID.magic_smithy, "output", true);
TileEntity.registerPrototype(BlockID.magic_smithy, {
	useNetworkItemContainer: true,
	defaultValues: {
		aspect: 0,
		aspectMax: 200,
		time: 0
	},
	client: {
		updateModel(){
			let id = Network.serverToLocalId(this.networkData.getInt("itemId"));
			let data = this.networkData.getInt("itemData");
			this.model.describeItem({
				id: id,
				count: 1,
				data: data,
				size: .5,
				rotation: [Math.PI / 2, 0, 0]
			});
			id = Network.serverToLocalId(this.networkData.getInt("itemId_2"));
			data = this.networkData.getInt("itemData_2");
			this.model_2.describeItem({
				id: id,
				count: 1,
				data: data,
				size: .5,
				rotation: [Math.PI / 2, 0, 0]
			});
		},
		load(){
			this.animation = this.animation || new ModelAnimation();
			this.animation.setTime(80);
			this.animation.setModel(MagicSmithy.start, MagicSmithy.end);
			
			this.model = new Animation.Item(this.x + .5, this.y + .5, this.z + .5);
			this.model_2 = new Animation.Item(this.x + .5, this.y + .6, this.z + .5);
			
			this.updateModel();
			this.model.load();
			this.model_2.load()
			
			let thas = this;
			this.networkData.addOnDataChangedListener(function(data, isExternal){
				thas.bool = thas.networkData.getBoolean("bool")
				thas.updateModel();
			});
		},
		tick(){
			if(this.bool)
			this.animation.updateModel(this.x,this.y,this.z, true);
		},
		unload(){
			BlockRenderer.unmapAtCoords(this.x,this.y,this.z)
			this.model.destroy();
			this.model_2.destroy();
		}
	},
	tick(){
		if(World.getWorldTime()%2==0){
			if(MagicSmithy.isRecipe(this.container, this.data))
				this.updateModel(true);
			else
				this.updateModel(false);
			this.container.sendChanges();
		}
	},
	updateModel(value){
		this.data.bool = !!value;
		this.networkData.putBoolean("bool", this.data.bool)
		let item = this.container.getSlot("slot1")
		let item2 = this.container.getSlot("slot2")
		this.networkData.putInt("itemId", item.id);
		this.networkData.putInt("itemData", item.data);
		this.networkData.putInt("itemId_2", item2.id);
		this.networkData.putInt("itemData_2", item2.data);
		this.networkData.sendChanges();
	},
	getScreenName(player, coords){
		return "main";
	},
	getScreenByName(screenName){
		return MagicSmithyUI;
	}
});




// file: block/rityal_pedestal.js

IDRegistry.genBlockID("rityalPedestal");
Block.createBlock("rityalPedestal", [ {name: "aw.block.rityal_pedestal", texture: [["stone", 0]], inCreative: true} ]);

/*IDRegistry.genBlockID("rityalPedestal2");
Block.createBlock("rityalPedestal2", [ {name: "aw.block.rityal_pedestal", texture: [["aw_enchanted_stone", 0]], inCreative: true} ]);*/

RenderAPI.SetAltar(BlockID.rityalPedestal);
MagicCore.setPlaceBlockFunc(BlockID.rityalPedestal, null, null, {name: "ritual"});
RitualAPI.addPedestal(BlockID.rityalPedestal);
TileEntity.registerPrototype(BlockID.rityalPedestal, objectFix(getProtPedestal(1), {
    
    click: function(id, count, data, coords, player) {
    	if(this.blocking) return;
        Game.prevent();
        this.isItem();
        if(this.data.item.id != 0){
            if(id != ItemID.bookk)
                this.drop(player);
        }else{
            if(id != ItemID.bookk){
                let item = Entity.getCarriedItem(player);
                delItem(player, {id:id,data:data,count:count}) ;
                item.count = 1;
                this.animation(item);
            }
        }
    }
}));

/*
pedestal_2.setBlockModel(BlockID.rityalPedestal2);
MagicCore.setPlaceBlockFunc(BlockID.rityalPedestal2, null, null, {name: "ritual"});
TileEntity.registerPrototype(BlockID.rityalPedestal2, {
    defaultValues: {
        item: {
            id: 0,
            data: 0,
            extra: 0
        }
    }, 
    init: function(){
        this.isItem();
        this.animation(this.data.item);
    },
    client: {
        updateModel: function() {
            var id = Network.serverToLocalId(this.networkData.getInt("itemId"));
            var data = this.networkData.getInt("itemData");
            this.model.describeItem({
                id: id,
                count: 1,
                data: data, 
                size: 1
            });
        },
        load: function() {
            this.model = new Animation.Item(this.x + .5, this.y + 1.5, this.z + .5);
            this.updateModel();
            this.model.load();
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
        this.networkData.putInt("itemId", item.id);
        this.networkData.putInt("itemData", item.data);
        this.networkData.sendChanges();
        this.data.item = {
            id: item.id,
            data: item.data,
            extra: item.extra || new ItemExtraData()
        };
    }, 
    drop: function(player){
        this.networkData.putInt("itemId", 0);
        this.networkData.putInt("itemData", 0);
        this.networkData.sendChanges();
        this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, this.data.item.id, 1, this.data.item.data, this.data.item.extra || new ItemExtraData());
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
            extra: null
        };
    }, 
    isItem: function(){
        if(!this.data.item) this.data.item = {id: 0, data: 0, extra: null};
        if(!this.data.item.id) this.data.item.id = 0;
        if(!this.data.item.data) this.data.item.data = 0;
        if(!this.data.item.extra) this.data.item.extra = null;
    },
    click: function(id, count, data, coords, player) {
        Game.prevent();
        this.isItem();
        if(this.data.item.id != 0){
            if(id != ItemID.bookk)
                this.drop(player);
        }else{
            if(id != ItemID.bookk){
                let item = Entity.getCarriedItem(player);
                delItem(player, {id:id,data:data,count:count}) ;
                this.animation(item);
            }
        }
    },
    destroyBlock: function(coords, player){
        this.drop();
    }
});*/




// file: block/MagicConnector.js

IDRegistry.genBlockID("MagicConnector");
Block.createBlock("MagicConnector", [ {name: "aw.block.magic_connector", texture: [["MagicReenactor", 0], ["MagicReenactor", 1],["MagicReenactor", 0]], inCreative: true} ], {
base: 5,
sound: "wood"
});

ToolAPI.registerBlockMaterial(BlockID.MagicConnector, "wood", 0);

TileEntity.registerPrototype(BlockID.MagicConnector, {
    defaultValues: {
        item: {
            id: 0,
            data: 0,
            extra: null
        }
    }, 
    init: function(){
        this.isItem();
        if(this.data.item){
            if(this.data.item.id) this.networkData.putInt("itemId", this.data.item.id);
            if(this.data.item.data) this.networkData.putInt("itemData", this.data.item.data);
            this.networkData.sendChanges();
        }
    }, 
    client: {
        updateModel: function() {
            var id = Network.serverToLocalId(this.networkData.getInt("itemId"));
            var data = this.networkData.getInt("itemData");
            this.model.describeItem({
                id: id,
                count: 1,
                data: data, 
                size: 1
            });
        },
        load: function() {
            this.model = new Animation.Item(this.x + .5, this.y + 1.5, this.z + .5);
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
    customAnimation: function(item){
        this.networkData.putInt("itemId", item.id);
        this.networkData.putInt("itemData", item.data);
        this.networkData.sendChanges();
        this.data.item = {
            id: item.id,
            data: item.data,
            extra: item.extra || new ItemExtraData()
        };
    }, 
    animation: function(item){
        this.networkData.putInt("itemId", item.id);
        this.networkData.putInt("itemData", item.data);
        this.networkData.sendChanges();
        this.data.item = {
            id: item.id,
            data: item.data,
            extra: item.extra || new ItemExtraData()
        };
    }, 
    drop: function(){
        this.networkData.putInt("itemId", 0);
        this.networkData.putInt("itemData", 0);
        this.networkData.sendChanges();
        this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, this.data.item.id, 1, this.data.item.data, this.data.item.extra);
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
            extra: null
        };
    }, 
    isItem: function(){
        if(!this.data.item) this.data.item = {id: 0, data: 0, extra: null};
        if(!this.data.item.id) this.data.item.id = 0;
        if(!this.data.item.data) this.data.item.data = 0;
        if(!this.data.item.extra) this.data.item.extra = null;
    },
    click: function(id, count, data, coords, player) {
    	Game.prevent();
        this.isItem();
        if(Wands.stick[id]){
            if(this.data.item.id == 0){
                this.animation({id: id, data: data, extra: Entity.getCarriedItem(player).extra});
                Entity.setCarriedItem(player, id, count-1, data);
            }
        }else{
            if(Wands.prot[id] && this.data.item.id != 0){
                let prot = Wands.prot[id];
                if(prot.type == "event"){
                    this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, this.data.item.extra.getInt("event", 0), 1, 0, null);
                    this.data.item.extra.putInt("event", id);
                }else if(prot.type == "function"){
                	let arr = Wands.getArrByExtra(this.data.item.extra);
                	if(arr.length < Wands.stick[this.data.item.id].scroll_max){
                  	arr.push(Entity.getCarriedItem(player));
                  	let event = this.data.item.extra.getInt("event", 0); 
                   this.data.item.extra = Wands.getExtraByArr(arr);
                   this.data.item.extra.putInt("event", event);
                  }else{
                  	PlayerAC.message(player, Translation.translate("aw.message.scroll_max"));
                  }
                   
                }
                prot.installation(player, Entity.getCarriedItem(player));
            }else{
                if(id == ItemID.bookk && this.data.item.id != 0){
                    if(Entity.getSneaking(player)){
                    	let evn = this.data.item.extra.getInt("event", 0);
                       this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, evn, 1, 0, null);
                       let arr = Wands.getArrByExtra(this.data.item.extra);
                       for(let i in arr){
                           this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, arr[i].id, 1, arr[i].data, arr[i].extra);
                       }
                       this.data.item.extra = Wands.getExtraByArr([]);
                    }else{
                    	let arr = Wands.getArrByExtra(this.data.item.extra);
                    	if(arr.length >= 1){
                    		let obj = arr.pop();
                    		this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, obj.id, 1, obj.data, obj.extra);
                    		let event = this.data.item.extra.getInt("event", 0); 
                    		this.data.item.extra = Wands.getExtraByArr(arr);
                    		this.data.item.extra.putInt("event", event);
                    	}
                    }
                }else{
                    this.drop();
                }
            }
        }
    },
    destroyBlock: function(coords, player){
        this.drop();
    }
});




// file: block/bowl.js

IDRegistry.genBlockID("bowlWishes");
Block.createBlock("bowlWishes", [ {name: "aw.block.bowl", texture: [["bowl", 1]], inCreative: true, renderlayer: 1} ]);

Block.setDestroyLevel("bowlWishes", 0);
ToolAPI.registerBlockMaterial(BlockID.bowlWishes, "stone", 0, false);

let meshBowl = new RenderMesh();
meshBowl.importFromFile(__dir__+"/assets/model/bowl.obj", "obj", null)
meshBowl.setBlockTexture("bowl", 0);
var renderBowl = new ICRender.Model(); 
var modelBowl = new BlockRenderer.Model(meshBowl);  
renderBowl.addEntry(modelBowl);
BlockRenderer.setStaticICRender(BlockID.bowlWishes, -1, renderBowl); 


TileEntity.registerPrototype(BlockID.bowlWishes, {
    defaultValues: {
        active: false,
        player: -1
    },
    tick: function(){
        if(this.data.active){
            if(ScrutinyAPI.isScrutiny(this.data.player, "aw", "basics", "bowlWishes")){
                Mp.spawnParticle(ParticlesAPI.part2, this.x+Math.random(), this.y + .4, this.z + Math.random(), 0, Math.random()/10, 0, 0, 0, 0, this.dimension);
                if(Math.random()<=0.001){
                    this.data.active = false;
                    delete classPlayer[this.data.player];
                }
            }
        }
    },
    click: function(id, count, data, coords, player){
        let item = Entity.getCarriedItem(player);
        if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "bowlWishes")){
            if(!this.data.active && item.id == ItemID.rune5 && MagicCore.isClass(player)){
                this.data.active = true;
                this.data.player = player;
                Entity.setCarriedItem(player, item.id, item.count-1, item.data);
            }
        }else{
            PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", "bowlWishes"]]));
        }
    }
});






// file: block/cauldron.js

IDRegistry.genBlockID("cauldronAw");
Block.createBlock("cauldronAw", [ {name: "aw.block.cauldron", texture: [["bowl", 1]], inCreative: true, renderlayer: 1} ]);

RenderAPI.setCauldron(BlockID.cauldronAw);
Block.setDestroyLevel("cauldronAw", 0);
ToolAPI.registerBlockMaterial(BlockID.cauldronAw, "stone", 0, false);

const cachedParticleTypes = []
function getParticleType(descriptor){
	const hash = new java.lang.String(JSON.stringify(descriptor)).hashCode()
	const cache = cachedParticleTypes[hash]
	if(cache !== undefined)
		return cache
	const type = Particles.registerParticleType({
 	 texture: "aw_magis",
	  render: 2,
  	size: [2, 2],
 	 lifetime: [50, 50],
 	 color: [descriptor.r/255, descriptor.g/255, descriptor.b/255, 1],
	  animators: {
  	  size: {fadeOut: .5, fadeln:.2, start: 0, end: 1}
 	 }
	});
	cachedParticleTypes[hash] = type;
	return type
}

Network.addClientPacket("aw.spawnCauldron", function(data){
	if(Entity.getDimension(Player.get()) != data.dimension)
		return;
	Particles.addParticle(getParticleType(data), data.x+Math.random(), data.y+1, data.z+Math.random(), 0, Math.random()/10, 0);
});

function spawnCauldron(dimension, x, y, z, r, g, b){
	Network.sendToAllClients("aw.spawnCauldron", {
		dimension: dimension,
		x: x,
		y: y,
		z: z,
		r: r,
		g: g,
		b: b
	});
}

TileEntity.registerPrototype(BlockID.cauldronAw, {
	defaultValues: {
		r: 0,
		g: 180,
		b: 244,
		items: [],
		wate: 0,
		heat: 0,
		particleId: 0,
	},
	client: {
		updateModel(){
			let r = this.networkData.getInt("r");
			let g = this.networkData.getInt("g");
			let b = this.networkData.getInt("b");
			let wate = this.networkData.getInt("wate");
			let mesh = (function(){
				let meshFile = new RenderMesh();
				meshFile.setColor(r/255,g/255,b/255, .8);
				if(wate >= 1)
					meshFile.importFromFile(__dir__ + "/assets/model/water_cauldron.obj", "obj", {
						scale: [.25, 0.00016 * wate, .25]
					});
				meshFile.fitIn(0, -2.1, 0, 1, 1, 1, true);
				return meshFile;
			})();
			this.model.describe({
				mesh: mesh,
				material: "crucible_block_aw",
				skin: "terrain-atlas/water_placeholder.png"
			});
		},
		load(){
			this.model = new Animation.Base(this.x, this.y+1, this.z);
			this.updateModel();
			let that = this;
			this.networkData.addOnDataChangedListener(function(data, isExternal){
				that.updateModel();
				that.model.load();
			});
			this.model.load();
		},
		unload(){
			this.model.destroy();
		}
	},
	init(){
		if(this.data.wate >= 1)
			this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
	},
	tick(){
		if(this.data.wate >= 1){
			if(this.data.heat >= 100){
				if(Math.random() <= .4)
					spawnCauldron(this.dimension, this.x, this.y, this.z, this.data.r, this.data.g, this.data.b);
				if(Math.random() >= .1)
					return;
				this.data.wate--;
				this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
				if(this.data.wate <= 0){
					this.data.r = 0;
					this.data.g = 180;
					this.data.b = 244;
					this.data.items = [];
				}
			}
			if(CauldronFireBlock.indexOf(this.blockSource.getBlockId(this.x, this.y-1, this.z))!=-1&&this.data.heat <= 101){
				this.data.heat++;
			}else if(this.data.heat >= 1){
				this.data.heat--;
			}
		}else if(this.data.heat >= 1){
			this.data.heat--;
		}
	},
	click(id, count, data, coords, player){
		Game.prevent();
		if(!ScrutinyAPI.isScrutiny(player, "aw", "basics", "cauldron"))
			return;
		if(Entity.getSneaking(player)){
			this.data.wate=0;
			this.data.heat = 0;
			this.data.r = 0;
			this.data.g = 180;
			this.data.b = 244;
			this.data.items = [];
			this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
			return;
		}
		let item = Entity.getCarriedItem(player)
		if(item.id == 850 && this.data.wate <= 999){
			this.data.wate=1000;
			this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
			this.data.heat = 0;
			Entity.setCarriedItem(player, 325, 1, 0);
			return;
		}
		if(item.id == ItemID.aw_bottle_empty && this.data.wate>=200&& (this.data.r >= 1 || this.data.g >= 1 || this.data.b >= 1)){
			this.data.wate-=200;
			this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
			let extra = Wands.getExtraByArr(this.data.items);
			extra.putInt("R", this.data.r < 0 ? 0 : this.data.r);
			extra.putInt("G", this.data.g < 0 ? 0 : this.data.g);
			extra.putInt("B", this.data.b < 0 ? 0 : this.data.b);
			extra.putString("RGB", extra.getInt("R", 0)+"."+extra.getInt("G", 0)+"."+extra.getInt("B", 0));
			Entity.setCarriedItem(player, ItemID.aw_bottle_potion, 1, 0, extra);
			return;
		}
		let prot = Potion.getPrototype(item.id)
		if(prot.id != -1 && (this.data.r >= 1 || this.data.g >= 1 || this.data.b >= 1) && this.data.wate >= 1 && this.data.heat >= 100){
			if(Potion.potionsType[prot.type].installation(coords, item, player, this.data)){
				this.data.r += prot.color.r;
				this.data.g += prot.color.g;
				this.data.b += prot.color.b;
				this.data.items.push(item);
			}else{
				this.data.r = 0;
				this.data.g = 0;
				this.data.b = 0;
			}
			Entity.setCarriedItem(player, item.id, item.count-1, item.data, item.extra);
			this.animation(this.data.r, this.data.g, this.data.b, this.data.wate);
			return;
		}
	},
	animation(r, g, b, wate){
		this.networkData.putInt("r", r||0);
		this.networkData.putInt("g", g||0);
		this.networkData.putInt("b", b||0);
		this.networkData.putInt("wate", wate || 0);
		this.networkData.sendChanges();
	}
})





// file: block/magic_controller.js

IDRegistry.genBlockID("magicController");
Block.createBlock("magicController", [ {name: "aw.block.magic_controller", texture: [["rityalPedestal", 0]], inCreative: true} ]);
RenderAPI.setMagicController(BlockID.magicController);

Block.setDestroyLevel("magicController", 0);
ToolAPI.registerBlockMaterial(BlockID.magicController, "stone", 0, false);

let magicControllerUI = createUI({
    drawing: [
        {type: "text", x: 380, y: 40, text: Translation.translate("aw.block.magic_controller"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}}
    ],
    elements: {
        "slot": {type: "slot", x: 450, y: 250, size: 100},
        "text": {type: "text", x: 250, y: 250, width: 400, height: 60, text: "0"}
    }
});

TileEntity.registerPrototype(BlockID.magicController, {
    useNetworkItemContainer: true,
    defaultValues: {
        storage: 0,
        storageMax: 1000,
        active: false,
        i: 0,
        img: 0
    },
    tick: function(){
        if(!this.data.active){
            Mp.spawnParticle(ParticlesAPI.part1, this.x + (Math.random() * 8 - Math.random() * 8), this.y + (Math.random() * 8 - Math.random() * 8), this.z + (Math.random() * 8 - Math.random() * 8), 0, 0, 0, 0, 0, 0, this.dimension);
            this.data.storage++;
            if(this.data.storage >= this.data.storageMax){
                this.data.active = true;
            }
        }else{
            Mp.spawnParticle(ParticlesAPI.part2, this.x+.5, this.y+.6, this.z+.5, 0, .3, 0, 0, 0, 0, this.dimension);
            Mp.spawnParticle(ParticlesAPI.part2, this.x+.5, this.y+.3, this.z+.5, 0, .3, 0, 0, 0, 0, this.dimension);
            this.data.storage--;
            if(this.data.storage <= 0){
                this.data.active = false;
            }
        }
        this.container.setText("text", this.data.storage + "/" + this.data.storageMax);
        let slot = this.container.getSlot("slot");
        let icons = Wands.getIconArr(slot.id);
        this.data.img = icons.length;
        if(slot.id <= 0){
            this.data.i = 0;
            this.data.img = 0;
        }
        if(Wands.stick[slot.id]){
            slot.extra = slot.extra || new ItemExtraData();
            slot.extra.putString("texture", icons[this.data.i].name);
            slot.extra.putInt("meta", icons[this.data.i].meta);
            this.container.setSlot("slot", slot.id, slot.count, slot.data, slot.extra);
        }
        this.container.sendChanges();
    },
    click: function(id, data, count, coords, player){
        if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "MagicController")){
        let slot = this.container.getSlot("slot");
        if(Wands.stick[slot.id] && id == ItemID.bookk && this.data.storage >= 50){
            this.data.storage -= 50;
            if(this.data.i + 1 << this.data.img){
                this.data.i++;
            }
            if(this.data.i >= this.data.img){
                this.data.i = 0;
            }
        }else if(slot.id == ItemID.SpellSet31 && Wands.getPrototype(id).type == "function" && id != ItemID.SpellSet31 && this.data.storage >= 100){
            if(!Entity.getSneaking(player)){
                slot.extra = slot.extra || new ItemExtraData();
                let item = Entity.getCarriedItem(player);
                /*let id = slot.extra.getInt("id", -1);
                if(id == -1){
                    id = Object.keys(Wands.spellSet).length;
                    slot.extra.putInt("id", id);
                    Wands.spellSet["id"+id] = [];
                }
                Wands.spellSet["id"+id].push(item);*/
                let arr = Wands.getArrByExtra(slot.extra);
                arr.push(item);
                let name = slot.extra.getString("name", "нет имени")
                slot.extra = Wands.getExtraByArr(arr);
                slot.extra.putString("name", name);
            }
        }else if(slot.id == ItemID.SpellSet31 && id == VanillaItemID.name_tag && this.data.storage >= 50 && (!Entity.getSneaking(player))){
            this.data.storage-=50;
            slot.extra = slot.extra || new ItemExtraData();
            let extra = Entity.getCarriedItem(player).extra || new ItemExtraData();
            slot.extra.putString("name", extra.getCustomName() || "нет имени")
            Entity.setCarriedItem(player, id, Entity.getCarriedItem(player).count-1, data, extra);
        }
        if(Entity.getSneaking(player) && slot.id == ItemID.SpellSet31){
            slot.extra = slot.extra || new ItemExtraData();
            /*let id = slot.extra.getInt("id", -1);
            if(id == -1){
                id = Object.keys(Wands.spellSet).length;
                slot.extra.putInt("id", id);
                Wands.spellSet["id"+id] = [];
            }
            if(Wands.spellSet["id"+id].length >= 1){
                let obj = Wands.spellSet["id"+id].pop();
                this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, obj.id, 1, 0, obj.extra || null);
            }*/
            let arr = Wands.getArrByExtra(slot.extra);
            if(arr.length == 0)
              return;
            let obj = arr.pop();
            this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, obj.id, 1, obj.data, obj.extra);
            let name = slot.extra.getString("name", "нет имени")
            slot.extra = Wands.getExtraByArr(arr);
            slot.extra.putString("name", name);
        }
        }else{
            PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", "MagicController"]]));
        }
    },
    getScreenName: function(player, coords){
        let item = Entity.getCarriedItem(player);
        let slot = this.container.getSlot("slot");
        slot.extra = slot.extra || new ItemExtraData();
        if(item.id != ItemID.bookk && ScrutinyAPI.isScrutiny(player, "aw", "basics", "MagicController")){
            if(!Wands.prot[item.id]){
                return "main";
            }
        } 
        if(Wands.prot[item.id] && item.id != ItemID.SpellSet31 && slot.id == ItemID.SpellSet31 && this.data.storage >= 100){
            this.data.storage -= 100;
            Entity.setCarriedItem(player, item.id, item.count-1, item.data);
        } 
    },
    getScreenByName: function(screenName){
        return magicControllerUI;
    }
});




// file: block/singularity/research_table.js

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
SingularityAPI.setBlockInputName(BlockID.research_table, "base", true);
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







// file: block/singularity/shrinker.js

let SingularityShrinkerUI = createUI({
	drawing: [
		{type: "text", x: 380, y: 40, text: Translation.translate("aw.block.singularity_shrinker"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}}
	],
	elements: {
		"slotRune": {type: "slot", x: 450, y: 250, size: 100},
		"textSinLvl": {type: "text", x: 220, y: 100, width: 400, height: 60, text: "0"},
		
		"textSinAspect": {type: "text", x: 220, y: 165, width: 400, height: 60, text: "0"}
		
	},
});

IDRegistry.genBlockID("singularity_shrinker");
Block.createBlock("singularity_shrinker", [ {name: "aw.block.singularity_shrinker", texture: [["stone", 0]], inCreative: true} ]);
RenderAPI.setSingularityShrinker(BlockID.singularity_shrinker);

MagicCore.setPlaceBlockFunc(BlockID.singularity_shrinker, {
	magic: 5
});
TileEntity.registerPrototype(BlockID.singularity_shrinker, {
	useNetworkItemContainer: true,
	defaultValues: {
		singularity: 0
	},
	tick: function(){
		StorageInterface.checkHoppers(this);
		let slotRune = this.container.getSlot("slotRune");
		let fuel_strength = runes_singularity[slotRune.id];

		if(fuel_strength){
			this.data.singularity += fuel_strength*slotRune.count;
			this.container.setSlot("slotRune", 0, 0, 0, null);
		}
		
		if(Math.random() <= .2 && this.data.singularity >= .1)
			this.data.singularity -= .05;
			
		if(this.data.singularity > 0 && World.getThreadTime() % 5 == 0){
			Mp.spawnParticle(ParticlesAPI.part_singularity, this.x+.5, this.y+1.5, this.z+.5, 0, 0, 0, 0, 0, 0, this.dimension);
			Mp.spawnParticle(ParticlesAPI.singularity_particle, this.x+Math.random(), this.y+1+Math.random(), this.z+Math.random(), 0, 1/20, 0, 0, 0, 0, this.dimension);
			
			this.container.setText("textSinLvl", this.data.singularity);
			this.container.setText("textSinAspect", Math.ceil(this.data.singularity/250));
			this.container.sendChanges();
		}
	},
	getScreenName: function(player, coords){
		if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "singularity"))
    	return "main";
  },
  getScreenByName: function(screenName){
    return SingularityShrinkerUI;
  }
});
StorageInterface.createInterface(BlockID.singularity_shrinker, {
	slots: {
		"slotRune": {input: true}
	}
});




// file: block/singularity/extract.js

IDRegistry.genBlockID("singularity_extract");
Block.createBlock("singularity_extract", [ {name: "aw.block.singularity_extractor", texture: [["stone", 0]], inCreative: true} ])
RenderAPI.setSingularityExtractor(BlockID.singularity_extract);
MagicCore.setPlaceBlockFunc(BlockID.singularity_extract, {
	magic: 5
});
SingularityAPI.setBlockOutputName(BlockID.singularity_extract, "base", true);
TileEntity.registerPrototype(BlockID.singularity_extract, {
	defaultValues: {
		aspect: 0,
		aspectMax: 1000,
		add: 1,
		arr:null
	},
	client: new SingularityLines.Client(),
	init(){
		SingularityAPI.init(this);
	},
	tick(){
		if(World.getThreadTime() % 5 == 0){
			if(this.blockSource.getBlockId(this.x, this.y-2, this.z) == BlockID.singularity_shrinker){
				let tile = World.getTileEntity(this.x, this.y-2, this.z, this.blockSource);
				if(!tile)
					tile = World.addTileEntity(this.x, this.y-2, this.z, this.blockSource);
				
				let add = this.data.aspect + Math.ceil(tile.data.singularity/500)
				if(add <= this.data.aspectMax){
					this.data.aspect+=add;
					tile.data.singularity -= .001*add;
							
					if(this.data.singularity < 0) 
						this.data.singularity = 0;
								
					this.data.add = Math.ceil(tile.data.singularity/250);
				}else
					this.data.add = 1;
			}else
				this.data.add = 1;
		}
		SingularityAPI.transfers(this, 2, base_transfer);
	},
	click(id, count, data, coords, player){
		SingularityAPI.click(this, coords, player);
	}
});





// file: block/singularity/transmitter.js

IDRegistry.genBlockID("transmitter");
Block.createBlock("transmitter", [ {name: "aw.block.transmitter", texture: [["stone", 0]], inCreative: true} ]);

SingularityAPI.setBlockInputName(BlockID.transmitter, "base", true);
SingularityAPI.setBlockOutputName(BlockID.transmitter, "base", true);
RenderAPI.setTransmitter(BlockID.transmitter);
TileEntity.registerPrototype(BlockID.transmitter, {
	defaultValues: {
		aspect: 0,
		aspectMax: 50,
		arr: null
	},
	
	client: new SingularityLines.Client(),
	init(){
		SingularityAPI.init(this);
	},
	tick(){
		SingularityAPI.transfers(this, 2, base_transfer);
	},
	click(id, count, data, coords, player){
		SingularityAPI.click(this, coords, player);
	}
});




// file: block/singularity/ancient_obelisk.js

IDRegistry.genBlockID("ancient_bottom_obelisk");
Block.createBlock("ancient_bottom_obelisk", [ {name: "aw.block.ancient_bottom_obelisk", texture: [["stone", 0]], inCreative: true} ])
RenderAPI.setBottomObelisk(BlockID.ancient_bottom_obelisk);
RenderAPI.setItemObelisk(BlockID.ancient_bottom_obelisk);
IDRegistry.genBlockID("ancient_top_obelisk");
Block.createBlock("ancient_top_obelisk", [ {name: "aw.block.ancient_top_obelisk", texture: [["stone", 0]], inCreative: false} ])
RenderAPI.setTopObelisk(BlockID.ancient_top_obelisk);
Block.registerDropFunctionForID(BlockID.ancient_top_obelisk, function(){
	return [[BlockID.ancient_bottom_obelisk, 1, 0]];
});
MagicCore.setPlaceBlockFunc(BlockID.ancient_bottom_obelisk, {
	magic: 10
}, function(coords, item, block, player, region){
	if(region.getBlockId(coords.relative.x, coords.relative.y+1, coords.relative.z)==0){
		region.setBlock(coords.relative.x, coords.relative.y+1, coords.relative.z, BlockID.ancient_top_obelisk);
	}else{
		let pos = Entity.getPosition(player);
    region.spawnDroppedItem(pos.x, pos.y, pos.z, item.id, 1, item.data, item.extra)
    region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, 0);
	}
})
Callback.addCallback("DestroyBlock", function(coords, block, player){
	if(block.id == BlockID.ancient_bottom_obelisk){
		BlockSource.getDefaultForActor(player).setBlock(coords.x, coords.y+1,coords.z, 0, 0)
	}else if(block.id == BlockID.ancient_top_obelisk){
		BlockSource.getDefaultForActor(player).setBlock(coords.x, coords.y-1,coords.z, 0, 0)
	}
})
SingularityAPI.setBlockInputName(BlockID.ancient_bottom_obelisk, "base", true);
TileEntity.registerPrototype(BlockID.ancient_bottom_obelisk, {
	defaultValues: {
		add: 1,
		aspect: 0,
		aspectMax: 1000
	},
	getEnts(){
		let mobs = [];
		let ents = Entity.getAllInRange({x:this.x,y:this.y,z:this.z}, 8);
		for(let i in ents){
			if(Network.getConnectedPlayers().indexOf(ents[i]) != -1 && Entity.getDimension(ents[i])==this.dimension)
				mobs.push(ents[i])
		}
		return mobs;
	},
	tick(){
		//if(World.getThreadTime()%__config__.get("tickUpdate")==0){
			if(this.data.aspect-this.data.add>=.1 && this.data.add!=0){
				let ents = this.getEnts();
				for(let i in ents){
					if(ScrutinyAPI.isScrutiny(ents[i], "aw", "basics", "singularity")){
						let c = MagicCore.getValue(ents[i])
						let pos = Entity.getPosition(ents[i]);
						if(c.aspects+this.data.add <= c.aspectsNow){
							this.data.aspect-=this.data.add;
							c.aspects+=this.data.add;
							 ParticlesAPI.coords(ParticlesAPI.part2, this.x, this.y, this.z, pos.x, pos.y, pos.z, 40, this.dimension)
						}
						MagicCore.setParameters(ents[i], c, false);
					}
				}
			}
		//}
	}
});





// file: block/singularity/crusher.js

IDRegistry.genBlockID("magic_crusher");
Block.createBlock("magic_crusher", [ {name: "aw.block.magic_crusher", texture: [["stone", 0]], inCreative: true} ]);

let MagicCrusherUI = createUI({
	drawing: [
{type: "text", x: 380, y: 40, text: Translation.translate("aw.block.magic_crusher"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}},
		{type: "bitmap", bitmap: "furnace_bar_guide", x: 415, y: 180, scale: 8}
	],
	elements: {
		"slotInput": {type: "slot", x: 200, y: 190, size: 100},
		"slotResult": {type: "slot", x: 650, y: 190, size: 100},
	}
});

MagicCore.setPlaceBlockFunc(BlockID.magic_crusher, null, null, {tab: "singularity", name: "magic_crusher"});
SingularityAPI.setBlockInputName(BlockID.magic_crusher, "base", true);
crusher.setBlockModel(BlockID.magic_crusher);

let MagicCrusher = {
	recipes: [],
	addRecipe(obj){
		this.recipes.push(obj);
	}
};

let ICore
ModAPI.addAPICallback("ICore", function(api){
	ICore = api;
});

Callback.addCallback("ModsLoaded", function(){
	MagicCrusher.addRecipe({
		input: {
			id: ItemID.enchantment_forest_flower
		},
		result: {
			id: ItemID.aw_petal_powder,
			count: 1
		},
		clone: true
	});
	
	if(ICore){
		let macerator = ICore.Recipe.recipeData["macerator"];
		let keys = Object.keys(macerator);
		for(let i in keys){
			let key = keys[i];
			MagicCrusher.addRecipe({
				input: {
					id: parseInt(key.split(":")[0])
				},
				result: {
					id: macerator[key].id,
					count: macerator[key].count
				},
				clone: macerator[key].count < 4
			});
		}
	}
});

ModAPI.addAPICallback("RecipeViewer", function(api){
	var RVTypeAW = (function(_super){
		__extends(RVTypeAW, _super);
		function RVTypeAW(nameRv, icon, key, content){
			return _super.call(this, nameRv, icon, content) || this;
		}
		RVTypeAW.prototype.getAllList = function() {
			let list = [];
			let recipes = MagicCrusher.recipes;
			for(let i in recipes){
				let obj = recipes[i];
				list.push({
					input: [{id: obj.input.id, data: 0,count: 1}],
					output: [{id: obj.result.id,data: 0,count: obj.result.count}]
				});
			}
			return list;
		};
		return RVTypeAW;
	}(api.RecipeType));
	api.RecipeTypeRegistry.register("BlockID.magic_crusher", new RVTypeAW(Translation.translate("aw.block.magic_crusher"), BlockID.magic_crusher, "BlockID.magic_crusher", {
		drawing: [
			{type: "bitmap", bitmap: "furnace_bar_guide", x: 415, y: 180, scale: 8},
		],
		elements: {
			input0: {type: "slot", x: 200, y: 190, size: 100},
			output0: {type: "slot", x: 650, y: 190, size: 100},
		}
	}));
});

TileEntity.registerPrototype(BlockID.magic_crusher, {
	useNetworkItemContainer: true,
	defaultValues: {
		aspect: 0,
		aspectMax: 500,
	},
	tick(){
		if(World.getThreadTime() % 100 != 0)
			return;
		let clone = 1;
		for(let i = 1;i <= 10;i++)
			if(this.blockSource.getBlockId(this.x, this.y-i, this.z) == BlockID.aw_enchanted_rune_copying)
				clone++;
		
		let input = this.container.getSlot("slotInput");
		let result = this.container.getSlot("slotResult");
		
		if(this.data.aspect < 15*clone)
			return;
		
		for(let i in MagicCrusher.recipes){
			let recipe = MagicCrusher.recipes[i];
			if(input.id == recipe.input.id && (result.id == 0 || result.id == recipe.result.id)){
				this.data.aspect-=15*clone;
				this.container.setSlot("slotInput", input.id, input.count-1, 0);
				this.container.setSlot("slotResult", recipe.result.id, result.count+(recipe.clone ? recipe.result.count*clone : recipe.result.count), 0);
				this.container.validateAll();
				break;
			}
		}
		
		this.container.sendChanges();
		StorageInterface.checkHoppers(this);
	},
	getScreenName(player, coords){
		if(ScrutinyAPI.isScrutiny(player, "aw", "singularity", "magic_crusher"))
			return "main";
	},
	getScreenByName(screenName){
		return MagicCrusherUI;
	}
});
StorageInterface.createInterface(BlockID.magic_crusher, {
	slots: {
		"input0": {input: true, output: false},
		"output0": {input: false, output: true}
	}
});




// file: block/singularity/magic_storage.js

IDRegistry.genBlockID("aw_magic_storage");
Block.createBlock("aw_magic_storage", [ {name: "aw.block.aw_magic_storage", texture: [["stone", 0]], inCreative: true} ]);

SingularityAPI.setBlockInputName(BlockID.aw_magic_storage, "base", true);
SingularityAPI.setBlockOutputName(BlockID.aw_magic_storage, "base", true);
magic_storage.setBlockModel(BlockID.aw_magic_storage);

MagicCore.setPlaceBlockFunc(BlockID.aw_magic_storage, null, null, {tab: "singularity", name: "magic_storage"});

TileEntity.registerPrototype(BlockID.aw_magic_storage, {
	defaultValues: {
		aspect: 0,
		aspectMax: 10000,
		arr: null,
	},
	client: new SingularityLines.Client(),
	init(){
		SingularityAPI.init(this);
	},
	tick(){
		SingularityAPI.transfers(this, 2, base_transfer);
	},
	click(id, count, data, coords, player){
		SingularityAPI.click(this, coords, player);
	}
});




// file: block/singularity/clone_scroll.js

IDRegistry.genBlockID("clone_scroll");
Block.createBlock("clone_scroll", [ {name: "aw.block.clone_scroll", texture: [["aw_magic_brick", 0]], inCreative: true} ]);

ScrollClone().setBlockModel(BlockID.clone_scroll, 0);
RitualAPI.addPedestal(BlockID.clone_scroll);

const widthCloneText = new com.zhekasmirnov.innercore.api.mod.ui.types.Font({size:60}).getTextWidth("Clone", 1);

let CloneScrollUI = createUI({
	drawing: [
		{type: "text", x: 380, y: 40, text: Translation.translate("aw.block.clone_scroll"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}},
	],
	elements: {
		"scroll":{type: "slot", x: 200, y: 100, size: 65},
		"frame":{type:"frame", bitmap: "classic_button_up", x: 270, y: 100, scale: 3, width: widthCloneText+10, height: 65, clicker: {
			onClick(_, container){
				container.sendEvent("clone", {});
			}
		}},
		"frameText":{type:"text", x: 275, y: 100, z: 1, text: "Clone", font: {size: 60, color: android.graphics.Color.rgb(0, 0, 0)}},
		"text":{type:"text", x: 180, y: 170, text: "", multiline: true, font: {size: 15, color: android.graphics.Color.rgb(0, 0, 0)}}
	}
});
SingularityAPI.setBlockInputName(BlockID.clone_scroll, "base", true);

let CloneScrollRecipe = {
	recipes: {},
	get(scroll){
		return (this.recipes[scroll]||[]).slice(0);
	},
	add(scroll, recipes){
		this.recipes[scroll] = recipes;
		return this;
	}
};
Callback.addCallback("ModsLoaded", function(){
	ModAPI.addAPICallback("RecipeViewer", function(api){
		var RVTypeAW = (function(_super){
			__extends(RVTypeAW, _super);
			function RVTypeAW(nameRv, icon, content){
				let _this = _super.call(this, nameRv, icon, content) || this;
				return _this;
			}
			RVTypeAW.prototype.getAllList = function() {
				let list = [];
				for(let key in CloneScrollRecipe.recipes){
					let tips = "\n";
					let items = CloneScrollRecipe.recipes[key];
					for(let i in items)
						tips += "\n"+Translation.translate(Item.getName(items[i], 0));
					list.push({
						output: [{id: Number(key), data: 0, count: 1, tips: tips}],
						input: [],
					});
				}
				return list;
			};
			RVTypeAW.prototype.slotTooltip = function(name, item, tips){
				return name+(tips||"");
			}
			return RVTypeAW
  	}(api.RecipeType));
  	api.RecipeTypeRegistry.register(""+BlockID.clone_scroll, new RVTypeAW(Translation.translate("aw.block.clone_scroll"), BlockID.clone_scroll, {
  		drawing: [],
  		elements: {
  			output0: {x: 450, y: 200, size: 100},
  		}
  	}));
  });
});

CloneScrollRecipe.add(ItemID.sroll1, [ItemID.rune2, ItemID.rune_absorption])
	.add(ItemID.sroll2, [ItemID.rune_life, ItemID.rune_absorption])
	.add(ItemID.sroll3, [ItemID.rune3, ItemID.rune_absorption])
	.add(ItemID.sroll4, [ItemID.rune5, ItemID.rune5, ItemID.rune_absorption])
	.add(ItemID.sroll5, [ItemID.rune4, ItemID.rune3])
	.add(ItemID.sroll6, [ItemID.rune4, ItemID.rune4, ItemID.rune_absorption])
	.add(ItemID.sroll7, [ItemID.rune4, ItemID.rune4, ItemID.rune_absorption, ItemID.rune3])
	.add(ItemID.sroll8, [ItemID.sroll11, ItemID.rune_dead])
	.add(ItemID.sroll9, [ItemID.rune2, ItemID.rune_absorption])
	.add(ItemID.sroll10, [ItemID.sroll4, ItemID.rune5])
	.add(ItemID.sroll11, [ItemID.sroll10, ItemID.rune5])
	.add(ItemID.sroll12, [ItemID.sroll6, ItemID.rune4])
	.add(ItemID.sroll13, [ItemID.sroll12, ItemID.rune4])
	.add(ItemID.sroll15, [ItemID.rune3, ItemID.rune3, ItemID.rune_life])
	.add(ItemID.sroll16, [ItemID.sroll15, ItemID.rune_life])
	.add(ItemID.sroll17, [ItemID.sroll11, ItemID.rune_dead])
	.add(ItemID.sroll18, [ItemID.sroll10, ItemID.rune_dead])
	.add(ItemID.sroll19, [ItemID.sroll12, ItemID.rune_life])
	.add(ItemID.sroll20, [ItemID.sroll15, ItemID.sroll16, ItemID.rune_greed])
	.add(ItemID.sroll21, [ItemID.rune_dead, ItemID.rune5, ItemID.rune_greed, VanillaItemID.bone])
	.add(ItemID.sroll22, [ItemID.sroll8, ItemID.sroll18])
	.add(ItemID.sroll23, [ItemID.sroll8, ItemID.sroll22])
	.add(ItemID.sroll26, [ItemID.sroll18, ItemID.sroll4])
	.add(ItemID.sroll27, [VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust])
	.add(ItemID.sroll28, [VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust])
	.add(ItemID.sroll29, [ItemID.sroll4, ItemID.sroll6])
	.add(ItemID.sroll32, [ItemID.sroll26, ItemID.rune4])
	.add(ItemID.sroll33, [ItemID.sroll32, ItemID.rune4])
	.add(ItemID.sroll34, [ItemID.sroll32, ItemID.sroll33])
	.add(ItemID.sroll35, [ItemID.sroll23, ItemID.sroll34])
	.add(ItemID.sroll36, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll37, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll38, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll39, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll40, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll41, [VanillaItemID.paper, ItemID.rune3])
	.add(ItemID.sroll42, [ItemID.rune_absorption, ItemID.rune4, ItemID.rune3])
	.add(ItemID.sroll43, [ItemID.sroll42, ItemID.rune4])
	.add(ItemID.sroll44, [ItemID.sroll43, ItemID.rune5])
	.add(ItemID.sroll45, [ItemID.sroll29, ItemID.sroll10])
	.add(ItemID.sroll46, [ItemID.sroll45, ItemID.sroll42])
	.add(ItemID.sroll47, [ItemID.sroll46, ItemID.sroll18]);

for(let i = 1;i <= 10;i++)
	CloneScrollRecipe.add(ItemID["decor"+i], [VanillaItemID.paper, VanillaItemID.paper, ItemID.rune4, ItemID.rune4, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust]);
	

function getItemToInventory(player, it, slots){
	let actor = new PlayerActor(player);
	for(let i = 0;i < 36;i++){
		let item = actor.getInventorySlot(i);
		if(slots.indexOf(i) != -1) continue;
		if(item.id == it) return i;
	}
	return -1;
}

TileEntity.registerPrototype(BlockID.clone_scroll, objectFix(getProtPedestal(.8), {
	useNetworkItemContainer: true,
	defaultValues: {
		aspect: 0,
		aspectMax: 500
	},
	client: objectFix(getProtPedestal(.8).client, {
		containerEvents: {
			updateText(container, window, content, data){
				if(content)
					content.elements.text.text = data.text;
			}
		}
	}),
	containerEvents: {
		updateText(data){
			this.container.sendEvent("updateText", data);
		},
		clone(data, client){
			if(!data.free && this.data.aspect < 2){
				this.container.sendEvent("updateText", {
					text: Translation.translate("aw.clone_scroll.not_aspect")
				});
				return;
			}
			if(!data.free) this.data.aspect -= 2;
			let player = client.getPlayerUid();
			let slots = [];
			let input = this.container.getSlot("scroll");
			let items = CloneScrollRecipe.get(input.id);
			if(items){
				for(let i in items){
					let slot = getItemToInventory(player, items[i], slots);
					if(slot == -1){
						this.container.sendEvent("updateText", {
					text: Translation.translate("aw.clone_scroll.not_item")
				});
						return;
					}
					slots[i] = slot;
				}
				let actor = new PlayerActor(player);
				for(let i in slots){
					let slot = slots[i];
					let item = actor.getInventorySlot(slot);
					actor.setInventorySlot(slot, item.id, item.count-1, item.data, item.extra);
				}
				actor.addItemToInventory(input.id, 1, input.data, input.extra, true);
				this.container.sendChanges();
			}
		}
	},
	setItem(item){
		this.container.setSlot("scroll", item.id, item.count, item.data, item.extra||null);
		this.data.item = item;
	},
	tick(){
		StorageInterface.checkHoppers(this);
		if(World.getThreadTime() % 30 != 0) return;
		let input = this.container.getSlot("scroll");
		this.animation(input);
		let items = CloneScrollRecipe.get(input.id);
		if(items){
			let text = Translation.translate(Item.getName(input.id, input.data))+":\n\n";
			for(let i in items)
				text += Translation.translate(Item.getName(items[i], 0))+"\n";
			this.container.sendEvent("updateText", {text: text});
		}else
			this.container.sendEvent("updateText", {text: ""});
		this.container.sendChanges();
	},
	getScreenName(player, coords){
		let item = Entity.getCarriedItem(player);
		if(item.id != ItemID.bookk && ScrutinyAPI.isScrutiny(player, "aw", "singularity", "clone_scroll"))
			return "main";
	},
	getScreenByName(screenName){
		return CloneScrollUI;
	}
}));

StorageInterface.createInterface(BlockID.clone_scroll, {
	slots: {
		"scroll": {input: true, output: true}
	}
});




// file: block/singularity/ic2.js

ModAPI.addAPICallback("ICore", function(api){
	let EU = api.requireGlobal("EU");
	const IC2Config = api.requireGlobal("IC2Config");
	const EnergyTileRegistry = api.requireGlobal("EnergyTileRegistry");
	const SoundManager = api.requireGlobal("SoundManager");
	
	IDRegistry.genBlockID("aw_generator_EU");
	Block.createBlock("aw_generator_EU", [ {name: "aw.block.generator_EU", texture: [["plant", 0]], inCreative: true} ]);
	
	GeneratorIc(null, BlockID.aw_magic_stone).setBlockModel(BlockID.aw_generator_EU);
	RitualAPI.addRecipe("ritual_1", "aw_generator_EU", [BlockID.aw_magic_stone, BlockID.aw_magic_stone, ItemID.magic_crystal, BlockID.aw_magic_stone], {
		id: BlockID.aw_generator_EU,
		data: 0,
		count: 1,
		extra: null
	}, {
		aspects: 1000,
		magic: 10,
		protection: 10
	});
	
	TileEntity.registerPrototype(BlockID.aw_generator_EU, {
		defaultValues: {
			aspect: 0,
			aspectMax: 50
		},
		canReceiveEnergy(){
			return false;
		},
		canExtractEnergy(){
			return true;
		},
		energyTick(type, src){
			if(this.data.aspect >= 1 && src.add(2) == 0)
				this.data.aspect -= 1;
		}
	});
	SingularityAPI.setBlockInputName(BlockID.aw_generator_EU, "base", true);
	ICRender.getGroup("ic-wire").add(BlockID.aw_generator_EU, -1);
	EnergyTileRegistry.addEnergyTypeForId(BlockID.aw_generator_EU, EU);
	
	IDRegistry.genBlockID("aw_generator_aspect");
	Block.createBlock("aw_generator_aspect", [ {name: "aw.block.aw_generator_aspect", texture: [["plant", 0]], inCreative: true} ]);

	SingularityAPI.setBlockOutputName(BlockID.aw_generator_aspect, "base", true);
	GeneratorIc(null, BlockID.aw_enchanted_stone).setBlockModel(BlockID.aw_generator_aspect);
	RitualAPI.addRecipe("ritual_1", "aw_generator_aspect", [BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone, ItemID.magic_crystal, BlockID.aw_enchanted_stone], {
		id: BlockID.aw_generator_aspect,
		data: 0,
		count: 1,
		extra: null
	}, {
		aspects: 1000,
		magic: 10,
		protection: 10
	});
	
	TileEntity.registerPrototype(BlockID.aw_generator_aspect, {
		defaultValues: {
			aspect: 0,
			aspectMax: 50,
			pos:null,
			energy: 0
		},
		canReceiveEnergy(){
			return true;
		},
		canExtractEnergy(){
			return false;
		},
		client: new SingularityLines.Client(),
		init(){
			SingularityAPI.init(this);
		},
		tick(){
			if(this.data.energy >= 3){
				this.data.energy-=3;
				this.data.aspect+=1;
			}

			SingularityAPI.transfers(this, 2, base_transfer);
		},
		energyReceive(type, amount, voltage) {
			let maxVoltage = 32;
			if(voltage > maxVoltage){
				if(IC2Config.voltageEnabled){
					this.blockSource.setBlock(this.x, this.y, this.z, 0, 0);
					this.blockSource.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, 2, true); SoundManager.playSoundAtBlock(this, "MachineOverload.ogg", 1, 32);
					this.selfDestroy();
					return 1;
				}
				amount = Math.min(amount, maxVoltage);
			}
			let add = Math.min(amount, 100 - this.data.energy);
			this.data.energy += add;
			return add;
		},
		click(id, count, data, coords, player){
			SingularityAPI.click(this, coords, player);
		}
	});
		ICRender.getGroup("ic-wire").add(BlockID.aw_generator_aspect, -1);
	EnergyTileRegistry.addEnergyTypeForId(BlockID.aw_generator_aspect, EU);
});




// file: block/plant.js

IDRegistry.genBlockID("enchantment_forest_flower");
Block.createBlock("enchantment_forest_flower", [ {name: "aw.item.enchantment_forest_flower", texture: [["enchantment_forest_flower", 0]], inCreative: false} ], {
base: 18,
sound: "grass"
});

Block.registerDropFunctionForID(BlockID.enchantment_forest_flower, function(){
return [[ItemID.enchantment_forest_flower, 1, 0]];
});

Block.setDestroyTime(BlockID.enchantment_forest_flower, 1/20);

ToolAPI.registerBlockMaterial(BlockID.enchantment_forest_flower, "plant", 0);

RenderAPI.setPlantModel(BlockID.enchantment_forest_flower, 0, "enchantment_forest_flower", 0);




// file: guide_book/window.js

function getBookSrollData(id){
    let arr = [];
    arr.push({text: Translation.translate("aw.guide.text.characteristics"), size: 20});
    let prot = Wands.getPrototype(id);
    let keys = Object.keys(prot.activate);
    for(let i in keys){
    	if(prot.activate[keys[i]] >= 1){
    		arr.push({text: keys[i] + " " + prot.activate[keys[i]], size: 15});
    	}
    }
    return arr;
}
function getBookWandData(id){
	let arr = [];
  arr.push({text: Translation.translate("aw.guide.text.characteristics"), size: 20});
  let wand = Wands.getStick(id);
  let keys = Object.keys(wand.bonus);
  for(let i in keys)
  	arr.push({text: keys[i] + " " + -wand.bonus[keys[i]], size: 15});
  arr.push({text: "time "+wand.time, size: 15});
  arr.push({text: "scroll max  "+wand.scroll_max, size: 15});
  return arr;
}
ScrutinyAPI.register("aw", {
	default_tab: "basics",
 scale: __config__.get("scrutiny_gui.frame_scale"),
 frame: __config__.get("scrutiny_gui.frame"),
 default_bitmap: __config__.get("scrutiny_gui.scrutiny"),
 default_bitmap_click: __config__.get("scrutiny_gui.scrutiny_2"),
 close_bitmap: "X",
});

function getClassBook(name){
	let arr = [];
	arr.push({text: Translation.translate("aw.guide.classWarrior.text5"), size: 20});
	let keys = Object.keys(MagicCore.getAllClass()[name]);
	for(let i in keys)
		arr.push({text: Translation.translate(keys[i]+": "+MagicCore.getAllClass()[name][keys[i]]), size: 15})
	return arr;
}
function getArmorBook(slot, title, text, items){
	let arr = [];
	arr.push({text: Translation.translate("aw.guide.armor.description"), size: title});
	for(let i in items){
		let id = items[i];
		arr.push({type: "slot", slots: [{size: slot,item:{id:id}}]});
		arr.push({text: TranslationLoad.get("aw.guide.armor.value", [["value", ItemModule.getArmorValue(id)]]), size: text});
		arr.push({text: TranslationLoad.get("aw.guide.armor.damage", [["value", Item.getMaxDamage(id)]]), size: text});
		let obj = MagicCore.armors[id]
		if(obj)
			arr.push({text: TranslationLoad.get("aw.message.required_parameter", [["name", obj.parameter],["level", obj.value]]), size: text});
		obj = MagicCore.armorMagic[id];
		if(obj)
			arr.push({text: TranslationLoad.get("aw.guide.armor.value.protection", [["name", obj.type],["value",obj.value]]), size: text});
	}
	return arr;
}
ScrutinyAPI.addTab("aw", "basics", {
    id: 0,
    icon: ItemID.bookk,
    title: "aw.guide.tab.basics",
    auto_size: true 
});

addScrut("aw", "basics", "cauldron", "cauldron");
addScrut("aw", "basics", "ritual", "ritual");
addScrut("aw", "basics", "srollEvent", "sroll event", 0.1);
addScrut("aw", "basics", "singularity", "singularity", 0.1);
addScrut("aw", "basics", "book", "book", 0.05);
addScrut("aw", "basics", "srollMagicConnector", "magic connector", 0.05);
addScrut("aw", "basics", "srollEventBlock", "sroll event block", 0.05);
addScrut("aw", "basics", "srollEventPlayer", "sroll event player", 0.05);
addScrut("aw", "basics", "srollEventEntity", "sroll event entity", 0.05);
addScrut("aw", "basics", "acolyteStaff", "acolyte staff");
addScrut("aw", "basics", "magisStick", "magic stick");
addScrut("aw", "basics", "magisSword", "magic sword");
addScrut("aw", "basics", "magisPocox", "magic staff");
addScrut("aw", "basics", "magisStick2lvl", "magic stick 2 lvl");
addScrut("aw", "basics", "magisSword2lvl", "magic sword 2 lvl");
addScrut("aw", "basics", "magisPocox2lvl", "magic staff 2 lvl");
addScrut("aw", "basics", "classMage", "class mage");
addScrut("aw", "basics", "classWarrior", "class warrion", 0.06);
addScrut("aw", "basics", "classNecromancer", "class necromancer");
addScrut("aw", "basics", "bowlWishes", "bowl wishes");
addScrut("aw", "basics", "SpellSet", "Spell set");
addScrut("aw", "basics", "MagicController", "Magic controller");


addScrut("aw", "sroll", "fog", "fog");
addScrut("aw", "sroll", "srollDamage1", "sroll damage lvl 1");
addScrut("aw", "sroll", "srollDamage2", "sroll damage lvl 2");
addScrut("aw", "sroll", "srollDamage3", "sroll damage lvl 3");
addScrut("aw", "sroll", "srollWeakAttack", "sroll weak attack");
addScrut("aw", "sroll", "srollStrongAttack", "sroll strong attack");
addScrut("aw", "sroll", "srollFireProjectile", "sroll fire projectile");
addScrut("aw", "sroll", "srollFirestorm", "sroll firestorm");
addScrut("aw", "sroll", "srollFlameStream", "sroll flame stream");
addScrut("aw", "sroll", "srollstarfall", "sroll starfall");
addScrut("aw", "sroll", "srollExplosive", "sroll explosive");
addScrut("aw", "sroll", "freezing", "freezing")
addScrut("aw", "sroll", "snowstorm", "snowstorm")

addScrut("aw", "srollSubsidiary", "srollSpeed", "sroll speed");
addScrut("aw", "srollSubsidiary", "srollStrength", "sroll strength");
addScrut("aw", "srollSubsidiary", "srollHealing1", "sroll healing 1 lvl");
addScrut("aw", "srollSubsidiary", "srollHealing2", "sroll healing 2 lvl");
addScrut("aw", "srollSubsidiary", "srollHealing3", "sroll healing 3 lvl");
addScrut("aw", "srollSubsidiary", "srollBlockDestroy", "sroll block destroy");
addScrut("aw", "srollSubsidiary", "srollTeleportations", "sroll teleportations");
addScrut("aw", "srollSubsidiary", "srollStorms", "sroll storms");
addScrut("aw", "srollSubsidiary", "srollSpeed", "sroll speed");
addScrut("aw", "srollSubsidiary", "srollMagnet", "sroll magnet");
addScrut("aw", "srollSubsidiary", "srollRegeneration", "sroll regeneration");
addScrut("aw", "srollSubsidiary", "srollCleansing", "sroll cleansing");
addScrut("aw", "srollSubsidiary", "illusion", "illusion");

addScrut("aw", "srollKill", "srollKill", "sroll kill");
addScrut("aw", "srollKill", "srollSummoning", "sroll summoning");
addScrut("aw", "srollKill", "srollDeathRay", "sroll Death ray");
addScrut("aw", "srollKill", "srollRainOfTheDead", "sroll rain of the dead");

addScrut("aw", "riches", "RobeOfTheAzureWizard", "Robe of the azure wizard", -1);
addScrut("aw", "riches", "fire", "fire armor", -1);
addScrut("aw", "riches", "bandit", "bandit armor", -1);
addScrut("aw", "riches", "necromancer", "necromancer armor", -1);
addScrut("aw", "riches", "dead", "scythe of death", -1);
addScrut("aw", "riches", "tanatos", "tanatos", -1);
addScrut("aw", "riches", "amylet", "amylet", -1);
addScrut("aw", "riches", "glasses", "glasses", 0.005);
addScrut("aw", "riches", "aw_magic_stick", "Magic stick", -1);
addScrut("aw", "riches", "aw_magic_shovel", "Magic shovel", -1);
addScrut("aw", "riches", "aw_magic_staff", "Magic staff", -1);

addScrut("aw", "singularity", "magic_crusher", "magic crusher");
addScrut("aw", "singularity", "magic_storage", "magic storage");
addScrut("aw", "singularity", "clone_scroll", "Clone scroll", -1);

Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
    if(item.id == ItemID.scrutiny_book)
        ScrutinyAPI.open(player, "aw");
});




// file: guide_book/piece_basics.js

ScrutinyAPI.addScrutiny("aw", "basics", "cauldron", {
    x: 750,
    y: 320,
    size: 100,
    item: {
        id: BlockID.cauldronAw,
    },
    bookPost: {
    	left: [
    		{text: "aw.gui.cauldron_title", size: 25},
    		{text: "aw.gui.cauldron_text", size: 15}
    	],
    	right: [
    		{text: "aw.gui.cauldron_text2", size: 15}
    	]
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "ritual", {
    x: 750,
    y: 520,
    size: 100,
    isVisual: ["book"],
    item: {
        id: BlockID.rityalPedestal,
    },
    bookPost: {
    	left: [
    		{text: "aw.gui.ritual_title", size: 25},
    		{text: "aw.gui.ritual_text", size: 15}
    	],
    	right: [
    		{text: "aw.gui.ritual_text2", size: 15}
    	]
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "srollEvent", {
    x: 50,
    y: 50,
    size: 100,
    item: {
        id: ItemID.sroll2,
    },
    bookPost: {
        left: [
            {text: "aw.guide.srollEvent.title", size: 25},
            {text: "aw.guide.srollEvent.text", size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "singularity", {
    x: 150,
    y: 310,
    size: 90,
    item: {
        id: BlockID.singularity_shrinker,
    },
    bookPost: {
        left: [
            {text: "aw.guide.singularity.title", size: 25},
            {text: "aw.guide.singularity.text1", size: 15}
        ],
        right: [
            {text: "aw.guide.singularity.text2", size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "book", {
    x: 50,
    y: 400,
    size: 100,
    line: ["singularity"],
    isDone: ["singularity"],
    item: {
        id: ItemID.bookk,
    },
    bookPost: {
        left: [
            {text: "aw.guide.book.title", size: 25},
            {text: "aw.guide.book.text1", size: 15}
        ],
        right: [
            {text: "aw.guide.book.text2", size: 15},
            {type: "slot", slots: [{size: 70,item:{id:ItemID.piece4}}]}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "srollMagicConnector", {
    x: 170,
    y: 50,
    size: 120,
    line: ["srollEvent"],
    isDone: ["srollEvent"],
    item: {
        id: BlockID.MagicConnector,
    },
    bookPost: {
        left: [
            {text: "aw.guide.srollMagicConnector.title", size: 25},
            {text: "aw.guide.srollMagicConnector.text1", size: 15},
             {text: "aw.guide.srollMagicConnector.text3", size: 15}
        ],
        right: [
            {text: "aw.guide.srollMagicConnector.text4", size: 15},
            {text: "aw.guide.srollMagicConnector.text5", size: 15},
            {text: "aw.guide.srollMagicConnector.text6", size: 15},
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "srollEventBlock", {
    x: 130,
    y: 200,
    size: 90,
    item: {
        id: ItemID.sroll2,
    },
    line: ["srollMagicConnector"],
    isVisual: ["srollMagicConnector"],
    bookPost: {
        left: [
            {text: "aw.guide.srollEventBlock.title", size: 20, chars: 30},
            {text: "aw.guide.srollEventBlock.text1", size: 15},
             {text: "aw.guide.srollEventBlock.text2", size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "srollEventPlayer", {
    x: 250,
    y: 175,
    size: 90,
    item: {
        id: ItemID.sroll2,
    },
    line: ["srollMagicConnector"],
    isVisual: ["srollMagicConnector"],
    bookPost: {
        left: [
            {text: "aw.guide.srollEventPlayer.title", size: 20},
            {text: "aw.guide.srollEventBlock.text1", size: 15},
             {text: ("aw.guide.srollEventPlayer.text1"), size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "srollEventEntity", {
    x: 320,
    y: 50,
    size: 90,
    item: {
        id: ItemID.sroll2,
    },
    line: ["srollMagicConnector"],
    isVisual: ["srollMagicConnector"],
    bookPost: {
        left: [
            {text: ("aw.guide.srollEventEntity.title"), size: 20, chars: 30},
            {text: ("aw.guide.srollEventBlock.text1"), size: 15},
             {text: ("aw.guide.srollEventEntity.text1"), size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "acolyteStaff", {
    x: 400,
    y: 280,
    size: 100,
    line: ["srollEventBlock", "srollEventPlayer", "srollEventEntity"],
    isVisual: ["srollEventBlock", "srollEventPlayer", "srollEventEntity"],
    item: {
        id: ItemID.acolyteStaff,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.acolyteStaff.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.acolyteStaff)
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "magisStick", {
    x: 280,
    y: 450,
    size: 100,
    line: ["acolyteStaff"],
    isVisual: ["acolyteStaff"],
    item: {
        id: ItemID.magis_stick,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisStick.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.magis_stick)
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "magisStick2lvl", {
    x: 280,
    y: 570,
    size: 100,
    line: ["magisStick"],
    isVisual: ["magisStick"],
    item: {
        id: ItemID.magis_stick_2_lvl,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisStick.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15}
        ],
        right: getBookWandData(ItemID.magis_stick_2_lvl)
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "magisSword", {
    x: 430,
    y: 450,
    size: 100,
    line: ["acolyteStaff"],
    isVisual: ["acolyteStaff"],
    item: {
        id: ItemID.magis_sword,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisSword.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.magis_sword)
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "magisSword2lvl", {
    x: 430,
    y: 570,
    size: 100,
    line: ["magisSword"],
    isVisual: ["magisSword"],
    item: {
        id: ItemID.magis_sword_2_lvl,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisSword.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.magis_sword_2_lvl)
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "magisPocox", {
    x: 580,
    y: 450,
    size: 100,
    line: ["acolyteStaff"],
    isVisual: ["acolyteStaff"],
    item: {
        id: ItemID.magis_pocox,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisPocox.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.magis_pocox)
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "magisPocox2lvl", {
    x: 580,
    y: 570,
    size: 100,
    line: ["magisPocox"],
    isVisual: ["magisPocox"],
    item: {
        id: ItemID.magis_pocox_2_lvl,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisPocox.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.magis_pocox_2_lvl)
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "classWarrior", {
    x: 700,
    y: 10,
    size: 110,
    isVisual: ["book"],
    item: {
        id: ItemID.loreClass2,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.classWarrior.title"), size: 25},
            {text: ("aw.guide.classWarrior.text1"), size: 15},
            {text: ("aw.guide.classWarrior.text2"), size: 15},
            {text: ("aw.guide.classWarrior.text3"), size: 15},
            {type: "slot", slots: [{size: 70,item:{id:ItemID.loreClass2}}]},
            {text: ("aw.guide.classWarrior.text4"), size: 15},
        ],
        right: getClassBook("warrior")
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "classNecromancer", {
    x: 820,
    y: 10,
    size: 110,
    isVisual: ["book"],
    item: {
        id: ItemID.loreClass3,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.classNecromancer.title"), size: 25},
           {text: ("aw.guide.classWarrior.text1"), size: 15},
            {text: ("aw.guide.classWarrior.text2"), size: 15},
            {text: ("aw.guide.classWarrior.text3"), size: 15},
            {type: "slot", slots: [{size: 70,item:{id:ItemID.loreClass2}}]},
            {text: ("aw.guide.classWarrior.text4"), size: 15},
        ],
        right: getClassBook("necromancer")
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "classMage", {
    x: 580,
    y: 10,
    size: 110,
    isVisual: ["book"],
    item: {
        id: ItemID.loreClass1,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.classMage.title"), size: 25},
            {text: ("aw.guide.classWarrior.text1"), size: 15},
            {text: ("aw.guide.classWarrior.text2"), size: 15},
            {text: ("aw.guide.classWarrior.text3"), size: 15},
            {type: "slot", slots: [{size: 70,item:{id:ItemID.loreClass2}}]},
            {text: ("aw.guide.classWarrior.text4"), size: 15},
        ],
        right: getClassBook("mage")
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "bowlWishes", {
    x: 580,
    y: 130,
    size: 110,
    isVisual: ["book"],
    item: {
        id: ItemID.rune5,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.bowlWishes.title"), size: 25},
            {text: ("aw.guide.bowlWishes.text1"), size: 15},
            {text: ("aw.guide.bowlWishes.text2"), size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "SpellSet", {
    x: 700,
    y: 130,
    size: 110,
    isVisual: ["book"],
    item: {
        id: ItemID.SpellSet31,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.SpellSet.title"), size: 25},
            {text: ("aw.guide.SpellSet.text1"), size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "MagicController", {
    x: 820,
    y: 130,
    size: 110,
    isVisual: ["book", "SpellSet"],
    item: {
        id: BlockID.magicController,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.MagicController.title"), size: 25},
            {text: ("aw.guide.MagicController.text1"), size: 15},
            {text: ("aw.guide.MagicController.text2"), size: 15}
        ],
        right: [
             {text: ("aw.guide.MagicController.text3"), size: 15},
             {text: ("aw.guide.MagicController.text4"), size: 15}
        ]
    }
});








// file: guide_book/piece_sroll.js

ScrutinyAPI.addTab("aw", "sroll", {
    id: 2,
    icon: ItemID.sroll4,
    title: ("aw.guide.tab.sroll"),
    auto_size: true,
    isVisual: function(player,  windowName){
        return ScrutinyAPI.isScrutiny(player, windowName, "basics", "acolyteStaff")
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "fog", {
    x: 650,
    y: 20,
    size: 100,
    line: [],
    item: {
        id: ItemID.sroll42,
    },
    bookPost: {
        left: [
            {text: "aw.guide.fog.title", size: 25},
            {text: "aw.guide.fog.info", size: 15},
        ],
        right: getBookSrollData(ItemID.sroll42)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "snowstorm", {
	x: 650,
	y: 380,
	size: 100,
	line: ["freezing"],
	item: {
		id: ItemID.sroll46,
	},
	bookPost: {
		left: [
			{text: "aw.guide.snowstorm.title", size: 25},
			{text: "aw.guide.snowstorm.info", size: 15},
		],
		right: getBookSrollData(ItemID.sroll46)
	}
});
ScrutinyAPI.addScrutiny("aw", "sroll", "freezing", {
	x: 650,
	y: 250,
	size: 100,
	line: [],
	item: {
		id: ItemID.sroll45,
	},
	bookPost: {
		left: [
			{text: "aw.guide.freezing.title", size: 25},
			{text: "aw.guide.freezing.info", size: 15},
		],
		right: getBookSrollData(ItemID.sroll45)
	}
});
	
ScrutinyAPI.addScrutiny("aw", "sroll", "srollDamage1", {
    x: 20,
    y: 20,
    size: 100,
    line: [],
    item: {
        id: ItemID.sroll4,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollDamage1.title"), size: 25},
            {text: ("aw.guide.srollDamage1.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll4)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollDamage2", {
    x: 130,
    y: 20,
    size: 100,
    line: ["srollDamage1"],
    isDone: ["srollDamage1"],
    item: {
        id: ItemID.sroll10,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollDamage2.title"), size: 25},
            {text: ("aw.guide.srollDamage2.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll10)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollDamage3", {
    x: 240,
    y: 20,
    size: 100,
    line: ["srollDamage2"],
    isDone: ["srollDamage2"],
    item: {
        id: ItemID.sroll11,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollDamage3.title"), size: 25},
            {text: ("aw.guide.srollDamage3.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll11)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollWeakAttack", {
    x: 130,
    y: 140,
    size: 100,
    line: ["srollDamage2"],
    isDone: ["srollDamage2"],
    item: {
        id: ItemID.sroll18,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollWeakAttack.title"), size: 25},
            {text: ("aw.guide.srollWeakAttack.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll18)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollStrongAttack", {
    x: 130,
    y: 260,
    size: 120,
    line: ["srollWeakAttack"],
    isVisual: ["srollWeakAttack"],
    item: {
        id: ItemID.sroll17,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollStrongAttack.title"), size: 25},
            {text: ("aw.guide.srollStrongAttack.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll17)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollFireProjectile", {
    x: 450,
    y: 140,
    size: 100,
    line: ["srollDamage3"],
    isDone: ["srollDamage3"],
    item: {
        id: ItemID.sroll32,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollFireProjectile.title"), size: 25},
            {text: ("aw.guide.srollFireProjectile.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll32)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollFirestorm", {
    x: 450,
    y: 250,
    size: 100,
    line: ["srollFireProjectile"],
    isDone: ["srollFireProjectile"],
    item: {
        id: ItemID.sroll33,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollFirestorm.title"), size: 25},
            {text: ("aw.guide.srollFirestorm.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll33)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollFlameStream", {
    x: 450,
    y: 360,
    size: 100,
    line: ["srollFirestorm", "srollStrongAttack"],
    isVisual: ["srollStrongAttack"],
    isDone: ["srollFirestorm", "srollStrongAttack"],
    item: {
        id: ItemID.sroll34,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollFlameStream.title"), size: 25},
            {text: ("aw.guide.srollFlameStream.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll34)
    }
});

Translation.addTranslation("Scroll of Starfall", {
    ru: "Свиток звездопад"
});
Translation.addTranslation("Launches a projectile from the sky that deals 10 damage in flight, and 20 when it falls.", {
    ru: "Выпускает с неба снаряд, который наносит 10 единиц урона в полёте, и 20 когда упал."
});
ScrutinyAPI.addScrutiny("aw", "sroll", "srollstarfall", {
    x: 450,
    y: 480,
    size: 100,
    line: ["srollFlameStream"],
    isVisual: ["srollFlameStream"],
    isDone: ["srollFlameStream"],
    item: {
        id: ItemID.sroll35,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollstarfall.title"), size: 25},
            {text: ("aw.guide.srollstarfall.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll35)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollExplosive", {
    x: 250,
    y: 480,
    size: 100,
    line: ["srollFlameStream"],
    isDone: ["srollFlameStream"],
    isVisual: ["srollFlameStream"],
    item: {
        id: ItemID.sroll26,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollExplosive.title"), size: 25},
            {text: ("aw.guide.srollExplosive.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll26)
    }
});




// file: guide_book/piece_srollSubsidiary.js

ScrutinyAPI.addTab("aw", "srollSubsidiary", {
    id: 3,
    icon: ItemID.sroll19,
    title: ("aw.guide.tab.srollSubsidiary"),
    isVisual: function(player,  windowName){
        return ScrutinyAPI.isScrutiny(player, windowName, "basics", "acolyteStaff")
    },
    auto_size: true 
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollHealing1", {
    size: 100,
    cellX: 1,
    cellY: 1,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll6,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollHealing1.title"), size: 25},
            {text: ("aw.guide.srollHealing1.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll6)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollHealing2", {
    size: 100,
    cellX: 2,
    cellY: 1,
    line: ["srollHealing1"],
    isDone: ["srollHealing1"],
    item: {
        id: ItemID.sroll12,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollHealing2.title"), size: 25},
            {text: ("aw.guide.srollHealing2.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll12)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollHealing3", {
    size: 100,
    cellX: 3,
    cellY: 1,
    line: ["srollHealing2"],
    isDone: ["srollHealing2"],
    item: {
        id: ItemID.sroll13,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollHealing3.title"), size: 25},
            {text: ("aw.guide.srollHealing3.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll13)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollSpeed", {
    size: 100,
    cellX: 1,
    cellY: 3,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll5,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollSpeed.title"), size: 25},
            {text: ("aw.guide.srollSpeed.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll5)
    }
});

ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollStrength", {
    size: 100,
    cellX: 2,
    cellY: 3,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll7,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollStrength.title"), size: 25},
            {text: ("aw.guide.srollStrength.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll7)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollRegeneration", {
    size: 100,
    cellX: 3,
    cellY: 3,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll19,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollRegeneration.title"), size: 25},
            {text: ("aw.guide.srollRegeneration.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll19)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollMagnet", {
    size: 100,
    cellX: 4,
    cellY: 3,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll20,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollMagnet.title"), size: 25},
            {text: ("aw.guide.srollMagnet.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll20)
    }
});




ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollBlockDestroy", {
    size: 100,
    cellX: 1,
    cellY: 5,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll9,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollBlockDestroy.title"), size: 25},
            {text: ("aw.guide.srollBlockDestroy.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll9)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollStorms", {
    size: 100,
    cellX: 2,
    cellY: 5,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll16,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollStorms.title"), size: 25},
            {text: ("aw.guide.srollStorms.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll16)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollTeleportations", {
    size: 100,
    cellX: 3,
    cellY: 5,
    isDone: ["srollStorms"],
    line: ["srollStorms"],
    item: {
        id: ItemID.sroll15,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollTeleportations.title"), size: 25},
            {text: ("aw.guide.srollTeleportations.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll15)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollCleansing", {
    cellX: 5,
    cellY: 3,
    size: 100,
    item: {
        id: ItemID.sroll29,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollCleansing.title"), size: 25},
            {text: ("aw.guide.srollCleansing.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll29)
    }
});

ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "illusion", {
    cellX: 7,
    cellY: 1,
    size: 100,
    item: {
        id: ItemID.sroll43,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.illusion.title"), size: 25},
            {text: ("aw.guide.illusion.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll43)
    }
});




// file: guide_book/piece_srollKill.js

ScrutinyAPI.addTab("aw", "srollKill", {
    id: 4,
    icon: ItemID.sroll22,
    title: ("aw.guide.tab.srollKill"),
    isVisual: function(player,  windowName){
        return ScrutinyAPI.isScrutiny(player, windowName, "sroll", "srollDamage3")
    },
    auto_size: true,
});
ScrutinyAPI.addScrutiny("aw", "srollKill", "srollKill", {
    cellX: 1,
    cellY: 1,
    size: 100,
    isDone: [{tab: "sroll", name: "srollDamage3"}],
    item: {
        id: ItemID.sroll8,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollKill.title"), size: 25},
            {text: ("aw.guide.srollKill.text1"), size: 15},
        ],
        right: [
            {text: ("aw.guide.text.characteristics"), size: 20},
            {text: "necromancer 20", size: 15},
            {text: ("aw.guide.srollKill.text2"), size: 15},
        ]
    }
});
ScrutinyAPI.addScrutiny("aw", "srollKill", "srollSummoning", {
    size: 100,
    cellX: 2,
    cellY: 2,
    line: ["srollKill"],
    isDone: ["srollKill"],
    item: {
        id: ItemID.sroll21,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollSummoning.title"), size: 25},
            {text: ("aw.guide.srollSummoning.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll21)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollKill", "srollDeathRay", {
    size: 100,
    cellX: 2,
    cellY: 1,
    line: ["srollKill"],
    isDone: ["srollKill"],
    item: {
        id: ItemID.sroll22,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollDeathRay.title"), size: 25},
            {text: ("aw.guide.srollSummoning.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll22)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollKill", "srollRainOfTheDead", {
    size: 100,
    cellX: 3,
    cellY: 2,
    line: ["srollDeathRay"],
    isDone: ["srollDeathRay"],
    item: {
        id: ItemID.sroll23,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollRainOfTheDead.title"), size: 25},
            {text: ("aw.guide.srollRainOfTheDead.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll23)
    }
});




// file: guide_book/piece_riches.js

ScrutinyAPI.addTab("aw", "riches", {
    id: 6,
    icon: ItemID.RobeOfTheAzureWizard,
    title: ("aw.guide.tab.riches"),
    title_color: android.graphics.Color.rgb(1, 215/255, 0),
    isVisual: function(player,  windowName){
        return ScrutinyAPI.isScrutiny(player, windowName, "basics", "book")
    },
    auto_size: true 
});
Callback.addCallback("LevelDisplayed", function(){
ScrutinyAPI.addScrutiny("aw", "riches", "RobeOfTheAzureWizard", {
    size: 100,
    cellX: 1,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.RobeOfTheAzureWizard,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.RobeOfTheAzureWizard])
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "fire", {
    size: 100,
    cellX: 2,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.fire_king_chestplate,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.fire_king,ItemID.fire_king_chestplate]),
    	right: getArmorBook(80, 20, 15,[ItemID.fire_king_leggings,ItemID.fire_king_boots])
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "bandit", {
    size: 100,
    cellX: 3,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.bandit_chestplate,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.bandit_helmet,ItemID.bandit_chestplate]),
    	right: getArmorBook(80, 20, 15,[ItemID.bandit_leggings,ItemID.bandit_boots])
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "necromancer", {
    size: 100,
    cellX: 4,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.necromancer_chestplate,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.necromancer_helmet,ItemID.necromancer_chestplate]),
    	right: getArmorBook(80, 20, 15,[ItemID.necromancer_leggings,ItemID.necromancer_boots])
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "amylet", {
    size: 100,
    cellX: 5,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.aw_amylet4,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.aw_amylet,ItemID.aw_amylet2]),
    	right: getArmorBook(80, 20, 15,[ItemID.aw_amylet3,ItemID.aw_amylet4])
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "glasses", {
    size: 100,
    cellX: 6,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.aw_glasses,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.aw_glasses]),
    	right: [
    		{text: "aw.glasses.info", size: 15}
    	]
    }
});
});
ScrutinyAPI.addScrutiny("aw", "riches", "tanatos", {
    size: 100,
    cellX: 1,
    cellY: 3,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.tanatos,
    },
    bookPost: {
    	left: [
    		{text: ("aw.guide.tanatos.title"), size: 20},
    		{text: ("aw.guide.tanatos.text"), size: 15}
    	]
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "dead", {
    size: 100,
    cellX: 1,
    cellY: 5,
    isDone: [{tab: "basics", name: "book"}],
    line: ["tanatos"],
    item: {
        id: ItemID.aw_dead,
    },
    bookPost: {
    	left: [
    		{text: ("aw.guide.dead.title"), size: 20},
    		{text: ("aw.guide.dead.text"), size: 15}
    	],
      right: getBookWandData(ItemID.aw_dead)
    }
});

ScrutinyAPI.addScrutiny("aw", "riches", "aw_magic_stick", {
    size: 100,
    cellX: 3,
    cellY: 3,
    isDone: [{tab: "basics", name: "magisStick"}],
    line: [],
    item: {
        id: ItemID.aw_magic_stick,
    },
    bookPost: {
    	left: [
    		{text: "aw.item.aw_magic_stick", size: 20},
    		{text: "aw.guide.dungeon_wands", size: 15}
    	],
      right: getBookWandData(ItemID.aw_magic_stick)
    }
});

ScrutinyAPI.addScrutiny("aw", "riches", "aw_magic_shovel", {
    size: 100,
    cellX: 4,
    cellY: 3,
    isDone: [{tab: "basics", name: "magisSword"}],
    line: [],
    item: {
        id: ItemID.aw_magic_shovel,
    },
    bookPost: {
    	left: [
    		{text: "aw.item.magic_shovel", size: 20},
    		{text: "aw.guide.dungeon_wands", size: 15}
    	],
      right: getBookWandData(ItemID.aw_magic_shovel)
    }
});

ScrutinyAPI.addScrutiny("aw", "riches", "aw_magic_staff", {
    size: 100,
    cellX: 5,
    cellY: 3,
    isDone: [{tab: "basics", name: "magisPocox"}],
    line: [],
    item: {
        id: ItemID.aw_magic_staff,
    },
    bookPost: {
    	left: [
    		{text: "aw.item.magic_staff", size: 20},
    		{text: "aw.guide.dungeon_wands", size: 15}
    	],
      right: getBookWandData(ItemID.aw_magic_staff)
    }
});




// file: guide_book/piece_singularity.js

ScrutinyAPI.addTab("aw", "singularity", {
	id: 7,
	icon: BlockID.magic_crusher,
	title: "aw.guide.tab.singularity",
	title_color: android.graphics.Color.rgb(1, 215/255, 0),
	isVisual: function(player,  windowName){
		return ScrutinyAPI.isScrutiny(player, windowName, "basics", "singularity")
	},
	auto_size: true 
});

Callback.addCallback("LevelDisplayed", function(){
	ScrutinyAPI.addScrutiny("aw", "singularity", "magic_storage", {
		x: 10,
		y: 10,
		size: 100,
		line: [],
		item: {
			id: BlockID.aw_magic_storage,
		},
		bookPost: {
			left: [
				{text: "aw.guide.magic_storage.title", size: 25},
				{text: "aw.guide.magic_storage.info", size: 15},
			],
			right: []
		}
	});
	
	ScrutinyAPI.addScrutiny("aw", "singularity", "magic_crusher", {
		x: 150,
		y: 10,
		size: 100,
		line: [],
		item: {
			id: BlockID.magic_crusher,
		},
		bookPost: {
			left: [
				{text: "aw.guide.magic_crusher.title", size: 25},
				{text: "aw.guide.magic_crusher.info", size: 15},
			],
			right: []
		}
	});
	
	ScrutinyAPI.addScrutiny("aw", "singularity", "clone_scroll", {
		x: 330,
		y: 210,
		size: 100,
		line: [],
		item: {
			id: BlockID.clone_scroll,
		},
		bookPost: {
			left: [
				{text: "aw.block.clone_scroll", size: 25},
				{text: "aw.guide.clone_scroll", size: 15},
			],
			right: []
		}
	});
});




// file: dimension/MagicHills.js

let MagicHills = new Dimensions.CustomDimension("magic_hills", 1045); 
MagicHills.setSkyColor(100/255, 100/255, 100/255) 
MagicHills.setFogColor(100/255, 100/255, 100/255); 

let Dimension = {
	rm: 100,
	gm: 100,
	bm: 100,
	r: 150,
	g: 150,
	b: 150
}
function getColor(name){
	let value = (Math.random()-Math.random());
	return Dimension[name] + value < Dimension[name+"m"] ? Dimension[name+"m"] : Dimension[name] + value
}

Callback.addCallback("LocalTick", function(){
	Dimension.r = getColor("r")
	Dimension.g = getColor("g");
	Dimension.b = getColor("b");
	MagicHills.setSkyColor(Dimension.r/255, Dimension.g/255, Dimension.b/255);
	MagicHills.setFogColor(Dimension.r/255, Dimension.g/255, Dimension.b/255);
})

MagicHills.setGenerator(Dimensions.newGenerator({
generateVanillaStructures: false,
	layers: [{
		//minY: 0, maxY: 128, 
		//yConversion: [[1, .1], [.5, -.2], [-1, .7]],
		minY: 0, maxY: 200, 
		yConversion: [[.8, .1], [.5, -.2], [-.7, .5], [1, -5]],
		material: {base: 1, surface: {id:VanillaBlockID.dirt, data: 0, width:3}, cover: VanillaBlockID.grass}, 
		noise: {
			octaves: {count: 2, scale: 40}
		}
	}]
}));
//Callback.addCallback("ItemUse", function(coords, item){
	//if(item.id==265)
//Dimensions.transfer(Player.get(), MagicHills.id)
//})




// file: dimension/biomes/enchanted_forest.js

let biomes = [1, 4, 5, 27, 155, 19];

const BiomeParticle = [
	Particles.registerParticleType({
 	 texture: "aw_singularity",
	  render: 0,
  	size: [.25, .5],
 	 lifetime: [50, 50],
 	 color: [0, 191/255, 1, 1],
	  animators: {
  	  size: {fadeOut: .4, fadeln:.1, start: 0, end: 1}
 	 }
	}),
	Particles.registerParticleType({
 	 texture: "aw_singularity",
	  render: 0,
  	size: [.25, .5],
 	 lifetime: [50, 50],
 	 color: [1, 0.64, 0, 1],
	  animators: {
  	  size: {fadeOut: .4, fadeln:.1, start: 0, end: 1}
 	 }
	})
];
Callback.addCallback("LocalTick", function(){
	let id = BiomeParticle[Math.floor(Math.random() * BiomeParticle.length)];
	let pos = Entity.getPosition(Player.get());
	if(BlockSource.getCurrentClientRegion().getBiome(pos.x, pos.z) == Enchanted_forest.id)
		for(let i = 0;i < 4;i++)
			Particles.addParticle(id, pos.x + Math.random() * 30 - 15, pos.y + Math.random() * 6 - 3, pos.z + Math.random() * 30 - 15, Math.random()/40, Math.random()/40, Math.random()/40);
});

const Enchanted_forest = new CustomBiome("aw_enchanted_forest")
	.setGrassColor(0, 191/255, 1)
	.setFoliageColor(0, 191/255, 1)
	.setSkyColor(0, 191/255, 1)
	.setWaterColor(0, 191/255, 1)
	.setTemperatureAndDownfall(.1, .5);

	
Callback.addCallback("GenerateChunk", function(chunkX, chunkZ, random, dimensionId, chunkSeed, worldSeed, dimensionSeed){
	if(World.getBiome(chunkX*16, chunkZ*16) == Enchanted_forest.id)
		for(let x = 0;x <= 16;x++){
for(let y = 0;y <= 16;y++){
			let coords = GenerationUtils.findSurface(chunkX*16 + x, 96, chunkZ*16 + y);
			if(World.getBlock(coords.x, coords.y+1, coords.z).id==0&&random.nextInt(4)<=1){
				World.setBlock(coords.x, coords.y+1, coords.z, 31, random.nextInt(2));
if(random.nextInt(100) <= 1)
World.setBlock(coords.x, coords.y+1, coords.z, BlockID.enchantment_forest_flower, 0);

}
}
		}
	for(let i = 0;i < 2+random.nextInt(2);i++){
		let pos = Structure.getRandomCoords(chunkX, chunkZ, random, null, dimensionSeed);
		if(World.getBiome(pos.x, pos.z) == Enchanted_forest.id)
			Structure.setStructure("enchanted_forest_wood_"+random.nextInt(8), pos.x, pos.y, pos.z, BlockSource.getCurrentWorldGenRegion());
	}
});

//это не должно было войти в релиз
/*Network.addServerPacket("test", function(p){
	const size = 1024;
	const seed = Math.floor(Math.random()*10000);
	alert("start, size: "+size+", seed: "+seed)
	let bitmap = android.graphics.Bitmap.createBitmap(size, size, android.graphics.Bitmap.Config.ARGB_4444);
	for(let x = 0;x < size;x++){
		for(let z = 0;z < size;z++){
			//let perlin = GenerationUtils.getPerlinNoise(x*16, 0, z*16, 100, 1/1024, 3);
			let perlin = GenerationUtils.getPerlinNoise(x*16, 0, z*16, seed, 1/1512, 3)
			if(perlin < .75)
				bitmap.setPixel(x, z, android.graphics.Color.rgb(perlin, perlin, perlin))
			else
				bitmap.setPixel(x, z, android.graphics.Color.rgb(255, 0, 0))
		}
		Game.message((x/size)*100+"%")
	}
	FileTools.WriteImage(__dir__+size+".png", bitmap)
	Game.message("end")
});

Callback.addCallback("NativeCommand", function(str){
	let cmd = str.split(".")
	if(cmd[0]!="/g")
		return;
	Network.sendToServer("test", {
		size: cmd[1]
	})
});*/


Callback.addCallback("GenerateBiomeMap", function(chunkX, chunkZ, random, dimensionId, chunkSeed, worldSeed, dimensionSeed){
	if(dimensionId != 0)
		return;
	let X = Math.floor(chunkX) * 16;
	let Z = Math.floor(chunkZ) * 16;

	let biome = World.getBiomeMap(X, Z);
	if(biomes.indexOf(biome) != -1 || GenerationUtils.getPerlinNoise(X, 0, Z, dimensionSeed, 1/1512, 3) < .75)
		return;
	for(let x = 0; x < 16; x++)
		for(let z = 0; z < 16; z++)
			World.setBiomeMap(X+x, Z+z, Enchanted_forest.id);
});




// file: dimension/structure.js

let DISTANCE = __config__.get("structure.DISTANCE") || 150;

ItemGenerate.newGenerator("aw_default");
ItemGenerate.addItem("aw_default", ItemID.piece1, .8, {max: 1})
ItemGenerate.addItem("aw_default", ItemID.piece2, .8, {max: 1})
ItemGenerate.addItem("aw_default", ItemID.piece3, .8, {max: 1})
ItemGenerate.addItem("aw_default", ItemID.loreClass1, .02, {max: 1})
ItemGenerate.addItem("aw_default", ItemID.loreClass2, .02, {max: 1})
ItemGenerate.addItem("aw_default", ItemID.loreClass3, .02, {max: 1})
ItemGenerate.addItem("aw_default", VanillaItemID.bone, .9, {max: 3});
ItemGenerate.addItem("aw_default", VanillaItemID.rotten_flesh, 1, {max: 2});
ItemGenerate.addItem("aw_default", 264, .02, {max: 2});
ItemGenerate.addItem("aw_default", 265, 1, {max: 2});
ItemGenerate.addItem("aw_default", 322, .02, {max: 1});
ItemGenerate.addItem("aw_default", 266, .04, {max: 3});
ItemGenerate.addItem("aw_default", ItemID.rune1, .2, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.rune2, .2, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.rune3, .2, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.rune4, .2, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll6, .05, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll4, .05, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll9, .05, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll1, .03, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll2, .03, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll3, .03, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll7, .02, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.sroll5, .02, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.piece4, .9, {max: 1});
ItemGenerate.addItem("aw_default", ItemID.tanatos, .01, {max: 1});
ItemGenerate.addItem("aw_default", ItemID.RobeOfTheAzureWizard, .01, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.necromancer_helmet, .005, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.necromancer_chestplate, .005, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.necromancer_leggings, .005, {max: 1}, 0);
ItemGenerate.addItem("aw_default", ItemID.necromancer_boots, .005, {max: 1}, 0);

ModAPI.addAPICallback("ICore", function(){
	ItemGenerate.addItem("aw_default", ItemID.iridiumChunk, .05, {min: 2, max: 5});
	ItemGenerate.addItem("aw_default", ItemID.ingotCopper, .6, {min: 1, max: 2});
	ItemGenerate.addItem("aw_default", ItemID.ingotTin, .5, {min: 1, max: 2});
});
	
ItemGenerate.setPrototype("aw_default", {
	generate(pos, rand, slot, item, region, random, packet){
		if(item.id == ItemID.piece4){
			let obj = ScrutinyGeneration.get(random);
			let extra = new ItemExtraData();
			extra.putString("window", obj.win);
			extra.putString("tab", obj.tab);
			extra.putString("name", obj.name);
			extra.putString("name2", obj.name2);
			World.getContainer(pos.x, pos.y, pos.z, region).setSlot(slot, item.id, item.count, item.data, extra);
		}
	}
});
	
ItemGenerate.newGenerator("aw_default_2");
ItemGenerate.addItem("aw_default_2", 264, .04, {max: 3});
ItemGenerate.addItem("aw_default_2", 265, 1, {max: 3});
ItemGenerate.addItem("aw_default_2", 322, .03, {max: 2});
ItemGenerate.addItem("aw_default_2", ItemID.SpellSet31, .3, {max: 1});
ItemGenerate.addItem("aw_default_2", 266, .25, {max: 3});
ItemGenerate.addItem("aw_default_2", ItemID.acolyteStaff, .4, {max: 1});
ItemGenerate.addItem("aw_default_2", VanillaItemID.bone, .9, {max: 1, slotMax: 3});
ItemGenerate.addItem("aw_default_2", VanillaItemID.rotten_flesh, 1, {max: 1, slotMax: 3});
ItemGenerate.addItem("aw_default_2", ItemID.regularBag, .3, {max: 3});
ItemGenerate.addItem("aw_default_2", ItemID.magic_crystal, .3, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_glasses, .01, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.rune_absorption, 0.1, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.rune_greed, .01, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_potions_book, .5, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_bottle_potion, .1, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.decor10, .1, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_magic_stick, .05, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_magic_shovel, .05, {max: 1});
ItemGenerate.addItem("aw_default_2", ItemID.aw_magic_staff, .05, {max: 1});

//if(this["CustomEnchant"]){
	ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .2, {max: 1}, 0, (function(){
		let extra = new ItemExtraData();
extra.addEnchant(aspects_restoration.id, 1);
return extra;
	})());
	
	ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .1, {max: 1}, 0, (function(){
		let extra = new ItemExtraData();
		extra.addEnchant(aspects_restoration.id, 2);
		return extra;
	})());
ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .05, {max: 1}, 0, (function(){
	let extra = new ItemExtraData();
	extra.addEnchant(magic_protection.id, 2);
	return extra;
})());
ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .05, {max: 1}, 0, (function(){
	let extra = new ItemExtraData();
	extra.addEnchant(magic_protection.id, 1);
	return extra;
})());
ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .05, {max: 1}, 0, (function(){
	let extra = new ItemExtraData();
	extra.addEnchant(dead_protection.id, 2);
	return extra;
})());
ItemGenerate.addItem("aw_default_2", VanillaItemID.enchanted_book, .05, {max: 1}, 0, (function(){
	let extra = new ItemExtraData();
	extra.addEnchant(dead_protection.id, 1);
	return extra;
})());
//}

const EVENT_SPAWN_POTION = [ItemID.aw_brain, VanillaItemID.gunpowder];
const INGREDIENT_SPAWN_POTION = [ItemID.enchantment_forest_flower, VanillaItemID.rabbit_foot, VanillaItemID.sugar, VanillaItemID.blaze_powder, VanillaItemID.spider_eye, VanillaItemID.spider_eye, VanillaItemID.spider_eye];
const UPDATE_SPAWN_POTION = [VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, ItemID.aw_petal_powder, ItemID.aw_petal_powder, 0, 0, 0, ItemID.aw_dragon_powder];

ItemGenerate.setPrototype("aw_default_2", {
	generate(pos, rand, slot, item, region, random, packet){
		if(item.id == ItemID.aw_bottle_potion){
			let items = [{id: EVENT_SPAWN_POTION[randInt(0, EVENT_SPAWN_POTION.length)], count: 1, data: 0}, {id: INGREDIENT_SPAWN_POTION[randInt(0, INGREDIENT_SPAWN_POTION.length)], count: 1, data: 0}];
			let update = UPDATE_SPAWN_POTION[randInt(0, UPDATE_SPAWN_POTION.length)];
			if(update != 0) items.push({id: update, count: 1, data: 0});
			let extra = Wands.getExtraByArr(items);
			let color = Potion.mathColorPotion(items);
			extra.putInt("R", color.r < 0 ? 0 : color.r);
			extra.putInt("G", color.g < 0 ? 0 : color.g);
			extra.putInt("B", color.b < 0 ? 0 : color.b);
			extra.putString("RGB", extra.getInt("R", 0)+"."+extra.getInt("G", 0)+"."+extra.getInt("B", 0));
			World.getContainer(pos.x, pos.y, pos.z, region).setSlot(slot, item.id, item.count, item.data, extra);
		}
	}
});

ModAPI.addAPICallback("ICore", function(){
	ItemGenerate.addItem("aw_default_2", ItemID.iridiumChunk, .05, {min: 2, max: 5});
	ItemGenerate.addItem("aw_default_2", ItemID.ingotCopper, .6, {min: 1, max: 2});
	ItemGenerate.addItem("aw_default_2", ItemID.ingotTin, .5, {min: 1, max: 2});
});


Callback.addCallback("StructureLoadOne", function(){
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_cursed_tower",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.Cursed_Tower"),
		structure: new Structure.advanced("aw_cursed_tower").setPrototype({
			after(x, y, z, region, packet){
				if(region.getBlockId(x, y+13, z) == VanillaBlockID.mob_spawner){
  				let tag = region.getBlockEntity(x, y+13, z).getCompoundTag();
    			tag.putString("EntityIdentifier", "minecraft:skeleton");
    			region.getBlockEntity(x, y+13, z).setCompoundTag(tag);
				}
        ItemGenerate.fill("aw_default_2", x-2, y+1, z+2, packet.random, region);
        ItemGenerate.fill("aw_default_2", x+2, y+1, z+2, packet.random, region);
        ItemGenerate.fill("aw_default_2", x-2, y+1, z-2, packet.random, region);
        ItemGenerate.fill("aw_default_2", x+2, y+1, z-2, packet.random, region);
        ItemGenerate.fill("aw_default_2", x, y+1, z, packet.random, region);
        
        ItemGenerate.fill("aw_default", x-3, y+10, z, packet.random, region);
        ItemGenerate.fill("aw_default", x+3, y+10, z, packet.random, region);
        ItemGenerate.fill("aw_default", x, y+10, z+3, packet.random, region);
        ItemGenerate.fill("aw_default", x, y+10, z-3, packet.random, region);
        region.setBlock(x, y-1, z, VanillaBlockID.tnt);
        region.setBlock(x, y-2, z, VanillaBlockID.tnt);
        region.setBlock(x, y-3, z, VanillaBlockID.tnt);
			}
		})
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_magic_temple",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.magic_temple"),
		structure: new Structure.advanced("aw_magic_temple").setPrototype({
			after(x, y, z, region, packet){
				ItemGenerate.fill("aw_default_2", x, y+1, z, packet.random, region);
			}
		})
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_house_of_magicians",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.House_of_magicians"),
		structure: new Structure.advanced("aw_house_of_magicians")
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_temple",
		distance: DISTANCE,
		isSet: false,
		chance: __config__.getNumber("structure.Temple"),
		structure: new Structure.advanced("aw_temple").setPrototype({
			after(x, y, z, region, packet){
				ItemGenerate.fill("aw_default", x, y+1, z, packet.random, region);
			}
		})
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_tower_of_evil",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.Tower_of_evil"),
		structure: new Structure.advanced("aw_tower_of_evil").setPrototype({
			after(x, y, z, region, packet){
				ItemGenerate.fill("aw_default", x, y+1, z, packet.random, region);
			}
		})
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_ordinary_temple",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.Ordinary_temple"),
	
		structure: new Structure.advanced("aw_ordinary_temple").setPrototype({
			after(x, y, z, region, packet){
				ItemGenerate.fill("aw_default", x, y+2, z-1, packet.random, region);
				ItemGenerate.fill("aw_default", x, y+2, z, packet.random, region);
				ItemGenerate.fill("aw_default", x+1, y+2, z, packet.random, region);
				ItemGenerate.fill("aw_default", x+1, y+2, z-1, packet.random, region);
			}
		})
	}));
	
	StructurePiece.register(StructurePiece.getDefault({
		type: "default",
		dimension: 0,
		name: "aw_ordinary_temple",
		distance: DISTANCE,
		isSet: false,
		white_list_blocks: true,
		blocks: [2],
		chance: __config__.getNumber("structure.Tower_of_darkness"),
		structure: new Structure.advanced("aw_tower_of_darkness").setPrototype({
			after(x, y, z, region, packet){
				ItemGenerate.fill("aw_default", x, y, z-1, packet.random, region);
				ItemGenerate.fill("aw_default", x, y, z+1, packet.random, region);
				ItemGenerate.fill("aw_default", x+1, y, z, packet.random, region);
				ItemGenerate.fill("aw_default", x-1, y, z, packet.random, region);
			}
		})
	}))
});
	
ItemGenerate.registerRecipeViewer("aw_default")
ItemGenerate.registerRecipeViewer("aw_default_2")
/*
a very outdated piece of code



let Fortress1 = new DungeonAPI("fortress/1.json");
Fortress1.setPrototype({
    isSetBlock: function(x, y, z, id, data, identifier, packet, dimension){
        if(id == 98){
            switch(packet.random.nextInt(3)){
		            	case 0:
			            	World.setBlock(x, y, z, 98, 0);
			           break;
		          		case 1:
			            	World.setBlock(x, y, z, 98, 1);
		          	 break;
	          			case 2:
			          		World.setBlock(x, y, z, 98, 2);
			           break;
			       }
        }else{
            return true;
        }
    }
});
let Fortress2 = new DungeonAPI("fortress/2.json");
Fortress2.setPrototype({
    isSetBlock: function(x, y, z, id, data, identifier, packet, dimension){
        if(id == 98){
            switch(packet.random.nextInt(3)){
		            	case 0:
			            	World.setBlock(x, y, z, 98, 0);
			           break;
		          		case 1:
			            	World.setBlock(x, y, z, 98, 1);
		          	 break;
	          			case 2:
			          		World.setBlock(x, y, z, 98, 2);
			           break;
			       }
        }else{
            return true;
        }
    }, 
    after: function(x, y, z, rotation, packet, dimension){
        if(World.getBlockID(x-6, y+4, z)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x-6, y, z, 0, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x-12, y, z, 0,  dimension, packet);
                 }else{
                     Fortress3.setStructure(x-12, y, z, 0,  dimension, packet);
                     ItemGenerate.fillChestSit(x-12, y+1, z, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x+6, y+4, z)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x+6, y, z, 0, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x+12, y, z, 0,  dimension, packet);
                 }else{
                     Fortress3.setStructure(x+12, y, z, 0,  dimension, packet);
                     ItemGenerate.fillChestSit(x+12, y+1, z, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x, y+4, z+6)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x, y, z+6, 3, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y, z+12, 0,  dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y, z+12, 0,  dimension, packet);
                     ItemGenerate.fillChestSit(x, y+1, z+12, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x, y+4, z-6)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x, y, z-6, 3, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y, z-12, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y, z-12, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x, y+1, z-12, packet.random, dimension);
                 }
            }
        }
    }
});
let Fortress3 = new DungeonAPI("fortress/3.json");
Fortress3.setPrototype({
    isSetBlock: function(x, y, z, id, data, identifier, packet, dimension){
        if(id == 98){
            switch(packet.random.nextInt(3)){
		            	case 0:
			            	World.setBlock(x, y, z, 98, 0);
			           break;
		          		case 1:
			            	World.setBlock(x, y, z, 98, 1);
		          	 break;
	          			case 2:
			          		World.setBlock(x, y, z, 98, 2);
			           break;
			       }
        }else{
            return true;
        }
    }, 
    after: function(x, y, z, rotation, packet, dimension){
        if(World.getBlockID(x-6, y+4, z)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x-6, y, z, 0, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x-12, y, z, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x-12, y, z, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x-12, y+1, z, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x+6, y+4, z)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x+6, y, z, 0, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x+12, y, z, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x+12, y, z, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x+12, y+1, z, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x, y+4, z+6)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x, y, z+6, 3, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y, z+12, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y, z+12, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x, y+1, z+12, packet.random, dimension);
                 }
            }
        }
        if(World.getBlockID(x, y+4, z-6)!=98){
            if(packet.random.nextInt(100)<=10){
                Fortress1.setStructure(x, y, z-6, 3, dimension, packet);
                if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y, z-12, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y, z-12, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x, y+1, z-12, packet.random, dimension);
                 }
            }
        }
    }
});
let Fortress0 = new DungeonAPI("fortress/0.json");
Fortress0.setPrototype({
    isSetBlock: function(x, y, z, id, data, identifier, packet, dimension){
        if(id == 98){
            switch(packet.random.nextInt(3)){
		            	case 0:
			            	World.setBlock(x, y, z, 98, 0);
			           break;
		          		case 1:
			            	World.setBlock(x, y, z, 98, 1);
		          	 break;
	          			case 2:
			          		World.setBlock(x, y, z, 98, 2);
			           break;
			       }
        }else{
            return true;
        }
    }, 
    after: function(x, y, z, rotation, packet, dimension){
        if(packet.random.nextInt(1)<=1){
            Fortress1.setStructure(x+6, y-8, z, 0, dimension, packet);
             if(packet.random.nextInt(1)<=1){
                 if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x+12, y-8, z, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x+12, y-8, z, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x+12, y-7, z, packet.random, dimension);
                 }
             }
        }
        if(packet.random.nextInt(100)<=40){
            Fortress1.setStructure(x-6, y-8, z, 0, dimension, packet);
            if(packet.random.nextInt(100)<=30){
                 if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x-12, y-8, z, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x-12, y-8, z, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x-12, y-7, z, packet.random, dimension);
                 }
            }
        }
        if(packet.random.nextInt(100)<=50){
            Fortress1.setStructure(x, y-8, z+6, 1, dimension, packet);
            if(packet.random.nextInt(100)<=40){
                 if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y-8, z-12, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y-8, z-12, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x, y-7, z-12, packet.random, dimension);
                 }
            }
        }
        if(packet.random.nextInt(100)<=50){
            Fortress1.setStructure(x, y-8, z-6, 1, dimension, packet);
            if(packet.random.nextInt(100)<=40){
                 if(packet.random.nextInt(100)<70){
                     Fortress2.setStructure(x, y-8, z+12, 0, dimension, packet);
                 }else{
                     Fortress3.setStructure(x, y-8, z+12, 0, dimension, packet);
                     ItemGenerate.fillChestSit(x, y-7, z+12, packet.random, dimension);
                 }
            }
        }
    }
});
Callback.addCallback("GenerateChunk", function(chunkX, chunkZ, random, id){
    if(random.nextInt(__config__.getNumber("structure.fortress")) < 1){
        let coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(16), 96, chunkZ*16 + random.nextInt(16));
        Fortress0.setStructure(coords.x, coords.y, coords.z, 0, id, {random: random, rooms: random.nextInt(10)+10});
    } 
});*/


ItemGenerate.setItemIntegration(ItemID.RobeOfTheAzureWizard, .005, {max: 1}, 0);
ItemGenerate.setItemIntegration(ItemID.tanatos, .005, {max: 1}, 0);
ItemGenerate.setItemIntegration(ItemID.loreClass1, .01, {max: 1});
ItemGenerate.setItemIntegration(ItemID.loreClass2, .01, {max: 1});
ItemGenerate.setItemIntegration(ItemID.loreClass3, .01, {max: 1});
ItemGenerate.setItemIntegration(ItemID.magic_crystal, .1, {max: 1});





// file: dimension/kingdom_darkness/dimension.js





// file: dimension/kingdom_darkness/generation.js





// file: dimension/kingdom_darkness/structures.js





// file: ritual/clone.js


    Callback.addCallback("ItemUse", function(coords, item, block, isExternal, player) {
        if(item.id == ItemID.bookk){
            var b = BlockSource.getDefaultForActor(player);
            if(b.getBlockId(coords.x, coords.y, coords.z) == BlockID.rityalPedestal){
                if(b.getBlockId(coords.x+2, coords.y, coords.z+2) == BlockID.rityalPedestal){
                    if(b.getBlockId(coords.x-2, coords.y, coords.z+2) == BlockID.rityalPedestal){
                         if(b.getBlockId(coords.x+2, coords.y, coords.z-2) == BlockID.rityalPedestal){
                             if(b.getBlockId(coords.x-2, coords.y, coords.z-2) == BlockID.rityalPedestal){
                                if(TileEntity.getTileEntity(coords.x+2, coords.y, coords.z+2, b).data.item.id == ItemID.rune6){
                                     if(TileEntity.getTileEntity(coords.x-2, coords.y, coords.z+2, b).data.item.id == ItemID.rune6){
                                         if(TileEntity.getTileEntity(coords.x+2, coords.y, coords.z-2, b).data.item.id == ItemID.rune6){
                                             if(TileEntity.getTileEntity(coords.x-2, coords.y, coords.z-2, b).data.item.id == ItemID.rune6){
                                                 if(TileEntity.getTileEntity(coords.x, coords.y, coords.z, b).data.item.id != 0){
                                                  let d = MagicCore.getValue(player);
                                                  if(d.Aspects>=500){
                                                 if(d.magis>=30){
                                                     
      let Itemm = TileEntity.getTileEntity(coords.x, coords.y, coords.z, b).data.item;
      let pa = new PlayerActor(player);
                              if(pa.getGameMode()==0){
                                  TileEntity.getTileEntity(coords.x, coords.y, coords.z, b).drop(player);
                              }else{
                                 TileEntity.getTileEntity(coords.x, coords.y, coords.z, b).drop(player);
                                  b.spawnDroppedItem(coords.x, coords.y+1, coords.z, Itemm.id, 1, Itemm.data);
                              }b.spawnDroppedItem(coords.x, coords.y+1, coords.z, Itemm.id, 1, Itemm.data);
                    d.Aspects -= 500;
                    if(Math.random()<=0.5){
                        if(d.AspectsNow + 500 <= d.AspectsMax){
                            d.AspectsNow+=500;
                        }else{
                            d.AspectsNow=d.AspectsMax;
                        }        
                        MagicCore.setParameters(player, d);                                                                                             
                                                     }
                                                    }else{
                                                        
                                                        
                                                 PlayerAC.message(player, Translation.translate("aw.message.ritualMagic30"))       
                                                    }
                                                }else{
                                                    
                                                  PlayerAC.message(player, Translation.translate("aw.message.ritualAspect500"))  
                                                }
                                            } 
                                        } 
                                    } 
                               } 
                            } 
                        } 
                    } 
                } 
            }
        }
       } 
    });




// file: ritual/spawn.js

if(!Game.isDedicatedServer()){
	Callback.addCallback("ItemUse", function(coords, item, block, isExternal, player) {
		if(item.id == ItemID.bookk){
			let region = BlockSource.getDefaultForActor(player)
			if(Structure.isStructure("aw_ritual_0", coords.x, coords.y, coords.z, region)){
				Structure.destroy("aw_ritual_0", coords.x, coords.y, coords.z, region);
				region.spawnEntity(coords.x,coords.y, coords.z, "aw:boss0");
			}
		}
	});
}




// file: ritual/ritual_enchant_level.js

RitualAPI.register("enchant_level", {
	stru: "aw_ritual_enchant_level",
	enable: false 
}, {
	getResult(tile, coords, result, player, region){
		let item = tile.data.item;
		let all = item.extra.getEnchants();
		let keys = Object.keys(all);
		let key = keys[Math.floor(Math.random()*keys.length)];
		item.extra.addEnchant(key, all[key]+1);
		return item;
	},
	isStartRitual(tile, coords, player, region){
		return tile.data.item.extra && tile.data.item.extra.getEnchantCount() > 0;
	},
	getParameters(tile, coords, parameters, player, region){
		parameters = JSON.parse(JSON.stringify(parameters));
		let level = 0;
		let all = tile.data.item.extra ? tile.data.item.extra.getEnchants() : {1: 1};
		for(let key in all)
			level += all[key];
		parameters.aspects = level * level * parameters.aspects;
		return parameters;
	}
});

RitualAPI.add("enchant_level", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal], null, {
	protection: 40,
	aspects: 100
});




// file: categor.js

let categor = {
    nature: [ItemID.enchantment_forest_flower],
    govno: [ItemID.rune1,ItemID.rune2,ItemID.rune3,ItemID.rune4,ItemID.rune5,ItemID.rune6,ItemID.bookk,ItemID.loreClass1,ItemID.loreClass2,ItemID.loreClass3,ItemID.piece1,ItemID.piece2,ItemID.piece3,ItemID.rune_absorption,ItemID.rune_greed,ItemID.regularBag, ItemID.aw_magic_ingot, ItemID.aw_bottle_empty, ItemID.aw_bottle_potion, ItemID.aw_brain, ItemID.spider_legs, ItemID.aw_mysterious_powder, ItemID.witherbone, ItemID.aw_dragon_powder, ItemID.dead_essence, ItemID.magic_crystal, ItemID.magic_plate, ItemID.staff_singularity, ItemID.tanatos, ItemID.piece4, ItemID.scrutiny_book, ItemID.aw_backpack, ItemID.crystal_powder, ItemID.aw_petal_powder, ItemID.rune_life, ItemID.rune_dead,ItemID.aw_potions_book]
};
for(let i in categor.nature)
    Item.setCategory(categor.nature[i], 2);
for(let i in categor.govno)
    Item.setCategory(categor.govno[i], 4);




// file: command.js

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




// file: crafts/Workbench.js

Callback.addCallback("PostLoaded", function() {
    Bag1.addItem(0.5, 264, {min: 1, max: 2}, 0);
Bag1.addItem(0.4, 266, {min: 2, max: 3}, 0);
Bag1.addItem(0.1, BlockID.magicController);
Bag1.addItem(0.05, BlockID.bowlWishes);
Bag1.addItem(0.01, ItemID.sroll17);
Bag1.addItem(0.3, ItemID.sroll1);
Bag1.addItem(0.3, ItemID.sroll2);
Bag1.addItem(0.3, ItemID.sroll3);
Bag1.addItem(0.1, ItemID.loreClass1);
Bag1.addItem(0.2, ItemID.loreClass2);
Bag1.addItem(0.05, ItemID.loreClass3);
Bag1.addItem(0.1, ItemID.sroll4);
Bag1.addItem(0.1, ItemID.sroll6);
Bag1.addItem(0.1, ItemID.sroll6);
Bag1.addItem(0.3, ItemID.sroll19);
//скины
Wands.addIconAll("protection_wand", 0);
Wands.addIconAll("meteor_rain_wand", 0);
Wands.addIconAll("treatment_wand", 0);
Wands.addIconAll("skin", 2);
Wands.addIcon(ItemID.magis_stick, "magis_stick", 1);
Wands.addIcon(ItemID.acolyteStaff, "acolyte_staff", 1);
Wands.addIcon(ItemID.magis_stick, "skin", 0);
Wands.addIcon(ItemID.magis_stick, "skin", 1);
Wands.addIcon(ItemID.magis_sword, "magis_sword", 1);
Wands.addIcon(ItemID.magis_pocox, "magis_pocox", 1);
Wands.addIcon(ItemID.magis_pocox, "skin", 0);
Wands.addIcon(ItemID.magis_pocox, "skin", 1);
Wands.addIcon(ItemID.magis_stick_2_lvl, "magis_stick_2_lvl", 1);
Wands.addIcon(ItemID.magis_sword_2_lvl, "magis_sword_2_lvl", 1);
Wands.addIcon(ItemID.magis_pocox_2_lvl, "magic_staff_2_lvl", 1);

Recipes.addShaped({id: BlockID.aw_magic_stone, count: 8, data: 0},
	["aaa", 
	 "aba",
	 "aaa"], 
['a', VanillaBlockID.stone, 0, "b", ItemID.magic_crystal, 0]);

Recipes.addShaped({id: BlockID.aw_magic_brick, count: 4, data: 0},
	["aa", 
	 "aa",
	 ""], 
['a', BlockID.aw_magic_stone, 0]);

Recipes.addShaped({id: ItemID.aw_backpack, count: 1, data: 0},
	  ["akb", "kkk", "ckd"], 
['a', ItemID.rune1, 0, 'b', ItemID.rune2, 0, 'c', ItemID.rune3, 0, 'd', ItemID.rune4, 0, 'k', VanillaItemID.leather, 0]);
Recipes.addShaped({id: ItemID.crystal_powder, count: 1, data: 0},
	  ["ab", "", ""], 
['a', ItemID.magic_crystal, 0, 'b', ItemID.aw_mysterious_powder, 0]);
Recipes.addShaped({id: BlockID.rityalPedestal, count: 1, data: 0},
	  ["aga", "aba", "aba"], 
['a', 98, 0, 'b', 265, 0, 'g', 264, 0]);
Recipes.addShaped({id: ItemID.loreClass1, count: 1, data: 0},
   	["*a*", "*bs", "*g*"], 
["a", ItemID.piece1, 0, "b", ItemID.piece2, 0, "g", ItemID.piece3, 0, "s", 368, 0]);
  	Recipes.addShaped({id: ItemID.loreClass2, count: 1, data: 0},
   	["*a*", "*bs", "*g*"], 
["a", ItemID.piece1, 0, "b", ItemID.piece2, 0, "g", ItemID.piece3, 0, "s", 267, 0]);
  	Recipes.addShaped({id: ItemID.loreClass3, count: 1, data: 0},
   	["*a*", "*bs", "*g*"], 
["a", ItemID.piece1, 0, "b", ItemID.piece2, 0, "g", ItemID.piece3, 0, "s", 370, 0]);


/*Recipes.addShaped({id: ItemID.magis_stick, count: 1, data: 0},
	  ["#ca", 
	   "#gc", 
	   "b##"], 
['a', ItemID.rune3, 0, 'b', 280, 0, 'c', ItemID.rune2, 0, 'g', ItemID.acolyteStaff, 0]);*/

Recipes.addShaped({id: ItemID.bookk, count: 1, data: 0},
	  ["#a#", "aba", "#a#"], 
['a', 367, 0, 'b', 340, 0]);
Recipes.addShaped({id: ItemID.scrutiny_book, count: 1, data: 0},
	  ["#b#", "cag", "#e#"], 
['a', ItemID.bookk, 0, 'b', ItemID.rune1, 0, 'c', ItemID.rune2, 0, 'g', ItemID.rune3, 0, 'e', ItemID.rune4, 0]);
/*Ritual.lvl1({
    id: ItemID.rune6,
    data: 0
},{
    item1: ItemID.rune4, 
    item2: ItemID.rune2
},{
    aspects: 200, 
    magis: 20
});
Ritual.lvl1({
    id: ItemID.rune5,
    data: 0
},{
    item1: ItemID.rune4, 
    item2: ItemID.rune1
},{
    aspects: 200, 
    magis: 20
});
Ritual.lvl1({
    id: ItemID.sroll10,
    data: 0
},{
    item1: ItemID.rune5, 
    item2: ItemID.sroll4
},{
    aspects: 500, 
    magis: 20
});
Ritual.lvl1({
    id: ItemID.sroll11,
    data: 0
},{
    item1: ItemID.rune5, 
    item2: ItemID.sroll10
},{
    aspects: 500, 
    magis: 20
});
Ritual.lvl1({
    id: ItemID.sroll8,
    data: 0
},{
    item1: ItemID.rune5, 
    item2: ItemID.sroll11
},{
    aspects: 500, 
    magis: 20
});
Ritual.lvl1({
    id: ItemID.sroll14,
    data: 0
},{
    item1: ItemID.rune2, 
    item2: ItemID.sroll9
},{
    aspects: 500, 
    magis: 20
});
Ritual.lvl1({
    id: ItemID.sroll12,
    data: 0
},{
    item1: ItemID.rune4, 
    item2: ItemID.sroll6
},{
    aspects: 500, 
    magis: 20
});
Ritual.lvl1({
    id: ItemID.sroll13,
    data: 0
},{
    item1: ItemID.rune4, 
    item2: ItemID.sroll12
},{
    aspects: 500, 
    magis: 10
});
Ritual.lvl1({
    id: ItemID.sroll18,
    data: 0
},{
    item1: ItemID.rune3, 
    item2: ItemID.sroll4
},{
    aspects: 100, 
    magis: 15
});
Ritual.lvl1({
    id: ItemID.sroll19,
    data: 0
},{
    item1: ItemID.rune3, 
    item2: ItemID.sroll6
},{
    aspects: 200, 
    magis: 20
});
Ritual.lvl1({
    id: ItemID.sroll21,
    data: 0
},{
    item1: ItemID.rune3, 
    item2: ItemID.sroll10
},{
    aspects: 300, 
    magis: 15
});
Ritual.lvl1({
    id: ItemID.sroll22,
    data: 0
},{
    item1: ItemID.rune3, 
    item2: ItemID.sroll8
},{
    aspects: 300, 
    magis: 15
});
Ritual.lvl1({
    id: ItemID.sroll23,
    data: 0
},{
    item1: ItemID.sroll4, 
    item2: ItemID.sroll8
},{
    aspects: 300, 
    magis: 15
});
Ritual.lvl1({
    id: ItemID.sroll24,
    data: 0
},{
    item1: ItemID.rune4, 
    item2: ItemID.rune4
},{
    aspects: 1000, 
    magis: 10
});
Ritual.lvl1({
    id: ItemID.sroll26,
    data: 0
},{
    item1: 46, 
    item2: ItemID.rune3
},{
    aspects: 500, 
    magis: 10
});*/
Recipes.addShaped({id: ItemID.sroll27, count: 1, data: 0},
	  ["###", "#ab", "bbb"], 
['a', 264, 0, 'b', 348, 0]);
Recipes.addShaped({id: ItemID.sroll28, count: 1, data: 0},
	  ["bbb", "bab", "bbb"], 
['a', 264, 0, 'b', 348, 0]);

Recipes.addShaped({id: ItemID.aw_amylet, count: 1, data: 0},
	  ["aga", "aia", "bbb"], 
['a', 334, 0, 'b', 266, 0, 'g', 264, 0, 'i', ItemID.piece1, 0]);
Recipes.addShaped({id: ItemID.aw_amylet3, count: 1, data: 0},
	  ["aga", "aia", "bbb"], 
['a', 334, 0, 'b', 266, 0, 'g', 264, 0, 'i', ItemID.piece2, 0]);
Recipes.addShaped({id: ItemID.aw_amylet2, count: 1, data: 0},
	  ["aga", "aia", "bbb"], 
['a', 334, 0, 'b', 266, 0, 'g', 264, 0, 'i', ItemID.piece3, 0]);
/*Recipes.addShaped({id: ItemID.aw_amylet4, count: 1, data: 0},
	  ["aga", "aia", "bbb"], 
['a', 334, 0, 'b', 266, 0, 'g', 264, 0, 'i', ItemID.sroll24, 0]);*/
/*Recipes.addShaped({id: ItemID.magis_sword, count: 1, data: 0},
	  ["#b#", 
	   "gag", 
	   "#c#"], 
['a', 267, 0, 'b', ItemID.rune1, 0, 'g', ItemID.rune2, 0, 'c', ItemID.acolyteStaff, 0]);
Recipes.addShaped({id: ItemID.magis_pocox, count: 1, data: 0},
	  ["##g", 
	   "#c#", 
	   "b##"], 
['b', 280, 0, 'g', ItemID.rune5, 0, 'c', ItemID.acolyteStaff, 0]);*/
Recipes.addShaped({id: BlockID.research_table, count: 1, data: 0},
	  ["bbb",
	   "cgc",
	   "c#c"], 
['b', 5, 0, 'g', 264, 0, 'c', 280, 0]);

Recipes.addShaped({id: BlockID.singularity_shrinker, count: 1, data: 0},
	  ["ccc", "cgc", "bbb"], 
['b', VanillaBlockID.obsidian, 0, 'g', 264, 0, 'c', 98, 0]);

Recipes.addShaped({id: BlockID.singularity_extract, count: 1, data: 0},
	  ["ccc", "cgc", "bbb"], 
['c', VanillaBlockID.obsidian, 0, 'g', 264, 0, 'b', 98, 0]);
Recipes.addShaped({id: BlockID.transmitter, count: 4, data: 0},
	  ["bcb", "cgc", "bcb"], 
['c', VanillaBlockID.obsidian, 0, 'g', 264, 0, 'b', 1, 0]);
if(__config__.getBool("beta_mode")){
Recipes.addShaped({id: ItemID.beltAw, count: 1, data: 0},
	  ["bbb", "gbg", "bbb"], 
['b', 266, 0, 'g', ItemID.aw_amylet2, 0]);
}
});




// file: crafts/ritual.js

ModAPI.addAPICallback("AncientWondersAPI", function(){
RitualAPI.registerEffectType("default", function(packet){
	let pos = {
		x: packet.coords.x,
		y: packet.coords.y,
		z: packet.coords.z 
	};
	pos.y+=1.5;
	pos.z+=.5;
	pos.x+=.5;
	let group = new ParticlesCore.Group();
	for(let c = 0;c<=1;c++){
		let step = 360 / 60+(Math.floor(Math.random()*10));
		for(i = 0;i < 360;i+=step){
    	let x = pos.x + .5 * Math.cos(i);
      let z = pos.z - .5 * Math.sin(i);
      let y = pos.y + Math.random() / 8;
      let vector = {
      	x: -(pos.x - x) / 3,
        y: -(pos.y - y) / 3,
      	z: -(pos.z - z) / 3
    	};
       group.add(ParticlesAPI.part1Colision, x, y, z, vector.x, vector.y, vector.z);
  	}
	}
	group.send(Entity.getDimension(packet.player));
});
RitualAPI.registerEffectType("default_2", function(packet){
	BlockSource.getDefaultForActor(packet.player).spawnEntity(packet.coords.x, packet.coords.y+1, packet.coords.z, "minecraft:lightning_bolt")
});
RitualAPI.addRecipe("ritual_1", "aw_magic_ingot", [VanillaItemID.iron_ingot, VanillaItemID.iron_ingot, ItemID.magic_crystal, ItemID.rune4], {
	id: ItemID.aw_magic_ingot,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 10,
	protection: 10
});
RitualAPI.addRecipe("ritual_1", "rune_life", [ItemID.rune4, ItemID.rune4, ItemID.magic_plate, ItemID.rune4], {
	id: ItemID.rune_life,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 10
});
RitualAPI.addRecipe("ritual_1", "rune_dead", [ItemID.rune5, ItemID.rune5, ItemID.magic_plate, ItemID.rune5], {
	id: ItemID.rune_dead,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	necromancer: 10
});
RitualAPI.addRecipe("ritual_1", "sroll42", [ItemID.aw_magic_ingot, ItemID.rune_greed, ItemID.magic_crystal, ItemID.rune_absorption], {
	id: ItemID.sroll42,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 10,
	protection: 20
});
RitualAPI.addRecipe("ritual_1", "enchanted_stone", [VanillaBlockID.stone, VanillaBlockID.stone, ItemID.aw_petal_powder, ItemID.aw_petal_powder], {
	id: BlockID.aw_enchanted_stone,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 10
});
RitualAPI.addRecipe("ritual_1", "aw_dragon_powder", [ItemID.aw_petal_powder, ItemID.aw_petal_powder, ItemID.dead_essence, ItemID.rune5], {
	id: ItemID.aw_dragon_powder,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 250,
	magic: 15,
	necromancer: 5,
	protection: 5
});
RitualAPI.addRecipe("ritual_2", "magic_crusher", [BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.rune_absorption, ItemID.rune_greed, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot], {
	id: BlockID.magic_crusher,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 5,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "magic_smithy", [ItemID.aw_magic_ingot, ItemID.aw_magic_ingot, 98, 98, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot], {
	id: BlockID.magic_smithy,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 400,
	magic: 15,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "fire_king", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, 298], {
	id: ItemID.fire_king,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 15,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "fire_king_chestplate", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, 299], {
	id: ItemID.fire_king_chestplate,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 15,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "fire_king_leggings", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, 300], {
	id: ItemID.fire_king_leggings,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 15,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "fire_king_boots", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, 301], {
	id: ItemID.fire_king_boots,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 15,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "bandit_helmet", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, 298], {
	id: ItemID.bandit_helmet,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 10,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "bandit_chestplate", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, 299], {
	id: ItemID.bandit_chestplate,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 10,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "bandit_leggings", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, 300], {
	id: ItemID.bandit_leggings,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 10,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "bandit_boots", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, 301], {
	id: ItemID.bandit_boots,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 10,
	protection: 10,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "magicController", [ItemID.rune1, ItemID.rune2, ItemID.rune3, ItemID.rune4, ItemID.magic_plate, ItemID.magic_plate, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot], {
	id: BlockID.magicController,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "aw_mysterious_powder", [ItemID.rune1, ItemID.rune2, ItemID.rune3, ItemID.rune4], {
	id: ItemID.aw_mysterious_powder,
	data: 0,
	count: 1,
	extra: null
}, {
	magic: 15
}, ["default_2", "default"]);
RitualAPI.addRecipe("ritual_1", "staff_singularity", [VanillaItemID.stick, ItemID.aw_mysterious_powder, ItemID.magic_crystal, VanillaItemID.iron_ingot], {
	id: ItemID.staff_singularity,
	data: 0,
	count: 1,
	extra: null
}, {
	magic: 10,
	necromancer: 5
},["default_2", "default_2", "default"]);
RitualAPI.addRecipe("ritual_2", "rune6", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2], {
	id: ItemID.rune6,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "cauldronAw", [ItemID.aw_mysterious_powder, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, ItemID.magic_plate, VanillaItemID.iron_ingot, VanillaItemID.iron_ingot, VanillaItemID.iron_ingot], {
	id: BlockID.cauldronAw,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 350,
	magic: 10,
	protection: 5,
	necromancer: 3
});
RitualAPI.addRecipe("ritual_2", "ancient_bottom_obelisk", [ItemID.rune1, ItemID.rune2, ItemID.rune3, ItemID.rune4, VanillaBlockID.stone, VanillaBlockID.stone, VanillaBlockID.stonebrick, VanillaBlockID.stonebrick], {
	id: BlockID.ancient_bottom_obelisk,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 8,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "rune5", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1], {
	id: ItemID.rune5,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 300,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll10", [ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.sroll4, ItemID.sroll4, ItemID.sroll4, ItemID.sroll4], {
	id: ItemID.sroll10,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll11", [ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.sroll10, ItemID.sroll10, ItemID.sroll10, ItemID.sroll10], {
	id: ItemID.sroll11,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll8", [ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.sroll11, ItemID.sroll11, ItemID.sroll11, ItemID.sroll11], {
	id: ItemID.sroll8,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20
});
/*RitualAPI.addRecipe("ritual_2", "sroll14", [ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.sroll9, ItemID.sroll9, ItemID.sroll9, ItemID.sroll9], {
	id: ItemID.sroll14,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20
});*/
RitualAPI.addRecipe("ritual_2", "sroll12", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.sroll6, ItemID.sroll6, ItemID.sroll6, ItemID.sroll6], {
	id: ItemID.sroll12,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll13", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.sroll12, ItemID.sroll12, ItemID.sroll12, ItemID.sroll12], {
	id: ItemID.sroll13,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 10
});
RitualAPI.addRecipe("ritual_2", "sroll18", [ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.sroll4, ItemID.sroll4, ItemID.sroll4, ItemID.sroll4], {
	id: ItemID.sroll18,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 15
});
RitualAPI.addRecipe("ritual_2", "sroll19", [ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.sroll6, ItemID.sroll6, ItemID.sroll6, ItemID.sroll6], {
	id: ItemID.sroll19,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll22", [ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.sroll8, ItemID.sroll8, ItemID.sroll8, ItemID.sroll8], {
	id: ItemID.sroll22,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 300,
	magic: 15
});
RitualAPI.addRecipe("ritual_2", "sroll21", [ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.sroll10, ItemID.sroll10, ItemID.sroll10, ItemID.sroll10], {
	id: ItemID.sroll21,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 300,
	magic: 15
});
RitualAPI.addRecipe("ritual_2", "sroll23", [ItemID.sroll4, ItemID.sroll4, ItemID.sroll4, ItemID.sroll4, ItemID.sroll8, ItemID.sroll8, ItemID.sroll8, ItemID.sroll8], {
	id: ItemID.sroll23,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 300,
	magic: 15
});
RitualAPI.addRecipe("ritual_2", "sroll24", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4], {
	id: ItemID.sroll24,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 2000,
	magic: 20,
	necromancer: 10
});
RitualAPI.addRecipe("ritual_2", "sroll24", [46, 46, 46, 46, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3], {
	id: ItemID.sroll26,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 20,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_2", "sroll29", [VanillaItemID.diamond, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, ItemID.rune4, ItemID.rune4, VanillaItemID.redstone, 266, 266], {
	id: ItemID.sroll29,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 10
});
RitualAPI.addRecipe("ritual_2", "sroll32", [VanillaBlockID.magma, VanillaBlockID.magma, VanillaBlockID.magma, VanillaBlockID.magma, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5], {
	id: ItemID.sroll32,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll33", [ItemID.sroll33, , VanillaBlockID.magma, ItemID.sroll32, VanillaBlockID.magma, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5], {
	id: ItemID.sroll33,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll34", [VanillaBlockID.magma, VanillaBlockID.magma, VanillaBlockID.magma, VanillaBlockID.magma, ItemID.sroll33, ItemID.sroll33, ItemID.rune5, ItemID.rune5], {
	id: ItemID.sroll34,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 2000,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll35", [ItemID.sroll34, ItemID.sroll34, ItemID.sroll33, ItemID.sroll33, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5], {
	id: ItemID.sroll35,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 2000,
	magic: 20,
	protection: 30
});

RitualAPI.addRecipe("ritual_2", "sroll45", [ItemID.aw_petal_powder, ItemID.aw_petal_powder, ItemID.aw_petal_powder, ItemID.aw_petal_powder, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_greed, ItemID.rune_greed], {
	id: ItemID.sroll45,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 10,
	protection: 5
});
RitualAPI.addRecipe("ritual_2", "sroll46", [ItemID.sroll45, ItemID.sroll45, ItemID.magic_plate, ItemID.magic_plate, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_greed, ItemID.rune_greed], {
	id: ItemID.sroll46,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 10,
	protection: 5
});

RitualAPI.addRecipe("ritual_2", "magis_stick", [ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.stick, VanillaItemID.stick, ItemID.rune3, ItemID.acolyteStaff, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust], {
	id: ItemID.magis_stick,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 20
});

RitualAPI.addRecipe("ritual_2", "magis_sword", [ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.stick, VanillaItemID.stick, ItemID.rune1, ItemID.acolyteStaff, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust], {
	id: ItemID.magis_sword,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	protection: 30
});

RitualAPI.addRecipe("ritual_2", "magis_pocox", [ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.stick, VanillaItemID.stick, ItemID.rune5, ItemID.acolyteStaff, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust], {
	id: ItemID.magis_pocox,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	necromancer: 20
});
RitualAPI.addRecipe("ritual_2", "SpellSet31", [VanillaItemID.paper, VanillaItemID.paper, ItemID.rune1, ItemID.rune2, ItemID.rune3, ItemID.rune4, VanillaItemID.paper, VanillaItemID.paper], {
	id: ItemID.SpellSet31,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll36", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune1], {
	id: ItemID.sroll36,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_2", "sroll37", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune2], {
	id: ItemID.sroll37,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_2", "sroll38", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune3], {
	id: ItemID.sroll38,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_2", "sroll39", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune4], {
	id: ItemID.sroll39,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_2", "clone_scroll", [ItemID.rune_life, ItemID.rune_life, BlockID.aw_magic_stone, BlockID.aw_magic_stone, BlockID.aw_magic_brick, BlockID.aw_magic_brick, BlockID.aw_magic_brick, BlockID.aw_magic_brick], {
	id: BlockID.clone_scroll,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 2000,
	magic: 20
});
RitualAPI.addRecipe("ritual_2", "sroll40", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune5], {
	id: ItemID.sroll37,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_2", "sroll41", [VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper, ItemID.rune6], {
	id: ItemID.sroll38,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5
});
RitualAPI.addRecipe("ritual_3", "magis_stick_2_lvl", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, ItemID.magis_stick, VanillaItemID.redstone, VanillaItemID.redstone, ItemID.rune3, ItemID.rune3], {
	id: ItemID.magis_stick_2_lvl,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	protection: 30
});
RitualAPI.addRecipe("ritual_3", "magis_sword_2_lvl", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, ItemID.magis_sword, VanillaItemID.redstone, VanillaItemID.redstone, ItemID.rune1, ItemID.rune1], {
	id: ItemID.magis_sword_2_lvl,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	necromancer: 30
});
RitualAPI.addRecipe("ritual_3", "magis_pocox_2_lvl", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, ItemID.magis_pocox, VanillaItemID.redstone, VanillaItemID.redstone, ItemID.rune5, ItemID.rune5], {
	id: ItemID.magis_pocox_2_lvl,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 200,
	magic: 30
});
RitualAPI.addRecipe("ritual_3", "diamond", [VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal, VanillaItemID.coal], {
	id: VanillaItemID.diamond,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 30
});
RitualAPI.addRecipe("ritual_3", "nether_star", [ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, ItemID.magic_plate, VanillaItemID.diamond, VanillaItemID.diamond, VanillaItemID.diamond, VanillaItemID.diamond, VanillaItemID.diamond, VanillaItemID.diamond], {
	id: VanillaItemID.nether_star,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 30
});
RitualAPI.addRecipe("ritual_3", "bowlWishes", [VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaItemID.gold_ingot, VanillaBlockID.gold_block, VanillaBlockID.gold_block, VanillaBlockID.gold_block, VanillaBlockID.gold_block], {
	id: BlockID.bowlWishes,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 400,
	magic: 30
});

RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_fire", [ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, ItemID.rune1, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_fire,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});
RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_earth", [ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, ItemID.rune2, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_earth,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});
RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_wind", [ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, ItemID.rune3, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_wind,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});
RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_light", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_light,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});
RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_darkness", [ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_darkness,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});
RitualAPI.addRecipe("ritual_3", "aw_enchanted_rune_copying", [ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, ItemID.rune6, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: BlockID.aw_enchanted_rune_copying,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 10
});

RitualAPI.addRecipe("ritual_3", "sroll43", [ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: ItemID.sroll43,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 20
});

RitualAPI.addRecipe("ritual_3", "sroll44", [ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune_absorption, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, ItemID.rune5, BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone], {
	id: ItemID.sroll44,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 20
});

RitualAPI.addRecipe("ritual_3", "MagicConnector", [ItemID.rune_life, ItemID.rune_dead, ItemID.magic_plate, ItemID.magic_plate, ItemID.magic_plate, ItemID.magic_plate, VanillaBlockID.planks, VanillaBlockID.planks, VanillaBlockID.planks, ItemID.rune5, VanillaBlockID.planks, VanillaBlockID.planks], {
	id: BlockID.MagicConnector,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 20
});

RitualAPI.addRecipe("ritual_3", "decor9", [ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.rune4, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_crystal, ItemID.magic_plate, ItemID.magic_plate, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot], {
	id: ItemID.decor9,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 5
});

RitualAPI.addRecipe("ritual_1", "sroll47", [ItemID.sroll32, ItemID.sroll33, ItemID.aw_magic_ingot, ItemID.aw_magic_ingot], {
	id: ItemID.sroll47,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 500,
	magic: 5
});

RitualAPI.addRecipe("ritual_1", "aw_magic_storage", [BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone, ItemID.magic_plate, ItemID.magic_plate], {
	id: BlockID.aw_magic_storage,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 1000,
	magic: 25
});
RitualAPI.addRecipe("ritual_1", "decor8", [ItemID.decor9, ItemID.decor9, ItemID.rune4, ItemID.rune4], {
	id: ItemID.decor8,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	magic: 5
});

RitualAPI.addRecipe("ritual_1", "name_tag", [VanillaItemID.book, VanillaItemID.paper, VanillaItemID.paper, VanillaItemID.paper], {
	id: VanillaItemID.name_tag,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 10,
	magic: 5
});
RitualAPI.addRecipe("ritual_1", "decor7", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.glowstone_dust, ItemID.rune1], {
	id: ItemID.decor7,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor6", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.glowstone_dust, ItemID.rune3], {
	id: ItemID.decor6,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor5", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.redstone, ItemID.rune4], {
	id: ItemID.decor5,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor4", [VanillaItemID.redstone, VanillaItemID.diamond, VanillaItemID.redstone, ItemID.rune4], {
	id: ItemID.decor4,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor3", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.glowstone_dust, ItemID.rune4], {
	id: ItemID.decor3,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor2", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.redstone, ItemID.rune5], {
	id: ItemID.decor2,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "decor1", [VanillaItemID.glowstone_dust, VanillaItemID.diamond, VanillaItemID.glowstone_dust, ItemID.rune5], {
	id: ItemID.decor1,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 100,
	necromancer: 5
});
RitualAPI.addRecipe("ritual_1", "rune2", [1, 1, 1, 1], {
	id: ItemID.rune2,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 10,
	magic: 70
});
RitualAPI.addRecipe("ritual_1", "rune1", [3, 3, 1, 1], {
	id: ItemID.rune1,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 10,
	protection: 70
});
RitualAPI.addRecipe("ritual_1", "rune4", [VanillaItemID.glowstone_dust, VanillaItemID.glowstone_dust, 1, 1], {
	id: ItemID.rune4,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 10,
	necromancer: 70
});
RitualAPI.addRecipe("ritual_1", "rune3", [VanillaItemID.redstone, VanillaItemID.redstone, 1, 1], {
	id: ItemID.rune3,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 10,
	necromancer: 5,
	magic: 30,
	protection: 30
});
RitualAPI.addRecipe("ritual_1", "acolyteStaff", [ItemID.magic_crystal, VanillaItemID.stick, VanillaItemID.stick, VanillaBlockID.planks], {
	id: ItemID.acolyteStaff,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 10,
});
RitualAPI.addRecipe("ritual_1", "magic_crystal", [VanillaItemID.diamond, VanillaItemID.diamond, 1, 1], {
	id: ItemID.magic_crystal,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 5,
	necromancer: 5,
	protection: 5
});
RitualAPI.addRecipe("ritual_1", "magic_plate", [ItemID.magic_crystal, ItemID.magic_crystal, 1, 1], {
	id: ItemID.magic_plate,
	data: 0,
	count: 1,
	extra: null
}, {
	aspects: 50,
	magic: 10
});
});
ModAPI.addAPICallback("DungeonUtility",function(){
RitualAPI.register("ritual_1", {
	stru: "aw_ritual_1",
	title: Translation.translate("aw.gui.rv.ritual_1lvl"),
	content: {
		elements: {
			output0: {x: 440, y: 150, size: 120},
			input0: {x: 315, y: 25, size: 100},
      input1: {x: 315, y: 300, size: 100},
      input2: {x: 590, y: 25, size: 100},
      input3: {x: 590, y: 300, size: 100},
		}
	}
});
RitualAPI.register("ritual_2",  {
	stru: "aw_ritual_2",
	title: Translation.translate("aw.gui.rv.ritual_2lvl"),
	content: {
		elements: {
			output0: {x: 440, y: 150, size: 120},
			input0: {x: 315, y: 25, size: 100},
      input1: {x: 315, y: 300, size: 100},
      input2: {x: 590, y: 25, size: 100},
      input3: {x: 590, y: 300, size: 100},
      input4: {x: 440, y: 0, size: 120},
      input5: {x: 440, y: 300, size: 120}, 
      input6: {x: 590, y: 150, size: 120},
      input7: {x: 290, y: 150, size: 120},
		}
	}
});
RitualAPI.register("ritual_3",  {
	stru: "aw_ritual_3",
	title: Translation.translate("aw.gui.rv.ritual_3lvl"),
	content: {
		elements: {
			output0: {x: 440, y: 150, size: 120},
			input0: {x: 315, y: 25, size: 100},
      input1: {x: 315, y: 300, size: 100},
      input2: {x: 590, y: 25, size: 100},
      input3: {x: 590, y: 300, size: 100},
      input4: {x: 440, y: 0, size: 120},
      input5: {x: 440, y: 300, size: 120}, 
      input6: {x: 590, y: 150, size: 120},
      input7: {x: 290, y: 150, size: 120},
      
      input8: {x: 200, y: 25, size: 100},
      input9: {x: 200, y: 300, size: 100},
      input10: {x: 700, y: 25, size: 100},
      input11: {x: 700, y: 300, size: 100},
		}
	}
});
});




// file: integration.js

/*
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
ModAPI.addAPICallback("RecipeViewer", function(api){
	var RVTypeAW = (function(_super){
  	__extends(RVTypeAW, _super);
    function RVTypeAW(name, icon, key, content){
      let _this = _super.call(this, name, icon, content) || this;
      _this.ritualKey = key;
      return _this;
    }
    RVTypeAW.prototype.getAllList = function() {
    	let list = [];
    	let keys = Object.keys(RitualAPI.recipes[this.ritualKey]);
      for(let i in keys) {
      	let obj = RitualAPI.recipes[this.ritualKey][keys[i]];
      	let input = [];
      	for(let ii in obj.recipe){
      		input.push({id:obj.recipe[ii],data:0,count:1});
      	}
        list.push({
        	input: input,
          output: [{id: obj.result.id,data: obj.result.data,count: obj.result.count}]
        });
      }
      return list;
    };
    return RVTypeAW;
  }(api.RecipeType));
	api.RecipeTypeRegistry.register("ritual_1", new RVTypeAW("Ritual", 5, "ritual_1", {
		elements: {
			output0: {x: 440, y: 150, size: 120},
      input0: {x: 440, y: 0, size: 120},
      input1: {x: 440, y: 300, size: 120}, 
      input2: {x: 590, y: 150, size: 120},
      input3: {x: 290, y: 150, size: 120},
                    
     input4: {x: 315, y: 25, size: 100},
      input5: {x: 315, y: 300, size: 100},
      input6: {x: 590, y: 25, size: 100},
      input7: {x: 590, y: 300, size: 100},
		}
	}));
});*/




// file: core/shared.js

const API = {
    MagicCore: MagicCore,
    Wands: Wands,
    delItem: delItem2,
    ParticlesAPI: ParticlesAPI,
    Render: RenderAPI,
    Mp: Mp,
    RitualAPI: RitualAPI,
    BookAPI: BookAPI,
    PlayerAC: PlayerAC,
    EffectAPI: EffectAPI,
    Potion: Potion,
    Bag: Bag,
    setTimeout: setTimeout,
    ScrutinyAPI_V2: ScrutinyAPI_V2,
    AchievementAPI: AchievementAPI,
    MagicSmithy: MagicSmithy,
    SoundManager: SoundManager,
    ScrutinyAPI: ScrutinyAPI,
    addScrut: addScrut,
    AncientWonders: AncientWonders,
    TranslationLoad: TranslationLoad,
    SingularityAPI: SingularityAPI,
    EntityReg: EntityReg,
    ItemName: ItemName,
    
    Scrutiny: Scrutiny,
    Wand: Wand,
    ScrollBase: ScrollBase,
    Scroll: Scroll,
    ScrollEvent: ScrollEvent,
    
    AW: {
    	typeDamage: {
    		magic: "magic",
    		dead: "dead"
    	},
    	srollEvent: {
    		useBlock: ItemID.sroll1,
    		usePlayer: ItemID.sroll2,
    		useMob: ItemID.sroll3
    	},
    	creativeGroup: {
    		rune: "rune",
    		wand: "wand",
    		eventSroll: "events",
    		srolls: "sroll",
    		decorSroll: "decor"
    	}
    },
    requireGlobal(command){
      return eval(command);
    },
    versionAPI: 10
};
Callback.invokeCallback("AncientWonders", API);
ModAPI.registerAPI("AncientWondersAPI", API);
Logger.Log("Ancient Wonders load", "API");




// file: test.js

let DefaultAnim = {
	time: 60,
	fps: 20
};

function EMPTY_FUNCTION(){}

function ModelAnimationRender(){
	this.time = DefaultAnim.time;
	this.fps = DefaultAnim.fps;
	
	let caches = null;
	let caches_replace = null;
	let frames = 0;
	let start = null;
	let end = null;
	let update = {};
	let update_replace = {};
	let self = this;
	
	function uptState(){
		frames = (self.time / 20) * self.fps;
		update = getTransferFrame(start, end);
	}
	
	this.getFrames = function(){
		return frames;
	}
	
	this.setTime = function(time, func){
		func = func || uptState;
		this.time = time;
		func();
		return this;
	}
	
	this.setModel = function(_st, _end, func){
		func = func || uptState;
		start = _st;
		end = _end;
		func();
		return this;
	}
	
	function getModelToFrameCache(frame){
		return caches[frame];
	}
	
	function getTransferFrame(start, end){
		if(!start || !end) return;
		
		let boxes = {};
		let names_start = start.getAllName();
		let names_end = end.getAllName();
		let start_boxes = start.getBoxes();
		let end_boxes = end.getBoxes();
		let arr = ["x1", "y1", "z1", "x2", "y2", "z2"];
		
		for(let i in names_end){
			let name = names_end[i];
			if(!start_boxes[name])
				continue;
			
			let box_start = start_boxes[name];
			let box_end = end_boxes[name];
			
			boxes[name] = {id: box_start.id, data: box_start.data};
			
			for(let index in arr){
				let p = arr[index];
				boxes[name][p] = (box_end[p] - box_start[p])/frames;
			}
		}
		
		return boxes;
	}
	
	function buildModel(frame, _start, _update){
		_update = _update || update;
		_start = _start || start;
		
		let model = new RenderAPI.Model();
		let boxes = _start.getBoxes();
		
		for(let key in _update){
			let obj = _update[key];
			let start_obj = boxes[key];
			
			model.addBoxByBlock(key, start_obj.x1 + (obj.x1*frame), start_obj.y1 + (obj.y1*frame), start_obj.z1 + (obj.z1*frame), start_obj.x2 + (obj.x2*frame), start_obj.y2 + (obj.y2*frame), start_obj.z2 + (obj.z2*frame), obj.id, obj.data);
		}
		return model;
	}
	
	this.getModelToFrame = buildModel;
	
	this.prebuild = function(fps){
		this.fps = fps;
		uptState();
		caches = [];
		
		for(let frame = 0;frame < frames;frame++)
			caches[frame] = buildModel(frame);
		
		update_replace = getTransferFrame(end, start);
		cache_replace = [];
		
		for(let frame = 0;frame < frames;frame++)
			cache_replace[frame] = buildModel(frame, end, update_replace);
		
		this.getModelToFrame = getModelToFrameCache;
		return this;
	}
	
	this.disableCache = function(){
		caches = null;
		caches_replace = null;
		this.getModelToFrame = buildModel;
		return this;
	}
	
	this.replaceModel = function(){
		let a = caches;
		caches = cache_replace;
		cache_replace = a;
		
		a = update_replace;
		update = update_replace;
		update_replace = a;
		
		return this.setModel(end, start, EMPTY_FUNCTION);
	}
	
	this.clone = function(){
		return new ModelAnimationRender()
			.setModel(start, end, EMPTY_FUNCTION)
			.setTime(this.time, EMPTY_FUNCTION)
			.prebuild(this.fps);
	}
}

function _ModelAnimation(setting, render){
	render = render || new ModelAnimationRender();
	setting = setting || new DefaultModelAnimationRender(this);
	
	let handler = {
		start(){},
		update(frame){},
		end(){}
	};
	
	this.getSetting = function(){
		return setting;
	}
	
	this.setSetting = function(_setting){
		setting = _setting;
		return this;
	}
	
	this.getRender = function(){
		return render;
	}
	
	this.getTime = function(){
		return render.time;
	}
	
	this.setModel = function(st, end){
		render.setModel(st, end);
		return this;
	}
	
	this.replaceModel = function(){
		render.replaceModel();
		return this;
	}
	
	this.setTime = function(time){
		render.setTime(time);
		return this;
	}
	
	this.prebuild = function(fps){
		render.prebuild(fps);
		return this;
	}
	
	this.clone = function(){
		let setting = setting.clone();
		return new ModelAnimation(setting, render.clone()).setModel(setting).setHandler(handler);
	}
	
	let all_frame = {};
	this.updateModel = function(x, y, z, infinity){
		let frames = render.getFrames();
		let key = x+':'+y+":"+z;
		
		if(!all_frame[key]){
			handler.start(x, y, z);
			var data = {frame: 0};
			all_frame[key] = data;
		}else
			var data = all_frame[key];
		
		let frame = Math.floor(data.frame/render.time*frames);
		
		render.getModelToFrame(frame)
			.map(x, y, z);
		
		data.frame++;
			
		if(data.frame >= render.time){
			handler.end(x, y, z);
			delete all_frame[key];
		}
	}
	
	this.destroy = function(x, y, z){
		delete all_frame[key];
		BlockRenderer.unmapAtCoords(x, y, z);
	}
	
	this.play = function(x, y, z, infinity){
		let _setting = setting.clone();
		_setting.setProperties(infinity, infinity);
		_setting.play(x, y, z);
		return _setting;
	}
	
	this.setHandler = function(obj){
		handler = {
			start: obj.start || function(){},
			update: update.end || function(){},
			end: obj.end || function(){},
		};
		return this;
	}
	
	this.getHandler = function(){
		return handler;
	}
}

function DefaultModelAnimationRender(model){
	let infinity = false;
	let back = false;
	
	let back_status = false;
	let destroy_status = false;
	
	this.clone = function(_model){
		return new DefaultModelAnimationRender(_model||model).setProperties(infinity, back);
	}
	
	this.setModel = function(md){
		model = md;
		return this;
	}
	
	this.setProperties = function(_infinity, _back){
		infinity = _infinity;
		back = _back;
		return this;
	}
	
	this.destroy = function(){
		destroy_status = true;
		return this;
	}
	
	this.play = function(x, y, z, render){
		render = render || model.getRender().clone();
		let handler = model.getHandler();
		let self = this;
		
		let frames = render.getFrames()-1;
		handler.start(x, y, z);
		let animation = createAnimation((render.time / 20) * 1000, function(value, anim){
			if(destroy_status)
				return anim.stop();
			
			let frame = Math.floor(frames*value);
			
			render.getModelToFrame(frame)
				.map(x, y, z);
			
			handler.update(frame, x, y, z);
		});
		animation.addListener({
			onAnimationEnd(){
				handler.end(x, y, z);
				
				if(destroy_status){
					destroy_status = false;
					BlockRenderer.unmapAtCoords(x, y, z);
					return;
				}
				
				alert(back_status);
				if(back_status){
					back_status = false;
					render.replaceModel();
				}else if(back){
					render.replaceModel();
					back_status = true;
					return self.play(x, y, z, render);
				}
				
				infinity && self.play(x, y, z, render);
			}
		});
	}
}
/*
Я не помню что тут это делаеь

Правила!
👉запрещён контент 16+, да да это я тебе Антон и Бек, и других это тоже касается 😱
👉запрещён спам😳
👉запрещены массовы упоминания🤖
👉запрещена реклама, допускаются репосты записей если они содержат тематику inner core 🧐
👉прошу всех ориентироваться по времени МСК👀
👉каждый человек это личность, если вас оскорбили оскорбите в ответ👺
👉запрещён различный не культурный лексикон, мат не желателен 🥱
👉Если вам мешают уведомления беседы, отключите их
👉 запрещены политические темы
👉 запрещены издевательства над админом
👉 запрещено попрошайничество

Наказания: мут, бан, по настроению админов

👉ютуб канал - https://youtube.com/channel/UCaY38OdcxqsaqH2ulj_337A
👉гайд по моду Ancient wonders - https://vk.com/@-186544580-gaid-po-modu-ancient-wonders-2
Skyblock help - https://vk.com/topic-186544580_48495110
Телеграмм чат -
https://t.me/DungeonCraftChat

Если у вас есть вопросы, пишите.


Правила!
👉запрещён контент 16+, да да это я тебе Антон и Бек, и других это тоже касается 😱
👉запрещён спам😳
👉запрещены массовы упоминания🤖
👉запрещена реклама, допускаются репосты записей если они содержат тематику inner core 🧐
👉прошу всех ориентироваться по времени МСК👀
👉каждый человек это личность, если вас оскорбили оскорбите в ответ👺
👉запрещён различный не культурный лексикон, мат не желателен 🥱
👉если вас оскорбил Антон, знайте, это его обычное общение 🌚
👉прошу не игратся долго с ботом🤖
👉Антону не желательно пидарасить каждого пользователя 
👉Если вам мешают уведомления беседы, отключите их
👉ниутверждать, то чего не знаешь(бан)
👉 запрещены политические темы
👉 запрещены издевательства над админом
👉 за пропаганду выдаётся предупреждение 
👉 запрещена не объективная токсичность 
👉 запрещено попрошайничество

Наказания: мут, бан, по настроению админов

👉ютуб канал - https://youtube.com/channel/UCaY38OdcxqsaqH2ulj_337A
👉гайд по моду Ancient wonders - https://vk.com/@-186544580-gaid-po-modu-ancient-wonders-2
Skyblock help - https://vk.com/topic-186544580_48495110
Телеграмм чат -
https://t.me/DungeonCraftChat

Если у вас есть вопросы, пишите.

Данная беседа была создана точно уж не для того чтобы Антон пидарасил пользователей, а для общения с аудиторией.
[Статья]
https://vk.com/@-186544580-gaid-po-modu-ancient-wonders-2
*/

//Тестовый код анимации

/*const DEF = new RenderUtil.Model()
	.add(0, 0, 0, .5, .5, .5, 98);
const DEF_END = new RenderUtil.Model()
	.add(.5, .5, .5, 1, 1, 1, 98);

BlockRenderer.enableCoordMapping(98, -1, DEF.getICRenderModel());

let animation = new _ModelAnimation()
	.setModel(DEF, DEF_END)
	.setTime(180)
	.prebuild(60);//кеширует модель для каждого кадра, в 60 fps(можно указать любое количество кадров)

//количество fps привязано к тик, модели для каждого кадра создаются в реальном времени 
let animation_legacy = new ModelAnimation()
	.setModel(DEF, DEF_END)
	.setTime(180);
	
Callback.addCallback("ItemUse", function(coords, it, block){
	if(block.id == 98){
		if(it.id == 280){
			let setting = new DefaultModelAnimationRender(animation);
			setting.setProperties(false, true);
			setting.play(coords.x,coords.y,coords.z);
		}else if(it.id == 264){
			let setting = new DefaultModelAnimationRender(animation);;
			setting.setProperties(true, true);
			setting.play(coords.x,coords.y,coords.z);
		}else if(it.id == 263)
			animation_legacy.play(coords.x,coords.y,coords.z);
	}
});*/

/*BlockRenderer.enableCoordMapping(98, -1, DEF.getICRenderModel());
let animation = new RenderAPI.Animation(DEF, {
	"25": new RenderAPI.Model().add(0, 0, .5, .5, .5, 1),
	"50": new RenderAPI.Model().add(.5, 0, .5, 1, .5, 1),
	"75": new RenderAPI.Model().add(.5, 0, 0, 1, .5, .5),
	"100": new RenderAPI.Model().add(0, 0, 0, .5, .5, .5)
});
animation.setTime(100);
animation.prebuild(60);//максимум 60 fps

Callback.addCallback("ItemUse", function(coords, it, block){
	if(block.id == 98)
		animation.play(coords.x,coords.y,coords.z);
});*/




