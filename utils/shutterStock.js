import dotenv from "dotenv";
import sstk from "shutterstock-api";    // https://www.npmjs.com/package/shutterstock-api
import print from "./printToConsole.js";
import askQuestion from "./askQuestion.js";
import { compareTwoStrings } from "string-similarity";
import { initializeSaveFile, loadSaveFile, saveFile } from './saveFileHandler.js';

dotenv.config();
initializeSaveFile(process.env.SAVE_FILE_NAME);
sstk.setAccessToken(process.env.SHUTTERSTOCK_API_TOKEN);

const imagesApi = new sstk.ImagesApi();
const CATEGORIES = [    // https://support.submit.shutterstock.com/s/article/Which-tags-and-categories-should-I-use-for-my-content?language=en_US
  "Animals/Wildlife", "Buildings/Landmarks", "Celebrities", 
  "Food and Drink", "Nature", "People", "Transportation", "Vintage",
  "All"
]


function getImage(category) {
  return new Promise(resolve => {
    category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]  // Get random category
    const queryParams = {   // https://api-reference.shutterstock.com/#images-search-for-images
      "query": "",
      "category": category === "All" ? "" : category,
      "image_type": "photo",
      "sort": "random",
      "keyword_safe_search": false,
      "safe": true,
      // "per_page": 20,
      //   "page": 1
    };
    
    
    category = category === "All" ? "Random" : category;
    print("setup", "Fetching data from Shutterstock...");
    imagesApi.searchImages(queryParams)
    .then(({ data }) => {
        print("setup", "Done\n");
  
        const saveFormat = {};
        saveFormat[category] = {};
        for (let image of data) {
          if (image.image_type === "photo")
            saveFormat[category][image.id] = {
              name: image.description,
              contributor_id: image.contributor.id,
              image_url: image.assets?.preview_1500?.url,
              url: "https://www.shutterstock.com/image-photo/" + image.id,
              used: false
            }
        }
        saveFile(saveFormat);
  
        const category_data = Object.keys(saveFormat[category]);
        const random_image_id = category_data[Math.floor(Math.random() * category_data.length)];
        resolve(saveFormat[category][random_image_id]);
      })
      .catch((error) => {
        print("error", error);
        const data = loadSaveFile();
        if (data && data[category]) {
          const category_data = Object.keys(data[category]);
          const random_image_id = category_data[Math.floor(Math.random() * category_data.length)];
          print("INFO", "Error occurred fetching data from ShutterStock. Using saved data instead.\n")
          resolve(data[category][random_image_id]);
        } else {
          print("error", "Error occurred fetching data from ShutterStock and no saved data was available for the category, " + category + ".\n");
        }
      });
  })
}

export async function playRound(category) {
  const image = await getImage(category);
  const remove_regex = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g; // Regex for removing characters
  const replace_regex = /[\_\-]/g;  // Regex for replacing characters with space

  print("info", "Welcome to ShutterGuessr!\n")
  let guess, imageName;
  guess = await askQuestion("Guess the name for this image: " + image.image_url + "\n");
  guess = guess.replace(remove_regex, '');
  guess = guess.replace(replace_regex, ' ').toLowerCase();
  imageName = image.name.replace(remove_regex, '');
  imageName = imageName.replace(replace_regex, ' ').toLowerCase();
  const score = Math.round(compareTwoStrings(imageName, guess) * 5000); // Score out of the 5000 points

  print("SCORE", `You got ${score} points!`);
  print("ANSWER", `The answer was "${image.name}"`);
}