const print = require("./src/printToConsole.js");
const askQuestion = require('./src/askQuestion.js');
const playRound = require("./src/shutterStock.js").playRound;

async function start() {
    let continue_playing = true;
    do {
        await playRound();
        const ans = await askQuestion("Do you still want to play [Y/N]? ");
        continue_playing = ans === "Y";
    } while (continue_playing);
    print("\ninfo", "Thanks for playing!")
}

start();