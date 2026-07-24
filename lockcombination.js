const puzzles = [

{
    difficulty:"Easy",

    clues:[
        "The first digit is 2.",
        "The second digit is 3 more than the first.",
        "The third digit is the same as the second.",
        "The fourth digit is half of the second plus 1."
    ],

    answer:"2553"
},


{
    difficulty:"Medium",

    clues:[
        "The first digit is 4.",
        "The second digit is double the first minus 2.",
        "The third digit is half of the first.",
        "The fourth digit is the first digit + the third digit."
    ],

    answer:"4626"
},


{
    difficulty:"Hard",

    clues:[
        "The first digit is 6.",
        "The second digit is 2 less than the first.",
        "The third digit is half of the first.",
        "The fourth digit is the first digit minus the third digit."
    ],

    answer:"6423"
}

];

let round = 1;
let maxRounds = 3;
let timeLeft = 120;
let timer;

let currentPuzzle;

let playerCode = "";



function loadPuzzle(){


    currentPuzzle =
        puzzles[Math.floor(Math.random()*puzzles.length)];


    playerCode="";


    displayClues();

    updateCode();


}



function displayClues(){


    let clueBox =
        document.getElementById("clues");


    clueBox.innerHTML="";


    currentPuzzle.clues.forEach(clue=>{


        let p=document.createElement("p");

        p.innerText="• "+clue;

        clueBox.appendChild(p);


    });


}



function updateCode(){


    let display="";


    for(let i=0;i<4;i++){

        if(playerCode[i]){

            display+=playerCode[i]+" ";

        }

        else{

            display+="_ ";

        }

    }


    document.getElementById("code").innerText=display;


}



document.querySelectorAll(".number").forEach(button=>{


    button.addEventListener("click",()=>{


        if(playerCode.length<4){

            playerCode += button.innerText;

            updateCode();

        }


    });


});



document.getElementById("clear")
.addEventListener("click",()=>{


    playerCode="";

    updateCode();


});



document.getElementById("enter")
.addEventListener("click",()=>{


    if(playerCode === currentPuzzle.answer){


        document.getElementById("message").innerText =
        "PUZZLE SOLVED ";


    }

    else{


        document.getElementById("message").innerText =
        "INCORRECT CODE TRY AGAIN";


    }


});



document.getElementById("restart")
.addEventListener("click",()=>{


    loadPuzzle();


    document.getElementById("message").innerText =
    "Solve the clues to unlock the safe.";


});



loadPuzzle();






