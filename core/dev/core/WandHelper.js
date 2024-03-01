function Scrutiny(window, tab, name){
	this.window = window;
	this.tab = tab;
	this.name = name;
}

function Wand(id, texture, meta){
	this.id = id;
	this.time = 20;
	this.texture = {name: texture, meta: meta};
	
	this.setBonus = function(bonus){
		this.bonus = bonus;
		return this;
	}
	this.setTexture = function(name, meta){
		this.texture = {name: name, meta: meta};
		return this;
	}
	this.setSound = function(sound){
		this.sound = sound;
		return this;
	}
	this.setScrutiny = function(scrutiny){
		this.scrutiny = scrutiny;
		return this;
	}
	this.setTime = function(time){
		this.time = time;
		return this;
	}
	this.setScrollMax = function(max){
		obj.scroll_max = max;
		return this;
	}
	this.register = function(){
		Wands.addStick(this);
		return this;
	}
}

function ScrollBase(id){
	this.installation = function(player, item){
		delItem(player, item);
	}
	this.compatibility = [];
	this.setCompatibility = function(compatibility){
		this.compatibility = compatibility;
		return this;
	}
	this.setFunction = function(){}
	this.setUse = function(func){
		this.setFunction = func;
		return this;
	}
	this.setActivate = function(activate){
		this.activate = activate;
		return this;
	}
	this.setScrutiny = function(scrutiny){
		this.scrutiny = scrutiny;
		return this;
	}
	this.register = function(){
		Wands.setPrototype(id, this);
		return this;
	}
}

function Scroll(id){
	ScrollBase.call(this, id);
	this.type = "function";
}

function ScrollEvent(id){
	ScrollBase.call(this, id);
	this.type = "event";
	this.setUse = function(func){
		this.using = func;
	}
}