import { TesseractProvider } from './tesseract';
import { TextractProvider } from './textract';
import { AzureVisionProvider } from './azure-vision';
import { GoogleVisionProvider } from './google-vision';
import type { OCRProvider } from '../types';

const providers: OCRProvider[] = [
  new TesseractProvider(),
  new TextractProvider(),
  new AzureVisionProvider(),
  new GoogleVisionProvider(),
];

export class OCROrchestrator {
  private providers: OCRProvider[];

  constructor() {
    this.providers = providers;
  }

  async processDocument(file: File): Promise<string> {
    // Select best provider based on file type, size, and cost
    const bestProvider = this.selectProvider(file);
    
    try {
      return await bestProvider.extractText(file);
    } catch (error) {
      // Fallback to next best provider
      const fallbackProvider = this.selectFallbackProvider(bestProvider);
      return await fallbackProvider.extractText(file);
    }
  }

  private selectProvider(file: File): OCRProvider {
    const fileType = file.type;
    const fileSize = file.size;

    // Filter providers that support this file type
    const supportedProviders = this.providers.filter(p => 
      p.supportedFormats.includes(fileType)
    );

    // Score providers based on multiple factors
    const scoredProviders = supportedProviders.map(provider => ({
      provider,
      score: this.calculateProviderScore(provider, fileSize)
    }));

    // Return provider with highest score
    return scoredProviders.sort((a, b) => b.score - a.score)[0].provider;
  }

  private calculateProviderScore(provider: OCRProvider, fileSize: number): number {
    const costScore = 1 / provider.costPerPage;
    const speedScore = 1 / provider.averageSpeed;
    
    // Weight factors based on importance
    return (costScore * 0.4) + (speedScore * 0.6);
  }

  private selectFallbackProvider(failedProvider: OCRProvider): OCRProvider {
    return this.providers.find(p => p !== failedProvider) || this.providers[0];
  }
}