ScrutinyAPI.addScrutiny("aw", "basics", "cauldron", {
    x: 750,
    y: 320,
    size: 100,
    item: {
        id: BlockID.cauldronAw,
    },
    bookPost: {
    	left: [
    		{text: "aw.gui.cauldron_title", size: 25},
    		{text: "aw.gui.cauldron_text", size: 15}
    	],
    	right: [
    		{text: "aw.gui.cauldron_text2", size: 15}
    	]
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "ritual", {
    x: 750,
    y: 520,
    size: 100,
    isVisual: ["book"],
    item: {
        id: BlockID.rityalPedestal,
    },
    bookPost: {
    	left: [
    		{text: "aw.gui.ritual_title", size: 25},
    		{text: "aw.gui.ritual_text", size: 15}
    	],
    	right: [
    		{text: "aw.gui.ritual_text2", size: 15}
    	]
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "srollEvent", {
    x: 50,
    y: 50,
    size: 100,
    item: {
        id: ItemID.sroll2,
    },
    bookPost: {
        left: [
            {text: "aw.guide.srollEvent.title", size: 25},
            {text: "aw.guide.srollEvent.text", size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "singularity", {
    x: 150,
    y: 310,
    size: 90,
    item: {
        id: BlockID.singularity_shrinker,
    },
    bookPost: {
        left: [
            {text: "aw.guide.singularity.title", size: 25},
            {text: "aw.guide.singularity.text1", size: 15}
        ],
        right: [
            {text: "aw.guide.singularity.text2", size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "book", {
    x: 50,
    y: 400,
    size: 100,
    line: ["singularity"],
    isDone: ["singularity"],
    item: {
        id: ItemID.bookk,
    },
    bookPost: {
        left: [
            {text: "aw.guide.book.title", size: 25},
            {text: "aw.guide.book.text1", size: 15}
        ],
        right: [
            {text: "aw.guide.book.text2", size: 15},
            {type: "slot", slots: [{size: 70,item:{id:ItemID.piece4}}]}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "srollMagicConnector", {
    x: 170,
    y: 50,
    size: 120,
    line: ["srollEvent"],
    isDone: ["srollEvent"],
    item: {
        id: BlockID.MagicConnector,
    },
    bookPost: {
        left: [
            {text: "aw.guide.srollMagicConnector.title", size: 25},
            {text: "aw.guide.srollMagicConnector.text1", size: 15},
             {text: "aw.guide.srollMagicConnector.text3", size: 15}
        ],
        right: [
            {text: "aw.guide.srollMagicConnector.text4", size: 15},
            {text: "aw.guide.srollMagicConnector.text5", size: 15},
            {text: "aw.guide.srollMagicConnector.text6", size: 15},
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "srollEventBlock", {
    x: 130,
    y: 200,
    size: 90,
    item: {
        id: ItemID.sroll2,
    },
    line: ["srollMagicConnector"],
    isVisual: ["srollMagicConnector"],
    bookPost: {
        left: [
            {text: "aw.guide.srollEventBlock.title", size: 20, chars: 30},
            {text: "aw.guide.srollEventBlock.text1", size: 15},
             {text: "aw.guide.srollEventBlock.text2", size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "srollEventPlayer", {
    x: 250,
    y: 175,
    size: 90,
    item: {
        id: ItemID.sroll2,
    },
    line: ["srollMagicConnector"],
    isVisual: ["srollMagicConnector"],
    bookPost: {
        left: [
            {text: "aw.guide.srollEventPlayer.title", size: 20},
            {text: "aw.guide.srollEventBlock.text1", size: 15},
             {text: ("aw.guide.srollEventPlayer.text1"), size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "srollEventEntity", {
    x: 320,
    y: 50,
    size: 90,
    item: {
        id: ItemID.sroll2,
    },
    line: ["srollMagicConnector"],
    isVisual: ["srollMagicConnector"],
    bookPost: {
        left: [
            {text: ("aw.guide.srollEventEntity.title"), size: 20, chars: 30},
            {text: ("aw.guide.srollEventBlock.text1"), size: 15},
             {text: ("aw.guide.srollEventEntity.text1"), size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "acolyteStaff", {
    x: 400,
    y: 280,
    size: 100,
    line: ["srollEventBlock", "srollEventPlayer", "srollEventEntity"],
    isVisual: ["srollEventBlock", "srollEventPlayer", "srollEventEntity"],
    item: {
        id: ItemID.acolyteStaff,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.acolyteStaff.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.acolyteStaff)
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "magisStick", {
    x: 280,
    y: 450,
    size: 100,
    line: ["acolyteStaff"],
    isVisual: ["acolyteStaff"],
    item: {
        id: ItemID.magis_stick,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisStick.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.magis_stick)
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "magisStick2lvl", {
    x: 280,
    y: 570,
    size: 100,
    line: ["magisStick"],
    isVisual: ["magisStick"],
    item: {
        id: ItemID.magis_stick_2_lvl,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisStick.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15}
        ],
        right: getBookWandData(ItemID.magis_stick_2_lvl)
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "magisSword", {
    x: 430,
    y: 450,
    size: 100,
    line: ["acolyteStaff"],
    isVisual: ["acolyteStaff"],
    item: {
        id: ItemID.magis_sword,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisSword.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.magis_sword)
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "magisSword2lvl", {
    x: 430,
    y: 570,
    size: 100,
    line: ["magisSword"],
    isVisual: ["magisSword"],
    item: {
        id: ItemID.magis_sword_2_lvl,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisSword.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.magis_sword_2_lvl)
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "magisPocox", {
    x: 580,
    y: 450,
    size: 100,
    line: ["acolyteStaff"],
    isVisual: ["acolyteStaff"],
    item: {
        id: ItemID.magis_pocox,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisPocox.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.magis_pocox)
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "magisPocox2lvl", {
    x: 580,
    y: 570,
    size: 100,
    line: ["magisPocox"],
    isVisual: ["magisPocox"],
    item: {
        id: ItemID.magis_pocox_2_lvl,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.magisPocox.title"), size: 25},
            {text: ("aw.guide.acolyteStaff.text1"), size: 15},
        ],
        right: getBookWandData(ItemID.magis_pocox_2_lvl)
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "classWarrior", {
    x: 700,
    y: 10,
    size: 110,
    isVisual: ["book"],
    item: {
        id: ItemID.loreClass2,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.classWarrior.title"), size: 25},
            {text: ("aw.guide.classWarrior.text1"), size: 15},
            {text: ("aw.guide.classWarrior.text2"), size: 15},
            {text: ("aw.guide.classWarrior.text3"), size: 15},
            {type: "slot", slots: [{size: 70,item:{id:ItemID.loreClass2}}]},
            {text: ("aw.guide.classWarrior.text4"), size: 15},
        ],
        right: getClassBook("warrior")
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "classNecromancer", {
    x: 820,
    y: 10,
    size: 110,
    isVisual: ["book"],
    item: {
        id: ItemID.loreClass3,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.classNecromancer.title"), size: 25},
           {text: ("aw.guide.classWarrior.text1"), size: 15},
            {text: ("aw.guide.classWarrior.text2"), size: 15},
            {text: ("aw.guide.classWarrior.text3"), size: 15},
            {type: "slot", slots: [{size: 70,item:{id:ItemID.loreClass2}}]},
            {text: ("aw.guide.classWarrior.text4"), size: 15},
        ],
        right: getClassBook("necromancer")
    }
});
ScrutinyAPI.addScrutiny("aw", "basics", "classMage", {
    x: 580,
    y: 10,
    size: 110,
    isVisual: ["book"],
    item: {
        id: ItemID.loreClass1,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.classMage.title"), size: 25},
            {text: ("aw.guide.classWarrior.text1"), size: 15},
            {text: ("aw.guide.classWarrior.text2"), size: 15},
            {text: ("aw.guide.classWarrior.text3"), size: 15},
            {type: "slot", slots: [{size: 70,item:{id:ItemID.loreClass2}}]},
            {text: ("aw.guide.classWarrior.text4"), size: 15},
        ],
        right: getClassBook("mage")
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "bowlWishes", {
    x: 580,
    y: 130,
    size: 110,
    isVisual: ["book"],
    item: {
        id: ItemID.rune5,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.bowlWishes.title"), size: 25},
            {text: ("aw.guide.bowlWishes.text1"), size: 15},
            {text: ("aw.guide.bowlWishes.text2"), size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "SpellSet", {
    x: 700,
    y: 130,
    size: 110,
    isVisual: ["book"],
    item: {
        id: ItemID.SpellSet31,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.SpellSet.title"), size: 25},
            {text: ("aw.guide.SpellSet.text1"), size: 15}
        ]
    }
});

ScrutinyAPI.addScrutiny("aw", "basics", "MagicController", {
    x: 820,
    y: 130,
    size: 110,
    isVisual: ["book", "SpellSet"],
    item: {
        id: BlockID.magicController,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.MagicController.title"), size: 25},
            {text: ("aw.guide.MagicController.text1"), size: 15},
            {text: ("aw.guide.MagicController.text2"), size: 15}
        ],
        right: [
             {text: ("aw.guide.MagicController.text3"), size: 15},
             {text: ("aw.guide.MagicController.text4"), size: 15}
        ]
    }
});




