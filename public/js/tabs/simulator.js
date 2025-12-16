// --- UI Rendering Functions ---
function refreshCharacterList() {
    // Defines which containers need to be updated
    const targets = ["character-list", "edit-character-list"];

    targets.forEach(targetId => {
        const container = document.getElementById(targetId);
        if (!container) return;
        
        container.innerHTML = "";

        characterList.forEach((char, index) => {
            let div = document.createElement("div");
            // Adjust layout classes based on where it is being rendered
            // Sim tab (character-list) is narrow col-6, Import tab (edit-list) is wider so col-md-3 looks good
            div.className = targetId === "character-list" ? "col-6" : "col-6 col-md-3"; 
            
            let isActive = (selectedChar === char) ? "active" : "";
            
            div.innerHTML = `
                <div class="selectable-item ${isActive}" onclick="selectCharacter(${index})">
                    <img src="img/classes/${char.charClass}.png" alt="${char.charClass}" onerror="this.src='img/placeholder.png'">
                    <span class="item-name">${char.charName}</span>
                    <small>Lvl ${char.level} ${char.charClass}</small>
                </div>
            `;
            container.appendChild(div);
        });
    });
}

// --- Selection Logic ---
function selectCharacter(index) {
    selectedChar = characterList[index];
    // Calculate stats immediately upon selection to update preview
    selectedChar.calculateFinalStats(); 
    refreshCharacterList(); // Re-render to show active border
    
    // Update Stats Preview
    let statsDiv = document.getElementById("character-stats-preview");
    statsDiv.innerHTML = `
        <div class="stat-line">STR: <span class="stat-value">${selectedChar.strength}</span></div>
        <div class="stat-line">DEX: <span class="stat-value">${selectedChar.dexterity}</span></div>
        <div class="stat-line">VIT: <span class="stat-value">${selectedChar.vitality}</span></div>
        <div class="stat-line">ENE: <span class="stat-value">${selectedChar.energy}</span></div>
        <div class="stat-line">Spell Focus: <span class="stat-value">${selectedChar.spellFocus}</span></div>
        <br>
        <div class="stat-line">Light Dmg: <span class="stat-value">+${selectedChar.lightningSpellDamage}%</span></div>
        <div class="stat-line">Light Pierce: <span class="stat-value">-${selectedChar.lightningPiercing}%</span></div>
    `;
    if(document.getElementById('tab-character').style.display === 'block') {
        renderCharacterTab();
    }
}

function selectSkill(index) {
    selectedSkill = skillList[index];
    refreshSkillList();
}

function selectEnemy(index) {
    selectedEnemy = enemyList[index];
    refreshEnemyList();
    renderEnemyStats();
}

// --- Simulation Logic ---
document.getElementById('btn-simulate').addEventListener('click', function() {
    let resultDiv = document.getElementById("simulation-results");
    
    if (!selectedChar || !selectedSkill || !selectedEnemy) {
        resultDiv.innerHTML = "<div class='text-danger'>Please select Character, Skill and Enemy.</div>";
        return;
    }

    // Call the calculation function from script.js
    let damage = calculDegatSkill(selectedSkill, selectedChar, selectedEnemy);
    
    // Display
    resultDiv.innerHTML = `
        <h5>${selectedChar.charName} vs ${selectedEnemy.name}</h5>
        <div class="text-center mb-3">
            <img src="img/skills/${selectedSkill.name}.png" width="32"> 
            <strong>${selectedSkill.name}</strong>
        </div>
        <div class="stat-line">Low Dmg: <span class="stat-value">${damage.totalDamageLow.toFixed(2)}</span></div>
        <div class="stat-line">High Dmg: <span class="stat-value">${damage.totalDamageHigh.toFixed(2)}</span></div>
        <div class="dps-result">
            AVG: ${((damage.totalDamageLow + damage.totalDamageHigh) / 2).toFixed(2)}
        </div>
    `;
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    refreshSkillList();
    refreshEnemyList();
});

function refreshSkillList() {
    const container = document.getElementById("skill-list");
    container.innerHTML = "";

    skillList.forEach((skill, index) => {
        let div = document.createElement("div");
        div.className = "col-3";
        let isActive = (selectedSkill === skill) ? "active" : "";

        // Assuming image path: img/skills/Mind Flay.png
        div.innerHTML = `
            <div class="selectable-item ${isActive}" onclick="selectSkill(${index})">
                <img src="img/skills/${skill.name}.png" alt="${skill.name}" onerror="this.src='img/placeholder.png'">
                <span class="item-name">${skill.name}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function refreshEnemyList() {
    const container = document.getElementById("enemy-list");
    container.innerHTML = "";

    enemyList.forEach((enemy, index) => {
        let div = document.createElement("div");
        div.className = "col-3";
        let isActive = (selectedEnemy === enemy) ? "active" : "";

        // Assuming image path: img/enemies/Samael.png
        div.innerHTML = `
            <div class="selectable-item ${isActive}" onclick="selectEnemy(${index})">
                <img src="img/enemies/${enemy.name}.png" alt="${enemy.name}" onerror="this.src='img/placeholder.png'">
                <span class="item-name">${enemy.name}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderEnemyStats() {
    const container = document.getElementById("enemy-stats-preview");
    
    if (!selectedEnemy) {
        container.style.display = "none";
        container.innerHTML = "";
        return;
    }

    container.style.display = "block";
    const r = selectedEnemy.resists; // Short variable for readability
    
    // Using inline colors for specific elements to mimic Diablo resistance colors
    // Fire(Red), Cold(Blue), Light(Yellow), Poison(Green), Magic(Purple), Phys(Gray)
    container.innerHTML = `
        <h6 class="text-muted mb-2">Enemy Stats</h6>
        <div class="stat-line">Life: <span class="stat-value">${selectedEnemy.life.toLocaleString()}</span></div>
        <div class="row mt-2" style="font-size: 0.9rem;">
            <div class="col-6" style="color:#ff5252">Fire: ${r[0]}%</div>
            <div class="col-6" style="color:#448aff">Cold: ${r[1]}%</div>
            <div class="col-6" style="color:#ffeb3b">Light: ${r[2]}%</div>
            <div class="col-6" style="color:#69f0ae">Psn: ${r[3]}%</div>
            <div class="col-6" style="color:#e040fb">Magic: ${r[4]}%</div>
            <div class="col-6" style="color:#9e9e9e">Phys: ${r[5]}%</div>
        </div>
    `;
}