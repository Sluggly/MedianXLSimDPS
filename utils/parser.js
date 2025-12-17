var helmList = ["Cap" ,"Skull Cap","Helm","Full Helm","Great Helm","Crown","Circlet","Coronet","Tiara","Diadem","Mask","Bone Helm","Morion","Cervelliere","Einherjar Helm","Spangenhelm","Jawbone Cap","Fanged Helm","Horned Helm","Assault Helmet","Avenger Guard","Wolf Head","Hawk Helm","Antlers","Falcon Mask","Spirit Mask","Hundsgugel","Blackguard Helm"];
var bodyArmorList = ["Quilted Armor" ,"Leather Armor","Hard Leather Armor","Studded Leather","Ring Mail","Scale Mail","Chain Mail","Breast Plate","Splint Mail","Plate Mail","Field Plate","Light Plate","Gothic Plate","Full Plate Mail","Ancient Armor","Gambeson","Kazarghand","Lamellar Armor","Banded Plate","Ceremonial Armor"];
var bootsList = ["Boots" ,"Heavy Boots","Chain Boots","Light Plated Boots","Greaves"];
var glovesList = ["Leather Gloves" ,"Heavy Gloves","Chain Gloves","Light Gauntlets","Gauntlets","Soulbinder Gloves"];
var beltList = ["Sash" ,"Light Belt","Belt","Heavy Belt","Plated Belt"];
var weaponList = ["Flying Kinzhal", "Voidsworn Bow", "Kukri","Short Sword" ,"Scimitar","Saber","Falchion","Broad Sword","Long Sword","War Sword","Two-Handed Sword","Claymore","Giant Sword","Bastard Sword","Flamberge","Great Sword","Crystal Sword","Hand Axe","Axe","Double Axe","Military Pick","War Axe","Large Axe","Broad Axe","Battle Axe","Great Axe","Giant Axe","Club","Spiked Club","Mace","Morning Star","Flail","War Hammer","Maul","Great Maul","Scepter","Grand Scepter","War Scepter","Javelin","Pilum","Short Spear","Glaive","Throwing Spear","Spear","Trident","Brandistock","Spetum","Pike","Scythe","Dagger","Dirk","Kriss","Blade","Throwing Knife","Flying Knife","Balanced Knife","Throwing Axe","Balanced Axe","Short Staff","Long Staff","Gnarled Staff","Battle Staff","War Staff","Short Bow","Hunter's Bow","Long Bow","Composite Bow","Short Battle Bow","Long Battle Bow","Short War Bow","Long War Bow","Light Crossbow","Crossbow","Heavy Crossbow","Repeating Crossbow","Stag Bow","Reflex Bow","Maiden Spear","Maiden Pike","Maiden Javelin","Katar","Wrist Blade","Hatchet Hands","Cestus","Claws","Blade Talons","Scissors Katar","Halberd","Naginata","Spatha","Backsword","Ida","Bronze Sword","Kriegsmesser","Mammen Axe","Hammerhead Axe","Ono","Valaska","Labrys","Compound Bow","Serpent Bow","Maple Bow","Viper Bow","Recurve Bow","Flamen Staff","Raptor Scythe","Bonesplitter","Marrow Staff","Hexblade","Spirit Edge","Needle Crossbow","Dart Thrower","Stinger Crossbow","Trebuchet","Wand","Yew Wand","Bone Wand","Grim Wand","Bonebreaker","Goedendag","Angel Star","Hand of God","Holy Lance","Tepoztopilli","Eagle Orb","Sacred Globe","Smoked Sphere","Clasped Orb","Jared's Stone","Warp Blade","Tyrannical Blade","Voidforged Staff"];
var offhandList = ["Buckler" ,"Small Shield","Large Shield","Kite Shield","Tower Shield","Gothic Shield","Bone Shield","Spiked Shield","Athulua's Hand","Phoenix Shield","Setzschild","Parma","Aspis","Totem Shield","Bladed Shield","Bull Shield","Bronze Shield","Gilded Shield","Preserved Head","Zombie Head","Unraveller Head","Gargoyle Head","Demon Head","Targe","Rondache","Heraldic Shield","Aerin Shield","Crown Shield","Arrow Quiver","Quiver"];
var miscList = ["Ghost Trance", "Tenet of Judgement", "Pulsating Worldstone Shard", "Mark of Victory", "Empyrean Touch", "Arcane Hunger", "Gem", "Stash O' Treasures", "Corrupted Treasure", "Arcane Crystal", "Mephisto's Soulstone", "Golden Cycle", "Belladonna Extract", "Path of Brutality", "Oil", "Elemental Rune", "Dulra Fruit", "Dimensional Link", "Wirt's Other Leg", "Rune", "Reality Piercer", "Mark of Infusion", "Item Design", "Emblem", "Corrupted Cluster", "Dye", "Cycle", "Custom Signet", "Wirt's Leg", "Soulforge", "Scroll of Summoning", "Shrine","Positronic Brain","Corrupted Shards","Apple","Potion" ,"Arcane Cluster","Arcane Shards","Catalyst","Container of Knowledge","Horadric Cube","Pulsating Worldstone Crystal","Whisper of the Damned","Barrel","Breath of Thaumaturgy","Celestial Wind","Crate O' Souls","Dream Fragment","Elemental Dominion","Elemental Ire","Enchanted Rune","Essence","Gem Cluster","Key","Northern Winds","Riftstone","Rune Container","Scroll","Shrine Vessel","Sigil of Absolution","Signet","Soulforged Mystic Orb","Star Chart","UMO","Whisper of the Damned","Wings of the Departed"];
var ringList = ["Ring","Assur's Bane", "Sigil of Deadly Sins"];
var amuletList = ["Amulet"];
var gemList = ["Perfect Ruby", "Perfect Diamond", "Perfect Amethyst", "Perfect Topaz", "Perfect Emerald", "Perfect Sapphire", "Perfect Skull", "Perfect Onyx", "Perfect Turquoise", "Perfect Bloodstone", "Perfect Amber", "Perfect Rainbow Stone"];
var jewelList = ["Jewel"];
var runeList = ["El Rune", "Eld Rune", "Tir Rune", "Nef Rune", "Eth Rune","Ith Rune","Tal Rune","Ral Rune","Ort Rune","Thul Rune","Amn Rune","Sol Rune","Shael Rune","Dol Rune","Hel Rune","Io Rune","Lum Rune","Ko Rune","Fal Rune","Lem Rune","Pul Rune","Um Rune","Mal Rune","Ist Rune","Gul Rune","Vex Rune","Ohm Rune","Lo Rune","Sur Rune","Ber Rune","Jah Rune","Cham Rune","Zod Rune","Ol Rune","Elq Rune","Tyr Rune","Nif Rune","Xeth Rune","Xith Rune","Thal Rune","Rhal Rune","Urt Rune","Tuul Rune","Ahmn Rune","Zol Rune","Shaen Rune","Doj Rune","Hem Rune","Iu Rune","Lux Rune","Ka Rune","Fel Rune","Lew Rune","Phul Rune","Un Rune","Mhal Rune","Yst Rune","Gur Rune","Vez Rune","Ohn Rune","Loz Rune","Zur Rune","Bur Rune","Iah Rune","Yham Rune","Xod Rune","Taha Rune","Ghal Rune","Qor Rune","Fire Rune","Stone Rune","Arcane Rune","Poison Rune","Light Rune","Ice Rune"];
const allItemTypes = [...helmList, ...bodyArmorList, ...bootsList, ...glovesList, ...beltList, ...weaponList, ...offhandList, ...miscList, ...ringList, ...amuletList, ...jewelList, ...gemList, ...runeList];

