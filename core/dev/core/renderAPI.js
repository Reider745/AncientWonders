let RenderAPILegacy = {
__plantVertex: [
		[0.15, 0, 0.15, 1, 1],
		[0.85, 0, 0.85, 0, 1],
		[0.85, 1, 0.85, 0, 0],
		[0.15, 0, 0.15, 1, 1],
		[0.15, 1, 0.15, 1, 0],
		[0.85, 1, 0.85, 0, 0],
		[0.15, 0, 0.85, 1, 1],
		[0.85, 0, 0.15, 0, 1],
		[0.85, 1, 0.15, 0, 0],
		[0.15, 0, 0.85, 1, 1],
		[0.15, 1, 0.85, 1, 0],
		[0.85, 1, 0.15, 0, 0]
	],
	setPlantModel(id, data, texture, meta){
		let shape = new ICRender.CollisionShape()
		shape.addEntry().addBox(7 / 8, 1, 7 / 8, 1 / 8, 0, 1 / 8)
		BlockRenderer.setCustomCollisionShape(id, data, shape)
		let render = new ICRender.Model()
		let mesh = new RenderMesh()
		mesh.setBlockTexture(texture, meta || 0)
		for(let i = 0; i < 12; i++){
			let poly = this.__plantVertex[i]
			mesh.addVertex(poly[0], poly[1], poly[2], poly[3], poly[4])
		}
		for(let i = 11; i >= 0; i--){
			let poly = this.__plantVertex[i]
			mesh.addVertex(poly[0], poly[1], poly[2], poly[3], poly[4])
		}
		render.addEntry(mesh)
		BlockRenderer.setStaticICRender(id, data, render)
	},
    SetAltar: function (id){
        var render = new ICRender.Model(); 
        var model = BlockRenderer.createModel();  
        render.addEntry(model);
        model.addBox(1/16, 0, 1/16, 15/16, 0.0625, 15/16, 1, 0);
        model.addBox(2/16, 0.0625, 2/16, 14/16, 0.125, 14/16, 1, 0);
        model.addBox(3/16, 0.125, 3/16, 13/16, 1 - 0.0625, 13/16, 1, 0);
        model.addBox(2/16, 1 - 0.0625, 2/16, 14/16, 1, 14/16, 1, 0);
        BlockRenderer.setStaticICRender(id, -1, render);
    }, 
    importOBJ: function (id, texture, obj){
        var mesh = new RenderMesh();
        mesh.importFromFile(__dir__ + "/assets/model/" + obj, "obj", null);
        mesh.setBlockTexture(texture, 0);
        var renderAPI = new ICRender.Model();
        var modelAPI = new BlockRenderer.Model(mesh);  
        renderAPI.addEntry(modelAPI);
        BlockRenderer.setStaticICRender(id, -1, renderAPI); 
    },
    setCauldron: function(id){
        var render = new ICRender.Model(); 
        var model = BlockRenderer.createModel();  
        render.addEntry(model);
        model.addBox(0, 0, 0, 4/16, 2/16, 4/16, "cauldron_side", 0);
        model.addBox(12/16, 0, 12/16, 1, 2/16, 1, "cauldron_side", 0);
        model.addBox(12/16, 0, 0, 1, 2/16, 4/16, "cauldron_side", 0);
        model.addBox(0, 0, 12/16, 4/16, 2/16, 1, "cauldron_side", 0);
        model.addBox(0, 2/16, 0, 1, 3/16, 1, "cauldron_inner", 0);
        model.addBox(0, 3/16, 0, 1, 1, 1/16, "cauldron_side", 0);
        model.addBox(15/16, 3/16, 1/16, 1, 1, 1, "cauldron_side", 0);
        model.addBox(0, 3/16, 0, 1/16, 1, 1, "cauldron_side", 0);
        model.addBox(1/16, 3/16, 15/16, 15/16, 1, 1, "cauldron_side", 0);
        BlockRenderer.setStaticICRender(id, -1, render);
    },
    setMagicController: function(id){
        var render = new ICRender.Model(); 
        var model = BlockRenderer.createModel();  
        model.addBox(7/16, 0, 7/16, 9/16, 14/16, 9/16, 155, 0);
        model.addBox(0, 0, 0, 1, 2/16, 1, 155, 0);
        model.addBox(2/16, 6/16, 2/16, 14/16, 7/16, 14/16, 155, 0);
        model.addBox(4/16, 10/16, 4/16, 12/16, 11/16, 12/16, 155, 0);
        model.addBox(6/16, 14/16, 6/16, 10/16, 18/16, 10/16, 57, 0);
        render.addEntry(model);
        BlockRenderer.setStaticICRender(id, -1, render);
    },
    setResearchTable: function(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(1/16, 0, 1/16, 3/16, 14/16, 3/16, VanillaBlockID.log, 0);
      model.addBox(13/16, 0, 13/16, 15/16, 14/16, 15/16, VanillaBlockID.log, 0);
      model.addBox(13/16, 0, 1/16, 15/16, 14/16, 3/16, VanillaBlockID.log, 0);
      model.addBox(1/16, 0, 13/16, 3/16, 14/16, 15/16, VanillaBlockID.log, 0);
      model.addBox(0, 14/16, 0, 1, 15/16, 1, 5, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setSingularityShrinker: function(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(0, 0, 0, 1, 3/16, 1, 98, 0);
      model.addBox(2/16, 3/16, 2/16, 14/16, 7/16, 14/16, 1, 0);
      model.addBox(4/16, 7/16, 4/16, 12/16, 11/16, 12/16, VanillaBlockID.obsidian, 0);
      model.addBox(6/16, 11/16, 6/16, 10/16, 1, 10/16, VanillaBlockID.obsidian, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setSingularityExtractor: function(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(0, 11/16, 0, 1, 1, 1, 98, 0);
      model.addBox(2/16, 7/16, 2/16, 14/16, 11/16, 14/16, 1, 0);
      model.addBox(4/16, 3/16, 4/16, 12/16, 7/16, 12/16, VanillaBlockID.obsidian, 0);
      model.addBox(6/16, 0, 6/16, 10/16, 3/16, 10/16, VanillaBlockID.obsidian, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setTransmitter: function(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(5/16, 5/16, 5/16, 11/16, 11/16, 11/16, 1, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setEmpty: function(id){
    	var render = new ICRender.Model(); 
      BlockRenderer.setStaticICRender(id, -1, render);
      var model = BlockRenderer.createModel();  
      render.addEntry(model);
    },
    
    setBottomObelisk(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(1/16, 0, 1/16, 15/16, 7/16, 15/16, VanillaBlockID.stonebrick, 0);
      model.addBox(2/16, 7/16, 2/16, 14/16, 13/16, 14/16, id, 0);
      model.addBox(3/16, 13/16, 3/16, 13/16, 16/16, 13/16, VanillaBlockID.stonebrick, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setTopObelisk(id){
    	var render = new ICRender.Model(); 
      var model = BlockRenderer.createModel();  
      model.addBox(3/16, 0, 3/16, 13/16, 2/16, 13/16, VanillaBlockID.stonebrick, 0);
      model.addBox(4/16, 2/16, 4/16, 12/16, 6/16, 12/16, id, 0);
      model.addBox(5/16, 6/16, 5/16, 11/16, 9/16, 11/16, id, 0);
      model.addBox(6/16, 9/16, 6/16, 10/16, 12/16, 10/16, id, 0);
      model.addBox(7/16, 12/16, 7/16, 9/16, 16/16, 9/16, VanillaBlockID.obsidian, 0);
      render.addEntry(model);
      BlockRenderer.setStaticICRender(id, -1, render);
    },
    setItemObelisk(id){
    	let itemModel = ItemModel.getFor(id, 0);
    	let model = BlockRenderer.createModel();
    	model.addBox(1/16, 0, 1/16, 15/16, 7/16, 15/16, VanillaBlockID.stonebrick, 0);
      model.addBox(2/16, 7/16, 2/16, 14/16, 13/16, 14/16, id, 0);
      model.addBox(3/16, 13/16, 3/16, 13/16, 16/16, 13/16, VanillaBlockID.stonebrick, 0);
    	
    	model.addBox(3/16, 0+1, 3/16, 13/16, 2/16+1, 13/16, VanillaBlockID.stonebrick, 0);
      model.addBox(4/16, 2/16+1, 4/16, 12/16, 6/16+1, 12/16, id, 0);
      model.addBox(5/16, 6/16+1, 5/16, 11/16, 9/16+1, 11/16, id, 0);
      model.addBox(6/16, 9/16+1, 6/16, 10/16, 12/16+1, 10/16, id, 0);
      model.addBox(7/16, 12/16+1, 7/16, 9/16, 16/16+1, 9/16, VanillaBlockID.obsidian, 0);
    	itemModel.setModel(model);
    	itemModel.setUiModel(model);
    	itemModel.setHandModel(model);
    }
};
(function(){
	for(let key in RenderAPILegacy)
		RenderAPI[key] = RenderAPILegacy[key];
})();