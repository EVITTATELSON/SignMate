const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS, and videos)
app.use(express.static(path.join(__dirname)));
app.use(express.json()); // To parse JSON bodies

app.post("/stitch", (req, res) => {
    const videos = req.body.videos;

    // Create a temporary file to store the video list for FFmpeg
    const videoListPath = path.join(__dirname, "videoList.txt");
    fs.writeFileSync(videoListPath, videos.map(video => `file '${video}'`).join('\n'));

    const outputDir = path.join(__dirname, "output");
    const outputVideoPath = path.join(outputDir, "stitched.mp4");

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir); // Create the output directory if it doesn't exist
    }

    // Delete the existing output video if it exists
    if (fs.existsSync(outputVideoPath)) {
        fs.unlinkSync(outputVideoPath);
    }

    // Example command (make sure FFmpeg is installed and in your PATH)
    const command = `ffmpeg -f concat -safe 0 -i ${videoListPath} -c copy ${outputVideoPath}`;

    exec(command, (error) => {
        // Clean up the video list file after FFmpeg has finished
        if (fs.existsSync(videoListPath)) {
            fs.unlinkSync(videoListPath);
        }

        if (error) {
            console.error(`Error stitching videos: ${error.message}`);
            return res.status(500).json({ error: "Failed to stitch videos" });
        }

        // Return the URL of the stitched video
        res.json({ url: `/output/stitched.mp4` });

        // Optionally, delete the output video after a certain time
        setTimeout(() => {
            if (fs.existsSync(outputVideoPath)) {
                fs.unlinkSync(outputVideoPath);
                console.log("Deleted the output video after playback.");
            }
        }, 10000); // Adjust the time as needed (e.g., 10000 ms = 10 seconds)
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and visit http://localhost:${PORT}`);
});