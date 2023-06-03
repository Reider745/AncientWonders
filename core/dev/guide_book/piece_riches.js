ScrutinyAPI.addTab("aw", "riches", {
    id: 6,
    icon: ItemID.RobeOfTheAzureWizard,
    title: ("aw.guide.tab.riches"),
    title_color: android.graphics.Color.rgb(1, 215/255, 0),
    isVisual: function(player,  windowName){
        return ScrutinyAPI.isScrutiny(player, windowName, "basics", "book")
    },
    auto_size: true 
});
Callback.addCallback("LevelDisplayed", function(){
ScrutinyAPI.addScrutiny("aw", "riches", "RobeOfTheAzureWizard", {
    size: 100,
    cellX: 1,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.RobeOfTheAzureWizard,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.RobeOfTheAzureWizard])
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "fire", {
    size: 100,
    cellX: 2,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.fire_king_chestplate,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.fire_king,ItemID.fire_king_chestplate]),
    	right: getArmorBook(80, 20, 15,[ItemID.fire_king_leggings,ItemID.fire_king_boots])
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "bandit", {
    size: 100,
    cellX: 3,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.bandit_chestplate,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.bandit_helmet,ItemID.bandit_chestplate]),
    	right: getArmorBook(80, 20, 15,[ItemID.bandit_leggings,ItemID.bandit_boots])
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "necromancer", {
    size: 100,
    cellX: 4,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.necromancer_chestplate,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.necromancer_helmet,ItemID.necromancer_chestplate]),
    	right: getArmorBook(80, 20, 15,[ItemID.necromancer_leggings,ItemID.necromancer_boots])
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "amylet", {
    size: 100,
    cellX: 5,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.aw_amylet4,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.aw_amylet,ItemID.aw_amylet2]),
    	right: getArmorBook(80, 20, 15,[ItemID.aw_amylet3,ItemID.aw_amylet4])
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "glasses", {
    size: 100,
    cellX: 6,
    cellY: 1,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.aw_glasses,
    },
    bookPost: {
    	left: getArmorBook(80, 20, 15, [ItemID.aw_glasses]),
    	right: [
    		{text: "aw.glasses.info", size: 15}
    	]
    }
});
});
ScrutinyAPI.addScrutiny("aw", "riches", "tanatos", {
    size: 100,
    cellX: 1,
    cellY: 3,
    isDone: [{tab: "basics", name: "book"}],
    item: {
        id: ItemID.tanatos,
    },
    bookPost: {
    	left: [
    		{text: ("aw.guide.tanatos.title"), size: 20},
    		{text: ("aw.guide.tanatos.text"), size: 15}
    	]
    }
});
ScrutinyAPI.addScrutiny("aw", "riches", "dead", {
    size: 100,
    cellX: 1,
    cellY: 5,
    isDone: [{tab: "basics", name: "book"}],
    line: ["tanatos"],
    item: {
        id: ItemID.aw_dead,
    },
    bookPost: {
    	left: [
    		{text: ("aw.guide.dead.title"), size: 20},
    		{text: ("aw.guide.dead.text"), size: 15}
    	],
      right: getBookWandData(ItemID.aw_dead)
    }
});

ScrutinyAPI.addScrutiny("aw", "riches", "aw_magic_stick", {
    size: 100,
    cellX: 3,
    cellY: 3,
    isDone: [{tab: "basics", name: "magisStick"}],
    line: [],
    item: {
        id: ItemID.aw_magic_stick,
    },
    bookPost: {
    	left: [
    		{text: "aw.item.aw_magic_stick", size: 20},
    		{text: "aw.guide.dungeon_wands", size: 15}
    	],
      right: getBookWandData(ItemID.aw_magic_stick)
    }
});

ScrutinyAPI.addScrutiny("aw", "riches", "aw_magic_shovel", {
    size: 100,
    cellX: 4,
    cellY: 3,
    isDone: [{tab: "basics", name: "magisSword"}],
    line: [],
    item: {
        id: ItemID.aw_magic_shovel,
    },
    bookPost: {
    	left: [
    		{text: "aw.item.magic_shovel", size: 20},
    		{text: "aw.guide.dungeon_wands", size: 15}
    	],
      right: getBookWandData(ItemID.aw_magic_shovel)
    }
});

ScrutinyAPI.addScrutiny("aw", "riches", "aw_magic_staff", {
    size: 100,
    cellX: 5,
    cellY: 3,
    isDone: [{tab: "basics", name: "magisPocox"}],
    line: [],
    item: {
        id: ItemID.aw_magic_staff,
    },
    bookPost: {
    	left: [
    		{text: "aw.item.magic_staff", size: 20},
    		{text: "aw.guide.dungeon_wands", size: 15}
    	],
      right: getBookWandData(ItemID.aw_magic_staff)
    }
});
