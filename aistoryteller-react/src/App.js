import React, { useState, useEffect } from 'react';
import './App.css';
import Story from './components/Story';
import Choices from './components/Choices';
import aiService from './services/aiService';

function App() {
  const [currentStoryPart, setCurrentStoryPart] = useState(null);
  const [storyKey, setStoryKey] = useState('start');
  const [storyHistory, setStoryHistory] = useState([]);

  useEffect(() => {
    const fetchStoryPart = async () => {
      const prompt = createPrompt(storyKey, storyHistory);
      const part = await aiService.getStoryPart(prompt);
      setCurrentStoryPart(part);
      setStoryHistory(prevHistory => [...prevHistory, part.text]);
    };

    fetchStoryPart();
  }, [storyKey]);

  const handleChoice = (nextPart) => {
    setStoryKey(nextPart);
  };

  if (!currentStoryPart) {
    return <div>Loading story...</div>;
  }

  return (
    <div className="App">
      <div className="background-container">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
      <header className="App-header">
        <h1>AI Storyteller</h1>
      </header>
      <main>
        <Story text={currentStoryPart.text} />
        <Choices choices={currentStoryPart.choices} onChoiceSelected={handleChoice} />
      </main>
    </div>
  );
}

function createPrompt(currentChoice, history) {
  const historyText = history.join("\n");
  const prompt = `
You are a creative AI story teller.
Your goal is to create an interactive story that unfolds based on the user's choices.
The user has just made the choice: "${currentChoice}"
The story so far is:
${historyText}

Please generate the next part of the story.
Your response must be a JSON object with the following structure:
{
  "text": "The next part of the story...",
  "choices": [
    { "text": "Choice 1", "next": "choice_1_key" },
    { "text": "Choice 2", "next": "choice_2_key" }
  ]
}

The "text" should be a short paragraph continuing the story.
The "choices" should be an array of 2 to 4 options for the user to choose from.
The "next" value for each choice should be a short, unique key in snake_case that represents the choice.
Do not include any other text or formatting in your response.
`;
  return prompt;
}

export default App;
