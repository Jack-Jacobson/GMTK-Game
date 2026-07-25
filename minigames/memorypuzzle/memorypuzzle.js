const colours = [
    "RED",
    "BLUE",
    "GREEN",
    "YELLOW",
    "CYAN", 
    "WHITE",
    "PURPLE",
    "ORANGE"
];

let sequence = [];
let playerAnswer = [];

let currentRound = 1;
const totalRounds = 4;
let sequenceLength = 4;

const memorizeTimes = [10, 8, 7, 5];
let timer;

const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");

// START GAME
document.getElementById("start").addEventListener("click", () => {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    startRound();
});

// START ROUND
function startRound() {
    sequence = [];
    playerAnswer = [];
    
    document.getElementById("answer").innerHTML = "";
    document.getElementById("sequence").innerHTML = "";
    document.getElementById("round").innerText = `ROUND ${currentRound}/${totalRounds}`;
    messageDisplay.innerText = "MEMORIZE...";
    messageDisplay.style.color = "var(--text)";

    generateSequence();
    disableColours(true);
    disableControls(true);
    showSequence();
}

// CREATE RANDOM SEQUENCE
function generateSequence() {
    for (let i = 0; i < sequenceLength; i++) {
        let randomColour = colours[Math.floor(Math.random() * colours.length)];
        sequence.push(randomColour);
    }
}

// SHOW SEQUENCE
function showSequence() {
    const display = document.getElementById("sequence");
    display.innerHTML = "";

    sequence.forEach(colour => {
        let box = document.createElement("div");
        box.className = "colour " + colour.toLowerCase();
        box.style.cursor = "default"; // Don't look clickable
        display.appendChild(box);
    });

    let time = memorizeTimes[currentRound - 1];
    startTimer(time);

    setTimeout(() => {
        display.innerHTML = "";
        stopTimer();
        
        timerDisplay.innerText = "INPUT REQ";
        messageDisplay.innerText = "AWAITING INPUT...";
        
        disableColours(false);
        disableControls(false);
    }, time * 1000);
}

// TIMER
function startTimer(seconds) {
    let timeLeft = seconds;
    
    timerDisplay.innerText = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

// COLOUR BUTTON CLICKS
document.querySelectorAll("#buttons .colour").forEach(button => {
    button.addEventListener("click", () => {
        if (playerAnswer.length < sequence.length) {
            let colour = button.dataset.color;
            playerAnswer.push(colour);
            updateAnswer();
        }
    });
});

// SHOW PLAYER ANSWER
function updateAnswer() {
    const answer = document.getElementById("answer");
    answer.innerHTML = "";

    playerAnswer.forEach(colour => {
        let box = document.createElement("div");
        box.className = "colour " + colour.toLowerCase();
        answer.appendChild(box);
    });
}

// ERASE BUTTON
document.getElementById("erase").addEventListener("click", () => {
    playerAnswer.pop();
    updateAnswer();
});

// SUBMIT BUTTON
document.getElementById("enter").addEventListener("click", () => {

    if (playerAnswer.length !== sequence.length) {
        messageDisplay.innerText = "ERR: INCOMPLETE";
        return;
    }

    if (JSON.stringify(playerAnswer) === JSON.stringify(sequence)) {
        
        if (currentRound === totalRounds) {
            messageDisplay.innerText = "SYSTEM DEFUSED";
            messageDisplay.style.color = "var(--goal)";
            timerDisplay.innerText = "SUCCESS";
            disableColours(true);
            disableControls(true);
            window.parent.WinMemory();
        } else {
            messageDisplay.innerText = "SEQUENCE ACCEPTED";
            messageDisplay.style.color = "var(--goal)";
            currentRound++;
            sequenceLength++;
            disableColours(true);
            disableControls(true);

            setTimeout(() => {
                startRound();
            }, 1500);
        }
    } else {
        messageDisplay.innerText = "ERR: MISMATCH";
        messageDisplay.style.color = "var(--text)";
        window.parent.FailMemory();
        window.parent.AmountOfTrysMemory++;
        
        setTimeout(() => {
            playerAnswer = [];
            updateAnswer();
            messageDisplay.innerText = "AWAITING INPUT...";
        }, 1200);
    }
});

// RESTART ROUND
document.getElementById("restart").addEventListener("click", () => {
    stopTimer();
    messageDisplay.innerText = "REGENERATING...";
    startRound();
});

// DISABLE / ENABLE COLOUR BUTTONS
function disableColours(disabled) {
    document.querySelectorAll("#buttons .colour").forEach(button => {
        button.disabled = disabled;
    });
}

// DISABLE / ENABLE CONTROL BUTTONS
function disableControls(disabled) {
    document.getElementById("erase").disabled = disabled;
    document.getElementById("enter").disabled = disabled;
    document.getElementById("restart").disabled = disabled;
}

/* I-FRAME ESCAPE KEY LOGIC */
if(window.frameElement){
    console.log("Subwindow, can be closed");
    window.onkeydown = (key) => {
        if(key.code == "Escape"){
            console.log("Escape");
            window.parent.CloseMinigame();
        }
    }
} else{
    console.log("Not a Subwindow, can't be closed");
}