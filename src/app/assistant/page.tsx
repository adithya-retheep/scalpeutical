'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, ShieldCheck, User, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const QUICK_SUGGESTIONS = [
  'Explain my visible flaking trend over the last 4 weeks.',
  'What does Ketoconazole 2% do according to published literature?',
  'What questions should I ask my dermatologist about my routine?',
  'Does hot/humid weather affect my scalp observations?',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Hello! I am your Scalpeutical AI Assistant. I can help explain your recorded scalp observation trends, active ingredient scientific literature, and prepare constructive questions for your dermatologist visit. How may I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'AI assists healthcare professionals; AI does not replace healthcare professionals.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#1F3D2B] text-[#D4AF6A] rounded-2xl shadow-xs">
            <MessageSquare size={22} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1F3D2B]">Scalpeutical AI Assistant</h2>
            <p className="text-xs text-[#8A8A82]">Observational & Educational QA Companion</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold">
          <ShieldCheck size={14} />
          <span>Non-Prescriptive Safety Guardrails</span>
        </div>
      </div>

      {/* Quick Tap Suggestion Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-[#8A8A82] tracking-wider block px-1">Quick Tap Suggestions</span>
        <div className="flex overflow-x-auto gap-2 pb-1">
          {QUICK_SUGGESTIONS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(chip)}
              className="bg-white border border-[#E5E2D8] hover:border-[#1F3D2B] hover:bg-[#FAF9F5] text-[#1F3D2B] text-xs font-semibold px-3 py-2 rounded-xl shrink-0 transition-all text-left shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-4 sm:p-6 shadow-xs min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 flex flex-col">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser ? 'bg-[#1F3D2B] text-white' : 'bg-[#FAF9F5] text-[#1F3D2B] border border-[#E5E2D8]'
                }`}
              >
                {isUser ? <User size={14} /> : <Bot size={14} className="text-[#D4AF6A]" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#1F3D2B] text-white rounded-tr-none'
                    : 'bg-[#FAF9F5] border border-[#E5E2D8] text-[#1F3D2B] rounded-tl-none space-y-2'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`text-[10px] block text-right mt-1 opacity-70 ${isUser ? 'text-white/80' : 'text-[#8A8A82]'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#8A8A82] p-2 bg-[#FAF9F5] rounded-xl w-max border border-[#E5E2D8]">
            <Sparkles size={14} className="animate-spin text-[#D4AF6A]" />
            <span>AI Assistant is referencing clinical guidelines...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about ingredients, trends, or dermatologist questions..."
          className="flex-1 bg-white border border-[#E5E2D8] rounded-2xl px-4 py-3 text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B] shadow-xs"
        />
        <button
          type="submit"
          className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <span>Send</span>
          <Send size={16} />
        </button>
      </form>

      {/* Safety Disclaimer Footer */}
      <p className="text-[11px] text-[#8A8A82] text-center italic">
        Core Philosophy: AI assists healthcare professionals; AI does not replace healthcare professionals.
      </p>

    </div>
  );
}
