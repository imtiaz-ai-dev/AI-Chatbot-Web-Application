
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import SettingsPanel from './components/SettingsPanel';
import Vault from './components/Vault';
import { ChatSession, Message, Role, ModelConfig, ViewType, APIKeyState } from './types';
import { AVAILABLE_MODELS, Icons } from './constants';
import { geminiService } from './services/gemini';

const INITIAL_CONFIG: ModelConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  systemInstruction: "You are Nexus Pro, a sophisticated AI engineering platform. You assist users with advanced technical queries, system architecture, and creative development while maintaining professional integrity."
};

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [config, setConfig] = useState<ModelConfig>(INITIAL_CONFIG);
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('workspace');
  
  // API Keys state (persisted in session for demo)
  const [apiKeys, setApiKeys] = useState<APIKeyState>(() => {
    const saved = localStorage.getItem('nexus_keys');
    return saved ? JSON.parse(saved) : { openai: '', groq: '', gemini: 'System Set' };
  });

  useEffect(() => {
    localStorage.setItem('nexus_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Active Workspace',
      messages: [],
      modelId: selectedModel,
      createdAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveView('workspace');
  }, [selectedModel]);

  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, [sessions.length, createNewSession]);

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content,
      timestamp: new Date()
    };

    let updatedSessions = sessions.map(s => {
      if (s.id === currentSessionId) {
        const title = s.messages.length === 0 ? (content.length > 25 ? content.substring(0, 25) + '...' : content) : s.title;
        return { ...s, title, messages: [...s.messages, userMessage] };
      }
      return s;
    });

    setSessions(updatedSessions);
    setIsLoading(true);

    try {
      const modelMessageId = (Date.now() + 1).toString();
      let fullResponse = "";

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, { id: modelMessageId, role: Role.MODEL, content: "", timestamp: new Date() }]
          };
        }
        return s;
      }));

      const stream = geminiService.sendMessageStream(
        selectedModel,
        currentSession?.messages || [],
        content,
        config
      );

      for await (const text of stream) {
        fullResponse += text;
        setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
            const updatedMessages = s.messages.map(m =>
              m.id === modelMessageId ? { ...m, content: fullResponse } : m
            );
            return { ...s, messages: updatedMessages };
          }
          return s;
        }));
      }
    } catch (error) {
      console.error("AI Node Failure:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(sessions[0]?.id || '');
    }
  };

  const handleKeyChange = (provider: keyof APIKeyState, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  return (
    <div className="flex h-screen w-full bg-black text-zinc-300 font-sans antialiased overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewChat={createNewSession}
        onDeleteSession={deleteSession}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Top Control Bar */}
        <div className="absolute top-0 inset-x-0 h-16 border-b border-zinc-800/40 bg-black/60 backdrop-blur-xl z-20 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-zinc-800/50 rounded-xl transition-all text-zinc-500 hover:text-white"
          >
            <Icons.Sidebar />
          </button>

          <div className="flex items-center gap-2">
             <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2.5 rounded-xl transition-all ${settingsOpen ? 'bg-indigo-600 text-white' : 'hover:bg-zinc-800/50 text-zinc-500 hover:text-white'}`}
            >
              <Icons.Settings />
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 pt-16 flex overflow-hidden">
          {activeView === 'workspace' ? (
            <ChatWindow
              messages={currentSession?.messages || []}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              modelName={AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || 'Nexus Engine'}
            />
          ) : (
            <Vault apiKeys={apiKeys} onKeyChange={handleKeyChange} />
          )}

          <SettingsPanel
            isOpen={settingsOpen}
            config={config}
            selectedModel={selectedModel}
            onConfigChange={(newConfig) => setConfig(prev => ({ ...prev, ...newConfig }))}
            onModelChange={setSelectedModel}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
