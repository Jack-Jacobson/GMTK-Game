const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById("MinigameOverlay");
const frame = document.getElementById("frame");
const StartGameButton = document.getElementById("StartGameButton");
const timer = document.getElementById("timer");


const GameWidth = canvas.width;
const GameHeight = canvas.height;

const Camera = {
    x: 0,
    y: 0,
};

const Player = {
    x: 200,
    y: 200,
    speed: 2,
    sprintSpeed: 4,
    interactionRange: 75,
    width: 30,
    height: 30,
    imgWidth: 30,
    imgHeight: 66,
    img: "Assets/sprites/player.png",
}
const inputs = {
    left: false,
    right: false,
    up: false,
    down: false,
    interact: false,
    sprint: false,
};

const CollisionObjects = [
    {x: 0, y: 0, width: 410, height: 116},
    {x: 400, y: 0, width: 250, height: 108},
    {x: 0, y: 0, width: 17, height: GameHeight},
    {x: 391, y: 0, width: 209, height:181},
    {x: 632, y: 0, width: 17, height:GameHeight},
    {x: 0, y: 482, width: GameWidth, height: 23},
    {x: 374, y: 275, width: 113, height: 229},
    {x: 486, y: 380, width: 164, height: 123},
    {x: 270, y: 280, width: 95, height: 82, name: "box/locker"},
    {x: 18, y: 260, width: 99, height: 130, name: "commode"},
    {x: 585, y: 265, width: 41.5, height: 58, name: "fileholderbox"},
];



/*
To add new Minigames copy the following, replacing the path and name accordingly, with an x of 100 + the x of the previous object:
    {x: 100+x of previous object, y: 225, width: 25, height: 25, name: "Name of your Game", url: 'minigames/YOUR_GAME_FOLDER_NAME/YOUR_HTML_FILE_NAME', img: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"},
*/ 

const InteractableObjects = [
    {x: 270, y: 280, width: 97.5, height: 120, name: "Minesweepers", url: 'minigames/minesweeper/minesweeper.html', img: "Assets/sprites/lockers.png"},
    {x: 300, y: 40, width: 80, height: 80, name: "Maze", url: 'minigames/maze/maze.html', img: "Assets/sprites/electricalbox.png"},
    {x: 60, y: 50, width: 102, height: 61.2, name: "Memorypuzzle", url: 'minigames/memorypuzzle/memorypuzzle.html', img: "Assets/sprites/pinboard.png"},
    {x: 585, y: 270, width: 41.5, height: 53, name: "LockCombination", url: 'minigames/lockcombination/lockcombination.html', img: "Assets/sprites/fileholderbox.png"},
    {x: 18, y: 270, width: 99, height: 120, name: "Tetris", url: 'minigames/tetris/tetris.html', img: "Assets/sprites/commode.png"},
];

const VisualObjects = [
    {x: 0, y: 0, width: 650, height: 500, name: "Room", img: "Assets/sprites/room.png"},
    {x: 480, y: 110, width: 120, height: 80, name: "table", img: "Assets/sprites/table.png"},
    {x: 517, y: 110, width: 50, height: 28.125, name: "bomb", img: "Assets/sprites/bomb.png"},
    {x: 300, y: 270, width: 73, height: 82, name: "box", img: "Assets/sprites/box.png"},
];

let img = new Image();
img.src = Player.img;
Player.img = img;
delete(img);

CollisionObjects.forEach(object => {
    let img = new Image();
    img.src = object.img;
    object.img = img;
});
InteractableObjects.forEach(object => {
    let img = new Image();
    img.src = object.img;
    object.img = img;
});
VisualObjects.forEach(object => {
    let img = new Image();
    img.src = object.img;
    object.img = img;
});

let EndHAppened = false;

let CountDown = 60*0.1;
var MinigameTimer = null;
let mainAudio = new Audio();
let loopAudio = new Audio();
let GameTimer;

var AmountOfResetsMinesweeper = 0;
var AmountOfTrysMaze = 0;
var AmountOfTrysMemory = 0;
var AmountOfTrysCombination = 0;

let HasPlayedBefore = {
    "Minesweepers": false,
    "Maze": false,
    "Memorypuzzle": false,
    "LockCombination": false,
    "Tetris": false,
}
let FirstPlayVoicelines = {
    "Minesweepers": "Assets/Audio/Minesweeper/First time doing minesweeper.m4a",
    "Maze": "Assets/Audio/Maze/Maze puzzle start.m4a",
    "Memorypuzzle": "Assets/Audio/Memory/Memory puzzle start.m4a",
    "LockCombination": "Assets/Audio/lock/Lock combination puzzle start.m4a",
    "Tetris": "Assets/Audio/tetris/Tetris puzzle start.m4a",
}
let HasCompleted = {
    "Minesweepers": false,
    "Maze": false,
    "Memorypuzzle": false,
    "LockCombination": false,
    "Tetris": false,
}

