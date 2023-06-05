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
