IDRegistry.genItemID("awDebugWand"); 
Item.createItem("awDebugWand", "debug wand", {name: "stick", meta: 0}, {stack: 1});
Wands.addStick({
    id: ItemID.awDebugWand,
    time: 5,
    scroll_max: 9999,
    texture: {
        name: "stick"
    },
    bonus: {
        necromancer: 100,
        protection: 100,
        magic: 100,
        aspects: 99999999
    }
});

Wands.addStick({
    id: ItemID.magis_stick, 
    time: 20,
    scroll_max: 2,
    sound: "magic_1",
    scrutiny: {
        name: "magisStick"
    },
    texture: {
        name: "magis_stick"
    },
});
MagicCore.setUsingItem({id: ItemID.magis_stick, data: 0}, "magic", 10);
Wands.addStick({
    id: ItemID.acolyteStaff,
    time: 30,
    sound: "magic_0",
    scroll_max: 1,
    scrutiny: {
        name: "acolyteStaff"
    },
    texture: {
        name: "acolyte_staff"
    },
    bonus: {
        necromancer: -5,
        protection: -5,
        magic: -5,
        aspects: -20
    }
});
Wands.addStick({
    id: ItemID.magis_sword,
    time: 30,
    scroll_max: 2,
    sound: "magic_2",
    scrutiny: {
        name: "magisSword"
    },
    texture: {
        name: "magis_sword"
    },
    bonus: {
        necromancer: 10,
        protection: -10,
        magic: 10,
        aspects: -10
    }
});
MagicCore.setUsingItem({id: ItemID.magis_sword, data: 0}, "protection", 35);
Wands.addStick({
    id: ItemID.magis_pocox,
    time: 20,
    scroll_max: 2,
    sound: "magic_3",
    scrutiny: {
        name: "magisPocox"
    },
    texture: {
        name: "magis_pocox"
    },
    bonus: {
        necromancer: -10,
        protection: 5,
        magic: 10,
        aspects: -5
    }
});

Wands.addStick({
    id: ItemID.aw_dead,
    time: 30,
    scroll_max: 6,
    sound: "magic_4",
    scrutiny: {
    	name: "dead",
    	tab: "riches"
    },
    texture: {
        name: "aw_dead"
    },
    bonus: {
        necromancer: 10,
        protection: 10,
        magic: 10,
        aspects: 10
    }
});

MagicCore.setUsingItem({id: ItemID.magis_pocox, data: 0}, "necromancer", 20);

Wands.addStick({
    id: ItemID.magis_stick_2_lvl,
    time: 25,
    scroll_max: 4,
    sound: "magic_1",
    scrutiny: {
        name: "magisStick2lvl"
    },
    texture: {
        name: "magis_stick_2_lvl"
    },
    bonus: {
        necromancer: 10,
        protection: 5,
        magic: -5,
        aspects: 10
    }
});
MagicCore.setUsingItem({id: ItemID.magis_stick_2_lvl, data: 0}, "magic", 40);

Wands.addStick({
	id: ItemID.aw_magic_stick,
	time: 20,
	scroll_max: 5,
	sound: "magic_1",
	scrutiny: {
		tab: "riches",
		name: "aw_magic_stick"
	},
	texture: {
		name: "magic_stick"
	},
	bonus: {
		necromancer: 5,
		protection: 5,
		magic: 5,
		aspects: 5
	}
});
MagicCore.setUsingItem({id: ItemID.aw_magic_stick, data: 0}, "magic", 60);

Wands.addStick({
    id: ItemID.magis_sword_2_lvl,
    time: 25,
    scroll_max: 4,
    sound: "magic_2",
    scrutiny: {
        name: "magisSword2lvl"
    },
    texture: {
        name: "magis_sword_2_lvl"
    },
    bonus: {
        necromancer: 5,
        protection: -5,
        magic: 10,
        aspects: 5
    }
});
MagicCore.setUsingItem({id: ItemID.magis_sword_2_lvl, data: 0}, "protection", 50);

Wands.addStick({
	id: ItemID.aw_magic_shovel,
	time: 20,
	scroll_max: 5,
	sound: "magic_2",
	scrutiny: {
		tab: "riches",
		name: "aw_magic_shovel"
	},
	texture: {
		name: "magic_shovel"
	},
	bonus: {
		necromancer: 5,
		protection: 5,
		magic: 5,
		aspects: 0
	}
});
MagicCore.setUsingItem({id: ItemID.aw_magic_shovel, data: 0}, "protection", 60);

Wands.addStick({
    id: ItemID.magis_pocox_2_lvl,
    time: 15,
    scroll_max: 4,
    sound: "magic_3",
    texture: {
        name: "magic_staff_2_lvl"
    },
    scrutiny: {
        name: "magisPocox2lvl"
    },
    bonus: {
        necromancer: 5,
        protection: -5,
        magic: 10,
        aspects: 5
    }
});
MagicCore.setUsingItem({id: ItemID.magis_pocox_2_lvl, data: 0}, "necromancer", 40);

