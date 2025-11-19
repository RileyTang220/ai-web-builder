export enum ElementType {
  SECTION = 'SECTION',
  HERO = 'HERO',
  TEXT_BLOCK = 'TEXT_BLOCK',
  IMAGE = 'IMAGE',
  BUTTON = 'BUTTON',
  FEATURES = 'FEATURES',
  NAVBAR = 'NAVBAR',
  FOOTER = 'FOOTER'
}

export interface StyleProperties {
  backgroundColor?: string;
  color?: string;
  padding?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: string;
  height?: string;
  backgroundImage?: string;
  fontFamily?: string;
}

export interface WebsiteElement {
  id: string;
  type: ElementType;
  content: any; // Flexible content based on type
  styles: StyleProperties;
}

export interface EditorState {
  elements: WebsiteElement[];
  selectedId: string | null;
  previewMode: 'desktop' | 'mobile' | 'tablet';
  isGenerating: boolean;
}

// Gemini AI Types
export interface AIRequestConfig {
  prompt: string;
  currentContent?: any;
}