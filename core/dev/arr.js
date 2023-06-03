let arrRune = [ItemID.rune1, ItemID.rune2, ItemID.rune3, ItemID.rune4, ItemID.rune5, ItemID.rune6];
let CauldronFireBlock = [VanillaBlockID.fire, 11, 10, VanillaBlockID.magma];
let runes_singularity = {
"ItemID.rune1": 10,
"ItemID.rune2": 10,
"ItemID.rune3": 10,
"ItemID.rune4": 10,
"ItemID.rune5": 20,
"ItemID.rune6": 30,
"ItemID.rune_absorption":200,
"ItemID.rune_greed":200,
"ItemID.rune_life":200,
"ItemID.rune_dead":200,
"BlockID.aw_enchanted_rune_fire": 300,
"BlockID.aw_enchanted_rune_earth": 300,
"BlockID.aw_enchanted_rune_wind": 300,
"BlockID.aw_enchanted_rune_light": 300,
"BlockID.aw_enchanted_rune_darkness": 400,
"BlockID.aw_enchanted_rune_copying": 500,
};

Callback.addCallback("LevelLoaded", function(){
let keys = Object.keys(runes_singularity);
for(let i in keys)
runes_singularity[eval(keys[i])] = runes_singularity[keys[i]];
});
