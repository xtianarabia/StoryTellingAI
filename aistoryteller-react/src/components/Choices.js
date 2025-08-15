import React from 'react';

const Choices = ({ choices, onChoiceSelected }) => {
    return (
        <div className="choices-container">
            {choices.map((choice, index) => (
                <button key={index} onClick={() => onChoiceSelected(choice.next)}>
                    {choice.text}
                </button>
            ))}
        </div>
    );
};

export default Choices;
