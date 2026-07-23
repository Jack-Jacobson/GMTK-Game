class MemoryPuzzle {
    constructor(sequenceLength = 5, displayTime = 10000) {
        this.colours = [
            "RED",
            "BLUE",
            "GREEN",
            "YELLOW",
            "BLACK",
            "WHITE",
            "PURPLE",
            "ORANGE"
        ];

        this.sequenceLength = sequenceLength;
        this.displayTime = displayTime;

        this.sequence = [];
        this.playerAnswer = [];

        this.isShowing = false;
        this.completed = false;

        this.generateSequence();
    }


    // Generate random colour sequence
    generateSequence() {
        this.sequence = [];

        for (let i = 0; i < this.sequenceLength; i++) {
            const randomColour =
                this.colours[Math.floor(Math.random() * this.colours.length)];

            this.sequence.push(randomColour);
        }
    }


    // Display pattern for 10 seconds
    showPattern() {
        this.isShowing = true;

        console.log("MEMORIZE THE COLOURS:");
        console.log(this.sequence);

        setTimeout(() => {
            this.hidePattern();
        }, this.displayTime);
    }


    hidePattern() {
        this.isShowing = false;

        console.log("Pattern hidden. Repeat the sequence.");
    }


    // Player selects a colour
    input(color) {

        if (this.isShowing) {
            return {
                solved: false,
                message: "Wait until the pattern disappears!"
            };
        }


        this.playerAnswer.push(color);

        const index = this.playerAnswer.length - 1;


        // Wrong colour
        if (this.playerAnswer[index] !== this.sequence[index]) {
            return {
                solved: false,
                failed: true,
                message: "Wrong colour!"
            };
        }


        // Completed
        if (this.playerAnswer.length === this.sequence.length) {
            this.completed = true;

            return {
                solved: true,
                failed: false,
                message: "Memory puzzle completed!"
            };
        }


        return {
            solved: false,
            failed: false,
            message: "Correct!"
        };
    }


    reset() {
        this.sequence = [];
        this.playerAnswer = [];
        this.completed = false;

        this.generateSequence();
    }


    isSolved() {
        return this.completed;
    }
}