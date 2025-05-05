import Navbar from "./components/navbar/Navbar";
import ChatInput from "./components/chat/ChatInput";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-4xl">
          <ChatInput />
        </div>
      </main>
    </div>
  );
}