function drawGrid() {
    const cellSize = 50;
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
    
let wall = window.getComputedStyle(document.body).getPropertyValue('--wall');
let text = window.getComputedStyle(document.body).getPropertyValue('--text');
let tv = window.getComputedStyle(document.body).getPropertyValue('--tv');
let playercol = window.getComputedStyle(document.body).getPropertyValue('--player');

function drawPlayerAndEnvironment() {
    drawGrid(); 

    VisualObjects.forEach(object => {
        ctx.drawImage(object.img,object.x-Camera.x,object.y-Camera.y, object.width, object.height);
    });

    InteractableObjects.forEach(object => {
        ctx.drawImage(object.img,object.x-Camera.x,object.y-Camera.y, object.width, object.height);
    });
    
    //ctx.fillRect(Player.x-Camera.x, Player.y-Camera.y, Player.width, Player.height);
    ctx.drawImage(Player.img,Player.x-Camera.x, Player.y-Camera.y-Player.height, Player.imgWidth, Player.imgHeight);
    
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updatePosition() {
    if(inputs.sprint){
        if(inputs.left){
            Player.x-=Player.sprintSpeed;
        } else if(inputs.right){
            Player.x+=Player.sprintSpeed;
        }
        if(inputs.up){
            Player.y-=Player.sprintSpeed;
        } else if(inputs.down){
            Player.y+=Player.sprintSpeed;
        }
    } else{
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
    }

    if (Player.x < 0) Player.x=0;
    else if (Player.x > GameWidth-Player.width) Player.x=GameWidth-Player.width;
    if (Player.y < 0) Player.y=0;
    else if (Player.y > GameHeight-Player.height) Player.y=GameHeight-Player.height;


    

    checkCollisions();
}

function updateCamera(){
    Camera.x = Player.x + Player.width/2 - canvas.width/2;
    Camera.y = Player.y + Player.height/2 - canvas.height/2;

    if (Camera.x < 0) Camera.x=0;
    else if (Camera.x > GameWidth-canvas.width) Camera.x=GameWidth-canvas.width;
    if (Camera.y < 0) Camera.y=0;
    else if (Camera.y > GameHeight-canvas.height) Camera.y=GameWidth-canvas.height;
}

function checkCollisions(){
    if(inputs.sprint){
        CollisionObjects.forEach(object => {
            //console.log(Player.x, Player.y, platform.x, platform.y);
            if((Player.y + Player.height > object.y && Player.y + Player.height <= object.y + Player.sprintSpeed) && (Player.x + Player.width > object.x && Player.x < object.x + object.width)) {
                Player.y -= Player.sprintSpeed * inputs.down;
            } 
            else if((Player.y >= object.y + object.height - Player.sprintSpeed && Player.y < object.y + object.height) && (Player.x + Player.width > object.x && Player.x < object.x + object.width)) {
                Player.y += Player.sprintSpeed * inputs.up;
            }
            if((Player.y + Player.height > object.y && Player.y < object.y + object.height) && (Player.x + Player.width > object.x && Player.x + Player.width <= object.x + Player.sprintSpeed)) {
                Player.x -= Player.sprintSpeed * inputs.right;
            } 
            else if((Player.y + Player.height > object.y && Player.y < object.y + object.height) && (Player.x >= object.x + object.width - Player.sprintSpeed && Player.x < object.x + object.width)) {
                Player.x += Player.sprintSpeed * inputs.left;
            }
            //if(Player.x + Player.width < platform.x) Player.x = platform.x-Player.width;
        });
    } else{
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
    
}

function checkInteractions(){
    InteractableObjects.forEach(object => {
        if(((object.x+object.width/2)-Player.x)**2 + ((object.y+object.height/2)-Player.y)**2 < Player.interactionRange**2){
            //console.log(window.getComputedStyle(document.body).getPropertyValue('--text-dim'));
            ctx.fillStyle =  text;
            ctx.font="20px sans-serif";
            ctx.fillText(`Press E`, object.x-Camera.x, object.y-Camera.y);
            if(inputs.interact){
                console.log("interacted");
                inputs.interact=false;
                DeactivateAllInputs();
                if(!HasPlayedBefore[object.name]){
                    let audio = new Audio(FirstPlayVoicelines[object.name]);
                    audio.play();
                    HasPlayedBefore[object.name] = true;
                }
                OpenMinigame(object.url);
            }
        }
    });
}

function OpenMinigame(url){
    /* window.open(object.url,"_blank"); */
    OverlayIsOpen = true;
    frame.src = url;
    overlay.style.display = "flex";
    frame.focus();
}

function CloseMinigame(){
    overlay.style.display = "none";
    frame.src = "";
    OverlayIsOpen = false;
    MinigameTimer = null;
    window.focus();
}

function FailMinesweeper(){
    if (EndHAppened) return;
    let index = Math.floor(Math.random()*2);
    let audio = new Audio();
    if(index==0) audio.src = "Assets/Audio/Minesweeper/Minesweeper fail 1.m4a";
    else audio.src = "Assets/Audio/Minesweeper/Minesweeper fail 2.m4a";
    audio.play();
}

function FailMaze(){
    if (EndHAppened) return;
    let index = Math.floor(Math.random()*3);
    let audio = new Audio();
    if(index==0) audio.src = "Assets/Audio/Maze/Maze puzzle fail 1.m4a";
    else if(index==1) audio.src = "Assets/Audio/Maze/Maze puzzle fail 2.m4a";
    else audio.src = "Assets/Audio/Maze/Maze puzzle fail 3.m4a";
    audio.play();
}
function FailMemory(){
    if (EndHAppened) return;
    let index = Math.floor(Math.random()*3);
    let audio = new Audio();
    if(index==0) audio.src = "Assets/Audio/Memory/Memory puzzle fail 1.m4a";
    else if(index==1) audio.src = "Assets/Audio/Memory/Memory puzzle fail 2.m4a";
    else audio.src = "Assets/Audio/Memory/Memory puzzle fail 3.m4a";
    audio.play();
}
function FailCombination(){
    if (EndHAppened) return;
    let audio = new Audio();
    audio.src = "Assets/Audio/lock/Lock combination puzzle fail.m4a";
    audio.play();
}
function FailTetris(){
    if (EndHAppened) return;
    let audio = new Audio();
    audio.src = "Assets/Audio/tetris/Tetris puzzle fail.m4a";
    audio.play();
}

function WinMinesweeper(){
    overlay.style.display = "none";
    frame.src = "";
    OverlayIsOpen = false;
    window.focus();
    HasCompleted.Minesweepers=true;
    if(!EndHAppened){

        if(AmountOfResetsMinesweeper == 0){
            let audio = new Audio("Assets/Audio/Minesweeper/Minesweeper perfect finish no entities.m4a");
            audio.play();
        } else{
            let audio = new Audio("Assets/Audio/Minesweeper/Minesweeper imperfect finish no entities.m4a");
            audio.play();
        }
    }
}

function WinMaze(){
    overlay.style.display = "none";
    frame.src = "";
    OverlayIsOpen = false;
    window.focus();
    HasCompleted.Maze=true;
    if(!EndHAppened){

        if(AmountOfTrysMaze == 0){
            let audio = new Audio("Assets/Audio/Maze/Maze puzzle imperfect finish.m4a");
            audio.play();
        } else{
            let audio = new Audio("Assets/Audio/Maze/Maze puzzle imperfect finish.m4a");
            audio.play();
        }
    }
}

function WinMemory(){
    overlay.style.display = "none";
    frame.src = "";
    OverlayIsOpen = false;
    window.focus();
    HasCompleted.Memorypuzzle=true;
    if(!EndHAppened){
        if(AmountOfTrysMemory == 0){
            let audio = new Audio("Assets/Audio/Memory/Memory puzzle perfect finish.m4a");
            audio.play();
        } else{
            let audio = new Audio("Assets/Audio/Memory/Memory puzzle imperfect finish.m4a");
            audio.play();
        }
    }
    }

function WinCombination(){
    overlay.style.display = "none";
    frame.src = "";
    OverlayIsOpen = false;
    window.focus();
    HasCompleted.LockCombination=true;

    if(AmountOfTrysMemory == 0){
        let audio = new Audio("Assets/Audio/lock/Lock combination perfect finish.m4a");
        audio.play();
    } else{
        let audio = new Audio("Assets/Audio/lock/Lock combination imperfect finish.m4a");
        audio.play();
    }
}
function WinTetris(){
    overlay.style.display = "none";
    frame.src = "";
    OverlayIsOpen = false;
    window.focus();
    HasCompleted.Tetris=true;

    if(AmountOfTrysMemory == 0){
        let audio = new Audio("Assets/Audio/tetris/Tetris perfect finish.m4a");
        audio.play();
    } else{
        let audio = new Audio("Assets/Audio/tetris/Tetris imperfect finish.m4a");
        audio.play();
    }
}

function DeactivateAllInputs(){
    for (var key in inputs) {
        inputs[key]=false;
    }
}

function MusicHandler(){
    mainAudio.src = "Assets/Audio/Music/gmtk.wav";
    loopAudio.src = "Assets/Audio/Music/gmtk loop.wav";
    loopAudio.loop = true;
    
    mainAudio.play();
    setTimeout(() => {
        console.log("secAudio start", 60*5-CountDown);
        loopAudio.play();
        
    }, 98000);
}

function EndSequence(){
    clearInterval(GameTimer);

    let audio = new Audio();
    audio.src="Assets/Audio/All puzzles completed.m4a";
    audio.play();

    setTimeout(() => {
        GameTimer = setInterval(function () {
           
            CountDown--;
            timer.textContent = `Time Left: ${Math.floor(CountDown/60)}:${(CountDown%60)<10 ? "0" + (CountDown%60) : (CountDown%60)}`;
            if(MinigameTimer) MinigameTimer.textContent = `${Math.floor(CountDown/60)}:${(CountDown%60)<10 ? "0" + (CountDown%60) : (CountDown%60)}`;
            
            if(CountDown==0){
                loopAudio.pause();
                mainAudio.pause();
                overlay.style.display = "none";
                frame.src = "";
                document.getElementById("ui-container").style.display="none";
                document.getElementById("LoseScreen").style.display="flex";
            }
        }, 1000);

    })
}



function update() {
    updatePosition();
    //updateCamera();
    clear();
    drawPlayerAndEnvironment();
    checkInteractions();
    //UpdateAndDrawTime();
    if(!EndHAppened){
        let temp=true;
        for(let key in HasCompleted){
            if(!HasCompleted[key]) temp = false;
        }
        if(temp){
            EndHAppened=true;
            EndSequence();
        }
    }


    requestAnimationFrame(update);
}

function startGame(){
    timer.textContent = `Time Left: ${Math.floor(CountDown/60)}:${(CountDown%60)<10 ? "0" + (CountDown%60) : (CountDown%60)}`;
    if (GameTimer) {
        clearInterval(GameTimer);
        GameTimer = null;
    }
    let audio = new Audio();
    audio.src="Assets/Audio/Game start.m4a";
    audio.play();
    drawPlayerAndEnvironment();
    setTimeout(()=>{

            GameTimer = setInterval(function () {
                if (CountDown <= 0) {
                    CountDown = 0;
                    timer.textContent = `Time Left: 0:00`;
                    if(MinigameTimer) MinigameTimer.textContent = `0:00`;
                    clearInterval(GameTimer);
                    GameTimer = null;
                    return;
                }
                
                if(CountDown == 60*5){

                } else if(CountDown == 60*3){
                    let MinutesLeft3 = new Audio("Assets/Audio/3 minutes left.m4a");
                    MinutesLeft3.play();
                } else if(CountDown == 60){
                    let MinutesLeft1 = new Audio("Assets/Audio/1 minute left.m4a");
                    MinutesLeft1.play();
            }

            CountDown--;
            
            if (CountDown == 0) {
                loopAudio.pause();
                document.getElementById("ui-container").style.display="none";
            }
            
            timer.textContent = `Time Left: ${Math.floor(CountDown/60)}:${(CountDown%60)<10 ? "0" + (CountDown%60) : (CountDown%60)}`;
            if(MinigameTimer) MinigameTimer.textContent = `${Math.floor(CountDown/60)}:${(CountDown%60)<10 ? "0" + (CountDown%60) : (CountDown%60)}`;
            
            if (CountDown == 0) {
                loopAudio.pause();
                mainAudio.pause();
                overlay.style.display = "none";
                frame.src = "";
                document.getElementById("LoseScreen").style.display="flex";
            }
        }, 1000);
        MusicHandler();
        update();
    }, 26000);

}



StartGameButton.addEventListener('click', () => {
    document.getElementById("StartScreen").style.display="none";
    document.getElementById("ui-container").style.display="flex";
    startGame();
});

window.onkeydown = (key) => {
    //console.log("PRESSED", key);
    if (key.code=="KeyW"){
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
    if (key.code=="KeyE"){
        inputs.interact = true;
    }
    if (key.code=="ShiftLeft"){
        inputs.sprint = true;
    }
}


window.onkeyup = (key) => {
    //console.log("RELEASED", key);
    if (key.code=="KeyW"){
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
    if (key.code=="KeyE"){
        inputs.interact = false;
    }
    if (key.code=="ShiftLeft"){
        inputs.sprint = false;
    }
}
