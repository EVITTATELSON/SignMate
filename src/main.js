// Generate videoMap for all alphabets and include "hello"
const videoMap = {
    "hello": "assets/videos/hello.mp4" // Specific mapping for "hello"
};

const alphabet = "abcdefghijklmnopqrstuvwxyz";

// Add video mappings for each letter
alphabet.split("").forEach(letter => {
    videoMap[letter] = `assets/videos/${letter}.mp4`;
});

// Function to play the corresponding video (case-insensitive input)
function playVideo() {
    const input = document.getElementById("textInput").value.toLowerCase().trim(); // Normalize input
    const videoPath = videoMap[input];

    if (videoPath) {
        const videoElement = document.getElementById("signVideo");
        videoElement.src = videoPath; // Set the video source
        videoElement.play(); // Play the video
    } else {
        alert("No video found for the entered text. Please enter a single letter (A-Z) or 'hello'.");
    }
}

// Attach event listener to the button
document.getElementById("translateButton").addEventListener("click", playVideo);
