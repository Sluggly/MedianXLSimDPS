// CONSTANTS
var GAME_MAX_SPELL_FOCUS = 1000;
var GAME_MAX_MAXIMUM_COLD_RESISTANCE = 90;
var GAME_MAX_MAXIMUM_LIGHTNING_RESISTANCE = 90;
var GAME_MAX_MAXIMUM_POISON_RESISTANCE = 90;
var GAME_MAX_MAXIMUM_FIRE_RESISTANCE = 90;
var GAME_MAX_MAXIMUM_MAGIC_RESISTANCE = 50;
var GAME_MAX_MAXIMUM_PHYSICAL_RESISTANCE = 50;
var GAME_MAX_MAXIMUM_BLOCK_CHANCE = 80;
var GAME_STARTING_MAXIMUM_FIRE_RESISTANCE = 75;
var GAME_STARTING_MAXIMUM_COLD_RESISTANCE = 75;
var GAME_STARTING_MAXIMUM_POISON_RESISTANCE = 75;
var GAME_STARTING_MAXIMUM_LIGHTNING_RESISTANCE = 75;
var GAME_STARTING_MAXIMUM_PHYSICAL_RESISTANCE = 50;
var GAME_STARTING_MAXIMUM_MAGICAL_RESISTANCE = 50;
var GAME_STARTING_MAXIMUM_BLOCK_CHANCE = 50;
var GAME_HELL_FIRE_RESISTANCE_DEBUFF = -70;
var GAME_HELL_COLD_RESISTANCE_DEBUFF = -70;
var GAME_HELL_POISON_RESISTANCE_DEBUFF = -70;
var GAME_HELL_LIGHTNING_RESISTANCE_DEBUFF = -70;
var GAME_MIN_FIRE_RESISTANCE = -100;
var GAME_MIN_COLD_RESISTANCE = -100;
var GAME_MIN_LIGHTNING_RESISTANCE = -100;
var GAME_MIN_POISON_RESISTANCE = -100;
var GAME_MIN_PHYSICAL_RESISTANCE = -100;
var GAME_MIN_MAGICAL_RESISTANCE = -100;
var GAME_FRAME_PER_SECOND = 25;
var GAME_MAX_CHARACTER_LEVEL = 151;
var GAME_MIN_HIT_CHANCE = 5;
var GAME_MAX_HIT_CHANCE = 95;
var GAME_MAX_LIGHTNING_ABSORB = 40;
var GAME_MAX_COLD_ABSORB = 40;
var GAME_MAX_FIRE_ABSORB = 40;

