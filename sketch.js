// Game variables
let x = 100;
let spacex = 120; 
let spacey = 120; 
let bullets = [];
let enemies = [];
let coins = [];
let score = 0;
let coinsCollected = 0;
let gamePaused = false;
let gameOver = false;


// Image variables
let spaceCraft;
let bulletImage; 
let coinImage;
let enemyImages = [];
let enemyTypes = ["rock1", "rock2", "purpleEnemy", "spaceShip", "spaceShip2", "spaceRocket", "spaceCraft1", "spaceCraft2", "spaceCraft3"];
let enemySizes = [70, 70, 60, 100, 75, 90, 120, 140, 120];
let bg;


// Score management
let highScore = localStorage.getItem('highScore') || 0;

// Saved game states
let savedStateEnemies, savedStateBullets, savedStateCoins;


// Preload function for loading images before the game starts
function preload() {
  for (let i = 0; i < enemyTypes.length; i++) {
    let img = loadImage("Tools/" + enemyTypes[i] + ".png");
    enemyImages[i] = img;
  }
  spaceCraft = loadImage("Tools/Spacecraft.png");
  bulletImage = loadImage("Tools/bullet2.png");
  coinImage = loadImage("Tools/coin1.png");
  bg = loadImage("Tools/space shooter background.png");
}


//The enemies' class
class Enemy {
  constructor(x, y, img, enemySize, enemyType) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.enemySize = enemySize;
    this.type = enemyType;
    this.width = enemySize;
    this.height = enemySize;
  }

  saveState() {
    return {
      x: this.x,
      y: this.y,
      enemySize: this.enemySize,
      img: this.img,
      type: this.type,
    };
  }

  draw() {
    image(this.img, this.x, this.y, this.enemySize, this.enemySize);
    this.y += 2;
  }

  isOffScreen() {
    return this.y > height;
  }

  collidesWith(bullet) {
    return dist(this.x, this.y, bullet.x, bullet.y) < this.enemySize-5;
  }

  reset() {
    this.x = random(this.enemySize/2, width - this.enemySize*2);
    this.y = random(-1200, 0);
}
  

collidesWithSpacecraft(spacecraftX, spacecraftY, spacecraftWidth, spacecraftHeight) {
  // Define the hitbox of the spacecraft's tip
  let tipBoxHeight = spacecraftHeight / 4;  // The height is a quarter of the spacecraft's height
  let tipBoxWidth = spacecraftWidth / 2;  // The width is half of the spacecraft's width
  let tipBoxX = spacecraftX + spacecraftWidth / 4;  // The X position is a quarter of the spacecraft's width from the left edge
  let tipBoxY = spacecraftY;  // The Y position is the same as the spacecraft's Y position

  // Define the hitbox of the spacecraft's wings
  let wingBoxHeight = spacecraftHeight / 2;  // The height is half of the spacecraft's height
  let wingBoxWidth = spacecraftWidth;  // The width is the same as the spacecraft's width
  let wingBoxX = spacecraftX;  // The X position is the same as the spacecraft's X position
  let wingBoxY = spacecraftY + tipBoxHeight;  // The Y position is the same as the bottom edge of the tip's hitbox

  // Check whether the enemy's position collides with the tip's hitbox
  let collidesWithTip = tipBoxX < this.x + this.enemySize &&
    tipBoxX + tipBoxWidth > this.x &&
    tipBoxY < this.y + this.enemySize/2 &&  // Subtract half of enemy size
    tipBoxY + tipBoxHeight > this.y;

  // Check whether the enemy's position collides with the wings' hitbox
  let collidesWithWings = wingBoxX < this.x + this.enemySize &&
    wingBoxX + wingBoxWidth > this.x &&
    wingBoxY < this.y + this.enemySize/2 &&  // Subtract half of enemy size
    wingBoxY + wingBoxHeight > this.y;

  // Return true if the enemy collides with either the tip's hitbox or the wings' hitbox, and false otherwise
  return collidesWithTip || collidesWithWings;
}
}


