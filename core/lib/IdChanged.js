/*
Автор: Reider ___
Внимание! Запрещено:
    1.Распространение библиотеки на сторонних источниках без указание ссылки на официальное сообщество
    2.Изменение кода
    3.Явное копирование кода
    4.Явное копирование правил 

    Используя библиотеку вы автоматически соглашаетесь с этими правилами.
*/
LIBRARY({
	name: "IdChanged",
	version: 1,
	shared: false,
	api: "CoreEngine"
});

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

function IdChanged(object, mode){
	mode = mode === undefined ? 1 : mode;
	let original = JSON.parse(JSON.stringify(object));
	
	this.update = function(legacyStrId, newStrId){
		object[newStrId] = object[legacyStrId] || object[newStrId];
		if(mode == 1)
			ItemID[legacyStrId] = ItemID[legacyStrId] || ItemID[newStrId];
		return this;
	}
	
	this.getId = function(id){
		id = typeof(id) == "number" ? this.convertId(id) : id;
		return object[id];
	}
	
	this.convertId = function(numId){
		for(let key in object)
			if(object[key] == numId)
				return key;
		throw "Invalid id "+numId;
	}
	
	this.canActual = function(id){
		id = typeof(id) == "string" ? id : object[id];
		let checkId = false;
		for(let key in object)
			if(key == id)
				if(checkId)
					return true;
				else
					checkId = true;
		return false;
	}
	
	this.updateForJson = function(json){
		for(let i in json){
			let array = json[i];
			this.updateItem(array[0], array[1]);
		}
		return this;
	}
	
	this.updateForJsonAndRead = function(path){
		return this.updateForJson(JSON.parse(comment(FileTools.ReadText(path))));
	}
};

new IdChanged(ItemID)

EXPORT("IdChanged", IdChanged);