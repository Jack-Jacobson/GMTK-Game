const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(24, 24);

const blockColors = [
    null,
    '#ff3333', // Red 
    '#00ffcc', // Cyan (
    '#771111', // Dark Red 
    '#ff0000', // Bright Red
    '#333333', // Dark Grey 
    '#00aaaa', // Darker Cyan
    '#ff5555'  // Light Red
]

/* BOARD GENERATION */
function createMatrix(w, h){
    const matrix = [];
    while(h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

/* PIECE GENERATION AND DRAWING */
function createPiece(type) {
    if (type === 'T') return [[0,0,0], [1,1,1], [0,1,0]];
    if (type === 'O') return [[2,2], [2,2]];
    if (type === 'L') return [[0,3,0], [0,3,0], [0,3,3]];
    if (type === 'J') return [[0,4,0], [0,4,0], [4,4,0]];
    if (type === 'I') return [[0,5,0,0], [0,5,0,0], [0,5,0,0], [0,5,0,0]];
    if (type === 'S') return [[0,6,6], [6,6,0], [0,0,0]];
    if (type === 'Z') return [[7,7,0], [0,7,7], [0,0,0]];
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = blockColors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                
                context.lineWidth = 0.05;
                context.strokeStyle = '#111';
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#111';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

/* GAME MECHANICS */
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

/* CONTROLS */
function playerDrop() {
    player.pos.y++;
    if(collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if(collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    
    // Check Game Over
    if (collide(arena, player)) {
        isGameOver = true;
        document.getElementById('game-over').style.display = 'flex';
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    playerRotate(player.matrix, dir);
    while (collide (arena, player)) {
        player.pos.x += offset;
        offset = -(offset+ (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
                    rotate(player.matrix, -dir);
                    player.pos.x = pos;
                    return;
        }
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let isGameOver = false;

function update(time = 0) {
    if (isGameOver) return; 

    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

/* INIT SETUP */
const arena = createMatrix(10, 20);
const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

/* INPUT HANDLING */
document.addEventListener('keydown', event => {
    if (isGameOver) return;
    
    // Prevent default scrolling behavior for arrows
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight", "Space"].indexOf(event.code) > -1) {
        event.preventDefault();
    }

    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight') {
        playerMove(1);
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === 'ArrowUp') {
        playerRotate(1);
    }
});

/* RESTART LOGIC */
document.getElementById('restart-btn').addEventListener('click', () => {
    arena.forEach(row => row.fill(0)); // Clear board
    player.score = 0;
    updateScore();
    isGameOver = false;
    document.getElementById('game-over').style.display = 'none';
    playerReset();
    lastTime = performance.now(); 
    update();
});

/* LOAD GAME */
playerReset();
updateScore();
update();

/* Check if it is in an iframe window, and if so add the ability to close with Escape Key */
if(window.frameElement){
    console.log("Subwindow, can be closed");
    window.parent.MinigameTimer = document.getElementById("timer");
    window.addEventListener('keydown', (key) => {
        if(key.code == "Escape"){
            console.log("Escape");
            window.parent.CloseMinigame();
        }
    });
} else{
    console.log("Not a Subwindow, can't be closed");
}