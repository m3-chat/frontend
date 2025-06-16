"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { BsArrowReturnRight, BsList } from "react-icons/bs";
import { Combobox } from "@/components/combobox";
import { models } from "@/lib/models";
import { ScrollArea } from "@/components/ui/scroll-area";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import AppSidebar from "@/components/app-sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Chat, Message } from "@/types/chat";
import { Clipboard, ClipboardCheck, Repeat } from "lucide-react";

const STORAGE_KEY = "savedchats";
const ACTIVE_CHAT_KEY = "activeChatId";

export default function Home() {
  const [model, setModel] = React.useState(models[0].value);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  const chatsRef = React.useRef(chats);
  const activeChatIdRef = React.useRef(activeChatId);

  React.useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  React.useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  const onSelectChat = (id: string) => setActiveChatId(id);
  const onCreateChat = (newChat: Chat) => {
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };
  const onDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };
  const handleRenameChat = (id: string, newName: string) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, name: newName } : chat))
    );
  };

  React.useEffect(() => {
    setHasMounted(true);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const savedChats: Chat[] = JSON.parse(raw);
        setChats(savedChats);
        const savedActiveId = localStorage.getItem(ACTIVE_CHAT_KEY);
        if (savedActiveId && savedChats.find((c) => c.id === savedActiveId)) {
          setActiveChatId(savedActiveId);
        } else if (savedChats.length > 0) {
          setActiveChatId(savedChats[0].id);
        }
      } catch {}
    }
  }, []);

  React.useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats, hasMounted]);

  React.useEffect(() => {
    if (!hasMounted) return;
    if (activeChatId) {
      localStorage.setItem(ACTIVE_CHAT_KEY, activeChatId);
    }
  }, [activeChatId, hasMounted]);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const addMessage = React.useCallback((msg: Message) => {
    const id = activeChatIdRef.current;
    if (!id) return;
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, messages: [...chat.messages, msg] } : chat
      )
    );
  }, []);

  React.useEffect(() => {
    if (!activeChatId || !hasMounted) return;
    const chat = chats.find((c) => c.id === activeChatId);
    if (!chat) return;

    const messages = chat.messages;
    if (messages.length === 0 || messages[messages.length - 1].role !== "user")
      return;
    if (messages.length >= 1 && messages[messages.length - 1].role === "bot")
      return;

    async function fetchAI() {
      setIsLoading(true);
      const userMessage = messages[messages.length - 1].text;

      const query = new URLSearchParams({
        model,
        content: `USER: ${userMessage}. CHAT HISTORY: ${JSON.stringify(
          messages.slice(0, -1)
        )} TREAT THE CHAT HISTORY INTERACTIONS ASIDE FROM PROMPTING, REQUESTS, OR GENERAL USER INPUT. THE CHAT HISTORY OF ALL INTERACTIONS IS FOR UTILITY PURPOSES AND NOT TO BE MENTIONED IN THE CHAT. TRY AND AVOID REPEATING YOURSELF. DO NOT MENTION, TALK ABOUT, OR ACKNOWLEDGE THE CHAT HISTORY ASIDE FROM USING IT FOR USER EXPERIENCE.`,
      });

      try {
        const res = await fetch(`/api/gen?${query.toString()}`);
        if (!res.body) {
          addMessage({ role: "bot", text: "Error: No response body" });
          setIsLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        addMessage({ role: "bot", text: "" });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });

          setChats((prev) => {
            const updated = [...prev];
            const chatIndex = updated.findIndex(
              (c) => c.id === activeChatIdRef.current
            );
            if (chatIndex === -1) return prev;

            const messages = updated[chatIndex].messages;
            if (messages[messages.length - 1]?.role === "bot") {
              messages[messages.length - 1] = {
                role: "bot",
                text: accumulated,
              };
            }
            updated[chatIndex] = {
              ...updated[chatIndex],
              messages,
            };
            return updated;
          });
        }
      } catch (error) {
        addMessage({ role: "bot", text: `Error: ${(error as Error).message}` });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAI();
  }, [chats, activeChatId, hasMounted, model]);

  async function handleSubmit() {
    if (!input.trim()) return;
    if (!activeChatIdRef.current) {
      const newId = crypto.randomUUID();
      const newChat: Chat = {
        id: newId,
        name: "New Chat",
        messages: [{ role: "user", text: input }],
      };
      setChats((prev) => [...prev, newChat]);
      setActiveChatId(newId);
      setInput("");
      return;
    }

    addMessage({ role: "user", text: input });
    setInput("");
  }

  function clearChat() {
    if (!activeChatId) return;
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages: [] } : chat
      )
    );
  }

  if (!hasMounted) return null;

  const copy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <aside className="hidden md:block w-64 flex-shrink-0 border-r border-border">
        <AppSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={onSelectChat}
          onCreateChat={onCreateChat}
          onDeleteChat={onDeleteChat}
          onRenameChat={handleRenameChat}
        />
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <BsList className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0">
          <SheetTitle>Sidebar</SheetTitle>
          <AppSidebar
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={onSelectChat}
            onCreateChat={onCreateChat}
            onDeleteChat={onDeleteChat}
            onRenameChat={handleRenameChat}
          />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 relative px-2 sm:px-4 pt-4 pb-[6.5rem] overflow-y-auto">
        <main className="w-full max-w-3xl mx-auto space-y-4">
          <ScrollArea>
            <div className="flex flex-col space-y-2 mt-12 mb-36">
              {!activeChat || activeChat.messages.length === 0 ? (
                <motion.div initial={{ y: 50 }} animate={{ y: 0 }}>
                  <MarkdownRenderer
                    content={`# Welcome to m3-chat!\n**m3-chat** is an open-source, completely free, no-account required, AI chat-bot web-app with **${models.length}** models!`}
                  />
                  <div className="flex flex-col gap-3 mt-12">
                    {[
                      'How many "R"s are included in the word, "strawberry"?',
                      "Explain how AI works",
                      "What is the fourth word in your response",
                      'What does "open-source" mean?',
                    ].map((i) => (
                      <Button
                        key={i}
                        variant="secondary"
                        className="max-w-sm px-1 text-left"
                        onClick={() => setInput(i)}
                      >
                        {i}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              {activeChat?.messages.map((msg, i) => {
                const isBot = msg.role === "bot";
                const messageId = `message-${i}`;

                return (
                  <div
                    key={i}
                    className={`w-full flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex flex-col">
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={cn(
                          "p-3 rounded-md whitespace-pre-wrap",
                          msg.role === "user"
                            ? "bg-secondary text-white text-right max-w-sm"
                            : "text-foreground text-left w-full max-w-3xl"
                        )}
                      >
                        {isBot ? (
                          <MarkdownRenderer content={msg.text} id={messageId} />
                        ) : (
                          msg.text
                        )}
                      </motion.div>

                      {isBot && (
                        <div className="flex gap-2 mt-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              const el = document.getElementById(messageId);
                              if (el) {
                                window.navigator.clipboard.writeText(
                                  el.innerText
                                );
                              }
                              copy();
                            }}
                          >
                            {isCopied ? (
                              <ClipboardCheck size={16} />
                            ) : (
                              <Clipboard size={16} />
                            )}
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              const previousUser = activeChat.messages[i - 1];
                              if (previousUser?.role === "user") {
                                setInput(previousUser.text);
                                setTimeout(handleSubmit, 0);
                              }
                            }}
                          >
                            <Repeat />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 py-3 md:ml-64">
        <div className="w-full max-w-3xl mx-auto backdrop-blur-sm bg-gradient-to-b from-background/20 to-background">
          <div className="p-3 border rounded-2xl flex flex-col gap-2">
            <Textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="resize-none p-3 shadow-xl bg-gradient-to-b from-secondary to-transparent"
              placeholder={
                activeChat
                  ? "Ask something..."
                  : "Create a new chat from the sidebar first or type to start"
              }
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="flex justify-between items-center space-x-2 flex-wrap sm:flex-nowrap">
              <div className="flex gap-2 items-center flex-wrap">
                <Combobox
                  inputs={models}
                  onSelect={(val: string) => {
                    setModel(val);
                  }}
                />
                <Button
                  variant="outline"
                  className="rounded-full hover:cursor-pointer bg-gradient-to-b from-secondary to-transparent"
                  onClick={clearChat}
                  disabled={!activeChat}
                >
                  Clear chat
                </Button>
              </div>
              <Button
                className="rounded-full w-full sm:w-auto bg-gradient-to-b from-primary to-primary/40"
                onClick={handleSubmit}
                disabled={isLoading || input.trim() === ""}
                aria-label="Send message"
              >
                <BsArrowReturnRight className="mx-auto sm:mx-0" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