// --- TOOLTIP DISPLAY CONFIGURATION ---
const statConfig = {
    // Attributes
    "Strength": "+%d to Strength",
    "Dexterity": "+%d to Dexterity",
    "Vitality": "+%d to Vitality",
    "Energy": "+%d to Energy",
    "AllAttributesPercent": "+%d% to All Attributes",
    "AllAttributesFlat": "+%d to all Attributes",
    "StrengthPercent": "+%d% to Strength",
    "DexterityPercent": "+%d% to Dexterity",
    "VitalityPercent": "+%d% to Vitality",
    "EnergyPercent": "+%d% to Energy",

    // Base Stats
    "Life": "+%d to Life",
    "Mana": "+%d to Mana",
    "MaxLifePercent": "Maximum Life +%d%",
    "MaxManaPercent": "Maximum Mana +%d%",
    "LifeAfterKill": "+%d Life after each Kill",
    "ManaAfterKill": "+%d Mana after each Kill",
    "LifeOnAttack": "+%d Life on Melee Attack",
    "ManaOnAttack": "+%d Mana on Melee Attack",
    "LifeOnStriking": "+%d Life on Striking",
    "ManaOnStriking": "+%d Mana on Striking",
    "LifeLeech": "%d% Life stolen per Hit",
    "ManaLeech": "%d% Mana stolen per Hit",
    "LifeRegen": "+%d Life Regenerated per Second",
    "ManaRegen": "Regenerate Mana +%d%",

    // Damage
    "MaxDamage": "+%d to Maximum Damage",
    "MinDamage": "+%d to Minimum Damage",
    "FlatDamage": "+%d Damage",
    "EnhancedDamage": "+%d% Enhanced Damage",
    "WeaponPhysicalDamage": "Weapon Physical Damage +%d%",
    
    // Spell Damage
    "SpellDamage": "+%d% to Spell Damage",
    "FireSpellDamage": "+%d% to Fire Spell Damage",
    "ColdSpellDamage": "+%d% to Cold Spell Damage",
    "LightningSpellDamage": "+%d% to Lightning Spell Damage",
    "PoisonSpellDamage": "+%d% to Poison Spell Damage",
    "PhysicalMagicalSpellDamage": "+%d% to Physical/Magic Spell Damage",
    "TriEleDamagePerLevel": "+%d Maximum Tri-Elemental Damage per 5 Character Levels",
    "InnateElementalDamage": "+%d% Innate Elemental Damage",

    // Pierce (Note: Parser extracts positive number, we add '-' here)
    "FirePierce": "-%d% to Enemy Fire Resistance",
    "LightningPierce": "-%d% to Enemy Lightning Resistance",
    "ColdPierce": "-%d% to Enemy Cold Resistance",
    "PoisonPierce": "-%d% to Enemy Poison Resistance",
    "ElementalPierce": "-%d% to Enemy Elemental Resistances",

    // Resists
    "FireResist": "Fire Resist +%d%",
    "ColdResist": "Cold Resist +%d%",
    "LightningResist": "Lightning Resist +%d%",
    "PoisonResist": "Poison Resist +%d%",
    "ElementalResist": "Elemental Resists +%d%",
    "PhysicalResist": "Physical Resist +%d%",
    "MagicalResist": "Magic Resist +%d%",

    // Max Resists
    "MaxFireResist": "Maximum Fire Resist +%d%",
    "MaxColdResist": "Maximum Cold Resist +%d%",
    "MaxLightningResist": "Maximum Lightning Resist +%d%",
    "MaxPoisonResist": "Maximum Poison Resist +%d%",
    "MaxElementalResist": "Maximum Elemental Resists +%d%",

    // Minions
    "MinionLife": "+%d% to Summoned Minion Life",
    "MinionDamage": "+%d% to Summoned Minion Damage",
    "MinionResist": "+%d% to Summoned Minion Resistances",
    "MinionAR": "+%d% to Summoned Minion Attack Rating",

    // Skills
    "AllSkill": "+%d to All Skills",
    "AmazonSkill": "+%d to Amazon Skill Levels",
    "AssassinSkill": "+%d to Assassin Skill Levels",
    "BarbarianSkill": "+%d to Barbarian Skill Levels",
    "DruidSkill": "+%d to Druid Skill Levels",
    "NecromancerSkill": "+%d to Necromancer Skill Levels",
    "PaladinSkill": "+%d to Paladin Skill Levels",
    "SorceressSkill": "+%d to Sorceress Skill Levels",
    "SpellFocus": "+%d Spell Focus",

    // Misc
    "CastSpeed": "+%d% Cast Speed",
    "AttackSpeed": "+%d% Attack Speed",
    "HitRecovery": "+%d% Hit Recovery",
    "BlockSpeed": "+%d% Block Speed",
    "MovementSpeed": "+%d% Movement Speed",
    "BaseBlock": "+%d% Base Block Chance",
    "MagicFind": "+%d% Magic Find",
    "GoldFind": "+%d% Gold Find",
    "ExpGained": "+%d% to Experience Gained",
    "LightRadius": "+%d to Light Radius",
    "PLR": "Poison Length Reduction +%d%",
    "CLR": "Curse Length Reduction +%d%",
    "FlatDamageTaken": "Target Takes Additional Damage of %d",
    "PDRFlat": "Physical Damage Taken Reduced by %d",
    "SlowAttacker": "Slows Attacker by +%d%",
    "SlowTarget": "Slow Target +%d%",
    "RequirementsPercent": "Requirements %d%", // Value is usually negative in data e.g. -20

    // Defense
    "EnhancedDefense": "+%d% Enhanced Defense",
    "BonusDefense": "+%d% Bonus to Defense",
    "FlatDefense": "+%d Defense",

    // Booleans (The value won't be used, just the text)
    "OrbDoubler": "Orb Effects Applied to this Item are Doubled",
    "Indestructible": "Indestructible",
    "CannotBeFrozen": "Cannot Be Frozen",
    "CannotBeRenewed": "Cannot be Renewed",
    "CannotBeCrafted": "Cannot be Crafted",
    "ShrineBlessed": "Shrine Blessed",
    "AlreadyUpgraded": "Already Upgraded",
    "Corrupted": "Corrupted",
    "Ethereal": "Ethereal",
    "HalfFreezeDuration": "Half Freeze Duration",

    // Sockets
    "SocketsFilled": "Socketed (%d",
    "SocketsMax": "/%d)"
};

