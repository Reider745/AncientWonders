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
