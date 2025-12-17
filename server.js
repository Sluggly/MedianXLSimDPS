const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');

// Custom Modules
const { scrapeCharacterData } = require('./utils/notarmory');
const { processItems } = require('./utils/parser');

const PORT = 8080;

// Serve static files from 'public' folder
app.use(express.static('public'));

// --- HELPER: Recursive File Search ---
function getAllJsonFiles(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllJsonFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if(file.endsWith(".json")) {
                let content = fs.readFileSync(path.join(dirPath, file), 'utf8');
                try {
                    arrayOfFiles.push(JSON.parse(content));
                } catch (e) {
                    console.error("Error parsing JSON:", file);
                }
            }
        }
    });
    return arrayOfFiles;
}

// --- SOCKET IO LOGIC ---
io.on('connection', (socket) => {
    console.log('Client connected');

    // Send Local Data on Connection
    socket.emit('initData', { 
        characters: getAllJsonFiles('./json/characters'), 
        items: getAllJsonFiles('./json/items'),
        skills: getAllJsonFiles('./json/skills'),
        enemies: getAllJsonFiles('./json/enemies')
    });

    // 2. Handle Scrape Request
    socket.on('scrapeCharacter', async (url) => {
        try {
            // A. Scrape Raw Data (Puppeteer)
            const rawData = await scrapeCharacterData(url);
            
            // B. Process Items (Logic)
            const equippedItems = processItems(rawData.equippedRaw);
            const inventoryItems = processItems(rawData.inventoryRaw);

            // C. Auto-Equip Charms Logic
            const activeCharms = inventoryItems.filter(item => {
                const isCharm = item.type.includes("Charm") || item.type.includes("Relic");
                const isInInventory = item.location === "Inventory";
                return isCharm && isInInventory;
            }).map(item => {
                item.slot = item.type.includes("Relic") ? "Relic" : "Charm"; 
                return item;
            });

            const finalItems = [...equippedItems, ...activeCharms];

            // D. Construct Final Object
            const finalChar = {
                charName: rawData.charInfo.charName,
                charClass: rawData.charInfo.charClass,
                level: rawData.charInfo.level,
                attributes: rawData.charInfo.attributes,
                items: finalItems,
                learnedSkills: rawData.charInfo.learnedSkills,
                quests: []
            };

            // E. Send to Client
            console.log("Scrape Success, sending data.");
            socket.emit('scrapeSuccess', { 
                character: finalChar, 
                inventory: inventoryItems 
            });

        } catch (error) {
            console.error(error);
            socket.emit('scrapeError', "Scrape failed: " + error.message);
        }
    });
});

http.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});