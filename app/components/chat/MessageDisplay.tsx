'use client';

import { ChatMessage } from '@/app/hooks/useChatState'; // Adjust path

interface MessageDisplayProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string | null;
  isActiveSession: boolean; // To show appropriate messages when no session is active
}

export default function MessageDisplay({ messages, isLoading, error, isActiveSession }: MessageDisplayProps) {
  if (!isActiveSession && !isLoading) {
    return (
        <div className="flex-grow flex items-center justify-center text-gray-500">
            <p>Select a chat session or create a new one to start messaging.</p>
        </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-4xl h-[calc(100vh-18rem)] overflow-y-auto mb-4 p-4 border rounded-md bg-white flex flex-col">
      {isLoading && <p className="text-center text-gray-500">Loading messages...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!isLoading && !error && messages.length === 0 && isActiveSession && (
        <div className="flex-grow flex items-center justify-center text-gray-400">
          <p>No messages yet in this session. Send a message to start!</p>
        </div>
      )}

      {!isLoading && !error && messages.length > 0 && (
        messages.map(msg => (
          <div
            key={msg.id}
            className={`mb-3 p-3 rounded-lg max-w-[85%] break-words ${ // Increased max-width, added break-words
              msg.message_type === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto'
                : msg.message_type === 'assistant'
                ? 'bg-gray-200 text-gray-800 self-start mr-auto'
                : 'bg-yellow-100 text-yellow-700 text-xs italic self-center mx-auto w-full text-center py-1' 
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
            {(msg.message_type === 'user' || msg.message_type === 'assistant') && (
              <p className="text-xs mt-1 opacity-75 text-right"> {/* Aligned time to right */}
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        ))
      )}
      {/* TODO: Add a scroll-to-bottom mechanism */}
    </div>
  );
}