const ignoreMappings = [
    /Required Level: \d+/i,
    /Required Strength: \d+/i,
    /Required Dexterity: \d+/i,
    /Prefixes: \d+/i,
    /Suffixes: \d+/i,
    /Defense: \d+/i,
    /Durability: \d+/i,
    /Quantity: \d+/i,
    /\(Paladin Only\)/i,
    /\(Amazon Only\)/i,
    /\(Sorceress Only\)/i,
    /\(Necromancer Only\)/i,
    /\(Barbarian Only\)/i,
    /\(Druid Only\)/i,
    /\(Assassin Only\)/i,
    /\(Stackable\)/i,
    /Quest Item/i,
    /Cannot be Renewed/i,
    /Cannot be Crafted/i,
    /Keep in Inventory to Gain Bonus/i,
    /Socketed \(\d+\/\d+\)/i,
    /Right-Click to/i,
    /Can be Inserted into/i,
    /You cannot move/i,
    /Cube with/i,
    /Ethereal/i,
    /Transmute/i,
    /Cube Reagent/i,
    /Indestructible/i,
    /Difficulty Level:/i,
    /Area Level:/i,
    /Reward:/i,
    /Bonus Quest/i,
    /Keep in Inventory to Gain Bonus/i,
    /Charges:/i,
    /Gold Cost:/i
];

