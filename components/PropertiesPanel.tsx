import React, { useState } from 'react';
import { WebsiteElement } from '../types';
import { improveText } from '../services/geminiService';
import { Icons } from './Icons';

interface PropertiesPanelProps {
  element: WebsiteElement | null;
  onUpdate: (id: string, updates: Partial<WebsiteElement>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, onUpdate }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  if (!element) {
    return (
      <div className="w-80 bg-[#18181b] border-l border-[#27272a] p-6 flex flex-col items-center justify-center text-zinc-500 h-full">
        <div className="w-16 h-16 rounded-full bg-[#27272a] flex items-center justify-center mb-4">
             <Icons.Settings className="w-8 h-8 opacity-40" />
        </div>
        <p className="text-sm text-center font-medium text-zinc-400">No Element Selected</p>
        <p className="text-xs text-center text-zinc-600 mt-1">Click on any section in the canvas to edit its properties.</p>
      </div>
    );
  }

  const handleStyleChange = (key: keyof React.CSSProperties, value: string) => {
    onUpdate(element.id, {
      styles: { ...element.styles, [key]: value }
    });
  };

  const handleContentChange = (key: string, value: string) => {
    onUpdate(element.id, {
      content: { ...element.content, [key]: value }
    });
  };

  const handleEnhanceText = async (key: string) => {
     const currentText = element.content[key];
     if (!currentText) return;

     setIsEnhancing(true);
     const improved = await improveText(currentText, "Make it more professional, punchy, and marketing-oriented. Keep it concise.");
     if (improved) {
        handleContentChange(key, improved);
     }
     setIsEnhancing(false);
  };

  return (
    <div className="w-80 bg-[#18181b] border-l border-[#27272a] h-full flex flex-col overflow-hidden z-20 shadow-xl">
      <div className="p-4 border-b border-[#27272a] bg-[#18181b]">
        <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-100 text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></span>
                {element.type} Properties
            </h2>
            <span className="text-[10px] text-zinc-500 font-mono">{element.id.slice(-6)}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
        
        {/* Content Section */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 border-b border-[#27272a] pb-2">Content Editor</h3>
           
           {element.content.title !== undefined && (
             <div className="space-y-1.5">
               <div className="flex justify-between items-center">
                 <label className="text-xs font-medium text-zinc-400">Title</label>
                 <button 
                   onClick={() => handleEnhanceText('title')}
                   disabled={isEnhancing}
                   className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-900/20 hover:bg-brand-900/40 transition-colors"
                   title="Use AI to rewrite this text"
                 >
                   {/* <Icons.Sparkles className="w-3 h-3" /> AI Rewrite */}
                 </button>
               </div>
               <input 
                  type="text" 
                  value={element.content.title}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded px-3 py-2 text-xs text-zinc-100 focus:border-brand-500 focus:outline-none transition-colors"
               />
             </div>
           )}

           {element.content.subtitle !== undefined && (
             <div className="space-y-1.5">
               <div className="flex justify-between items-center">
                 <label className="text-xs font-medium text-zinc-400">Subtitle</label>
                 <button 
                   onClick={() => handleEnhanceText('subtitle')}
                   disabled={isEnhancing}
                    className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-900/20 hover:bg-brand-900/40 transition-colors"
                 >
                    {/* <Icons.Sparkles className="w-3 h-3" /> AI Rewrite */}
                 </button>
               </div>
               <textarea 
                  rows={3}
                  value={element.content.subtitle}
                  onChange={(e) => handleContentChange('subtitle', e.target.value)}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded px-3 py-2 text-xs text-zinc-100 focus:border-brand-500 focus:outline-none resize-none transition-colors leading-relaxed"
               />
             </div>
           )}

           {element.content.buttonText !== undefined && (
             <div className="space-y-1.5">
               <label className="text-xs font-medium text-zinc-400">Button Text</label>
               <input 
                  type="text" 
                  value={element.content.buttonText}
                  onChange={(e) => handleContentChange('buttonText', e.target.value)}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded px-3 py-2 text-xs text-zinc-100 focus:border-brand-500 focus:outline-none transition-colors"
               />
             </div>
           )}

            {element.content.body !== undefined && (
             <div className="space-y-1.5">
               <div className="flex justify-between items-center">
                 <label className="text-xs font-medium text-zinc-400">Body Text</label>
                 <button 
                   onClick={() => handleEnhanceText('body')}
                   disabled={isEnhancing}
                    className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-900/20 hover:bg-brand-900/40 transition-colors"
                 >
                    {/* <Icons.Sparkles className="w-3 h-3" /> AI Rewrite */}
                 </button>
               </div>
               <textarea 
                  rows={6}
                  value={element.content.body}
                  onChange={(e) => handleContentChange('body', e.target.value)}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded px-3 py-2 text-xs text-zinc-100 focus:border-brand-500 focus:outline-none transition-colors custom-scrollbar"
               />
             </div>
           )}
        </div>

        {/* Styles Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 border-b border-[#27272a] pb-2">Design & Layout</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Background</label>
              <div className="flex items-center gap-2 bg-[#27272a] border border-[#3f3f46] rounded p-1.5">
                 <input 
                    type="color" 
                    value={element.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                 />
                 <input 
                    type="text" 
                    value={element.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="flex-1 bg-transparent border-none text-[10px] text-zinc-300 focus:outline-none font-mono uppercase"
                 />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Text Color</label>
              <div className="flex items-center gap-2 bg-[#27272a] border border-[#3f3f46] rounded p-1.5">
                 <input 
                    type="color" 
                    value={element.styles.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                     className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                 />
                 <input 
                    type="text" 
                    value={element.styles.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="flex-1 bg-transparent border-none text-[10px] text-zinc-300 focus:outline-none font-mono uppercase"
                 />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Vertical Padding</label>
              <div className="flex items-center bg-[#27272a] border border-[#3f3f46] rounded">
                <input 
                    type="text" 
                    value={element.styles.padding || '4rem 2rem'}
                    onChange={(e) => handleStyleChange('padding', e.target.value)}
                    className="w-full bg-transparent border-none rounded px-3 py-2 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
          </div>
          
          <div className="space-y-1.5">
             <label className="text-xs font-medium text-zinc-400">Text Alignment</label>
             <div className="flex border border-[#3f3f46] rounded bg-[#27272a] overflow-hidden p-0.5">
                {['left', 'center', 'right'].map((align) => (
                   <button
                     key={align}
                     onClick={() => handleStyleChange('textAlign', align)}
                     className={`flex-1 py-1.5 text-[10px] capitalize rounded-sm transition-all ${element.styles.textAlign === align ? 'bg-[#3f3f46] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                   >
                     {align}
                   </button>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;