class Character {
    constructor(charName, charClass, level) {
        this.charName = charName; // String unique
        this.charClass = charClass; // String equal to: "Amazon","Assassin","Barbarian","Druid","Necromancer","Paladin","Sorceress"
        this.level = level; // Value between 1 and 151
        this.learnedSkills = []; // Map "Name" -> Level
        this.resetStats();
        this.resetGear();
        this.setBaseStats();
    }

    setBaseStats(charClass) {
        if (charClass == "Amazon") {
            this.startingStrength = 25;
            this.startingDexterity = 25;
            this.startingVitality = 20;
            this.startingEnergy = 15;
            this.lifePerLevel = 25;
            this.manaPerLevel = 7.5;
            this.lifePerVitality = 2.25;
            this.manaPerEnergy = 2.25;
            this.startingLife = 70;
            this.startingMana = 15;
            this.startingBlockChance = 3;
        }
        else if (charClass == "Assassin") {
            this.startingStrength = 20;
            this.startingDexterity = 30;
            this.startingVitality = 15;
            this.startingEnergy = 15;
            this.lifePerLevel = 30;
            this.manaPerLevel = 7.5;
            this.lifePerVitality = 2.25;
            this.manaPerEnergy = 2.25;
            this.startingLife = 65;
            this.startingMana = 15;
            this.startingBlockChance = 3;
        }
        else if (charClass == "Barbarian") {
            this.startingStrength = 30;
            this.startingDexterity = 20;
            this.startingVitality = 30;
            this.startingEnergy = 5;
            this.lifePerLevel = 30;
            this.manaPerLevel = 5;
            this.lifePerVitality = 2.75;
            this.manaPerEnergy = 1.5;
            this.startingLife = 80;
            this.startingMana = 5;
            this.startingBlockChance = 0;
        }
        else if (charClass == "Druid") {
            this.startingStrength = 25;
            this.startingDexterity = 20;
            this.startingVitality = 15;
            this.startingEnergy = 25;
            this.lifePerLevel = 25;
            this.manaPerLevel = 10;
            this.lifePerVitality = 2.25;
            this.manaPerEnergy = 3;
            this.startingLife = 65;
            this.startingMana = 25;
            this.startingBlockChance = 3;
        }
        else if (charClass == "Necromancer") {
            this.startingStrength = 15;
            this.startingDexterity = 25;
            this.startingVitality = 20;
            this.startingEnergy = 25;
            this.lifePerLevel = 25;
            this.manaPerLevel = 10;
            this.lifePerVitality = 1.5;
            this.manaPerEnergy = 3;
            this.startingLife = 70;
            this.startingMana = 25;
            this.startingBlockChance = 1;
        }
        else if (charClass == "Paladin") {
            this.startingStrength = 25;
            this.startingDexterity = 20;
            this.startingVitality = 25;
            this.startingEnergy = 15;
            this.lifePerLevel = 32.5;
            this.manaPerLevel = 5;
            this.lifePerVitality = 2.75;
            this.manaPerEnergy = 1.5;
            this.startingLife = 75;
            this.startingMana = 15;
            this.startingBlockChance = 1;
        }
        else if (charClass == "Sorceress") {
            this.startingStrength = 10;
            this.startingDexterity = 25;
            this.startingVitality = 15;
            this.startingEnergy = 35;
            this.lifePerLevel = 35;
            this.manaPerLevel = 10;
            this.lifePerVitality = 2.25;
            this.manaPerEnergy = 2.5;
            this.startingLife = 65;
            this.startingMana = 35;
            this.startingBlockChance = 3;
        }
    }

    resetGear() {
        this.equippedItems = [];
        this.helm = null; // Item slot = "Helm"
        this.weapon1 = null; // Item slot = "Weapon1"
        this.weapon2 = null; // Item slot = "Weapon2"
        this.amulet = null; // Item slot = "Amulet"
        this.bodyArmor = null; // Item slot = "Body Armor"
        this.gloves = null; // Item slot = "Gloves"
        this.belt = null; // Item slot = "Belt"
        this.boots = null; // Item slot = "Boots"
        this.ring1 = null; // Item slot = "Ring1"
        this.ring2 = null; // Item slot = "Ring2"
        this.charms = []; // Array of Item slot = "Charm" (Unique charm name)
        this.relics = []; // Array of Item slot = "Relic" (max size = 3)
        this.quests = []; // Array of Strings in Quest Names
    }

