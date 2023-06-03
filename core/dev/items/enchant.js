let magic_protection = CustomEnchant.newEnchant("aw_magic_protection", Translation.translate("aw.enchant.magic_protection"))
	.setMinMaxLevel(1, 5)
	.setMasks(12, 3)
	.setIsTreasure(false)
	.setFrequency(1);

let dead_protection = CustomEnchant.newEnchant("aw_dead_protection", Translation.translate("aw.enchant.dead_protection"))
	.setMinMaxLevel(1, 5)
	.setMask(512)
	.setIsTreasure(false)
	.setFrequency(1);

//if(this["CustomEnchant"]){

var aspects_restoration = CustomEnchant.newEnchant("aw.aspects_restoration", Translation.translate("aw.enchant.aspects_restoration"))
	.setMinMaxLevel(1, 5)
	.setMask(16)
	.setIsTreasure(true)
 .setIsDiscoverable(false)
	.setFrequency(1)
 .setMinMaxCost(1, 3, 1, 3)
 .setAttackDamageBonusProvider(function(){return -1;});

var magic_damage = CustomEnchant.newEnchant("aw.magic_damage", Translation.translate("aw.enchant.magic_damage"))
	.setMinMaxLevel(1, 3)
	.setMask(16)
	.setIsTreasure(false)
 .setIsDiscoverable(true)
	.setFrequency(1)
 .setMinMaxCost(1, 3, 1, 3);

Callback.addCallback("PlayerAttack", function(player, ent){
let item = Entity.getCarriedItem(player);
if(item.extra){
MagicCore.damage(ent, "magic", 2*item.extra.getEnchantLevel(magic_damage.id));
}
});


Callback.addCallback("PlayerAttack", function(player, ent){
    let c = MagicCore.getValue(player);
    let item = Entity.getCarriedItem(player);
    if(MagicCore.isClass(player) && item.extra){
        let r = item.extra.getEnchantLevel(aspects_restoration.id)
        if(c.aspects + r <= c.aspectsNow){
            c.aspects += r;
        }else{
            c.spects = c.AspectsNow;
        }
       MagicCore.setParameters(player, c);
    }
});

var addEnchant = function(enchant, level){
for(let i = 1;i <= level;i++){
let extra = new ItemExtraData();
extra.addEnchant(enchant, i);
Item.addToCreative(VanillaItemID.enchantment_book, 1, 0, extra);
}
}
addEnchant(aspects_restoration.id, 5);
addEnchant(magic_damage.id, 3);
//}
