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
