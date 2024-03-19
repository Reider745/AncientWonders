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

function splitTextureForBlockbench(bbmodel, path_texture){
	
}

//другое вспомогательное

const Bitmap = android.graphics.Bitmap;
const Color = android.graphics.Color;

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