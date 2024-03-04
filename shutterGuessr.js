import print from "./utils/printToConsole.js";
import askQuestion from './utils/askQuestion.js';
import { playRound } from "./utils/shutterStock.js";


let continue_playing = true;
do {
    await playRound();
    const ans = await askQuestion("Do you still want to play [Y/N]? ");
    continue_playing = ans === "Y";
} while (continue_playing);

print("\ninfo", "Thanks for playing!")