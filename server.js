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
        { regex: /\+(\d+) Spell Focus/i, key: "SpellFocus" }
    ];

    rawLines.forEach(line => {
        mappings.forEach(map => {
            const match = line.match(map.regex);
            if (match) {
                let val = parseInt(match[1]);
                if (stats[map.key]) stats[map.key] += val;
                else stats[map.key] = val;
            }
        });
    });
    return stats;
}

// --- HELPER: Clean Tooltip HTML to Text Lines ---
// Converts "<span class='blue'>+10 Str</span><br><span>+5 Dex</span>" -> ["+10 Str", "+5 Dex"]
function parseTooltipToLines(htmlContent) {
    if (!htmlContent) return [];
    // 1. Replace <br> tags with newlines
    let text = htmlContent.replace(/<br\s*\/?>/gi, '\n');
    // 2. Strip all other HTML tags
    text = text.replace(/<[^>]+>/g, '');
    // 3. Decode HTML entities (basic ones)
    text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    // 4. Split by newline and trim
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
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

            // Set User Agent to avoid being blocked
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            // Go to NotArmory (Wait for network idle to ensure JS loads)
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            // 1. Scrape Character Info
            const charInfo = await page.evaluate(() => {
                // Name & Class from H1: "Patriarch dudumamajuju (*lafredxd) [Druid] ..."
                const headers = Array.from(document.querySelectorAll('h1'));
                const mainHeader = headers.find(h => h.innerText.includes('[') && h.innerText.includes(']'));
                const h1Text = mainHeader ? mainHeader.innerText : "";
                
                // Extract Name (word after Patriarch/Matriarch or first word)
                let name = "Unknown";
                let charClass = "Paladin";
                
                // Simple regex for format: Name (*Account) [Class]
                const nameMatch = h1Text.match(/\s([a-zA-Z0-9_]+)\s\(\*/);
                if(nameMatch) name = nameMatch[1];
                
                const classMatch = h1Text.match(/\[(\w+)\]/);
                if(classMatch) charClass = classMatch[1];

                // Stats Table
                // Looking for <th>Strength</th> and getting next <td>
                const getStat = (label) => {
                    const ths = Array.from(document.querySelectorAll('th'));
                    const th = ths.find(el => el.innerText.trim() === label);
                    if(th && th.nextElementSibling) {
                        return parseInt(th.nextElementSibling.innerText.replace(/\D/g, '')) || 0;
                    }
                    return 0;
                };

                return {
                    charName: name,
                    charClass: charClass,
                    level: getStat('Level'),
                    attributes: {
                        strength: getStat('Strength'),
                        dexterity: getStat('Dexterity'),
                        vitality: getStat('Vitality'),
                        energy: getStat('Energy')
                    }
                };
            });

            // 2. Scrape Equipped Items
            // Elements like: <div class="head"><div class="item-inline" data-bs-original-title="...">
            const equippedRaw = await page.evaluate(() => {
                const slots = [
                    { css: '.head', id: 'Helm' },
                    { css: '.body', id: 'Body Armor' },
                    { css: '.hand1', id: 'Weapon1' },
                    { css: '.hand2', id: 'Weapon2' },
                    { css: '.gloves', id: 'Gloves' },
                    { css: '.belt', id: 'Belt' },
                    { css: '.boots', id: 'Boots' },
                    { css: '.amulet', id: 'Amulet' },
                    { css: '.ring1', id: 'Ring' },
                    { css: '.ring2', id: 'Ring' }
                ];

                return slots.map(slotDef => {
                    const container = document.querySelector(slotDef.css);
                    if (!container) return null;
                    
                    const itemEl = container.querySelector('.item-inline');
                    if (!itemEl) return null;

                    // Get tooltip HTML
                    let html = itemEl.getAttribute('data-bs-original-title') || itemEl.getAttribute('aria-label') || "";
                    
                    // Attempt to extract Name from the HTML (usually inside <span class='color-gold'>Name</span>)
                    let tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    let nameEl = tempDiv.querySelector('.color-gold, .color-green, .color-orange'); // prioritized colors
                    let name = nameEl ? nameEl.innerText : "Unknown Item";
                    
                    let img = container.querySelector('img');
                    let imgSrc = img ? img.src : "";

                    return {
                        name: name,
                        slot: slotDef.id,
                        tooltipHtml: html,
                        type: slotDef.id, // Temporary type mapping
                        imgSrc: imgSrc
                    };
                }).filter(i => i !== null);
            });

            // 3. Scrape Inventory/Stash (#itemdump table)
            const inventoryRaw = await page.evaluate(() => {
                const rows = Array.from(document.querySelectorAll('#itemdump tbody tr'));
                return rows.map(tr => {
                    const tds = tr.querySelectorAll('td');
                    if(tds.length < 3) return null;

                    // Col 0: Name/Stats
                    const itemDiv = tds[0].querySelector('.item-inline');
                    const nameSpan = tds[0].querySelector('span'); // The visible name
                    const html = itemDiv ? (itemDiv.getAttribute('data-bs-original-title') || itemDiv.getAttribute('data-bs-title')) : "";
                    const name = nameSpan ? nameSpan.innerText : "Unknown";

                    // Col 1: Type
                    const type = tds[1].innerText.trim();

                    // Col 2: Location (we ignore for stats, but might filter later)
                    
                    // Simple Slot mapping based on type
                    let slot = "Inventory"; 
                    if(type.includes("Charm") || type.includes("Trophy")) slot = "Charm";
                    else if(type.includes("Helm") || type.includes("Circlet")) slot = "Helm";
                    else if(type.includes("Armor") || type.includes("Plate") || type.includes("Mail")) slot = "Body Armor";
                    else if(type.includes("Ring")) slot = "Ring";
                    else if(type.includes("Amulet")) slot = "Amulet";
                    else if(type.includes("Boots")) slot = "Boots";
                    else if(type.includes("Gloves") || type.includes("Gauntlets")) slot = "Gloves";
                    else if(type.includes("Belt") || type.includes("Sash")) slot = "Belt";
                    else if(type.includes("Weapon") || type.includes("Sword") || type.includes("Axe") || type.includes("Bow") || type.includes("Staff")) slot = "Weapon1";
                    else if(type.includes("Shield") || type.includes("Head")) slot = "Weapon2";
                    else if(!type.includes("Potion") && !type.includes("Rune")) slot = "Weapon1";
                    return {
                        name: name,
                        slot: slot,
                        type: type,
                        tooltipHtml: html
                    };
                }).filter(i => i !== null);
            });

            // 4. Process on Server (Parse Stats)

            // 4. Filtering Logic (Remove Junk)
            const junkKeywords = [
                "Rune", "Gem", "Shrine", "Potion", "Scroll", "Oil", 
                "Essence", "Cluster", "Signet", "Barrel", "Key", 
                "Apple", "Dye", "Reagent", "Box", "Crate", "Catalyst"
            ];

            const isJunk = (item) => {
                // If it's equipped, it's never junk (even if it's a rune inside a socket, but here we scrape items)
                // For inventory items:
                if (junkKeywords.some(keyword => item.type.includes(keyword))) return true;
                if (item.type === "Gold") return true;
                return false;
            };
            
            // Helper to process a list
            const processList = (list) => {
                return list.map(i => {
                    const lines = parseTooltipToLines(i.tooltipHtml);
                    
                    // Try to refine "Type" for images based on the name or generic slot
                    // e.g. if type is "Helm", set image type to "Helm"
                    let cleanType = i.type;
                    if(cleanType.includes("Helm") || cleanType.includes("Circlet")) cleanType = "Helm";
                    else if(cleanType.includes("Ring")) cleanType = "Ring";
                    else if(cleanType.includes("Amulet")) cleanType = "Amulet";
                    else if(cleanType.includes("Boots")) cleanType = "Boots";
                    else if(cleanType.includes("Gloves")) cleanType = "Gloves";
                    else if(cleanType.includes("Belt")) cleanType = "Belt";
                    // ... This ensures icons map correctly to img/items/Helm.png etc.

                    return {
                        name: i.name,
                        slot: i.slot,
                        type: cleanType,
                        stats: parseStatsFromText(lines),
                        socketed: null
                    };
                });
            };

            const equippedItems = processList(equippedRaw);
            const inventoryItems = processList(inventoryRaw);

            const finalChar = {
                charName: charInfo.charName,
                charClass: charInfo.charClass,
                level: charInfo.level,
                attributes: charInfo.attributes,
                items: equippedItems, // Only equipped goes here
                quests: [],
                spellFocus: equippedItems.reduce((acc, i) => acc + (i.stats.SpellFocus || 0), 0) // Basic calc
            };

            // Send Character AND the massive inventory list
            socket.emit('scrapeSuccess', { 
                character: finalChar, 
                inventory: inventoryItems 
            });

        } catch (error) {
            console.error(error);
            socket.emit('scrapeError', "Scrape failed: " + error.message);
        } finally {
            if (browser) await browser.close();
        }
    });
});

http.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});