// Global State
var characterList = []; // Array containing all user created characters
var itemList = []; // Array containing all user created items
var enemyList = []; // Array containing all created enemies
var skillList = []; // Array containing all created skills
let globalItemLibrary = []; // Stores all loaded item JSONs

// Selection State
let selectedChar = null;
let selectedSkill = null;
let selectedEnemy = null;

// Table States (Sorting/Filtering)
const tableStates = {
    library: { sortCol: 'name', sortDir: 'asc', searchQuery: '' },
    topgear: { sortCol: 'name', sortDir: 'asc', searchQuery: '' }
};

var isCharmsSectionOpen = false;