    resetStats() {
        // Base Stats
        this.strength = 0;
        this.dexterity = 0;
        this.vitality = 0;
        this.energy = 0;
        this.attributedStrength = 0;
        this.attributedDexterity = 0;
        this.attributedVitality = 0;
        this.attributedEnergy = 0;
        this.life = 0;
        this.mana = 0;
        this.spellFocus = 0; // Max 1000
        // Skills
        this.allSkillLevel = 0;
        this.barbarianSkillLevel = 0;
        this.sorceressSkillLevel = 0;
        this.amazonSkillLevel = 0;
        this.necromancerSkillLevel = 0;
        this.paladinSkillLevel = 0;
        this.druidSkillLevel = 0;
        this.assassinSkillLevel = 0;
        // Defense Block
        this.defense = 0;
        this.blockChance = 0;
        // Spell Damage
        this.fireSpellDamage = 0;
        this.coldSpellDamage = 0;
        this.lightningSpellDamage = 0;
        this.poisonSpellDamage = 0;
        this.physicalMagicalSpellDamage = 0;
        // Piercing
        this.firePiercing = 0;
        this.coldPiercing = 0;
        this.lightningPiercing = 0;
        this.poisonPiercing = 0;
        // Resists
        this.fireResistance = 0;
        this.coldResistance = 0;
        this.lightningResistance = 0;
        this.poisonResistance = 0;
        this.magicResistance = 0;
        this.physicalResistance = 0;
        // Max Resists
        this.maximumFireResistance = 0; // Max 90
        this.maximumColdResistance = 0; // Max 90
        this.maximumLightningResistance = 0; // Max 90
        this.maximumPoisonResistance = 0; // Max 90
        this.maximumMagicResistance = 0; // Max 50
        this.maximumPhysicalResistance = 0; // Max 50
        // Absorb
        this.fireAbsorb = 0; // Max 40
        this.coldAbsorb = 0; // Max 40
        this.lightningAbsorb = 0; // Max 40
    }

    calculateFinalStats() {
        // Reset stats to base
        this.resetStats();
        // Set Base Character Stats First
        this.setBaseStats(this.charClass);

        // Skill Levels
        this.allSkillLevel = computeTotalAllSkillLevel(this);
        this.barbarianSkillLevel = computeTotalBarbarianSkillLevel(this);
        this.sorceressSkillLevel = computeTotalSorceressSkillLevel(this);
        this.amazonSkillLevel = computeTotalAmazonSkillLevel(this);
        this.necromancerSkillLevel = computeTotalNecromancerSkillLevel(this);
        this.paladinSkillLevel = computeTotalPaladinSkillLevel(this);
        this.druidSkillLevel = computeTotalDruidSkillLevel(this);
        this.assassinSkillLevel = computeTotalAssassinSkillLevel(this);

        // Compute Total Base Stats
        this.strength = computeTotalStrength(this);
        this.dexterity = computeTotalDexterity(this);
        this.vitality = computeTotalVitality(this);
        this.energy = computeTotalEnergy(this);

        this.life = computeTotalLife(this);
        this.mana = computeTotalMana(this);

        // Compute Spell Damage and Piercing
        this.lightningSpellDamage = computeTotalLightningSpellDamage(this);
        this.lightningPiercing = computeTotalLightningPierce(this);
        this.fireSpellDamage = computeTotalFireSpellDamage(this);
        this.firePiercing = computeTotalFirePierce(this);
        this.poisonSpellDamage = computeTotalPoisonSpellDamage(this);
        this.poisonPiercing = computeTotalPoisonPierce(this);
        this.coldSpellDamage = computeTotalColdSpellDamage(this);
        this.coldPiercing = computeTotalColdPierce(this);
        this.physicalMagicalSpellDamage = computeTotalPhysicalMagicalSpellDamage(this);

        // Resists
        this.fireResistance = computeTotalFireResistance(this);
        this.lightningResistance = computeTotalLightningResistance(this);
        this.coldResistance = computeTotalColdResistance(this);
        this.poisonResistance = computeTotalPoisonResistance(this);
        this.physicalResistance = computeTotalPhysicalResistance(this);
        this.magicResistance = computeTotalMagicalResistance(this);

        // Max Resists
        this.maximumFireResistance = computeTotalMaximumFireResistance(this);
        this.maximumColdResistance = computeTotalMaximumColdResistance(this);
        this.maximumPoisonResistance = computeTotalMaximumPoisonResistance(this);
        this.maximumLightningResistance = computeTotalMaximumLightningResistance(this);
        this.maximumPhysicalResistance = computeTotalMaximumPhysicalResistance(this);
        this.maximumMagicResistance = computeTotalMaximumMagicalResistance(this);

        // Absorbs
        this.fireAbsorb = computeTotalAbsorbFire(this);
        this.coldAbsorb = computeTotalAbsorbCold(this);
        this.lightningAbsorb = computeTotalAbsorbLightning(this);

        // Spell Focus
        this.spellFocus = computeTotalSpellFocus(this);
    }

