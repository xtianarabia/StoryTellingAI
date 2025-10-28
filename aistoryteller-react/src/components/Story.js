import React, { useState } from 'react';
import aiService from '../services/aiService';

const Story = ({ text }) => {
    const [videoUrl, setVideoUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateVideo = async () => {
        setIsLoading(true);
        setVideoUrl(null);
        const url = await aiService.generateVideo(text);
        setVideoUrl(url);
        setIsLoading(false);
    };

    return (
        <div className="story-container">
            <p className="story-text">{text}</p>
            <button onClick={handleGenerateVideo} disabled={isLoading}>
                {isLoading ? 'Generating Video...' : 'Generate Video'}
            </button>
            {videoUrl && (
                <div className="video-container">
                    <video src={videoUrl} controls autoPlay />
                </div>
            )}
        </div>
    );
};

export default Story;
