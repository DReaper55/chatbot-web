"use client";

import { useDispatch, useSelector } from "react-redux";

import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useScrollToBottom } from "./components/general/use-scroll-to-bottom";
import { PreviewMessage, ThinkingMessage } from "./components/chat/message";
import { ChatInput } from "./components/chat/chatinput";
import { v4 as uuidv4 } from "uuid";
import { Sidebar } from "./components/chat/sidebar";
import { SidebarClose } from "lucide-react";
import { motion } from "framer-motion";
import { RootState } from "./store/redux/reduxStore";
import {
  addChat,
  addMessage,
  Chat,
  Message,
  setActiveChat,
} from "./store/redux/chatSlice";

const chatInitialState: Message[] = [
  {
    sender: "bot",
    text: "Hey! How may I help you today?",
  },
];

export default function ChatPage() {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const dispatch = useDispatch();
  const activeChatId = useSelector(
    (state: RootState) => state.chats.activeChatId
  );
  const chats = useSelector((state: RootState) => state.chats.chats);
  const activeChat = chats.find((c) => c.chatId === activeChatId);

  const [messages, setMessages] = useState(chatInitialState);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ..............................
  // Connect to a Websocket server
  // ..............................
  // const CHAT_SERVER = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || "ws://localhost:3000/api/chat";
  //
  // useEffect(() => {
  //   const connectToServer = async () => {
  //     const session = await getSession();
  //     if (!session?.user?.email) {
  //       console.error("User session not found.");
  //       return;
  //     }

  //     const userId = session.user.email;
  //     if (!activeChatId) {
  //       // If no active chat, create a new one
  //       const newChatId = uuidv4();
  //       dispatch(setActiveChat(newChatId));
  //       return;
  //     }

  //     if (socket) {
  //       socket.close();
  //     }

  //     const ws = new WebSocket(`${CHAT_SERVER}/${userId}/${activeChatId}`);
  //     ws.onopen = () => console.log("Connected to chat:", activeChatId);
  //     ws.onmessage = (event) => {
  //       const newMessage = { sender: "bot", text: event.data };
  //       setMessages((prevMessages) => [...prevMessages, newMessage]);
  //       dispatch(addMessage({ chatId: activeChatId, message: newMessage }));
  //       setTyping(false);
  //     };
  //     ws.onerror = (error) => console.error("WebSocket Error:", error);
  //     ws.onclose = () => console.log("Disconnected from chat:", activeChatId);

  //     setSocket(ws);
  //   };

  //   connectToServer();

  //   return () => {
  //     if (socket) {
  //       socket.close();
  //     }
  //   };
  // }, [activeChatId]);

  useEffect(() => {
    setMessages(activeChat?.messages || []);
    setTyping(false);
  }, [activeChat]);

  const createNewChat = async (message?: string) => {
    const session = await getSession();
    if (!session?.user?.email) {
      console.error("User session not found.");
      return;
    }

    const newChat = {
      chatId: activeChatId || uuidv4(),
      userId: session?.user?.email || "guest",
      title: message || `Chat ${chats.length + 1}`,
      dateTime: new Date().toISOString(),
      messages: [],
    } as Chat;

    try {
      const user_id = newChat.userId;
      const chat_id = newChat.chatId;

      const res = await fetch(`/api/session/${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, chat_id }),
      });

      if (!res.ok) throw new Error("Failed to fetch chats");

      console.log("Create new chat");
      dispatch(addChat(newChat));

      return newChat.chatId;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendMessageThroughWS = async (question?: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || typing) return;

    let chatId = activeChatId || undefined;

    if (!chatId || messages.length === 0) {
      chatId = await createNewChat(question);
    }

    if (!question) question = input;

    const newMessage = { sender: "user", text: question };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setTyping(true);
    socket.send(question);

    dispatch(addMessage({ chatId: chatId, message: newMessage }));

    setInput("");
  };

  const sendMessage = async (question?: string) => {
    const session = await getSession();
    if (!session?.user?.email) {
      console.error("User session not found.");
      return;
    }

    let chatId = activeChatId || undefined;

    if (!chatId || messages.length === 0) {
      chatId = await createNewChat(question);
    }

    if (!question) question = input;

    const newMessage = { sender: "user", text: question };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setTyping(true);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: session?.user?.email || "guest",
        chat_id: chatId,
        message: question,
      }),
    });

    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message || "Signup failed");
    }

    dispatch(addMessage({ chatId: chatId, message: newMessage }));

    // Get response
    const chatRes = await res.json();

    // Create message objects
    const resMessage = { sender: "bot", text: chatRes.message };
    const resProduct = chatRes.product && {
      sender: "bot",
      text: chatRes.product,
    };

    // Update messages
    setMessages((prevMessages) => [
      ...prevMessages,
      ...(resProduct ? [resProduct] : []),
      resMessage,
    ]);

    // Dispatch action and update typing state
    dispatch(addMessage({ chatId, message: resMessage }));
    setTyping(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        createNewChat={createNewChat}
      />

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