    equipItem(item, slotIndex = 1) {
        if (item.slot == "Helm") { this.helm = item; }
        else if (item.slot == "Weapon1") { this.weapon1 = item; }
        else if (item.slot == "Weapon2") { this.weapon2 = item; }
        else if (item.slot == "Amulet") { this.amulet = item; }
        else if (item.slot == "Body Armor") { this.bodyArmor = item; }
        else if (item.slot == "Gloves") { this.gloves = item; }
        else if (item.slot == "Belt") { this.belt = item; }
        else if (item.slot == "Boots") { this.boots = item; }
        else if (item.slot == "Ring") {
            if (slotIndex === 1) this.ring1 = item;
            else this.ring2 = item;
        }
        else if (item.slot == "Charm") {
            this.charms = this.charms.filter(c => c.name !== item.name);
            this.charms.push(item);
        }
        else if (item.slot == "Relic") {
            this.relics = this.relics.filter(c => c.name !== item.name);
            this.relics.push(item);
        }
        this.updateEquippedItems();
    }

    unequipItem(item) {
        if (this.helm === item) this.helm = null;
        if (this.weapon1 === item) this.weapon1 = null;
        if (this.weapon2 === item) this.weapon2 = null;
        if (this.amulet === item) this.amulet = null;
        if (this.bodyArmor === item) this.bodyArmor = null;
        if (this.gloves === item) this.gloves = null;
        if (this.belt === item) this.belt = null;
        if (this.boots === item) this.boots = null;
        if (this.ring1 === item) this.ring1 = null;
        if (this.ring2 === item) this.ring2 = null;
        
        // Arrays: Filter out the item
        this.charms = this.charms.filter(x => x !== item);
        this.relics = this.relics.filter(x => x !== item);

        this.updateEquippedItems();
    }

