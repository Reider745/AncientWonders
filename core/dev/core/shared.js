const API = {
    MagicCore: MagicCore,
    Wands: Wands,
    delItem: delItem2,
    ParticlesAPI: ParticlesAPI,
    Render: RenderAPI,
    Mp: Mp,
    RitualAPI: RitualAPI,
    BookAPI: BookAPI,
    PlayerAC: PlayerAC,
    EffectAPI: EffectAPI,
    Potion: Potion,
    Bag: Bag,
    setTimeout: setTimeout,
    ScrutinyAPI_V2: ScrutinyAPI_V2,
    AchievementAPI: AchievementAPI,
    MagicSmithy: MagicSmithy,
    SoundManager: SoundManager,
    ScrutinyAPI: ScrutinyAPI,
    addScrut: addScrut,
    AncientWonders: AncientWonders,
    TranslationLoad: TranslationLoad,
    SingularityAPI: SingularityAPI,
    EntityReg: EntityReg,
    
    Scrutiny: Scrutiny,
    Wand: Wand,
    ScrollBase: ScrollBase,
    Scroll: Scroll,
    ScrollEvent: ScrollEvent,
    
    AW: {
    	typeDamage: {
    		magic: "magic",
    		dead: "dead"
    	},
    	srollEvent: {
    		useBlock: ItemID.sroll1,
    		usePlayer: ItemID.sroll2,
    		useMob: ItemID.sroll3
    	},
    	creativeGroup: {
    		rune: "rune",
    		wand: "wand",
    		eventSroll: "events",
    		srolls: "sroll",
    		decorSroll: "decor"
    	}
    },
    requireGlobal(command){
      return eval(command);
    },
    versionAPI: 10
};
Callback.invokeCallback("AncientWonders", API);
ModAPI.registerAPI("AncientWondersAPI", API);
Logger.Log("Ancient Wonders load", "API");