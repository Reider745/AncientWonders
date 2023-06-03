//create Reider ___ size - 16
let model = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 1, data = data_default || 0;
	let model = new RenderAPI.Model();
	model.addBoxByBlock("3", 0.0625, 0, 0.0625, 0.1875, 0.875, 0.1875, obj["3"] ? obj["3"].texture : texture, obj["3"] ? obj["3"].data : data);
	model.addBoxByBlock("2", 0.0625, 0, 0.8125, 0.1875, 0.875, 0.9375, obj["2"] ? obj["2"].texture : texture, obj["2"] ? obj["2"].data : data);
	model.addBoxByBlock("1", 0.8125, 0, 0.8125, 0.9375, 0.875, 0.9375, obj["1"] ? obj["1"].texture : texture, obj["1"] ? obj["1"].data : data);
	model.addBoxByBlock("4", 0.8125, 0, 0.0625, 0.9375, 0.875, 0.1875, obj["4"] ? obj["4"].texture : texture, obj["4"] ? obj["4"].data : data);
	model.addBoxByBlock("cube", 0, 0.875, 0, 1, 0.9375, 1, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0.0625, 0.1875, 0.0625, 0.125, 0.8125, 0.9375, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0.875, 0.125, 0.0625, 0.9375, 0.8125, 0.9375, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0.125, 0.1875, 0.875, 0.9375, 0.8125, 0.9375, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.125, 0.1875, 0.0625, 0.9375, 0.8125, 0.125, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("s", 0, 0.875, 0, 0.125, 1, 0.125, obj["s"] ? obj["s"].texture : texture, obj["s"] ? obj["s"].data : data);
	model.addBoxByBlock("s_2", 0, 0.875, 0.875, 0.125, 1, 1, obj["s_2"] ? obj["s_2"].texture : texture, obj["s_2"] ? obj["s_2"].data : data);
	model.addBoxByBlock("s_3", 0.875, 0.875, 0, 1, 1, 0.125, obj["s_3"] ? obj["s_3"].texture : texture, obj["s_3"] ? obj["s_3"].data : data);
	model.addBoxByBlock("s_4", 0.875, 0.875, 0.875, 1, 1, 1, obj["s_4"] ? obj["s_4"].texture : texture, obj["s_4"] ? obj["s_4"].data : data);
	return model;
})();//boxes - 13