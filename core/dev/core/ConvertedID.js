var ConverteBlock = {
    textToNumeric: function(id){
        let ids = FileTools.ReadJSON(__packdir__ + "innercore/mods/.staticids");
        let Block = ids.id.blocks[id];
        if(!Block){
            Block = parseInt(id);
        }
        return Block;
    },
    NumericToText: function(id){
        let blocks = FileTools.ReadJSON(__packdir__ + "innercore/mods/.staticids");
        blocks = blocks.id.blocks;
        let d;
        if(id >= 8000){
           key = Object.keys(blocks);
           for(i in key){
               let k = key[i];
               if(blocks[k]==id){
                   d = k;
               }
           }
        }else{
            d = id
        }
        return d;
    }
};
var ConverteItem = {
    textToNumeric: function(id){
        let ids = FileTools.ReadJSON(__packdir__ + "innercore/mods/.staticids");
        let item = ids.id.items[id];
        if(!item){
            item = parseInt(id);
        }
        return item;
    },
    NumericToText: function(id){
        let items = FileTools.ReadJSON(__packdir__ + "innercore/mods/.staticids");
        items = items.id.items;
        let d;
        if(id >= 2000 && id <= 8000){
           key = Object.keys(blocks);
           for(i in key){
               let k = key[i];
               if(items[k]==id){
                   d = k;
               }
           }
        }else{
            d = id
        }
        return d;
    }
};
