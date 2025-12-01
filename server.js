const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

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

// --- HELPER: Stats Parser (Text -> Object) ---
function parseStatsFromText(rawLines) {
    let stats = {};
    
    // Regex Mappers to convert NotArmory text to your keys
    const mappings = [
        { regex: /\+(\d+) to Strength/i, key: "Strength" },
        { regex: /\+(\d+) to Dexterity/i, key: "Dexterity" },
        { regex: /\+(\d+) to Vitality/i, key: "Vitality" },
        { regex: /\+(\d+) to Energy/i, key: "Energy" },
        { regex: /\+(\d+)% to Spell Damage/i, key: "SpellDamage" },
        { regex: /\+(\d+)% to Fire Spell Damage/i, key: "FireSpellDamage" },
        { regex: /\+(\d+)% to Cold Spell Damage/i, key: "ColdSpellDamage" },
        { regex: /\+(\d+)% to Lightning Spell Damage/i, key: "LightningSpellDamage" },
        { regex: /\+(\d+)% to Poison Spell Damage/i, key: "PoisonSpellDamage" },
        { regex: /-(\d+)% to Enemy Fire Resistance/i, key: "FirePierce" },
        { regex: /-(\d+)% to Enemy Lightning Resistance/i, key: "LightningPierce" },
        { regex: /-(\d+)% to Enemy Cold Resistance/i, key: "ColdPierce" },
        { regex: /-(\d+)% to Enemy Poison Resistance/i, key: "PoisonPierce" },
        { regex: /\+(\d+) to All Skills/i, key: "AllSkills" },
        // Add more regexes here as needed for other stats
    ];

    rawLines.forEach(line => {
        mappings.forEach(map => {
            const match = line.match(map.regex);
            if (match) {
                // Add value (some items have multiple lines of same stat, technically, usually not)
                let val = parseInt(match[1]);
                if (stats[map.key]) stats[map.key] += val;
                else stats[map.key] = val;
            }
        });
    });

    return stats;
}

// --- SOCKET IO LOGIC ---
io.on('connection', (socket) => {
    console.log('Client connected');

    // 1. Send Local Data on Connection
    let localChars = [];
    let localItems = [];
    let localSkills = [];
    let localEnemies = [];
    
    if (fs.existsSync('./json/characters')) localChars = getAllJsonFiles('./json/characters');
    if (fs.existsSync('./json/items')) localItems = getAllJsonFiles('./json/items');
    if (fs.existsSync('./json/skills')) localSkills = getAllJsonFiles('./json/skills');
    if (fs.existsSync('./json/enemies')) localEnemies = getAllJsonFiles('./json/enemies');

    socket.emit('initData', { 
        characters: localChars, 
        items: localItems,
        skills: localSkills,
        enemies: localEnemies
    });

    // 2. Handle Scrape Request
    socket.on('scrapeCharacter', async (url) => {
        console.log("Scraping URL:", url);
        let browser = null;
        try {
            browser = await puppeteer.launch(); // { headless: false } for debugging
            const page = await browser.newPage();
            
            // Go to NotArmory (Wait for network idle to ensure JS loads)
            await page.goto(url, { waitUntil: 'networkidle2' });

            // A. Scrape Basic Info
            // Note: Selectors might need adjustment based on NotArmory's current DOM
            const charName = await page.$eval('h1', el => el.innerText.split(' ')[0]); // Assuming "Name [Class]" format
            const charClass = await page.$eval('h1', el => {
                 let txt = el.innerText;
                 if(txt.includes("Paladin")) return "Paladin";
                 if(txt.includes("Sorceress")) return "Sorceress";
                 if(txt.includes("Necromancer")) return "Necromancer";
                 if(txt.includes("Amazon")) return "Amazon";
                 if(txt.includes("Druid")) return "Druid";
                 if(txt.includes("Assassin")) return "Assassin";
                 if(txt.includes("Barbarian")) return "Barbarian";
                 return "Paladin"; // Fallback
            });

            // Scrape Level (Example selector, adjust via DevTools on site)
            // Looking for table cell with level
            // We use a generic approach to find text "Level: X"
            const level = await page.evaluate(() => {
                const el = Array.from(document.querySelectorAll('td')).find(td => td.innerText.includes('Level'));
                return el ? parseInt(el.innerText.replace(/\D/g, '')) : 120;
            });

            // Scrape Attributes
            const attributes = await page.evaluate(() => {
                // This assumes standard NotArmory layout. 
                // You might need to refine these selectors based on the specific page structure
                // For now returning defaults to prove concept
                return { strength: 100, dexterity: 100, vitality: 100, energy: 100 };
            });

            // B. Scrape Items
            // NotArmory usually puts items in a specific container
            const itemsData = await page.evaluate(() => {
                const items = [];
                // Selector for Item Cells (Adjust based on actual NotArmory HTML)
                const itemNodes = document.querySelectorAll('.item-box, .item-tooltip'); 
                
                itemNodes.forEach(node => {
                    let name = node.querySelector('.name') ? node.querySelector('.name').innerText : "Unknown";
                    let slot = "Charm"; // Logic to detect slot needed
                    let type = "Charm";
                    
                    // Extract text lines for stats
                    let textLines = node.innerText.split('\n');
                    
                    // Return raw data to node context for parsing
                    items.push({ name, slot, type, rawLines: textLines });
                });
                return items;
            });

            // C. Process Items on Server Side
            let processedItems = itemsData.map(i => {
                return {
                    name: i.name,
                    slot: i.slot, // You need logic to map "Main Hand" -> "Weapon1"
                    type: i.type,
                    stats: parseStatsFromText(i.rawLines),
                    socketed: null
                };
            });

            const newChar = {
                charName: charName,
                charClass: charClass,
                level: level,
                attributes: attributes,
                quests: [],
                items: processedItems,
                spellFocus: 0
            };

            socket.emit('scrapeSuccess', newChar);

        } catch (error) {
            console.error(error);
            socket.emit('scrapeError', "Failed to scrape: " + error.message);
        } finally {
            if (browser) await browser.close();
        }
    });
});

http.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});