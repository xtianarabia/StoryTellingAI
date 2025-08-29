import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Mock AI Service ---
const mockStoryData = {
    start: {
        text: "You find yourself in a dark forest. You can hear a strange noise to your left and see a faint light to your right.",
        choices: [
            { text: "Go left towards the noise", next: "left_noise" },
            { text: "Go right towards the light", next: "right_light" }
        ]
    },
    left_noise: {
        text: "You follow the noise and find a friendly goblin who offers you a mysterious potion.",
        choices: [
            { text: "Drink the potion", next: "drink_potion" },
            { text: "Thank the goblin and leave", next: "leave_goblin" }
        ]
    },
    right_light: {
        text: "You walk towards the light and find a beautiful clearing with a sparkling fountain.",
        choices: [
            { text: "Drink from the fountain", next: "drink_fountain" },
            { text: "Rest by the fountain", next: "rest_fountain" }
        ]
    },
    drink_potion: {
        text: "The potion makes you feel strong and powerful. You feel ready for any challenge. The end.",
        choices: []
    },
    leave_goblin: {
        text: "You leave the goblin and continue your journey. The end.",
        choices: []
    },
    drink_fountain: {
        text: "The water from the fountain is refreshing and you feel rejuvenated. The end.",
        choices: []
    },
    rest_fountain: {
        text: "You rest by the fountain and feel at peace. The end.",
        choices: []
    }
};

const mockAIService = {
    getStoryPart: (part) => {
        return new Promise((resolve) => {
            resolve(mockStoryData[part]);
        });
    }
};

// --- Real AI Service ---
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const realAIService = {
    getStoryPart: async (prompt) => {
        const MAX_RETRIES = 3;
        let attempt = 0;
        let delay = 1000; // Start with a 1-second delay

        while (attempt < MAX_RETRIES) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

                const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
                if (jsonMatch && jsonMatch[1]) {
                    text = jsonMatch[1];
                }

                const storyPart = JSON.parse(text);
                return storyPart;

            } catch (error) {
                if (error.message.includes("503")) {
                    console.warn(`Attempt ${attempt + 1} failed with 503 error. Retrying in ${delay / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                    attempt++;
                } else {
                    console.error("Error calling the AI service:", error);
                    // Fallback to mock service for other errors
                    return mockAIService.getStoryPart('start');
                }
            }
        }

        console.error("All retry attempts failed. Falling back to mock service.");
        return mockAIService.getStoryPart('start');
    }
};

// --- Service Configuration ---
const useRealAI = true; // Set to true to use the real AI service

const aiService = useRealAI ? realAIService : mockAIService;

export default aiService;
