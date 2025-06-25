"use client";

import * as React from "react";
import {
  BsPencilFill,
  BsX,
  BsCheckLg,
  BsPlusCircle,
  BsSearch,
  BsGithub,
  BsTwitterX,
  BsDiscord,
} from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat } from "@/types/chat";
import Link from "next/link";
import { Input } from "@/ui/input";
import Image from "next/image";
import { ThemeToggle } from "./ThemeMatcher";

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
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-primary/10 via-secondary/20 to-transparent flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 p-2 rounded-xl">
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
          <ThemeToggle />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            size={"lg"}
            onClick={createNewChat}
            aria-label="Create new chat"
            className="p-1 hover:cursor-pointer bg-gradient-to-b from-primary via-primary/60 to-primary/40 rounded-md items-center flex text-left justify-start gap-2"
          >
            <BsPlusCircle size={7} />
            New Chat
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-grow p-2">
        {chats.length === 0 && (
          <div>
            <p className="text-center text-muted-foreground mt-4 bg-secondary/30 hover:bg-secondary duration-500 backdrop-blur-sm border px-6 rounded-2xl py-8">
              No chats yet. Click + to start a new chat.
            </p>
          </div>
        )}
        <ul className="flex flex-col space-y-1">
          {chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const isEditing = chat.id === editingChatId;

            return (
              <li
                key={chat.id}
                className={`flex items-center justify-between cursor-pointer py-1 rounded-md p-2 select-none transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-secondary to-secondary py-1 hover:to-primary/40 text-primary-foreground text-sm font-semibold"
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
      <div className="p-4 flex-col justify-start flex gap-3">
        <div className="flex gap-2">
          <Link
            href={"https://github.com/m3chat/"}
            className="hover:text-muted-foreground/80"
          >
            <BsGithub />
          </Link>
          <Link
            href={"https://x.com/m3chat/"}
            className="hover:text-muted-foreground/80"
          >
            <BsTwitterX />
          </Link>
          <Link href={"/discord"} className="hover:text-muted-foreground/80">
            <BsDiscord />
          </Link>
        </div>
        <div className="flex gap-5">
          <Link
            href={"/status"}
            className="underline hover:text-muted-foreground/80"
          >
            Status
          </Link>

          <Link
            href={"/privacy"}
            className="underline hover:text-muted-foreground/80"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </aside>
  );
}
