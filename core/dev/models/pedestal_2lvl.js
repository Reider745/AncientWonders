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
