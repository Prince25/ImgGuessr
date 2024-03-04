import fs from "fs";
import print from "./printToConsole.js";

let saveFileName = "";

export function initializeSaveFile(fileName) {
    print("setup", "Checking for save file...");
    saveFileName = "./data/" + fileName + ".json";

    if (!fs.existsSync(saveFileName)) {
        print("setup", "Save file not found. Creating new one...");
        fs.writeFileSync(saveFileName, JSON.stringify({}));
    }
    else {
        print("setup", "Save file found.");
    }
}

export function loadSaveFile() {
    try {
        return JSON.parse(fs.readFileSync(saveFileName));
    } catch (error) {
        print("error", error);
        return {};
    }
}

export function saveFile(data) {
    try {
        const old = loadSaveFile();
        data = Object.assign(old, data);
        fs.writeFileSync(saveFileName, JSON.stringify(data, null, 4));
    } catch (error) {
        print("error", error);
    }
}