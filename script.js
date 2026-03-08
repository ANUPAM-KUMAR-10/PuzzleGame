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
// 3. Shuffle logic
function shuffle() {
    // 1. Start with a perfectly solved board
    tiles = [...Array(15).keys()].map(x => x + 1);
    tiles.push(0); 

    // 2. Simulate 100 real, valid slides to mix it up
    for (let i = 0; i < 100; i++) {
        const emptyIndex = tiles.indexOf(0);
        const validMoves = [];

        const row = Math.floor(emptyIndex / 4);
        const col = emptyIndex % 4;

        // Check which directions are physically legal to move into the empty space
        if (row > 0) validMoves.push(emptyIndex - 4); // Move from Above
        if (row < 3) validMoves.push(emptyIndex + 4); // Move from Below
        if (col > 0) validMoves.push(emptyIndex - 1); // Move from Left
        if (col < 3) validMoves.push(emptyIndex + 1); // Move from Right

        // Pick one legal move at random and swap
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        tiles[emptyIndex] = tiles[randomMove];
        tiles[randomMove] = 0;
    }

    // 3. Redraw board and reset the game state/timer
    renderBoard();
    clearInterval(timerInterval);
    timeElapsed = 0;
    timerDisplay.textContent = timeElapsed;
    gameActive = true;
    isPaused = false;
    pauseBtn.disabled = false;
    pauseBtn.textContent = "Pause";
    
    startTimer();
}

// 4. Timer Logic using setInterval
function startTimer() {
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeElapsed++;
            timerDisplay.textContent = timeElapsed;
        }
    }, 1000);
}

// Pause and Resume logic
pauseBtn.addEventListener('click', () => {
    if (!gameActive) return;
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
    board.style.pointerEvents = isPaused ? "none" : "auto"; // Prevent playing while paused
});

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

// 6. Check if player won and save high score to localStorage
function checkWin() {
    const winPattern = [...Array(15).keys()].map(x => x + 1);
    winPattern.push(0);

    // Verify if current array matches the winning order
    const isWin = tiles.every((val, index) => val === winPattern[index]);

    if (isWin) {
        clearInterval(timerInterval);
        gameActive = false;
        pauseBtn.disabled = true;
        alert(`Congratulations! You solved it in ${timeElapsed} seconds!`);

        // Performance tracking via localStorage
        const currentBest = localStorage.getItem('bestTime');
        if (!currentBest || timeElapsed < parseInt(currentBest)) {
            localStorage.setItem('bestTime', timeElapsed);
            bestTimeDisplay.textContent = timeElapsed;
            alert("New Best Time Record!");
        }
    }
}

// Event listener to kick off the game setup
startBtn.addEventListener('click', shuffle);
initGame();