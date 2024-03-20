//вспомагательные методы во время разработки

function connectBitmap(input, output, size){
	let result = Bitmap.createBitmap(size, size * input.length, Bitmap.Config.ARGB_8888);
	
	for(let i in input){
		let bitmap = FileTools.ReadImage(input[i]);
		for(let x = 0;x < size;x++)
			for(let y = 0;y < size;y++){
				result.setPixel(x, y+i*size, bitmap.getPixel(x, y));
			}
	}
	
	FileTools.WriteImage(output, result);
}
const ATLAS = __dir__+"assets/particle-atlas/";
function _connectBitmapToAssets(input, output, size){
	let _input = [];
	for(let i in input)
		_input.push(ATLAS+input[i]);
	connectBitmap(_input, ATLAS+output, size);
}
function connectBitmapToAssets(name, frames, size){
	let input = [];
	for(let i = 0;i < frames;i++)
		input.push(name+"_"+i+".png");
	_connectBitmapToAssets(input, name+".png", size);
}

/*
connectBitmapToAssets("aw_bottle_potion", 2, 32);
connectBitmapToAssets("singularity_particle", 3, 32);
connectBitmapToAssets("magic_particle", 9, 32);
*/

/*
формат файла bbmodel

{
	meta: {
		format_version: 4.9,
		model_format: inner-core-model
		box_uv: false
	} 
	name: "...",
	model_identifier: "",
	...
	elements: [
		{
			"name":"cube",
			"box_uv":false,
			"rescale":false,
			"locked":false,
			"render_order":"default",
			"allow_mirror_modeling":true,
			"from":[4,0,11],
			"to":[5,8,12],
			"autouv":0,
			"color":8,
			"origin":[0,0,0],
			"faces":{
				"north":{
					"uv":[16,18,17,26],"texture":1
				},
				"east":{
					"uv":[16,18,17,26],"texture":1
				},
				"south":{
					"uv":[16,18,17,26],"texture":1
				},
				"west":{
					"uv":[16,18,17,26],"texture":1
				},
				"up":{
					"uv":[16,18,17,19],"texture":1
				},
				"down":{
					"uv":[16,18,17,19],"texture":1
				}
			},
			"type":"cube",
			"uuid":"..."
		},
		...
	]
}
*/

function splitForFace(index, face, x, y, uv, bitmap, path, inverse){
	let result = Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
	let res_y = y;
	
	for(let u = Math.min(uv[0], uv[2]);u < Math.max(uv[0], uv[2]);u++){
		for(let v = Math.min(uv[1], uv[3]);v < Math.max(uv[1], uv[3]);v++){
			let pixel = bitmap.getPixel(u, v);
			if(Color.alpha(pixel) <= 0)
				pixel = Color.GREEN;
			if(inverse)
				result.setPixel(x, 15-y, pixel);
			else
				result.setPixel(x, y, pixel);
			y++;
		}
		y = res_y;
		x++;
	}
	FileTools.WriteImage(path + face + "_" + index + ".png", result);
}

function StringToBitmap(encodedString){
	try{
		encodeByte = android.util.Base64.decode(encodedString, 0);
		bitmap = android.graphics.BitmapFactory.decodeByteArray(encodeByte, 0, encodeByte.length);
		return bitmap;
	}catch(e){
		return null;
	}
}

function getFolderPath(filePath){
	const parts = filePath.replace(/\\/g, '/').split('/');
	parts.pop();
	return parts.join('/');
}

