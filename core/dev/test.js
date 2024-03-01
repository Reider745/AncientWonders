let DefaultAnim = {
	time: 60,
	fps: 20
};

function EMPTY_FUNCTION(){}

function ModelAnimationRender(){
	this.time = DefaultAnim.time;
	this.fps = DefaultAnim.fps;
	
	let caches = null;
	let caches_replace = null;
	let frames = 0;
	let start = null;
	let end = null;
	let update = {};
	let update_replace = {};
	let self = this;
	
	function uptState(){
		frames = (self.time / 20) * self.fps;
		update = getTransferFrame(start, end);
	}
	
	this.getFrames = function(){
		return frames;
	}
	
	this.setTime = function(time, func){
		func = func || uptState;
		this.time = time;
		func();
		return this;
	}
	
	this.setModel = function(_st, _end, func){
		func = func || uptState;
		start = _st;
		end = _end;
		func();
		return this;
	}
	
	function getModelToFrameCache(frame){
		return caches[frame];
	}
	
	function getTransferFrame(start, end){
		if(!start || !end) return;
		
		let boxes = {};
		let names_start = start.getAllName();
		let names_end = end.getAllName();
		let start_boxes = start.getBoxes();
		let end_boxes = end.getBoxes();
		let arr = ["x1", "y1", "z1", "x2", "y2", "z2"];
		
		for(let i in names_end){
			let name = names_end[i];
			if(!start_boxes[name])
				continue;
			
			let box_start = start_boxes[name];
			let box_end = end_boxes[name];
			
			boxes[name] = {id: box_start.id, data: box_start.data};
			
			for(let index in arr){
				let p = arr[index];
				boxes[name][p] = (box_end[p] - box_start[p])/frames;
			}
		}
		
		return boxes;
	}
	
	function buildModel(frame, _start, _update){
		_update = _update || update;
		_start = _start || start;
		
		let model = new RenderAPI.Model();
		let boxes = _start.getBoxes();
		
		for(let key in _update){
			let obj = _update[key];
			let start_obj = boxes[key];
			
			model.addBoxByBlock(key, start_obj.x1 + (obj.x1*frame), start_obj.y1 + (obj.y1*frame), start_obj.z1 + (obj.z1*frame), start_obj.x2 + (obj.x2*frame), start_obj.y2 + (obj.y2*frame), start_obj.z2 + (obj.z2*frame), obj.id, obj.data);
		}
		return model;
	}
	
	this.getModelToFrame = buildModel;
	
	this.prebuild = function(fps){
		this.fps = fps;
		uptState();
		caches = [];
		
		for(let frame = 0;frame < frames;frame++)
			caches[frame] = buildModel(frame);
		
		update_replace = getTransferFrame(end, start);
		cache_replace = [];
		
		for(let frame = 0;frame < frames;frame++)
			cache_replace[frame] = buildModel(frame, end, update_replace);
		
		this.getModelToFrame = getModelToFrameCache;
		return this;
	}
	
	this.disableCache = function(){
		caches = null;
		caches_replace = null;
		this.getModelToFrame = buildModel;
		return this;
	}
	
	this.replaceModel = function(){
		let a = caches;
		caches = cache_replace;
		cache_replace = a;
		
		a = update_replace;
		update = update_replace;
		update_replace = a;
		
		return this.setModel(end, start, EMPTY_FUNCTION);
	}
	
	this.clone = function(){
		return new ModelAnimationRender()
			.setModel(start, end, EMPTY_FUNCTION)
			.setTime(this.time, EMPTY_FUNCTION)
			.prebuild(this.fps);
	}
}