function computeTotalVitality(character) {
    let finalVitality = 0.0;
    // Base Stats + Attributed with level and Signets of learning
    finalVitality += character.startingVitality + character.attributedVitality;
    return finalVitality;
}

function computeTotalStrength(character) {
    let finalStrength = 0.0;
    // Base Stats + Attributed with level and Signets of learning
    finalStrength += character.startingStrength + character.attributedStrength;
    return finalStrength;
}

function computeTotalDexterity(character) {
    let finalDexterity = 0.0;
    // Base Stats + Attributed with level and Signets of learning
    finalDexterity += character.startingDexterity + character.attributedDexterity;
    return finalDexterity;
}

function computeTotalEnergy(character) {
    let finalEnergy = 0.0;
    // Base Stats + Attributed with level and Signets of learning
    finalEnergy += character.startingEnergy + character.attributedEnergy;
    return finalEnergy;
}

function computeTotalSpellFocus(character) {
    let finalSpellFocus = 0.0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["SpellFocus"] != null) { finalSpellFocus += item.stats["SpellFocus"]; }
        }
    }
    if (finalSpellFocus > GAME_MAX_SPELL_FOCUS) { finalSpellFocus = GAME_MAX_SPELL_FOCUS; }
    return finalSpellFocus;
}

function computeTotalLightningSpellDamage(character) {
    let finalLightningSpellDamage = 0.0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["LightningSpellDamage"] != null) { finalLightningSpellDamage += item.stats["LightningSpellDamage"]; }
            if (item.stats["SpellDamage"] != null) { finalLightningSpellDamage += item.stats["SpellDamage"]; }
        }
    }
    return finalLightningSpellDamage;
}

function computeTotalFireSpellDamage(character) {
    let finalFireSpellDamage = 0.0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["FireSpellDamage"] != null) { finalFireSpellDamage += item.stats["FireSpellDamage"]; }
            if (item.stats["SpellDamage"] != null) { finalFireSpellDamage += item.stats["SpellDamage"]; }
        }
    }
    return finalFireSpellDamage;
}

function computeTotalPoisonSpellDamage(character) {
    let finalPoisonSpellDamage = 0.0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["PoisonSpellDamage"] != null) { finalPoisonSpellDamage += item.stats["PoisonSpellDamage"]; }
            if (item.stats["SpellDamage"] != null) { finalPoisonSpellDamage += item.stats["SpellDamage"]; }
        }
    }
    return finalPoisonSpellDamage;
}

function computeTotalColdSpellDamage(character) {
    let finalColdSpellDamage = 0.0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["ColdSpellDamage"] != null) { finalColdSpellDamage += item.stats["ColdSpellDamage"]; }
            if (item.stats["SpellDamage"] != null) { finalColdSpellDamage += item.stats["SpellDamage"]; }
        }
    }
    return finalColdSpellDamage;
}

function computeTotalPhysicalMagicalSpellDamage(character) {
    let finalPhysicalMagicalSpellDamage = 0.0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["PhysicalMagicalSpellDamage"] != null) { finalPhysicalMagicalSpellDamage += item.stats["PhysicalMagicalSpellDamage"]; }
            if (item.stats["SpellDamage"] != null) { finalPhysicalMagicalSpellDamage += item.stats["SpellDamage"]; }
        }
    }
    return finalPhysicalMagicalSpellDamage;
}

function computeTotalLightningPierce(character) {
    let finalLightningPierce = 0.0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["LightningPierce"] != null) {  finalLightningPierce += item.stats["LightningPierce"]; }
        }
    }
    return finalLightningPierce;
}

