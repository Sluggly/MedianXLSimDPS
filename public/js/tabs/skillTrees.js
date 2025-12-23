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

    // 1. Create SVG Layer
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("skill-arrows-svg");
    container.appendChild(svg);

    // 2. Define Arrowhead Markers
    // Note: refX is set to roughly the size of the arrow so it attaches to the end of the line
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
            refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" 
            refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#d4af37" />
        </marker>
    `;
    svg.appendChild(defs);

    // 3. Render Nodes
    tab.skills.forEach(skill => {
        const node = document.createElement('div');
        node.className = "skill-node";
        node.style.zIndex = "2"; 
        node.dataset.name = skill.name; 

        node.style.gridRow = skill.row;
        node.style.gridColumn = skill.col;

        if (!selectedChar.skills) selectedChar.skills = {};
        const currentPoints = selectedChar.skills[skill.name] || 0;
        if (currentPoints > 0) node.classList.add('allocated');

        // Image Logic
        const iconName = skill.name; 
        const iconPaths = [
            `img/skills/${activeClassData.className.toLowerCase()}/${iconName}.jpg`, 
            `img/skills/mastery/${iconName}.jpg`,                                  
            `img/skills/reward/${iconName}.jpg`,                                   
            `img/skills/oskill/${iconName}.jpg`,                                   
            `img/items/placeholder.jpg`                                            
        ];

        const img = document.createElement('img');
        img.className = "skill-icon";
        img.dataset.pathIndex = 0; 
        img.onerror = function() {
            let idx = parseInt(this.dataset.pathIndex) + 1;
            if (idx < iconPaths.length) {
                this.dataset.pathIndex = idx;
                this.src = iconPaths[idx];
            }
        };
        img.src = iconPaths[0];

        node.appendChild(img);
        
        const lvlBox = document.createElement('div');
        lvlBox.className = "skill-level-box";
        lvlBox.innerText = `${currentPoints}/${skill.maxLevel}`;
        node.appendChild(lvlBox);

        node.onmousedown = (e) => handleSkillClick(e, skill);
        node.onmouseenter = () => showSkillInfo(skill, currentPoints);

        container.appendChild(node);
    });

    // 4. Draw Arrows (With Shortening Logic)
    setTimeout(() => {
        tab.skills.forEach(skill => {
            if (skill.reqSkills && skill.reqSkills.length > 0) {
                skill.reqSkills.forEach(reqName => {
                    const sourceNode = container.querySelector(`.skill-node[data-name="${reqName}"]`);
                    const targetNode = container.querySelector(`.skill-node[data-name="${skill.name}"]`);
                    
                    if (sourceNode && targetNode) {
                        // Get Centers
                        const x1 = sourceNode.offsetLeft + (sourceNode.offsetWidth / 2);
                        const y1 = sourceNode.offsetTop + (sourceNode.offsetHeight / 2);
                        let x2 = targetNode.offsetLeft + (targetNode.offsetWidth / 2);
                        let y2 = targetNode.offsetTop + (targetNode.offsetHeight / 2);

                        // --- NEW: Shorten line so arrow isn't hidden ---
                        // We subtract half the node size (approx 32px) from the endpoint
                        // based on the direction the arrow is entering.
                        const nodeHalfSize = (targetNode.offsetWidth / 2) + 2; // +2 for border/gap

                        // Determine direction
                        const isVertical = Math.abs(x1 - x2) < 5;
                        const isHorizontal = Math.abs(y1 - y2) < 5;

                        // Create Path
                        let pathData = `M ${x1} ${y1}`;
                        
                        if (isVertical) {
                            // Vertical Drop: Shorten Y
                            if (y2 > y1) y2 -= nodeHalfSize; // Downward
                            else y2 += nodeHalfSize;         // Upward
                            pathData += ` L ${x2} ${y2}`;
                        } 
                        else if (isHorizontal) {
                            // Horizontal Move: Shorten X
                            if (x2 > x1) x2 -= nodeHalfSize; // Rightward
                            else x2 += nodeHalfSize;         // Leftward
                            pathData += ` L ${x2} ${y2}`;
                        } 
                        else {
                            // L-Shape Logic
                            // We usually enter the top of the target in L-shapes
                            y2 -= nodeHalfSize; 
                            
                            const midY = y1 + (y2 - y1) / 2; 
                            // 1. Down to Mid
                            // 2. Across to Target X
                            // 3. Down to Target Y (shortened)
                            pathData += ` L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
                        }

                        // Create Line Element
                        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        const isAllocated = (selectedChar.skills[reqName] || 0) > 0;
                        
                        line.classList.add("skill-arrow-line");
                        if (isAllocated) line.classList.add("active");

                        // Attach the Marker
                        line.setAttribute("marker-end", isAllocated ? "url(#arrowhead-active)" : "url(#arrowhead)");
                        line.setAttribute("d", pathData);
                        
                        svg.appendChild(line);
                    }
                });
            }
        });
    }, 0);
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