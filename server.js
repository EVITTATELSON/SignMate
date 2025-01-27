const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS, and videos)
app.use(express.static(path.join(__dirname)));
app.use(express.json()); // To parse JSON bodies

// Endpoint to delete a video
app.post("/delete", (req, res) => {
    const { videoPath } = req.body;
    const fullPath = path.join(__dirname, videoPath);

    fs.unlink(fullPath, (err) => {
        if (err) {
            console.error(`Error deleting video: ${err.message}`);
            return res.status(500).json({ error: "Failed to delete video" });
        }
        console.log(`Deleted video: ${fullPath}`);
        res.json({ message: "Video deleted successfully" });
    });
});

app.post("/stitch", (req, res) => {
    const videos = req.body.videos;
    console.log("Received videos for stitching:", videos); // Log received videos

    // Create a temporary file to store the video list for FFmpeg
    const videoListPath = path.join(__dirname, "videoList.txt");
    fs.writeFileSync(videoListPath, videos.map(video => `file '${video}'`).join('\n'));

    const outputDir = path.join(__dirname, "output");
    const timestamp = Date.now(); // Use timestamp for unique file names
    const outputVideoPath = path.join(outputDir, `stitched_${timestamp}.mp4`);

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir); // Create the output directory if it doesn't exist
    }

    // Delete the existing output video if it exists
    if (fs.existsSync(outputVideoPath)) {
        fs.unlinkSync(outputVideoPath);
    }

    // Example command (make sure FFmpeg is installed and in your PATH)
    const command = `ffmpeg -f concat -safe 0 -i ${videoListPath} -c copy -preset ultrafast ${outputVideoPath}`;
    console.log("Executing command:", command); // Log the FFmpeg command

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
        console.log("Stitched video created at:", outputVideoPath); // Log the output path
        res.json({ url: `/output/stitched_${timestamp}.mp4` });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and visit http://localhost:${PORT}`);
});