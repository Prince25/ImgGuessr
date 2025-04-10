document.addEventListener('DOMContentLoaded', async () => {
    const imageContainer = document.getElementById('image-container');
    const imageElement = document.getElementById('image');
    const guessInput = document.getElementById('guess');
    const submitButton = document.getElementById('submit');
    const scoreElement = document.getElementById('score');
    const answerElement = document.getElementById('answer');
    const continueButton = document.getElementById('continue');
    const loadingSpinner = document.getElementById('loading-spinner');

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
        // Show loading spinner and hide current image
        loadingSpinner.classList.remove('hidden');
        imageElement.style.visibility = 'hidden';
        
        try {
            // Get new image
            currentImage = await window.api.getImage();
            
            // Preload the image
            const img = new Image();
            img.onload = () => {
                // When image is loaded, update UI and hide spinner
                updateUI();
                imageElement.style.visibility = 'visible';
                loadingSpinner.classList.add('hidden');
                guessInput.focus();
            };
            
            img.onerror = () => {
                // In case of error, still hide spinner
                loadingSpinner.classList.add('hidden');
                imageElement.style.visibility = 'visible';
                console.error("Failed to load image");
            };
            
            img.src = currentImage.image_url;
        } catch (error) {
            console.error("Error loading new image:", error);
            loadingSpinner.classList.add('hidden');
            imageElement.style.visibility = 'visible';
        }
        
        // Clear any existing guess
        guessInput.value = '';
    }

    // Add event listeners for clicks
    submitButton.addEventListener('click', submitGuess);
    continueButton.addEventListener('click', continuePlaying);
    
    // Add event listener for Enter key
    guessInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitGuess();
        }
    });

    // Initial load
    await continuePlaying();
});