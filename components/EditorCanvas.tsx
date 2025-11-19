import React, { useState, useRef } from 'react';
import { WebsiteElement, ElementType, EditorState } from '../types';
import { Icons } from './Icons';

interface EditorCanvasProps {
  elements: WebsiteElement[];
  selectedId: string | null;
  previewMode: EditorState['previewMode'];
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onInsert: (index: number, type: ElementType) => void;
  readOnly?: boolean;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  elements,
  selectedId,
  previewMode,
  onSelect,
  onDelete,
  onReorder,
  onInsert,
  readOnly = false
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Drag & Drop Handlers ---

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (readOnly) return;
    e.stopPropagation();
    e.dataTransfer.setData('application/react-dnd-index', index.toString());
    e.dataTransfer.setData('application/react-dnd-type', 'REORDER');
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (readOnly) return;
    e.preventDefault(); // Necessary to allow dropping
    e.stopPropagation();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      if (readOnly) return;
      // Optional: Clear indicator if leaving specific zones
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);

    const type = e.dataTransfer.getData('application/react-dnd-type');

    if (type === 'REORDER') {
      const dragIndexStr = e.dataTransfer.getData('application/react-dnd-index');
      const dragIndex = parseInt(dragIndexStr, 10);
      if (!isNaN(dragIndex) && dragIndex !== dropIndex) {
        onReorder(dragIndex, dropIndex);
      }
    } else if (type === 'NEW_ELEMENT') {
      const elementType = e.dataTransfer.getData('application/react-dnd-element-type') as ElementType;
      if (elementType) {
        onInsert(dropIndex, elementType);
      }
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
      if (readOnly) return;
      e.preventDefault();
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
      if (readOnly) return;
      e.preventDefault();
      const type = e.dataTransfer.getData('application/react-dnd-type');
      if (type === 'NEW_ELEMENT' && elements.length === 0) {
          const elementType = e.dataTransfer.getData('application/react-dnd-element-type') as ElementType;
          onInsert(0, elementType);
      }
  };

  // --- Rendering Content ---

  const renderContent = (element: WebsiteElement) => {
    const { type, content, styles } = element;
    
    // Common container styles
    const containerStyle: React.CSSProperties = {
      backgroundColor: styles.backgroundColor || 'transparent',
      color: styles.color || 'inherit',
      padding: styles.padding || '4rem 2rem',
      textAlign: styles.textAlign || 'left',
      fontFamily: styles.fontFamily || 'Inter, sans-serif',
    };

    switch (type) {
      case ElementType.NAVBAR:
        return (
          <div style={{ ...containerStyle, padding: '1rem 2rem' }} className="flex justify-between items-center border-b border-zinc-100/10">
            <h2 className="text-xl font-bold tracking-tight">{content.title || 'Brand'}</h2>
            <div className="flex gap-6 text-sm font-medium opacity-80">
              <span>Home</span>
              <span>About</span>
              <span>Services</span>
              <span>Contact</span>
            </div>
          </div>
        );

      case ElementType.HERO:
        return (
          <div style={containerStyle} className="flex flex-col items-center justify-center min-h-[400px] gap-8">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-center drop-shadow-sm">
              {content.title || 'Hero Headline'}
            </h1>
            <p className="text-xl opacity-80 max-w-2xl mx-auto text-center leading-relaxed font-light">
              {content.subtitle || 'A descriptive subtitle goes here. Explain your value proposition simply and effectively.'}
            </p>
            {content.buttonText && (
               <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-transform hover:scale-105 shadow-xl">
                 {content.buttonText}
               </button>
            )}
          </div>
        );

      case ElementType.FEATURES:
        return (
           <div style={containerStyle}>
             <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">{content.title || 'Our Features'}</h2>
                  <p className="opacity-70 text-lg">{content.subtitle || 'What makes us different'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {content.items?.map((item: any, idx: number) => (
                     <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl mb-6 flex items-center justify-center text-blue-400">
                           <Icons.Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{item.title || `Feature ${idx + 1}`}</h3>
                        <p className="opacity-70 text-sm leading-relaxed">{item.description || 'Description of this feature.'}</p>
                     </div>
                   )) || (
                     <>
                       {[1,2,3].map(i => (
                          <div key={i} className="p-6 rounded border border-zinc-200 bg-zinc-50">
                             <h3 className="font-bold mb-2">Feature {i}</h3>
                             <p className="text-sm opacity-70">Placeholder feature description.</p>
                          </div>
                       ))}
                     </>
                   )}
                </div>
             </div>
           </div>
        );
      
      case ElementType.TEXT_BLOCK:
         return (
           <div style={containerStyle} className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 pb-4 border-b border-current border-opacity-10">{content.title || 'Section Title'}</h2>
              <div className="prose prose-lg max-w-none opacity-90 leading-relaxed" dangerouslySetInnerHTML={{__html: content.body?.replace(/\n/g, '<br/>') || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}} />
           </div>
         );

      case ElementType.IMAGE:
        return (
          <div style={containerStyle} className="w-full flex justify-center">
             <img 
               src={content.imageUrl || 'https://picsum.photos/1200/600'} 
               alt="Placeholder" 
               className="max-w-full h-auto rounded-2xl shadow-2xl"
               style={{ maxHeight: '600px', objectFit: 'cover' }}
             />
          </div>
        );

      case ElementType.FOOTER:
        return (
          <div style={containerStyle} className="border-t border-white/10 mt-auto">
             <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div>
                  <h3 className="font-bold text-lg mb-6">{content.title || 'Company'}</h3>
                  <p className="text-sm opacity-60 leading-relaxed">Making the world better, one pixel at a time.</p>
                </div>
                <div>
                  <h4 className="font-bold mb-6">Links</h4>
                  <ul className="space-y-3 text-sm opacity-60">
                    <li>Home</li>
                    <li>About</li>
                    <li>Careers</li>
                  </ul>
                </div>
                <div>
                   <h4 className="font-bold mb-6">Legal</h4>
                   <ul className="space-y-3 text-sm opacity-60">
                     <li>Privacy</li>
                     <li>Terms</li>
                   </ul>
                </div>
                <div>
                   <h4 className="font-bold mb-6">Connect</h4>
                   <div className="flex gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"></div>
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"></div>
                   </div>
                </div>
             </div>
             <div className="text-center text-xs opacity-40 mt-16 pt-8 border-t border-white/5">
                © {new Date().getFullYear()} {content.title || 'Brand'}. All rights reserved.
             </div>
          </div>
        );

      default:
        return <div className="p-10 text-center border-2 border-dashed">Unknown Element</div>;
    }
  };

  // Width based on preview mode
  const getWidth = () => {
    if (previewMode === 'mobile') return '375px';
    if (previewMode === 'tablet') return '768px';
    return '100%';
  };

  return (
    <div 
        className="flex-1 bg-[#0f0f11] overflow-auto flex justify-center p-8 relative" 
        onClick={() => !readOnly && onSelect(null)}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
    >
        {/* Grid Background Pattern - Only in Edit Mode */}
        {!readOnly && (
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                }} 
            />
        )}

      <div 
        ref={containerRef}
        className={`bg-white shadow-2xl transition-all duration-500 ease-in-out relative group/canvas min-h-[800px] ${readOnly ? '' : 'ring-1 ring-zinc-800'}`}
        style={{ 
          width: getWidth(), 
          maxWidth: '100%',
          minHeight: 'calc(100vh - 100px)',
          transformOrigin: 'top center',
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        {elements.length === 0 && !readOnly ? (
           <div className="absolute inset-0 flex items-center justify-center text-zinc-300 flex-col gap-4 bg-zinc-50/50 pointer-events-none">
              <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mb-4 border border-zinc-200 animate-pulse">
                  <Icons.Layout className="w-10 h-10 opacity-20 text-zinc-900" />
              </div>
              <p className="font-medium text-zinc-500">Drag components here to start building</p>
              <p className="text-xs text-zinc-400">or use the AI Generator in the sidebar</p>
           </div>
        ) : (
          elements.map((el, index) => (
            <div 
              key={el.id}
              draggable={!readOnly}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onClick={(e) => {
                if (readOnly) return;
                e.stopPropagation();
                onSelect(el.id);
              }}
              className={`relative group transition-all duration-200 ${
                !readOnly && selectedId === el.id 
                  ? 'ring-2 ring-brand-500 z-10' 
                  : !readOnly ? 'ring-1 ring-transparent hover:ring-brand-500/30' : ''
              }`}
            >
               {/* Drop Indicator Line */}
               {!readOnly && dragOverIndex === index && (
                   <div className="absolute top-0 left-0 right-0 h-1 bg-brand-500 z-50 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
               )}

              {/* Controls Overlay */}
              {!readOnly && (
                <div className={`absolute left-0 -top-7 h-7 flex items-center gap-1 z-20 transition-opacity duration-200 ${selectedId === el.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none'}`}>
                   
                   {/* Label */}
                   <div className="bg-brand-600 text-white text-[10px] px-2 h-full flex items-center uppercase font-bold tracking-wider rounded-t-md shadow-sm">
                      {el.type}
                   </div>

                   {/* Drag Handle (Only visible if selected or hovering) */}
                   <div 
                      className="bg-zinc-800 text-zinc-400 hover:text-white h-full px-1.5 flex items-center justify-center cursor-grab active:cursor-grabbing rounded-t-md ml-1 pointer-events-auto"
                      title="Drag to reorder"
                      onMouseDown={(e) => e.stopPropagation()} 
                   >
                      <Icons.GripVertical className="w-4 h-4" />
                   </div>

                   {/* Quick Actions */}
                   {selectedId === el.id && (
                       <button 
                          onClick={(e) => { e.stopPropagation(); onDelete(el.id); }} 
                          className="bg-red-500/90 hover:bg-red-600 text-white h-full px-2 flex items-center justify-center rounded-t-md pointer-events-auto ml-1" 
                          title="Delete Section"
                       >
                          <Icons.Trash className="w-3.5 h-3.5" />
                       </button>
                   )}
                </div>
              )}

              {/* Render the actual component */}
              <div className="relative">
                  {renderContent(el)}
                  
                  {/* Selection Tint */}
                  {!readOnly && selectedId === el.id && <div className="absolute inset-0 bg-brand-500/5 pointer-events-none" />}
              </div>
            </div>
          ))
        )}
        
        {/* Drop zone at the very bottom */}
        {!readOnly && elements.length > 0 && (
             <div 
                className={`h-24 flex items-center justify-center transition-all ${dragOverIndex === elements.length ? 'bg-brand-50/50' : 'bg-transparent'}`}
                onDragOver={(e) => handleDragOver(e, elements.length)}
                onDrop={(e) => handleDrop(e, elements.length)}
             >
                {dragOverIndex === elements.length && <span className="text-brand-500 text-sm font-medium">Drop here to add to bottom</span>}
             </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;