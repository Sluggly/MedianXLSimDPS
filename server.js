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

    // Helper to add to stats
    const addStat = (key, val) => {
        if (stats[key]) stats[key] += val;
        else stats[key] = val;
    };

    const mappings = [
        // Attributes
        { regex: /\+(\d+) to Strength/i, key: "Strength" },
        { regex: /\+(\d+) to Dexterity/i, key: "Dexterity" },
        { regex: /\+(\d+) to Vitality/i, key: "Vitality" },
        { regex: /\+(\d+) to Energy/i, key: "Energy" },
        { regex: /\+(\d+)% to All Attributes/i, key: "AllAttributesPercent" }, // Logic needed in Character class to apply this
        
        // Base Stats
        { regex: /\+(\d+) to Life/i, key: "Life" },
        { regex: /\+(\d+) to Mana/i, key: "Mana" },
        
        // Spell Damage
        { regex: /\+(\d+)% to Spell Damage/i, key: "SpellDamage" },
        { regex: /\+(\d+)% to Fire Spell Damage/i, key: "FireSpellDamage" },
        { regex: /\+(\d+)% to Cold Spell Damage/i, key: "ColdSpellDamage" },
        { regex: /\+(\d+)% to Lightning Spell Damage/i, key: "LightningSpellDamage" },
        { regex: /\+(\d+)% to Poison Spell Damage/i, key: "PoisonSpellDamage" },
        { regex: /\+(\d+)% to Physical\/Magic Spell Damage/i, key: "PhysicalMagicalSpellDamage" }, // Note: Special MXL stat
        
        // Pierce
        { regex: /-(\d+)% to Enemy Fire Resistance/i, key: "FirePierce" },
        { regex: /-(\d+)% to Enemy Lightning Resistance/i, key: "LightningPierce" },
        { regex: /-(\d+)% to Enemy Cold Resistance/i, key: "ColdPierce" },
        { regex: /-(\d+)% to Enemy Poison Resistance/i, key: "PoisonPierce" },
        
        // Resists
        { regex: /Fire Resist \+(\d+)%/i, key: "FireResist" },
        { regex: /Cold Resist \+(\d+)%/i, key: "ColdResist" },
        { regex: /Lightning Resist \+(\d+)%/i, key: "LightningResist" },
        { regex: /Poison Resist \+(\d+)%/i, key: "PoisonResist" },
        { regex: /Elemental Resists \+(\d+)%/i, key: "ElementalResist" }, // Applies to Fire, Cold, Light
        { regex: /Physical Resist \+(\d+)%/i, key: "PhysicalResist" },
        { regex: /Magic Resist \+(\d+)%/i, key: "MagicalResist" },

        // Max Resists
        { regex: /Maximum Fire Resist \+(\d+)%/i, key: "MaxFireResist" },
        { regex: /Maximum Cold Resist \+(\d+)%/i, key: "MaxColdResist" },
        { regex: /Maximum Lightning Resist \+(\d+)%/i, key: "MaxLightningResist" },
        { regex: /Maximum Poison Resist \+(\d+)%/i, key: "MaxPoisonResist" },
        { regex: /Maximum Elemental Resists \+(\d+)%/i, key: "MaxElementalResist" },

        // Absorb
        { regex: /Fire Absorb \+(\d+)%/i, key: "AbsorbFire" },
        { regex: /Cold Absorb \+(\d+)%/i, key: "AbsorbCold" },
        { regex: /Lightning Absorb \+(\d+)%/i, key: "AbsorbLightning" },

        // Skills & Misc
        { regex: /\+(\d+) to All Skills/i, key: "AllSkill" }, // Matches Character.js naming
        { regex: /\+(\d+) to [\w\s]+ Skill Levels/i, key: "ClassSkill" }, // Generic class skill
        { regex: /\+(\d+) Spell Focus/i, key: "SpellFocus" }
    ];

    rawLines.forEach(line => {
        mappings.forEach(map => {
            const match = line.match(map.regex);
            if (match) { addStat(map.key, parseInt(match[1])); }
        });
    });
    return stats;
}

