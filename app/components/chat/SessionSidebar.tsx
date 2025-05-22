'use client';

import { ChatSession } from '@/app/hooks/useChatState'; // Adjust path

interface SessionSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  onCreateNewSession: () => Promise<ChatSession | null>;
  onSelectSession: (sessionId: string) => void;
  error?: string | null;
}

export default function SessionSidebar({
  sessions,
  activeSessionId,
  isLoading,
  onCreateNewSession,
  onSelectSession,
  error
}: SessionSidebarProps) {
  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto pt-5">
      <button
        onClick={onCreateNewSession}
        className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        New Chat
      </button>
      {isLoading && <p className="text-sm text-gray-500">Loading sessions...</p>}
      {error && <p className="text-sm text-red-500 px-1 py-2">{error}</p>}
      {!isLoading && sessions.length === 0 && !error && (
        <p className="text-sm text-gray-500">No chat sessions yet.</p>
      )}
      <ul>
        {sessions.map(session => (
          <li key={session.id} className="mb-1">
            <button
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                activeSessionId === session.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <p className="font-medium text-sm truncate">{session.title}</p>
              {session.last_message && (
                 <p className="text-xs text-gray-500 truncate">
                    {session.last_message.content}
                 </p>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}