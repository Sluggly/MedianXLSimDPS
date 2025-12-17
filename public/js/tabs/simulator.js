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

// Initialize Dropdown
function initEnemySelect() {
    const select = document.getElementById('sim-enemy-select');
    select.innerHTML = "";
    
    enemyList.forEach((enemy, index) => {
        let opt = document.createElement('option');
        opt.value = index;
        opt.text = enemy.name;
        select.add(opt);
    });

    // Default select first
    if (enemyList.length > 0) selectEnemy(0);
}

// Populate Inputs from Object
function selectEnemy(index) {
    selectedEnemy = enemyList[index];
    if (!selectedEnemy) return;

    // General
    document.getElementById('enemy-name').value = selectedEnemy.name;
    document.getElementById('enemy-level').value = selectedEnemy.level;
    document.getElementById('enemy-type').value = selectedEnemy.type;
    document.getElementById('enemy-life').value = selectedEnemy.life;
    document.getElementById('enemy-defense').value = selectedEnemy.defense;
    document.getElementById('enemy-isboss').checked = selectedEnemy.isBoss;
    document.getElementById('enemy-block').value = selectedEnemy.blockChance;
    document.getElementById('enemy-avoid').value = selectedEnemy.avoidChance;

    // Resists
    document.getElementById('enemy-res-phys').value = selectedEnemy.resists.physical;
    document.getElementById('enemy-res-fire').value = selectedEnemy.resists.fire;
    document.getElementById('enemy-res-cold').value = selectedEnemy.resists.cold;
    document.getElementById('enemy-res-light').value = selectedEnemy.resists.lightning;
    document.getElementById('enemy-res-pois').value = selectedEnemy.resists.poison;
    document.getElementById('enemy-res-magic').value = selectedEnemy.resists.magic;

    // Max Resists
    document.getElementById('enemy-max-fire').value = selectedEnemy.maxResists.fire;
    document.getElementById('enemy-max-cold').value = selectedEnemy.maxResists.cold;
    document.getElementById('enemy-max-light').value = selectedEnemy.maxResists.lightning;
    document.getElementById('enemy-max-pois').value = selectedEnemy.maxResists.poison;

    // Absorb
    document.getElementById('enemy-abs-fire').value = selectedEnemy.absorb.fire;
    document.getElementById('enemy-abs-cold').value = selectedEnemy.absorb.cold;
    document.getElementById('enemy-abs-light').value = selectedEnemy.absorb.lightning;
    document.getElementById('enemy-abs-pois').value = selectedEnemy.absorb.poison;

    // Pierce (Enemy Offense)
    document.getElementById('enemy-pierce-fire').value = selectedEnemy.pierce.fire;
    document.getElementById('enemy-pierce-cold').value = selectedEnemy.pierce.cold;
    document.getElementById('enemy-pierce-light').value = selectedEnemy.pierce.lightning;
    document.getElementById('enemy-pierce-pois').value = selectedEnemy.pierce.poison;
}

// Read Inputs back to Object (For manual overrides)
function updateCurrentEnemyFromInputs() {
    if (!selectedEnemy) return;

    selectedEnemy.name = document.getElementById('enemy-name').value;
    selectedEnemy.level = parseInt(document.getElementById('enemy-level').value);
    selectedEnemy.type = document.getElementById('enemy-type').value;
    selectedEnemy.life = parseInt(document.getElementById('enemy-life').value);
    selectedEnemy.defense = parseInt(document.getElementById('enemy-defense').value);
    selectedEnemy.isBoss = document.getElementById('enemy-isboss').checked;
    selectedEnemy.blockChance = parseInt(document.getElementById('enemy-block').value);
    selectedEnemy.avoidChance = parseInt(document.getElementById('enemy-avoid').value);

    selectedEnemy.resists.physical = parseInt(document.getElementById('enemy-res-phys').value);
    selectedEnemy.resists.fire = parseInt(document.getElementById('enemy-res-fire').value);
    selectedEnemy.resists.cold = parseInt(document.getElementById('enemy-res-cold').value);
    selectedEnemy.resists.lightning = parseInt(document.getElementById('enemy-res-light').value);
    selectedEnemy.resists.poison = parseInt(document.getElementById('enemy-res-pois').value);
    selectedEnemy.resists.magic = parseInt(document.getElementById('enemy-res-magic').value);

    selectedEnemy.maxResists.fire = parseInt(document.getElementById('enemy-max-fire').value);
    selectedEnemy.maxResists.cold = parseInt(document.getElementById('enemy-max-cold').value);
    selectedEnemy.maxResists.lightning = parseInt(document.getElementById('enemy-max-light').value);
    selectedEnemy.maxResists.poison = parseInt(document.getElementById('enemy-max-pois').value);

    selectedEnemy.absorb.fire = parseInt(document.getElementById('enemy-abs-fire').value);
    selectedEnemy.absorb.cold = parseInt(document.getElementById('enemy-abs-cold').value);
    selectedEnemy.absorb.lightning = parseInt(document.getElementById('enemy-abs-light').value);
    selectedEnemy.absorb.poison = parseInt(document.getElementById('enemy-abs-pois').value);

    selectedEnemy.pierce.fire = parseInt(document.getElementById('enemy-pierce-fire').value);
    selectedEnemy.pierce.cold = parseInt(document.getElementById('enemy-pierce-cold').value);
    selectedEnemy.pierce.lightning = parseInt(document.getElementById('enemy-pierce-light').value);
    selectedEnemy.pierce.poison = parseInt(document.getElementById('enemy-pierce-pois').value);
}