
import React from 'react';
import { APIKeyState } from '../types';
import { Icons } from '../constants';

interface VaultProps {
  apiKeys: APIKeyState;
  onKeyChange: (provider: keyof APIKeyState, value: string) => void;
}

const Vault: React.FC<VaultProps> = ({ apiKeys, onKeyChange }) => {
  return (
    <div className="flex-1 bg-black overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 md:p-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Icons.Key />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">API Vault</h1>
          </div>
          <p className="text-zinc-500 text-sm max-w-lg">
            Manage your credentials for external AI providers. Keys are stored locally in your browser context and never transmitted elsewhere.
          </p>
        </header>

        <div className="grid gap-6">
          {/* Gemini - System Managed */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">Google Gemini</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full font-bold uppercase tracking-wider">Default Provider</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                SYSTEM ACTIVE
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Key Status</label>
              <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl text-zinc-400 font-mono text-xs italic">
                Managed by environment configuration
              </div>
            </div>
          </div>

          {/* OpenAI */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#74aa9c]/10 flex items-center justify-center text-[#74aa9c]">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22.28 11.23c-.1-.31-.4-.51-.72-.51h-5.27l1.63-4.14c.14-.36-.02-.77-.37-.92-.35-.15-.76.01-.91.37l-2.07 5.25c-.1.25-.04.53.15.72.19.19.47.25.72.15l2.4-.93-2.01 5.1c-.14.36.02.77.37.92.35.15.76-.01.91-.37l2.19-5.55c.1-.25.04-.53-.15-.72-.19-.19-.47-.25-.72-.15l-2.4.93 2.01-5.1c.14-.36-.02-.77-.37-.92-.35-.15-.76.01-.91.37l-2.19 5.55c-.1.25-.04.53.15.72s.47.25.72.15l2.4-.93-2.01 5.1c-.14.36.02.77.37.92.35.15.76-.01.91-.37l2.19-5.55c.1-.25.04-.53-.15-.72-.19-.19-.47-.25-.72-.15l-2.4.93 2.01-5.1z"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">OpenAI</h3>
                  <p className="text-zinc-500 text-[11px]">Required for GPT-4 and reasoning models.</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-xl ${apiKeys.openai ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-800'}`}>
                {apiKeys.openai ? 'CONNECTED' : 'DISCONNECTED'}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">API Secret Key</label>
              <input 
                type="password"
                value={apiKeys.openai}
                onChange={(e) => onKeyChange('openai', e.target.value)}
                placeholder="sk-..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 p-4 rounded-2xl text-white font-mono text-sm transition-all focus:outline-none"
              />
            </div>
          </div>

          {/* Groq */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <span className="font-black italic text-xl">G</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Groq Cloud</h3>
                  <p className="text-zinc-500 text-[11px]">Enables ultra-low latency LPU acceleration.</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-xl ${apiKeys.groq ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-800'}`}>
                {apiKeys.groq ? 'CONNECTED' : 'DISCONNECTED'}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Groq API Key</label>
              <input 
                type="password"
                value={apiKeys.groq}
                onChange={(e) => onKeyChange('groq', e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 p-4 rounded-2xl text-white font-mono text-sm transition-all focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/20 text-center">
          <p className="text-xs text-indigo-400 leading-relaxed">
            <strong>Pro Tip:</strong> All keys are encrypted in-memory and persisted only within this application's private storage. 
            We never see your keys. Your privacy is our architecture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vault;
