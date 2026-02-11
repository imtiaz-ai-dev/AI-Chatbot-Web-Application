
import React from 'react';
import { ChatSession, ViewType } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  activeView,
  setActiveView
}) => {
  return (
    <aside className={`${isOpen ? 'w-64 md:w-72' : 'w-0'} transition-all duration-500 bg-zinc-950 border-r border-zinc-800/60 flex flex-col overflow-hidden h-full z-30`}>
      {/* Platform Branding */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/30">
            <Icons.Shield />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">NEXUS <span className="text-indigo-500">PRO</span></span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 mb-10">
          <button
            onClick={() => setActiveView('workspace')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
              activeView === 'workspace' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Icons.Layout />
            Workspace
          </button>
          <button
            onClick={() => setActiveView('vault')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
              activeView === 'vault' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Icons.Key />
            API Vault
          </button>
        </nav>
      </div>

      {/* History Header */}
      <div className="px-6 mb-2 flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Context History</h3>
        <button 
          onClick={onNewChat}
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-indigo-400 transition-colors"
          title="New Workspace"
        >
          <Icons.Plus />
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
              currentSessionId === session.id && activeView === 'workspace'
                ? 'bg-zinc-900 text-white border border-zinc-800'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
            }`}
            onClick={() => {
              onSelectSession(session.id);
              setActiveView('workspace');
            }}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`w-1.5 h-1.5 rounded-full ${currentSessionId === session.id ? 'bg-indigo-500' : 'bg-zinc-700'}`}></div>
              <span className="truncate text-[13px] font-medium leading-none">{session.title}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
            >
              <Icons.Trash />
            </button>
          </div>
        ))}
      </div>

      {/* User Status */}
      <div className="p-4 border-t border-zinc-800/60 bg-zinc-900/20">
        <div className="flex items-center gap-3 p-2 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-bold text-white truncate">Administrator</div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Node
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