    // Add a gem/rune/jewel to an equipped item
    socketItem(slotId, gemItem) {
        let item = this.getItemFromSlot(slotId);
        if (!item) {
            alert("No item equipped in slot: " + slotId);
            return;
        }

        // Check Max Sockets
        let maxSockets = item.stats.SocketsMax || 0;
        if (maxSockets === 0) {
             // Try to infer from existing sockets if max is missing
             if (item.socketed && item.socketed.length > 0) maxSockets = 6; 
             else {
                 alert("This item has no sockets.");
                 return;
             }
        }

        if (!item.socketed) item.socketed = [];
        
        if (item.socketed.length >= maxSockets) {
            alert("Item is fully socketed!");
            return;
        }

        // Clone the gem
        let gemClone = JSON.parse(JSON.stringify(gemItem));

        // --- RESOLVE CONTEXTUAL STATS ---
        // If the gem has contextual stats (Weapon/Armor/Shield), flatten them now based on the target Item type.
        if (gemClone.stats.Weapon || gemClone.stats.Armor || gemClone.stats.Shield) {
            let activeStats = {};
            
            // Logic to determine context
            let context = "Armor"; // Default (Helms, Body, Gloves, Belt, Boots)
            
            if (item.slot === "Weapon1") {
                context = "Weapon";
            }
            else if (item.slot === "Weapon2") {
                // Dual Wield vs Shield check
                if (isTypeOffhand(item.type)) { context = "Shield"; } 
                else { context = "Weapon"; }
            }

            // Apply specific stats
            if (gemClone.stats[context]) { activeStats = gemClone.stats[context]; }
            
            // Overwrite the gem's stats with the resolved flat list
            gemClone.stats = activeStats;
        }
        
        item.socketed.push(gemClone);
        this.calculateFinalStats();
    }

    // Remove a gem/rune/jewel from an equipped item
    unsocketItem(slotId, socketIndex) {
        let item = this.getItemFromSlot(slotId);
        if (!item || !item.socketed) return;

        // Remove the item at the specific index
        item.socketed.splice(socketIndex, 1);
        
        this.calculateFinalStats();
    }

    updateEquippedItems() {
        this.equippedItems = [];
        if (this.helm != null) { this.equippedItems.push(this.helm); }
        if (this.weapon1 != null) { this.equippedItems.push(this.weapon1); }
        if (this.weapon2 != null) { this.equippedItems.push(this.weapon2); }
        if (this.bodyArmor != null) { this.equippedItems.push(this.bodyArmor); }
        if (this.gloves != null) { this.equippedItems.push(this.gloves); }
        if (this.belt != null) { this.equippedItems.push(this.belt); }
        if (this.boots != null) { this.equippedItems.push(this.boots); }
        for (const item in this.equippedItems) {
            if (item.socketed != null) { this.equippedItems.concat(item.socketed); }
        }
        if (this.amulet != null) { this.equippedItems.push(this.amulet); }
        if (this.ring1 != null) { this.equippedItems.push(this.ring1); }
        if (this.ring2 != null) { this.equippedItems.push(this.ring2); }
        this.equippedItems = this.equippedItems.concat(this.charms);
        this.equippedItems = this.equippedItems.concat(this.relics);
    }

    getItemFromSlot(slot) {
        if (slot == "Helm") { return this.helm; }
        else if (slot == "Weapon1") { return this.weapon1; }
        else if (slot == "Weapon2") { return this.weapon2; }
        else if (slot == "Amulet") { return this.amulet; }
        else if (slot == "Body Armor") { return this.bodyArmor; }
        else if (slot == "Gloves") { return this.gloves; }
        else if (slot == "Belt") { return this.belt; }
        else if (slot == "Boots") { return this.boots; }
        else if (slot == "Ring") { return this.ring1; }
        else if (slot == "Ring1") { return this.ring1; }
        else if (slot == "Ring2") { return this.ring2; }
        else if (slot == "Charms") { return this.charms; }
        else if (slot == "Relics") { return this.relics; }
        else { return null };
    }

    addAttributePoints(strength,dexterity,vitality,energy) {
        this.attributedStrength = strength;
        this.attributedDexterity = dexterity;
        this.attributedVitality = vitality;
        this.attributedEnergy = energy;
    }

    setAllQuestsDone() {
        this.setQuestDone("Den of Evil Normal");
        this.setQuestDone("Den of Evil Nightmare");
        this.setQuestDone("Den of Evil Hell");
        this.setQuestDone("Radament Normal");
        this.setQuestDone("Radament Nightmare");
        this.setQuestDone("Radament Hell");
        this.setQuestDone("Lam Esen's Tome Normal");
        this.setQuestDone("Lam Esen's Tome Nightmare");
        this.setQuestDone("Lam Esen's Tome Hell");
        this.setQuestDone("Golden Bird Normal");
        this.setQuestDone("Golden Bird Nightmare");
        this.setQuestDone("Golden Bird Hell");
        this.setQuestDone("Izual Normal");
        this.setQuestDone("Izual Nightmare");
        this.setQuestDone("Izual Hell");
        this.setQuestDone("Anya Normal");
        this.setQuestDone("Anya Nightmare");
        this.setQuestDone("Anya Hell");
    }

