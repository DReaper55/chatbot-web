import React, { useState } from "react";
import { Button } from "@/app/components/general/button";
import {
  PlusCircle,
  MessageCircle,
  Trash2,
  CircleUserRound,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { ScrollArea } from "@/app/components/general/scroll-area";
import { motion } from "framer-motion";
import { ThemeToggle } from "../general/theme-toggle";
import { getSession, useSession } from "next-auth/react";
import AccountDialog from "./AccountDialog";
import { v4 as uuidv4 } from "uuid";

import { RootState } from "@/app/store/redux/reduxStore";
import {
  addChat,
  Chat,
  deleteChat,
  Message,
  setActiveChat,
  setChats,
} from "@/app/store/redux/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  createNewChat: () => Promise<string | undefined>;
}

export function Sidebar({ isOpen, onClose, createNewChat }: SidebarProps) {
  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chats.chats);
  const activeChatId = useSelector(
    (state: RootState) => state.chats.activeChatId
  );

  const [openAccount, setOpenAccount] = useState(false);

  const { data: session } = useSession();

  const router = useRouter();

  React.useEffect(() => {
    getChats();

    return;
  });

  const getChats = async () => {
    if (chats.length > 0) return;

    try {
      const mSession = await getSession();
      if (!mSession?.user?.email) {
        // If session expired, redirect to login
        alert("Your session has expired. Please log in again.");
        router.push("/login"); // Redirect to login page
        return;
      }

      const userId = mSession.user.email;

      const res = await fetch(`/api/session/${userId}`);

      if (!res.ok) throw new Error("Failed to fetch chats");
      const data = await res.json();

      const mChats = [] as Chat[];

      (data as []).forEach(e => {
        const conversation = e['conversation'] || [];

        mChats.push({
          chatId: e['chat_id'],
          dateTime: e['date'],
          messages: (conversation as []).map((m: string) => {
            return {
              sender: m.split(':')[0].toLowerCase(),
              text: m.split(':')[1].toLowerCase(),
            } as Message
          }),
          title: (conversation as []).length > 0 && (conversation[0] as string).includes(":") ? (conversation[0] as string).split(":")[1] : conversation[0],
          userId: e['user_id'],
        } as Chat)
      });

      dispatch(setChats(mChats));
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const selectChat = (chat_id: string) => {
    dispatch(setActiveChat(chat_id));
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();

    try{
      const mSession = await getSession();
      if (!mSession?.user?.email) {
        // If session expired, redirect to login
        alert("Your session has expired. Please log in again.");
        router.push("/login"); // Redirect to login page
        return;
      }

      const userId = mSession.user.email;

      const res = await fetch(`/api/session/${userId}/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!res.ok) throw new Error("Failed to fetch chats");

      dispatch(deleteChat(chatId));

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? "0%" : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed inset-y-0 left-0 w-[20vw] bg-background border-r transform transition-transform duration-200 ease-in-out z-50",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-4">
        <h2 className="text-lg font-semibold mt-[30%] mb-[10%]">Chats</h2>

        <Button
          onClick={createNewChat}
          className="mb-4 flex items-center gap-2"
          variant="outline"
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {chats.map((chat: Chat) => (
              <div key={chat.chatId} className="group relative w-[90%]">
                <Button
                  variant={chat.chatId === activeChatId ? "outline" : "ghost"}
                  className="w-full justify-start gap-2 pr-8"
                  onClick={() => selectChat(chat.chatId)}
                >
                  <MessageCircle className="h-4 w-4" />
                  {chat.title}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteChat(e, chat.chatId)}
                >
                  <Trash2 className="h-4 w-4 text-primary" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex flex-row w-full items-center space-x-4 justify-between">
          <Button
            onClick={() => {
              if(!session || !session.user) {
                router.push('/login')
                return;
              }

              setOpenAccount(true);
            }}
            className="flex flex-row items-center gap-2 w-full"
            variant="outline"
          >
            <CircleUserRound className="h-4 w-4" />
            {session?.user?.name || "Login"}
          </Button>

          <ThemeToggle />
        </div>
      </div>

      {/* Account Button */}
      <AccountDialog
        isOpen={openAccount}
        setOpen={setOpenAccount}
        session={session}
      />
    </motion.aside>
  );
}
