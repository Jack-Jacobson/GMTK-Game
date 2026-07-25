const puzzles = [
    // ROUND 1 - EASY
    {
        difficulty: "EASY",
        clues: [
            "The first digit is 2.",
            "The second digit is 3 more than the first.",
            "The third digit is the same as the second.",
            "The fourth digit is 2 less than the second."
        ],
        answer: "2553"
    },

    // ROUND 2 - MEDIUM
    {
        difficulty: "MEDIUM",
        clues: [
            "The first digit is 4.",
            "The second digit is 2 more than the first.",
            "The third digit is half of the first.",
            "The fourth digit is the first digit + the third digit."
        ],
        answer: "4626"
    },

    // ROUND 3 - HARD
    {
        difficulty: "HARD",
        clues: [
            "The first digit is 6.",
            "The second digit is 2 less than the first.",
            "The third digit is half of the first.",
            "The fourth digit is the first digit - the third digit."
        ],
        answer: "6433" 
    }
];

// Misc Variables
let IsSubWindow = false;

// GAME VARIABLES
let currentRound = 0;
let currentPuzzle;
let playerCode = "";
let timer;
let timeLeft = 60;
const totalRounds = 3;

// UI ELEMENTS
const messageDisplay = document.getElementById("message");
const codeDisplay = document.getElementById("code");
const timerDisplay = document.getElementById("timer");

// LOAD PUZZLE
function loadPuzzle() {
    currentPuzzle = puzzles[currentRound];
    playerCode = "";
    
    document.getElementById("round").innerText = `ROUND ${currentRound + 1}/${totalRounds} - ${currentPuzzle.difficulty}`;
    messageDisplay.innerText = "SOLVE THE CLUES TO UNLOCK";
    messageDisplay.style.color = "var(--goal)";
    
    enableButtons();
    showClues();
    updateCode();
    startTimer();
}

// SHOW CLUES
function showClues() {
    const clueBox = document.getElementById("clues");
    clueBox.innerHTML = "";

    currentPuzzle.clues.forEach(clue => {
        let text = document.createElement("p");
        text.innerText = clue;
        clueBox.appendChild(text);
    });
}

// TIMER
function startTimer() {
    clearInterval(timer);
    timeLeft = 60;
    updateTimer();

    timer = setInterval(() => {
        timeLeft--;
        updateTimer();

        if(timeLeft <= 0){
            clearInterval(timer);
            messageDisplay.innerText = "SYS_ERR: TIME EXPIRED";
            messageDisplay.style.color = "var(--text)";
            disableButtons();
        }
    }, 1000);
}

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    
    let minsStr = minutes < 10 ? "0" + minutes : minutes;
    let secsStr = seconds < 10 ? "0" + seconds : seconds;

    timerDisplay.innerText = `${minsStr}:${secsStr}`;
}

// UPDATE CODE DISPLAY
function updateCode() {
    let display = "";

    for(let i = 0; i < 4; i++){
        if(playerCode[i]){
            display += playerCode[i];
        } else {
            display += "_";
        }
        
        if (i < 3) display += " ";
    }
    
    codeDisplay.innerText = display;
}

// NUMBER BUTTONS
document.querySelectorAll(".number").forEach(button => {
    button.addEventListener("click", () => {
        if(playerCode.length < 4){
            playerCode += button.innerText;
            updateCode();
        }
    });
});

// CLEAR BUTTON
document.getElementById("clear").addEventListener("click", () => {
    playerCode = "";
    updateCode();
    messageDisplay.innerText = "INPUT CLEARED";
    messageDisplay.style.color = "var(--goal)";
});

// ENTER BUTTON
document.getElementById("enter").addEventListener("click", () => {

    if(playerCode.length !== 4){
        messageDisplay.innerText = "ERR: 4 DIGITS REQ";
        messageDisplay.style.color = "var(--text)";
        return;
    }

    if(playerCode === currentPuzzle.answer){
        clearInterval(timer);

        if(currentRound === totalRounds - 1){
            messageDisplay.innerText = "ALL LOCKS DISARMED";
            messageDisplay.style.color = "var(--goal)";
            disableButtons();
        } else {
            messageDisplay.innerText = "LOCK OPENED! NEXT SYSTEM...";
            messageDisplay.style.color = "var(--goal)";
            disableButtons(); 
            
            setTimeout(() => {
                currentRound++;
                loadPuzzle();
            }, 2000);
        }
    } else {
        messageDisplay.innerText = "ERR: INVALID CODE";
        messageDisplay.style.color = "var(--text)";
        
        setTimeout(() => {
            playerCode = "";
            updateCode();
            if(timeLeft > 0) {
                messageDisplay.innerText = "AWAITING INPUT...";
                messageDisplay.style.color = "var(--goal)";
            }
        }, 1200);
    }
});

// RESTART/REBOOT BUTTON
document.getElementById("restart").addEventListener("click", () => {
    loadPuzzle();
});

// DISABLE BUTTONS
function disableButtons() {
    document.querySelectorAll("button").forEach(button => {
        if (button.id !== "restart") {
            button.disabled = true;
        }
    });
}

// ENABLE BUTTONS
function enableButtons() {
    document.querySelectorAll("button").forEach(button => {
        button.disabled = false;
    });
}

// START GAME
loadPuzzle();

/* Check if it is in an iframe window, and if so add the ability to close with Escape Key */
if(window.frameElement){
    IsSubWindow = true;
    console.log("Subwindow, can be closed");
    window.parent.MinigameTimer = document.getElementById("timer");
    window.onkeydown = (key) => {
        if(key.code == "Escape"){
            console.log("Escape");
            window.parent.CloseMinigame();
        }
    }
} else{
    console.log("Not a Subwindow, can't be closed");
}