// --- HELPER: Clean Tooltip HTML to Text Lines ---
function parseTooltipToLines(htmlContent) {
    if (!htmlContent) return [];
    
    // 1. Replace various break tags with newlines
    let text = htmlContent.replace(/<br\s*\/?>/gi, '\n');
    
    // 2. Strip all HTML tags
    text = text.replace(/<[^>]+>/g, '');
    
    // 3. Decode entities
    text = text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');

    // 4. Split and filter empty lines
    return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
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

            // --- LOGIN CHECK LOGIC START ---
            const needsLogin = await page.evaluate(() => {
                // Check for the specific error message div or the login link existence
                const errorMsg = document.body.innerText.includes("Cached version of") && document.body.innerText.includes("doesn't exist");
                const loginLink = document.querySelector('a[href*="login.php"]');
                return errorMsg || (loginLink !== null && document.body.innerText.includes("Anonymous user"));
            });

            if (needsLogin) {
                console.log("Cached version missing or anonymous user. Logging in...");
                
                // 1. Click the login link (or navigate to login page directly if cleaner)
                // We click the link found in the error page
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'networkidle2' }),
                    page.click('a[href*="login.php"]')
                ]);

                // 2. Fill Credentials
                // Credentials provided: SlugglyPublic / Public01
                await page.type('#user', 'SlugglyPublic');
                await page.type('#pass', 'Public01');

                // 3. Submit
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'networkidle2' }),
                    page.click('button[type="submit"]') 
                ]);
                
                console.log("Login successful. Now scraping character data...");
            }

            // 1. Scrape Character Info
            const charInfo = await page.evaluate(() => {
                // Name & Class from H1: "Patriarch dudumamajuju (*lafredxd) [Druid] ..."
                const headers = Array.from(document.querySelectorAll('h1'));
                const mainHeader = headers.find(h => h.innerText.includes('[') && h.innerText.includes(']'));
                const h1Text = mainHeader ? mainHeader.innerText : "";
                
                // Extract Name (word after Patriarch/Matriarch or first word)
                let name = "Unknown";
                if(h1Text.includes("(*")) {
                    const leftSide = h1Text.split("(*")[0].trim();
                    const words = leftSide.split(' ');
                    name = words[words.length - 1]; // Takes "Snoeglay" from "Champion Snoeglay"
                }

                let charClass = "Paladin";
                const classMatch = h1Text.match(/\[(\w+)\]/);
                if(classMatch) charClass = classMatch[1];

                // Stats Table
                // Looking for <th>Strength</th> and getting next <td>
                const getStat = (label) => {
                    const ths = Array.from(document.querySelectorAll('th'));
                    // Find TH with exact text match (ignoring whitespace)
                    const th = ths.find(el => el.innerText.trim() === label);
                    if(th && th.nextElementSibling) {
                        // Use textContent to get raw text even inside <b> tags
                        const rawTxt = th.nextElementSibling.textContent;
                        // Remove all non-digits
                        return parseInt(rawTxt.replace(/\D/g, '')) || 0;
                    }
                    return 0;
                };

                const learnedSkills = [];
                const skillCells = document.querySelectorAll('td.skills_td');
                skillCells.forEach(td => {
                    // Structure is: <span class="float_right">LEVEL</span>SkillName
                    // The skill name is a text node immediately following the span
                    const levelSpans = td.querySelectorAll('span.float_right');
                    levelSpans.forEach(span => {
                        let level = parseInt(span.innerText);
                        let node = span.nextSibling;
                        // Clean up the text node (remove newlines/spaces)
                        if (node && node.nodeType === 3) {
                            let skillName = node.textContent.trim();
                            if(skillName && level > 0) {
                                // Create object matching your structure: {"Mind Flay": 25}
                                let skillObj = {};
                                skillObj[skillName] = level;
                                learnedSkills.push(skillObj);
                            }
                        }
                    });
                });

                return {
                    charName: name,
                    charClass: charClass,
                    level: getStat('Level'),
                    attributes: {
                        strength: getStat('Strength'),
                        dexterity: getStat('Dexterity'),
                        vitality: getStat('Vitality'),
                        energy: getStat('Energy')
                    },
                    learnedSkills: learnedSkills
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
                    let nameEl = tempDiv.querySelector('.color-gold, .color-green, .color-orange, .color-yellow'); // prioritized colors
                    let name = nameEl ? nameEl.innerText : "Unknown Item";
                    
                    let img = container.querySelector('img.gear_img') || container.querySelector('img');
                    let imgSrc = img ? img.src : "";

                    let socketedItems = [];
                    // Look for sibling .item-sockets div
                    const socketContainer = container.querySelector('.item-sockets');
                    if (socketContainer) {
                        const sockets = socketContainer.querySelectorAll('.socket');
                        sockets.forEach(sock => {
                            // Sockets usually have an img and a tooltip in title or data-bs-original-title
                            // Or sometimes the text is inside. 
                            // Based on testDruid.html: <div class='socket'><img src...><br/><span...>Name</span>...</div>
                            let sockHtml = sock.innerHTML; 
                            // Extract name from span inside socket div
                            let sockTempDiv = document.createElement('div');
                            sockTempDiv.innerHTML = sockHtml;
                            let sockNameEl = sockTempDiv.querySelector('span.color-purple, span.color-gold, span.color-orange');
                            let sockName = sockNameEl ? sockNameEl.innerText : "Unknown Gem/Rune";
                            
                            // Extract tooltip for stats parsing later
                            // In the provided HTML, the socket stats are visible text inside the div, separated by <br>
                            // We can use the innerText of the socket div as the "tooltip" for parsing
                            let sockText = sock.innerText; 
                            
                            socketedItems.push({
                                name: sockName,
                                type: "SocketFiller", // Generic type
                                tooltipText: sockText // Pass raw text for parser
                            });
                        });
                    }

                    return {
                        name: name,
                        slot: slotDef.id,
                        tooltipHtml: html,
                        type: slotDef.id, // Temporary type mapping
                        imgSrc: imgSrc,
                        socketedRaw: socketedItems
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
                    function getSlotByType(type) {
                        if(type.includes("Charm") || type.includes("Trophy")) return "Charm";
                        else if(type.includes("Helm") || type.includes("Circlet")) return "Helm";
                        else if(type.includes("Armor") || type.includes("Plate") || type.includes("Mail")) return "Body Armor";
                        else if(type.includes("Ring")) return "Ring";
                        else if(type.includes("Amulet")) return "Amulet";
                        else if(type.includes("Boots")) return "Boots";
                        else if(type.includes("Gloves") || type.includes("Gauntlets")) return "Gloves";
                        else if(type.includes("Belt") || type.includes("Sash")) return "Belt";
                        else if(type.includes("Weapon") || type.includes("Sword") || type.includes("Axe") || type.includes("Bow") || type.includes("Staff")) return "Weapon1";
                        else if(type.includes("Shield") || type.includes("Head")) return "Weapon2";
                        else if(!type.includes("Potion") && !type.includes("Rune")) return "Weapon1";
                    }
                    let slot = getSlotByType(type);
                    
                    const location = tds[2].innerText.trim();
                    return {
                        name: name,
                        slot: slot,
                        location: location,
                        type: type,
                        tooltipHtml: html,
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

            // Helper to clean types
            const cleanItemType = (type, slot) => {
                if(type.includes("Helm") || type.includes("Circlet") || type.includes("Mask")) return "Helm";
                if(type.includes("Armor") || type.includes("Plate") || type.includes("Mail")) return "Body Armor";
                if(type.includes("Ring")) return "Ring";
                if(type.includes("Amulet")) return "Amulet";
                if(type.includes("Boots")) return "Boots";
                if(type.includes("Gloves") || type.includes("Gauntlets")) return "Gloves";
                if(type.includes("Belt") || type.includes("Sash")) return "Belt";
                // Default fallback to slot
                if(slot === "Weapon1" || slot === "Weapon2") return "Weapon"; 
                return type;
            };
            
            // Helper to process a list
            const processList = (list) => {
                return list.map(i => {
                    const lines = parseTooltipToLines(i.tooltipHtml);
                    
                    let cleanType = cleanItemType(i.type, i.slot);

                    let socketedProcessed = [];
                    if (i.socketedRaw && i.socketedRaw.length > 0) {
                        socketedProcessed = i.socketedRaw.map(sock => {
                            // Socket tooltipText is already lines of text essentially
                            let sockLines = sock.tooltipText.split('\n');
                            return {
                                name: sock.name,
                                slot: "Socket",
                                type: "Gem/Rune",
                                stats: parseStatsFromText(sockLines)
                            };
                        });
                    }

                    return {
                        name: i.name,
                        slot: i.slot,
                        type: cleanType,
                        stats: parseStatsFromText(lines),
                        socketed: socketedProcessed
                    };
                });
            };

            const equippedItems = processList(equippedRaw);
            const inventoryItems = processList(inventoryRaw);

            const activeCharms = inventoryItems.filter(item => {
                const isCharm = item.type.includes("Charm") || item.type.includes("Relic"); // Broad check
                const isInInventory = item.location === "Inventory";
                return isCharm && isInInventory;
            }).map(item => {
                // Ensure slot is correct for Character.js loader
                item.slot = item.type.includes("Relic") ? "Relic" : "Charm"; 
                return item;
            });

            const finalItems = [...equippedItems, ...activeCharms];

            const finalChar = {
                charName: charInfo.charName,
                charClass: charInfo.charClass,
                level: charInfo.level,
                attributes: charInfo.attributes,
                items: finalItems,
                learnedSkills: charInfo.learnedSkills,
                quests: []
            };

            // Send Character AND the massive inventory list
            console.log("Scrapping Success, sending data to User.");
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