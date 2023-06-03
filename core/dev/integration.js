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