Wands.addStick({
	id: ItemID.aw_magic_staff,
	time: 20,
	scroll_max: 5,
	sound: "magic_2",
	scrutiny: {
		tab: "riches",
		name: "aw_magic_staff"
	},
	texture: {
		name: "magic_staff"
	},
	bonus: {
		necromancer: 5,
		protection: 5,
		magic: 5,
		aspects: -5
	}
});
MagicCore.setUsingItem({id: ItemID.aw_magic_staff, data: 0}, "necromancer", 60);

let SpellExtra = {
	extra1: Wands.addSpellSet([ItemID.sroll16, ItemID.sroll27, ItemID.sroll15], Translation.translate("aw.item.name_spell_set.displacement")),
  extra2: Wands.addSpellSet([ItemID.sroll20, ItemID.sroll16, ItemID.sroll27, ItemID.sroll16, ItemID.sroll27, ItemID.sroll17], Translation.translate("aw.item.name_spell_set.swipe")),
};

Bag1.addItem(0.01, ItemID.SpellSet31, {}, 0, SpellExtra.extra1);
Wands.setPrototype(ItemID.sroll1, {
    type: "event", 
    event: "itemUse", 
    using: function(packet){

    },
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll2, {
    type: "event", 
    event: "usingReleased", 
    using: function(packet){

    },
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll3, {
    type: "event", 
    event: "EntityInteract", 
    using: function(packet){

    },
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll4, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollDamage1",
        tab: "sroll"
    },
    activate: {
        necromancer: 10,
        aspects: 10
    },
    setFunction: function(packet){
        MagicCore.damage(packet.entity, "magic", 3);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll5, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollSpeed",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 10,
        aspects: 5
    },
    setFunction: function(packet){
        Entity.addEffect(packet.entity, 1, 2, 240, true, false);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll6, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    activate: {
        magic: 20,
        aspects: 40
    },
    scrutiny: {
        name: "srollHealing1",
        tab: "srollSubsidiary"
    },
    setFunction: function(packet){
        Entity.healEntity(packet.entity, 5);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll7, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollStrength",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 15,
        aspects: 20
    },
    setFunction: function(packet){
        Entity.addEffect(packet.entity, 5, 3, 240, true, false);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll8, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollKill",
        tab: "srollKill"
    },
    activate: {
        necromancer: 20
    },
    setFunction: function(packet){
        let c = MagicCore.getValue(packet.player);
        let helt = Entity.getHealth(packet.entity)*3;
        if(c.aspects >= helt){
            MagicCore.damage(packet.entity, "dead", 40);
            c.aspects -= helt;
            MagicCore.setParameters(packet.player, c);
        }else{
            PlayerAC.message(packet.player, TranslationLoad.get("aw.message.sroll.kill", [["aspects", helt]]));
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll9, {
    type: "function", 
    compatibility: [ItemID.sroll2, ItemID.sroll3],
    scrutiny: {
        name: "srollRegeneration",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 10,
        aspects: 10
    },
    setFunction: function(packet){
        BlockSource.getDefaultForActor(packet.player).destroyBlock(packet.coords.x,packet.coords.y,packet.coords.z, true);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll10, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollDamage2",
        tab: "sroll"
    },
    activate: {
        necromancer: 15,
        aspects: 50
    },
    setFunction: function(packet){
        MagicCore.damage(packet.entity, "magic", 14);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll11, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollDamage3",
        tab: "sroll"
    },
    activate: {
        necromancer: 20,
        aspects: 100
    },
    setFunction: function(packet){
        MagicCore.damage(packet.entity, "magic", 58);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll12, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollHealing2",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 30,
        aspects: 60
    },
    setFunction: function(packet){
        Entity.healEntity(packet.entity, 10);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll13, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollHealing3",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 50,
        aspects: 300
    },
    setFunction: function(packet){
        Entity.healEntity(packet.entity, 40);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
/*Wands.setPrototype(ItemID.sroll14, {
    type: "function", 
    compatibility: [ItemID.sroll2, ItemID.sroll3],
    activate: {
        magic: 30
    },
    setFunction: function(packet){
        let c = MagicCore.getValue(packet.player);
        if(c.Aspects + 10 <= c.AspectsNow){
           BlockSource.getDefaultForActor(packet.entity).destroyBlock(packet.coords.x,packet.coords.y,packet.coords.z, false);
            c.Aspects += 10;
            MagicCore.setParameters(packet.player, c);
        }else if(c.Aspects <= c.AspectsNow){
             BlockSource.getDefaultForActor(packet.entity).destroyBlock(packet.coords.x,packet.coords.y,packet.coords.z, false);
            c.Aspects = c.AspectsNow;
            MagicCore.setParameters(packet.player, c);
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});*/
Wands.setPrototype(ItemID.sroll15, {
    type: "function", 
    compatibility: [ItemID.sroll1, ItemID.sroll3],
    scrutiny: {
        name: "srollTeleportations",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 10,
        protection: 40,
        aspects: 30
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
        startSpinAttack(packet.entity);
        Entity.addVelocity(packet.entity, vel.x * 2, vel.y * 2, vel.z * 2);
        ParticlesAPI.spawnLine(ParticlesAPI.part2, pos.x, pos.y, pos.z, pos.x + (vel.x * 6), pos.y + (vel.y * 6), pos.z + (vel.z * 6), 10, Entity.getDimension(packet.entity));
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll16, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollStorms",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 15,
        protection: 20,
        aspects: 10
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        //Entity.setVelocity(packet.entity, 0, 0, 0);
        Entity.addVelocity(packet.entity, 0, 1, 0);
        ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-1, pos.z, 0.5, 11, 2);
        ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.8, pos.z, 0.7, 11, 2);
        //ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.5, pos.z, 1, 11, 2);
        ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.3, pos.z, 1.1, 11, 2);
        ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y-0.1, pos.z, 1.1, 11, 2);
        //ParticlesAPI.spawnCircle(ParticlesAPI.part1, pos.x, pos.y+0.1, pos.z, 1.2, 11, 2);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll17, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollStrongAttack",
        tab: "sroll"
    },
    activate: {
        magic: 20,
        protection: 30,
        aspects: 50
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        let region = BlockSource.getDefaultForActor(packet.entity);
        let group = new ParticlesCore.Group();
        for(let i = 0;i <= 20;i++){
            let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
            vel.x += Math.random() - Math.random();
            vel.y += Math.random() - Math.random();
            vel.z += Math.random() - Math.random();
            for(let i = 0;i<50;i++){
                let coord = {
                    x: pos.x+(i * vel.x / 2),
                    y: pos.y+(i * vel.y / 2),
                    z: pos.z+(i * vel.z / 2)
                };
                let ent3 = Entity.getAllInRange(coord, 4);
                for(let i1 in ent3){
                    if(ent3[i1] != packet.entity) MagicCore.damage(ent3[i1], "magic", 4);
                }
                 if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                    break;
                }
                group.add(ParticlesAPI.part3, coord.x, coord.y, coord.z);
            }
        }
        group.send(region);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll18, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollWeakAttack",
        tab: "sroll"
    },
    activate: {
        magic: 10,
        protection: 15,
        aspects: 20
    },
    setFunction: function(packet){
        ParticlesAPI.spawnShellEnt(ParticlesAPI.part3, packet.entity, 30, 4);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll19, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollRegeneration",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 5,
        protection: 5,
        necromancer: 10,
        aspects: 15
    },
    setFunction: function(packet){
        Entity.addEffect(packet.entity, 10, 4, 300, true, false);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll20, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollMagnet",
        tab: "srollSubsidiary"
    },
    activate: {
        magic: 15,
        necromancer: 5,
        aspects: 30
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        let ents = Entity.getAllInRange(pos, 40);
        let group = new ParticlesCore.Group();
        let dim = Entity.getDimension(packet.entity);
        for(let i in ents){
            let pos1 = Entity.getPosition(ents[i]);
            let vel = {
                x: (pos.x - pos1.x) / 4,
                y: (pos.y - pos1.y) / 4,
                z: (pos.z - pos1.z) / 4
            };
            let dimension = Entity.getDimension(ents[i]);
            if(dimension != dim) continue;
            Mp.spawnParticle(ParticlesAPI.part1, pos1.x, pos1.y, pos1.z, vel.x, vel.y, vel.z, 0, 0, 0, dimension);
            Entity.setVelocity(ents[i], vel.x, vel.y, vel.z);
        }
        group.send(dim);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll21, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollSummoning",
        tab: "srollKill"
    },
    activate: {
        magic: 5,
        necromancer: 30,
        aspects: 50
    },
    setFunction: function(packet){
    	let group = new ParticlesCore.Group();
    	let b = BlockSource.getDefaultForActor(packet.entity);
        for(let i = 0;i <= Math.floor(Math.random()*3)+1;i++){
            let pos = Entity.getPosition(packet.entity);
            pos.x += (Math.random() * 8) - (Math.random() * 8);
            pos.z += (Math.random() * 8) - (Math.random() * 8);
            pos = GenerationUtils.findSurface(pos.x, pos.y, pos.z);
            let mob = b.spawnEntity(pos.x, pos.y + 1, pos.z, "aw:skeleton");
            Entity.setCarriedItem(mob, ItemID. magis_stick, 1, 0, null);
            entId[mob] = packet.entity;
            for(i = 0;i <= Math.floor(Math.random()*5)+5;i++){
                group.add(ParticlesAPI.part1, pos.x + Math.random() - Math.random() - 1, pos.y, pos.z + Math.random() - Math.random() - 1, 0, 0.1, 0);
            }
        }
		group.send(b);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll22, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollDeathRay",
        tab: "srollKill"
    },
    activate: {
        magic: 5,
        necromancer: 30,
        aspects: 100
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        pos.y+=0.5;
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
        let region = BlockSource.getDefaultForActor(packet.entity);
        let group = new ParticlesCore.Group();
        for(let i = 0;i<50;i++){
            let coord = {
                x: pos.x+(i * vel.x / 2),
                y: pos.y+(i * vel.y / 2),
                z: pos.z+(i * vel.z / 2)
            };
            let ent3 = Entity.getAllInRange(coord, 2);
            for(let i1 in ent3){
                if(ent3[i1] != packet.entity) MagicCore.damage(ent3[i1], "dead", 40);
            }
             if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                break;
            }
            group.add(ParticlesAPI.part4, coord.x, coord.y, coord.z);
        }
        group.send(region)
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll23, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollRainOfTheDead",
        tab: "srollKill"
    },
    activate: {
        protection: 10,
        necromancer: 40,
        aspects: 250
    },
    setFunction: function(packet){
    	let group = new ParticlesCore.Group();
    	let region = BlockSource.getDefaultForActor(packet.entity);
        for(let i = 0;i<=Math.floor(Math.random()*15);i++){
            let pos = Entity.getPosition(packet.entity);
            pos.x += ((Math.random()*8)-(Math.random()*8));
            pos.y += 5;
            pos.z += ((Math.random()*8)-(Math.random()*8));
            for(let i = 0;i<60;i++){
                let coord = {
                    x: pos.x,
                    y: pos.y+(i * -0.3),
                    z: pos.z
                };
                let ent3 = Entity.getAllInRange(coord, 2);
                for(let i1 in ent3){
                    if(ent3[i1] != packet.entity) MagicCore.damage(ent3[i1], "dead", 40);
                }
                 if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                    break;
                }
                group.add(ParticlesAPI.part4, coord.x, coord.y, coord.z);
            }
        }
        group.send(region);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
/*Wands.setPrototype(ItemID.sroll24, {
    type: "function", 
    compatibility: [ItemID.sroll1, ItemID.sroll3],
    activate: {
        magic: 55,
        necromancer: 15,
    },
    setFunction: function(packet){
        for(let i = 0;i<=Math.floor(Math.random()*15);i++){
            let pos = Entity.getPosition(packet.entity);
            let pos1 = pos;
            pos.x += ((Math.random()*8)-(Math.random()*8));
            pos.y += ((Math.random()*8)-(Math.random()*8));
            pos.z += ((Math.random()*8)-(Math.random()*8));
            let c = MagicCore.getValue(packet.player);
            if(Math.random()<=0.1){
                BlockSource.getDefaultForActor(packet.entity).explode(pos1.x, pos1.y, pos1.z, 4, false)
            }else if(c.AspectsNow >= c.Aspects+3){
                Mp.spawnParticle(ParticlesAPI.part2, pos1.x, pos1.y, pos1.z, 0, 0, 0);
               c.Aspects+=3;
               MagicCore.setParameters(packet.player, c);
            }
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll25, {
    type: "function", 
    compatibility: [ItemID.sroll1, ItemID.sroll3],
    activate: {
        magic: 55,
        necromancer: 50,
    },
    setFunction: function(packet){
        for(let i = 0;i<=Math.floor(Math.random()*18);i++){
            let pos = Entity.getPosition(packet.entity);
            let pos1 = pos;
            pos.x += ((Math.random()*8)-(Math.random()*8));
            pos.y += ((Math.random()*8)-(Math.random()*8));
            pos.z += ((Math.random()*8)-(Math.random()*8));
            let c = MagicCore.getValue(packet.player);
            if(Math.random()<=0.1){
                BlockSource.getDefaultForActor(packet.entity).explode(pos1.x, pos1.y, pos1.z, 4, false)
            }else if(c.AspectsNow >= c.Aspects+6){
                Mp.spawnParticle(ParticlesAPI.part2, pos1.x, pos1.y, pos1.z, 0, 0, 0);
               c.Aspects+=6;
               MagicCore.setParameters(packet.player, c);
            }
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});*/
Wands.setPrototype(ItemID.sroll26, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollExplosive",
        tab: "sroll"
    },
    activate: {
        magic: 20,
        necromancer: 5,
        protection: 40,
        aspects: 30
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
        let region = BlockSource.getDefaultForActor(packet.entity);
        let group = new ParticlesCore.Group();
        for(let i = 0;i<25;i++){
            let coord = {
                x: pos.x+(i * vel.x / 2),
                y: pos.y+0.5+(i * vel.y / 2),
                z: pos.z+(i * vel.z / 2)
            };
             if(region.getBlockId(coord.x,coord.y,coord.z)!=0){
                region.explode(coord.x, coord.y, coord.z, 8, false)
                break;
            }
            group.add(ParticlesAPI.part3, coord.x, coord.y, coord.z);
        }
        group.send(region);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll27, {
    type: "function", 
    compatibility: [],
    scrutiny: {
        name: "acolyteStaff",
    },
    time: 10,
    activate: {
        magic: 10,
    },
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll28, {
    type: "function", 
    compatibility: [],
    scrutiny: {
        name: "acolyteStaff",
    },
    time: 20,
    activate: {
        magic: 10,
    },
    installation: function (player, item){
        delItem(player, item);
    }
});

Wands.setPrototype(ItemID.sroll29, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollCleansing",
        tab: "sroll"
    },
    activate: {
        magic: 10,
        protection: 20
    },
    setFunction: function (packet){
        EffectAPI.clearAll(packet.entity);
    },
    installation: function (player, item){
        delItem(player, item);
    }
});
/*Wands.setPrototype(ItemID.sroll30, {
    type: "function", 
    compatibility: [ItemID.sroll1, ItemID.sroll3],
    activate: {
        magic: 15,
        protection: 10
    },
    setFunction: function (packet){
        EffectAPI.add(packet.player, "fly", 20 * 30, 1);
    },
    installation: function (player, item){
        delItem(player, item);
    }
});*/
Wands.setPrototype(ItemID.SpellSet31, {
    type: "function", 
    compatibility: [],
    scrutiny: {
        name: "SpellSet"
    },
    setFunction(packet){
			let extra = packet.wand.extra || new ItemExtraData();
			let wand = Wands.getStick(packet.wand.id);
			if(wand.scrutiny.enable || ScrutinyAPI.isScrutiny(player, wand.scrutiny.window, wand.scrutiny.tab, wand.scrutiny.name)){
				let event = Wands.getPrototype(extra.getInt("event", 0));
        let spells = Wands.getArrByExtra(packet.sroll[packet.spellI].extra);
        let time = 0;
        for(let i in spells){
        	if(Wands.isCompatibility(extra.getInt("event", 0), spells[i].id)){
        			
        		let prot = Wands.getPrototype(spells[i].id);
        		if(prot.scrutiny.enable && !ScrutinyAPI.isScrutiny(packet.entity, prot.scrutiny.window, prot.scrutiny.tab, prot.scrutiny.name)){
        			PlayerAC.message(packet.entity, TranslationLoad.get("aw.message.need_study", [["name", prot.scrutiny.name]]));
        			continue;
        		}
        		if(AncientWonders.isParameters(packet.entity, prot.activate, wand.bonus)){
        			let c = MagicCore.getValue(packet.entity);
        			if(0 <= prot.activate.aspects - (wand.bonus.aspects||0)) c.aspects -= prot.activate.aspects - (wand.bonus.aspects||0);
              MagicCore.setParameters(packet.entity, c);
             
              event.using(packet);
              wand.use(packet);
              packet.item = spells[i];
              	
              packet.coords = {x:packet.coordsOriginal.x+(packet.x||0),y:packet.coordsOriginal.y+(packet.y||0),z:packet.coordsOriginal.z+(packet.z||0)};
              java.lang.Thread.sleep((prot.time||0)*50);
              if(prot.setFunction)
              	prot.setFunction(packet);
        		}else{
        			AncientWonders.message(packet.entity, prot.activate, wand.bonus, function(player, obj, bonus, name){
        			return TranslationLoad.get("aw.message.wand", [["name", name], ["value", obj[name] - (bonus[name]||0)], ["scroll", Item.getName(spells[i].id)]]);
        		})
        		}
        	}else{
        		PlayerAC.message(packet.entity, TranslationLoad.get("aw.message.wand.not_compatible_with", [["event", Item.getName(extra.getInt("event", 0))],["scroll", Item.getName(spells[i].id)]]));
        	}
        }
			}else{
      	PlayerAC.message(player, TranslationLoad.get("aw.message.need_study", [["name", wand.scrutiny.name]]));
			}
    },
    getName(name, wand, item){
    	return name + item.extra.getString("name", "нет имени")
    },
    installation: function (player, item){
        delItem(player, item);
    }
});
/*IDRegistry.genBlockID("runeBlockAw");
Block.createBlock("runeBlockAw", [ {name: "rune block", texture: [["runeBlockAw", 0]], inCreative: true, renderlayer: 1} ]);
Translation.addTranslation("rune block", {ru: "рунный блок"});
TileEntity.registerPrototype(BlockID.runeBlockAw, {
    init: function(){
        this.blockSource.setBlock(this.x, this.y, this.z, 0, 0);
    }
});
Wands.setPrototype(ItemID.sroll31, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    activate: {
        magic: 15,
        aspects: 50,
        protection: 60
    },
    setFunction: function(packet){
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
        let bs = BlockSource.getDefaultForActor(packet.entity);
        let pos = Entity.getPosition(packet.entity);
        pos = {
            x: (pos.x-.5)+(vel.x*3),
            y: (pos.y-.5)+(vel.y*3),
            z: (pos.z-.5)+(vel.z*3)
        };
        let arr = [];
        if(bs.getBlockId(pos.x, pos.y, pos.z) == 0){
            bs.setBlock(pos.x, pos.y, pos.z, BlockID.runeBlockAw, 0);
            arr.push({x: pos.x, y: pos.y, z: pos.z});
        } 
        if(bs.getBlockId(pos.x, pos.y+1, pos.z) == 0){
            bs.setBlock(pos.x, pos.y+1, pos.z, BlockID.runeBlockAw, 0);
            arr.push({x: pos.x, y: pos.y+1, z: pos.z});
        } 
        if(bs.getBlockId(pos.x, pos.y-1, pos.z) == 0){
            bs.setBlock(pos.x, pos.y-1, pos.z, BlockID.runeBlockAw, 0);
            arr.push({x: pos.x, y: pos.y-1, z: pos.z});
        } 
        setTimeout(function(){
            for(let i in arr){
                if(bs.getBlockId(arr[i].x, arr[i].y, arr[i].z) == BlockID.runeBlockAw) bs.setBlock(arr[i].x, arr[i].y, arr[i].z, 0, 0);
            }
        }, 60);
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});*/
Wands.setPrototype(ItemID.sroll32, {
    type: "function", 
    compatibility: [ItemID.sroll1],
    scrutiny: {
        name: "srollFireProjectile",
        tab: "sroll"
    },
    activate: {
        magic: 30,
        aspects: 30,
        protection: 30
    },
    setFunction: function(packet){
    	let pos = Entity.getPosition(packet.entity);
			let vector = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
			ProjectTileFire.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, vector.x, vector.y, vector.z, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
        //part.deploy(packet.entity, ParticlesAPI.project, Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity)), Entity.getPosition(packet.entity));
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll34, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollFlameStream",
        tab: "sroll"
    },
    activate: {
        magic: 50,
        aspects: 200,
        protection: 40
    },
    setFunction: function(packet){
        for(let i = 0;i <= Math.floor(Math.random()*10)+10;i++){
            let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
            let pos = Entity.getPosition(packet.entity);
            vel.x += Math.random() - Math.random();
            vel.y += Math.random() - Math.random();
            vel.z += Math.random() - Math.random();
            ProjectTileFire.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, vel.x, vel.y, vel.z, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
            //ProjectTileFire.spawnByObject(packet.entity, ParticlesAPI.project, vel, Entity.getPosition(packet.entity));
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll33, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollFirestorm",
        tab: "sroll"
    },
    activate: {
        magic: 35,
        aspects: 200,
        protection: 35
    },
    setFunction: function(packet){
        for(let i = 0;i <= Math.floor(Math.random()*10)+10;i++){
            let pos = Entity.getPosition(packet.entity);
             pos = {
                 x: pos.x + (Math.random()*8 - Math.random()*8),
                 y: pos.y + 20,
                 z: pos.z + (Math.random()*8 - Math.random()*8)
            };
            ProjectTileFire.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, 0, -5, 0, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
        }
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll35, {
    type: "function", 
    compatibility: [ItemID.sroll1], 
    scrutiny: {
        name: "srollstarfall",
        tab: "sroll"
    },
    activate: {
        magic: 70,
        aspects: 200,
        protection: 40
    },
    setFunction: function(packet){
        let pos = Entity.getPosition(packet.entity);
        let vel = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
        for(let i = 0;i<35;i++){
            pos = {
                x: pos.x+(i * vel.x / 2),
                y: pos.y+(i * vel.y / 2),
                z: pos.z+(i * vel.z / 2)
            };
             if(BlockSource.getDefaultForActor(packet.entity).getBlockId(pos.x,pos.y,pos.z)!=0 || i == 50||Entity.getAllInRange(pos, 2)>=1){
                 pos.y+=25;
                 ProjectTileStarfall.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, 0, -6, 0, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100))
                 //starfall.deploy(packet.entity, ParticlesAPI.project2, {x: 0, y: -1.5, z: 0}, pos);
                break;
            }
        }
        
    }, 
    installation: function (player, item){
        delItem(player, item);
    }
});
Wands.setPrototype(ItemID.sroll36, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 1
	},
	setFunction(packet){
		packet.y = (packet.y||0)+packet.item.extra.getInt("mode", -1)
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
})
Wands.setPrototype(ItemID.sroll37, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 1
	},
	setFunction(packet){
		packet.x = (packet.x||0)+packet.item.extra.getInt("mode", -1)
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
})
Wands.setPrototype(ItemID.sroll38, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 1
	},
	setFunction(packet){
		packet.z = (packet.z||0)+packet.item.extra.getInt("mode", -1)
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
})
Wands.setPrototype(ItemID.sroll39, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 5
	},
	setFunction(packet){
		let region = BlockSource.getDefaultForActor(packet.player);
		let block = region.getBlock(packet.coords.x, packet.coords.y, packet.coords.z);
		let tag = region.getBlockEntity(packet.coords.x, packet.coords.y, packet.coords.z);
		if(tag){
			tag = tag.getCompoundTag();
			tag.putListTag("Items", new NBT.ListTag())
		}
		if(region.getBlock(packet.coords.x, packet.coords.y+packet.item.extra.getInt("mode", -1), packet.coords.z).id==0&&block.id!=0){
			region.setBlock(packet.coords.x, packet.coords.y+packet.item.extra.getInt("mode", -1), packet.coords.z, block);
			region.setBlock(packet.coords.x, packet.coords.y, packet.coords.z, 0);
			if(tag)
				region.getBlockEntity(packet.coords.x, packet.coords.y+packet.item.extra.getInt("mode", -1), packet.coords.z).setCompoundTag(tag);
		}
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
})
Wands.setPrototype(ItemID.sroll40, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 5
	},
	setFunction(packet){
		let region = BlockSource.getDefaultForActor(packet.player);
		let block = region.getBlock(packet.coords.x, packet.coords.y, packet.coords.z);
		let tag = region.getBlockEntity(packet.coords.x, packet.coords.y, packet.coords.z);
		if(tag){
			tag = tag.getCompoundTag();
			tag.putListTag("Items", new NBT.ListTag())
		}
		if(region.getBlock(packet.coords.x+packet.item.extra.getInt("mode", -1), packet.coords.y, packet.coords.z).id==0&&block.id!=0){
			region.setBlock(packet.coords.x+packet.item.extra.getInt("mode", -1), packet.coords.y, packet.coords.z, block);
			region.setBlock(packet.coords.x, packet.coords.y, packet.coords.z, 0);
			if(tag)
				region.getBlockEntity(packet.coords.x+packet.item.extra.getInt("mode", -1), packet.coords.y, packet.coords.z).setCompoundTag(tag);
		}
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
})
Wands.setPrototype(ItemID.sroll41, {
	type: "function",
	compatibility: [], 
	activate: {
		magic: 10,
		protection: 10,
		necromancer: 5,
		aspects: 5
	},
	setFunction(packet){
		let region = BlockSource.getDefaultForActor(packet.player);
		let block = region.getBlock(packet.coords.x, packet.coords.y, packet.coords.z);
		let tag = region.getBlockEntity(packet.coords.x, packet.coords.y, packet.coords.z);
		if(tag){
			tag = tag.getCompoundTag();
			tag.putListTag("Items", new NBT.ListTag())
		}
		if(region.getBlock(packet.coords.x, packet.coords.y, packet.coords.z+packet.item.extra.getInt("mode", -1)).id==0&&block.id!=0){
			region.setBlock(packet.coords.x, packet.coords.y, packet.coords.z+packet.item.extra.getInt("mode", -1), block);
			region.setBlock(packet.coords.x, packet.coords.y, packet.coords.z, 0);
			if(tag)
				region.getBlockEntity(packet.coords.x, packet.coords.y, packet.coords.z+packet.item.extra.getInt("mode", -1)).setCompoundTag(tag);
		}
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
  	return name + ", " + TranslationLoad.get("aw.sroll.mode", [["mode", item.extra.getInt("mode", -1)]]);
	}
});

