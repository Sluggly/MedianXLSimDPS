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
socket.on('scrapeSuccess', (data) => {
    // data contains: { character: Object, inventory: Array }
    const charData = data.character;
    const inventoryData = data.inventory;

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

    if (inventoryData) {
        inventoryData.forEach(item => {
             // Optional: Filter out junk like "Potion", "Arcane Cluster"
             if(item.type.includes("Potion") || item.type.includes("Cluster") || item.type.includes("Signet")) return;

             if (!globalItemLibrary.some(i => i.name === item.name)) {
                 globalItemLibrary.push(item);
             }
        });
    }

    refreshCharacterList();
    selectCharacter(characterList.length - 1);
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
        let div = document.createElement('div');
        div.className = "equip-slot";
        
        if (slot.item) {
            let iconPath = `img/items/${slot.item.type}.png`;
            
            // Icon
            let img = document.createElement('img');
            img.src = iconPath;
            img.onerror = function() { this.src = 'img/placeholder.png'; };
            img.addEventListener('mousemove', (e) => showItemTooltip(e, slot.item)); // Use move to follow mouse
            img.addEventListener('mouseleave', hideItemTooltip);
            
            // Name
            let nameSpan = document.createElement('strong');
            nameSpan.className = "mr-auto text-warning ml-2";
            nameSpan.innerText = slot.item.name;
            nameSpan.style.cursor = "help";
            nameSpan.addEventListener('mousemove', (e) => showItemTooltip(e, slot.item));
            nameSpan.addEventListener('mouseleave', hideItemTooltip);

            // Button
            let btn = document.createElement('button');
            btn.className = "btn btn-sm btn-outline-danger";
            btn.innerText = "Unequip";
            btn.onclick = () => doUnequip(slot.label);

            div.appendChild(img);
            div.appendChild(nameSpan);
            div.appendChild(btn);
        } else {
            div.innerHTML = `<div style="width:32px;height:32px;background:#111;margin-right:10px;border:1px dashed #444"></div><span class="text-muted">${slot.label}: Empty</span>`;
        }
        container.appendChild(div);
    });

    // Charms & Relics (Loop through arrays)
    if (selectedChar.charms.length > 0 || selectedChar.relics.length > 0) {
        let hr = document.createElement('div');
        hr.className = "text-muted small mt-2 mb-1 text-uppercase font-weight-bold";
        hr.innerText = "Inventory (Charms & Relics)";
        container.appendChild(hr);
    }

    // 3. Helper to render list items (Charms/Relics)
    const renderInventoryItem = (item, label) => {
        let div = document.createElement('div');
        div.className = "equip-slot";
        
        let iconPath = `img/items/${item.type}.png`;

        let img = document.createElement('img');
        img.src = iconPath;
        img.onerror = function() { this.src = 'img/placeholder.png'; };
        img.addEventListener('mousemove', (e) => showItemTooltip(e, item));
        img.addEventListener('mouseleave', hideItemTooltip);

        let nameSpan = document.createElement('strong');
        nameSpan.className = "mr-auto text-warning ml-2";
        nameSpan.innerHTML = `<span class="text-muted small">[${label}]</span> ${item.name}`;
        nameSpan.style.cursor = "help";
        nameSpan.addEventListener('mousemove', (e) => showItemTooltip(e, item));
        nameSpan.addEventListener('mouseleave', hideItemTooltip);

        let btn = document.createElement('button');
        btn.className = "btn btn-sm btn-outline-danger";
        btn.innerText = "Unequip";
        btn.onclick = () => doUnequipItemByName(item.name);

        div.appendChild(img);
        div.appendChild(nameSpan);
        div.appendChild(btn);
        container.appendChild(div);
    };

    // Render Charms
    selectedChar.charms.forEach(charm => renderInventoryItem(charm, "Charm"));
    
    // Render Relics
    selectedChar.relics.forEach(relic => renderInventoryItem(relic, "Relic"));
}

function renderItemLibrary() {
    const tbody = document.getElementById('item-library-body');
    tbody.innerHTML = "";

    globalItemLibrary.forEach((item, index) => {
        let tr = document.createElement('tr');
        
        let iconPath = `img/items/${item.type}.png`; 
        let isEquipped = selectedChar && selectedChar.equippedItems.some(i => i.name === item.name);

        // Define Buttons (kept from previous code)
        // ... (Button logic remains same) ...
        let actionButtons = `<button class="btn btn-sm btn-success" onclick="doEquipFromLib(${index})">Equip</button>`; // Simplified for example

        // Create Icon Element
        let img = document.createElement('img');
        img.src = iconPath;
        img.width = 32;
        img.onerror = function() { this.src = 'img/placeholder.png'; };
        img.className = "item-icon-container";
        // Attach Tooltip Events
        img.addEventListener('mousemove', (e) => showItemTooltip(e, item));
        img.addEventListener('mouseleave', hideItemTooltip);

        let tdIcon = document.createElement('td');
        tdIcon.appendChild(img);

        let tdName = document.createElement('td');
        tdName.innerText = item.name;
        // Also show tooltip on name hover
        tdName.addEventListener('mousemove', (e) => showItemTooltip(e, item));
        tdName.addEventListener('mouseleave', hideItemTooltip);

        let tdType = document.createElement('td');
        tdType.innerText = item.type;

        let tdBtn = document.createElement('td');
        tdBtn.className = "text-right";
        tdBtn.innerHTML = actionButtons; // Keep buttons as HTML string for simplicity or refactor

        tr.appendChild(tdIcon);
        tr.appendChild(tdName);
        tr.appendChild(tdType);
        tr.appendChild(tdBtn);
        
        tbody.appendChild(tr);
    });
}

// --- Top Gear Logic ---

