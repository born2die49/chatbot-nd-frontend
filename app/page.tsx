'use client';

import ChatInput from "./components/chat/ChatInput";
import SessionSidebar from "./components/chat/SessionSidebar";
import MessageDisplay from "./components/chat/MessageDisplay";
import { useChatState } from "./hooks/useChatState";
import apiService from "./services/apiService";

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

  const handleDocumentUploaded = async (uploadedDocument: any) => {
  alert(`Document "${uploadedDocument.title}" (ID: ${uploadedDocument.id}) uploaded.`);
  setChatError(null); // Clear previous errors

  if (activeSessionId) {
    try {
      // --- MODIFICATION START ---
      let userVectorStores: Array<{ id: string; name: string; status: string }> = [];
      // Initial fetch
      const initialVsResponse = await apiService.get('/api/vectorstores/instances/');
      userVectorStores = (initialVsResponse.results || []) as Array<{ id: string; name: string; status: string }>;

      // If no vector stores found, wait a bit and retry, as backend might be creating a default one
      if (userVectorStores.length === 0) {
        console.log("No vector stores found initially, waiting 3 seconds for backend processing...");
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        const secondVsResponse = await apiService.get('/api/vectorstores/instances/');
        userVectorStores = (secondVsResponse.results || []) as Array<{ id: string; name: string; status: string }>;
        if (userVectorStores.length > 0) {
          console.log("Vector stores found after delay.");
        }
      }

      if (userVectorStores.length > 0) {
        // 2. Select a vector store.
        //    Ideally, the backend signal that processes the document
        //    (document - code - 2.txt -> signals.py add_document_to_default_vector_store [cite:1000])
        //    would ensure it's added to a known one.
        //    For now, let's pick the first 'ready' one, or just the first one.
        let targetVectorStore = userVectorStores.find(vs => vs.status === 'ready');
        if (!targetVectorStore && userVectorStores.length > 0) {
            targetVectorStore = userVectorStores[0]; // Fallback to the first one
            alert(`Note: Associating with vector store "${targetVectorStore.name}" which might still be processing other documents.`);
        }

        if (targetVectorStore) {
          // 3. Update the active chat session to use this vector store.
          await apiService.patch(`/api/chat/sessions/${activeSessionId}/`, {
            vector_store: targetVectorStore.id // Send the ID
          });
          alert(`Active chat session is now linked to vector store: <span class="math-inline">\{targetVectorStore\.name\}\. The document "</span>{uploadedDocument.title}" should be available for RAG shortly after processing.`);

          // 4. Refresh sessions to reflect the updated linkage in the UI (optional, if sidebar needs it)
          // fetchSessions(); // Uncomment if you need to refresh the session list/details
        } else {
          alert("No suitable vector store found. Please create one or ensure one is 'ready'. The uploaded document will be processed but may not be used in this chat until a vector store is linked.");
        }
      } else {
        alert("You don't have any vector stores. Please create one. The uploaded document will be processed but cannot be used for RAG in this chat.");
      }
    } catch (error: any) {
      console.error("Failed to associate document with chat session:", error);
      const errorMessage = error?.data?.vector_store || error?.data?.detail || error.message || "Failed to link document to current chat session.";
      setChatError(errorMessage); // Display error using useChatState's setError
      alert(`Error: ${errorMessage}`);
    }
  } else {
    alert("Document uploaded. Please start or select a chat session to use this document with RAG (you might need to link a vector store to the session).");
  }
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