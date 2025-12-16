// --- REUSABLE: Filter and Sort Logic ---
function getProcessedItems(items, context) {
    const state = tableStates[context];
    
    // 1. Filter
    let result = items;
    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        result = result.filter(item => {
            const name = (item.name || "").toLowerCase();
            const type = (item.type || "").toLowerCase();
            const owner = (item.owner || "none").toLowerCase();
            return name.includes(q) || type.includes(q) || owner.includes(q);
        });
    }

    // 2. Sort
    result.sort((a, b) => {
        let valA = (a[state.sortCol] || "").toString().toLowerCase();
        let valB = (b[state.sortCol] || "").toString().toLowerCase();
        
        // Handle numeric sorting if needed (optional) but strings work for Name/Type/Owner
        
        if (valA < valB) return state.sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return state.sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    return result;
}

// --- HANDLERS: HTML Inputs trigger these ---

function handleSort(context, column) {
    const state = tableStates[context];
    
    // Toggle direction if clicking same column, otherwise reset to asc
    if (state.sortCol === column) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
        state.sortCol = column;
        state.sortDir = 'asc';
    }

    // Visual Update for Headers
    updateHeaderVisuals(context);

    // Re-render specific table
    if (context === 'library') renderItemLibrary();
    if (context === 'topgear') renderTopGearSelection();
}

function handleLibrarySearch(query) {
    tableStates.library.searchQuery = query;
    renderItemLibrary();
}

function handleTopGearSearch(query) {
    tableStates.topgear.searchQuery = query;
    renderTopGearSelection();
}

function updateHeaderVisuals(context) {
    // Find the specific table container based on context logic
    let tableId = context === 'library' ? 'item-library-body' : 'topgear-selection-body';
    let thead = document.getElementById(tableId).closest('table').querySelector('thead');
    
    // Reset all
    thead.querySelectorAll('th.sortable').forEach(th => {
        th.classList.remove('asc', 'desc');
    });

    // Find the header responsible for this col
    // (This relies on the onclick text matching. Simple check)
    let activeTh = Array.from(thead.querySelectorAll('th')).find(th => 
        th.getAttribute('onclick') && th.getAttribute('onclick').includes(`'${tableStates[context].sortCol}'`)
    );

    if (activeTh) {
        activeTh.classList.add(tableStates[context].sortDir);
    }
}

// --- Action Functions ---
function doEquipFromLib(index, ringSlot = 1) {
    if (!selectedChar) return;
    let itemData = globalItemLibrary[index];
    
    // Convert plain JSON object to Item Class if not already
    //let newItem = createItem(itemData.name, itemData.slot, itemData.type, itemData.stats, itemData.socketed);
    
    selectedChar.equipItem(itemData, ringSlot);
    selectedChar.calculateFinalStats();
    renderCharacterTab();
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