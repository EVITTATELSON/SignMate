/*// Generate videoMap for all alphabets and predefined words
const videoMap = {
    "hello": "assets/videos/hello.mp4" // Specific mapping for the word "hello"
};

const alphabet = "abcdefghijklmnopqrstuvwxyz";

// Add video mappings for each letter
alphabet.split("").forEach(letter => {
    videoMap[letter] = `assets/videos/${letter}.mp4`;
});

// Function to play a sequence of videos
function playSequence(input) {
    const videoElement = document.getElementById("signVideo");

    // Check if the input is a predefined word
    if (videoMap[input]) {
        videoElement.src = videoMap[input];
        videoElement.play();
        return;
    }

    // Split the input into individual letters and play each one sequentially
    const letters = input.split("");
    let index = 0;

    function playNext() {
        if (index < letters.length) {
            const letter = letters[index];
            const videoPath = videoMap[letter];

            if (videoPath) {
                videoElement.src = videoPath;
                videoElement.play();
                index++;

                // Play the next video when the current one ends
                videoElement.onended = playNext;
            } else {
                alert(`No video found for the character: ${letter}`);
                index++; // Skip to the next character
                playNext(); // Call recursively
            }
        }
    }

    playNext(); // Start the sequence
}

// Event listener for the Translate button
document.getElementById("translateButton").addEventListener("click", () => {
    const input = document.getElementById("textInput").value.toLowerCase().trim();
    if (/^[a-z]+$/.test(input)) {
        playSequence(input); // Play the sequence for the entered text
    } else {
        alert("Please enter a valid word using letters A-Z only.");
    }
}); */



// Generate videoMap for all alphabets and predefined words
const videoMap = {
    "hello": "assets/videos/hello.mp4" // Specific mapping for the word "hello"
};

const alphabet = "abcdefghijklmnopqrstuvwxyz";

// Add video mappings for each letter
alphabet.split("").forEach(letter => {
    videoMap[letter] = `assets/videos/${letter}.mp4`;
});

// Function to play videos for a word
function playWord(word, callback) {
    const videoElement = document.getElementById("signVideo");

    // Check if the word is predefined
    if (videoMap[word]) {
        videoElement.src = videoMap[word];
        videoElement.play();

        // Call the callback when the video ends
        videoElement.onended = callback;
    } else {
        // Play videos for each letter in the word
        const letters = word.split("");
        let index = 0;

        function playNext() {
            if (index < letters.length) {
                const letter = letters[index];
                const videoPath = videoMap[letter];

                if (videoPath) {
                    videoElement.src = videoPath;
                    videoElement.play();
                    index++;

                    // Play the next video when the current one ends
                    videoElement.onended = playNext;
                } else {
                    alert(`No video found for the character: ${letter}`);
                    index++; // Skip to the next character
                    playNext(); // Call recursively
                }
            } else {
                // Call the callback when all letters are played
                callback();
            }
        }

        playNext(); // Start the sequence
    }
}

// Function to process the entire input
function playSequence(input) {
    const words = input.split(/\s+/); // Split the input into words
    let wordIndex = 0;

    function playNextWord() {
        if (wordIndex < words.length) {
            const word = words[wordIndex];
            wordIndex++;
            playWord(word, playNextWord); // Play the current word and move to the next
        }
    }

    playNextWord(); // Start processing the words
}

// Event listener for the Translate button
document.getElementById("translateButton").addEventListener("click", () => {
    const input = document.getElementById("textInput").value.toLowerCase().trim();
    if (/^[a-z\s]+$/.test(input)) {
        playSequence(input); // Process the input
    } else {
        alert("Please enter valid words using letters A-Z and spaces only.");
    }
});
