let currentSkillData = null; // The loaded JSON for the class
let activePageIdx = 0; // e.g. "fire"
var globalSkillTreeData = {};

// 2. Render the Top Navigation (Tabs)
function renderSkillNav() {
    const nav = document.getElementById('skill-pages-nav');
    nav.innerHTML = "";

    activeClassData.tabs.forEach((tab, index) => {
        const li = document.createElement('li');
        li.className = "nav-item";
        
        const a = document.createElement('a');
        a.className = `nav-link ${index === activePageIdx ? 'active' : ''} btn-sm`;
        a.href = "#";
        a.innerText = tab.name;
        a.onclick = (e) => {
            e.preventDefault();
            activePageIdx = index;
            renderSkillNav(); // Re-render nav to update active class
            renderSkillGrid(index);
        };

        li.appendChild(a);
        nav.appendChild(li);
    });
}

// 3. Render the Grid
function renderSkillGrid(pageIndex) {
    const container = document.getElementById('skill-grid');
    container.innerHTML = "";

    const tab = activeClassData.tabs[pageIndex];
    if (!tab) return;

    tab.skills.forEach(skill => {
        // 1. Create Node
        const node = document.createElement('div');
        node.className = "skill-node";
        
        // 2. Position (Grid is 1-based)
        node.style.gridRow = skill.row;
        node.style.gridColumn = skill.col;

        // 3. Get Current Points
        // Ensure selectedChar.skills exists
        if (!selectedChar.skills) selectedChar.skills = {};
        const currentPoints = selectedChar.skills[skill.name] || 0;
        
        if (currentPoints > 0) node.classList.add('allocated');

        // 4. Content (Icon + Level)
        const iconName = skill.name; 
        
        node.innerHTML = `
            <img src="img/skills/${activeClassData.className.toLowerCase()}/${iconName}.jpg" 
                 class="skill-icon" 
                 onerror="this.src='img/skills/Placeholder.jpg'">
            <div class="skill-level-box">${currentPoints}/${skill.maxLevel}</div>
        `;

        // 5. Events
        node.onmousedown = (e) => handleSkillClick(e, skill);
        node.onmouseenter = () => showSkillInfo(skill, currentPoints);

        container.appendChild(node);
    });
}

function handleSkillClick(e, skill) {
    if (!selectedChar) return;
    if (!selectedChar.skills) selectedChar.skills = {};

    let current = selectedChar.skills[skill.name] || 0;
    const max = skill.maxLevel;

    // Left Click (Add)
    if (e.button === 0) {
        if (current < max) {
            // Logic: Check Required Level
            if (selectedChar.level < skill.reqLevel) {
                console.log("Level too low");
                return; // Or show visual feedback
            }
            // Logic: Check Prerequisites
            if (skill.reqSkills && skill.reqSkills.length > 0) {
                const hasPreReq = skill.reqSkills.every(reqName => (selectedChar.skills[reqName] || 0) > 0);
                if (!hasPreReq) {
                    console.log("Missing Prerequisites");
                    return;
                }
            }
            
            selectedChar.skills[skill.name] = current + 1;
        }
    }
    // Right Click (Remove)
    else if (e.button === 2) {
        if (current > 0) {
            selectedChar.skills[skill.name] = current - 1;
            if (selectedChar.skills[skill.name] === 0) delete selectedChar.skills[skill.name];
        }
    }
    // Shift + Click (Max)
    else if (e.shiftKey) {
        // Simple max logic (ignoring remaining points for now)
        selectedChar.skills[skill.name] = max;
    }

    // Refresh View
    renderSkillGrid(activePageIdx);
    showSkillInfo(skill, selectedChar.skills[skill.name] || 0); // Update details panel
    
    // Trigger Global Stat Recalculation if needed
    selectedChar.calculateFinalStats(); 
}

function showSkillInfo(skill, currentPoints) {
    const panel = document.getElementById('skill-details-panel');
    
    // Determine Color for Next Level
    const nextPoints = currentPoints + 1;
    
    panel.innerHTML = `
        <h5 class="text-warning">${skill.name}</h5>
        <div class="small text-muted mb-3">
            Required Level: ${skill.reqLevel}<br>
            Max Level: ${skill.maxLevel}
        </div>
        <p class="small text-white">${skill.description}</p>
        
        <hr class="border-secondary">
        
        <div class="small">
            <div class="text-info font-weight-bold">Current Level: ${currentPoints}</div>
            <div class="text-muted pl-2">
                TODO: Calculate Stats for Lvl ${currentPoints}
            </div>
            
            <br>
            
            <div class="text-success font-weight-bold">Next Level: ${nextPoints}</div>
            <div class="text-muted pl-2">
                TODO: Calculate Stats for Lvl ${nextPoints}
            </div>
        </div>
    `;
}

// 5. Entry Point (Call this from index.html onclick)
function renderSkillsTab() {
    if (!selectedChar) return;
    
    // Default to Paladin if class not found or data missing
    const charClass = selectedChar.charClass;
    activeClassData = globalSkillTreeData[charClass];
    console.log(activeClassData);
    console.log(globalSkillTreeData);
    console.log(globalSkillTreeData);
    if (!activeClassData) {
        document.getElementById('skill-grid-container').innerHTML = `<div class="text-white">No skill data for ${charClass}</div>`;
        return;
    }

    renderSkillNav();
    renderSkillGrid(activePageIdx);
}