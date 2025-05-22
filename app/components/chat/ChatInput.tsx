'use client';

import { useState } from 'react';
import AttachmentButton from './AttachmentButton';
import ModelSelector from './ModelSelector';
import apiService from '@/app/services/apiService';

interface ChatInputProps {
  sessionId?: string; // Active chat session ID
  onMessageSent?: (message: any) => void;
  onUploadSuccess?: (document: any) => void;
}

const ChatInput = ({ sessionId, onMessageSent, onUploadSuccess }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !sessionId || isSending) {
      console.log('Sending message:', message);
      if (!sessionId) console.warn("No active session ID to send message to.");
      return;
    }

    setIsSending(true);
  try {
      const payload = { content: message };
      // The backend's ChatMessageViewSet returns the created message and a status 202
      const response = await apiService.post(`/api/chat/sessions/${sessionId}/messages/`, payload);
      // console.log('Message sent:', response);
      if (onMessageSent) {
        onMessageSent(response.message); // response structure is { message: {...}, status: "...", info: "..." }
      }
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error display to user, e.g., via toast
    } finally {
      setIsSending(false);
    }
  };

  const handleDocumentUpload = (document: any) => {
    // console.log("Document uploaded in ChatInput context:", document);
    if (onUploadSuccess) {
        onUploadSuccess(document);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg border border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={sessionId ? "Ask me anything..." : "Please select or start a chat session."}
          className="w-full p-4 pr-24 resize-none min-h-[120px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          disabled={!sessionId || isSending}
        />
        <div className="absolute bottom-4 left-4">
          <AttachmentButton onUploadSuccess={handleDocumentUpload} />
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
            {isSending ? (
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
            ) : (
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
            )}
            
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;