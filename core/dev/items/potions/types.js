Potion.registerPotionType("event", {
	installation(pos, item, player, data){
		if(data.items.length <= 0)
			return true;
		return data.items[data.items.length-1].id == ItemID.aw_mysterious_powder;
	}
});
Potion.registerPotionType("ingredient", {
	installation(pos, item, player, data){
		if(data.items.length <= 0)
			return false;
		if(Potion.getPrototype(data.items[data.items.length-1].id).id != -1)
			return Potion.getPrototype(data.items[data.items.length-1].id).type == "event" || Potion.getPrototype(data.items[data.items.length-2].id).type == "spider_legs" || Potion.getPrototype(data.items[data.items.length-1].id).type == "spider_legs"
		return false;
	}
});
Potion.registerPotionType("power", {
	installation(pos, item, player, data){
		if(data.items.length <= 0)
			return false;
		if(Potion.getPrototype(data.items[data.items.length-1].id).id != -1)
			return Potion.getPrototype(data.items[data.items.length-1].id).type == "ingredient" || Potion.getPrototype(data.items[data.items.length-1].id).type == "update"
		return false;
	}
});
Potion.registerPotionType("update", {
	installation(pos, item, player, data){
		if(data.items.length <= 0)
			return false;
		if(Potion.getPrototype(data.items[data.items.length-1].id).id != -1)
			return Potion.getPrototype(data.items[data.items.length-1].id).type == "event" || Potion.getPrototype(data.items[data.items.length-1].id).type == "ingredient" || Potion.getPrototype(data.items[data.items.length-2].id).type == "spider_legs" || Potion.getPrototype(data.items[data.items.length-1].id).type == "spider_legs"
		return false;
	}
});
Potion.registerPotionType("spider_legs", {
	installation(pos, item, player, data){
		if(data.items.length <= 0)
			return false;
		if(Potion.getPrototype(data.items[data.items.length-1].id).id != -1)
			return Potion.getPrototype(data.items[data.items.length-1].id).type == "ingredient" || Potion.getPrototype(data.items[data.items.length-1].id).type == "update"
		return false;
	}
});