function computeTotalFirePierce(character) {
    let finalFirePierce = 0.0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["FirePierce"] != null) {  finalFirePierce += item.stats["FirePierce"]; }
        }
    }
    return finalFirePierce;
}

function computeTotalPoisonPierce(character) {
    let finalPoisonPierce = 0.0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["PoisonPierce"] != null) {  finalPoisonPierce += item.stats["PoisonPierce"]; }
        }
    }
    return finalPoisonPierce;
}

function computeTotalColdPierce(character) {
    let finalColdPierce = 0.0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["ColdPierce"] != null) {  finalColdPierce += item.stats["ColdPierce"]; }
        }
    }
    return finalColdPierce;
}

function computeTotalLife(character) {
    let finalLife = 0.0;
    // Base Stats + Level Scaling
    finalLife += character.startingLife + (character.level-1) * character.lifePerLevel + (character.vitality - character.startingVitality) * character.lifePerVitality;
    // Quests
    if (character.quests.includes("Golden Bird Normal")) { finalLife += 50; }
    if (character.quests.includes("Golden Bird Nightmare")) { finalLife += 50; }
    if (character.quests.includes("Golden Bird Hell")) { finalLife += 50; }
    return finalLife;
}

function computeTotalMana(character) {
    let finalMana = 0.0;
    finalMana = character.startingMana + (character.level-1) * character.manaPerLevel + (character.energy - character.startingEnergy) * character.manaPerEnergy;
    return finalMana;
}

function computeTotalAllSkillLevel(character) {
    let finalAllSkillLevel = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["AllSkill"] != null) { finalAllSkillLevel += item.stats["AllSkill"]; }
        }
    }
    return finalAllSkillLevel;
}

function computeTotalBarbarianSkillLevel(character) {
    let finalBarbarianSkillLevel = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["BarbarianSkill"] != null) { finalBarbarianSkillLevel += item.stats["BarbarianSkill"]; }
        }
    }
    return finalBarbarianSkillLevel;
}

function computeTotalAmazonSkillLevel(character) {
    let finalAmazonSkillLevel = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["AmazonSkill"] != null) { finalAmazonSkillLevel += item.stats["AmazonSkill"]; }
        }
    }
    return finalAmazonSkillLevel;
}

function computeTotalSorceressSkillLevel(character) {
    let finalSorceressSkillLevel = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["SorceressSkill"] != null) { finalSorceressSkillLevel += item.stats["SorceressSkill"]; }
        }
    }
    return finalSorceressSkillLevel;
}

function computeTotalNecromancerSkillLevel(character) {
    let finalNecromancerSkillLevel = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["NecromancerSkill"] != null) { finalNecromancerSkillLevel += item.stats["NecromancerSkill"]; }
        }
    }
    return finalNecromancerSkillLevel;
}

function computeTotalPaladinSkillLevel(character) {
    let finalPaladinSkillLevel = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["PaladinSkill"] != null) { finalPaladinSkillLevel += item.stats["PaladinSkill"]; }
        }
    }
    return finalPaladinSkillLevel;
}

function computeTotalDruidSkillLevel(character) {
    let finalDruidSkillLevel = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["DruidSkill"] != null) { finalDruidSkillLevel += item.stats["DruidSkill"]; }
        }
    }
    return finalDruidSkillLevel;
}

function computeTotalAssassinSkillLevel(character) {
    let finalAssassinSkillLevel = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["AssassinSkill"] != null) { finalAssassinSkillLevel += item.stats["AssassinSkill"]; }
        }
    }
    return finalAssassinSkillLevel;
}

function computeTotalFireResistance(character) {
    let finalFireResistance = 0;
    finalFireResistance += GAME_HELL_FIRE_RESISTANCE_DEBUFF;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["FireResist"] != null) { finalFireResistance += item.stats["FireResist"]; }
            if (item.stats["ElementalResist"] != null) { finalFireResistance += item.stats["ElementalResist"]; }
        }
    }
    if (finalFireResistance < GAME_MIN_FIRE_RESISTANCE) { finalFireResistance = GAME_MIN_FIRE_RESISTANCE; }
    return finalFireResistance;
}

