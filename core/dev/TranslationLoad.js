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

const TranslationLoad = {
	load(path, defaultLang){
		let translations =  {};
		let files = FileTools.GetListOfFiles(path, "lang");
		
		for(let i in files){
			let file = readJson(files[i]);
			for(let key in file.translations){
				let translate = file.translations[key];
				let all_translate = translations[key] || {};
				all_translate[file.type] = translate;
				translations[key] = all_translate;
			}
		}
		
		function reload(){
			let current = Translation.getLanguage();
			for(let key in translations){
				let all_translate = translations[key];
				all_translate[current] = all_translate[current] || all_translate[defaultLang];
				Translation.addTranslation(key, all_translate);
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
TranslationLoad.load(__dir__+"assets/lang", "en");
TranslationLoad.load(__dir__+"assets/lang/potions", "en");