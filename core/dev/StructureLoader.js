const path = __dir__+"assets/structure/";
for(let i = 0;i <= 3;i++){
	StructureLoader.load(path+"ritual_"+i+".json", "aw_ritual_"+i, "DungeonAPI_V2");
	StructureLoader.load(path+"fortress/"+i+".json", "aw_fortress_"+i, "DungeonAPI_V2");
	if(i!=3)
		StructureLoader.load(path+"quest/location_"+i+".struct", "aw_location_"+i);
}
for(let i = 0;i <= 8;i++)
	StructureLoader.load(path+"enchanted_forest/wood_"+i+".struct", "enchanted_forest_wood_"+i);
	
for(let i = 0;i < 5;i++)
	StructureLoader.load(path+"village/village_"+i+".struct", "aw_village_"+i);

StructureLoader.load(path+"ritual_enchant_level.struct", "aw_ritual_enchant_level");
	
StructureLoader.load(path+"enchanted_forest/watch_tower.struct", "aw_watch_tower", null, true);
StructureLoader.load(path+"golem.struct", "aw_golem");
StructureLoader.load(path+"Cursed_Tower.dc", "aw_cursed_tower", "DungeonCore");
StructureLoader.load(path+"House_of_magicians.json", "aw_house_of_magicians", "DungeonAPI_V2")
StructureLoader.load(path+"magic_temple.json", "aw_magic_temple", "DungeonAPI_V2")
StructureLoader.load(path+"Ordinary_temple.json", "aw_ordinary_temple", "DungeonAPI_V2");
StructureLoader.load(path+"Temple_of_magicians.json", "aw_house_of_magicians", "DungeonAPI_V2")
StructureLoader.load(path+"Temple.json", "aw_temple", "DungeonAPI_V2");
StructureLoader.load(path+"Tower_of_darkness.json", "aw_tower_of_darkness", "DungeonAPI_V2")
StructureLoader.load(path+"Tower_of_evil.json", "aw_tower_of_evil", "DungeonAPI_V2");
