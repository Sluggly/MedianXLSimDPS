// --- IMAGE HELPERS ---
function setItemImage(imgElement, item) {
    // Define the fallback chain
    const candidates = [
        `img/items/${item.name}.png`, // 1. Specific Name (e.g. "Umbaru Treasure.png")
        `img/items/${item.type}.png`, // 2. Item Type (e.g. "Charm.png")
        `img/items/${item.slot}.png`, // 3. Item Slot (e.g. "Helm.png")
        'img/placeholder.png'         // 4. Final Fallback
    ];

    let attemptIndex = 0;
    
    // Set initial source
    imgElement.src = candidates[0];

    // On error, try the next one in the list
    imgElement.onerror = function() {
        attemptIndex++;
        if (attemptIndex < candidates.length) { this.src = candidates[attemptIndex]; } 
        else { this.onerror = null; }
    };
}

const statMergeRules = [
    { 
        min: "MinDamage", max: "MaxDamage", 
        format: "Adds %min-%max Damage" 
    },
    { 
        min: "MinFireDamage", max: "MaxFireDamage", 
        format: "Adds %min-%max Fire Damage" 
    },
    { 
        min: "MinLightningDamage", max: "MaxLightningDamage", 
        format: "Adds %min-%max Lightning Damage" 
    },
    { 
        min: "MinColdDamage", max: "MaxColdDamage", 
        format: "Adds %min-%max Cold Damage" 
    },
    { 
        min: "MinMagicDamage", max: "MaxMagicDamage", 
        format: "Adds %min-%max Magic Damage" 
    },
    {
        min: "MinPhysicalDamage", max: "MaxPhysicalDamage",
        format: "Adds %min-%max Damage"
    },
    { 
        min: "OneHandMinDamage", max: "OneHandMaxDamage", 
        format: "One-Hand Damage: %min to %max",
        color: "#ffffff" 
    },
    { 
        min: "TwoHandMinDamage", max: "TwoHandMaxDamage", 
        format: "Two-Hand Damage: %min to %max",
        color: "#ffffff"
    },
    { 
        min: "ThrowMinDamage", max: "ThrowMaxDamage", 
        format: "Throw Damage: %min to %max",
        color: "#ffffff"
    },
    { 
        min: "SocketsFilled", max: "SocketsMax", 
        format: "Socketed (%min/%max)" 
    },
    {
        keys: ["Strength", "Dexterity", "Vitality", "Energy"],
        format: "+%val to All Attributes",
        color: "#6969ff"
    },
    {
        keys: ["StrengthPercent", "DexterityPercent", "VitalityPercent", "EnergyPercent"],
        format: "+%val% to All Attributes",
        color: "#6969ff"
    },
    {
        keys: ["FireResist", "ColdResist", "LightningResist", "PoisonResist"],
        format: "Elemental Resists +%val%",
        color: "#6969ff"
    },
    {
        keys: ["MaxFireResist", "MaxColdResist", "MaxLightningResist", "MaxPoisonResist"],
        format: "Maximum Elemental Resists +%val%",
        color: "#6969ff"
    },
    {
        keys: ["FireSpellDamage", "ColdSpellDamage", "LightningSpellDamage", "PoisonSpellDamage", "PhysicalMagicalSpellDamage"],
        format: "+%val% to Spell Damage",
        color: "#6969ff"
    },
    {
        keys: ["FirePierce", "ColdPierce", "LightningPierce", "PoisonPierce"],
        format: "-%val% to Enemy Elemental Resistances",
        color: "#6969ff"
    },
    {
        keys: ["AttackSpeed", "CastSpeed", "HitRecovery", "BlockSpeed"],
        format: "+%val% Combat Speeds",
        color: "#6969ff"
    },
    {
        min: "LightDmgPerDef_Amt", max: "LightDmgPerDef_Per",
        format: "+%min Lightning Damage per %max% Bonus to Defense",
        color: "#ffa500"
    },
    {
        min: "LightDmgPerPhys_Amt", max: "LightDmgPerPhys_Per",
        format: "+%min Lightning Damage per %max% Total Weapon Physical Damage Bonus",
        color: "#ffa500"
    }
];

