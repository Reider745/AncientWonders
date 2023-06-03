ScrutinyAPI.addTab("aw", "sroll", {
    id: 2,
    icon: ItemID.sroll4,
    title: ("aw.guide.tab.sroll"),
    auto_size: true,
    isVisual: function(player,  windowName){
        return ScrutinyAPI.isScrutiny(player, windowName, "basics", "acolyteStaff")
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "fog", {
    x: 650,
    y: 20,
    size: 100,
    line: [],
    item: {
        id: ItemID.sroll42,
    },
    bookPost: {
        left: [
            {text: "aw.guide.fog.title", size: 25},
            {text: "aw.guide.fog.info", size: 15},
        ],
        right: getBookSrollData(ItemID.sroll42)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "snowstorm", {
	x: 650,
	y: 380,
	size: 100,
	line: ["freezing"],
	item: {
		id: ItemID.sroll46,
	},
	bookPost: {
		left: [
			{text: "aw.guide.snowstorm.title", size: 25},
			{text: "aw.guide.snowstorm.info", size: 15},
		],
		right: getBookSrollData(ItemID.sroll46)
	}
});
ScrutinyAPI.addScrutiny("aw", "sroll", "freezing", {
	x: 650,
	y: 250,
	size: 100,
	line: [],
	item: {
		id: ItemID.sroll45,
	},
	bookPost: {
		left: [
			{text: "aw.guide.freezing.title", size: 25},
			{text: "aw.guide.freezing.info", size: 15},
		],
		right: getBookSrollData(ItemID.sroll45)
	}
});
	
ScrutinyAPI.addScrutiny("aw", "sroll", "srollDamage1", {
    x: 20,
    y: 20,
    size: 100,
    line: [],
    item: {
        id: ItemID.sroll4,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollDamage1.title"), size: 25},
            {text: ("aw.guide.srollDamage1.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll4)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollDamage2", {
    x: 130,
    y: 20,
    size: 100,
    line: ["srollDamage1"],
    isDone: ["srollDamage1"],
    item: {
        id: ItemID.sroll10,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollDamage2.title"), size: 25},
            {text: ("aw.guide.srollDamage2.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll10)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollDamage3", {
    x: 240,
    y: 20,
    size: 100,
    line: ["srollDamage2"],
    isDone: ["srollDamage2"],
    item: {
        id: ItemID.sroll11,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollDamage3.title"), size: 25},
            {text: ("aw.guide.srollDamage3.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll11)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollWeakAttack", {
    x: 130,
    y: 140,
    size: 100,
    line: ["srollDamage2"],
    isDone: ["srollDamage2"],
    item: {
        id: ItemID.sroll18,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollWeakAttack.title"), size: 25},
            {text: ("aw.guide.srollWeakAttack.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll18)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollStrongAttack", {
    x: 130,
    y: 260,
    size: 120,
    line: ["srollWeakAttack"],
    isVisual: ["srollWeakAttack"],
    item: {
        id: ItemID.sroll17,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollStrongAttack.title"), size: 25},
            {text: ("aw.guide.srollStrongAttack.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll17)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollFireProjectile", {
    x: 450,
    y: 140,
    size: 100,
    line: ["srollDamage3"],
    isDone: ["srollDamage3"],
    item: {
        id: ItemID.sroll32,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollFireProjectile.title"), size: 25},
            {text: ("aw.guide.srollFireProjectile.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll32)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollFirestorm", {
    x: 450,
    y: 250,
    size: 100,
    line: ["srollFireProjectile"],
    isDone: ["srollFireProjectile"],
    item: {
        id: ItemID.sroll33,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollFirestorm.title"), size: 25},
            {text: ("aw.guide.srollFirestorm.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll33)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollFlameStream", {
    x: 450,
    y: 360,
    size: 100,
    line: ["srollFirestorm", "srollStrongAttack"],
    isVisual: ["srollStrongAttack"],
    isDone: ["srollFirestorm", "srollStrongAttack"],
    item: {
        id: ItemID.sroll34,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollFlameStream.title"), size: 25},
            {text: ("aw.guide.srollFlameStream.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll34)
    }
});

Translation.addTranslation("Scroll of Starfall", {
    ru: "Свиток звездопад"
});
Translation.addTranslation("Launches a projectile from the sky that deals 10 damage in flight, and 20 when it falls.", {
    ru: "Выпускает с неба снаряд, который наносит 10 единиц урона в полёте, и 20 когда упал."
});
ScrutinyAPI.addScrutiny("aw", "sroll", "srollstarfall", {
    x: 450,
    y: 480,
    size: 100,
    line: ["srollFlameStream"],
    isVisual: ["srollFlameStream"],
    isDone: ["srollFlameStream"],
    item: {
        id: ItemID.sroll35,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollstarfall.title"), size: 25},
            {text: ("aw.guide.srollstarfall.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll35)
    }
});

ScrutinyAPI.addScrutiny("aw", "sroll", "srollExplosive", {
    x: 250,
    y: 480,
    size: 100,
    line: ["srollFlameStream"],
    isDone: ["srollFlameStream"],
    isVisual: ["srollFlameStream"],
    item: {
        id: ItemID.sroll26,
    },
    bookPost: {
        left: [
            {text: ("aw.guide.srollExplosive.title"), size: 25},
            {text: ("aw.guide.srollExplosive.text1"), size: 15},
        ],
        right: getBookSrollData(ItemID.sroll26)
    }
});
