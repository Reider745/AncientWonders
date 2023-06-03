ModAPI.addAPICallback("ICore", function(api){
	let EU = api.requireGlobal("EU");
	const IC2Config = api.requireGlobal("IC2Config");
	const EnergyTileRegistry = api.requireGlobal("EnergyTileRegistry");
	const SoundManager = api.requireGlobal("SoundManager");
	
	IDRegistry.genBlockID("aw_generator_EU");
	Block.createBlock("aw_generator_EU", [ {name: "aw.block.generator_EU", texture: [["plant", 0]], inCreative: true} ]);
	
	GeneratorIc(null, BlockID.aw_magic_stone).setBlockModel(BlockID.aw_generator_EU);
	RitualAPI.addRecipe("ritual_1", "aw_generator_EU", [BlockID.aw_magic_stone, BlockID.aw_magic_stone, ItemID.magic_crystal, BlockID.aw_magic_stone], {
		id: BlockID.aw_generator_EU,
		data: 0,
		count: 1,
		extra: null
	}, {
		aspects: 1000,
		magic: 10,
		protection: 10
	});
	
	TileEntity.registerPrototype(BlockID.aw_generator_EU, {
		defaultValues: {
			aspect: 0,
			aspectMax: 50
		},
		canReceiveEnergy(){
			return false;
		},
		canExtractEnergy(){
			return true;
		},
		energyTick(type, src){
			if(this.data.aspect >= 1 && src.add(2) == 0)
				this.data.aspect -= 1;
		}
	});
	SingularityAPI.setBlockOutputName(BlockID.aw_generator_EU, "output", true);
	ICRender.getGroup("ic-wire").add(BlockID.aw_generator_EU, -1);
	EnergyTileRegistry.addEnergyTypeForId(BlockID.aw_generator_EU, EU);
	
	IDRegistry.genBlockID("aw_generator_aspect");
	Block.createBlock("aw_generator_aspect", [ {name: "aw.block.aw_generator_aspect", texture: [["plant", 0]], inCreative: true} ]);
	
	GeneratorIc(null, BlockID.aw_enchanted_stone).setBlockModel(BlockID.aw_generator_aspect);
	RitualAPI.addRecipe("ritual_1", "aw_generator_aspect", [BlockID.aw_enchanted_stone, BlockID.aw_enchanted_stone, ItemID.magic_crystal, BlockID.aw_enchanted_stone], {
		id: BlockID.aw_generator_aspect,
		data: 0,
		count: 1,
		extra: null
	}, {
		aspects: 1000,
		magic: 10,
		protection: 10
	});
	
	TileEntity.registerPrototype(BlockID.aw_generator_aspect, {
		defaultValues: {
			aspect: 0,
			aspectMax: 50,
			pos:{x:0,y:0,z:0},
			energy: 0
		},
		canReceiveEnergy(){
			return true;
		},
		canExtractEnergy(){
			return false;
		},
		tick(){
			if(this.data.energy >= 3){
				this.data.energy-=3;
				this.data.aspect+=1;
			}
			SingularityAPI.transfersBlock(this, World.getTileEntity(this.data.pos.x, this.data.pos.y, this.data.pos.z, this.blockSource), 1, base_transfer);
		},
		energyReceive(type, amount, voltage) {
			let maxVoltage = 32;
			if(voltage > maxVoltage){
				if(IC2Config.voltageEnabled){
					this.blockSource.setBlock(this.x, this.y, this.z, 0, 0);
					this.blockSource.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, 2, true); SoundManager.playSoundAtBlock(this, "MachineOverload.ogg", 1, 32);
					this.selfDestroy();
					return 1;
				}
				amount = Math.min(amount, maxVoltage);
			}
			let add = Math.min(amount, 100 - this.data.energy);
			this.data.energy += add;
			return add;
		},
		click(id, count, data, coords, player){
			this.data.pos = SingularityAPI.itemUse(player, Entity.getCarriedItem(player), BlockID.singularity_extract, 10, coords, true);
		}
	});
		ICRender.getGroup("ic-wire").add(BlockID.aw_generator_aspect, -1);
	EnergyTileRegistry.addEnergyTypeForId(BlockID.aw_generator_aspect, EU);
});