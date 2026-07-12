import React from 'react';

const AIReasoningCard = ({ reasoningString }) => {
  if (!reasoningString) return null;

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md mt-4 border border-gray-600">
      <h3 className="text-lg font-semibold text-green-400 mb-2">AI Dispatch Reasoning</h3>
      <p className="text-sm font-mono whitespace-pre-wrap">{reasoningString}</p>
    </div>
  );
};

export default AIReasoningCard;
