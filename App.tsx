import React, { useState, useCallback } from 'react';
import { WebsiteElement, ElementType, EditorState } from './types';
import Sidebar from './components/Sidebar';
import EditorCanvas from './components/EditorCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import { generateElementContent } from './services/geminiService';
import { Icons } from './components/Icons';

const App: React.FC = () => {
  const [elements, setElements] = useState<WebsiteElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<EditorState['previewMode']>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const createNewElement = (type: ElementType, content?: any, styles?: any): WebsiteElement => {
    return {
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: content || getDefaultContent(type),
      styles: styles || getDefaultStyles(type)
    };
  };

  const handleAddElement = async (type: ElementType, prompt?: string) => {
    let newElement: WebsiteElement;

    if (prompt) {
      setIsGenerating(true);
      const aiContent = await generateElementContent(type, prompt);
      setIsGenerating(false);

      // Fallback if AI fails
      const content = aiContent?.content || getDefaultContent(type);
      const styles = aiContent?.styles || getDefaultStyles(type);
      
      newElement = createNewElement(type, content, styles);
    } else {
      newElement = createNewElement(type);
    }

    setElements(prev => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  const handleInsertElement = (index: number, type: ElementType) => {
    const newElement = createNewElement(type);
    setElements(prev => {
      const newArr = [...prev];
      newArr.splice(index, 0, newElement);
      return newArr;
    });
    setSelectedId(newElement.id);
  };

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    setElements(prev => {
      const updated = [...prev];
      const [draggedItem] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, draggedItem);
      return updated;
    });
  };

  const handleUpdateElement = (id: string, updates: Partial<WebsiteElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const handleDeleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const getDefaultContent = (type: ElementType) => {
    switch (type) {
      case ElementType.NAVBAR: return { title: 'MyBrand' };
      case ElementType.HERO: return { title: 'Welcome to the web builder', subtitle: 'Start building something amazing today.', buttonText: 'Get Started' };
      case ElementType.TEXT_BLOCK: return { title: 'About Us', body: 'We are a team of passionate creators.' };
      case ElementType.IMAGE: return { imageUrl: 'https://picsum.photos/1200/800' };
      case ElementType.BUTTON: return { text: 'Click Me' };
      case ElementType.FEATURES: return { title: 'Why Choose Us', subtitle: 'Excellence in every detail', items: [{},{},{}] };
      case ElementType.FOOTER: return { title: 'MyBrand' };
      default: return {};
    }
  };

  const getDefaultStyles = (type: ElementType) => {
     const base = { padding: '4rem 2rem', backgroundColor: '#ffffff', color: '#000000', textAlign: 'left' as const };
     if (type === ElementType.NAVBAR) return { ...base, padding: '1rem 2rem', backgroundColor: '#ffffff' };
     if (type === ElementType.HERO) return { ...base, backgroundColor: '#f3f4f6', textAlign: 'center' as const };
     if (type === ElementType.FOOTER) return { ...base, backgroundColor: '#111827', color: '#ffffff' };
     return base;
  };

  const selectedElement = elements.find(el => el.id === selectedId) || null;

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white overflow-hidden font-sans selection:bg-brand-500/30 selection:text-brand-100">
      {/* Top Header */}
      <header className="h-14 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between px-4 flex-shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-md flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Icons.Layout className="text-white w-5 h-5" />
           </div>
           {/* <h1 className="font-bold tracking-tight text-sm text-zinc-100">AI Builder</h1> */}
           {/* <span className="text-[10px] font-medium text-brand-400 bg-brand-900/30 px-2 py-0.5 rounded-full border border-brand-500/20">BETA</span> */}
        </div>

        <div className="flex items-center bg-[#09090b] rounded-md p-0.5 border border-[#27272a]">
           <button 
             onClick={() => setPreviewMode('desktop')}
             className={`p-1.5 rounded-sm transition-all ${previewMode === 'desktop' ? 'bg-[#27272a] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
             title="Desktop View"
           >
              <Icons.Monitor className="w-4 h-4" />
           </button>
           <button 
             onClick={() => setPreviewMode('tablet')}
             className={`p-1.5 rounded-sm transition-all ${previewMode === 'tablet' ? 'bg-[#27272a] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
             title="Tablet View"
           >
              <Icons.Tablet className="w-4 h-4" />
           </button>
           <button 
             onClick={() => setPreviewMode('mobile')}
             className={`p-1.5 rounded-sm transition-all ${previewMode === 'mobile' ? 'bg-[#27272a] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
             title="Mobile View"
           >
              <Icons.Smartphone className="w-4 h-4" />
           </button>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsPreviewing(!isPreviewing)}
             className={`px-4 py-1.5 text-xs font-medium transition-colors flex items-center gap-2 rounded-md ${
               isPreviewing 
                 ? 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-900/20' 
                 : 'text-zinc-400 hover:text-white'
             }`}
           >
             {isPreviewing ? (
               <>
                 <Icons.Eye className="w-4 h-4" /> Exit Preview
               </>
             ) : 'Preview'}
           </button>
           
           {!isPreviewing && (
             <button className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md text-xs font-semibold shadow-lg transition-all">
               Publish
             </button>
           )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Hidden in preview */}
        {!isPreviewing && (
          <Sidebar onAddElement={handleAddElement} isGenerating={isGenerating} />
        )}
        
        <EditorCanvas 
          elements={elements} 
          selectedId={isPreviewing ? null : selectedId}
          previewMode={previewMode}
          onSelect={isPreviewing ? () => {} : setSelectedId}
          onDelete={handleDeleteElement}
          onReorder={handleReorder}
          onInsert={handleInsertElement}
          readOnly={isPreviewing}
        />
        
        {/* Properties Panel - Hidden in preview */}
        {!isPreviewing && (
          <PropertiesPanel 
             element={selectedElement} 
             onUpdate={handleUpdateElement}
          />
        )}
      </div>
    </div>
  );
};

export default App;