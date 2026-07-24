const puzzles = [

    // ROUND 1 - EASY
    {
        difficulty: "Easy",

        clues: [
            "The first digit is 2.",
            "The second digit is 3 more than the first.",
            "The third digit is the same as the second.",
            "The fourth digit is half of the second plus 1."
        ],

        answer: "2553"
    },


    // ROUND 2 - MEDIUM
    {
        difficulty: "Medium",

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
        difficulty: "Hard",

        clues: [
            "The first digit is 6.",
            "The second digit is 2 less than the first.",
            "The third digit is half of the first.",
            "The fourth digit is the first digit - the third digit."
        ],

        answer: "6423"
    }

];


// GAME VARIABLES

let currentRound = 0;

let currentPuzzle;

let playerCode = "";

let timer;

let timeLeft = 60;

const totalRounds = 3;



// LOAD PUZZLE

function loadPuzzle(){


    currentPuzzle = puzzles[currentRound];


    playerCode = "";


    document.getElementById("round").innerText =
    `ROUND ${currentRound + 1}/${totalRounds} - ${currentPuzzle.difficulty}`;


    document.getElementById("message").innerText =
    "Solve the clues to unlock the lock.";


    showClues();


    updateCode();


    startTimer();

}



// SHOW CLUES

function showClues(){


    const clueBox =
    document.getElementById("clues");


    clueBox.innerHTML = "";


    currentPuzzle.clues.forEach(clue => {


        let text = document.createElement("p");

        text.innerText = "• " + clue;


        clueBox.appendChild(text);


    });


}



// TIMER

function startTimer(){

    clearInterval(timer);

    timeLeft = 60;


    updateTimer();


    timer = setInterval(() => {

        timeLeft--;

        updateTimer();


        if(timeLeft <= 0){

            clearInterval(timer);

            document.getElementById("message").innerText =
            "TIME'S UP ";

            disableButtons();

        }


    },1000);

}



function updateTimer(){

    let minutes = Math.floor(timeLeft / 60);

    let seconds = timeLeft % 60;


    if(seconds < 10){
        seconds = "0" + seconds;
    }


    document.getElementById("timer").innerText =
    `TIME LEFT: ${minutes}:${seconds}`;

}


// UPDATE CODE DISPLAY

function updateCode(){


    let display = "";


    for(let i = 0; i < 4; i++){


        if(playerCode[i]){

            display += playerCode[i] + " ";

        }

        else{

            display += "_ ";

        }

    }


    document.getElementById("code").innerText =
    display;


}



// NUMBER BUTTONS

document.querySelectorAll(".number")
.forEach(button => {


    button.addEventListener("click", () => {


        if(playerCode.length < 4){


            playerCode += button.innerText;


            updateCode();


        }


    });


});



// CLEAR BUTTON

document.getElementById("clear")
.addEventListener("click", () => {


    playerCode = "";


    updateCode();


});



// ENTER BUTTON

document.getElementById("enter")
.addEventListener("click", () => {


    if(playerCode.length !== 4){


        document.getElementById("message").innerText =
        "Enter a 4 digit code!";


        return;

    }



    if(playerCode === currentPuzzle.answer){


        clearInterval(timer);



        if(currentRound === totalRounds - 1){


            document.getElementById("message").innerText =
            "LOCK DISARMED";


            disableButtons();


        }


        else{


            document.getElementById("message").innerText =
            "LOCK OPENED! NEXT SECURITY SYSTEM... ";


            setTimeout(() => {


                currentRound++;


                loadPuzzle();


            },1500);


        }


    }


    else{


        document.getElementById("message").innerText =
        "INCORRECT CODE ";


    }


});



// RESTART ROUND

document.getElementById("restart")
.addEventListener("click", () => {


    loadPuzzle();


});



// DISABLE BUTTONS

function disableButtons(){


    document.querySelectorAll("button")
    .forEach(button => {


        button.disabled = true;


    });


}



// START GAME

loadPuzzle();