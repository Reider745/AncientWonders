function getBookSrollData(id){
    let arr = [];
    arr.push({text: Translation.translate("aw.guide.text.characteristics"), size: 20});
    let prot = Wands.getPrototype(id);
    let keys = Object.keys(prot.activate);
    for(let i in keys){
    	if(prot.activate[keys[i]] >= 1){
    		arr.push({text: keys[i] + " " + prot.activate[keys[i]], size: 15});
    	}
    }
    return arr;
}
function getBookWandData(id){
	let arr = [];
  arr.push({text: Translation.translate("aw.guide.text.characteristics"), size: 20});
  let wand = Wands.getStick(id);
  let keys = Object.keys(wand.bonus);
  for(let i in keys)
  	arr.push({text: keys[i] + " " + -wand.bonus[keys[i]], size: 15});
  arr.push({text: "time "+wand.time, size: 15});
  arr.push({text: "scroll max  "+wand.scroll_max, size: 15});
  return arr;
}
ScrutinyAPI.register("aw", {
	default_tab: "basics",
 scale: __config__.get("scrutiny_gui.frame_scale"),
 frame: __config__.get("scrutiny_gui.frame"),
 default_bitmap: __config__.get("scrutiny_gui.scrutiny"),
 default_bitmap_click: __config__.get("scrutiny_gui.scrutiny_2"),
 close_bitmap: "X",
});

function getClassBook(name){
	let arr = [];
	arr.push({text: Translation.translate("aw.guide.classWarrior.text5"), size: 20});
	let keys = Object.keys(MagicCore.getAllClass()[name]);
	for(let i in keys)
		arr.push({text: Translation.translate(keys[i]+": "+MagicCore.getAllClass()[name][keys[i]]), size: 15})
	return arr;
}
function getArmorBook(slot, title, text, items){
	let arr = [];
	arr.push({text: Translation.translate("aw.guide.armor.description"), size: title});
	for(let i in items){
		let id = items[i];
		arr.push({type: "slot", slots: [{size: slot,item:{id:id}}]});
		arr.push({text: TranslationLoad.get("aw.guide.armor.value", [["value", Item.getArmorValue(id)]]), size: text});
		arr.push({text: TranslationLoad.get("aw.guide.armor.damage", [["value", Item.getMaxDamage(id)]]), size: text});
		let obj = MagicCore.armors[id]
		if(obj)
			arr.push({text: TranslationLoad.get("aw.message.required_parameter", [["name", obj.parameter],["level", obj.value]]), size: text});
		obj = MagicCore.armorMagic[id];
		if(obj)
			arr.push({text: TranslationLoad.get("aw.guide.armor.value.protection", [["name", obj.type],["value",obj.value]]), size: text});
	}
	return arr;
}
ScrutinyAPI.addTab("aw", "basics", {
    id: 0,
    icon: ItemID.bookk,
    title: "aw.guide.tab.basics",
    auto_size: true 
});

addScrut("aw", "basics", "cauldron", "cauldron");
addScrut("aw", "basics", "ritual", "ritual");
addScrut("aw", "basics", "srollEvent", "sroll event", 0.1);
addScrut("aw", "basics", "singularity", "singularity", 0.1);
addScrut("aw", "basics", "book", "book", 0.05);
addScrut("aw", "basics", "srollMagicConnector", "magic connector", 0.05);
addScrut("aw", "basics", "srollEventBlock", "sroll event block", 0.05);
addScrut("aw", "basics", "srollEventPlayer", "sroll event player", 0.05);
addScrut("aw", "basics", "srollEventEntity", "sroll event entity", 0.05);
addScrut("aw", "basics", "acolyteStaff", "acolyte staff");
addScrut("aw", "basics", "magisStick", "magic stick");
addScrut("aw", "basics", "magisSword", "magic sword");
addScrut("aw", "basics", "magisPocox", "magic staff");
addScrut("aw", "basics", "magisStick2lvl", "magic stick 2 lvl");
addScrut("aw", "basics", "magisSword2lvl", "magic sword 2 lvl");
addScrut("aw", "basics", "magisPocox2lvl", "magic staff 2 lvl");
addScrut("aw", "basics", "classMage", "class mage");
addScrut("aw", "basics", "classWarrior", "class warrion", 0.06);
addScrut("aw", "basics", "classNecromancer", "class necromancer");
addScrut("aw", "basics", "bowlWishes", "bowl wishes");
addScrut("aw", "basics", "SpellSet", "Spell set");
addScrut("aw", "basics", "MagicController", "Magic controller");


