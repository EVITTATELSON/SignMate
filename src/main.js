// Map text inputs to video file paths
const videoMap = {
    "hello": "assets/videos/hello.mp4",
    "thank you": "assets/videos/thank_you.mp4",
    "please": "assets/videos/please.mp4"
};

// Function to play the corresponding video
function playVideo() {
    const input = document.getElementById("textInput").value.toLowerCase().trim();
    const videoPath = videoMap[input];

    if (videoPath) {
        const videoElement = document.getElementById("signVideo");
        videoElement.src = videoPath;
        videoElement.play();
    } else {
        alert("No video found for the entered text. Try again!");
    }
}

// Attach event listener to the button
document.getElementById("translateButton").addEventListener("click", playVideo);