function computeTotalColdResistance(character) {
    let finalColdResistance = 0;
    finalColdResistance += GAME_HELL_COLD_RESISTANCE_DEBUFF;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["ColdResist"] != null) { finalColdResistance += item.stats["ColdResist"]; }
            if (item.stats["ElementalResist"] != null) { finalColdResistance += item.stats["ElementalResist"]; }
        }
    }
    if (finalColdResistance < GAME_MIN_COLD_RESISTANCE) { finalColdResistance = GAME_MIN_COLD_RESISTANCE; }
    return finalColdResistance;
}

function computeTotalPoisonResistance(character) {
    let finalPoisonResistance = 0;
    finalPoisonResistance += GAME_HELL_POISON_RESISTANCE_DEBUFF;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["PoisonResist"] != null) { finalPoisonResistance += item.stats["PoisonResist"]; }
            if (item.stats["ElementalResist"] != null) { finalPoisonResistance += item.stats["ElementalResist"]; }
        }
    }
    if (finalPoisonResistance < GAME_MIN_POISON_RESISTANCE) { finalPoisonResistance = GAME_MIN_POISON_RESISTANCE; }
    return finalPoisonResistance;
}

function computeTotalLightningResistance(character) {
    let finalLightningResistance = 0;
    finalLightningResistance += GAME_HELL_LIGHTNING_RESISTANCE_DEBUFF;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["LightningResist"] != null) { finalLightningResistance += item.stats["LightningResist"]; }
            if (item.stats["ElementalResist"] != null) { finalLightningResistance += item.stats["ElementalResist"]; }
        }
    }
    if (finalLightningResistance < GAME_MIN_LIGHTNING_RESISTANCE) { finalLightningResistance = GAME_MIN_LIGHTNING_RESISTANCE; }
    return finalLightningResistance;
}

function computeTotalPhysicalResistance(character) {
    let finalPhysicalResistance = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["PhysicalResist"] != null) { finalPhysicalResistance += item.stats["PhysicalResist"]; }
        }
    }
    if (finalPhysicalResistance < GAME_MIN_PHYSICAL_RESISTANCE) { finalPhysicalResistance = GAME_MIN_PHYSICAL_RESISTANCE; }
    return finalPhysicalResistance;
}

function computeTotalMagicalResistance(character) {
    let finalMagicalResistance = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["MagicalResist"] != null) { finalMagicalResistance += item.stats["MagicalResist"]; }
        }
    }
    if (finalMagicalResistance < GAME_MIN_MAGICAL_RESISTANCE) { finalMagicalResistance = GAME_MIN_MAGICAL_RESISTANCE; }
    return finalMagicalResistance;
}

function computeTotalMaximumFireResistance(character) {
    let finalMaximumFireResistance = 0;
    finalMaximumFireResistance += GAME_STARTING_MAXIMUM_FIRE_RESISTANCE;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["MaxFireResist"] != null) { finalMaximumFireResistance += item.stats["MaxFireResist"]; }
            if (item.stats["MaxElementalResist"] != null) { finalMaximumFireResistance += item.stats["MaxElementalResist"]; }
        }
    }
    if (finalMaximumFireResistance > GAME_MAX_MAXIMUM_FIRE_RESISTANCE) { finalMaximumFireResistance = GAME_MAX_MAXIMUM_FIRE_RESISTANCE; }
    return finalMaximumFireResistance;
}

function computeTotalMaximumColdResistance(character) {
    let finalMaximumColdResistance = 0;
    finalMaximumColdResistance += GAME_STARTING_MAXIMUM_COLD_RESISTANCE;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["MaxColdResist"] != null) { finalMaximumColdResistance += item.stats["MaxColdResist"]; }
            if (item.stats["MaxElementalResist"] != null) { finalMaximumColdResistance += item.stats["MaxElementalResist"]; }
        }
    }
    if (finalMaximumColdResistance > GAME_MAX_MAXIMUM_COLD_RESISTANCE) { finalMaximumColdResistance = GAME_MAX_MAXIMUM_COLD_RESISTANCE; }
    return finalMaximumColdResistance;
}

