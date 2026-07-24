const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const GameWidth = 1000;
const GameHeight = 1000;

const Camera = {
    x: 0,
    y: 0,
};

const Player = {
    x: 400,
    y: 400,
    speed: 2,
    width: 50,
    height: 50,
}
const CollisionObjects = [
    {x: 200, y: 200, width: 50, height: 400},
    {x: 200, y: 200, width: 400, height: 50},
];
let inputs = {
    left: false,
    right: false,
    up: false,
    down: false,
};

const cellSize = 50;

function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = "black";

    // Draw vertical lines
    for (let x = 0; x <= GameWidth; x += cellSize) {
        ctx.moveTo(x - Camera.x, 0);
        ctx.lineTo(x - Camera.x, GameHeight - Camera.y);
    }

    // Draw horizontal lines
    for (let y = 0; y <= GameHeight; y += cellSize) {
        ctx.moveTo(0, y- Camera.y);
        ctx.lineTo(GameWidth - Camera.x, y - Camera.y);
    }

    ctx.stroke();
}



function draw() {
    drawGrid();
    ctx.fillStyle = 'black';
    CollisionObjects.forEach(object => {
        ctx.fillRect(object.x - Camera.x, object.y-Camera.y, object.width, object.height);
    });




    ctx.fillStyle = 'blue';
    ctx.fillRect(Player.x-Camera.x, Player.y-Camera.y, Player.width, Player.height);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function updatePosition() {
    if(inputs.left){
        Player.x-=Player.speed;
    } else if(inputs.right){
        Player.x+=Player.speed;
    }
    if(inputs.up){
        Player.y-=Player.speed;
    } else if(inputs.down){
        Player.y+=Player.speed;
    }

    if (Player.x < 0) Player.x=0;
    else if (Player.x > GameWidth-Player.width) Player.x=GameWidth-Player.width;
    if (Player.y < 0) Player.y=0;
    else if (Player.y > GameWidth-Player.height) Player.y=GameWidth-Player.height;


    

    checkCollisions();

}

function updateCamera(){
    Camera.x = Player.x + Player.width/2 - canvas.width/2;
    Camera.y = Player.y + Player.height/2 - canvas.height/2;

    if (Camera.x < 0) Camera.x=0;
    else if (Camera.x > GameWidth-canvas.width) Camera.x=GameWidth-canvas.width;
    if (Camera.y < 0) Camera.y=0;
    else if (Camera.y > GameWidth-canvas.height) Camera.y=GameWidth-canvas.height;
}

function checkCollisions(){
    CollisionObjects.forEach(object => {
        //console.log(Player.x, Player.y, platform.x, platform.y);
        if((Player.y + Player.height > object.y && Player.y + Player.height <= object.y + Player.speed) && (Player.x + Player.width > object.x && Player.x < object.x + object.width)) {
            Player.y -= Player.speed * inputs.down;
        } 
        else if((Player.y >= object.y + object.height - Player.speed && Player.y < object.y + object.height) && (Player.x + Player.width > object.x && Player.x < object.x + object.width)) {
            Player.y += Player.speed * inputs.up;
        }
        if((Player.y + Player.height > object.y && Player.y < object.y + object.height) && (Player.x + Player.width > object.x && Player.x + Player.width <= object.x + Player.speed)) {
            Player.x -= Player.speed * inputs.right;
        } 
        else if((Player.y + Player.height > object.y && Player.y < object.y + object.height) && (Player.x >= object.x + object.width - Player.speed && Player.x < object.x + object.width)) {
            Player.x += Player.speed * inputs.left;
        }
        //if(Player.x + Player.width < platform.x) Player.x = platform.x-Player.width;

    });
}



function update() {
    updatePosition();
    updateCamera();
    clear();
    draw();

    requestAnimationFrame(update);
}
update();

window.onkeydown = (key) => {
    //console.log("PRESSED", key);
    if (key.code=="KeyW" ||key.code=="Space"){
        inputs.up = true;
    } 
    if (key.code=="KeyS"){
        inputs.down = true;
    } 
    if (key.code=="KeyA"){
        inputs.left = true;
    }
    if (key.code=="KeyD"){
        inputs.right = true;
    }
}


window.onkeyup = (key) => {
    //console.log("RELEASED", key);
    if (key.code=="KeyW" ||key.code=="Space"){
        inputs.up = false;
    }
    if (key.code=="KeyS"){
        inputs.down = false;
    } 
    if (key.code=="KeyA"){
        inputs.left = false;
    } 
    if (key.code=="KeyD"){
        inputs.right = false;
    }
};