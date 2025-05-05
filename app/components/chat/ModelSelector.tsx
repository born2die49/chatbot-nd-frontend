'use client';

import { useState } from 'react';

const models = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'claude-3', name: 'Claude 3' },
  { id: 'mistral', name: 'Mistral' },
];

const ModelSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectModel = (model: typeof models[0]) => {
    setSelectedModel(model);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <span className="hidden sm:inline">{selectedModel.name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
          <div className="py-1">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => selectModel(model)}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  selectedModel.id === model.id
                    ? 'bg-blue-50 text-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                {model.name}
                {selectedModel.id === model.id && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-auto"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;