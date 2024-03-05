
document.addEventListener('DOMContentLoaded', async () => {
    const imageContainer = document.getElementById('image-container');
    const imageElement = document.getElementById('image');
    const guessInput = document.getElementById('guess');
    const submitButton = document.getElementById('submit');
    const scoreElement = document.getElementById('score');
    const answerElement = document.getElementById('answer');
    const continueButton = document.getElementById('continue');

    let currentImage;

    function updateUI() {
        imageElement.src = currentImage.image_url;
        scoreElement.textContent = '';
        answerElement.textContent = '';
    }


    function submitGuess() {
        let guess, imageName;
        const remove_regex = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g; // Regex for removing characters
        const replace_regex = /[\_\-]/g;  // Regex for replacing characters with space

        guess = guessInput.value.trim();
        guess = guess.replace(remove_regex, '');
        guess = guess.replace(replace_regex, ' ').toLowerCase();

        imageName = currentImage.name.replace(remove_regex, '');
        imageName = imageName.replace(replace_regex, ' ').toLowerCase();

        const score = Math.round(window.api.compareTwoStrings(currentImage.name, guess) * 5000); // Score out of the 5000 points
        scoreElement.textContent = `Score: ${score}`;
        answerElement.textContent = `Answer: ${imageName}`;
    }


    async function continuePlaying() {
        currentImage = await window.api.getImage();
        updateUI();
        guessInput.value = '';
        guessInput.focus();
    }


    submitButton.addEventListener('click', submitGuess);
    continueButton.addEventListener('click', continuePlaying);


    await continuePlaying();
});