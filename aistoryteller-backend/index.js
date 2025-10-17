require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/videos', express.static(path.join(__dirname, 'videos')));

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

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
        const model = genAI.getGenerativeModel({ model: "veo-3.1-generate-preview" });
        let operation = await model.generateVideos({ prompt });

        console.log("Video generation started. Polling for completion...");

        while (!operation.done) {
            await new Promise((resolve) => setTimeout(resolve, 10000));
            operation = await genAI.operations.getVideosOperation({ operation });
        }

        console.log("Video generation complete.");
        const generatedVideo = operation.response.generatedVideos[0];
        console.log("Inspecting generatedVideo object:", generatedVideo);

        const videoFileName = `${Date.now()}.mp4`;
        const videoPath = path.join(videosDir, videoFileName);

        const videoUri = generatedVideo.video.uri;
        const videoFile = fs.createWriteStream(videoPath);

        https.get(videoUri, (response) => {
            response.pipe(videoFile);
            videoFile.on('finish', () => {
                const videoUrl = `${req.protocol}://${req.get('host')}/videos/${videoFileName}`;
                res.json({ videoUrl });
            });
        }).on('error', (err) => {
            console.error("Error downloading video:", err);
            res.status(500).json({ error: 'Failed to download video' });
        });

    } catch (error) {
        console.error("Full error object:", JSON.stringify(error, null, 2));
        res.status(500).json({ error: 'Failed to generate video', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});