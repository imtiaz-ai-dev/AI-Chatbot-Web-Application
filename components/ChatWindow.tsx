
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from '../types';
import { Icons } from '../constants';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  modelName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading,
  modelName
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black relative overflow-hidden">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-12 py-8 space-y-8"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl">
              <Icons.Shield />
            </div>
            <h3 className="text-3xl font-bold text-white tracking-tight mb-4">Workspace Initialized</h3>
            <p className="max-w-md text-zinc-500 text-sm leading-relaxed">
              Nexus Pro is ready to process your instructions. Use the parameters on the right to tune the engine response.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex gap-5 max-w-[90%] md:max-w-[80%] ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
                  msg.role === Role.USER 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'bg-zinc-900 border-zinc-800 text-indigo-400'
                }`}>
                  {msg.role === Role.USER ? <Icons.User /> : <Icons.Bot />}
                </div>
                <div className={`p-5 rounded-[1.5rem] text-[14px] leading-relaxed shadow-sm ${
                  msg.role === Role.USER
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-zinc-900/50 border border-zinc-800 text-zinc-200 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap font-normal">{msg.content}</div>
                  <div className={`mt-3 text-[9px] font-bold uppercase tracking-wider opacity-40 ${msg.role === Role.USER ? 'text-white' : 'text-zinc-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {msg.role === Role.USER ? 'Client' : 'Nexus Node'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-5 max-w-[80%]">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400">
                <Icons.Bot />
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-4 rounded-[1.5rem] rounded-tl-none">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 md:px-12 pb-10 pt-4 bg-gradient-to-t from-black via-black to-transparent">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group"
        >
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-2 pl-6 focus-within:border-indigo-500/50 transition-all shadow-2xl backdrop-blur-xl">
             <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Nexus Pro..."
                className="flex-1 bg-transparent py-4 focus:outline-none resize-none min-h-[56px] max-h-48 text-sm text-zinc-100 placeholder:text-zinc-600"
                rows={1}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`mb-2 mr-1 p-3.5 rounded-2xl transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-900/40 translate-y-0 active:scale-95'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <Icons.Send />
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4">
             <span className="text-[10px] text-zinc-600 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                Secure Session
             </span>
             <span className="text-[10px] text-zinc-600 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                {modelName}
             </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