function renderTopGearSelection() {
    const tbody = document.getElementById('topgear-selection-body');
    tbody.innerHTML = "";

    const validSlots = ["Helm", "Body Armor", "Gloves", "Belt", "Boots", "Amulet", "Ring", "Weapon1", "Weapon2"];
    const equippableItems = globalItemLibrary.filter(item => validSlots.includes(item.slot));

    if (equippableItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted p-3">No equippable items found in library.</td></tr>';
        return;
    }

    equippableItems.forEach((item, index) => {
        let tr = document.createElement('tr');
        
        let iconPath = `img/items/${item.type}.png`;

        // Checkbox
        let tdCheck = document.createElement('td');
        tdCheck.className = "text-center align-middle";
        tdCheck.innerHTML = `<input type="checkbox" class="topgear-check" data-lib-index="${globalItemLibrary.indexOf(item)}">`;

        // Icon
        let tdIcon = document.createElement('td');
        let img = document.createElement('img');
        img.src = iconPath;
        img.width = 32;
        img.onerror = function() { this.src = 'img/placeholder.png'; };
        img.className = "item-icon-container";
        img.addEventListener('mousemove', (e) => showItemTooltip(e, item));
        img.addEventListener('mouseleave', hideItemTooltip);
        tdIcon.appendChild(img);

        // Name
        let tdName = document.createElement('td');
        tdName.className = "align-middle";
        tdName.innerText = item.name;
        tdName.style.cursor = "help";
        tdName.addEventListener('mousemove', (e) => showItemTooltip(e, item));
        tdName.addEventListener('mouseleave', hideItemTooltip);

        // Type
        let tdType = document.createElement('td');
        tdType.className = "align-middle text-muted";
        tdType.innerHTML = `<small>${item.type}</small>`;

        tr.appendChild(tdCheck);
        tr.appendChild(tdIcon);
        tr.appendChild(tdName);
        tr.appendChild(tdType);
        
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
        let iconPath = `img/items/${item.type}.png`;

        let tr = document.createElement('tr');
        if (res.isCurrent) tr.className = "table-active"; // Highlight current gear

        // Icon
        let tdIcon = document.createElement('td');
        let img = document.createElement('img');
        img.src = iconPath;
        img.width = 32;
        img.onerror = function() { this.src = 'img/placeholder.png'; };
        img.className = "item-icon-container";
        img.addEventListener('mousemove', (e) => showItemTooltip(e, item));
        img.addEventListener('mouseleave', hideItemTooltip);
        tdIcon.appendChild(img);

        // Name
        let tdName = document.createElement('td');
        tdName.innerHTML = `${item.name} ${res.isCurrent ? '<span class="badge badge-secondary ml-1">Equipped</span>' : ''}`;
        tdName.style.cursor = "help";
        tdName.addEventListener('mousemove', (e) => showItemTooltip(e, item));
        tdName.addEventListener('mouseleave', hideItemTooltip);

        // Stats Logic
        let diffColorLow = res.diffLow >= 0 ? "text-success" : "text-danger";
        let diffColorHigh = res.diffHigh >= 0 ? "text-success" : "text-danger";
        let prefixLow = res.diffLow > 0 ? "+" : "";
        let prefixHigh = res.diffHigh > 0 ? "+" : "";

        let tdLow = document.createElement('td');
        tdLow.className = "text-right";
        tdLow.innerText = res.low.toFixed(2);

        let tdHigh = document.createElement('td');
        tdHigh.className = "text-right";
        tdHigh.innerText = res.high.toFixed(2);

        let tdPercLow = document.createElement('td');
        tdPercLow.className = `text-right ${diffColorLow}`;
        tdPercLow.innerText = `${prefixLow}${res.diffLow.toFixed(2)}%`;

        let tdPercHigh = document.createElement('td');
        tdPercHigh.className = `text-right ${diffColorHigh}`;
        tdPercHigh.innerText = `${prefixHigh}${res.diffHigh.toFixed(2)}%`;

        tr.appendChild(tdIcon);
        tr.appendChild(tdName);
        tr.appendChild(tdLow);
        tr.appendChild(tdHigh);
        tr.appendChild(tdPercLow);
        tr.appendChild(tdPercHigh);

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

// Scrape Button
document.getElementById('btn-scrape').addEventListener('click', function() {
    const url = document.getElementById('scraper-url').value;
    if(!url) return;
    
    document.getElementById('scrape-status').innerText = "Scraping... (This takes a few seconds)";
    document.getElementById('scrape-status').className = "text-warning small";
    
    socket.emit('scrapeCharacter', url);
});

function showItemTooltip(e, item) {
    if (!item) return;
    const tooltip = document.getElementById('global-tooltip');
    
    // Generate content
    let statsTxt = "";
    if (item.stats) {
        for (let [key, val] of Object.entries(item.stats)) {
            statsTxt += `<span class="magic-text">${key}: ${val}</span>\n`;
        }
    }
    
    tooltip.innerHTML = `<strong>${item.name}</strong><small class="text-muted">${item.type}</small><br>${statsTxt}`;
    tooltip.style.display = 'block';
    moveItemTooltip(e);
}

function moveItemTooltip(e) {
    const tooltip = document.getElementById('global-tooltip');
    const offset = 15;
    
    // Logic to keep it on screen
    let left = e.clientX + offset;
    let top = e.clientY + offset;
    
    // Check right edge
    if (left + tooltip.offsetWidth > window.innerWidth) {
        left = e.clientX - tooltip.offsetWidth - offset;
    }
    // Check bottom edge
    if (top + tooltip.offsetHeight > window.innerHeight) {
        top = e.clientY - tooltip.offsetHeight - offset;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

function hideItemTooltip() {
    document.getElementById('global-tooltip').style.display = 'none';
}