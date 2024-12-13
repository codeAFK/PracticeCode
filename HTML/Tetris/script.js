const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20); // Scale the canvas for easier drawing

let score = 0;
let board = Array.from({ length: 20 }, () => Array(10).fill(0));
let pieces = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
];

let currentPiece = createPiece();
let position = { x: 3, y: 0 };

function createPiece() {
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    return piece;
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece();
}

function drawBoard() {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] !== 0) {
                context.fillStyle = 'blue';
                context.fillRect(x, y, 1, 1);
            }
        }
    }
}

function drawPiece() {
    context.fillStyle = 'red';
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] !== 0) {
                context.fillRect(position.x + x, position.y + y, 1, 1);
            }
        }
    }
}

function collide() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] !== 0) {
                if (board[y + position.y] && board[y + position.y][x + position.x] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function merge() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] !== 0) {
                board[y + position.y][x + position.x] = 1;
            }
        }
    }
}

function rotate() {
    const rotatedPiece = currentPiece[0].map((_, index) =>
        currentPiece.map(row => row[index]).reverse()
    );
    currentPiece = rotatedPiece;
    if (collide()) {
        currentPiece = rotatedPiece[0].map((_, index) =>
            rotatedPiece.map(row => row[index])).reverse(); // Revert if collision
    }
}

function move(dir) {
    position.x += dir;
    if (collide()) {
        position.x -= dir; // Revert if collision
    }
}

function drop() {
    position.y++;
    if (collide()) {
        position.y--; // Revert if collision
        merge();
        clearLines();
        currentPiece = createPiece();
        position = { x: 3, y: 0 };
        if (collide()) {
            alert("Game Over!");
            resetGame();
        }
    }
}

function clearLines() {
    for (let y = board.length - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(10).fill(0));
            score += 100;
            document.getElementById('score').innerText = `Score: ${score}`;
        }
    }
}

function resetGame() {
    board = Array.from({ length: 20 }, () => Array(10).fill(0));
    score = 0;
    document.getElementById('score').innerText = `Score: ${score}`;
    currentPiece = createPiece();
    position = { x: 3, y: 0 };
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'ArrowDown') drop();
    if (event.key === 'ArrowUp') rotate();
});

setInterval(() => {
    draw();
    drop();
}, 1000); // Game loop, updates every second

draw();