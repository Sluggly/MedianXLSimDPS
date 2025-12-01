const socket = io();

// Listen for initial data (Local JSON files)
socket.on('initData', (data) => {
    console.log("Received server data", data);
    
    // 1. Load Global Items
    globalItemLibrary = data.items;
    
    // 2. Load Characters
    characterList = [];
    if (data.characters) {
        data.characters.forEach(charData => {
            loadCharacterFromJSON(charData); // This function creates and pushes to characterList
        });
    }

    // 3. Load Skills
    skillList = [];
    if (data.skills) {
        data.skills.forEach(skillData => {
            loadSkillFromJSON(skillData); // This pushes to skillList via createSkill
        });
    }

    // 4. NEW: Load Enemies
    enemyList = []; // Clear hardcoded defaults if any
    if (data.enemies) {
        data.enemies.forEach(enemyData => {
            loadEnemyFromJSON(enemyData); // This pushes to enemyList via createEnemy
        });
    }

    // 5. Refresh UIs
    refreshCharacterList();
    refreshSkillList();
    refreshEnemyList();
    renderItemLibrary()

    // If on Top Gear tab, refresh that too
    if(document.getElementById('tab-topgear').style.display === 'block') { renderTopGearSelection(); }
});

// Listen for Scrape Success
socket.on('scrapeSuccess', (charData) => {
    document.getElementById('scrape-status').innerText = "Import Successful!";
    document.getElementById('scrape-status').className = "text-success small";

    loadCharacterFromJSON(charData);
    
    // Also add the new items to the global library so we can use them on other chars
    if (charData.items) {
        charData.items.forEach(item => {
             // Add only if not exists
             if (!globalItemLibrary.some(i => i.name === item.name)) {
                 globalItemLibrary.push(item);
             }
        });
    }

    refreshCharacterList();
    renderItemLibrary();
    switchTab('character'); // Go to character tab
});

// Listen for Scrape Error
socket.on('scrapeError', (msg) => {
    document.getElementById('scrape-status').innerText = msg;
    document.getElementById('scrape-status').className = "text-danger small";
});

// State Management
let selectedChar = null;
let selectedSkill = null;
let selectedEnemy = null;
    
let globalItemLibrary = []; // Stores all loaded item JSONs

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    refreshSkillList();
    refreshEnemyList();
});

// --- Tab Navigation Logic ---

function switchTab(tabName) {
    // 1. Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(t => t.style.display = 'none');

    // 2. Show selected tab
    document.getElementById('tab-' + tabName).style.display = 'block';

    // 3. Update Nav Links active state
    const links = document.querySelectorAll('.nav-link');
    links.forEach(l => l.classList.remove('active'));
    
    // Find the link that was clicked (approximated for simplicity)
    // In a real app, we'd pass 'this' or use event listeners better
    event.target.classList.add('active');
    if (tabName === 'character') renderCharacterTab(); 
    if (tabName === 'topgear') renderTopGearSelection();
}

// --- UI Rendering Functions ---

function refreshCharacterList() {
    const container = document.getElementById("character-list");
    container.innerHTML = "";

    characterList.forEach((char, index) => {
        let div = document.createElement("div");
        div.className = "col-6";
        let isActive = (selectedChar === char) ? "active" : "";
        
        // Assuming image path: img/classes/Paladin.png
        div.innerHTML = `
            <div class="selectable-item ${isActive}" onclick="selectCharacter(${index})">
                <img src="img/classes/${char.charClass}.png" alt="${char.charClass}" onerror="this.src='img/placeholder.png'">
                <span class="item-name">${char.charName}</span>
                <small>Lvl ${char.level} ${char.charClass}</small>
            </div>
        `;
        container.appendChild(div);
    });
}

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

function renderCharacterTab() {
    if (!selectedChar) return;
    
    // 1. Fill Basic Info & Attributes
    document.getElementById('edit-char-name').value = selectedChar.charName;
    document.getElementById('edit-char-level').value = selectedChar.level;
    document.getElementById('edit-str').value = selectedChar.attributedStrength;
    document.getElementById('edit-dex').value = selectedChar.attributedDexterity;
    document.getElementById('edit-vit').value = selectedChar.attributedVitality;
    document.getElementById('edit-ene').value = selectedChar.attributedEnergy;
    document.getElementById('edit-focus').value = selectedChar.spellFocus;

    // 2. Render Equipped Gear
    renderEquippedGear();

    // 3. Render Item Library
    renderItemLibrary();
}