function _ModelAnimation(setting, render){
	render = render || new ModelAnimationRender();
	setting = setting || new DefaultModelAnimationRender(this);
	
	let handler = {
		start(){},
		update(frame){},
		end(){}
	};
	
	this.getSetting = function(){
		return setting;
	}
	
	this.setSetting = function(_setting){
		setting = _setting;
		return this;
	}
	
	this.getRender = function(){
		return render;
	}
	
	this.getTime = function(){
		return render.time;
	}
	
	this.setModel = function(st, end){
		render.setModel(st, end);
		return this;
	}
	
	this.replaceModel = function(){
		render.replaceModel();
		return this;
	}
	
	this.setTime = function(time){
		render.setTime(time);
		return this;
	}
	
	this.prebuild = function(fps){
		render.prebuild(fps);
		return this;
	}
	
	this.clone = function(){
		let setting = setting.clone();
		return new ModelAnimation(setting, render.clone()).setModel(setting).setHandler(handler);
	}
	
	let all_frame = {};
	this.updateModel = function(x, y, z, infinity){
		let frames = render.getFrames();
		let key = x+':'+y+":"+z;
		
		if(!all_frame[key]){
			handler.start(x, y, z);
			var data = {frame: 0};
			all_frame[key] = data;
		}else
			var data = all_frame[key];
		
		let frame = Math.floor(data.frame/render.time*frames);
		
		render.getModelToFrame(frame)
			.map(x, y, z);
		
		data.frame++;
			
		if(data.frame >= render.time){
			handler.end(x, y, z);
			delete all_frame[key];
		}
	}
	
	this.destroy = function(x, y, z){
		delete all_frame[key];
		BlockRenderer.unmapAtCoords(x, y, z);
	}
	
	this.play = function(x, y, z, infinity){
		let _setting = setting.clone();
		_setting.setProperties(infinity, infinity);
		_setting.play(x, y, z);
		return _setting;
	}
	
	this.setHandler = function(obj){
		handler = {
			start: obj.start || function(){},
			update: update.end || function(){},
			end: obj.end || function(){},
		};
		return this;
	}
	
	this.getHandler = function(){
		return handler;
	}
}

function DefaultModelAnimationRender(model){
	let infinity = false;
	let back = false;
	
	let back_status = false;
	let destroy_status = false;
	
	this.clone = function(_model){
		return new DefaultModelAnimationRender(_model||model).setProperties(infinity, back);
	}
	
	this.setModel = function(md){
		model = md;
		return this;
	}
	
	this.setProperties = function(_infinity, _back){
		infinity = _infinity;
		back = _back;
		return this;
	}
	
	this.destroy = function(){
		destroy_status = true;
		return this;
	}
	
	this.play = function(x, y, z, render){
		render = render || model.getRender().clone();
		let handler = model.getHandler();
		let self = this;
		
		let frames = render.getFrames()-1;
		handler.start(x, y, z);
		let animation = createAnimation((render.time / 20) * 1000, function(value, anim){
			if(destroy_status)
				return anim.stop();
			
			let frame = Math.floor(frames*value);
			
			render.getModelToFrame(frame)
				.map(x, y, z);
			
			handler.update(frame, x, y, z);
		});
		animation.addListener({
			onAnimationEnd(){
				handler.end(x, y, z);
				
				if(destroy_status){
					destroy_status = false;
					BlockRenderer.unmapAtCoords(x, y, z);
					return;
				}
				
				alert(back_status);
				if(back_status){
					back_status = false;
					render.replaceModel();
				}else if(back){
					render.replaceModel();
					back_status = true;
					return self.play(x, y, z, render);
				}
				
				infinity && self.play(x, y, z, render);
			}
		});
	}
}
/*
Я не помню что тут это делаеь

Правила!
👉запрещён контент 16+, да да это я тебе Антон и Бек, и других это тоже касается 😱
👉запрещён спам😳
👉запрещены массовы упоминания🤖
👉запрещена реклама, допускаются репосты записей если они содержат тематику inner core 🧐
👉прошу всех ориентироваться по времени МСК👀
👉каждый человек это личность, если вас оскорбили оскорбите в ответ👺
👉запрещён различный не культурный лексикон, мат не желателен 🥱
👉Если вам мешают уведомления беседы, отключите их
👉 запрещены политические темы
👉 запрещены издевательства над админом
👉 запрещено попрошайничество

Наказания: мут, бан, по настроению админов

👉ютуб канал - https://youtube.com/channel/UCaY38OdcxqsaqH2ulj_337A
👉гайд по моду Ancient wonders - https://vk.com/@-186544580-gaid-po-modu-ancient-wonders-2
Skyblock help - https://vk.com/topic-186544580_48495110
Телеграмм чат -
https://t.me/DungeonCraftChat

Если у вас есть вопросы, пишите.


Правила!
👉запрещён контент 16+, да да это я тебе Антон и Бек, и других это тоже касается 😱
👉запрещён спам😳
👉запрещены массовы упоминания🤖
👉запрещена реклама, допускаются репосты записей если они содержат тематику inner core 🧐
👉прошу всех ориентироваться по времени МСК👀
👉каждый человек это личность, если вас оскорбили оскорбите в ответ👺
👉запрещён различный не культурный лексикон, мат не желателен 🥱
👉если вас оскорбил Антон, знайте, это его обычное общение 🌚
👉прошу не игратся долго с ботом🤖
👉Антону не желательно пидарасить каждого пользователя 
👉Если вам мешают уведомления беседы, отключите их
👉ниутверждать, то чего не знаешь(бан)
👉 запрещены политические темы
👉 запрещены издевательства над админом
👉 за пропаганду выдаётся предупреждение 
👉 запрещена не объективная токсичность 
👉 запрещено попрошайничество

Наказания: мут, бан, по настроению админов

👉ютуб канал - https://youtube.com/channel/UCaY38OdcxqsaqH2ulj_337A
👉гайд по моду Ancient wonders - https://vk.com/@-186544580-gaid-po-modu-ancient-wonders-2
Skyblock help - https://vk.com/topic-186544580_48495110
Телеграмм чат -
https://t.me/DungeonCraftChat

Если у вас есть вопросы, пишите.

Данная беседа была создана точно уж не для того чтобы Антон пидарасил пользователей, а для общения с аудиторией.
[Статья]
https://vk.com/@-186544580-gaid-po-modu-ancient-wonders-2
*/

