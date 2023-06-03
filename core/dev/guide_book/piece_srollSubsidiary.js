ScrutinyAPI.addTab("aw", "srollSubsidiary", {
    id: 3,
    icon: ItemID.sroll19,
    title: ("aw.guide.tab.srollSubsidiary"),
    isVisual: function(player,  windowName){
        return ScrutinyAPI.isScrutiny(player, windowName, "basics", "acolyteStaff")
    },
    auto_size: true 
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollHealing1", {
    size: 100,
    cellX: 1,
    cellY: 1,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll6,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollHealing1.title"), size: 25},
            {text: ("aw.guide.srollHealing1.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll6)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollHealing2", {
    size: 100,
    cellX: 2,
    cellY: 1,
    line: ["srollHealing1"],
    isDone: ["srollHealing1"],
    item: {
        id: ItemID.sroll12,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollHealing2.title"), size: 25},
            {text: ("aw.guide.srollHealing2.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll12)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollHealing3", {
    size: 100,
    cellX: 3,
    cellY: 1,
    line: ["srollHealing2"],
    isDone: ["srollHealing2"],
    item: {
        id: ItemID.sroll13,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollHealing3.title"), size: 25},
            {text: ("aw.guide.srollHealing3.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll13)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollSpeed", {
    size: 100,
    cellX: 1,
    cellY: 3,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll5,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollSpeed.title"), size: 25},
            {text: ("aw.guide.srollSpeed.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll5)
    }
});

ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollStrength", {
    size: 100,
    cellX: 2,
    cellY: 3,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll7,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollStrength.title"), size: 25},
            {text: ("aw.guide.srollStrength.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll7)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollRegeneration", {
    size: 100,
    cellX: 3,
    cellY: 3,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll19,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollRegeneration.title"), size: 25},
            {text: ("aw.guide.srollRegeneration.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll19)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollMagnet", {
    size: 100,
    cellX: 4,
    cellY: 3,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll20,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollMagnet.title"), size: 25},
            {text: ("aw.guide.srollMagnet.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll20)
    }
});




ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollBlockDestroy", {
    size: 100,
    cellX: 1,
    cellY: 5,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll9,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollBlockDestroy.title"), size: 25},
            {text: ("aw.guide.srollBlockDestroy.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll9)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollStorms", {
    size: 100,
    cellX: 2,
    cellY: 5,
    isDone: [{tab: "basics", name: "acolyteStaff"}],
    item: {
        id: ItemID.sroll16,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollStorms.title"), size: 25},
            {text: ("aw.guide.srollStorms.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll16)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollTeleportations", {
    size: 100,
    cellX: 3,
    cellY: 5,
    isDone: ["srollStorms"],
    line: ["srollStorms"],
    item: {
        id: ItemID.sroll15,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollTeleportations.title"), size: 25},
            {text: ("aw.guide.srollTeleportations.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll15)
    }
});
ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "srollCleansing", {
    cellX: 5,
    cellY: 3,
    size: 100,
    item: {
        id: ItemID.sroll29,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollCleansing.title"), size: 25},
            {text: ("aw.guide.srollCleansing.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll29)
    }
});

ScrutinyAPI.addScrutiny("aw", "srollSubsidiary", "illusion", {
    cellX: 7,
    cellY: 1,
    size: 100,
    item: {
        id: ItemID.sroll43,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.illusion.title"), size: 25},
            {text: ("aw.guide.illusion.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll43)
    }
});
