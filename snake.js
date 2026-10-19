 // [dom selection]: Getting canvas element and its 2D context using const
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');

// [calculation]: Constant layout settings for grid scaling
const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

// [array]: Tracking snake body segments as a list of coordinate objects
let snake = [{ x: 10, y: 10 }];

// [object]: Representing the food position with x and y properties
let food = { x: 5, y: 5 };

// [calculation]: Velocity and score tracking variables
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval = null;

// [calculation]: Retrieve saved high score globally from browser's localStorage
let highScore = localStorage.getItem('highScore') || 0;

// [dom selection]: Update High Score display element on page load
document.addEventListener('DOMContentLoaded', () => {
  highScoreEl.textContent = highScore;
});

// [function]: Traditional function definition for generating random food coordinates (prevents hoisting errors)
function generateFood() {
  food.x = Math.floor(Math.random() * TILE_COUNT);
  food.y = Math.floor(Math.random() * TILE_COUNT);
}

// [function]: Resets the game state back to waiting mode and clears the canvas
const resetGame = () => {
  // [condition]: Clear active game loop interval if running
  if (gameInterval) clearInterval(gameInterval);
  
  // [array]: Reset snake to starting position
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreEl.textContent = score;

  // [function]: Clear canvas graphics and draw blank waiting screen
  ctx.fillStyle = '#020617'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// [function]: Modern arrow function to initialize or start the game state
const startGame = () => {
  if (gameInterval) clearInterval(gameInterval);

  snake = [{ x: 10, y: 10 }];
  dx = 1; 
  dy = 0;
  score = 0;
  scoreEl.textContent = score;
  generateFood();
  
  // [function]: Run game loop timer (Set to 150ms for comfortable speed)
  gameInterval = setInterval(gameLoop, 200);
};

// [function]: Main game loop running every tick to update positions and render visuals
const gameLoop = () => {
  updateSnake();
  
  // [condition]: Check if game-over conditions (walls or self-collision) are met
  if (checkGameOver()) {
    clearInterval(gameInterval);
    
    // [condition]: If-else score evaluation for win vs loss based on 50 points threshold
    if (score >= 50) {
      alert(`🎉 Congratulations! You won! Your final score is ${score}. Amazing job!`);
    } else {
      alert(`😢 You lose! Your final score is ${score}. Try again to reach 50!`);
    }
    
    resetGame();
    return;
  }
  draw();
};

// [function]: Updates snake movement physics and handles eating logic & high score updates
const updateSnake = () => {
  // [object]: Creating a new head coordinate object based on current velocity vectors
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  
  // [array]: Add new head object to the front of the snake array
  snake.unshift(head);

  // [condition]: Check if head coordinates match food coordinates
  if (head.x === food.x && head.y === food.y) {
    // [calculation]: Add 10 points to score calculation
    score += 5;
    scoreEl.textContent = score;

    // [condition]: Check if current score beats the existing high score
    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
      localStorage.setItem('highScore', highScore);
    }

    generateFood();
  } else {
    // [array]: Remove tail segment if no food was eaten
    snake.pop();
  }
};

// [function]: Evaluates boundary wall hits and body collisions
const checkGameOver = () => {
  const head = snake[0];
  
  // [calculation]: Check if head hits grid boundaries
  const hitWall = head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT;
  
  // [array]: Check self-collision using modern array `.some()` method with arrow function
  const hitSelf = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  
  return hitWall || hitSelf;
};

// [function]: Renders all visual elements, curved head, eyes, and food onto canvas
const draw = () => {
  ctx.fillStyle = '#020617'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // [array]: Loop through snake segments using modern array iteration
  snake.forEach((segment, index) => {
    const x = segment.x * GRID_SIZE;
    const y = segment.y * GRID_SIZE;

    // [condition]: Check if current segment is the head or body
    if (index === 0) {
      // Draw curved head using roundRect
      ctx.fillStyle = '#22c55e'; 
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, GRID_SIZE - 2, GRID_SIZE - 2, 8);
      } else {
        ctx.rect(x, y, GRID_SIZE - 2, GRID_SIZE - 2);
      }
      ctx.fill();

      // [calculation]: Position eyes dynamically based on movement direction vectors (dx, dy)
      ctx.fillStyle = '#ffffff'; 
      let eye1X = x + 4, eye1Y = y + 4;
      let eye2X = x + 12, eye2Y = y + 4;

      if (dx === 1) { 
        eye1X = x + 12; eye1Y = y + 3;
        eye2X = x + 12; eye2Y = y + 13;
      } else if (dx === -1) { 
        eye1X = x + 3; eye1Y = y + 3;
        eye2X = x + 3; eye2Y = y + 13;
      } else if (dy === 1) { 
        eye1X = x + 3; eye1Y = y + 12;
        eye2X = x + 13; eye2Y = y + 12;
      } else if (dy === -1) { 
        eye1X = x + 3; eye1Y = y + 3;
        eye2X = x + 13; eye2Y = y + 3;
      }

      // Draw eyes white components
      ctx.beginPath();
      ctx.arc(eye1X, eye1Y, 2.5, 0, Math.PI * 2);
      ctx.arc(eye2X, eye2Y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw pupils inside eyes
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(eye1X, eye1Y, 1, 0, Math.PI * 2);
      ctx.arc(eye2X, eye2Y, 1, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Draw body segments with slight curving
      ctx.fillStyle = '#4ade80'; 
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, GRID_SIZE - 2, GRID_SIZE - 2, 4);
      } else {
        ctx.rect(x, y, GRID_SIZE - 2, GRID_SIZE - 2);
      }
      ctx.fill();
    }
  });

  // [calculation]: Compute center coordinates to draw food (sun) target item
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc((food.x * GRID_SIZE) + GRID_SIZE / 2 - 1, (food.y * GRID_SIZE) + GRID_SIZE / 2 - 1, (GRID_SIZE - 4) / 2, 0, Math.PI * 2);
  ctx.fill();
};

// [dom selection]: Keyboard input event listener using modern arrow function syntax
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && dy !== 1) { dx = 0; dy = -1; }
  if (e.key === 'ArrowDown' && dy !== -1) { dx = 0; dy = 1; }
  if (e.key === 'ArrowLeft' && dx !== 1) { dx = -1; dy = 0; }
  if (e.key === 'ArrowRight' && dx !== -1) { dx = 1; dy = 0; }
});

// [dom selection]: Start button click event listener
startBtn.addEventListener('click', startGame);

// [dom selection]: Initialize blank canvas screen on initial page load
resetGame();