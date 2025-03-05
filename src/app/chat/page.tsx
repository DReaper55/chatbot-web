"use client";

import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useScrollToBottom } from "../components/general/use-scroll-to-bottom";
import { Header } from "../components/chat/header";
import { message } from "../interfaces/message";
import { Overview } from "../components/chat/overview";
import { PreviewMessage, ThinkingMessage } from "../components/chat/message";
import { ChatInput } from "../components/chat/chatinput";

const chatInitialState : message[] = [
  {
    sender: "bot",
    text: "Hey! How may I help you today?",
  },
];

export default function Chat() {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  const [question, setQuestion] = useState<string>("");
  const [messages, setMessages] = useState(chatInitialState);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const CHAT_SERVER =
      process.env.NEXT_PUBLIC_CHAT_SERVER_URL || "ws://localhost:3000/api/chat";

    let ws : WebSocket;

    async function connectToServer() {
      const session = await getSession();

      if (!session?.user?.email) {
        console.error("User session not found.");
        return;
      }

      const userId = session.user.email;

      ws = new WebSocket(`${CHAT_SERVER}/${userId}`); // Connect to Next.js WebSocket proxy

      ws.onopen = () => console.log("Connected to WebSocket proxy");
      ws.onmessage = (event) => {
        setMessages((prev) => [...prev, { sender: "bot", text: event.data }]);
        setTyping(false);
      };
      ws.onerror = (error) => console.error("WebSocket Error:", error);
      ws.onclose = () => console.log("Disconnected from WebSocket proxy");

      setSocket(ws);
    }

    // connectToServer();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [getSession, setMessages, setTyping, setSocket]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setMessages([...messages, { sender: "user", text: input }]);
      setTyping(true);
      socket.send(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Header/>
      <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4" ref={messagesContainerRef}>
        {messages.length == 0 && <Overview />}
        {messages.map((message, index) => (
          <PreviewMessage key={index} message={message} />
        ))}
        {typing && <ThinkingMessage />}
        <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]"/>
      </div>
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <ChatInput  
          question={question}
          setQuestion={setQuestion}
          onSubmit={sendMessage}
          isLoading={typing}
        />
      </div>
    </div>
  );
}
