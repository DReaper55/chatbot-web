"use client";

import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useScrollToBottom } from "./components/general/use-scroll-to-bottom";
import { message } from "./interfaces/message";
import { PreviewMessage, ThinkingMessage } from "./components/chat/message";
import { ChatInput } from "./components/chat/chatinput";
import { v4 as uuidv4 } from "uuid";
import { Sidebar } from "./components/chat/sidebar";
import { SidebarClose } from "lucide-react";
import { motion } from "framer-motion";

const chatInitialState: message[] = [
  {
    sender: "bot",
    text: "Hey! How may I help you today?",
  },
];

export default function Chat() {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [messages, setMessages] = useState(chatInitialState);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const CHAT_SERVER =
      process.env.NEXT_PUBLIC_CHAT_SERVER_URL || "ws://localhost:3000/api/chat";

    let ws: WebSocket;

    async function connectToServer() {
      const session = await getSession();

      if (!session?.user?.email) {
        console.error("User session not found.");
        return;
      }

      const userId = session.user.email;

      const traceId = uuidv4();

      ws = new WebSocket(`${CHAT_SERVER}/${traceId}`); // Connect to Next.js WebSocket proxy

      ws.onopen = () => console.log("Connected to WebSocket proxy");
      ws.onmessage = (event) => {
        setMessages((prev) => [...prev, { sender: "bot", text: event.data }]);
        setTyping(false);
      };
      ws.onerror = (error) => console.error("WebSocket Error:", error);
      ws.onclose = () => console.log("Disconnected from WebSocket proxy");

      setSocket(ws);
    }

    connectToServer();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [getSession, setMessages, setTyping, setSocket]);

  const sendMessage = (question?: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || typing) return;

    if (!question) question = input;

    setMessages([...messages, { sender: "user", text: question }]);
    setTyping(true);
    socket.send(question);
    setInput("");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const onDeleteChat = (chatId: string) => {
    console.log("Deleted chat: "+chatId)
  }

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onDeleteChat={onDeleteChat} />
      {/* Sidebar Button */}
      <motion.button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        initial={{ rotate: 0 }}
        animate={{ rotate: isSidebarOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <SidebarClose color="white" size={24} />
      </motion.button>

      <div
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
        ref={messagesContainerRef}
      >
        {messages.map((message, index) => (
          <PreviewMessage key={index} message={message} />
        ))}
        {typing && <ThinkingMessage />}
        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <ChatInput
          question={input}
          setQuestion={setInput}
          onSubmit={sendMessage}
          isLoading={typing}
        />
      </div>
    </div>
  );
}
