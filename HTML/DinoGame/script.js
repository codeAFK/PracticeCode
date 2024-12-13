const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreDisplay = document.getElementById('score');
let score = 0;
let isJumping = false;
let gameOver = false;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isJumping && !gameOver) {
        jump();
    }
});

function jump() {
    isJumping = true;
    dino.style.bottom = '100px';
    setTimeout(() => {
        dino.style.bottom = '0';
        isJumping = false;
    }, 500);
}

const checkCollision = setInterval(() => {
    const dinoRect = dino.getBoundingClientRect();
    const cactusRect = cactus.getBoundingClientRect();

    if (
        dinoRect.x < cactusRect.x + cactusRect.width &&
        dinoRect.x + dinoRect.width > cactusRect.x &&
        dinoRect.y < cactusRect.y + cactusRect.height &&
        dinoRect.y + dinoRect.height > cactusRect.y
    ) {
        gameOver = true;
        alert('Game Over! Your score: ' + score);
        resetGame();
    } else if (!gameOver) {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
    }
}, 100);

function resetGame() {
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    gameOver = false;
    cactus.style.animation = 'none';
    cactus.offsetHeight; // Trigger reflow
    cactus.style.animation = '';
}