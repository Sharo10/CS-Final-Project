let x = 100;
let spacex = 120; 
let spacey = 120; 
let spaceCraft;
let bullets = [];
let enemies = [];
let score = 0;
let bg;
let enemyImages = [];
let enemyTypes = ["flammablerock1", "flammablerock2", "rock1", "rock2", "rock3", "rock4", "moon", "moon2"];
let highScore = localStorage.getItem('highScore') || 0;


function preload() {
  for (let i = 0; i < enemyTypes.length; i++) {
    let img = loadImage(enemyTypes[i] + ".png");
    enemyImages[i] = img;
  }
  spaceCraft = loadImage("Spacecraft.png");  
}

class Enemy {
  constructor(x, y, img, enemySize) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.enemySize = enemySize;
  }

  draw() {
    image(this.img, this.x, this.y, this.enemySize, this.enemySize);
    this.y += 2;
  }

  isOffScreen() {
    return this.y > height;
  }

  collidesWith(bullet) {
    return dist(this.x, this.y, bullet.x, bullet.y) < this.enemySize;
}
  reset() {
    this.x = random(this.enemySize*2, width - this.enemySize*2);
    this.y = random(-1200, 0);
    this.img = random(enemyImages);
  }

  collidesWithSpacecraft(spacecraftX, spacecraftY, spacecraftWidth, spacecraftHeight) {
    let buffer = 0.1; // adjust this value to increase or decrease sensitivity
    if (spacecraftX + buffer < this.x + this.enemySize - buffer &&
      spacecraftX + spacecraftWidth - buffer > this.x + buffer &&
      spacecraftY + buffer < this.y + this.enemySize - buffer &&
      spacecraftHeight + spacecraftY - buffer > this.y + buffer) {
      // Collision detected
      return true;
    }
    return false;
  }
}

function setup() {
  bg = loadImage("space shooter background.png");
  createCanvas(1500, 1000);
  spaceCraft.resize(spacex, spacey); 
  x = width/2 - spacex/2;
  noCursor();

  for (let i = 0; i < 20; i++) {
    let enemySize = map(width, 500, 2000, 20, 50); 
    let enemy = new Enemy(random(60, width -60), random(-1200, 0), random(enemyImages), 70);
    enemies.push(enemy);
  }
}

function draw() {
  textSize(28);
  textStyle(BOLD);
  stroke(100);
  background(bg);
  fill(0);
  rectMode(CENTER);
  moveCraft();
  stroke(226, 204, 0);
  image(spaceCraft, x, height - 155);

  for (let bullet of bullets) {
    bullet.y -= 10;
    fill(0, 255, 0);
    circle(bullet.x, bullet.y, 10);
    if (bullet.y < 0) {
      bullets.splice(bullets.indexOf(bullet), 1);
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].draw();
    if (enemies[i].isOffScreen()) {
      enemies[i].reset();
    }
  }

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
  

  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (enemies[i].collidesWith(bullets[j])) {
        enemies[i].reset();
        bullets.splice(j, 1);
        score++;
      }
    }
  }
  
  fill(225);
  text(score, width/2, 50);
  
  if (x <= 0) {
    x = 0;
  }
  
  if (x >= width - spacex) {
    x = width - spacex;
  }
}

function moveCraft() {
  if (keyIsDown(68)) { //d
    x += 5;
  }

  if (keyIsDown(65)) { //a
    x -= 5;
  }
}

function mousePressed() {
  let bulletx = x + spacex / 2;
  let bullety = height - spacey;
  let bullet = {
    x: bulletx,
    y: bullety,
  };
  bullets.push(bullet);
}

