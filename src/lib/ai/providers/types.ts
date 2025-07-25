export interface OCRProvider {
  name: string;
  extractText: (file: File) => Promise<string>;
  supportedFormats: string[];
  costPerPage: number;
  averageSpeed: number; // ms per page
}

export interface NLPProvider {
  name: string;
  analyzeText: (text: string) => Promise<AnalysisResult>;
  generateSummary: (text: string) => Promise<string>;
  costPer1000Tokens: number;
  capabilities: NLPCapability[];
}

export interface AnalysisResult {
  metrics: {
    revenue?: number;
    profit?: number;
    growth?: number;
    margins?: number;
  };
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  keyTopics: string[];
  entities: Entity[];
}

export interface Entity {
  text: string;
  type: string;
  confidence: number;
}

export type NLPCapability = 
  | 'sentiment'
  | 'entity_recognition'
  | 'summarization'
  | 'classification'
  | 'financial_metrics';