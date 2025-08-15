import React, { useState, useEffect } from 'react';
import './App.css';
import Story from './components/Story';
import Choices from './components/Choices';
import aiService from './services/aiService';

function App() {
  const [currentStoryPart, setCurrentStoryPart] = useState(null);
  const [storyKey, setStoryKey] = useState('start');

  useEffect(() => {
    const fetchStoryPart = async () => {
      const part = await aiService.getStoryPart(storyKey);
      setCurrentStoryPart(part);
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

export default App;