Wands.setPrototype(ItemID.sroll42, {
	type: "function",
	compatibility: [], 
 scrutiny: {
  name: "fog",
  tab: "sroll"
 },
	activate: {
		magic: 15,
		protection: 40,
		necromancer: 0,
		aspects: 200
	},
	setFunction(packet){
		let arr = [];
		let max = randInt(350, 400);
		let pos = Entity.getPosition(packet.entity);
		let group = new ParticlesCore.Group();
		for(let i = 0;i < max;i++)
			group.add(ParticlesAPI.fog, pos.x+(randInt(0, 15)-randInt(0, 15)), pos.y+(randInt(0, 6)-randInt(0, 6)), pos.z+(randInt(0, 15)-randInt(0, 15)));
		group.send(Entity.getDimension(packet.entity));
	},
	installation(player, item){
		delItem(player, item);
	},
});

Network.addClientPacket("aw.illusion", function(obj){
	if(obj.dimension != Player.getDimension()){
		Illusion.clients[obj.pos.x+":"+obj.pos.y+":"+obj.pos.z+":"+obj.dimension] = obj;
		return;
	}
	obj.animation = new Animation.Item(obj.pos.x+.5, obj.pos.y+.5, obj.pos.z+.5);
	obj.animation.describeItem({
		id: obj.block.id,
		data: obj.block.data,
		size: 1
	});
	obj.animation.load();
	Illusion.clients[obj.pos.x+":"+obj.pos.y+":"+obj.pos.z+":"+obj.dimension] = obj;
});
Network.addClientPacket("aw.illusion.delete", function(obj){
	let data = Illusion.clients[obj.pos.x+":"+obj.pos.y+":"+obj.pos.z+":"+obj.dimension];
	if(!data)
		return;
	if(data.animation)
		data.animation.destroy();
	delete Illusion.clients[obj.pos.x+":"+obj.pos.y+":"+obj.pos.z+":"+obj.dimension];
});

