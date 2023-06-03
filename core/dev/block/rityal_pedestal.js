IDRegistry.genBlockID("rityalPedestal");
Block.createBlock("rityalPedestal", [ {name: "aw.block.rityal_pedestal", texture: [["stone", 0]], inCreative: true} ]);

/*IDRegistry.genBlockID("rityalPedestal2");
Block.createBlock("rityalPedestal2", [ {name: "aw.block.rityal_pedestal", texture: [["aw_enchanted_stone", 0]], inCreative: true} ]);*/

RenderAPI.SetAltar(BlockID.rityalPedestal);
MagicCore.setPlaceBlockFunc(BlockID.rityalPedestal, null, null, {name: "ritual"});
RitualAPI.addPedestal(BlockID.rityalPedestal);
TileEntity.registerPrototype(BlockID.rityalPedestal, objectFix(getProtPedestal(1), {
    
    click: function(id, count, data, coords, player) {
    	if(this.blocking) return;
        Game.prevent();
        this.isItem();
        if(this.data.item.id != 0){
            if(id != ItemID.bookk)
                this.drop(player);
        }else{
            if(id != ItemID.bookk){
                let item = Entity.getCarriedItem(player);
                delItem(player, {id:id,data:data,count:count}) ;
                item.count = 1;
                this.animation(item);
            }
        }
    }
}));

/*
pedestal_2.setBlockModel(BlockID.rityalPedestal2);
MagicCore.setPlaceBlockFunc(BlockID.rityalPedestal2, null, null, {name: "ritual"});
TileEntity.registerPrototype(BlockID.rityalPedestal2, {
    defaultValues: {
        item: {
            id: 0,
            data: 0,
            extra: 0
        }
    }, 
    init: function(){
        this.isItem();
        this.animation(this.data.item);
    },
    client: {
        updateModel: function() {
            var id = Network.serverToLocalId(this.networkData.getInt("itemId"));
            var data = this.networkData.getInt("itemData");
            this.model.describeItem({
                id: id,
                count: 1,
                data: data, 
                size: 1
            });
        },
        load: function() {
            this.model = new Animation.Item(this.x + .5, this.y + 1.5, this.z + .5);
            this.updateModel();
            this.model.load();
            var that = this;
            this.networkData.addOnDataChangedListener(function(data, isExternal) {
                that.updateModel();
            });
        },
        unload: function() {
            this.model.destroy();
        }
    },
    animation: function(item){
        this.networkData.putInt("itemId", item.id);
        this.networkData.putInt("itemData", item.data);
        this.networkData.sendChanges();
        this.data.item = {
            id: item.id,
            data: item.data,
            extra: item.extra || new ItemExtraData()
        };
    }, 
    drop: function(player){
        this.networkData.putInt("itemId", 0);
        this.networkData.putInt("itemData", 0);
        this.networkData.sendChanges();
        this.blockSource.spawnDroppedItem(this.x, this.y+1,this.z, this.data.item.id, 1, this.data.item.data, this.data.item.extra || new ItemExtraData());
        this.data.item = {
            id: 0,
            data: 0,
            extra: null
        };
    }, 
    destroyAnimation: function(){
        this.networkData.putInt("itemId", 0);
        this.networkData.putInt("itemData", 0);
        this.networkData.sendChanges();
        this.data.item = {
            id: 0,
            data: 0,
            extra: null
        };
    }, 
    isItem: function(){
        if(!this.data.item) this.data.item = {id: 0, data: 0, extra: null};
        if(!this.data.item.id) this.data.item.id = 0;
        if(!this.data.item.data) this.data.item.data = 0;
        if(!this.data.item.extra) this.data.item.extra = null;
    },
    click: function(id, count, data, coords, player) {
        Game.prevent();
        this.isItem();
        if(this.data.item.id != 0){
            if(id != ItemID.bookk)
                this.drop(player);
        }else{
            if(id != ItemID.bookk){
                let item = Entity.getCarriedItem(player);
                delItem(player, {id:id,data:data,count:count}) ;
                this.animation(item);
            }
        }
    },
    destroyBlock: function(coords, player){
        this.drop();
    }
});*/
