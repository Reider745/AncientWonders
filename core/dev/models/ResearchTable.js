//create Reider ___ size - 16
let ResearchTable = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 5, data = data_default || 0;
	let model = new RenderAPI.Model();
	model.addBoxByBlock("3", 0.0625, 0, 0.0625, 0.1875, 0.875, 0.1875, VanillaBlockID.log, 0);
	model.addBoxByBlock("2", 0.0625, 0, 0.8125, 0.1875, 0.875, 0.9375, VanillaBlockID.log, 0);
	model.addBoxByBlock("1", 0.8125, 0, 0.8125, 0.9375, 0.875, 0.9375, VanillaBlockID.log, 0);
	model.addBoxByBlock("4", 0.8125, 0, 0.0625, 0.9375, 0.875, 0.1875, VanillaBlockID.log, 0);
	model.addBoxByBlock("cube", 0, 0.875, 0, 1, 0.9375, 1, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", -0.0625, 0.9375, -0.0625, 0.125, 1, 1.0625, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0.875, 0.9375, -0.0625, 1.0625, 1, 1.0625, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", -0.0625, 0.9375, 0.875, 1.0625, 1, 1.0625, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", -0.0625, 0.9375, -0.0625, 1.0625, 1, 0.125, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0.0625, 0.6875, 0.0625, 0.125, 0.8125, 0.9375, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.875, 0.6875, 0.0625, 0.9375, 0.8125, 0.9375, obj["cube_7"] ? obj["cube_7"].texture : texture, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0.125, 0.6875, 0.875, 0.9375, 0.8125, 0.9375, obj["cube_8"] ? obj["cube_8"].texture : texture, obj["cube_8"] ? obj["cube_8"].data : data);
	model.addBoxByBlock("cube_9", 0.125, 0.6875, 0.0625, 0.9375, 0.8125, 0.125, obj["cube_9"] ? obj["cube_9"].texture : texture, obj["cube_9"] ? obj["cube_9"].data : data);
	model.addBoxByBlock("s", 0, 1, 0, 0.125, 1.125, 0.125, VanillaBlockID.log, 0);
	model.addBoxByBlock("s_2", 0, 1, 0.875, 0.125, 1.125, 1, VanillaBlockID.log, 0);
	model.addBoxByBlock("s_3", 0.875, 1, 0, 1, 1.125, 0.125, VanillaBlockID.log, 0);
	model.addBoxByBlock("s_4", 0.875, 1, 0.875, 1, 1.125, 1, VanillaBlockID.log, 0);
	return model;
})();//boxes - 17