Callback.addCallback("ServerPlayerLoaded", function(p){
	Illusion.load(Illusion.blocks);
});

let Illusion = {
	clients: {},
	blocks: {},
	load(scope){
		for(let i in scope){
			let obj = scope[i];
			let region = BlockSource.getDefaultForDimension(obj.dimension)
			this.blocks[this.getKey(obj.pos.x, obj.pos.y, obj.pos.z, region)] = obj;
			this.loadAnimation(obj.pos.x, obj.pos.y, obj.pos.z, region);
		}
	},
	
	loadAnimation(x, y, z, region){
		let obj = this.blocks[this.getKey(x, y, z, region)];
		if(obj){
			Network.sendToAllClients("aw.illusion", obj);
		}
	},
	
	save(scope){
		let obj = {};
		
		let keys = Object.keys(this.blocks);
		for(let i in keys){
			this.blocks[keys[i]].animation = null;
			obj[keys[i]] = this.blocks[keys[i]];
		}
		
		scope.illusion = obj;
	},
	
	add(x, y, z, block, region){
		if(this.blocks[this.getKey(x, y, z, region)])
			return;
		block = block || {};
		this.blocks[this.getKey(x, y, z, region)] = {
			dimension: Number(region.getDimension()),
			pos: {
				x: Number(x),
				y: Number(y),
				z: Number(z)
			},
			block: {
				id: Number(Block.convertBlockToItemId(block.id || 1)),
				data: Number(block.data || 0)
			}
		};
		this.loadAnimation(x, y, z, region);
	},
	getKey(x, y, z, region){
		return x+":"+y+":"+z+":"+region.getDimension();
	},
	del(x, y, z, region){
		let name = this.getKey(x, y, z, region);
		let obj = this.blocks[name];
		if(obj){
			Network.sendToAllClients("aw.illusion.delete", {
				dimension: obj.dimension,
				pos: obj.pos
			});
			delete this.blocks[name];
		}
	}
};