// Function to handle Stat Inputs changes
function updateCharStat(statName, value) {
    if(!selectedChar) return;
    let val = parseInt(value) || 0;
    
    if (statName === 'str') selectedChar.attributedStrength = val;
    if (statName === 'dex') selectedChar.attributedDexterity = val;
    if (statName === 'vit') selectedChar.attributedVitality = val;
    if (statName === 'ene') selectedChar.attributedEnergy = val;
    if (statName === 'focus') selectedChar.spellFocus = val;
    if (statName === 'level') selectedChar.level = val;
    
    selectedChar.calculateFinalStats();
}

function renderEquippedGear() {
    const container = document.getElementById('equipped-gear-list');
    container.innerHTML = "";

    // Slots definition
    const slots = [
        { id: 'Helm', label: 'Helm', item: selectedChar.helm },
        { id: 'Amulet', label: 'Amulet', item: selectedChar.amulet },
        { id: 'Body Armor', label: 'Body Armor', item: selectedChar.bodyArmor },
        { id: 'Weapon1', label: 'Weapon 1', item: selectedChar.weapon1 },
        { id: 'Weapon2', label: 'Weapon 2', item: selectedChar.weapon2 },
        { id: 'Gloves', label: 'Gloves', item: selectedChar.gloves },
        { id: 'Ring1', label: 'Ring 1', item: selectedChar.ring1 },
        { id: 'Belt', label: 'Belt', item: selectedChar.belt },
        { id: 'Ring2', label: 'Ring 2', item: selectedChar.ring2 },
        { id: 'Boots', label: 'Boots', item: selectedChar.boots },
    ];

    slots.forEach(slot => {
        let content = `<span class="text-muted">${slot.label}: Empty</span>`;
        if (slot.item) {
            content = `
                <div class="d-flex align-items-center w-100">
                    <strong class="mr-auto text-warning">${slot.item.name}</strong>
                    <button class="btn btn-sm btn-outline-danger" onclick="doUnequip('${slot.label}')">Unequip</button>
                </div>
            `;
        }
        
        let div = document.createElement('div');
        div.className = "equip-slot";
        div.innerHTML = content;
        container.appendChild(div);
    });

    // Charms & Relics (Loop through arrays)
    selectedChar.charms.forEach(charm => {
        let div = document.createElement('div');
        div.className = "equip-slot";
        div.innerHTML = `
            <div class="d-flex align-items-center w-100">
                <span class="mr-2">[Charm]</span>
                <strong class="mr-auto text-warning">${charm.name}</strong>
                <button class="btn btn-sm btn-outline-danger" onclick="doUnequipItemByName('${charm.name}')">Unequip</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderItemLibrary() {
    const tbody = document.getElementById('item-library-body');
    tbody.innerHTML = "";

    globalItemLibrary.forEach((item, index) => {
        let tr = document.createElement('tr');
        
        // Generate Tooltip Content
        let statsTxt = "";
        for (let [key, val] of Object.entries(item.stats)) {
            statsTxt += `${key}: ${val}\n`;
        }

        // Determine if currently equipped
        let isEquipped = selectedChar != null && selectedChar.equippedItems.some(i => i.name === item.name); // Simple name check
        
        // Buttons Logic
        let actionButtons = "";
        
        if (item.slot === "Ring") {
            // Two buttons for rings
            if (selectedChar.ring1 && selectedChar.ring1.name === item.name) {
                actionButtons += `<button class="btn btn-sm btn-danger mr-1" onclick="doUnequipItemByName('${item.name}')">Unequip (1)</button>`;
            } else {
                actionButtons += `<button class="btn btn-sm btn-success mr-1" onclick="doEquipFromLib(${index}, 1)">Equip (1)</button>`;
            }

            if (selectedChar.ring2 && selectedChar.ring2.name === item.name) {
                actionButtons += `<button class="btn btn-sm btn-danger" onclick="doUnequipItemByName('${item.name}')">Unequip (2)</button>`;
            } else {
                actionButtons += `<button class="btn btn-sm btn-success" onclick="doEquipFromLib(${index}, 2)">Equip (2)</button>`;
            }

        } else if (item.slot === "Charm" || item.slot === "Relic") {
             if (isEquipped) {
                actionButtons = `<button class="btn btn-sm btn-danger" onclick="doUnequipItemByName('${item.name}')">Unequip</button>`;
             } else {
                actionButtons = `<button class="btn btn-sm btn-success" onclick="doEquipFromLib(${index})">Equip</button>`;
             }
        } else {
            // Standard slots
             if (isEquipped) {
                actionButtons = `<button class="btn btn-sm btn-danger" onclick="doUnequipItemByName('${item.name}')">Unequip</button>`;
             } else {
                actionButtons = `<button class="btn btn-sm btn-success" onclick="doEquipFromLib(${index})">Equip</button>`;
             }
        }

        // Icon Image (Generic based on slot/type)
        // Ensure you have images like 'img/items/Boots.png' or 'img/items/Helm.png'
        let iconPath = `img/items/${item.type}.png`; 

        tr.innerHTML = `
            <td>
                <div class="item-icon-container">
                    <img src="${iconPath}" width="32" onerror="this.src='img/placeholder.png'">
                    <span class="custom-tooltip"><strong>${item.name}</strong><br><hr style="border-color:#555; margin:5px 0;">${statsTxt}</span>
                </div>
            </td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td class="text-right">${actionButtons}</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Top Gear Logic ---

function renderTopGearSelection() {
    const tbody = document.getElementById('topgear-selection-body');
    tbody.innerHTML = "";

    // Filter: Only Armor, Weapons, Jewelry (Exclude Charms/Relics)
    const validSlots = ["Helm", "Body Armor", "Gloves", "Belt", "Boots", "Amulet", "Ring", "Weapon1", "Weapon2"];
    
    // Filter library
    const equippableItems = globalItemLibrary.filter(item => validSlots.includes(item.slot));

    if (equippableItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted p-3">No equippable items found in library.</td></tr>';
        return;
    }

    equippableItems.forEach((item, index) => {
        // Generate Tooltip
        let statsTxt = "";
        for (let [key, val] of Object.entries(item.stats)) {
            statsTxt += `${key}: ${val}\n`;
        }
        let iconPath = `img/items/${item.type}.png`;

        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-center align-middle">
                <input type="checkbox" class="topgear-check" data-lib-index="${globalItemLibrary.indexOf(item)}">
            </td>
            <td>
                <div class="item-icon-container">
                    <img src="${iconPath}" width="32" onerror="this.src='img/placeholder.png'">
                    <span class="custom-tooltip"><strong>${item.name}</strong><br><hr style="border-color:#555; margin:5px 0;">${statsTxt}</span>
                </div>
            </td>
            <td class="align-middle">${item.name}</td>
            <td class="align-middle text-muted"><small>${item.type}</small></td>
        `;
        tbody.appendChild(tr);
    });
}

// Toggle All Checkboxes
document.getElementById('chk-toggle-all').addEventListener('change', function(e) {
    const checkboxes = document.querySelectorAll('.topgear-check');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
});

// Run Simulation
document.getElementById('btn-topgear-sim').addEventListener('click', function() {
    if (!selectedChar || !selectedSkill || !selectedEnemy) {
        alert("Please select Character, Skill and Enemy in the DPS Simulator tab first.");
        return;
    }

    const checkboxes = document.querySelectorAll('.topgear-check:checked');
    if (checkboxes.length === 0) {
        alert("Please select at least one item to test.");
        return;
    }

    // 1. Calculate Baseline (Current Gear)
    selectedChar.calculateFinalStats();
    const baseDmg = calculDegatSkill(selectedSkill, selectedChar, selectedEnemy);
    
    let results = [];

    // Add currently equipped items to results for comparison
    selectedChar.equippedItems.forEach(item => {
        // Filter out charms/relics from display if desired, or keep them
        if(["Charm", "Relic"].includes(item.slot)) return;

        results.push({
            item: item,
            isCurrent: true,
            low: baseDmg.totalDamageLow,
            high: baseDmg.totalDamageHigh,
            diffLow: 0,
            diffHigh: 0
        });
    });

    // 2. Loop through checked library items
    checkboxes.forEach(cb => {
        let libIndex = cb.getAttribute('data-lib-index');
        let itemData = globalItemLibrary[libIndex];
        
        // Convert to Item Object
        let testItem = createItem(itemData.name, itemData.slot, itemData.type, itemData.stats, itemData.socketed);

        // SAVE current item in that slot
        // Note: For Rings, we default to testing against Slot 1 for simplicity in this iteration
        let originalItem = null;
        let slotToTest = testItem.slot;
        
        if (slotToTest === "Ring") {
            originalItem = selectedChar.ring1; // Test vs Ring 1
        } else {
            originalItem = selectedChar.getItemFromSlot(slotToTest);
        }

        // EQUIP Test Item
        // This overwrites the slot in the character object
        selectedChar.equipItem(testItem, 1); // 1 = Ring Slot 1 default
        
        // RE-CALCULATE
        selectedChar.calculateFinalStats();
        let newDmg = calculDegatSkill(selectedSkill, selectedChar, selectedEnemy);

        // Store Result
        results.push({
            item: testItem,
            isCurrent: false,
            low: newDmg.totalDamageLow,
            high: newDmg.totalDamageHigh,
            diffLow: ((newDmg.totalDamageLow - baseDmg.totalDamageLow) / baseDmg.totalDamageLow) * 100,
            diffHigh: ((newDmg.totalDamageHigh - baseDmg.totalDamageHigh) / baseDmg.totalDamageHigh) * 100
        });

        // RESTORE Original Item
        if (originalItem) {
            selectedChar.equipItem(originalItem, 1);
        } else {
            // If there was no item, we must Unequip the test item
            selectedChar.unequipItem(testItem);
        }
    });

    // Reset stats to baseline after simulation loop
    selectedChar.calculateFinalStats();

    // 3. Sort Results (Best High Damage Gain first)
    results.sort((a, b) => b.high - a.high);

    // 4. Render Results
    renderTopGearResults(results);
});

function renderTopGearResults(results) {
    const tbody = document.getElementById('topgear-results-body');
    tbody.innerHTML = "";

    results.forEach(res => {
        let item = res.item;
        
        // Tooltip generation
        let statsTxt = "";
        for (let [key, val] of Object.entries(item.stats)) {
            statsTxt += `${key}: ${val}\n`;
        }
        let iconPath = `img/items/${item.type}.png`;

        // Style for rows
        let rowClass = res.isCurrent ? "table-active" : ""; // Highlight current gear
        let diffColorLow = res.diffLow >= 0 ? "text-success" : "text-danger";
        let diffColorHigh = res.diffHigh >= 0 ? "text-success" : "text-danger";
        
        let prefixLow = res.diffLow > 0 ? "+" : "";
        let prefixHigh = res.diffHigh > 0 ? "+" : "";

        let tr = document.createElement('tr');
        tr.className = rowClass;
        tr.innerHTML = `
            <td>
                <div class="item-icon-container">
                    <img src="${iconPath}" width="32" onerror="this.src='img/placeholder.png'">
                    <span class="custom-tooltip"><strong>${item.name}</strong><br><hr style="border-color:#555; margin:5px 0;">${statsTxt}</span>
                </div>
            </td>
            <td>
                ${item.name} 
                ${res.isCurrent ? '<span class="badge badge-secondary ml-2">Equipped</span>' : ''}
            </td>
            <td class="text-right">${res.low.toFixed(2)}</td>
            <td class="text-right">${res.high.toFixed(2)}</td>
            <td class="text-right ${diffColorLow}">${prefixLow}${res.diffLow.toFixed(2)}%</td>
            <td class="text-right ${diffColorHigh}">${prefixHigh}${res.diffHigh.toFixed(2)}%</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Action Functions ---

function doEquipFromLib(index, ringSlot = 1) {
    if (!selectedChar) return;
    let itemData = globalItemLibrary[index];
    
    // Convert plain JSON object to Item Class if not already
    let newItem = createItem(itemData.name, itemData.slot, itemData.type, itemData.stats, itemData.socketed);
    
    selectedChar.equipItem(newItem, ringSlot);
    selectedChar.calculateFinalStats();
    renderCharacterTab();
}

function doUnequip(slotLabel) {
    // Helper to unequip based on fixed slot names
    let itemToUnequip = null;
    if (slotLabel === 'Helm') itemToUnequip = selectedChar.helm;
    if (slotLabel === 'Body Armor') itemToUnequip = selectedChar.bodyArmor;
    if (slotLabel === 'Weapon 1') itemToUnequip = selectedChar.weapon1;
    if (slotLabel === 'Weapon 2') itemToUnequip = selectedChar.weapon2;
    if (slotLabel === 'Gloves') itemToUnequip = selectedChar.gloves;
    if (slotLabel === 'Belt') itemToUnequip = selectedChar.belt;
    if (slotLabel === 'Boots') itemToUnequip = selectedChar.boots;
    if (slotLabel === 'Amulet') itemToUnequip = selectedChar.amulet;
    if (slotLabel === 'Ring 1') itemToUnequip = selectedChar.ring1;
    if (slotLabel === 'Ring 2') itemToUnequip = selectedChar.ring2;

    if (itemToUnequip) {
        selectedChar.unequipItem(itemToUnequip);
        selectedChar.calculateFinalStats();
        renderCharacterTab();
    }
}

function doUnequipItemByName(itemName) {
    let item = selectedChar.equippedItems.find(i => i.name === itemName);
    if (item) {
        selectedChar.unequipItem(item);
        selectedChar.calculateFinalStats();
        renderCharacterTab();
    }
}

function downloadCharacterJSON() {
    if (!selectedChar) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedChar.toJSON(), null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", selectedChar.charName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
            name: "+10% Spell Damage",
            apply: () => { 
                selectedChar.lightningSpellDamage += 10; 
                selectedChar.fireSpellDamage += 10;
                selectedChar.coldSpellDamage += 10;
                selectedChar.poisonSpellDamage += 10;
                selectedChar.magicSpellDamage += 10;
                selectedChar.physicalSpellDamage += 10;
            },
            revert: () => { 
                selectedChar.lightningSpellDamage -= 10; 
                selectedChar.fireSpellDamage -= 10;
                selectedChar.coldSpellDamage -= 10;
                selectedChar.poisonSpellDamage -= 10;
                selectedChar.magicSpellDamage -= 10;
                selectedChar.physicalSpellDamage -= 10;
            }
        },
        {
            name: "-5% Enemy Resists",
            apply: () => { 
                selectedChar.lightningPiercing += 5; // Simulating -5 enemy res as +5 Pierce
                selectedChar.firePiercing += 5;
                selectedChar.coldPiercing += 5;
                selectedChar.poisonPiercing += 5;
            },
            revert: () => { 
                selectedChar.lightningPiercing -= 5;
                selectedChar.firePiercing -= 5;
                selectedChar.coldPiercing -= 5;
                selectedChar.poisonPiercing -= 5;
            }
        },
        {
            name: "+50 Spell Focus",
            apply: () => { selectedChar.spellFocus += 50; },
            revert: () => { selectedChar.spellFocus -= 50; }
        },
        {
            name: "+50 Energy",
            apply: () => { selectedChar.energy += 50; },
            revert: () => { selectedChar.energy -= 50; }
        },
    ];

    // 3. Run Simulations
    let rowsHTML = "";

    upgrades.forEach(upg => {
        // A. Apply
        upg.apply();
        
        // B. Calculate New DPS
        // Note: We DO NOT call calculateFinalStats() here, because that would wipe our manual changes
        // This relies on calculDegatSkill using the values currently in the object
        let newResult = calculDegatSkill(selectedSkill, selectedChar, selectedEnemy);
        let newAvg = (newResult.totalDamageLow + newResult.totalDamageHigh) / 2;
        
        // C. Revert
        upg.revert();

        // D. Calculate diff
        let diff = newAvg - baseAvg;
        let percent = (diff / baseAvg) * 100;

        // E. Generate HTML
        rowsHTML += `
            <tr>
                <td>${upg.name}</td>
                <td class="text-right text-success">+${diff.toFixed(2)}</td>
                <td class="text-right text-info">+${percent.toFixed(2)}%</td>
            </tr>
        `;
    });

    tableBody.innerHTML = rowsHTML;
});

// Scrape Button
document.getElementById('btn-scrape').addEventListener('click', function() {
    const url = document.getElementById('scraper-url').value;
    if(!url) return;
    
    document.getElementById('scrape-status').innerText = "Scraping... (This takes a few seconds)";
    document.getElementById('scrape-status').className = "text-warning small";
    
    socket.emit('scrapeCharacter', url);
});