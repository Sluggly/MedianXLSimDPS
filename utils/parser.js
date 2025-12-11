// --- HELPER: Stats Parser (Text -> Object) ---
function parseStatsFromText(rawLines) {
    let stats = {};

    // Helper to add to stats
    const addStat = (key, val) => {
        if (stats[key]) stats[key] += val;
        else stats[key] = val;
    };

    const mappings = [
        // Attributes
        { regex: /\+(\d+) to Strength/i, key: "Strength" },
        { regex: /\+(\d+) to Dexterity/i, key: "Dexterity" },
        { regex: /\+(\d+) to Vitality/i, key: "Vitality" },
        { regex: /\+(\d+) to Energy/i, key: "Energy" },
        { regex: /\+(\d+)% to All Attributes/i, key: "AllAttributesPercent" },
        
        // Base Stats
        { regex: /\+(\d+) to Life/i, key: "Life" },
        { regex: /\+(\d+) to Mana/i, key: "Mana" },
        
        // Spell Damage
        { regex: /\+(\d+)% to Spell Damage/i, key: "SpellDamage" },
        { regex: /\+(\d+)% to Fire Spell Damage/i, key: "FireSpellDamage" },
        { regex: /\+(\d+)% to Cold Spell Damage/i, key: "ColdSpellDamage" },
        { regex: /\+(\d+)% to Lightning Spell Damage/i, key: "LightningSpellDamage" },
        { regex: /\+(\d+)% to Poison Spell Damage/i, key: "PoisonSpellDamage" },
        { regex: /\+(\d+)% to Physical\/Magic Spell Damage/i, key: "PhysicalMagicalSpellDamage" },
        
        // Pierce
        { regex: /-(\d+)% to Enemy Fire Resistance/i, key: "FirePierce" },
        { regex: /-(\d+)% to Enemy Lightning Resistance/i, key: "LightningPierce" },
        { regex: /-(\d+)% to Enemy Cold Resistance/i, key: "ColdPierce" },
        { regex: /-(\d+)% to Enemy Poison Resistance/i, key: "PoisonPierce" },
        
        // Resists
        { regex: /Fire Resist \+(\d+)%/i, key: "FireResist" },
        { regex: /Cold Resist \+(\d+)%/i, key: "ColdResist" },
        { regex: /Lightning Resist \+(\d+)%/i, key: "LightningResist" },
        { regex: /Poison Resist \+(\d+)%/i, key: "PoisonResist" },
        { regex: /Elemental Resists \+(\d+)%/i, key: "ElementalResist" },
        { regex: /Physical Resist \+(\d+)%/i, key: "PhysicalResist" },
        { regex: /Magic Resist \+(\d+)%/i, key: "MagicalResist" },

        // Max Resists
        { regex: /Maximum Fire Resist \+(\d+)%/i, key: "MaxFireResist" },
        { regex: /Maximum Cold Resist \+(\d+)%/i, key: "MaxColdResist" },
        { regex: /Maximum Lightning Resist \+(\d+)%/i, key: "MaxLightningResist" },
        { regex: /Maximum Poison Resist \+(\d+)%/i, key: "MaxPoisonResist" },
        { regex: /Maximum Elemental Resists \+(\d+)%/i, key: "MaxElementalResist" },

        // Absorb
        { regex: /Fire Absorb \+(\d+)%/i, key: "AbsorbFire" },
        { regex: /Cold Absorb \+(\d+)%/i, key: "AbsorbCold" },
        { regex: /Lightning Absorb \+(\d+)%/i, key: "AbsorbLightning" },

        // Skills & Misc
        { regex: /\+(\d+) to All Skills/i, key: "AllSkill" },
        { regex: /\+(\d+) to [\w\s]+ Skill Levels/i, key: "ClassSkill" },
        { regex: /\+(\d+) Spell Focus/i, key: "SpellFocus" }
    ];

    rawLines.forEach(line => {
        mappings.forEach(map => {
            const match = line.match(map.regex);
            if (match) { addStat(map.key, parseInt(match[1])); }
        });
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
var jewelList = ["Jewel"];

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
    return rawItems.map(i => {
        const lines = parseTooltipToLines(i.tooltipHtml);
        
        // Determine Slot (if not already set correctly)
        let slot = i.slot;
        let type = cleanItemType(i.type);
        if (slot === "Inventory" || !slot) { slot = getSlotByType(type); }

        // Process Sockets
        let processedSockets = [];
        if (i.socketsRaw && i.socketsRaw.length > 0) {
            processedSockets = i.socketsRaw.map(sock => {
                let sockLines = parseTooltipToLines(sock.html || sock.text); // Support both sources
                return {
                    name: sock.name,
                    slot: "Socket",
                    type: "Gem/Rune",
                    stats: parseStatsFromText(sockLines)
                };
            });
        }

        return {
            name: i.name,
            slot: slot,
            location: i.location || "Equipped",
            type: type,
            stats: parseStatsFromText(lines),
            socketed: processedSockets
        };
    })
    .filter(item => item.slot !== "Misc" && item.slot !== "Unknown");
}

module.exports = {
    processItems,
    getSlotByType
};