Wands.setPrototype(ItemID.sroll43, {
	type: "function",
	compatibility: [ItemID.sroll2, ItemID.sroll3],
	activate: {
		magic: 60,
		aspects: 100
	},
	setFunction(packet){
		Illusion.add(packet.coords.x, packet.coords.y, packet.coords.z, {
			id: packet.item.extra.getInt("id", 1),
			data: packet.item.extra.getInt("data", 0)
		}, BlockSource.getDefaultForActor(packet.player));
	},
	installation(player, item){
		delItem(player, item);
	},
	getName(name, wand, item){
		item.extra = item.extra || new ItemExtraData();
  	return name + ", " + Item.getName(item.extra.getInt("id", 1), item.extra.getInt("data", 0));
	}
});
Wands.setPrototype(ItemID.sroll44, {
	type: "function",
	compatibility: [ItemID.sroll2, ItemID.sroll3],
	activate: {
		magic: 20,
		aspects: 50
	},
	setFunction(packet){
		Illusion.del(packet.coords.x, packet.coords.y, packet.coords.z, BlockSource.getDefaultForActor(packet.player));
	},
	installation(player, item){
		delItem(player, item);
	}
});

Wands.setPrototype(ItemID.sroll45, {
	type: "function",
	compatibility: [ItemID.sroll1],
	scrutiny: {
		name: "freezing",
		tab: "sroll"
	},
	activate: {
		 magic: 25,
		 aspects: 40,
		 protection: 40
	},
	setFunction(packet){
		let pos = Entity.getPosition(packet.entity);
		let vector = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
		ProjectTileSnow_1.spawn(ParticlesAPI.snowProjectTile, pos.x, pos.y, pos.z, vector.x, vector.y, vector.z, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
	},
	installation(player, item){
		delItem(player, item);
	}
});

Wands.setPrototype(ItemID.sroll46, {
	type: "function",
	compatibility: [ItemID.sroll1],
	scrutiny: {
		name: "snowstorm",
		tab: "sroll"
	},
	activate: {
		 magic: 25,
		 aspects: 60,
		 protection: 50
	},
	setFunction(packet){
		let pos = Entity.getPosition(packet.entity);
		let count = Math.floor(Math.random()*10)+10;
		for(let i = 0;i < count;i++){
			ProjectTileSnow_1.spawn(ParticlesAPI.snowProjectTile, pos.x, pos.y, pos.z, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
		}
	},
	installation(player, item){
		delItem(player, item);
	}
});
Wands.setPrototype(ItemID.madin_tashu, {
	type: "function",
	compatibility: [ItemID.sroll1],
	activate: {
		 magic: 0
	},
	setFunction(packet){
		let pos = Entity.getPosition(packet.entity);
		let count = Math.floor(Math.random()*10)+10;
		for(let i = 0;i < count;i++){
			ProjectTileSnow_1.spawn(madin_tashu, pos.x, pos.y, pos.z, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, (Math.random()-Math.random())*2, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(100));
		}
	},
	installation(player, item){
		delItem(player, item);
	}
});

Wands.setPrototype(ItemID.sroll47, {
	type: "function",
	compatibility: [ItemID.sroll1],
	activate: {
		 magic: 20,
		 protection: 60,
		 aspects: 100
	},
	setFunction(packet){
		let vector = Entity.getLookVectorByAngle(Entity.getLookAngle(packet.entity));
		let pos = Entity.getPosition(packet.entity);
		ProjectTileFireBoom.spawn(ParticlesAPI.ProjectTile, pos.x, pos.y, pos.z, vector.x, vector.y, vector.z, packet.entity, BlockSource.getDefaultForActor(packet.entity), ProjectTile.getMilliseconds(25));
	},
	installation(player, item){
		delItem(player, item);
	}
});