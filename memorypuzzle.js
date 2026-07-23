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

const sequenceLength = 5;


// Generate random colour sequence
function generateSequence() {
    for (let i = 0; i < sequenceLength; i++) {
        let randomColour =
            colours[Math.floor(Math.random() * colours.length)];

        sequence.push(randomColour);
    }
}


// Show sequence for 10 seconds
function showSequence() {

    const display = document.getElementById("sequence");

    sequence.forEach(colour => {

        let box = document.createElement("div");

        box.className = "colour " + colour.toLowerCase();

        display.appendChild(box);

    });


    setTimeout(() => {

        display.innerHTML = "";

        document.getElementById("message").innerText =
            "Repeat the sequence!";

    }, 10000);
}


// Check player's colour choice
document.querySelectorAll(".colour").forEach(button => {

    button.addEventListener("click", () => {

        let clickedColour = button.dataset.color;

        playerAnswer.push(clickedColour);

        let index = playerAnswer.length - 1;


        // Wrong colour
        if (playerAnswer[index] !== sequence[index]) {

            document.getElementById("message").innerText =
                "Puzzle failed!";

            return;
        }


        // Completed sequence
        if (playerAnswer.length === sequence.length) {

            document.getElementById("message").innerText =
                "Puzzle solved!";

        }

    });

});


generateSequence();
showSequence();