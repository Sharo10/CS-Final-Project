let x = 350;
let spacex = 120;
let spacey = 120;
let spaceCraft;
let bullets = [];
let enemies = [];
let score = 0;
let bg;
let enemyImages = [];
let enemyTypes = ["flammablerock1", "flammablerock2", "rock1", "rock2", "rock3", "rock4", "moon", "moon2"];

function preload() {
  for (let i = 0; i < enemyTypes.length; i++) {
    let img = loadImage(enemyTypes[i] + ".png");
    enemyImages[i] = img;
  }
}

class Enemy {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
  }

  draw() {
    image(this.img, this.x, this.y, 30, 30);  // Adjust the size here.
    this.y += 2;
  }
  isOffScreen() {
    return this.y > height;
  }

  collidesWith(bullet) {
    return dist(this.x, this.y, bullet.x, bullet.y) < 50;
  }

  reset() {
    this.x = random(30, width - 30);
    this.y = random(-1200, 0);
    this.img = random(enemyImages);
  }
}

function setup() {
  bg = loadImage("space shooter background.png");
  createCanvas(1600, 1000);
  spaceCraft = loadImage("Spacecraft.png");
  spaceCraft.resize(spacex, spacey); // resize spacecraft
  noCursor();

  for (let i = 0; i < 50; i++) {
    let enemy = new Enemy(random(50, width - 50), random(-1200, 0), random(enemyImages));
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
  image(spaceCraft, x, height - 150);

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
    let d = dist(enemy.x, enemy.y, x + spacex / 2, height - spacey / 2);
    if (d < 50) {
      fill(225);
      text("Game Over!", width/2 - 53, 60);
      text("Your score was" + " " + score, width/2 - 94, 100);
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
  
  if (x >= width - spacex) { // change the limit to account for the size of the spacecraft
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
    let bullety = height - spacey; // update to match the bottom of the spacecraft
    let bullet = {
      x: bulletx,
      y: bullety,
    };
    bullets.push(bullet);
  }
  
