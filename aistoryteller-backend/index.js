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

// --- Simple API Key Authentication ---
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
  console.error("FATAL ERROR: GOOGLE_API_KEY is not set in the .env file.");
  console.error("Please create a .env file in the aistoryteller-backend directory and add your key from Google AI Studio.");
  process.exit(1);
}

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

        // NOTE: The @google/generative-ai library does not have a direct `generateVideos` method.
        // This is a placeholder call. If this fails, it confirms the library limitation.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Using a standard model
        const result = await model.generateContent(`Generate a short, 5-second video description for this prompt, which will be used to create a video: ${prompt}`);

        // This part is a simulation, as the library does not support video generation directly.
        // We will simulate the process by creating a dummy video file.
        console.log("Simulating video generation based on description:", result.response.text());

        const videoFileName = `${Date.now()}.mp4`;
        const videoPath = path.join(videosDir, videoFileName);

        // Create a dummy file to represent the video
        fs.writeFileSync(videoPath, 'dummy video content');

        const videoUrl = `${req.protocol}://${req.get('host')}/videos/${videoFileName}`;
        console.log("Video successfully simulated. URL:", videoUrl);
        res.json({ videoUrl });

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