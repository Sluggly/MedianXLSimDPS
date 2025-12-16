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

// --- TOOLTIP HELPERS ---
function showItemTooltip(e, item) {
    if (!item) return;
    const tooltip = document.getElementById('global-tooltip');
    
    // Generate content
    let statsTxt = "";
    if (item.stats) {
        for (let [key, val] of Object.entries(item.stats)) {
            
            // 1. OSkills (Special Object Handling)
            if (key === "OSkills" && typeof val === 'object') {
                for (let [skillName, skillLevel] of Object.entries(val)) {
                    statsTxt += `<span class="magic-text">+${skillLevel} to ${skillName}</span><br>`;
                }
                continue;
            }

            // 2. Known Mapped Stats
            if (statConfig[key]) {
                // If it's a boolean flag (true), just print the text
                if (typeof val === 'boolean' && val === true) {
                    statsTxt += `<span class="magic-text">${statConfig[key]}</span><br>`;
                } 
                // If it's a number, format it
                else if (typeof val === 'number') {
                    // Check if value is float (e.g. 25.5), maybe fix to 0 decimals for display unless needed
                    let displayVal = Number.isInteger(val) ? val : val.toFixed(1);
                    let formatted = statConfig[key].replace('%d', displayVal);
                    statsTxt += `<span class="magic-text">${formatted}</span><br>`;
                }
            } 
            // 3. Unmapped/Unknown Stats (Fallback)
            else {
                // Add Spaces to CamelCase (e.g. "MinFireDamage" -> "Min Fire Damage")
                let readableKey = key.replace(/([A-Z])/g, ' $1').trim();
                statsTxt += `<span class="magic-text">${readableKey}: ${val}</span><br>`;
            }
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
                for (let [k, v] of Object.entries(sock.stats)) {
                     let disp = statConfig[k] ? statConfig[k].replace('%d', v) : `${k}: ${v}`;
                     statsTxt += `<span style="color:#6969ff; font-size:0.85em;">&nbsp;&nbsp;${disp}</span><br>`;
                }
            }
        });
        statsTxt += `</div>`;
    }

    tooltip.innerHTML = `<strong>${item.name}</strong><small class="text-muted">${item.type}</small>${statsTxt}`;
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