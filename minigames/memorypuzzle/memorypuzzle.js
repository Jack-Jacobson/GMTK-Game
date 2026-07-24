const colours = [
    "RED",
    "BLUE",
    "GREEN",
    "YELLOW",
    "BLACK",
    "WHITE",
    "PURPLE",
    "ORANGE"
];


let sequence = [];
let playerAnswer = [];

let currentRound = 1;
const totalRounds = 4;

let sequenceLength = 4;

const memorizeTimes = [
    10,
    8,
    7,
    5
];

let timer;



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

    document.getElementById("round").innerText =
        `Round ${currentRound}/${totalRounds}`;


    generateSequence();

    disableColours(true);

    showSequence();

}



// CREATE RANDOM SEQUENCE
function generateSequence() {

    for (let i = 0; i < sequenceLength; i++) {

        let randomColour =
            colours[Math.floor(Math.random() * colours.length)];

        sequence.push(randomColour);

    }

}



// SHOW SEQUENCE
function showSequence() {

    const display =
        document.getElementById("sequence");


    sequence.forEach(colour => {

        let box = document.createElement("div");

        box.className =
            "colour " + colour.toLowerCase();

        display.appendChild(box);

    });


    let time =
        memorizeTimes[currentRound - 1];


    startTimer(time);


    setTimeout(() => {

        display.innerHTML = "";

        stopTimer();


        document.getElementById("message").innerText =
            "Repeat the sequence! ";


        disableColours(false);


    }, time * 1000);

}



// TIMER
function startTimer(seconds) {

    let timeLeft = seconds;


    document.getElementById("timer").innerText =
        `Memorize: ${timeLeft}s`;


    timer = setInterval(() => {

        timeLeft--;


        document.getElementById("timer").innerText =
            `Memorize: ${timeLeft}s`;


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


        let colour =
            button.dataset.color;


        playerAnswer.push(colour);


        updateAnswer();


    });


});



// SHOW PLAYER ANSWER
function updateAnswer() {

    const answer =
        document.getElementById("answer");


    answer.innerHTML = "";


    playerAnswer.forEach(colour => {

        let box =
            document.createElement("div");


        box.className =
            "colour " + colour.toLowerCase();


        answer.appendChild(box);

    });

}



// ERASE BUTTON
document.getElementById("erase").addEventListener("click", () => {

    playerAnswer.pop();

    updateAnswer();

});



// ENTER BUTTON
document.getElementById("enter").addEventListener("click", () => {


    if (playerAnswer.length !== sequence.length) {

        document.getElementById("message").innerText =
            "Complete the sequence first! ";

        return;

    }



    if (JSON.stringify(playerAnswer) === JSON.stringify(sequence)) {


        if (currentRound === totalRounds) {


            document.getElementById("message").innerText =
                "Puzzle solved! ";


            disableColours(true);


        }

        else {


            document.getElementById("message").innerText =
                "Correct! Next round... ";


            currentRound++;

            sequenceLength++;


            setTimeout(() => {

                startRound();

            }, 1500);


        }


    }

    else {


        document.getElementById("message").innerText =
            "Wrong sequence!";


    }


});



// RESTART ROUND
document.getElementById("restart").addEventListener("click", () => {


    stopTimer();


    document.getElementById("message").innerText =
        "New pattern generated! ";


    startRound();


});



// DISABLE / ENABLE COLOUR BUTTONS
function disableColours(disabled) {


    document.querySelectorAll("#buttons .colour")
        .forEach(button => {

            button.disabled = disabled;

        });

}