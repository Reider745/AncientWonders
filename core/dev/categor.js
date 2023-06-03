let categor = {
    nature: [ItemID.enchantment_forest_flower],
    govno: [ItemID.rune1,ItemID.rune2,ItemID.rune3,ItemID.rune4,ItemID.rune5,ItemID.rune6,ItemID.bookk,ItemID.loreClass1,ItemID.loreClass2,ItemID.loreClass3,ItemID.piece1,ItemID.piece2,ItemID.piece3,ItemID.rune_absorption,ItemID.rune_greed,ItemID.regularBag, ItemID.aw_magic_ingot, ItemID.aw_bottle_empty, ItemID.aw_bottle_potion, ItemID.aw_brain, ItemID.spider_legs, ItemID.aw_mysterious_powder, ItemID.witherbone, ItemID.aw_dragon_powder, ItemID.dead_essence, ItemID.magic_crystal, ItemID.magic_plate, ItemID.staff_singularity, ItemID.tanatos, ItemID.piece4, ItemID.scrutiny_book, ItemID.aw_backpack, ItemID.crystal_powder, ItemID.aw_petal_powder, ItemID.rune_life, ItemID.rune_dead,ItemID.aw_potions_book]
};
for(let i in categor.nature)
    Item.setCategory(categor.nature[i], 2);
for(let i in categor.govno)
    Item.setCategory(categor.govno[i], 4);