function computeTotalMaximumPoisonResistance(character) {
    let finalMaximumPoisonResistance = 0;
    finalMaximumPoisonResistance += GAME_STARTING_MAXIMUM_POISON_RESISTANCE;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["MaxPoisonResist"] != null) { finalMaximumPoisonResistance += item.stats["MaxPoisonResist"]; }
            if (item.stats["MaxElementalResist"] != null) { finalMaximumPoisonResistance += item.stats["MaxElementalResist"]; }
        }
    }
    if (finalMaximumPoisonResistance > GAME_MAX_MAXIMUM_POISON_RESISTANCE) { finalMaximumPoisonResistance = GAME_MAX_MAXIMUM_POISON_RESISTANCE; }
    return finalMaximumPoisonResistance;
}

function computeTotalMaximumLightningResistance(character) {
    let finalMaximumLightningResistance = 0;
    finalMaximumLightningResistance += GAME_STARTING_MAXIMUM_LIGHTNING_RESISTANCE;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["MaxLightningResist"] != null) { finalMaximumLightningResistance += item.stats["MaxLightningResist"]; }
            if (item.stats["MaxElementalResist"] != null) { finalMaximumLightningResistance += item.stats["MaxElementalResist"]; }
        }
    }
    if (finalMaximumLightningResistance > GAME_MAX_MAXIMUM_LIGHTNING_RESISTANCE) { finalMaximumLightningResistance = GAME_MAX_MAXIMUM_LIGHTNING_RESISTANCE; }
    return finalMaximumLightningResistance;
}

function computeTotalMaximumPhysicalResistance(character) {
    let finalMaximumPhysicalResistance = 0;
    finalMaximumPhysicalResistance += GAME_MAX_MAXIMUM_PHYSICAL_RESISTANCE;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["MaxPhysicalResist"] != null) { finalMaximumPhysicalResistance += item.stats["MaxPhysicalResist"]; }
        }
    }
    if (finalMaximumPhysicalResistance > GAME_MAX_MAXIMUM_PHYSICAL_RESISTANCE) { finalMaximumPhysicalResistance = GAME_MAX_MAXIMUM_PHYSICAL_RESISTANCE; }
    return finalMaximumPhysicalResistance;
}

function computeTotalMaximumMagicalResistance(character) {
    let finalMaximumMagicalResistance = 0;
    finalMaximumMagicalResistance += GAME_STARTING_MAXIMUM_MAGICAL_RESISTANCE;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["MaxMagicalResist"] != null) { finalMaximumMagicalResistance += item.stats["MaxMagicalResist"]; }
        }
    }
    if (finalMaximumMagicalResistance > GAME_MAX_MAXIMUM_MAGIC_RESISTANCE) { finalMaximumMagicalResistance = GAME_MAX_MAXIMUM_MAGIC_RESISTANCE; }
    return finalMaximumMagicalResistance;
}

function computeTotalAbsorbFire(character) {
    let finalAbsorbFire = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["AbsorbFire"] != null) { finalAbsorbFire += item.stats["AbsorbFire"]; }
        }
    }
    if (finalAbsorbFire > GAME_MAX_FIRE_ABSORB) { finalAbsorbFire = GAME_MAX_FIRE_ABSORB; }
    return finalAbsorbFire;
}

function computeTotalAbsorbCold(character) {
    let finalAbsorbCold = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["AbsorbCold"] != null) { finalAbsorbCold += item.stats["AbsorbCold"]; }
        }
    }
    if (finalAbsorbCold > GAME_MAX_COLD_ABSORB) { finalAbsorbCold = GAME_MAX_COLD_ABSORB; }
    return finalAbsorbCold;
}

function computeTotalAbsorbLightning(character) {
    let finalAbsorbLightning = 0;
    for (const item of character.equippedItems) {
        if ((item != null)&&(item != [])) {
            if (item.stats["AbsorbLightning"] != null) { finalAbsorbLightning += item.stats["AbsorbLightning"]; }
        }
    }
    if (finalAbsorbLightning > GAME_MAX_LIGHTNING_ABSORB) { finalAbsorbLightning = GAME_MAX_LIGHTNING_ABSORB; }
    return finalAbsorbLightning;
}