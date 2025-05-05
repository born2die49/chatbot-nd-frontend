'use client';

import { useState } from 'react';
import AttachmentButton from './AttachmentButton';
import ModelSelector from './ModelSelector';

const ChatInput = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      // Here you would typically send the message to your backend
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg border border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full p-4 pr-24 resize-none min-h-[120px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
        <div className="absolute bottom-4 left-4">
          <AttachmentButton />
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <ModelSelector />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`flex items-center justify-center p-2 rounded-lg ${
              message.trim() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;