addScrut("aw", "sroll", "fog", "fog");
addScrut("aw", "sroll", "srollDamage1", "sroll damage lvl 1");
addScrut("aw", "sroll", "srollDamage2", "sroll damage lvl 2");
addScrut("aw", "sroll", "srollDamage3", "sroll damage lvl 3");
addScrut("aw", "sroll", "srollWeakAttack", "sroll weak attack");
addScrut("aw", "sroll", "srollStrongAttack", "sroll strong attack");
addScrut("aw", "sroll", "srollFireProjectile", "sroll fire projectile");
addScrut("aw", "sroll", "srollFirestorm", "sroll firestorm");
addScrut("aw", "sroll", "srollFlameStream", "sroll flame stream");
addScrut("aw", "sroll", "srollstarfall", "sroll starfall");
addScrut("aw", "sroll", "srollExplosive", "sroll explosive");
addScrut("aw", "sroll", "freezing", "freezing")
addScrut("aw", "sroll", "snowstorm", "snowstorm")

addScrut("aw", "srollSubsidiary", "srollSpeed", "sroll speed");
addScrut("aw", "srollSubsidiary", "srollStrength", "sroll strength");
addScrut("aw", "srollSubsidiary", "srollHealing1", "sroll healing 1 lvl");
addScrut("aw", "srollSubsidiary", "srollHealing2", "sroll healing 2 lvl");
addScrut("aw", "srollSubsidiary", "srollHealing3", "sroll healing 3 lvl");
addScrut("aw", "srollSubsidiary", "srollBlockDestroy", "sroll block destroy");
addScrut("aw", "srollSubsidiary", "srollTeleportations", "sroll teleportations");
addScrut("aw", "srollSubsidiary", "srollStorms", "sroll storms");
addScrut("aw", "srollSubsidiary", "srollSpeed", "sroll speed");
addScrut("aw", "srollSubsidiary", "srollMagnet", "sroll magnet");
addScrut("aw", "srollSubsidiary", "srollRegeneration", "sroll regeneration");
addScrut("aw", "srollSubsidiary", "srollCleansing", "sroll cleansing");
addScrut("aw", "srollSubsidiary", "illusion", "illusion");

addScrut("aw", "srollKill", "srollKill", "sroll kill");
addScrut("aw", "srollKill", "srollSummoning", "sroll summoning");
addScrut("aw", "srollKill", "srollDeathRay", "sroll Death ray");
addScrut("aw", "srollKill", "srollRainOfTheDead", "sroll rain of the dead");

addScrut("aw", "riches", "RobeOfTheAzureWizard", "Robe of the azure wizard", -1);
addScrut("aw", "riches", "fire", "fire armor", -1);
addScrut("aw", "riches", "bandit", "bandit armor", -1);
addScrut("aw", "riches", "necromancer", "necromancer armor", -1);
addScrut("aw", "riches", "dead", "scythe of death", -1);
addScrut("aw", "riches", "tanatos", "tanatos", -1);
addScrut("aw", "riches", "amylet", "amylet", -1);
addScrut("aw", "riches", "glasses", "glasses", 0.005);
addScrut("aw", "riches", "aw_magic_stick", "Magic stick", -1);
addScrut("aw", "riches", "aw_magic_shovel", "Magic shovel", -1);
addScrut("aw", "riches", "aw_magic_staff", "Magic staff", -1);

addScrut("aw", "singularity", "magic_crusher", "magic crusher");
addScrut("aw", "singularity", "magic_storage", "magic storage");
addScrut("aw", "singularity", "clone_scroll", "Clone scroll", -1);

Callback.addCallback("ItemUse", function(coords, item, block, isExter, player){
    if(item.id == ItemID.scrutiny_book)
        ScrutinyAPI.open(player, "aw");
});