//за этот код пиздить меня не надо, я трогать его снова не хочу!
function loadForBlockbenchProject(bbmodel){
	const file = FileTools.ReadJSON(bbmodel);
	const name_model = file.name;
	const textures = {};
	
	for(let i in file.textures){
		let description = file.textures[i];
		
		textures[description.id] = StringToBitmap(description.source.split(",")[1]);
	}
	
	const current_path = getFolderPath(bbmodel);
	const texture_folder = current_path+"/"+name_model;
	
	if(!FileTools.isExists(texture_folder))
		FileTools.mkdir(texture_folder);
	
	let model = new RenderUtil.Model();
	
	for(let i in file.elements){
		let element = file.elements[i];
		let pos = element["from"];
		let to = element["to"];
		
		let xs = Math.abs(to[0] - pos[0]);
		let zs = Math.abs(to[2] - pos[2]);
		
		for(let name in element.faces){
			let face = element.faces[name];
			let uv = face.uv;
			let v = Math.abs(uv[2] - uv[0]);
			
			if(name == "up" || name == "down")
				var x = pos[0], y = pos[2], inverse = false;
			else if(name == "west" || name == "east")
				var x = pos[2], y = pos[1], inverse = true;
			else
				var x = pos[0], y = pos[1], inverse = true;
				
			if(!(name == "up" || name == "down") && (xs > 1 || zs > 1))
				if(v == xs)
					x = pos[0], y = pos[1], inverse = true;
				else
					x = pos[2], y = pos[1], inverse = true;
			splitForFace(i, name_model+"_"+name, x, y, uv, textures[face.texture], texture_folder+"/", inverse);
		}
		i = Number(i);
		model.add(pos[0] / 16, pos[1] / 16, pos[2] / 16, to[0] / 16, to[1] / 16, to[2] / 16, [
			[name_model+"_"+"down", i],
			[name_model+"_"+"up", i],
			
			[name_model+"_"+"south", i],
			[name_model+"_"+"north", i],
			
			[name_model+"_"+"west", i],
			[name_model+"_"+"east", i]
		])
	}
	
	return model;
}

//другое вспомогательное

function randInt(min, max){
	return Math.floor(Math.random()*(max-min))+min;
}

function argbToHex(alpha, red, green, blue) {
  let alphaHex = alpha.toString(16).toUpperCase();
  let redHex = red.toString(16).toUpperCase();
  let greenHex = green.toString(16).toUpperCase();
  let blueHex = blue.toString(16).toUpperCase();

  alphaHex = alphaHex.length < 2 ? "0" + alphaHex : alphaHex;
  redHex = redHex.length < 2 ? "0" + redHex : redHex;
  greenHex = greenHex.length < 2 ? "0" + greenHex : greenHex;
  blueHex = blueHex.length < 2 ? "0" + blueHex : blueHex;

  return "#" + alphaHex + redHex + greenHex + blueHex;
}

function parseColor(a, r, g, b){
	return Color.parseColor(argbToHex(Math.floor(a*255), Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)))
}

const setTimeout = function(func, ticks, obj){
	obj = obj || {};
	var upd = {
		ticks: 0,
		update(){
			this.ticks++
			if(this.ticks >= ticks){
				 func(obj);
				 this.remove = true
			}
		}
	};
	Updatable.addUpdatable(upd);
}
const setTimeoutLocal = function(func, ticks, obj){
	obj = obj || {};
	var upd = {
		ticks: 0,
		update(){
			this.ticks++
			if(this.ticks >= ticks){
				 func(obj);
				 this.remove = true
			}
		}
	};
	Updatable.addLocalUpdatable(upd);
}


function centerBlockPos(pos){
	return {
		x: pos.x + .5,
		y: pos.y + .5,
		z: pos.z + .5,
	};
}

function randPos(pos, max){
	let half = max / 2;
	return {
		x: pos.x + Math.random() * max - half,
		y: pos.y + Math.random() * max - half,
		z: pos.z + Math.random() * max - half
	};
}

function angleFor2dVector(x1, y1, x2, y2){
	let v = Math.acos((x1*x2+y1*y2) / (Math.sqrt(x1 * x1 + y1 * y1)*Math.sqrt(x2 * x2 + y2 * y2)))
	return isNaN(v) ? 0 : v;
}

function angleFor3dVector(x1, y1, z1, x2, y2, z2){
	let v = Math.acos((x1*x2+y1*y2+z1*z2) / (Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1)*Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2)));
	return isNaN(v) ? 0 : v;
}

function rotateMesh(mesh, x1, x2, y1, y2, dx, dy, dz, radius){
	const angleXZ = angleFor2dVector(0, radius, dx, dz);
	
	if(dx == 0 && dz == 0)
		var angleY = Math.PI/2;
	else
		var angleY = angleFor3dVector(dx, 0, dz, dx, dy, dz);
	
	mesh.rotate(0 < y2-y1 ? -angleY : angleY, 0 < x2-x1 ? -angleXZ : angleXZ, 0);
}