const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var engine, world, backgroundImg;
var canvas;
var player, tower, hand, ground;
var playerArrows = [];
var angle;
var book1, book2, book3, book4;

var numberOfArrows = 10; 

var score = 0;

function preload(){
  backgroundImg = loadImage("./assets/background.png");
  towerImage = loadImage("./assets/tower.png");
}

function setup() {
  canvas = createCanvas(1200,600);

  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 15

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  hand = new Hand(180,110,40,40,angle);
  player = new Player(150,140,150,150);

  book1 = new Book(width - 300, 100, 70, 70);
  book1.debug = true;
  book2 = new Book(width - 550, height - 300, 70, 70);
  book2.debug = true;
  book3 = new Book(width - 440, 500, 70, 70);
  book3.debug = true;
  book4 = new Book(width - 380, 290, 70, 70);
  book4.debug = true;
}


function draw() 
{
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  
  rect(ground.position.x, ground.position.y, width * 2, 1);


  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 300, 400);
  pop();
  
  hand.display();
  player.display();

  book1.display();
  book2.display();
  book3.display();
  book4.display();

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();
      playerArrows[i].debug = true;
      var book1Collision = Matter.SAT.collides(
        book1.body,
        playerArrows[i].body
      );

      var book2Collision = Matter.SAT.collides(
        book2.body,
        playerArrows[i].body
      );

      var book3Collision = Matter.SAT.collides(
        book3.body,
        playerArrows[i].body
      );

      var book4Collision = Matter.SAT.collides(
        book4.body,
        playerArrows[i].body
      );

      if (book1Collision.collided || book2Collision.collided || book3Collision.collided || book4Collision.collided ) {
        score += 5;
      }
      
      var posX = playerArrows[i].body.position.x;
      var posY = playerArrows[i].body.position.y;

      if (posX > width || posY > height) {
        if (!playerArrows[i].isRemoved) {
          playerArrows[i].remove(i);
        } else {
          //playerArrows[i].trajectory = [];
        }
      }
    }
  }

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("BELLE AND BOOKS", width / 2, 100);

  // Score
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Score " + score, width - 200, 100);

  // Arrow Count
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Remaining Arrows : " + numberOfArrows, 200, 60);

  if (numberOfArrows == 0) {
    gameOver();
  }

}

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = hand.body.position.x;
      var posY = hand.body.position.y;
      var angle = hand.body.angle;

      var arrow = new Arrow(posX, posY, 100, 10, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = hand.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

function gameOver() {
  swal(
    {
      title: `Game Over!!!`,
      text: "Thanks for playing!!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/PiratesInvision/main/assets/board.png",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}
