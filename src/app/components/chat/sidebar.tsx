import { useState } from "react";
import { Button } from "@/app/components/general/button";
import { PlusCircle, MessageCircle, X, Trash2, CircleUserRound } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { ScrollArea } from "@/app/components/general/scroll-area";
import { motion } from "framer-motion";
import { ThemeToggle } from "../general/theme-toggle";
import { useSession } from "next-auth/react";
import AccountDialog from "./AccountDialog";
import ProductOrderCommand from "./ProductOrderList";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export function Sidebar({ isOpen, onClose, onDeleteChat }: SidebarProps) {
  const [chats, setChats] = useState<
    { id: string; name: string; active: boolean }[]
  >([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const [openAccount, setOpenAccount] = useState(false);

  const {data: session} = useSession()

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      name: `Chat ${chats.length + 1}`,
      active: false,
    };
    setChats([...chats, newChat]);
  };

  const selectChat = (chatId: string) => {
    setActiveChat(chatId);
    setChats(
      chats.map((chat) => ({
        ...chat,
        active: chat.id === chatId,
      }))
    );
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (onDeleteChat) {
      onDeleteChat(chatId);
      setChats(chats.filter((chat) => chat.id !== chatId));
      if (activeChat === chatId) {
        setActiveChat(null);
      }
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
            {chats.map((chat) => (
              <div key={chat.id} className="group relative">
                <Button
                  variant={chat.active ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2 pr-8"
                  onClick={() => selectChat(chat.id)}
                >
                  <MessageCircle className="h-4 w-4" />
                  {chat.name}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                >
                  <Trash2 className="h-4 w-4 text-primary" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex flex-row w-full items-center space-x-4 justify-between">
        <Button
        onClick={() => setOpenAccount(true)}
          className="flex flex-row items-center gap-2 w-full"
          variant="outline"
        >
          <CircleUserRound className="h-4 w-4" />
          {session?.user?.name || "Account"}
        </Button>

        <ThemeToggle />
        </div>
      </div>

      {/* Account Button */}
      <AccountDialog isOpen={openAccount} setOpen={setOpenAccount} session={session} />

    </motion.aside>
  );
}