const statMappings = [
    // --- Attributes ---
    { regex: /\+(\d+) to Strength/i, key: "Strength" },
    { regex: /\+(\d+) to Dexterity/i, key: "Dexterity" },
    { regex: /\+(\d+) to Vitality/i, key: "Vitality" },
    { regex: /\+(\d+) to Energy/i, key: "Energy" },
    { regex: /\+(\d+) to all Attributes/i, type: "multi", keys: ["Strength", "Dexterity", "Vitality", "Energy"] },
    { regex: /\+(\d+)% to All Attributes/i, type: "multi", keys: ["StrengthPercent", "DexterityPercent", "VitalityPercent", "EnergyPercent"] },
    { regex: /\+(\d+)% to Strength/i, key: "StrengthPercent" },
    { regex: /\+(\d+)% to Dexterity/i, key: "DexterityPercent" },
    { regex: /\+(\d+)% to Vitality/i, key: "VitalityPercent" },
    { regex: /\+(\d+)% to Energy/i, key: "EnergyPercent" },
    
    // --- Life & Mana ---
    { regex: /\+(\d+) to Life/i, key: "Life" },
    { regex: /\+(\d+) to Mana/i, key: "Mana" },
    { regex: /Maximum Life \+(\d+)%/i, key: "MaxLifePercent" },
    { regex: /Maximum Mana \+(\d+)%/i, key: "MaxManaPercent" },
    { regex: /\+(\d+) Life after each Kill/i, key: "LifeAfterKill" },
    { regex: /\+(\d+) Mana after each Kill/i, key: "ManaAfterKill" },
    { regex: /\+(\d+) Life on Melee Attack/i, key: "LifeOnAttack" },
    { regex: /\+(\d+) Mana on Melee Attack/i, key: "ManaOnAttack" },
    { regex: /\+(\d+) Life on Striking/i, key: "LifeOnStriking" },
    { regex: /\+(\d+) Mana on Striking/i, key: "ManaOnStriking" },
    { regex: /\+(\d+)% Life stolen per Hit/i, key: "LifeLeech" },
    { regex: /\+(\d+)% Mana stolen per Hit/i, key: "ManaLeech" },
    { regex: /\+(\d+) Life Regenerated per Second/i, key: "LifeRegen" },
    { regex: /Regenerate Mana \+(\d+)%/i, key: "ManaRegen" },
    { regex: /Maximum Life and Mana \+?([+-]?\d+)%/i, type: "multi", keys: ["MaxLifePercent", "MaxManaPercent"] },
    { regex: /([+-]?\d+)% Weapon Damage Taken Restores Mana/i, key: "DamageTakenGoesToMana" },

    // --- Damage ---
    { regex: /One-Hand Damage: (\d+) to (\d+)/i, type: "range", minKey: "OneHandMinDamage", maxKey: "OneHandMaxDamage" },
    { regex: /Two-Hand Damage: (\d+) to (\d+)/i, type: "range", minKey: "TwoHandMinDamage", maxKey: "TwoHandMaxDamage" },
    { regex: /Throw Damage: (\d+) to (\d+)/i, type: "range", minKey: "ThrowMinDamage", maxKey: "ThrowMaxDamage" },
    { regex: /\+(\d+) to Maximum Damage/i, key: "MaxDamage" },
    { regex: /\+(\d+) to Minimum Damage/i, key: "MinDamage" },
    { regex: /\+(\d+) Damage/i, key: "FlatDamage" },
    { regex: /\+(\d+)% Enhanced Damage/i, key: "EnhancedDamage" },
    { regex: /Weapon Physical Damage \+(\d+)%/i, key: "WeaponPhysicalDamage" },
    { regex: /([+-]?\d+)% Bonus to Attack Rating/i, key: "AttackRatingPercent" },
    { regex: /([+-]?\d+)% Chance of Crushing Blow/i, key: "CrushingBlow" },
    { regex: /([+-]?\d+)% Deadly Strike/i, key: "DeadlyStrike" },
    { regex: /([+-]?\d+)% Damage to Undead/i, key: "DamageToUndead" },
    { regex: /([+-]?\d+)% Damage to Demons/i, key: "DamageToDemons" },

    // --- Elemental Adds ---
    { regex: /Adds (\d+)-(\d+) Fire Damage/i, type: "range", minKey: "MinFireDamage", maxKey: "MaxFireDamage" },
    { regex: /Adds (\d+)-(\d+) Lightning Damage/i, type: "range", minKey: "MinLightningDamage", maxKey: "MaxLightningDamage" },
    { regex: /Adds (\d+)-(\d+) Cold Damage/i, type: "range", minKey: "MinColdDamage", maxKey: "MaxColdDamage" },
    { regex: /Adds (\d+)-(\d+) Magic Damage/i, type: "range", minKey: "MinMagicDamage", maxKey: "MaxMagicDamage" },
    { regex: /Adds (\d+)-(\d+) Damage/i, type: "range", minKey: "MinPhysicalDamage", maxKey: "MaxPhysicalDamage" },
    { regex: /\+(\d+) Maximum Tri-Elemental Damage per 5 Character Levels/i, key: "TriEleDamagePerFiveLevel" }, 
    { regex: /\+(\d+)% Innate Elemental Damage/i, key: "InnateElementalDamage" },
    { regex: /Innate Lightning Damage: .*?\((\d+(?:\.\d+)?)% of Dexterity\)/i, key: "IEDLightningDex" },
    { regex: /Innate Fire Damage: .*?\((\d+(?:\.\d+)?)% of Strength\)/i, key: "IEDFireStr" },
    { regex: /Innate Cold Damage: .*?\((\d+(?:\.\d+)?)% of Dexterity\)/i, key: "IEDColdDex" },
    { regex: /Innate .*? Damage: .*?\((\d+(?:\.\d+)?)% of Vitality\)/i, key: "IEDVitality" },
    
    // --- Spell Damage ---
    { regex: /([+-]?\d+)% to Spell Damage/i, type: "multi", keys: ["FireSpellDamage", "ColdSpellDamage", "LightningSpellDamage", "PoisonSpellDamage", "PhysicalMagicalSpellDamage"] },
    { regex: /([+-]?\d+)% to Fire Spell Damage/i, key: "FireSpellDamage" },
    { regex: /([+-]?\d+)% to Cold Spell Damage/i, key: "ColdSpellDamage" },
    { regex: /([+-]?\d+)% to Lightning Spell Damage/i, key: "LightningSpellDamage" },
    { regex: /([+-]?\d+)% to Poison Spell Damage/i, key: "PoisonSpellDamage" },
    { regex: /([+-]?\d+)% to Physical\/Magic Spell Damage/i, key: "PhysicalMagicalSpellDamage" },
    { regex: /\+(\d+) Spell Focus/i, key: "SpellFocus" },

    // --- Pierce ---
    { regex: /-(\d+)% to Enemy Fire Resistance/i, key: "FirePierce" },
    { regex: /-(\d+)% to Enemy Lightning Resistance/i, key: "LightningPierce" },
    { regex: /-(\d+)% to Enemy Cold Resistance/i, key: "ColdPierce" },
    { regex: /-(\d+)% to Enemy Poison Resistance/i, key: "PoisonPierce" },
    { regex: /-(\d+)% to Enemy Elemental Resistances/i, type: "multi", keys: ["FirePierce", "ColdPierce", "LightningPierce", "PoisonPierce"] },

    // --- Max Resists ---
    { regex: /Maximum Fire Resist ([+-]?\d+)%/i, key: "MaxFireResist" },
    { regex: /Maximum Cold Resist ([+-]?\d+)%/i, key: "MaxColdResist" },
    { regex: /Maximum Lightning Resist ([+-]?\d+)%/i, key: "MaxLightningResist" },
    { regex: /Maximum Poison Resist ([+-]?\d+)%/i, key: "MaxPoisonResist" },
    { regex: /Maximum Elemental Resists ([+-]?\d+)%/i, type: "multi", keys: ["MaxFireResist", "MaxColdResist", "MaxLightningResist", "MaxPoisonResist"] },

    // --- Resists ---
    { regex: /Fire Resist ([+-]?\d+)%/i, key: "FireResist" },
    { regex: /Cold Resist ([+-]?\d+)%/i, key: "ColdResist" },
    { regex: /Lightning Resist ([+-]?\d+)%/i, key: "LightningResist" },
    { regex: /Poison Resist ([+-]?\d+)%/i, key: "PoisonResist" },
    { regex: /Elemental Resists ([+-]?\d+)%/i, type: "multi", keys: ["FireResist", "ColdResist", "LightningResist", "PoisonResist"] },
    { regex: /Physical Resist ([+-]?\d+)%/i, key: "PhysicalResist" },
    { regex: /Magic Resist ([+-]?\d+)%/i, key: "MagicalResist" },

    // --- Minions ---
    { regex: /\+(\d+)% to Summoned Minion Life/i, key: "MinionLife" },
    { regex: /\+(\d+)% to Summoned Minion Damage/i, key: "MinionDamage" },
    { regex: /\+(\d+)% to Summoned Minion Resistances/i, key: "MinionResist" },
    { regex: /\+(\d+)% to Summoned Minion Attack Rating/i, key: "MinionAR" },
    { regex: /([+-]?\d+)% Bonus to Summoned Edyrem Life/i, key: "EdyremLife" },

    // --- Absorb ---
    { regex: /Fire Absorb ([+-]?\d+)%/i, key: "AbsorbFire" },
    { regex: /Cold Absorb ([+-]?\d+)%/i, key: "AbsorbCold" },
    { regex: /Lightning Absorb ([+-]?\d+)%/i, key: "AbsorbLightning" },

    // --- Skills ---
    { regex: /\+(\d+) to All Skills/i, key: "AllSkill" },
    { regex: /\+(\d+) to Amazon Skill Levels/i, key: "AmazonSkill" },
    { regex: /\+(\d+) to Assassin Skill Levels/i, key: "AssassinSkill" },
    { regex: /\+(\d+) to Barbarian Skill Levels/i, key: "BarbarianSkill" },
    { regex: /\+(\d+) to Druid Skill Levels/i, key: "DruidSkill" },
    { regex: /\+(\d+) to Necromancer Skill Levels/i, key: "NecromancerSkill" },
    { regex: /\+(\d+) to Paladin Skill Levels/i, key: "PaladinSkill" },
    { regex: /\+(\d+) to Sorceress Skill Levels/i, key: "SorceressSkill" },
    { regex: /\+(\d+)% Cast Speed/i, key: "CastSpeed" },
    { regex: /([+-]?\d+)% Attack Speed/i, key: "AttackSpeed" },
    { regex: /\+(\d+)% Hit Recovery/i, key: "HitRecovery" },
    { regex: /\+(\d+)% Block Speed/i, key: "BlockSpeed" },
    { regex: /\+(\d+)% Movement Speed/i, key: "MovementSpeed" },
    { regex: /([+-]?\d+)% Combat Speeds/i, type: "multi", keys: ["AttackSpeed", "CastSpeed", "HitRecovery", "BlockSpeed"] },
    { regex: /([+-]?\d+)% Base Block Chance/i, key: "BaseBlock" },
    { regex: /([+-]?\d+)% Magic Find/i, key: "MagicFind" },
    { regex: /([+-]?\d+)% Gold Find/i, key: "GoldFind" },
    { regex: /([+-]?\d+)% Experience Gained/i, key: "ExpGained" },
    { regex: /([+-]?\d+)% to Experience Gained/i, key: "ExpGained" },
    { regex: /([+-]?\d+) to Light Radius/i, key: "LightRadius" },
    { regex: /Poison Length Reduction \+(\d+)%/i, key: "PLR" },
    { regex: /Curse Length Reduction \+(\d+)%/i, key: "CLR" },
    { regex: /Target Takes Additional Damage of (\d+)/i, key: "FlatDamageTaken" },
    { regex: /Physical Damage Taken Reduced by (\d+)/i, key: "PDRFlat" },
    { regex: /Slows Attacker by \+(\d+)%/i, key: "SlowAttacker" },
    { regex: /Slow Target \+(\d+)%/i, key: "SlowTarget" },

    // --- Defense ---
    { regex: /\+(\d+)% Enhanced Defense/i, key: "EnhancedDefense" },
    { regex: /\+(\d+)% Bonus to Defense/i, key: "BonusDefense" },
    { regex: /([+-]?\d+) Defense/i, key: "FlatDefense" },
    { regex: /([+-]?\d+)% Chance to Avoid Damage/i, key: "AvoidDamage" },

    // --- Procs & Reanimate (Stores as string or boolean count) ---
    { regex: /(\d+)% Chance to cast level \d+ .* on .*/i, key: "Proc" }, // Just counts procs for now
    { regex: /(\d+)% Reanimate as: .*/i, key: "Reanimate" },

    // --- Miscs ---
    { regex: /Requirements ([+-]\d+)%/i, key: "RequirementsPercent" },
    { regex: /([+-]?\d+) Required Level/i, key: "RequiredLevel" },
    { regex: /([+-]?\d+)% to All Vendor Prices/i, key: "VendorPrices" },

    // --- Conditionals ---
    { regex: /\+(\d+) Lightning Damage per (\d+)% Bonus to Defense/i, type: "range", minKey: "LightDmgPerDef_Amt", maxKey: "LightDmgPerDef_Per" },
    { regex: /\+(\d+) Lightning Damage per (\d+)% Total Physical Weapon Damage Bonus/i, type: "range", minKey: "LightDmgPerPhys_Amt", maxKey: "LightDmgPerPhys_Per" },

    // --- Flags (Booleans) ---
    // We treat these as value = 1
    { regex: /Orb Effects Applied to this Item are Doubled/i, key: "OrbDoubler", type: "boolean" },
    { regex: /Can spawn any oSkill from Rare Affixes/i, key: "CanSpawnOSkill", type: "boolean" },
    { regex: /Indestructible/i, key: "Indestructible", type: "boolean" },
    { regex: /Cannot Be Frozen/i, key: "CannotBeFrozen", type: "boolean" },
    { regex: /Cannot be Renewed/i, key: "CannotBeRenewed", type: "boolean" },
    { regex: /Cannot be Crafted/i, key: "CannotBeCrafted", type: "boolean" },
    { regex: /Shrine Blessed/i, key: "ShrineBlessed", type: "boolean" },
    { regex: /Already Upgraded/i, key: "AlreadyUpgraded", type: "boolean" },
    { regex: /Corrupted/i, key: "Corrupted", type: "boolean" },
    { regex: /Ethereal/i, key: "Ethereal", type: "boolean" },
    { regex: /Half Freeze Duration/i, key: "HalfFreezeDuration", type: "boolean" },
    { regex: /Stun Attack/i, key: "StunAttack", type: "boolean" },

    // Socketed
    { regex: /Socketed \((\d+)\/(\d+)\)/i, type: "sockets", filledKey: "SocketsFilled", maxKey: "SocketsMax" },

    // OSkill
    { regex: /\+(\d+) to ([\w\s']+)$/i, key: "OSkill" },
    { regex: /\+(\d+) to ([\w\s]+)/i, key: "SpecificSkill" } // "+1 to Blink" - Special Handling Needed
    
];

// --- HELPER: Logic to detect if a line is an Item Type/Name ---
function isItemNameOrType(line) {
    // 1. Clean the line (remove suffixes like (Sacred), (1), etc.)
    const cleanLine = cleanItemType(line); 
    
    // 2. Check exact match in all lists
    if (allItemTypes.includes(cleanLine)) return true;

    // 3. Check "Superior" prefix match
    if (cleanLine.startsWith("Superior ")) {
        const baseName = cleanLine.replace("Superior ", "");
        if (allItemTypes.includes(baseName)) return true;
    }

    return false;
}

// --- HELPER: Stats Parser (Text -> Object) ---
function parseStatsFromText(rawLines) {
    let stats = {};

    const addStat = (key, val) => {
        if (typeof val === 'number') {
            if (stats[key]) stats[key] += val;
            else stats[key] = val;
        } else {
            // For strings (Procs, Reanimates), just append or count?
            // Let's just store "true" or count for now to acknowledge it exists
            if (stats[key]) stats[key] += 1;
            else stats[key] = 1;
        }
    };

    let lineNumber = 0;
    rawLines.forEach(line => {
        if(!line || line.trim() === "") return;

        lineNumber++;
        if (lineNumber === 1) return;
        let matched = false;
        line = line.replace(/\s*\[\d+\s+to\s+\d+\]\s*$/, '').trim();

        for (const map of statMappings) {
            const match = line.match(map.regex);
            if (match) {
                // Handle Ranges (Split into two keys)
                if (map.type === "range") {
                    addStat(map.minKey, parseInt(match[1]));
                    addStat(map.maxKey, parseInt(match[2]));
                }
                else if (map.type === "multi") {
                    const val = parseInt(match[1]);
                    map.keys.forEach(k => addStat(k, val));
                }
                else if (map.type === "sockets") {
                    stats[map.filledKey] = parseInt(match[1]);
                    stats[map.maxKey] = parseInt(match[2]);
                }
                else if (map.type === "boolean") {
                    stats[map.key] = true;
                } 
                else if (map.key === "OSkill") {
                    if (!stats.OSkills) stats.OSkills = {};
                    stats.OSkills[match[2].trim()] = parseInt(match[1]);
                }
                else {
                    addStat(map.key, parseInt(match[1]));
                }
                matched = true;
                break; 
            }
        }

        // 2. If not captured, check Ignore List
        if (!matched) {
            for (const ignoreRegex of ignoreMappings) {
                if (ignoreRegex.test(line)) {
                    matched = true;
                    break;
                }
            }
        }

        // 3. Check if it's an Item Name/Type (using your lists)
        if (!matched) {
            if (isItemNameOrType(line)) { matched = true; }
        }

        // 4. Log Unhandled
        if (!matched) { console.warn(`[UNHANDLED STAT]: "${line}"`); }
    });
    return stats;
}

// --- HELPER: Clean Tooltip HTML to Text Lines ---
function parseTooltipToLines(htmlContent) {
    if (!htmlContent) return [];
    
    // 1. Replace various break tags with newlines
    let text = htmlContent.replace(/<br\s*\/?>/gi, '\n');
    
    // 2. Strip all HTML tags
    text = text.replace(/<[^>]+>/g, '');
    
    // 3. Decode entities
    text = text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');

    // 4. Split and filter empty lines
    return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

function isTypeHelm(type) {
    for (const item of helmList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeBodyArmor(type) {
    for (const item of bodyArmorList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeBoots(type) {
    for (const item of bootsList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeGloves(type) {
    for (const item of glovesList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeBelt(type) {
    for (const item of beltList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeWeapon(type) {
    for (const item of weaponList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeOffhand(type) {
    for (const item of offhandList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeMisc(type) {
    for (const item of miscList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeRing(type) {
    for (const item of ringList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeAmulet(type) {
    for (const item of amuletList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeJewel(type) {
    for (const item of jewelList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeGem(type) {
    for (const item of gemList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

function isTypeRune(type) {
    for (const item of runeList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}

// Simple Slot mapping based on type
function getSlotByType(type) {
    if(isTypeHelm(type)) return "Helm";
    else if(isTypeBodyArmor(type)) return "Body Armor";
    else if(isTypeBoots(type)) return "Boots";
    else if(isTypeGloves(type)) return "Gloves";
    else if(isTypeBelt(type)) return "Belt";
    else if(isTypeWeapon(type)) return "Weapon1";
    else if(isTypeOffhand(type)) return "Weapon2";
    else if(isTypeMisc(type)) { return "Misc"; }

    else if(isTypeRing(type)) return "Ring";
    else if(isTypeAmulet(type)) return "Amulet";
    else if(isTypeJewel(type)) return "Jewel";
    else if(isTypeGem(type)) return "Gem";
    else if(isTypeRune(type)) return "Rune";

    else if(type.includes("Charm") || type.includes("Trophy")) return "Charm";

    else {
        console.log("No Slot Found For type : ", type);
        return "Weapon";
    }
}

// --- HELPER: Clean Item Type String ---
function cleanItemType(rawType) {
    if (!rawType) return "Unknown";
    // Split by '(' and take the first part
    let cleaned = rawType.split('(')[0];
    if (cleaned.startsWith("Superior ")) { cleaned = cleaned.replace("Superior ", ""); }
    return cleaned.trim();
}

// --- MAIN PROCESSOR: Raw Item Objects -> Final Item Objects ---
function processItems(rawItems) {
    return rawItems.reduce((acc, i) => {
        // Determine Slot (if not already set correctly)
        let slot = i.slot;
        let type = cleanItemType(i.type);
        if (slot === "Inventory" || !slot) { slot = getSlotByType(type); }
        if (slot === "Misc" || slot === "Unknown") { return acc; }

        let lines = parseTooltipToLines(i.tooltipHtml);

        // Separate socketed items from item stats
        const socketLineIndex = lines.findIndex(line => /Socketed \(\d+\/\d+\)/i.test(line));
        if (socketLineIndex !== -1) { lines = lines.slice(0, socketLineIndex + 1); }

        let reqLvl = 0;
        const reqLvlRegex = /Required Level: (\d+)/i;
        
        // We look through the lines we just parsed
        for (const line of lines) {
            const match = line.match(reqLvlRegex);
            if (match) {
                reqLvl = parseInt(match[1]);
                break; // Stop after finding it
            }
        }
        
        // Process Sockets
        let processedSockets = [];
        if (i.sockets && i.sockets.length > 0) {
            processedSockets = i.sockets.map(sock => {
                let sockLines = parseTooltipToLines(sock.html || sock.text); // Support both sources
                
                let sockType = "Jewel"; // Default
                if (sock.name.includes("Rune")) sockType = "Rune";
                if (sock.name.includes("Perfect ")) sockType = "Gem";
                
                return {
                    name: sock.name,
                    slot: "Socket",
                    type: sockType,
                    stats: parseStatsFromText(sockLines)
                };
            });
        }

        // All item stats
        let itemStats = parseStatsFromText(lines);

        // Remove socketed items stats from base item
        if (processedSockets.length > 0) {
            processedSockets.forEach(sock => {
                for (const [key, val] of Object.entries(sock.stats)) {
                    // Only subtract numeric values, ignore booleans/OSkills for now to be safe
                    if (typeof val === 'number' && itemStats[key] !== undefined) {
                        itemStats[key] -= val;
                        
                        // Cleanup: If stat reaches 0 (or very close to it), remove it to clean up the tooltip
                        if (Math.abs(itemStats[key]) < 0.01) { delete itemStats[key]; }
                    }
                    else if (key === "OSkills" && typeof val === 'object' && itemStats["OSkills"]) {
                        for (const [skillName, skillLevel] of Object.entries(val)) {
                            if (itemStats["OSkills"][skillName]) {
                                itemStats["OSkills"][skillName] -= skillLevel;
                                if (itemStats["OSkills"][skillName] <= 0) {
                                    delete itemStats["OSkills"][skillName];
                                }
                            }
                        }
                        if (Object.keys(itemStats["OSkills"]).length === 0) {
                            delete itemStats["OSkills"];
                        }
                    }
                }
            });
        }

        acc.push({
            name: i.name,
            slot: slot,
            location: i.location || "Equipped",
            type: type,
            stats: itemStats,
            socketed: processedSockets,
            requiredLevel: reqLvl
        });

        if (processedSockets.length > 0) {
            processedSockets.forEach(sock => {
                if (sock.type === "Jewel") {
                    let jewelReq = 0;
                    const jMatch = (sock.text || "").match(/Required Level: (\d+)/i);
                    if(jMatch) jewelReq = parseInt(jMatch[1]);
                    acc.push({
                        name: sock.name,      // e.g. "Jewel" or "Rainbow Facet"
                        slot: "Jewel",        // Explicit slot for the library logic
                        location: i.location || "Equipped", // Preserve origin context if needed
                        type: "Jewel",
                        stats: sock.stats,    // The stats specific to this jewel
                        socketed: [],          // Jewels themselves don't have sockets
                        requiredLevel: jewelReq
                    });
                }
            });
        }

        return acc;
    }, []);
}

module.exports = {
    processItems,
    getSlotByType
};