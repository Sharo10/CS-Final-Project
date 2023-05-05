let x = 350;
let spacex = 120;
let spacey = 120;
let spaceCraft;
let bullets = [];
let enemiess = [];
let score = 0;
let bg;
let spaceCraftx = 0;
let spaceCrafty = 0;

function setup() {
  //setting up background
  bg = loadImage("space shooter background.png");
  createCanvas(800, 600);
  spaceCraft = loadImage("Spacecraft.png");
  noCursor(); // hide the cursor
  // showing the enemies
  for (let i = 0; i < 50; i++) {
    let enemies = {
      x: random(50, 670),
      y: random(-1200, 0),
    };
    enemiess.push(enemies);
  }
}

function draw() {
  textSize(28);
  textStyle(BOLD);
  stroke(100);
  background(bg);
  fill(0); // set the fill color to black
  rectMode(CENTER);
  moveCraft();
  stroke(226, 204, 0);
  spaceCraft.resize(spacex, spacey);
  image(spaceCraft, x, 450);
  //Here we update and then draw the bullet
  for (let bullet of bullets) {
    bullet.y -= 10;
    fill(0, 255, 0); // setting bullet color to green
    circle(bullet.x, bullet.y, 10);
    if (bullet.y < 0) {
      bullets.splice(bullets.indexOf(bullet), 1);
    }
  }
  // updating and drawing enemies
  for (let i = enemiess.length - 1; i >= 0; i--) {
    let enemies = enemiess[i];
    enemies.y += 2;
    fill(255, 0, 0); // set enemies color to red
    rect(enemies.x, enemies.y, 10, 10);
    if (enemies.y > height) {
      enemiess.splice(i, 1);
      let newEnemies = {
        x: random(30, 655),
        y: random(-1200, 0),
      };
      enemiess.push(newEnemies);
    }
  }
  // check for collision with spacecraft
  for (let enemies of enemiess) {
    let d = dist(enemies.x, enemies.y, x + spacex / 2, 450 + spacey / 2);
    if (d < 50) {
      fill(225); // set the fill color to black
      text("Game Over!", 320, 60);
      text("Your score was" + " " + score, 295, 100);
      score = " ";
      noLoop();
    }
  }
  //getting rid of the enemies and the bullets when they collide
  for (let enemies of enemiess) {
    for (let bullet of bullets) {
      if (dist(enemies.x, enemies.y, bullet.x, bullet.y) < 50) {
        enemiess.splice(enemiess.indexOf(enemies), 1);
        bullets.splice(bullets.indexOf(bullet), 1);
        score++;
        let newEnemies = {
          x: random(30, 655),
          y: random(-1200, 0),
        };
        enemiess.push(newEnemies);
      }
    }
  }
  fill(225); // set the fill color to white
  scorePrinting = text(score, 400, 50);

  if (x <= 0) {
    x = 0;
  }
  if (x >= 675) {
    x = 675;
  }
}

function moveCraft() {
  if (keyIsDown(68)) {
    //d
    x += 5;
  }
  if (keyIsDown(65)) {
    //a
    x -= 5;
  }
}

function mousePressed() {
  //firing bullets with every mouse click
  let bulletx = x + spacex / 2; // updating bulletx to be in the middle of the spacecraft
  let bullety = 450; // updating bullety to be at the bottom of the screen
  let bullet = {
    x: bulletx,
    y: bullety,
  };
  bullets.push(bullet);
}