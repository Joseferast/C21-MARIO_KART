var mario,mariofront,marioloose,mariowin,mariobeware,marioleft,marioright;
var banana,bananaitem,shell,shellitem,shellGp,bananaGp;
var lap,lapimg,road,roadimg;
var MENU = 1;
var PLAY = 2;
var END = 3;
var GAMEOVER = 0;
var gameState = MENU;
var score = 0;
var racestart,race,win,loose;
var right,left,down,up;

function preload(){
    mariofront = loadAnimation("MarioFront.png");
    marioleft = loadAnimation("MarioLeft.png");
    marioright = loadAnimation("MarioRight.png");
    marioloose = loadAnimation("MarioLoose.png");
    mariowin = loadAnimation("MarioWin.png");
    mariobeware = loadAnimation("MarioBeware.png")

    lapimg = loadImage("Lap.png");
    roadimg = loadImage("Road.png");

    shellitem = loadImage("ShellItem.png");
    bananaitem = loadImage("BananaItem.png");
    bananaGp = new Group();

    racestart = loadSound("RaceStart.mp3");
    race = loadSound("Race.mp3");
    win = loadSound("win.mp3");
    loose = loadSound("Loose.mp3");

}

function setup() {
    createCanvas(600,600);
    mario = createSprite(300,500,20,20);
 mario.addAnimation("front",mariofront);
 mario.addAnimation("right",marioright);
 mario.addAnimation("left",marioleft);
 mario.addAnimation("beware",mariobeware);
 mario.addAnimation("loose",marioloose);
 mario.addAnimation("win",mariowin);
mario.scale = 2;
 mario.changeAnimation("front");
 mario.depth = 10;

 lap = createSprite(300,400,50,50);
 lap.addImage(lapimg);
 lap.scale = 7.7;
 lap.depth = 2;

 road = createSprite(300,275,50,100);
 road.addImage(roadimg);
 road.depth = 1;

 shell = createSprite(-500,-500);

 left = createSprite(0,300,10,600);
 right = createSprite(600,300,10,600);
 up = createSprite(300,0,600,10);
 down = createSprite(300,600,600,10);

 left.visible = false;
 right.visible = false;
 up.visible = false;
 down.visible = false;
}

function draw() {
    background("gray"); 
    if (gameState === GAMEOVER) {
        mario.changeAnimation("loose");
        road.velocityY = 0;
        lap.velocityY = 0;
    }
    if (gameState === MENU) {
        if (keyDown(32)) {
       start();
    }
    if (keyWentDown(32)) {
racestart.play();
    }
    }
    if (gameState === PLAY) {
        createshell();
    createbanana();
    lost();
    raceEnd();
    mario.collide(right);
    mario.collide(left);
    mario.collide(down);
    mario.collide(up);
    lap.velocityY = 5;
    road.velocityY = 5;
    if (keyDown(RIGHT_ARROW)) {
        mario.x = mario.x+5;
        mario.changeAnimation("left");
    }
    if (keyDown(LEFT_ARROW)) {
        mario.x = mario.x-5;
        mario.changeAnimation("right");
    }
    if (keyWentUp(LEFT_ARROW) || keyWentUp(RIGHT_ARROW)) {
        mario.changeAnimation("front");
    }
    if (keyDown(UP_ARROW)) {
        mario.y = mario.y-5;
    }
    if (keyDown(DOWN_ARROW)) {
        mario.y = mario.y+5
    }
    
    if (road.y > 325) {
        road.y = 275;
    }
    }
    if (gameState === END) {
        bananaGp.setVelocityYEach(0);
        road.velocityY = 0;
        bananaGp.setLifetimeEach(-1);
        mario.changeAnimation("win");
        lap.velocityY = 0;
    }
   
    
 drawSprites();
 if (gameState === GAMEOVER) {
     textSize(20);
        fill(255,0,50);
        text("Fim de jogo!",230,100);
        fill(255,255,255);
        text("Você fez "+score+" pontos!",200,200);
 }
 if (gameState === MENU) {
    fill(255,0,50);
    textSize(25);
    text("a Corrida de Mário Kart",180,100);
    fill(255,255,255);
    textSize(20);
    text("Mário precisa de sua ajuda para treinar em um circuito",60,200);
    text("de corrida, antes do próximo torneio começar.",100,230);
    text("segure a Barra de espaço para começar!",125,300);
    text("Use setas para mover e evite cascos e bananas.",100,325);
    text("Ao chegar em 2500 pontos, termine o circuito!",100,350);
 }
 if (gameState === PLAY) {
    fill(255,255,255);
    textSize(15);
    text("Pontos: " + score,500,100);
    Score();
 }
if (gameState === END) {
    fill(255,255,255);
    textSize(25);
    text("Você terminou o circuito!",180,100);
}
 
}

function createshell() {
    if (frameCount%300 === 0) {
        shell = createSprite(random(30,570),700);
shell.velocityY = -5;
shell.addImage(shellitem);
shell.depth = 4;
shell.scale = 2;
shell.lifetime = 300;
    } 
         if (shell.y >= mario.y) {
    bewaring();
     } else {
        mario.changeAnimation("front");
     }
}

function bewaring() {
        mario.changeAnimation("beware");
} 


function createbanana() {
    if (frameCount%60 === 0) {
banana = createSprite(random(30,570),0); 
banana.velocityY = 5;
banana.addImage(bananaitem);
banana.depth = 3;
banana.scale = 2;
banana.lifetime = 300;
bananaGp.add(banana);
    }
}

function start() {
    if (frameCount%250 === 0) {
        gameState = PLAY;
        race.play();
    }
}

function Score() {
    score += Math.round(getFrameRate()/30);
}

function lost() {
    if (mario.isTouching(shell) || mario.isTouching(bananaGp)) {
        gameState = GAMEOVER;
        // os cascos são feitos para ir pra frente.
    bananaGp.setVelocityYEach(0);
    bananaGp.setLifetimeEach(-1);
    lap.velocityY = 0;
    road.velocityY = 0;
    lap.lifetime = -1;
    loose.play();
    mario.changeAnimation("loose");
    race.pause();
    }
}
function raceEnd() {
       if (score > 2500) {
        if (lap.y > 700) {
             lap.y = 0;
        }
        lap.velocityY = 5;
        if (lap.y > mario.y) {
            if (frameCount%300 === 0) {
                win.play();
            race.pause();
            gameState = END;
            mario.changeAnimation("win");
            lap.velocityY = 0;
            }
        }
        }
       } 
