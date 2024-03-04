IDRegistry.genBlockID("magicController");
Block.createBlock("magicController", [ {name: "aw.block.magic_controller", texture: [["rityalPedestal", 0]], inCreative: true} ]);
RenderAPI.setMagicController(BlockID.magicController);

Block.setDestroyLevel("magicController", 0);
ToolAPI.registerBlockMaterial(BlockID.magicController, "stone", 0, false);

let magicControllerUI = createUI({
    drawing: [
        {type: "text", x: 380, y: 40, text: Translation.translate("aw.block.magic_controller"), font: {color: android.graphics.Color.rgb(1, 1, 1), bold: true, size: 25}}
    ],
    elements: {
        "slot": {type: "slot", x: 450, y: 250, size: 100},
        "text": {type: "text", x: 250, y: 250, width: 400, height: 60, text: "0"}
    }
});

TileEntity.registerPrototype(BlockID.magicController, {
    useNetworkItemContainer: true,
    defaultValues: {
        storage: 0,
        storageMax: 1000,
        active: false,
        i: 0,
        img: 0
    },
    tick: function(){
        if(!this.data.active){
            Mp.spawnParticle(ParticlesAPI.part1, this.x + (Math.random() * 8 - Math.random() * 8), this.y + (Math.random() * 8 - Math.random() * 8), this.z + (Math.random() * 8 - Math.random() * 8), 0, 0, 0, 0, 0, 0, this.dimension);
            this.data.storage++;
            if(this.data.storage >= this.data.storageMax){
                this.data.active = true;
            }
        }else{
            Mp.spawnParticle(ParticlesAPI.part2, this.x+.5, this.y+.6, this.z+.5, 0, .3, 0, 0, 0, 0, this.dimension);
            Mp.spawnParticle(ParticlesAPI.part2, this.x+.5, this.y+.3, this.z+.5, 0, .3, 0, 0, 0, 0, this.dimension);
            this.data.storage--;
            if(this.data.storage <= 0){
                this.data.active = false;
            }
        }
        this.container.setText("text", this.data.storage + "/" + this.data.storageMax);
        let slot = this.container.getSlot("slot");
        let icons = Wands.getIconArr(slot.id);
        this.data.img = icons.length;
        if(slot.id <= 0){
            this.data.i = 0;
            this.data.img = 0;
        }
        if(Wands.stick[slot.id]){
            slot.extra = slot.extra || new ItemExtraData();
            slot.extra.putString("texture", icons[this.data.i].name);
            slot.extra.putInt("meta", icons[this.data.i].meta);
            this.container.setSlot("slot", slot.id, slot.count, slot.data, slot.extra);
        }
        this.container.sendChanges();
    },
    click: function(id, data, count, coords, player){
        if(ScrutinyAPI.isScrutiny(player, "aw", "basics", "MagicController")){
        	Game.prevent();
        let slot = this.container.getSlot("slot");
        if(Wands.stick[slot.id] && id == ItemID.bookk && this.data.storage >= 50){
            this.data.storage -= 50;
            if(this.data.i + 1 << this.data.img){
                this.data.i++;
            }
            if(this.data.i >= this.data.img){
                this.data.i = 0;
            }
        }else if(slot.id == ItemID.SpellSet31 && Wands.getPrototype(id).type == "function" && id != ItemID.SpellSet31 && this.data.storage >= 100){
            if(!Entity.getSneaking(player)){
                slot.extra = slot.extra || new ItemExtraData();
                let item = Entity.getCarriedItem(player);
                /*let id = slot.extra.getInt("id", -1);
                if(id == -1){
                    id = Object.keys(Wands.spellSet).length;
                    slot.extra.putInt("id", id);
                    Wands.spellSet["id"+id] = [];
                }
                Wands.spellSet["id"+id].push(item);*/
                let arr = Wands.getArrByExtra(slot.extra);
                arr.push(item);
                let name = slot.extra.getString("name", "нет имени")
                slot.extra = Wands.getExtraByArr(arr);
                slot.extra.putString("name", name);
            }
        }else if(slot.id == ItemID.SpellSet31 && id == VanillaItemID.name_tag && this.data.storage >= 50 && (!Entity.getSneaking(player))){
            this.data.storage-=50;
            slot.extra = slot.extra || new ItemExtraData();
            let extra = Entity.getCarriedItem(player).extra || new ItemExtraData();
            slot.extra.putString("name", extra.getCustomName() || "нет имени")
            Entity.setCarriedItem(player, id, Entity.getCarriedItem(player).count-1, data, extra);
        }
        if(Entity.getSneaking(player) && slot.id == ItemID.SpellSet31){
            slot.extra = slot.extra || new ItemExtraData();
            /*let id = slot.extra.getInt("id", -1);
            if(id == -1){
                id = Object.keys(Wands.spellSet).length;
                slot.extra.putInt("id", id);
                Wands.spellSet["id"+id] = [];
            }
            if(Wands.spellSet["id"+id].length >= 1){
                let obj = Wands.spellSet["id"+id].pop();
                this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, obj.id, 1, 0, obj.extra || null);
            }*/
            let arr = Wands.getArrByExtra(slot.extra);
            if(arr.length == 0)
              return;
            let obj = arr.pop();
            this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, obj.id, 1, obj.data, obj.extra);
            let name = slot.extra.getString("name", "нет имени")
            slot.extra = Wands.getExtraByArr(arr);
            slot.extra.putString("name", name);
        }
        }else{
            translateMessage(player, "aw.message.need_study", [["name", "MagicController"]]);
        }
    },
    getScreenName: function(player, coords){
        let item = Entity.getCarriedItem(player);
        let slot = this.container.getSlot("slot");
        slot.extra = slot.extra || new ItemExtraData();
        if(item.id != ItemID.bookk && ScrutinyAPI.isScrutiny(player, "aw", "basics", "MagicController")){
            if(!Wands.prot[item.id]){
                return "main";
            }
        } 
        if(Wands.prot[item.id] && item.id != ItemID.SpellSet31 && slot.id == ItemID.SpellSet31 && this.data.storage >= 100){
            this.data.storage -= 100;
            Entity.setCarriedItem(player, item.id, item.count-1, item.data);
        } 
    },
    getScreenByName: function(screenName){
        return magicControllerUI;
    }
});
