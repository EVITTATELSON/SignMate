const videoMap = {
    "hello": "assets/videos/hello.mp4",
    "a": "assets/videos/A.mp4",
    "b": "assets/videos/B.mp4",
    "c": "assets/videos/C.mp4",
    "d": "assets/videos/D.mp4",
    "e": "assets/videos/E.mp4",
    "f": "assets/videos/F.mp4",
    "g": "assets/videos/G.mp4",
    "h": "assets/videos/H.mp4",
    "apple": "assets/videos/apple.mp4", // Add the video for "apple"
    "bus": "assets/videos/bus.mp4" // Add the video for "bus"
    // Add other letters and words as needed
};

// Translate input into a list of videos
function getVideosFromInput(input) {
    const words = input.split(" ");
    const videoList = [];
    let displayText = "";

    words.forEach((word) => {
        if (videoMap[word]) {
            videoList.push(videoMap[word]); // Add full word video
            displayText += word + " "; // Add the word to display text
        } else {
            word.split("").forEach((letter) => {
                if (videoMap[letter]) {
                    videoList.push(videoMap[letter]); // Add letter videos
                    displayText += letter + "-"; // Add letter with dash
                }
            });
            // Remove the last dash for the current word
            if (displayText.endsWith("-")) {
                displayText = displayText.slice(0, -1);
            }
            displayText += " "; // Add space after the word
        }
    });

    return { videoList, displayText: displayText.trim() }; // Return both video list and display text
}

// Request video stitching from the server
async function stitchVideos(videoList) {
    try {
        const response = await fetch("/stitch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videos: videoList }),
        });

        if (!response.ok) {
            throw new Error("Failed to stitch videos");
        }

        const data = await response.json(); // Assuming the server returns JSON
        return data.url; // Adjust this based on your server response
    } catch (error) {
        console.error("Error:", error);
    }
}

// Play the stitched video
document.getElementById("translateButton").addEventListener("click", async () => {
    const input = document.getElementById("textInput").value.toLowerCase().trim();
    if (!input) {
        alert("Please enter some text.");
        return;
    }

    const { videoList, displayText } = getVideosFromInput(input);
    document.getElementById("displayText").innerText = displayText; // Display the formatted text
    console.log("Video List:", videoList); // Log the video list for debugging

    const stitchedVideoUrl = await stitchVideos(videoList);

    if (stitchedVideoUrl) {
        const videoElement = document.getElementById("signVideo");
        videoElement.src = stitchedVideoUrl;

        // Force the video element to load the new source
        videoElement.load(); // Load the new video source
        videoElement.play(); // Play the new video
    }
});