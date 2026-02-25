const board = document.getElementById('board');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const timerDisplay = document.getElementById('timer');
const bestTimeDisplay = document.getElementById('best-time');

let tiles = [];
let timerInterval;
let timeElapsed = 0;
let isPaused = false;
let gameActive = false;

// Load best time from localStorage on page load
if (localStorage.getItem('bestTime')) {
    bestTimeDisplay.textContent = localStorage.getItem('bestTime');
}

// 1. Initialize the board with numbers 1-15 and one empty slot (0)
function initGame() {
    tiles = [...Array(15).keys()].map(x => x + 1);
    tiles.push(0); // 0 represents the empty space
    renderBoard();
}

// 2. Draw the tiles on the screen
function renderBoard() {
    board.innerHTML = '';
    tiles.forEach((tile, index) => {
        const tileDiv = document.createElement('div');
        tileDiv.classList.add('tile');
        if (tile === 0) {
            tileDiv.classList.add('empty');
        } else {
            tileDiv.textContent = tile;
            // Add click event to each valid tile
            tileDiv.addEventListener('click', () => moveTile(index));
        }
        board.appendChild(tileDiv);
    });
}

// 5. Tile movement logic (Math tracking index neighbors)
function moveTile(index) {
    if (!gameActive || isPaused) return;

    const emptyIndex = tiles.indexOf(0);
    
    // Calculate grid positions (row and column)
    const tileRow = Math.floor(index / 4);
    const tileCol = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    // A tile can move if it is directly next to the empty space (adjacent row or column)
    const isAdjacent = (Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol)) === 1;

    if (isAdjacent) {
        // Swap values in the array
        tiles[emptyIndex] = tiles[index];
        tiles[index] = 0;
        renderBoard();
        checkWin();
    }
}