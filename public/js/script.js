var characterList = []; // Array containing all user created characters
var itemList = []; // Array containing all user created items
var skillList = []; // Array containing all created skills
var enemyList = []; // Array containing all created enemies

class Character {
    constructor(charName, charClass, level) {
        this.charName = charName; // String unique
        this.charClass = charClass; // String equal to: "Amazon","Assassin","Barbarian","Druid","Necromancer","Paladin","Sorceress"
        this.level = level; // Value between 1 and 150
        this.strength = 0;
        this.dexterity = 0;
        this.vitality = 0;
        this.energy = 0;
        this.life = 0;
        this.mana = 0;
        this.startingStrength = 0;
        this.startingDexterity = 0;
        this.startingVitality = 0;
        this.startingEnergy = 0;
        this.startingLife = 0;
        this.startingMana = 0;
        this.lifePerLevel = 0;
        this.manaPerLevel = 0;
        this.lifePerVitality = 0;
        this.manaPerEnergy = 0;
        this.attributedStrength = 0;
        this.attributedDexterity = 0;
        this.attributedVitality = 0;
        this.attributedEnergy = 0;
        this.spellFocus = 0; // Max 1000
        this.allSkillLevel = 0;
        this.classSkillLevel = 0;
        this.defense = 0;
        this.blockChance = 0;
        this.fireSpellDamage = 0;
        this.coldSpellDamage = 0;
        this.lightningSpellDamage = 0;
        this.poisonSpellDamage = 0;
        this.magicSpellDamage = 0;
        this.physicalSpellDamage = 0;
        this.firePiercing = 0;
        this.coldPiercing = 0;
        this.lightningPiercing = 0;
        this.poisonPiercing = 0;
        this.fireResistance = -70;
        this.coldResistance = -70;
        this.lightningResistance = -70;
        this.poisonResistance = -70;
        this.magicResistance = 0;
        this.physicalResistance = 0;
        this.maximumFireResistance = 75; // Max 90
        this.maximumColdResistance = 75; // Max 90
        this.maximumLightningResistance = 75; // Max 90
        this.maximumPoisonResistance = 75; // Max 90
        this.maximumMagicResistance = 50; // Max 50
        this.maximumPhysicalResistance = 50; // Max 50
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
        }
        else if (charClass == "Paladin") {
            this.startingStrength = 25;
            this.startingDexterity = 20;
            this.startingVitality = 25;
            this.startingEnergy = 15;
            this.lifePerLevel = 32.5; // Exact Sigma 2.5.1
            this.manaPerLevel = 5;
            this.lifePerVitality = 2.75; // Exact Sigma 2.5.1
            this.manaPerEnergy = 1.5;
            this.startingLife = 75;
            this.startingMana = 15;
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
        }
    }

    resetStats() {
        this.strength = 0;
        this.dexterity = 0;
        this.vitality = 0;
        this.energy = 0;
        this.life = 0;
        this.mana = 0;
        this.startingStrength = 0;
        this.startingDexterity = 0;
        this.startingVitality = 0;
        this.startingEnergy = 0;
        this.startingLife = 0;
        this.startingMana = 0;
        this.lifePerLevel = 0;
        this.manaPerLevel = 0;
        this.lifePerVitality = 0;
        this.manaPerEnergy = 0;
        this.attributedStrength = 0;
        this.attributedDexterity = 0;
        this.attributedVitality = 0;
        this.attributedEnergy = 0;
        this.spellFocus = 0;
        this.allSkillLevel = 0;
        this.classSkillLevel = 0;
        this.defense = 0;
        this.blockChance = 0;
        this.fireSpellDamage = 0;
        this.coldSpellDamage = 0;
        this.lightningSpellDamage = 0;
        this.poisonSpellDamage = 0;
        this.magicSpellDamage = 0;
        this.physicalSpellDamage = 0;
        this.firePiercing = 0;
        this.coldPiercing = 0;
        this.lightningPiercing = 0;
        this.poisonPiercing = 0;
        this.fireResistance = -70;
        this.coldResistance = -70;
        this.lightningResistance = -70;
        this.poisonResistance = -70;
        this.magicResistance = 0;
        this.physicalResistance = 0;
        this.maximumFireResistance = 75;
        this.maximumColdResistance = 75;
        this.maximumLightningResistance = 75;
        this.maximumPoisonResistance = 75;
        this.maximumMagicResistance = 50;
    }

    calculateFinalStats() {
        this.resetStats();
        this.setBaseStats(this.charClass);
        this.strength = this.startingStrength + this.attributedStrength;
        this.dexterity = this.startingDexterity + this.attributedDexterity;
        this.vitality = this.startingVitality + this.attributedVitality;
        this.energy = this.startingEnergy + this.attributedEnergy;
        this.calculateFinalLife();
        this.mana = this.startingMana + (this.level-1) * this.manaPerLevel + (this.energy - this.startingEnergy) * this.manaPerEnergy;
        this.calculateTotalItemStats();
    }

    calculateFinalLife() {
        this.life = this.startingLife + (this.level-1) * this.lifePerLevel + (this.vitality - this.startingVitality) * this.lifePerVitality;
        if (this.quests.includes("Golden Bird Normal")) { this.life += 50; }
        if (this.quests.includes("Golden Bird Nightmare")) { this.life += 50; }
        if (this.quests.includes("Golden Bird Hell")) { this.life += 50; }
    }

    calculateTotalItemStats() {
        for (const item of this.equippedItems) {
            if ((item != null)&&(item != [])) {
                if (item.stats["LightningSpellDamage"] != null) {
                    this.lightningSpellDamage += item.stats["LightningSpellDamage"];
                }
                if (item.stats["LightningPierce"] != null) {
                    this.lightningPiercing += item.stats["LightningPierce"];
                }
                if (item.stats["PhysicalSpellDamage"] != null) {
                    this.physicalSpellDamage += item.stats["PhysicalSpellDamage"];
                }
                if (item.stats["SpellDamage"] != null) {
                    this.fireSpellDamage += item.stats["SpellDamage"];
                    this.coldSpellDamage += item.stats["SpellDamage"];
                    this.lightningSpellDamage += item.stats["SpellDamage"];
                    this.poisonSpellDamage += item.stats["SpellDamage"];
                    this.magicSpellDamage += item.stats["SpellDamage"];
                    this.physicalSpellDamage += item.stats["SpellDamage"];
                }
            }
        }
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
            if (!this.charms.some(c => c.name === item.name)) { this.charms.push(item); }
        }
        else if (item.slot == "Relic") {
            if (!this.relics.some(r => r.name === item.name)) { this.relics.push(item); }
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

    updateEquippedItems() {
        this.equippedItems = [];
        if (this.helm != null) { this.equippedItems.push(this.helm); }
        if (this.weapon1 != null) { this.equippedItems.push(this.weapon1); }
        if (this.weapon2 != null) { this.equippedItems.push(this.weapon2); }
        if (this.amulet != null) { this.equippedItems.push(this.amulet); }
        if (this.bodyArmor != null) { this.equippedItems.push(this.bodyArmor); }
        if (this.gloves != null) { this.equippedItems.push(this.gloves); }
        if (this.belt != null) { this.equippedItems.push(this.belt); }
        if (this.boots != null) { this.equippedItems.push(this.boots); }
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
    constructor(name, slot, type, stats, socketed) {
        this.name = name; // String
        this.slot = slot; // String in "Helm","Weapon1","Weapon2",..."Charm","Relic"
        this.type = type; // String
        this.stats = stats; // Dictionnay StatsName -> Value
        this.socketed = socketed; // Array of item
    }
}

class Skill {
    constructor(name, charClass, tree, requirement, scaling, skillLevel, isSpell) {
        this.name = name; // String unique
        this.charClass = charClass; // String
        this.scaling = scaling;
        this.tree = tree;
        this.skillLevel = skillLevel;
        this.requirement = requirement;
        this.isSpell = isSpell;
    }
}

function createCharacter(charName, charClass, level) {
    let character = new Character(charName,charClass,level);
    characterList.push(character);
    return character;
}

function createItem(name, slot, type, stats, socketed) {
    let item = new Item(name, slot, type, stats, socketed);
    itemList.push(item);
    return item;
}

function createSkill(name,charClass,tree,requirement,scaling,base,isSpell) {
    let skill = new Skill(name,charClass,tree,requirement,scaling,base,isSpell);
    skillList.push(skill);
    return skill;
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

function calculDegatSkill(skill, character, enemy) {
    let totalDamageLow = 0.0;
    let totalDamageHigh = 0.0;

    let totalLightningDamageLow = 0.0;
    let totalLightningDamageHigh = 0.0;
    let totalPhysicalDamageLow = 0.0;
    let totalPhysicalDamageHigh = 0.0;

    // Skill Level Scaling
    let totalSkillLevel = skill.skillLevel + character.allSkillLevel + character.classSkillLevel;

    if (skill.scaling["Base"] != null) {
        if (skill.scaling["Base"]["PLB"] != null) {
            totalPhysicalDamageLow = totalPhysicalDamageLow + skill.scaling["Base"]["PLB"] + ((totalSkillLevel-1) * skill.scaling["Base"]["PLS"]);
            totalPhysicalDamageHigh = totalPhysicalDamageHigh + skill.scaling["Base"]["PHB"] + ((totalSkillLevel-1) * skill.scaling["Base"]["PHS"]);
        }
        if (skill.scaling["Base"]["LLB"] != null) {
            totalLightningDamageLow = totalLightningDamageLow + skill.scaling["Base"]["LLB"] + ((totalSkillLevel-1) * skill.scaling["Base"]["LLS"]);
            totalLightningDamageHigh = totalLightningDamageHigh + skill.scaling["Base"]["LHB"] + ((totalSkillLevel-1) * skill.scaling["Base"]["LHS"]);
        }
    }

    // Spell Factor
    if (skill.isSpell) {
        let energy = character.energy;
        let focus = character.spellFocus;
        let energyBonus = (130 * (energy + 20)) / (500 + energy);
        let focusBonus = Math.min(focus / 10.0, 100.0);
        let totalFactor = energyBonus + focusBonus;
        let multiplier = 1 + (totalFactor / 100.0);
        totalLightningDamageLow *= multiplier;
        totalLightningDamageHigh *= multiplier;
        totalPhysicalDamageLow *= multiplier;
        totalPhysicalDamageHigh *= multiplier;
    }

    totalLightningDamageLow = totalLightningDamageLow * (1 + (character.lightningSpellDamage/100.0));
    totalLightningDamageHigh = totalLightningDamageHigh * (1 + (character.lightningSpellDamage/100.0));
    totalPhysicalDamageLow = totalPhysicalDamageLow * (1 + (character.physicalSpellDamage/100.0));
    totalPhysicalDamageHigh = totalPhysicalDamageHigh * (1 + (character.physicalSpellDamage/100.0));

    // Resist Calculation
    let enemyLightRes = enemy.resists[2] - character.lightningPiercing;
    let enemyPhysRes = enemy.resists[5]; // No Physical Spell Piercing
    let effectiveLightRes = Math.max(enemyLightRes, -100);
    let effectivePhysRes = Math.max(enemyPhysRes, -100);

    totalLightningDamageLow = totalLightningDamageLow * (1 - (effectiveLightRes/100.0));
    totalLightningDamageHigh = totalLightningDamageHigh * (1 - (effectiveLightRes/100.0));

    totalPhysicalDamageLow = totalPhysicalDamageLow * (1 - (effectivePhysRes/100.0));
    totalPhysicalDamageHigh = totalPhysicalDamageHigh * (1 - (effectivePhysRes/100.0));

    // Final Damage
    totalDamageLow = totalPhysicalDamageLow + totalLightningDamageLow;
    totalDamageHigh = totalPhysicalDamageHigh + totalLightningDamageHigh;

    return {totalDamageLow,totalDamageHigh};
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
    // 1. Create the Character Instance
    let newChar = createCharacter(data.charName, data.charClass, data.level);

    // 2. Load Attributes
    if (data.attributes) {
        newChar.addAttributePoints(
            data.attributes.strength || 0,
            data.attributes.dexterity || 0,
            data.attributes.vitality || 0,
            data.attributes.energy || 0
        );
    }

    // 3. Load Quests
    if (data.quests && Array.isArray(data.quests)) {
        data.quests.forEach(quest => newChar.setQuestDone(quest));
    }

    // 4. Create and Equip Items
    if (data.items && Array.isArray(data.items)) {
        data.items.forEach(itemData => {
            // Re-create the Item instance
            let newItem = createItem(
                itemData.name,
                itemData.slot,
                itemData.type, // Note: You might need to update createItem to accept 'type' if it doesn't match perfectly, passing itemData.stats to the 3rd arg based on your constructor
                itemData.stats,
                itemData.socketed
            );
            
            // Equip it (This handles slot assignment and pushing to equippedItems array)
            newChar.equipItem(newItem);
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
        data.baseSkillLevel, 
        data.isSpell
    );
}

function loadEnemyFromJSON(data) {
    return createEnemy(data.name, data.life, data.resists);
}