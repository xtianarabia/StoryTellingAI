document.addEventListener('DOMContentLoaded', () => {
    const storyTextElement = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices-container');

    const mockAIService = {
        story: {
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
        },
        getNextStoryPart: function(choice) {
            return this.story[choice];
        }
    };

    let currentStoryPart = 'start';

    function displayStoryPart(part) {
        storyTextElement.textContent = part.text;
        choicesContainer.innerHTML = '';
        part.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                currentStoryPart = choice.next;
                const nextPart = mockAIService.getNextStoryPart(currentStoryPart);
                if (nextPart) {
                    displayStoryPart(nextPart);
                }
            });
            choicesContainer.appendChild(button);
        });
    }

    const initialPart = mockAIService.getNextStoryPart(currentStoryPart);
    displayStoryPart(initialPart);
});
