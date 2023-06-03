ScrutinyAPI.addTab("aw", "srollKill", {
    id: 4,
    icon: ItemID.sroll22,
    title: ("aw.guide.tab.srollKill"),
    isVisual: function(player,  windowName){
        return ScrutinyAPI.isScrutiny(player, windowName, "sroll", "srollDamage3")
    },
    auto_size: true,
});
ScrutinyAPI.addScrutiny("aw", "srollKill", "srollKill", {
    cellX: 1,
    cellY: 1,
    size: 100,
    isDone: [{tab: "sroll", name: "srollDamage3"}],
    item: {
        id: ItemID.sroll8,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollKill.title"), size: 25},
            {text: ("aw.guide.srollKill.text1"), size: 15},
        ],
        right: [
            {text: ("aw.guide.text.characteristics"), size: 20},
            {text: "necromancer 20", size: 15},
            {text: ("aw.guide.srollKill.text2"), size: 15},
        ]
    }
});
ScrutinyAPI.addScrutiny("aw", "srollKill", "srollSummoning", {
    size: 100,
    cellX: 2,
    cellY: 2,
    line: ["srollKill"],
    isDone: ["srollKill"],
    item: {
        id: ItemID.sroll21,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollSummoning.title"), size: 25},
            {text: ("aw.guide.srollSummoning.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll21)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollKill", "srollDeathRay", {
    size: 100,
    cellX: 2,
    cellY: 1,
    line: ["srollKill"],
    isDone: ["srollKill"],
    item: {
        id: ItemID.sroll22,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollDeathRay.title"), size: 25},
            {text: ("aw.guide.srollSummoning.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll22)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollKill", "srollRainOfTheDead", {
    size: 100,
    cellX: 3,
    cellY: 2,
    line: ["srollDeathRay"],
    isDone: ["srollDeathRay"],
    item: {
        id: ItemID.sroll23,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollRainOfTheDead.title"), size: 25},
            {text: ("aw.guide.srollRainOfTheDead.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll23)
    }
});
