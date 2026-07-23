/* PHYSICS VARIABLES ADJUST AS NECESSARY */
const PHYSICS = {
    gravityStrength: 0.7,     //How fast the ball falls
    rotationSpeed: 0.045,      //How fast A/D spins the maze (radians per frame)
    ballBounciness: 0.7,       //Restitution (0 = lead weight, 1 = much bounce)
    ballFriction: 0.01,       //Surface friction
    ballFrictionAir: 0.02,     //Air resistance
    ballDensity: 0.05,         //Mass ratio
    wallThickness: 40          //Match this to grid cell size
}

/**
 * MAZE LAYOUT
 * 1 = Wall, 0 = space, S = start, G = goal
 * 12x12 grid, 48-px canvas
 */

const MAP = [
    "111111111111",
    "111000000111",
    "110111110011",
    "1001S0011001",
    "100111001101",
    "100001100101",
    "111100110101",
    "100110000001",
    "100011100101",
    "11000000G111",
    "111000000111",
    "111111111111"
];

/* CORE LOGIC */
const { Engine, Render, Runner, World, Bodies, Body, Events, Composite } = Matter;
const engine = Engine.create();
const wrapper = document.getElementById('maze-wrapper');
const render = Render.create({
    element: wrapper,
    engine: engine,
    options : {
        width: 480,
        height: 480,
        wireframes: false,
        background: 'transparent'
    }
});
const walls = [];
let ball, goal;
const cellSize = PHYSICS.wallThickness;

/* PARSE MAP */
for (let row = 0; row < MAP.length; row++) {
    for (let col = 0; col < MAP[row].length; col++) {
        const char = MAP[row][col];
        const x = col * cellSize + (cellSize / 2);
        const y = row * cellSize + (cellSize / 2);

        if (char === '1') {
            walls.push(Bodies.rectangle(x, y, cellSize, cellSize, {
                isStatic: true,
                render: { fillStyle: '#333333', strokeStyle: '#222', lineWidth: 2 }
            }));
        } else if (char === 'S') {
            ball = Bodies.circle(x, y, cellSize * 0.35, {
                restitution: PHYSICS.ballBounciness,
                friction: PHYSICS.ballFriction,
                frictionAir: PHYSICS.ballFrictionAir,
                density: PHYSICS.ballDensity,
                render: { fillStyle: '#ff0000' },
                label: 'ball'
            });
        } else if (char === 'G') {
            goal = Bodies.rectangle(x, y, cellSize * 0.6, cellSize * 0.6, {
                isStatic: true,
                isSensor: true,
                render: { fillStyle: '#00ffcc' },
                label: 'goal'
            });
        }
    }
}

World.add(engine.world, [...walls, goal, ball]);

const keys = { a: false, d: false };
let currentAngle = 0; //Radians
let isWon = false;

window.addEventListener('keydown', e => {
    if (e.key === 'a' || e.key === 'A') keys.a = true;
    if (e.key === 'd' || e.key === 'D') keys.d = true;
});

window.addEventListener('keyup', e => {
    if (e.key === 'a' || e.key === 'A') keys.a = false;
    if (e.key === 'd' || e.key === 'D') keys.d = false;
});

/* ROTATION AND GRAVITY */
Events.on(engine, 'beforeUpdate', () => {
    // Apply rotation input
    if (keys.a) currentAngle -= PHYSICS.rotationSpeed;
    if (keys.d) currentAngle += PHYSICS.rotationSpeed;

    //Rotates gravity instead of body
    engine.world.gravity.x = Math.sin(currentAngle) * PHYSICS.gravityStrength;
    engine.world.gravity.y = Math.cos(currentAngle) * PHYSICS.gravityStrength;
    
    //Visually rotates canvas
    render.canvas.style.transform = `rotate(${currentAngle}rad)`;
});

/* WIN CONDITION DETECTION */
Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;

        if ((bodyA.label === 'ball' && bodyB.label === 'goal') || 
            (bodyB.label === 'ball' && bodyA.label === 'goal')) {
            
            if (!isWon) {
                isWon = true;
                
                Body.setStatic(ball, true);
                World.remove(engine.world, ball);
                goal.render.fillStyle = '#111'; 
            }
        }
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);