//The coins' class
class Coin {
  constructor(x, y, img, coinSize) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.coinSize = coinSize;
    this.width = coinSize;
    this.height = coinSize;
  }

  saveState() {
    return {
      x: this.x,
      y: this.y,
      coinSize: this.coinSize,
      img: this.img
    };
  }

  draw() {
    image(this.img, this.x, this.y, this.coinSize, this.coinSize);
    this.y += 2;
  }

  isOffScreen() {
    return this.y > height;
  }

  collidesWith(bullet) {
    return dist(this.x, this.y, bullet.x, bullet.y) < this.coinSize;
  }
  
  reset() {
    this.x = random(this.coinSize*2, width - this.coinSize*2);
    this.y = random(-1200, 0);
  }

  collidesWithSpacecraft(spacecraftX, spacecraftY, spacecraftWidth, spacecraftHeight) {
    return (
      this.x < spacecraftX + spacecraftWidth &&
      this.x + this.coinSize > spacecraftX &&
      this.y < spacecraftY + spacecraftHeight &&
      this.y + this.coinSize > spacecraftY
    );
  }
}


// Setup function for initializing game environment and spawning objects
function setup() {
  createCanvas(1500, 1000);
  spaceCraft.resize(spacex, spacey); 
  x = width/2 - spacex/2;
  noCursor();
  

  // Spawn enemies
  for (let i = 0; i < enemyTypes.length; i++) {
    let enemySize = enemySizes[i];
    let enemyType = enemyTypes[i];
    let enemy = new Enemy(random(60, width -60), random(-1200, 0), loadImage("Tools/" + enemyType + ".png"), enemySize, enemyType);
    enemies.push(enemy);
  }

  // Spawn coins
  for (let i = 0; i < 5; i++) {
    let coinSize = 80
    let coin = new Coin(random(60, width -60), random(-1200, 0), coinImage, coinSize);
    coins.push(coin);
  }
}


function toggleGamePlay() {
  // Toggle the gamePaused state
  gamePaused = !gamePaused;
  
  // If the game is paused
  if (gamePaused) {
    // Stop the p5.js draw loop
    noLoop();
    
    // Save the current state of each enemy, bullets, and coins in an array
    savedStateEnemies = enemies.map(enemy => enemy.saveState());
    savedStateBullets = bullets.map(bullet => bullet.saveState());
    savedStateCoins = coins.map(coin => coin.saveState());

  } else {
    // If the game is unpaused, restart the p5.js draw loop
    loop();
    
    // Restore the state of each enemy, bullets, and coins from the saved states
    for (let i = 0; i < enemies.length; i++) {
      Object.assign(enemies[i], savedStateEnemies[i]);
    }

    for (let i = 0; i < bullets.length; i++) {
      Object.assign(bullets[i], savedStateBullets[i]);
    }
    
    for (let i = 0; i < coins.length; i++) {
      Object.assign(coins[i], savedStateCoins[i]);
    }
}
}



function draw() {
  // Game state handling
  if(gamePaused){
    return;
  }

  // Setting up background and game interface
  background(bg);
  textSize(28);
  textStyle(BOLD);
  stroke(100);
  fill(0);
  rectMode(CENTER);

  // Draw and move the spaceCraft
  moveCraft();
  stroke(226, 204, 0);
  image(spaceCraft, x, height - 155);
  spaceCraftBoundaries();

  // Call functions
  bulltsSpawn();
  bulletVsEnemies();
  bulletVsCoins();
  enemiesUpdate();
  coinsUpdate();
  drawCoins();
  coinsVsSpacecraft();
  collisions();
  scoreDisplay();
}


//The controls of the spacecraft and moving it horizontally
function moveCraft() {
if(gamePaused){
  return;
}

if (keyIsDown(68) || keyIsDown(39)) { //d or right arrow
  x += 5;
}

if (keyIsDown(65) || keyIsDown(37)) { //a or left arrow
  x -= 5;
}
}

function spaceCraftBoundaries(){
if (x <= 0) {
  x = 0;
}

if (x >= width - spacex) {
  x = width - spacex;
}
}


