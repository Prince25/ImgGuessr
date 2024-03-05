const fs = require("fs");
const print = require("./printToConsole.js");


let saveFileName = "";

function initializeSaveFile(fileName) {
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

function loadSaveFile() {
    try {
        return JSON.parse(fs.readFileSync(saveFileName));
    } catch (error) {
        print("error", error);
        return {};
    }
}

function saveFile(data) {
    try {
        const old = loadSaveFile();
        data = Object.assign(old, data);
        fs.writeFileSync(saveFileName, JSON.stringify(data, null, 4));
    } catch (error) {
        print("error", error);
    }
}

module.exports = {
    initializeSaveFile,
    loadSaveFile,
    saveFile
};