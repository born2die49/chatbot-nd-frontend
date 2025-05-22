'use client';

import ChatInput from "./components/chat/ChatInput";
import SessionSidebar from "./components/chat/SessionSidebar";
import MessageDisplay from "./components/chat/MessageDisplay";
import { useChatState } from "./hooks/useChatState";

export default function Home() {
  const {
    isLoggedIn,
    sessions,
    activeSessionId,
    messages,
    isLoadingSessions,
    isLoadingMessages,
    error: chatError, // Renamed to avoid conflict if Home itself had an error state
    createNewSession,
    selectSession,
    refreshMessagesForActiveSession,
    setError: setChatError,
  } = useChatState();

  const handleMessageSent = () => {
    refreshMessagesForActiveSession();
  };

  const handleDocumentUploaded = (document: any) => {
    alert(`Document "${document.title}" uploaded.`);
    // Potentially refresh sessions or document lists if needed
  };

  if (!isLoggedIn && !isLoadingSessions) { // Show login prompt if not logged in and session loading is done
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col items-center justify-center pt-20 px-4">
          <p className="text-xl text-gray-700">Please log in to use the chat.</p>
          {/* Optionally, show Login/Signup buttons from Navbar directly here or a link */}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        isLoading={isLoadingSessions}
        onCreateNewSession={createNewSession}
        onSelectSession={selectSession}
        error={chatError && chatError.includes("sessions") ? chatError : null} // Pass only session related errors
      />

      <main className="flex-1 flex flex-col items-center justify-end pt-20 pb-4 px-4 ml-64"> {/* ml-64 for sidebar */}
        <MessageDisplay
          messages={messages}
          isLoading={isLoadingMessages}
          isActiveSession={!!activeSessionId}
          error={chatError && chatError.includes("messages") ? chatError : null} // Pass only message related errors
        />

        <div className="w-full max-w-4xl">
          <ChatInput
            sessionId={activeSessionId || undefined}
            onMessageSent={handleMessageSent}
            onUploadSuccess={handleDocumentUploaded}
          />
        </div>
      </main>
    </div>
  );
}



// import Navbar from "./components/navbar/Navbar";
// import ChatInput from "./components/chat/ChatInput";

// export default function Home() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <main className="flex-1 flex items-center justify-center pt-20 px-4">
//         <div className="w-full max-w-4xl">
//           <ChatInput />
//         </div>
//       </main>
//     </div>
//   );
// }