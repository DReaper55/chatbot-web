"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  sender: string;
  text: string;
}

export interface Chat {
  chatId: string;
  userId: string;
  title: string;
  dateTime: string;
  messages: Message[];
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
}

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatId = action.payload;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.push(action.payload);
    },
    deleteChat: (state, action: PayloadAction<string>) => {
        state.chats = state.chats.filter((chat) => chat.chatId !== action.payload);
        if (state.activeChatId === action.payload) {
          state.activeChatId = null;
        }
      },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const chat = state.chats.find((c) => c.chatId === action.payload.chatId);
      if (chat) {
        chat.messages.push(action.payload.message);
      }
    },
  },
});

export const { setChats, setActiveChat, addChat, deleteChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
