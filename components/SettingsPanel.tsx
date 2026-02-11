
import React from 'react';
import { ModelConfig, AIModel } from '../types';
import { AVAILABLE_MODELS, Icons } from '../constants';

interface SettingsPanelProps {
  config: ModelConfig;
  selectedModel: string;
  onConfigChange: (config: Partial<ModelConfig>) => void;
  onModelChange: (modelId: string) => void;
  isOpen: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  config,
  selectedModel,
  onConfigChange,
  onModelChange,
  isOpen
}) => {
  return (
    <aside className={`${isOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-zinc-950 border-l border-zinc-800 flex flex-col overflow-hidden h-full z-20`}>
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <Icons.Settings />
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Configuration</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Model Selection */}
        <div className="space-y-4">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Engine Model</label>
          <div className="space-y-2">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => onModelChange(model.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedModel === model.id
                    ? 'bg-indigo-600/10 border-indigo-500/50 ring-1 ring-indigo-500/50'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="font-semibold text-sm text-zinc-100">{model.name}</div>
                <div className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{model.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Parameters */}
        <div className="space-y-6">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Parameters</label>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">Temperature</span>
              <span className="text-xs font-mono text-indigo-400">{config.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) => onConfigChange({ temperature: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">Top P</span>
              <span className="text-xs font-mono text-indigo-400">{config.topP}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.topP}
              onChange={(e) => onConfigChange({ topP: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">Max Tokens</span>
              <span className="text-xs font-mono text-indigo-400">{config.maxOutputTokens || 'Auto'}</span>
            </div>
            <input
              type="number"
              value={config.maxOutputTokens || ''}
              onChange={(e) => onConfigChange({ maxOutputTokens: parseInt(e.target.value) || undefined })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              placeholder="Auto"
            />
          </div>
        </div>

        {/* System Instruction */}
        <div className="space-y-4">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">System Prompt</label>
          <textarea
            value={config.systemInstruction || ''}
            onChange={(e) => onConfigChange({ systemInstruction: e.target.value })}
            placeholder="Define how the AI should behave..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all h-32 resize-none"
          />
        </div>
      </div>
    </aside>
  );
};

export default SettingsPanel;
