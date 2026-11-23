"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Bot, User, Sparkles,
  ThumbsUp, ThumbsDown, ChevronRight, Loader2
} from "lucide-react";
import { chatbotFAQs } from "@/lib/data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
  timestamp: Date;
}

function findAnswer(input: string): { answer: string; source: string } | null {
  const query = input.toLowerCase();
  for (const faq of chatbotFAQs) {
    for (const keyword of faq.keywords) {
      if (query.includes(keyword.toLowerCase())) {
        return { answer: faq.answer, source: faq.source };
      }
    }
  }
  // Check for partial word matches
  const words = query.split(/\s+/);
  for (const faq of chatbotFAQs) {
    let matchCount = 0;
    for (const keyword of faq.keywords) {
      const kwWords = keyword.toLowerCase().split(/\s+/);
      for (const kw of kwWords) {
        if (words.some((w) => w.includes(kw) || kw.includes(w))) {
          matchCount++;
        }
      }
    }
    if (matchCount >= 2) {
      return { answer: faq.answer, source: faq.source };
    }
  }
  return null;
}

const suggestedPrompts = [
  "What is the Contributory Pension Scheme?",
  "How do I open an RSA?",
  "How can I transfer my RSA?",
  "What is Pension Clearance Certificate?",
  "How do I access my pension?",
  "What is Personal Pension Plan?",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm PenCom's AI Digital Assistant. I can help you with questions about pension services, RSA transfers, the Contributory Pension Scheme, and more. How can I assist you today?",
      source: "PenCom AI Assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSend = async (text?: string) => {
    const userText = text || input.trim();
    if (!userText) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    const result = findAnswer(userText);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: result
        ? result.answer
        : "I don't have specific information on that topic yet. For detailed assistance, please contact PenCom directly at info@pencom.gov.ng or visit our FAQ page for more comprehensive answers.",
      source: result ? result.source : "PenCom General Knowledge",
      timestamp: new Date(),
    };

    setTyping(false);
    setMessages((prev) => [...prev, assistantMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            id="chat-trigger"
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#14892A] to-[#105D1D] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
            aria-label="Open AI Chat Assistant"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#14892A] to-[#105D1D] p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">PenCom AI Assistant</div>
                  <div className="text-white/70 text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI-Powered
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "assistant"
                        ? "bg-[#E8F5E9]"
                        : "bg-gray-100"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="w-4 h-4 text-[#117F21]" />
                    ) : (
                      <User className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "assistant"
                        ? "bg-gray-50 text-gray-800 rounded-tl-md"
                        : "bg-[#14892A] text-white rounded-tr-md"
                    }`}
                  >
                    <p>{msg.content}</p>
                    {msg.source && msg.role === "assistant" && (
                      <div className="mt-2 pt-2 border-t border-gray-200/50">
                        <span className="text-[10px] text-gray-400">
                          Source: {msg.source}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <button className="text-gray-400 hover:text-[#117F21] transition-colors" aria-label="Helpful">
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Not helpful">
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-[#117F21]" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3">
                    <Loader2 className="w-4 h-4 text-[#117F21] animate-spin" />
                  </div>
                </motion.div>
              )}

              {/* Suggested prompts - only show for welcome */}
              {messages.length === 1 && !typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-2"
                >
                  <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#E8F5E9] text-[#117F21] text-xs rounded-lg hover:bg-[#14892A] hover:text-white transition-colors"
                      >
                        {prompt}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about pension services..."
                  className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14892A] focus:ring-1 focus:ring-[#14892A]/20"
                  disabled={typing}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || typing}
                  className="w-10 h-10 rounded-xl bg-[#14892A] text-white flex items-center justify-center hover:bg-[#105D1D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                PenCom AI Assistant - Informational purposes only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
