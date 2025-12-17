// --- CHARACTER TAB LOGIC ---

function renderCharacterTab() {
    if (!selectedChar) return;
    
    // Fill Basic Info & Attributes
    document.getElementById('edit-char-name').value = selectedChar.charName;
    document.getElementById('edit-char-level').value = selectedChar.level;
    document.getElementById('edit-str').value = selectedChar.attributedStrength;
    document.getElementById('edit-dex').value = selectedChar.attributedDexterity;
    document.getElementById('edit-vit').value = selectedChar.attributedVitality;
    document.getElementById('edit-ene').value = selectedChar.attributedEnergy;
    document.getElementById('edit-focus').value = selectedChar.spellFocus;

    renderEquippedGear();
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
            // Icon
            let img = document.createElement('img');
            setItemImage(img, slot.item);
            img.addEventListener('mousemove', (e) => showItemTooltip(e, slot.item)); // Use move to follow mouse
            img.addEventListener('mouseleave', hideItemTooltip);
            
            // Name
            let nameSpan = document.createElement('strong');
            nameSpan.className = "mr-auto text-warning ml-2";
            nameSpan.innerText = slot.item.name;
            nameSpan.style.cursor = "help";
            nameSpan.addEventListener('mousemove', (e) => showItemTooltip(e, slot.item));
            nameSpan.addEventListener('mouseleave', hideItemTooltip);

            let socketContainer = document.createElement('div');
            socketContainer.className = "d-flex mr-3"; 
            
            socketContainer.appendChild(createSocketVisuals(slot.item, slot.id));

            // Button
            let btn = document.createElement('button');
            btn.className = "btn btn-sm btn-outline-danger";
            btn.innerText = "Unequip";
            btn.onclick = () => doUnequip(slot.label);

            div.appendChild(img);
            div.appendChild(nameSpan);
            div.appendChild(socketContainer);
            div.appendChild(btn);
        } else {
            div.innerHTML = `<div style="width:32px;height:32px;background:#111;margin-right:10px;border:1px dashed #444"></div><span class="text-muted">${slot.label}: Empty</span>`;
        }
        container.appendChild(div);
    });

    if (selectedChar.charms.length > 0 || selectedChar.relics.length > 0) {
        // 1. Create Header with Toggle Button
        let headerDiv = document.createElement('div');
        headerDiv.className = "d-flex justify-content-between align-items-center mt-3 mb-2 p-2 bg-secondary text-white rounded";
        headerDiv.style.cursor = "pointer"; // Make whole bar clickable
        
        let title = document.createElement('span');
        title.innerHTML = `<strong>Inventory</strong> <small>(${selectedChar.charms.length + selectedChar.relics.length} items)</small>`;
        
        let toggleBtn = document.createElement('button');
        toggleBtn.className = "btn btn-sm btn-dark";
        toggleBtn.innerText = "Show"; // Default state text
        
        headerDiv.appendChild(title);
        headerDiv.appendChild(toggleBtn);
        container.appendChild(headerDiv);

        // 2. Create Hidden Container
        let charmsContainer = document.createElement('div');
        charmsContainer.id = "charms-collapsible";
        charmsContainer.style.display = isCharmsSectionOpen ? "block" : "none";
        
        // 3. Toggle Logic
        headerDiv.onclick = () => {
            isCharmsSectionOpen = !isCharmsSectionOpen; // Toggle State
            
            if (isCharmsSectionOpen) {
                charmsContainer.style.display = "block";
                toggleBtn.innerText = "Hide";
            } else {
                charmsContainer.style.display = "none";
                toggleBtn.innerText = "Show";
            }
        };

        // 4. Helper Function (same logic, just appending to charmsContainer now)
        const renderInventoryItem = (item, label) => {
            let div = document.createElement('div');
            div.className = "equip-slot";
            
            let img = document.createElement('img');
            setItemImage(img, item);
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
            charmsContainer.appendChild(div);
        };

        // Render Items into the hidden container
        selectedChar.charms.forEach(charm => renderInventoryItem(charm, "Charm"));
        selectedChar.relics.forEach(relic => renderInventoryItem(relic, "Relic"));

        // Append the hidden container to main list
        container.appendChild(charmsContainer);
    }
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

