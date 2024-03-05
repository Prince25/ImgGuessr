const path = require('node:path')
const { contextBridge } = require('electron');
const { compareTwoStrings } = require("string-similarity");
const { getImage } = require((path.join(__dirname, '..', 'src', 'shutterStock.js')));

// Expose protected methods that allow the renderer process to use
contextBridge.exposeInMainWorld(
  "api", {
    // Fetches an image from shutterStock
    getImage: async () => {
        const image = await getImage();
        return image;
    },

    // Compares the similarity between two strings
    compareTwoStrings: (string1, string2) => {
        return compareTwoStrings(string1, string2);
    },

    // Sends data to the main process through a whitelisted channel
    send: (channel, data) => {
      // whitelist channels
      let validChannels = ["toMain"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },

    // Receives data from the main process through a whitelisted channel
    receive: (channel, func) => {
      let validChannels = ["fromMain"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  }
);