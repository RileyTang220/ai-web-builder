import React, { useState } from 'react';
import { ElementType } from '../types';
import { Icons } from './Icons';

interface SidebarProps {
  onAddElement: (type: ElementType, prompt?: string) => void;
  isGenerating: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddElement, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'add' | 'ai'>('add');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiType, setAiType] = useState<ElementType>(ElementType.HERO);

  const tools = [
    { type: ElementType.NAVBAR, label: 'Navigation', icon: Icons.Layout },
    { type: ElementType.HERO, label: 'Hero', icon: Icons.Monitor },
    { type: ElementType.FEATURES, label: 'Features', icon: Icons.Layout },
    { type: ElementType.TEXT_BLOCK, label: 'Text', icon: Icons.Type },
    { type: ElementType.IMAGE, label: 'Image', icon: Icons.Image },
    { type: ElementType.FOOTER, label: 'Footer', icon: Icons.Layout },
  ];

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) return;
    onAddElement(aiType, aiPrompt);
    setAiPrompt('');
  };

  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData('application/react-dnd-type', 'NEW_ELEMENT');
    e.dataTransfer.setData('application/react-dnd-element-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-64 bg-[#18181b] border-r border-[#27272a] flex flex-col h-full text-zinc-300 z-20 shadow-xl">
      {/* Tabs */}
      <div className="flex p-2 gap-1 bg-[#18181b] border-b border-[#27272a]">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 rounded text-xs font-medium flex items-center justify-center gap-2 transition-all ${activeTab === 'add' ? 'bg-[#27272a] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#27272a]/50'}`}
        >
          <Icons.Plus className="w-3.5 h-3.5" /> Components
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2 rounded text-xs font-medium flex items-center justify-center gap-2 transition-all ${activeTab === 'ai' ? 'bg-brand-900/20 text-brand-400 border border-brand-500/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#27272a]/50'}`}
        >
          <Icons.Sparkles className="w-3.5 h-3.5" /> AI Gen
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'add' ? (
          <div className="space-y-6">
            <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 pl-1">Draggable Elements</p>
                <div className="grid grid-cols-2 gap-2">
                {tools.map((tool) => (
                    <div
                        key={tool.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, tool.type)}
                        onClick={() => onAddElement(tool.type)}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46]/50 hover:border-zinc-500 transition-all cursor-grab active:cursor-grabbing group"
                    >
                    <div className="text-zinc-400 group-hover:text-white transition-colors">
                        <tool.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-medium">{tool.label}</span>
                    </div>
                ))}
                </div>
            </div>
            
            <div className="p-3 rounded-lg bg-blue-900/10 border border-blue-500/10 text-xs text-blue-200/70 leading-relaxed">
                <strong className="text-blue-400 block mb-1">Pro Tip:</strong>
                Drag these items directly onto the canvas to position them instantly.
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="p-3 bg-brand-950/40 border border-brand-500/20 rounded-lg">
              <h3 className="text-xs font-semibold text-brand-200 mb-1 flex items-center gap-2">
                <Icons.Sparkles className="w-3.5 h-3.5 text-brand-400" /> AI Assistant
              </h3>
              <p className="text-[11px] text-brand-200/60 leading-normal">
                Describe the section you want, and AI will generate the layout and content for you.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Section Type</label>
              <div className="relative">
                <select
                    value={aiType}
                    onChange={(e) => setAiType(e.target.value as ElementType)}
                    className="w-full bg-[#27272a] border border-[#3f3f46] rounded px-2 py-2 text-xs text-white focus:outline-none focus:border-brand-500 appearance-none"
                >
                    <option value={ElementType.HERO}>Hero Section</option>
                    <option value={ElementType.FEATURES}>Features List</option>
                    <option value={ElementType.TEXT_BLOCK}>About / Text</option>
                    <option value={ElementType.FOOTER}>Footer</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Description</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., A dark modern hero section for a coffee shop with a 'Order Now' button."
                className="w-full h-32 bg-[#27272a] border border-[#3f3f46] rounded p-3 text-xs text-white focus:outline-none focus:border-brand-500 resize-none placeholder-zinc-600 leading-relaxed"
              />
            </div>

            <button
              onClick={handleAiGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              className={`w-full py-2.5 rounded font-medium text-xs flex items-center justify-center gap-2 transition-all ${
                isGenerating || !aiPrompt.trim()
                  ? 'bg-[#27272a] text-zinc-500 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Icons.Sparkles className="w-3.5 h-3.5" /> Generate
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;