const TranslationLoad = {
	load(path, defaultLang){
		let translations =  {};
		let files = FileTools.GetListOfFiles(path, "lang");
		for(let i in files){
			let file = FileTools.ReadJSON(files[i]);
			let keys = Object.keys(file.translations);
			for(let index in keys){
				if(!translations[keys[index]]) translations[keys[index]] = {};
				translations[keys[index]][file.type] = file.translations[keys[index]];
			}
		}
		let keys = Object.keys(translations);
		for(let i in keys){
			Translation.addTranslation(keys[i], translations[keys[i]]);
		}
		if(!keys.indexOf(Translation.getLanguage()))
			for(let i in keys){
				Translation.addTranslation(defaultLang, translations[defaultLang]);
			}
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
TranslationLoad.load(__dir__+"assets/lang", "ru");
TranslationLoad.load(__dir__+"assets/lang/potions", "ru");