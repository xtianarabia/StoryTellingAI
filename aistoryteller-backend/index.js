require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// --- Authentication and AI Client Setup ---
// The GOOGLE_APPLICATION_CREDENTIALS environment variable in the .env file
// points to the service account key file. The GoogleAuth library
// automatically finds and uses it.
const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
});
const genAI = new GoogleGenAI({ auth });


// Create the videos directory if it doesn't exist
const videosDir = path.join(__dirname, 'videos');
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir);
}

app.post('/api/generate-video', async (req, res) => {
    const { prompt } = req.body;
    console.log("Received prompt:", prompt);

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        console.log("Generating video with prompt:", prompt);

        const operation = await genAI.models.generateVideos({
            model: 'veo-2', // Ensure this model is available in your project
            prompt: prompt,
        });

        console.log("Video generation started. Polling for completion...");

        while (!operation.done) {
            await new Promise((resolve) => setTimeout(resolve, 10000));
            operation = await genAI.operations.getVideosOperation({ name: operation.name });
        }

        console.log("Video generation complete.");
        const generatedVideo = operation.response.generatedVideos[0];
        console.log("Generated video details:", generatedVideo);

        const videoFileName = `${Date.now()}.mp4`;
        const videoPath = path.join(videosDir, videoFileName);

        const videoUri = generatedVideo.video.uri;
        const videoFile = fs.createWriteStream(videoPath);

        https.get(videoUri, (response) => {
            response.pipe(videoFile);
            videoFile.on('finish', () => {
                const videoUrl = `${req.protocol}://${req.get('host')}/videos/${videoFileName}`;
                console.log("Video successfully downloaded and saved. URL:", videoUrl);
                res.json({ videoUrl });
            });
        }).on('error', (err) => {
            console.error("Error downloading the video file:", err);
            res.status(500).json({ error: 'Failed to download video file' });
        });

    } catch (error) {
        console.error("An error occurred during the video generation process:", error);
        res.status(500).json({
            error: 'Failed to generate video',
            details: error.message || 'An unknown error occurred.'
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});