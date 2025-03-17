function addInformation(id, add, values){
	let func = Item.nameOverrideFunctions[id] || function(item, transl, name) {
		return transl;
	};
	
	Item.registerNameOverrideFunction(id, function(item, transl, name){
		let fullName = func(item, transl, name);
		fullName += "\n" + TranslationLoad.get(add, values);
		return fullName;
	});
}