var skillList = []; // Array containing all created skills

class Skill {
    constructor(name, charClass, tree, requirement, scaling, isSpell) {
        this.name = name; // String unique "Mind Flay"
        this.charClass = charClass; // String "Paladin" ect...
        this.scaling = scaling; // Map
        this.tree = tree; // String, ex: "Warlock"
        this.requirement = requirement;
        this.isSpell = isSpell;
    }
}

function createSkill(name,charClass,tree,requirement,scaling,isSpell) {
    let skill = new Skill(name,charClass,tree,requirement,scaling,isSpell);
    skillList.push(skill);
    return skill;
}

function calculDegatSkill(skill, character, enemy) {
    if (skill.name == ["Mind Flay"]) { return simulateMindFlayDamage(skill, character, enemy); }
    return null;
}

function simulateMindFlayDamage(skill, character, enemy) {
    let totalDamageLow = 0.0;
    let totalDamageHigh = 0.0;

    let totalLightningDamageLow = 0.0;
    let totalLightningDamageHigh = 0.0;
    let totalPhysicalDamageLow = 0.0;
    let totalPhysicalDamageHigh = 0.0;

    // Skill Level Scaling
    let totalSkillLevel =  + character.allSkillLevel + character.paladinSkillLevel;
    if (character.learnedSkills[skill.name] != null) { totalSkillLevel += character.learnedSkills[skill.name]; }
    if (skill.scaling["Base"] != null) {
        if (skill.scaling["Base"]["YLB"] != null) {
            totalPhysicalDamageLow = totalPhysicalDamageLow + skill.scaling["Base"]["YLB"] + ((totalSkillLevel-1) * skill.scaling["Base"]["YLS"]);
            totalPhysicalDamageHigh = totalPhysicalDamageHigh + skill.scaling["Base"]["YHB"] + ((totalSkillLevel-1) * skill.scaling["Base"]["YHS"]);
        }
        if (skill.scaling["Base"]["LLB"] != null) {
            totalLightningDamageLow = totalLightningDamageLow + skill.scaling["Base"]["LLB"] + ((totalSkillLevel-1) * skill.scaling["Base"]["LLS"]);
            totalLightningDamageHigh = totalLightningDamageHigh + skill.scaling["Base"]["LHB"] + ((totalSkillLevel-1) * skill.scaling["Base"]["LHS"]);
        }
    }

    // Spell Factor
    if (skill.isSpell) {
        let energyBonus = (130 * (character.energy + 20)) / (500 + character.energy);
        let focusBonus = Math.min(character.spellFocus / 10.0, 100.0);
        let totalFactor = energyBonus + focusBonus;
        let multiplier = 1 + (totalFactor / 100.0);
        totalLightningDamageLow *= multiplier;
        totalLightningDamageHigh *= multiplier;
        totalPhysicalDamageLow *= multiplier;
        totalPhysicalDamageHigh *= multiplier;
    }

    totalLightningDamageLow = totalLightningDamageLow * (1 + (character.lightningSpellDamage/100.0));
    totalLightningDamageHigh = totalLightningDamageHigh * (1 + (character.lightningSpellDamage/100.0));
    totalPhysicalDamageLow = totalPhysicalDamageLow * (1 + (character.physicalMagicalSpellDamage/100.0));
    totalPhysicalDamageHigh = totalPhysicalDamageHigh * (1 + (character.physicalMagicalSpellDamage/100.0));

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