// --- TOOLTIP HELPERS ---
function showItemTooltip(e, item) {
    if (!item) return;
    const tooltip = document.getElementById('global-tooltip');
    
    // Generate content
    let statsTxt = "";

    const renderStatsObj = (sObj) => {
        let txt = "";

        const processedKeys = new Set();

        for (let [key, val] of Object.entries(sObj)) {
            if (processedKeys.has(key)) continue;
            let merged = false;
            const rule = statMergeRules.find(r => 
                (r.min === key || r.max === key) || // Pair logic
                (r.keys && r.keys.includes(key))    // Array logic
            );
            if (rule) {
                // 1. Handle Pairs (Min/Max)
                if (rule.min && rule.max) {
                    const otherKey = (key === rule.min) ? rule.max : rule.min;
                    if (sObj[otherKey] !== undefined) {
                        const minVal = (key === rule.min) ? val : sObj[otherKey];
                        const maxVal = (key === rule.min) ? sObj[otherKey] : val;
                        
                        let displayLine = rule.format.replace('%min', minVal).replace('%max', maxVal);
                        let style = rule.color ? `style="color: ${rule.color}; font-weight: 500;"` : 'class="magic-text"';
                        txt += `<span ${style}>${displayLine}</span><br>`;
                        
                        processedKeys.add(key);
                        processedKeys.add(otherKey);
                        merged = true;
                    }
                }
                // 2. Handle Groups (All Attributes, etc.)
                else if (rule.keys) {
                    // Check if ALL keys exist
                    const allPresent = rule.keys.every(k => sObj[k] !== undefined);
                    
                    if (allPresent) {
                        // Check if ALL values are EQUAL
                        const firstVal = sObj[rule.keys[0]];
                        const allEqual = rule.keys.every(k => sObj[k] === firstVal);

                        if (allEqual) {
                            let displayLine = rule.format.replace('%val', firstVal);
                            let style = rule.color ? `style="color: ${rule.color}; font-weight: 500;"` : 'class="magic-text"';
                            txt += `<span ${style}>${displayLine}</span><br>`;

                            // Mark ALL keys as processed
                            rule.keys.forEach(k => processedKeys.add(k));
                            merged = true;
                        }
                    }
                }
            }
            if (merged) continue;
            // 1. OSkills (Special Object Handling)
            if (key === "OSkills" && typeof val === 'object') {
                for (let [skillName, skillLevel] of Object.entries(val)) {
                    txt += `<span class="magic-text">+${skillLevel} to ${skillName}</span><br>`;
                }
                continue;
            }

            // 2. Known Mapped Stats
            const config = statConfig[key];
            if (config) {
                // Determine Format and Color
                // Default color class is .magic-text (blueish), overriden by inline style if provided
                let formatStr = "";
                let colorStyle = ""; 

                if (typeof config === 'string') {
                    formatStr = config;
                } else {
                    formatStr = config.format;
                    colorStyle = `style="color: ${config.color}; font-weight: 500;"`; 
                }

                let displayLine = "";

                // Format the string based on value type
                if (typeof val === 'boolean' && val === true) {
                    displayLine = formatStr;
                } 
                else if (typeof val === 'number') {
                    let displayVal = Number.isInteger(val) ? val : val.toFixed(1);
                    if (val < 0 && formatStr.includes('+%d')) { formatStr = formatStr.replace('+%d', '%d'); }
                    displayLine = formatStr.replace('%d', displayVal);
                }

                // Append line
                // If colorStyle exists, use a span with that style. Otherwise use standard class.
                if (colorStyle) {
                    txt += `<span ${colorStyle}>${displayLine}</span><br>`;
                } else {
                    txt += `<span class="magic-text">${displayLine}</span><br>`;
                }
            }
            // 3. Unmapped/Unknown Stats (Fallback)
            else {
                // Add Spaces to CamelCase (e.g. "MinFireDamage" -> "Min Fire Damage")
                let readableKey = key.replace(/([A-Z])/g, ' $1').trim();
                txt += `<span class="magic-text">${readableKey}: ${val}</span><br>`;
            }
        }
        return txt;
    };
    
    if (item.stats) {
        // DETECT GEM/RUNE STRUCTURE
        if (item.stats.Weapon || item.stats.Armor || item.stats.Shield) {
            if (item.stats.Weapon) {
                statsTxt += `<div class="text-warning small border-bottom mb-1 mt-2">Weapons</div>${renderStatsObj(item.stats.Weapon)}`;
            }
            if (item.stats.Armor) {
                statsTxt += `<div class="text-warning small border-bottom mb-1 mt-2">Armor</div>${renderStatsObj(item.stats.Armor)}`;
            }
            if (item.stats.Shield) {
                statsTxt += `<div class="text-warning small border-bottom mb-1 mt-2">Shields</div>${renderStatsObj(item.stats.Shield)}`;
            }
        } else {
            // Standard Item (Flat stats)
            statsTxt += renderStatsObj(item.stats);
        }
    }
    
    // Sockets Section (Optional visual separator)
    if (item.socketed && item.socketed.length > 0) {
        statsTxt += `<div style="margin-top:5px; border-top:1px solid #444; padding-top:5px;">`;
        item.socketed.forEach(sock => {
            statsTxt += `<span style="color:#aaa; font-size:0.9em;">${sock.name}</span><br>`;
            // Recursively show socket stats? Or just name to keep it clean.
            // Let's just show stats for sockets briefly if you want:
            if(sock.stats) {
                let inner = renderStatsObj(sock.stats);
                // Indent the result
                inner = inner.replace(/class="magic-text"/g, 'style="color:#6969ff; font-size:0.85em;"');
                inner = inner.replace(/<br>/g, '<br>&nbsp;&nbsp;'); 
                statsTxt += `&nbsp;&nbsp;${inner}`;
            }
        });
        statsTxt += `</div>`;
    }

    // Add Required Level to the header if it exists and is > 0
    let reqLevelHtml = "";
    if (item.requiredLevel > 0) {
        reqLevelHtml = `<div style="color: white; font-size: 0.9em; margin-bottom: 5px;">Required Level: ${item.requiredLevel}</div>`;
    }

    tooltip.innerHTML = `<strong>${item.name}</strong><small class="text-muted">${item.type}</small>${reqLevelHtml}${statsTxt}`;
    tooltip.style.display = 'block';
    moveItemTooltip(e);
}

