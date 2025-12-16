// --- Upgrade Simulation Logic ---
document.getElementById('btn-upgrade-calc').addEventListener('click', function() {
    const tableBody = document.getElementById('upgrade-results-body');
    
    // Check if selection exists
    if (!selectedChar || !selectedSkill || !selectedEnemy) {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Please select Character, Skill and Enemy in the Simulator tab first.</td></tr>';
        return;
    }

    // 1. Calculate Baseline DPS
    // We must ensure stats are fresh
    selectedChar.calculateFinalStats(); 
    let baseResult = calculDegatSkill(selectedSkill, selectedChar, selectedEnemy);
    let baseAvg = (baseResult.totalDamageLow + baseResult.totalDamageHigh) / 2;

    if (baseAvg === 0) {
         tableBody.innerHTML = '<tr><td colspan="3" class="text-center text-warning">Base DPS is 0. Cannot calculate upgrades.</td></tr>';
         return;
    }

    // 2. Define Upgrades to Test
    // Each object defines a name and a function to apply/revert the change
    let upgrades = [
        {
            name: "+1 All Skills",
            apply: () => { selectedChar.allSkillLevel += 1; },
            revert: () => { selectedChar.allSkillLevel -= 1; }
        },
        {
            name: "+10% Lightning Spell Damage",
            apply: () => { selectedChar.lightningSpellDamage += 10; },
            revert: () => { selectedChar.lightningSpellDamage -= 10; }
        },
        {
            name: "+10% Fire Spell Damage",
            apply: () => { selectedChar.fireSpellDamage += 10; },
            revert: () => { selectedChar.fireSpellDamage -= 10; }
        },
        {
            name: "+10% Cold Spell Damage",
            apply: () => { selectedChar.coldSpellDamage += 10; },
            revert: () => { selectedChar.coldSpellDamage -= 10; }
        },
        {
            name: "+10% Poison Spell Damage",
            apply: () => { selectedChar.poisonSpellDamage += 10; },
            revert: () => { selectedChar.poisonSpellDamage -= 10; }
        },
        {
            name: "+10% Magic Spell Damage",
            apply: () => { selectedChar.magicSpellDamage += 10; },
            revert: () => { selectedChar.magicSpellDamage -= 10; }
        },
        {
            name: "+10% Physical Spell Damage",
            apply: () => { selectedChar.physicalSpellDamage += 10; },
            revert: () => { selectedChar.physicalSpellDamage -= 10; }
        },
        {
            name: "-5% Enemy Lightning Resists",
            apply: () => { selectedChar.lightningPiercing += 5; },
            revert: () => { selectedChar.lightningPiercing -= 5; }
        },
        {
            name: "-5% Enemy Fire Resists",
            apply: () => { selectedChar.firePiercing += 5; },
            revert: () => { selectedChar.firePiercing -= 5; }
        },
        {
            name: "-5% Enemy Cold Resists",
            apply: () => { selectedChar.coldPiercing += 5; },
            revert: () => { selectedChar.coldPiercing -= 5;}
        },
        {
            name: "-5% Enemy Poison Resists",
            apply: () => { selectedChar.poisonPiercing += 5; },
            revert: () => { selectedChar.poisonPiercing -= 5; }
        },
        {
            name: "+5 Spell Focus",
            apply: () => { selectedChar.spellFocus += 5; },
            revert: () => { selectedChar.spellFocus -= 5; }
        },
        {
            name: "+5 Energy",
            apply: () => { selectedChar.energy += 5; },
            revert: () => { selectedChar.energy -= 5; }
        },
        {
            name: "+5 Dexterity",
            apply: () => { selectedChar.dexterity += 5; },
            revert: () => { selectedChar.dexterity -= 5; }
        },
        {
            name: "+5 Strength",
            apply: () => { selectedChar.strength += 5; },
            revert: () => { selectedChar.strength -= 5; }
        },
        {
            name: "+5 Vitality",
            apply: () => { selectedChar.vitality += 5; },
            revert: () => { selectedChar.vitality -= 5; }
        },
    ];

    // 3. Run Simulations & Store Results
    let resultsArray = [];

    upgrades.forEach(upg => {
        // A. Apply
        upg.apply();
        
        // B. Calculate New DPS
        let newResult = calculDegatSkill(selectedSkill, selectedChar, selectedEnemy);
        let newAvg = (newResult.totalDamageLow + newResult.totalDamageHigh) / 2;
        
        // C. Revert
        upg.revert();

        // D. Calculate diff
        let diff = newAvg - baseAvg;
        let percent = (diff / baseAvg) * 100;

        resultsArray.push({
            name: upg.name,
            diff: diff,
            percent: percent
        });
    });

    // 4. SORT RESULTS (Descending by Diff)
    resultsArray.sort((a, b) => b.diff - a.diff);

    // 5. Generate HTML
    let rowsHTML = "";
    resultsArray.forEach(res => {
        rowsHTML += `
            <tr>
                <td>${res.name}</td>
                <td class="text-right text-success">+${res.diff.toFixed(2)}</td>
                <td class="text-right text-info">+${res.percent.toFixed(2)}%</td>
            </tr>
        `;
    });

    tableBody.innerHTML = rowsHTML;
});