function renderItemLibrary() {
    if (selectedChar === null) return;
    // 1. Get Sorted & Filtered Items
    // We pass globalItemLibrary source and the 'library' context string
    const tbody = document.getElementById('item-library-body');

    // --- Save Scroll Position ---
    // We look for the parent container that has the scrollbar (class .table-responsive)
    const scrollContainer = tbody.closest('.table-responsive');
    const savedScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    const displayItems = getProcessedItems([...globalItemLibrary], 'library');

    tbody.innerHTML = "";

    displayItems.forEach((item) => {
        // Find original index for the Equip button action (IMPORTANT)
        // We must pass the index of the item in the *Global* library, not the filtered list
        // otherwise equipping will grab the wrong item.
        let globalIndex = globalItemLibrary.indexOf(item); 

        let tr = document.createElement('tr');
        
        // Icon
        let img = document.createElement('img');
        setItemImage(img, item);
        img.width = 32;
        img.className = "item-icon-container";
        img.addEventListener('mousemove', (e) => showItemTooltip(e, item));
        img.addEventListener('mouseleave', hideItemTooltip);

        let tdIcon = document.createElement('td');
        tdIcon.appendChild(img);

        // Name
        let tdName = document.createElement('td');
        tdName.innerText = item.name;
        tdName.className = "align-middle";
        tdName.style.cursor = "help";
        tdName.addEventListener('mousemove', (e) => showItemTooltip(e, item));
        tdName.addEventListener('mouseleave', hideItemTooltip);

        // Sockets
        let tdSockets = document.createElement('td');
        tdSockets.className = "align-middle";
        // Use the helper from ui.js
        tdSockets.appendChild(createSocketVisuals(item));

        // Type
        let tdType = document.createElement('td');
        tdType.innerText = item.type;
        tdType.className = "align-middle text-muted";

        // Owner
        let tdOwner = document.createElement('td');
        let ownerName = item.owner || "None";
        tdOwner.innerText = ownerName;
        tdOwner.className = "align-middle";
        if (ownerName !== "None") tdOwner.style.color = "#d4af37";

        // Action
        let tdBtn = document.createElement('td');
        tdBtn.className = "text-right";
        tdBtn.style.whiteSpace = "nowrap";

        // Helper to create a button
        const createBtn = (text, btnClass, onClick) => {
            let btn = document.createElement('button');
            btn.className = `btn btn-sm ${btnClass} ml-1`;
            btn.innerText = text;
            btn.onclick = (e) => {
                e.stopPropagation(); 
                onClick();
            };
            return btn;
        };

        // --- SLOT LOGIC ---
        if (["Jewel", "Gem", "Rune"].includes(item.type)) {
            // Define targets
            const targets = [
                { id: "Helm", lbl: "HE" },
                { id: "Body Armor", lbl: "BA" },
                { id: "Gloves", lbl: "GL" },
                { id: "Belt", lbl: "BE" },
                { id: "Boots", lbl: "BO" },
                { id: "Weapon1", lbl: "W1" },
                { id: "Weapon2", lbl: "W2" }
            ];

            targets.forEach(tgt => {
                let btn = document.createElement('button');
                btn.className = "btn btn-sm btn-dark ml-1 px-1";
                btn.style.fontSize = "0.7rem";
                btn.innerText = tgt.lbl;
                btn.title = "Socket into " + tgt.id;
                btn.onclick = (e) => {
                    e.stopPropagation();
                    doSocketItemToSlot(globalIndex, tgt.id);
                };
                tdBtn.appendChild(btn);
            });
        }
        else if (item.slot === "Ring") {
            // -- Ring 1 --
            if (selectedChar && selectedChar.ring1 === item) {
                // Is Equipped in Slot 1 -> Unequip
                tdBtn.appendChild(createBtn("Un-R1", "btn-outline-danger", () => doUnequip("Ring 1")));
            } else {
                // Not Equipped -> Equip Slot 1
                tdBtn.appendChild(createBtn("R1", "btn-success", () => doEquipFromLib(globalIndex, 1)));
            }

            // -- Ring 2 --
            if (selectedChar && selectedChar.ring2 === item) {
                // Is Equipped in Slot 2 -> Unequip
                tdBtn.appendChild(createBtn("Un-R2", "btn-outline-danger", () => doUnequip("Ring 2")));
            } else {
                // Not Equipped -> Equip Slot 2
                tdBtn.appendChild(createBtn("R2", "btn-success", () => doEquipFromLib(globalIndex, 2)));
            }
        } 
        else if (item.slot === "Weapon1" || item.type.includes("Weapon")) {
            // -- Weapon Main --
            if (selectedChar && selectedChar.weapon1 === item) {
                tdBtn.appendChild(createBtn("Un-Main", "btn-outline-danger", () => doUnequip("Weapon 1")));
            } else {
                tdBtn.appendChild(createBtn("Main", "btn-success", () => doEquipFromLib(globalIndex, 1)));
            }

            // -- Weapon Offhand (Dual Wield check could go here, but we allow it for sim) --
            if (selectedChar && selectedChar.weapon2 === item) {
                tdBtn.appendChild(createBtn("Un-Off", "btn-outline-danger", () => doUnequip("Weapon 2")));
            } else {
                tdBtn.appendChild(createBtn("Off", "btn-secondary", () => doEquipFromLib(globalIndex, 2))); // Grey button for offhand distinction
            }
        }
        else if (item.slot === "Charm" || item.slot === "Relic") {
             // Charms/Relics (Check if in array)
             const isEquipped = selectedChar && (selectedChar.charms.includes(item) || selectedChar.relics.includes(item));
             if (isEquipped) {
                 tdBtn.appendChild(createBtn("Unequip", "btn-outline-danger", () => doUnequipItemByName(item.name)));
             } else {
                 tdBtn.appendChild(createBtn("Equip", "btn-success", () => doEquipFromLib(globalIndex)));
             }
        }
        else {
            // -- Standard Slots (Helm, Armor, etc.) --
            // Map item.slot to character property (e.g. "Body Armor" -> selectedChar.bodyArmor)
            // We use a simple check based on the current state logic
            let currentlyEquipped = null;
            if (item.slot === "Helm") currentlyEquipped = selectedChar.helm;
            if (item.slot === "Body Armor") currentlyEquipped = selectedChar.bodyArmor;
            if (item.slot === "Gloves") currentlyEquipped = selectedChar.gloves;
            if (item.slot === "Belt") currentlyEquipped = selectedChar.belt;
            if (item.slot === "Boots") currentlyEquipped = selectedChar.boots;
            if (item.slot === "Amulet") currentlyEquipped = selectedChar.amulet;
            if (item.slot === "Weapon2") currentlyEquipped = selectedChar.weapon2; // Shields

            if (selectedChar && currentlyEquipped === item) {
                // Is Equipped -> Unequip
                // We need to map back to the "Label" doUnequip expects
                let label = item.slot;
                if(label === "Weapon2") label = "Weapon 2"; // Fix label for Shield
                if(label === "Body Armor") label = "Body Armor"; // Matches
                
                tdBtn.appendChild(createBtn("Unequip", "btn-outline-danger", () => doUnequip(label)));
            } else {
                // Not Equipped -> Equip
                // Special case for Shields (Weapon2) -> Equip to slot 2
                let slotIdx = (item.slot === "Weapon2") ? 2 : 1;
                tdBtn.appendChild(createBtn("Equip", "btn-success", () => doEquipFromLib(globalIndex, slotIdx)));
            }
        }

        tr.appendChild(tdIcon);
        tr.appendChild(tdName);
        tr.appendChild(tdSockets);
        tr.appendChild(tdType);
        tr.appendChild(tdOwner);
        tr.appendChild(tdBtn);
        
        tbody.appendChild(tr);
    });
    
    // Ensure arrows are correct after render
    updateHeaderVisuals('library');

    if (scrollContainer) {
        scrollContainer.scrollTop = savedScrollTop;
    }
}

// Action: Unsocket an item from specific slot and index
function doUnsocketItem(slotId, socketIndex) {
    if (!selectedChar) return;
    selectedChar.unsocketItem(slotId, socketIndex);
    renderCharacterTab(); // Re-render to show empty socket
}

// Action: Socket a library item into a specific slot
function doSocketItemToSlot(libIndex, targetSlotId) {
    if (!selectedChar) return;
    let gemItem = globalItemLibrary[libIndex];
    selectedChar.socketItem(targetSlotId, gemItem);
    renderCharacterTab(); // Re-render to show filled socket
}