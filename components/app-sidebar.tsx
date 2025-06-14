"use client";

import * as React from "react";
import {
  BsPencilFill,
  BsX,
  BsCheckLg,
  BsPlusCircle,
  BsSearch,
} from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat } from "@/types/chat";
import Link from "next/link";
import { Input } from "@/ui/input";
import Image from "next/image";

type AppSidebarProps = {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onCreateChat: (newChat: Chat) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newName: string) => void;
};

export default function AppSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  onRenameChat,
}: AppSidebarProps) {
  const [editingChatId, setEditingChatId] = React.useState<string | null>(null);
  const [newName, setNewName] = React.useState<string>("");

  const startRenaming = (chatId: string, currentName: string) => {
    setEditingChatId(chatId);
    setNewName(currentName);
  };

  const confirmRename = (
    e: React.MouseEvent | React.KeyboardEvent,
    chatId: string
  ) => {
    e.stopPropagation();
    if (newName.trim()) {
      onRenameChat(chatId, newName.trim());
    }
    setEditingChatId(null);
    setNewName("");
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      name: "New Chat",
      messages: [],
    };
    onCreateChat(newChat);
    onSelectChat(newChat.id);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex gap-2">
            <Image
              src={"/logo.png"}
              width={30}
              height={10}
              alt="M3 Chat"
              className="rounded-lg border-2"
            />
            M3 Chat
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant={"ghost"}
            onClick={createNewChat}
            aria-label="Create new chat"
            className="p-1 rounded-md items-center flex text-left justify-start gap-2"
          >
            <BsPlusCircle size={7} />
            New Chat
          </Button>
          <Link
            href={"/privacy"}
            className="hover:underline text-muted-foreground/50 hover:text-muted-foreground duration-300"
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      <ScrollArea className="flex-grow p-2">
        {chats.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">
            No chats yet. Click + to start a new chat.
          </p>
        )}
        <ul className="flex flex-col space-y-1">
          {chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const isEditing = chat.id === editingChatId;

            return (
              <li
                key={chat.id}
                className={`flex items-center justify-between cursor-pointer rounded-md p-2 select-none transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "hover:bg-muted"
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex-grow max-w-[180px] truncate">
                  {isEditing ? (
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmRename(e, chat.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="w-full px-1 py-0.5 rounded-sm border-none"
                    />
                  ) : (
                    <span>{chat.name || "Untitled Chat"}</span>
                  )}
                </div>
                <div className="flex gap-0.5 ml-2">
                  {isEditing ? (
                    <button
                      onClick={(e) => confirmRename(e, chat.id)}
                      className="p-1 px-2 hover:bg-black/20 rounded-lg duration-200"
                      title="Confirm rename"
                    >
                      <BsCheckLg size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRenaming(chat.id, chat.name);
                      }}
                      className="p-1 px-2 hover:bg-black/20 rounded-lg duration-200"
                      title="Rename chat"
                    >
                      <BsPencilFill size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="p-1 hover:bg-black/20 rounded-lg duration-200"
                    title="Delete chat"
                  >
                    <BsX size={24} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </aside>
  );
}
