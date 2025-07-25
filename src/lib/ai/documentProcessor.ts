import { OCROrchestrator } from './providers/ocr';
import { NLPOrchestrator } from './providers/nlp';
import type { AnalysisResult } from './providers/types';

export class DocumentProcessor {
  private ocrOrchestrator: OCROrchestrator;
  private nlpOrchestrator: NLPOrchestrator;

  constructor() {
    this.ocrOrchestrator = new OCROrchestrator();
    this.nlpOrchestrator = new NLPOrchestrator();
  }

  async processDocument(file: File): Promise<AnalysisResult> {
    try {
      // Extract text using optimal OCR provider
      const text = await this.ocrOrchestrator.processDocument(file);

      // Analyze text using multiple NLP providers
      const analysis = await this.nlpOrchestrator.analyzeDocument(text);

      // Generate executive summary
      const summary = await this.nlpOrchestrator.generateSummary(text);

      return {
        ...analysis,
        summary
      };
    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error('Failed to process document');
    }
  }
}