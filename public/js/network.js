const socket = io();

// Listen for initial data (Local JSON files)
socket.on('initData', (data) => {
    console.log("Received server data", data);
    
    // 1. Load Global Items
    globalItemLibrary = [];
    if (data.items) {
        data.items.forEach(itemData => {
            // Fix: Instantiate properly using the factory function
            // This ensures structure matches (and handles null socketed array)
            let socketed = itemData.socketed || []; 

            let newItem = createItem(
                itemData.name, 
                itemData.slot, 
                itemData.type, 
                itemData.stats, 
                socketed,
                itemData.requiredLevel || 0
            );

            newItem.owner = "None"; // Default owner for local files
            
            // Fix: Use the registrar to add to globalItemLibrary logic
            getOrRegisterItem(newItem);
        });
    }
    
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
    console.log("Received scrapping data from server", data);
    // data contains: { character: Object, inventory: Array }
    const charData = data.character;
    const inventoryData = data.inventory;

    document.getElementById('scrape-status').innerText = "Import Successful!";
    document.getElementById('scrape-status').className = "text-success small";

    let newChar = loadCharacterFromJSON(charData);
    
    if (inventoryData) {
        inventoryData.forEach(itemData => {
            if(itemData.type.includes("Potion") || itemData.type.includes("Cluster") || itemData.type.includes("Signet")) return;
            
            // Skip charms if they were already equipped (and thus registered by loadCharacterFromJSON)
            // But we must check against the *library* now to be safe
            
            let tempItem = createItem(itemData.name, itemData.slot, itemData.type, itemData.stats, itemData.socketed);
            tempItem.owner = charData.charName;

            // Register/Deduplicate
            getOrRegisterItem(tempItem);
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

// Scrape Button
document.getElementById('btn-scrape').addEventListener('click', function() {
    let inputVal = document.getElementById('scraper-url').value.trim();
    if(!inputVal) return;
    
    if (!inputVal.startsWith('http')) { inputVal = `https://tsw.vn.cz/char/${inputVal}`; }
    
    document.getElementById('scrape-status').innerText = "Scraping... (This takes a few seconds)";
    document.getElementById('scrape-status').className = "text-warning small";
    
    socket.emit('scrapeCharacter', inputVal);
});