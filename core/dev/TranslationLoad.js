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
						path.replace("\\", "/").split("/").pop().split(".")[0],
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
						all_translate[current] = all_translate["en"] || "";
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

Network.addClientPacket("aw.translate_message", function(data){
	Game.message(translate(data.key, data.arr));
});

Network.addClientPacket("aw.translate_tip_message", function(data){
	Game.tipMessage(translate(data.key, data.arr));
});

function translateMessage(player, key, arr){
	let client = Network.getClientForPlayer(player);
	client && client.send("aw.translate_message", {
		key: key,
		arr: arr
	});
}
function translateTipMessage(player, key, arr){
	let client = Network.getClientForPlayer(player);
	client && client.send("aw.translate_tip_message", {
		key: key,
		arr: arr
	});
}
TranslationLoad.load(__dir__+"assets/lang", "en", 0);
TranslationLoad.load(__dir__+"assets/lang/potions", "en", 0);
TranslationLoad.load(__dir__+"assets/lang/command", "en", 1);
TranslationLoad.load(__dir__+"assets/lang/chat", "en", 1);