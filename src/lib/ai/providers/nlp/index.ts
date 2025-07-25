import { OpenAIProvider } from './openai';
import { CohereProvider } from './cohere';
import { AzureLanguageProvider } from './azure-language';
import type { NLPProvider, AnalysisResult } from '../types';

const providers: NLPProvider[] = [
  new OpenAIProvider(),
  new CohereProvider(),
  new AzureLanguageProvider(),
];

export class NLPOrchestrator {
  private providers: NLPProvider[];
  private providerWeights: Map<string, number>;

  constructor() {
    this.providers = providers;
    this.providerWeights = new Map(
      providers.map(p => [p.name, 1 / providers.length])
    );
  }

  async analyzeDocument(text: string): Promise<AnalysisResult> {
    // Parallel processing with multiple providers for better accuracy
    const results = await Promise.all(
      this.selectProviders().map(provider => 
        provider.analyzeText(text)
          .then(result => ({ provider: provider.name, result, error: null }))
          .catch(error => ({ provider: provider.name, result: null, error }))
      )
    );

    // Filter out failed results
    const successfulResults = results.filter(r => !r.error);
    
    if (successfulResults.length === 0) {
      throw new Error('All NLP providers failed to analyze the document');
    }

    // Update provider weights based on success/failure
    this.updateProviderWeights(results);

    // Combine and reconcile results
    return this.mergeResults(successfulResults.map(r => r.result));
  }

  async generateSummary(text: string): Promise<string> {
    const bestProvider = this.selectBestProvider();
    
    try {
      return await bestProvider.generateSummary(text);
    } catch (error) {
      // Fallback to next best provider
      const fallbackProvider = this.selectFallbackProvider(bestProvider);
      return await fallbackProvider.generateSummary(text);
    }
  }

  private selectProviders(count = 2): NLPProvider[] {
    // Select top N providers based on weights
    return [...this.providerWeights.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([name]) => 
        this.providers.find(p => p.name === name)!
      );
  }

  private selectBestProvider(): NLPProvider {
    const [[name]] = [...this.providerWeights.entries()]
      .sort((a, b) => b[1] - a[1]);
    return this.providers.find(p => p.name === name)!;
  }

  private selectFallbackProvider(failedProvider: NLPProvider): NLPProvider {
    return this.providers.find(p => p !== failedProvider) || this.providers[0];
  }

  private updateProviderWeights(results: Array<{ provider: string; error: any; }>): void {
    const totalProviders = this.providers.length;
    const successfulProviders = results.filter(r => !r.error).length;

    results.forEach(({ provider, error }) => {
      const currentWeight = this.providerWeights.get(provider) || 0;
      const newWeight = error
        ? currentWeight * 0.8 // Reduce weight on failure
        : currentWeight * (1 + (0.2 / successfulProviders)); // Increase weight on success
      
      this.providerWeights.set(provider, newWeight);
    });

    // Normalize weights
    const totalWeight = [...this.providerWeights.values()].reduce((a, b) => a + b, 0);
    this.providerWeights.forEach((weight, provider) => {
      this.providerWeights.set(provider, weight / totalWeight);
    });
  }

  private mergeResults(results: AnalysisResult[]): AnalysisResult {
    return {
      metrics: this.mergeMetrics(results.map(r => r.metrics)),
      sentiment: this.mergeSentiment(results.map(r => r.sentiment)),
      keyTopics: this.mergeKeyTopics(results.map(r => r.keyTopics)),
      entities: this.mergeEntities(results.map(r => r.entities))
    };
  }

  private mergeMetrics(metricsArray: Array<AnalysisResult['metrics']>): AnalysisResult['metrics'] {
    const validMetrics = metricsArray.filter(m => m !== null);
    if (validMetrics.length === 0) return {};

    return {
      revenue: this.averageMetric(validMetrics, 'revenue'),
      profit: this.averageMetric(validMetrics, 'profit'),
      growth: this.averageMetric(validMetrics, 'growth'),
      margins: this.averageMetric(validMetrics, 'margins')
    };
  }

  private averageMetric(metrics: Array<AnalysisResult['metrics']>, key: keyof AnalysisResult['metrics']): number | undefined {
    const values = metrics
      .map(m => m[key])
      .filter((v): v is number => v !== undefined);
    
    return values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : undefined;
  }

  private mergeSentiment(sentiments: Array<AnalysisResult['sentiment']>): AnalysisResult['sentiment'] {
    const avgScore = sentiments.reduce((acc, s) => acc + s.score, 0) / sentiments.length;
    const avgConfidence = sentiments.reduce((acc, s) => acc + s.confidence, 0) / sentiments.length;

    return {
      score: avgScore,
      label: this.determineSentimentLabel(avgScore),
      confidence: avgConfidence
    };
  }

  private determineSentimentLabel(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 0.2) return 'positive';
    if (score < -0.2) return 'negative';
    return 'neutral';
  }

  private mergeKeyTopics(topicsArrays: string[][]): string[] {
    // Count topic occurrences across all results
    const topicCounts = new Map<string, number>();
    topicsArrays.forEach(topics => {
      topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    // Return topics mentioned by majority of providers
    const threshold = this.providers.length / 2;
    return [...topicCounts.entries()]
      .filter(([_, count]) => count >= threshold)
      .map(([topic]) => topic);
  }

  private mergeEntities(entitiesArrays: Array<AnalysisResult['entities']>): AnalysisResult['entities'] {
    const entityMap = new Map<string, { type: string; confidences: number[]; }>();

    entitiesArrays.forEach(entities => {
      entities.forEach(entity => {
        const key = `${entity.text}:${entity.type}`;
        const existing = entityMap.get(key);
        if (existing) {
          existing.confidences.push(entity.confidence);
        } else {
          entityMap.set(key, {
            type: entity.type,
            confidences: [entity.confidence]
          });
        }
      });
    });

    return [...entityMap.entries()].map(([key, value]) => ({
      text: key.split(':')[0],
      type: value.type,
      confidence: value.confidences.reduce((a, b) => a + b, 0) / value.confidences.length
    }));
  }
}

export { NLPOrchestrator }