    setQuestDone(questName) {
        if (!this.quests.includes(questName)) { this.quests.push(questName); }
    }

    toJSON() {
        return {
            charName: this.charName,
            charClass: this.charClass,
            level: this.level,
            attributes: {
                strength: this.attributedStrength,
                dexterity: this.attributedDexterity,
                vitality: this.attributedVitality,
                energy: this.attributedEnergy
            },
            quests: this.quests,
            items: this.equippedItems.map(item => ({
                name: item.name,
                slot: item.slot,
                type: item.type,
                stats: item.stats,
                socketed: item.socketed
            }))
        };
    }

}

class Enemy {
    constructor(name, life, resists) {
        this.name = name;
        this.life = life;
        this.resists = resists; // Array Fire,Cold,Lightning,Poison,Magical,Physical
    }
}

class Item {
    constructor(name, slot, type, stats, socketed, requiredLevel = 0) {
        this.name = name; // String
        this.slot = slot; // String in "Helm","Weapon1","Weapon2",..."Charm","Relic"
        this.type = type; // String
        this.stats = stats; // Dictionnay StatsName -> Value
        this.socketed = socketed; // Array of item
        this.requiredLevel = requiredLevel; // Int
    }
}

function createCharacter(charName, charClass, level) {
    let character = new Character(charName,charClass,level);
    characterList.push(character);
    return character;
}

function createItem(name, slot, type, stats, socketed, requiredLevel = 0) {
    let item = new Item(name, slot, type, stats, socketed, requiredLevel);
    itemList.push(item);
    return item;
}

function createEnemy(name,life,resists) {
    let enemy = new Enemy(name,life,resists);
    enemyList.push(enemy);
    return enemy;
}

function displayCharacterStats(character) {
    character.calculateFinalStats();
    let characterDiv = document.getElementById("pageCharacter");
    let charNameLevelSpan = document.createElement("span");
    charNameLevelSpan.innerHTML = character.charName + " " + character.charClass + " Level: " + character.level;
    characterDiv.appendChild(charNameLevelSpan);
    characterDiv.appendChild(document.createElement("br"));
    let lifeSpan = document.createElement("span");
    lifeSpan.innerHTML = "Life: " + character.life;
    characterDiv.appendChild(lifeSpan);
    characterDiv.appendChild(document.createElement("br"));
    let manaSpan = document.createElement("span");
    manaSpan.innerHTML = "Mana: " + character.mana;
    characterDiv.appendChild(manaSpan);
    characterDiv.appendChild(document.createElement("br"));
    let strengthSpan = document.createElement("span");
    strengthSpan.innerHTML = "Strength: " + character.strength;
    characterDiv.appendChild(strengthSpan);
    characterDiv.appendChild(document.createElement("br"));
    let dexteritySpan = document.createElement("span");
    dexteritySpan.innerHTML = "Dexterity: " + character.dexterity;
    characterDiv.appendChild(dexteritySpan);
    characterDiv.appendChild(document.createElement("br"));
    let vitalitySpan = document.createElement("span");
    vitalitySpan.innerHTML = "Vitality: " + character.vitality;
    characterDiv.appendChild(vitalitySpan);
    characterDiv.appendChild(document.createElement("br"));
    let energySpan = document.createElement("span");
    energySpan.innerHTML = "Energy: " + character.energy;
    characterDiv.appendChild(energySpan);
    characterDiv.appendChild(document.createElement("br"));
    let lightningSpellDamageSpan = document.createElement("span");
    lightningSpellDamageSpan.innerHTML = "Lightning Spell Damage: " + character.lightningSpellDamage + "%";
    characterDiv.appendChild(lightningSpellDamageSpan);
    characterDiv.appendChild(document.createElement("br"));
    let lightningPiercingSpan = document.createElement("span");
    lightningPiercingSpan.innerHTML = "Enemy Lightning Resistance: -" + character.lightningPiercing + "%";
    characterDiv.appendChild(lightningPiercingSpan);
}

