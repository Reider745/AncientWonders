//create Reider ___ size - 16
let ScrollClone = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || BlockID.aw_magic_brick, data = data_default || 0;
	let model = new RenderAPI.Model();
	model.addBoxByBlock("cube", 0, 0, 0, 1, 0.0625, 1, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0.0625, 0.0625, 0.0625, 0.9375, 0.125, 0.9375, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0.125, 0.125, 0.125, 0.25, 0.1875, 0.25, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0.125, 0.125, 0.75, 0.25, 0.1875, 0.875, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.75, 0.125, 0.75, 0.875, 0.1875, 0.875, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0.75, 0.125, 0.125, 0.875, 0.1875, 0.25, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.0625, 0.1875, 0.0625, 0.9375, 0.8125, 0.9375, obj["cube_7"] ? obj["cube_7"].texture : texture, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0, 0.8125, 0, 1, 0.875, 1, BlockID.aw_magic_stone, 0);
	return model;
});//boxes - 8
