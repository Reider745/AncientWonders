IDRegistry.genItemID("aw_potions_book"); 
Item.createItem("aw_potions_book", "aw.item.aw_potions_book", {name: "book_written", meta: 0}, {stack: 1});
Item.setGlint(ItemID.aw_potions_book, true);

function openUrl(url){
	let openURL = new android.content.Intent(android.content.Intent.ACTION_VIEW);
	openURL.data = android.net.Uri.parse(url);
	UI.getContext().startActivity(openURL);
}

const Text = BookElements.Style.Text;
const Slot = BookElements.Style.Slot;

function getPotionDescription(id, text){
	return [
		new BookElements.Slot([new Slot(id).setSize(1.5)]),
		new BookElements.Text(Translation.translate(Item.getName(id, 0)), new Text().setSize(1.5)),
		new BookElements.Text(text)
	]
}

function ContentLink(link){
	Text.apply(this);
	this.setColor(0, 0, 1);
	this.setUnderline(true);
	this.setSize(1.4);
	this.setLink(link);
}

let PotionsBook = new Book("potions_book")
	.addPage("default", new Page()
		.add(true, "text", "potions_book.name", new Text()
			.setSize(1.9)
		)
		.add(true, "text", "potions_book.telegram", new Text()
			.setColor(0, 0, 1)
			.setUnderline(true)
			.setSize(1.4)
			.setOnClick(function(){
				openUrl("https://t.me/innercoreDungeonCraft")
			})
		)
		.add(true, "text", "potions_book.vk", new Text()
			.setColor(0, 0, 1)
			.setUnderline(true)
			.setSize(1.4)
			.setOnClick(function(){
				openUrl("https://vk.com/horizonmoddingkernel")
			})
		)
		
		.add(false, "text", "potions_book.content", new Text()
			.setSize(2)
		)
		.add(false, "text", "potions_book.page1", new ContentLink("page1"))
		.add(false, "text", "potions_book.page2", new ContentLink("page2"))
		.add(false, "text", "potions_book.page3", new ContentLink("page3"))
		.add(false, "text", "potions_book.page4", new ContentLink("page4"))
		.add(false, "text", "potions_book.page5", new ContentLink("page5"))
		.add(false, "text", "potions_book.page6", new ContentLink("page6"))
		.add(false, "text", "potions_book.page7", new ContentLink("page7"))
		.add(false, "text", "potions_book.page8", new ContentLink("page8"))
		.add(false, "text", "potions_book.page9", new ContentLink("page9"))
		.add(false, "text", "potions_book.page10", new ContentLink("page10"))
		
		.setPreLink("page10")
		.setNextLink("page1")
	)
	
	.addPage("page1", new Page()
		.add(true, "text", "potions_book.types", new Text()
			.setSize(1.5)
		)
		.add(true, "text", "potions_book.type_descriptions")
		
		.addElement(false, function(){
			return getPotionDescription(ItemID.aw_glasses, "potions_book.glasses");
		})
		
		.setPreLink("default")
		.setNextLink("page2")
	)
	
	.addPage("page2", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.aw_brain, "potions_book.brain");
		})
		
		.addElement(false, function(){
			return getPotionDescription(VanillaItemID.gunpowder, "potions_book.gunpowder");
		})
	
		.setPreLink("page1")
		.setNextLink("page3")
	)
	.addPage("page3", new Page()
		.addElement(true, function(){
			return getPotionDescription(VanillaItemID.rabbit_foot, "potions_book.rabbit_foot")
		})
		
		.addElement(false, function(){
			return getPotionDescription(VanillaItemID.sugar, "potions_book.sugar")
		})
		
		.setPreLink("page2")
		.setNextLink("page4")
	)
	.addPage("page4", new Page()
		.addElement(true, function(){
			return getPotionDescription(VanillaItemID.blaze_powder, "potions_book.blaze_powder")
		})
		
		.addElement(false, function(){
			return getPotionDescription(VanillaItemID.spider_eye, "potions_book.spider_eye")
		})
		
		.setPreLink("page3")
		.setNextLink("page5")
	)
	.addPage("page5", new Page()
		.addElement(true, function(){
			return getPotionDescription(VanillaItemID.redstone, "potions_book.redstone")
		})
		
		.addElement(false, function(){
			return getPotionDescription(VanillaItemID.glowstone_dust, "potions_book.glowstone_dust")
		})
		
		.setPreLink("page4")
		.setNextLink("page6")
	)
	.addPage("page6", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.dead_essence, "potions_book.dead_essence")
		})
		
		.addElement(false, function(){
			return getPotionDescription(ItemID.crystal_powder, "potions_book.crystal_powder")
		})
		
		.setPreLink("page5")
		.setNextLink("page7")
	)
	.addPage("page7", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.witherbone, "potions_book.witherbone")
		})
		
		.addElement(false, function(){
			return getPotionDescription(ItemID.aw_dragon_powder, "potions_book.aw_dragon_powder")
		})
		
		.setPreLink("page6")
		.setNextLink("page8")
	)
	.addPage("page8", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.aw_petal_powder, "potions_book.aw_petal_powder")
		})
		
		.addElement(false, function(){
			return getPotionDescription(ItemID.magic_crystal, "potions_book.magic_crystal")
		})
		
		.setPreLink("page7")
		.setNextLink("page9")
	)
	.addPage("page9", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.enchantment_forest_flower, "potions_book.enchantment_forest_flower")
		})
		.addElement(false, function(){
			return getPotionDescription(ItemID.aw_mysterious_powder, "potions_book.aw_mysterious_powder")
		})
		
		.setPreLink("page8")
		.setNextLink("page10")
	)
	.addPage("page10", new Page()
		.addElement(true, function(){
			return getPotionDescription(ItemID.spider_legs, "potions_book.spider_legs")
		})
		
		.setPreLink("page9")
		.setNextLink("default")
	)
	.registerItem(ItemID.aw_potions_book);