//For firing the bullets out of the tip of the spacecraft
function mousePressed() {
let bulletx = x + spacex / 2 - 5;  // To align with the center of the spacecraft horizontally
let bullety = height - spacey - 157;  // Set the bullet's y-position to be at the spacecraft's y-position
let bullet = {
  x: bulletx,
  y: bullety,
  size: 10,
  saveState: function() {
    return {
      x: this.x,
      y: this.y,
      size: this.size
    };
  }
};
bullets.push(bullet);
}


//Deals with all keys orders (pausin/resuming, refreshing, firing bullets)
function keyPressed() {
if (keyCode === 32) { // the number 32 refers to the ASCII code for the space bar
  let bulletx = x + spacex / 2 - 5; // To align with the center of the spacecraft horizontally
  let bullety = height - spacey - 157; // Set the bullet's y-position to be at the spacecraft's y-position
  let bullet = {
    x: bulletx,
    y: bullety,
    size: 10,
  };
  bullets.push(bullet);
} 
else if (keyCode === 27) { // the number 27 refers to the ASCII code for the ESC button
  toggleGamePlay();
}
else if (key === 'r' || key === 'R') { // the 'r' or 'R' key for refresh
  window.location.reload();
}
}


function bulltsSpawn(){
//Spawning bullets
for (let bullet of bullets) {
  bullet.y -= 10;
  image(bulletImage, bullet.x, bullet.y, 10)
  if (bullet.y < 0) {
    bullets.splice(bullets.indexOf(bullet), 1);
  }
}
}


// Bullet collisions with enemies
function bulletVsEnemies(){
for (let i = enemies.length - 1; i >= 0; i--) {
  for (let j = bullets.length - 1; j >= 0; j--) {
    if (enemies[i].collidesWith(bullets[j])) {
      // Skip if the enemy is of type 'rock1' or 'rock2'
      if (enemies[i].type !== 'rock1' && enemies[i].type !== 'rock2') {
        enemies[i].reset();
        bullets.splice(j, 1);
        score++;
      } else if (enemies[i].type === 'rock1' || enemies[i].type === 'rock2') {
        // Remove the bullet but don't reset the rock
        bullets.splice(j, 1);
      }
    }
  }
}
}


function coinsUpdate(){
//Updating the coins' positions
for (let coin of coins) {
  coin.draw();
  if (coin.isOffScreen()) {
    coin.reset();
  }
}
}

function drawCoins(){
// Drawing the coincounter
image(coinImage, width - 103, 9, 60, 60);
fill(225);
text(coinsCollected, width - 50, 48);
}

function enemiesUpdate(){
  //Managing the enemies' presence and position in the game
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].draw();
    if (enemies[i].isOffScreen()) {
      enemies[i].reset();
    }
  }
}


function bulletVsCoins(){
// Bullet collisions with coins
for (let i = coins.length - 1; i >= 0; i--) {
  for (let j = bullets.length - 1; j >= 0; j--) {
    if (coins[i].collidesWith(bullets[j])) {
      coins[i].reset();
      bullets.splice(j, 1);
      coinsCollected++;
    }
  }
}
}


function coinsVsSpacecraft(){
// Coins collision with spacecraft
for (let i = coins.length - 1; i >= 0; i--) {
  if (coins[i].collidesWithSpacecraft(x, height - spacey, spacex, spacey)) {
    coins[i].reset();
    coinsCollected++;
  }
}
}


function collisions(){
//Manages score and enemies collisions with spaceCraft
for (let enemy of enemies) {
  if (enemy.collidesWithSpacecraft(x, height - spacey, spacex, spacey)) {
    fill(225);
    text("Game Over!", width/2 - 53, 60);
    text("Your score was" + " " + score, width/2 - 94, 100);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    text("The highest score is: " + highScore, width/2 - 94, 140);
    score = " ";
    noLoop();
  }
}
}


//To display the score in the middle of the screen at the beginning of the game
function scoreDisplay(){
  fill(225);
  text(score, width/2, 50);
  }
  