//Тестовый код анимации

/*const DEF = new RenderUtil.Model()
	.add(0, 0, 0, .5, .5, .5, 98);
const DEF_END = new RenderUtil.Model()
	.add(.5, .5, .5, 1, 1, 1, 98);

BlockRenderer.enableCoordMapping(98, -1, DEF.getICRenderModel());

let animation = new _ModelAnimation()
	.setModel(DEF, DEF_END)
	.setTime(180)
	.prebuild(60);//кеширует модель для каждого кадра, в 60 fps(можно указать любое количество кадров)

//количество fps привязано к тик, модели для каждого кадра создаются в реальном времени 
let animation_legacy = new ModelAnimation()
	.setModel(DEF, DEF_END)
	.setTime(180);
	
Callback.addCallback("ItemUse", function(coords, it, block){
	if(block.id == 98){
		if(it.id == 280){
			let setting = new DefaultModelAnimationRender(animation);
			setting.setProperties(false, true);
			setting.play(coords.x,coords.y,coords.z);
		}else if(it.id == 264){
			let setting = new DefaultModelAnimationRender(animation);;
			setting.setProperties(true, true);
			setting.play(coords.x,coords.y,coords.z);
		}else if(it.id == 263)
			animation_legacy.play(coords.x,coords.y,coords.z);
	}
});*/

/*BlockRenderer.enableCoordMapping(98, -1, DEF.getICRenderModel());
let animation = new RenderAPI.Animation(DEF, {
	"25": new RenderAPI.Model().add(0, 0, .5, .5, .5, 1),
	"50": new RenderAPI.Model().add(.5, 0, .5, 1, .5, 1),
	"75": new RenderAPI.Model().add(.5, 0, 0, 1, .5, .5),
	"100": new RenderAPI.Model().add(0, 0, 0, .5, .5, .5)
});
animation.setTime(100);
animation.prebuild(60);//максимум 60 fps

Callback.addCallback("ItemUse", function(coords, it, block){
	if(block.id == 98)
		animation.play(coords.x,coords.y,coords.z);
});*/