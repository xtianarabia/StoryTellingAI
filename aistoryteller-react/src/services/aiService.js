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

const realAIService = {
    getStoryPart: async (prompt) => {
        // TODO: Implement the real AI service call here
        console.warn("Real AI service is not implemented yet. Using mock data.");
        return mockAIService.getStoryPart(prompt);
    }
};

const useRealAI = false; // Set to true to use the real AI service

const aiService = useRealAI ? realAIService : mockAIService;

export default aiService;
