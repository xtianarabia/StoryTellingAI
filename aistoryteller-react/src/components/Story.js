import React from 'react';

const Story = ({ text }) => {
    return (
        <div className="story-container">
            <p className="story-text">{text}</p>
        </div>
    );
};

export default Story;
