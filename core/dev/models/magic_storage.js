//create Reider ___ size - 16
let magic_storage = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 1, data = data_default || 0;
	let model = new RenderUtil.Model();
	model.addBoxByBlock("cube", 0, 0, 0, 1, 0.125, 1, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0, 0.875, 0, 1, 1, 1, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0, 0.125, 0, 0.125, 0.875, 0.125, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0.875, 0, 0, 1, 1, 0.125, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.875, 0.125, 0.875, 1, 0.875, 1, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0, 0.125, 0.875, 0.125, 0.875, 1, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.1875, 0.1875, 0.1875, 0.8125, 0.8125, 0.8125, VanillaBlockID.obsidian, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0.25, 0.125, 0.25, 0.75, 0.1875, 0.75, VanillaBlockID.obsidian, obj["cube_8"] ? obj["cube_8"].data : data);
	model.addBoxByBlock("cube_9", 0.25, 0.8125, 0.25, 0.75, 0.875, 0.75, VanillaBlockID.obsidian, obj["cube_9"] ? obj["cube_9"].data : data);
	return model;
})(null, BlockID.aw_enchanted_stone);
