// --- Top Gear Logic ---
function renderTopGearSelection() {
    const tbody = document.getElementById('topgear-selection-body');
    tbody.innerHTML = "";

    const validSlots = ["Helm", "Body Armor", "Gloves", "Belt", "Boots", "Amulet", "Ring", "Weapon1", "Weapon2"];
    
    // 1. Filter by Slot FIRST (Business Logic)
    let eligibleItems = globalItemLibrary.filter(item => validSlots.includes(item.slot));

    // 2. Then Apply Sort/Search (UI Logic)
    const displayItems = getProcessedItems(eligibleItems, 'topgear');

    if (displayItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted p-3">No matching items found.</td></tr>';
        return;
    }

    displayItems.forEach((item) => {
        let tr = document.createElement('tr');
        
        // Checkbox
        let tdCheck = document.createElement('td');
        tdCheck.className = "text-center align-middle";
        // Important: Store the GLOBAL index
        let globalIndex = globalItemLibrary.indexOf(item);
        tdCheck.innerHTML = `<input type="checkbox" class="topgear-check" data-lib-index="${globalIndex}">`;

        // Icon
        let tdIcon = document.createElement('td');
        let img = document.createElement('img');
        setItemImage(img, item);
        img.width = 32;
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

        // Owner
        let tdOwner = document.createElement('td');
        let ownerName = item.owner || "None";
        tdOwner.innerText = ownerName;
        tdOwner.className = "align-middle small";
        if (ownerName !== "None") tdOwner.style.color = "#d4af37";

        tr.appendChild(tdCheck);
        tr.appendChild(tdIcon);
        tr.appendChild(tdName);
        tr.appendChild(tdType);
        tr.appendChild(tdOwner);
        
        tbody.appendChild(tr);
    });

    updateHeaderVisuals('topgear');
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
        setItemImage(img, item);
        img.width = 32;
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