function simDPS(skill, character, enemy) {
    let characterDiv = document.getElementById("pageCharacter");
    characterDiv.appendChild(document.createElement("br"));
    let damageMindFlay = calculDegatSkill(skill,character,enemy);
    let mindFlaySpan = document.createElement("span");
    mindFlaySpan.innerHTML = "Mind Flay: " + damageMindFlay["totalDamageLow"] + "-" + damageMindFlay["totalDamageHigh"];
    characterDiv.appendChild(mindFlaySpan);
}

/**
 * Converts a JSON object into a Character class instance with equipped items.
 */
function loadCharacterFromJSON(data) {
    // Create the Character Instance
    let newChar = createCharacter(data.charName, data.charClass, data.level);

    // Load Attributes
    if (data.attributes) {
        newChar.addAttributePoints(
            data.attributes.strength || 0,
            data.attributes.dexterity || 0,
            data.attributes.vitality || 0,
            data.attributes.energy || 0
        );
    }

    // Load Skills
    if (data.learnedSkills) { newChar.learnedSkills = data.learnedSkills; }

    // Load Quests
    if (data.quests && Array.isArray(data.quests)) {
        data.quests.forEach(quest => newChar.setQuestDone(quest));
    }

    // Create and Equip Items
    if (data.items && Array.isArray(data.items)) {
        let ringCount = 0;
        data.items.forEach(itemData => {
            // Re-create the Item instance
            let tempItem = createItem(
                itemData.name,
                itemData.slot,
                itemData.type, // Note: You might need to update createItem to accept 'type' if it doesn't match perfectly, passing itemData.stats to the 3rd arg based on your constructor
                itemData.stats,
                itemData.socketed
            );

            tempItem.owner = data.charName;
            let finalItem = getOrRegisterItem(tempItem);
            
            if (finalItem.slot === "Ring") {
                ringCount++;
                newChar.equipItem(finalItem, ringCount);
            } 
            else {  newChar.equipItem(finalItem); }
        });
    }

    return newChar;
}

function loadSkillFromJSON(data) {
    // Note: data.baseSkillLevel maps to the 'base' argument in createSkill
    return createSkill(
        data.name, 
        data.charClass, 
        data.tree, 
        data.requirement, 
        data.scaling,
        data.isSpell
    );
}

function loadEnemyFromJSON(data) {
    return createEnemy(data.name, data.life, data.resists);
}

// --- HELPER: Deep Compare Items ---
function areItemsEqual(itemA, itemB) {
    if (!itemA || !itemB) return false;
    if (itemA.name !== itemB.name) return false;
    
    // Check Stats
    if (JSON.stringify(itemA.stats) !== JSON.stringify(itemB.stats)) return false;
    
    // Check Sockets
    // We strictly compare the arrays
    return JSON.stringify(itemA.socketed) === JSON.stringify(itemB.socketed);
}

// --- HELPER: Item Registrar (Single Source of Truth) ---
function getOrRegisterItem(newItem) {
    // 1. Check if this item already exists in the Global Library
    // We access the global variable directly
    let existingItem = globalItemLibrary.find(i => areItemsEqual(i, newItem));

    if (existingItem) {
        // If found, we discard 'newItem' and use the existing one from memory
        // Optional: Update owner if the existing one has no owner
        if ((!existingItem.owner || existingItem.owner === "None") && newItem.owner) {
            existingItem.owner = newItem.owner;
        }
        return existingItem;
    } else {
        // If not found, we register this new item into the library
        // Ensure owner is set
        if (!newItem.owner) newItem.owner = "None";
        globalItemLibrary.push(newItem);
        return newItem;
    }
}