// Helps tooltip always be visible on screen
function moveItemTooltip(e) {
    const tooltip = document.getElementById('global-tooltip');
    const offset = 15;
    
    // Dimensions
    const tipWidth = tooltip.offsetWidth;
    const tipHeight = tooltip.offsetHeight;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    // 1. Initial Position: Right & Bottom of cursor
    let left = e.clientX + offset;
    let top = e.clientY + offset;

    // 2. Horizontal Check (Right Edge)
    // If it goes off the right, flip to the left of the cursor
    if (left + tipWidth > winWidth) {
        left = e.clientX - tipWidth - offset;
    }
    // Safety: Don't go off the left edge
    if (left < 0) left = 10;

    // 3. Vertical Check (Bottom Edge)
    // If it goes off the bottom, flip to above the cursor
    if (top + tipHeight > winHeight) {
        top = e.clientY - tipHeight - offset;
    }

    // 4. Vertical Check (Top Edge)
    // If flipping up made it go off the top (negative value),
    // pin it to the top of the screen with a small margin.
    if (top < 0) { top = 10;  }

    // Apply
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

function hideItemTooltip() {
    document.getElementById('global-tooltip').style.display = 'none';
}

// --- Tab Navigation Logic ---
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(t => t.style.display = 'none');

    // Show selected tab
    document.getElementById('tab-' + tabName).style.display = 'block';

    // Update Nav Links active state
    const links = document.querySelectorAll('.nav-link');
    links.forEach(l => l.classList.remove('active'));
    
    // Trigger specific renders based on tab
    if (tabName === 'character') renderCharacterTab(); 
    if (tabName === 'topgear') renderTopGearSelection();
}

// Generates the socket visual container for any item
function createSocketVisuals(item, slotId = null) {
    const container = document.createElement('div');
    container.className = "d-flex align-items-center"; 

    // Determine max sockets
    let maxSockets = 0;
    if (item.stats && item.stats.SocketsMax) maxSockets = item.stats.SocketsMax;
    // Fallback: If we parsed sockets but didn't get a Max Stat (e.g. legacy data), use filled count
    if (item.socketed && item.socketed.length > maxSockets) maxSockets = item.socketed.length;

    if (maxSockets === 0) return container; // Return empty container

    const filledSockets = item.socketed ? item.socketed.length : 0;

    for (let i = 0; i < maxSockets; i++) {
        let sockDiv = document.createElement('div');
        // Visual Styling (Matching Equipped Gear look)
        sockDiv.style.width = "24px";  // Slightly smaller for table compacting
        sockDiv.style.height = "24px";
        sockDiv.style.marginRight = "2px";
        sockDiv.style.display = "inline-block";
        sockDiv.style.position = "relative";
        sockDiv.style.verticalAlign = "middle";
        sockDiv.style.border = "1px solid #555";
        sockDiv.style.backgroundColor = "#000";
        sockDiv.style.cursor = "help";

        if (i < filledSockets) {
            // --- FILLED SOCKET ---
            let gem = item.socketed[i];
            let sockImg = document.createElement('img');
            sockImg.style.width = "100%";
            sockImg.style.height = "100%";
            sockImg.style.objectFit = "contain";
            sockImg.style.display = "block";
            
            setItemImage(sockImg, gem);
            
            // Tooltip
            sockDiv.addEventListener('mousemove', (e) => showItemTooltip(e, gem));
            sockDiv.addEventListener('mouseleave', hideItemTooltip);

            if (slotId) {
                sockDiv.style.cursor = "pointer"; // Change cursor
                sockDiv.style.borderColor = "#a00"; // Red border hint
                sockDiv.onclick = (e) => {
                    e.stopPropagation();
                    hideItemTooltip();
                    doUnsocketItem(slotId, i);
                };
            }
            
            sockDiv.appendChild(sockImg);
        } else {
            // --- EMPTY SOCKET ---
            sockDiv.innerHTML = '<div style="width: 10px; height: 10px; background: #333; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: inset 0 0 2px #000;"></div>';
            
            const emptySocketItem = { name: "Empty Socket", type: "Socket", stats: { "Info": "Can hold a Gem, Rune, or Jewel" } };
            sockDiv.addEventListener('mousemove', (e) => showItemTooltip(e, emptySocketItem));
            sockDiv.addEventListener('mouseleave', hideItemTooltip);
        }
        
        container.appendChild(sockDiv);
    }
    return container;
}