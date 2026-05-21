import React from 'react';
import { MessageSquare, X, Send, Bot, User, Phone, Sparkles, HelpCircle } from 'lucide-react';

interface AIChatBotProps {
  lang: 'BD' | 'EN';
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatBot({ lang }: AIChatBotProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: 'model',
      text: lang === 'BD' 
        ? "আসসালামু আলাইকুম। আমি নিরাময় ক্লিনিক লালমনিরহাটের এআই স্বাস্থ্য সহকারী। আমি আপনাকে আমাদের ডাক্তারদের সময়সূচী, টেস্টের মূল্য তালিকা, মোবাইল পেমেন্ট এবং জেনারেল স্বাস্থ্য তথ্য জানাতে পারি। আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
        : "Hello! I am the Niramoy AI Health Assistant. I can help guide you on doctor schedules, diagnostic test prices, mobile payments, and clinical safety protocols. How can I assist you today?"
    }
  ]);
  const [inputMessage, setInputMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showNotification, setShowNotification] = React.useState<boolean>(true);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listEndRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to message bottom
  React.useEffect(() => {
    if (listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Turn off notification on open
  React.useEffect(() => {
    if (isOpen) {
      setShowNotification(false);
    }
  }, [isOpen]);

  const prepromptQueries = [
    {
      bd: "শুক্রবার কোন কোন ডাক্তার আছেন?",
      en: "Which doctors are available on Friday?"
    },
    {
      bd: "সিবিসি টেস্টের মূল্য কত?",
      en: "How much is CBC diagnostic test?"
    },
    {
      bd: "গাইনী স্পেশালিস্ট কে কে আছেন?",
      en: "Who are the female Gynae doctors?"
    },
    {
      bd: "ঠিকানা ও হটলাইন বলুন",
      en: "What is the physical address and helpline?"
    }
  ];

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        }),
      });

      if (!response.ok) {
        throw new Error(lang === 'BD' ? "সার্ভারের সাথে যোগাযোগ করতে ব্যর্থ হয়েছে" : "Network error calling server endpoint.");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (err: any) {
      console.error(err);
      let errorResponse = lang === 'BD'
        ? "দুঃখিত, এআই সার্ভারটি বর্তমানে ব্যস্ত রয়েছে। দয়া করে সরাসরি আমাদের হটলাইনে ফোন দিয়ে বুকিং করুনঃ +৮৮০১৭৯৭-৯৭৫৪৬১।"
        : "I apologize, but Niramoy's AI routing currently feels overloaded. Feel free to call directly: +8801797-975461.";
      
      if (err.message && err.message.includes("GEMINI_API_KEY")) {
        errorResponse = lang === 'BD'
          ? "দুঃখিত, এআই সেটিংসে জেমিনী এপিআই কী অনুপস্থিত। অনুগ্রহ করে Settings > Secrets প্যানেলে GEMINI_API_KEY কনফিগার করুন।"
          : "System Admin Notice: GEMINI_API_KEY is missing or inactive. Configure it within the AI Studio Settings secrets panel.";
      }
      setMessages(prev => [...prev, { role: 'model', text: errorResponse }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputMessage);
  };

  return (
    <div id="ai-chat-module" className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Sparkly Launcher Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#198a96] to-[#0b2447] text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          aria-label="Open AI Assistant"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <Sparkles className="w-3 h-3 text-yellow-305 absolute top-2 right-2 animate-bounce" />
          
          {/* Unread Alert Notification Accent */}
          {showNotification && (
            <div className="absolute -top-1 -left-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white font-extrabold items-center justify-center">1</span>
            </div>
          )}

          {/* Label Tooltip */}
          <span className="absolute right-16 bg-[#0b2447] text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
            {lang === 'BD' ? 'নিরাময় এআই অ্যাসিস্ট্যান্ট' : 'Talk with Niramoy AI'}
          </span>
        </button>
      )}

      {/* Expanded Interactive Chat Modal Container */}
      {isOpen && (
        <div 
          ref={containerRef}
          className="w-80 sm:w-96 h-[500px] sm:h-[550px] bg-white rounded-3xl shadow-2xl border border-gray-150 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-250"
        >
          
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#0b2447] to-[#126b75] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Bot className="w-5 h-5 text-[#1ac0c6]" />
                </div>
                {/* Active green status light */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-semibold bg-emerald-555 border-2 border-white rounded-full" style={{ backgroundColor: '#10b981' }} />
              </div>

              <div>
                <h4 className="font-extrabold text-sm flex items-center gap-1">
                  {lang === 'BD' ? 'নিরাময় এআই চ্যাট' : 'Niramoy AI Consultant'}
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                </h4>
                <p className="text-[10px] text-gray-300 font-medium">
                  {lang === 'BD' ? 'অনলাইন মেডিকেল তথ্য ও হেল্প ডেস্ক' : 'Online Medical Assistant'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/12 rounded-lg transition-colors cursor-pointer text-gray-300 hover:text-white"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Message Box */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => {
              const isAi = msg.role === 'model';
              return (
                <div 
                  key={index} 
                  className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end animate-in fade-in slide-in-from-right-3'}`}
                >
                  {/* AI Logo Icon */}
                  {isAi && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
                      <Bot className="w-4 h-4 text-[#198a96]" />
                    </div>
                  )}

                  <div className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed font-sans shadow-sm whitespace-pre-wrap ${
                    isAi 
                      ? 'bg-white border border-gray-150 text-gray-800' 
                      : 'bg-[#198a96] text-white'
                  }`}>
                    {msg.text}
                  </div>

                  {/* User Icon indicator */}
                  {!isAi && (
                    <div className="w-8 h-8 rounded-full bg-[#0b2447] text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm">
                      <User className="w-4 h-4 text-gray-200" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI Typing Loader */}
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
                  <Bot className="w-4 h-4 text-[#198a96]" />
                </div>
                <div className="bg-white border border-gray-150 rounded-2xl p-3 shadow-sm flex items-center gap-1 px-4">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={listEndRef} />
          </div>

          {/* Quick Preprompt Suggestions (Visible when messages count is small) */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-slate-50 border-t border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold block mb-1">
                💡 {lang === 'BD' ? 'সহজ প্রশ্নাবলীঃ' : 'Starting Suggestion Queries:'}
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
                {prepromptQueries.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(lang === 'BD' ? q.bd : q.en)}
                    className="text-[10px] bg-white border border-gray-200 text-[#198a96] hover:bg-[#f0f9fa] hover:border-[#1ac0c6] rounded-lg px-2.5 py-1 text-left transition-colors font-semibold cursor-pointer max-w-full truncate"
                  >
                    {lang === 'BD' ? q.bd : q.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <form onSubmit={handleFormSubmit} className="p-3 border-t border-gray-150 bg-white flex gap-2 items-center">
            <input
              type="text"
              value={inputMessage}
              disabled={loading}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={lang === 'BD' ? "ডাক্তার বা টেস্টের মূল্য তালিকা সম্পর্কে লিখুন..." : "Ask about doctor routines, tests..."}
              className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#198a96] transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="w-10 h-10 bg-[#0b2447] text-white hover:bg-[#126b75] rounded-xl flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
