const puppeteer = require('puppeteer');

async function scrapeCharacterData(url) {
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
            const bodyText = document.body.innerText;
            const loginLink = document.querySelector('a[href*="login.php"]');

            // 1. Check for "Cached version doesn't exist"
            const cacheError = bodyText.includes("Cached version of") && bodyText.includes("doesn't exist");
            
            // 2. Check for "Too many chars viewed" (The new case)
            const rateLimitError = bodyText.includes("Too many chars viewed as anonymous");

            // 3. General check: If we are "Anonymous" and a login link exists
            const isAnonymous = bodyText.includes("Anonymous user") && loginLink !== null;

            return cacheError || rateLimitError || isAnonymous;
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
                let name = "Unknown Item";
                let rawType = "Unknown Type";
                if (html) {
                    let tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    
                    // 1. Ensure <br> tags are treated as newlines for splitting
                    // (innerText usually does this, but innerHTML replacement guarantees it)
                    let rawHtml = tempDiv.innerHTML;
                    rawHtml = rawHtml.replace(/<br\s*\/?>/gi, '\n'); 
                    tempDiv.innerHTML = rawHtml;

                    // 2. Get text and take first non-empty line
                    let fullText = tempDiv.innerText.trim();
                    if (fullText) {
                        const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                        
                        // Line 0 is usually the Name
                        if (lines.length > 0) name = lines[0];
                        
                        // --- TYPE DETECTION LOGIC ---
                        // Priority 1: If Name contains '(', it's likely a socketed base (e.g., "Crystal Sword (6)")
                        // In this case, the Name serves as the Type.
                        if (name.includes('(')) {
                            rawType = name;
                        } 
                        // Priority 2: Check 2nd line
                        else if (lines.length > 1) {
                            // If the second line contains a colon (e.g. "Defense: 10"), it's a STAT.
                            // Therefore Name = Type (e.g. "Ring", "Amulet")
                            if (lines[1].includes(':')) {
                                rawType = name;
                            } else {
                                // Otherwise, the second line is the Type (e.g. "Grand Scepter (4)")
                                rawType = lines[1];
                            }
                        } else {
                            // If only 1 line exists, Name = Type
                            rawType = name; 
                        }
                    }
                }
                
                let img = container.querySelector('img.gear_img') || container.querySelector('img');
                let imgSrc = img ? img.src : "";

                // Socket Parsing
                let socketsRaw = [];
                const socketContainer = container.querySelector('.item-sockets');
                if(socketContainer) {
                    const socketDivs = socketContainer.querySelectorAll('.socket');
                    socketDivs.forEach(sock => {
                        let sNameEl = sock.querySelector('span[class^="color-"]');
                        let sName = sNameEl ? sNameEl.innerText : "Unknown Socket";
                        socketsRaw.push({
                            name: sName,
                            html: sock.innerHTML,
                            text: sock.innerText
                        });
                    });
                }

                return {
                    name: name,
                    slot: slotDef.id,
                    tooltipHtml: html,
                    type: rawType,
                    imgSrc: imgSrc,
                    sockets: socketsRaw
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
                
                const location = tds[2].innerText.trim();
                return {
                    name: name,
                    location: location,
                    type: type,
                    tooltipHtml: html,
                };
            }).filter(i => i !== null);
        });

        return {
            charInfo,
            equippedRaw,
            inventoryRaw
        };

    } 
    catch (error) {
        console.error(error);
    } 
    finally {
        if (browser) await browser.close();
    }
}

module.exports = { scrapeCharacterData };