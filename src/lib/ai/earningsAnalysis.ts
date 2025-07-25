import { analyzeSentiment } from './sentimentAnalysis';
import { detectPatterns, detectAnomalies } from './trendAnalysis';
import { AnomalyDetector } from './anomalyDetection';

interface EarningsSummary {
  overview: string;
  keyMetrics: {
    revenue: {
      value: number;
      change: number;
      trend: string;
    };
    expenses: {
      value: number;
      change: number;
      trend: string;
    };
    margins: {
      value: number;
      change: number;
      trend: string;
    };
  };
  sentiment: {
    score: number;
    label: string;
    confidence: number;
    keyPhrases: string[];
  };
  trends: {
    pattern: string;
    confidence: number;
    description: string;
    recommendation: string;
  };
  anomalies: Array<{
    metric: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
  topics: {
    name: string;
    mentions: number;
    sentiment: number;
    context: string[];
  }[];
}

export class EarningsAnalyzer {
  private anomalyDetector: AnomalyDetector;

  constructor() {
    this.anomalyDetector = new AnomalyDetector();
  }

  async analyzeEarnings(text: string, historicalData: any[]): Promise<EarningsSummary> {
    // Parallel processing for better performance
    const [
      sentimentAnalysis,
      trendAnalysis,
      anomalies,
      topics
    ] = await Promise.all([
      this.analyzeSentiment(text),
      this.analyzeTrends(historicalData),
      this.detectAnomalies(historicalData),
      this.extractTopics(text)
    ]);

    return {
      overview: this.generateOverview(sentimentAnalysis, trendAnalysis, anomalies),
      keyMetrics: this.calculateKeyMetrics(historicalData),
      sentiment: sentimentAnalysis,
      trends: trendAnalysis,
      anomalies,
      topics
    };
  }

  private async analyzeSentiment(text: string) {
    const sentiment = await analyzeSentiment(text);
    return {
      score: sentiment.score,
      label: sentiment.label,
      confidence: sentiment.confidence,
      keyPhrases: sentiment.keyPhrases
    };
  }

  private analyzeTrends(data: any[]) {
    const patterns = detectPatterns(data.map(d => d.value));
    return {
      pattern: patterns.pattern,
      confidence: patterns.confidence,
      description: patterns.description,
      recommendation: patterns.recommendation
    };
  }

  private async detectAnomalies(data: any[]) {
    const metrics = ['revenue', 'expenses', 'margins'];
    const anomalies: EarningsSummary['anomalies'] = [];

    for (const metric of metrics) {
      const values = data.map(d => d[metric]);
      const results = this.anomalyDetector.detectAnomalies(values);

      results.forEach(result => {
        if (result.isAnomaly) {
          anomalies.push({
            metric,
            severity: this.calculateSeverity(result.confidence),
            description: result.explanation,
            recommendation: result.suggestedAction || ''
          });
        }
      });
    }

    return anomalies;
  }

  private async extractTopics(text: string) {
    // Simulated topic extraction
    const commonTopics = [
      'revenue growth',
      'market expansion',
      'operational efficiency',
      'supply chain',
      'digital transformation'
    ];

    return commonTopics.map(topic => ({
      name: topic,
      mentions: Math.floor(Math.random() * 10) + 1,
      sentiment: Math.random() * 2 - 1,
      context: [
        'Quarterly earnings call',
        'Management discussion',
        'Forward-looking statements'
      ]
    }));
  }

  private calculateKeyMetrics(data: any[]) {
    const current = data[data.length - 1];
    const previous = data[data.length - 2];

    return {
      revenue: {
        value: current.revenue,
        change: ((current.revenue - previous.revenue) / previous.revenue) * 100,
        trend: current.revenue > previous.revenue ? 'up' : 'down'
      },
      expenses: {
        value: current.expenses,
        change: ((current.expenses - previous.expenses) / previous.expenses) * 100,
        trend: current.expenses > previous.expenses ? 'up' : 'down'
      },
      margins: {
        value: (current.revenue - current.expenses) / current.revenue * 100,
        change: (
          ((current.revenue - current.expenses) / current.revenue) -
          ((previous.revenue - previous.expenses) / previous.revenue)
        ) * 100,
        trend: current.revenue / current.expenses > previous.revenue / previous.expenses ? 'up' : 'down'
      }
    };
  }

  private calculateSeverity(confidence: number): 'low' | 'medium' | 'high' {
    if (confidence > 0.8) return 'high';
    if (confidence > 0.6) return 'medium';
    return 'low';
  }

  private generateOverview(
    sentiment: EarningsSummary['sentiment'],
    trends: EarningsSummary['trends'],
    anomalies: EarningsSummary['anomalies']
  ): string {
    const sentimentText = sentiment.label === 'positive'
      ? 'shows positive indicators'
      : sentiment.label === 'negative'
      ? 'indicates challenges'
      : 'remains stable';

    const trendText = `with ${trends.pattern} patterns in key metrics`;
    
    const anomalyText = anomalies.length > 0
      ? `. Notable anomalies detected in ${anomalies.map(a => a.metric).join(', ')}`
      : '';

    return `Financial performance ${sentimentText} ${trendText}${anomalyText}.`;
  }
}