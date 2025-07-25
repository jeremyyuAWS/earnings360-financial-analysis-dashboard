interface AnomalyDetectionResult {
  isAnomaly: boolean;
  confidence: number;
  explanation: string;
  suggestedAction?: string;
}

export class AnomalyDetector {
  private readonly zScoreThreshold = 2.5;
  private readonly confidenceThreshold = 0.8;

  detectAnomalies(data: number[]): AnomalyDetectionResult[] {
    const mean = this.calculateMean(data);
    const stdDev = this.calculateStandardDeviation(data, mean);
    
    return data.map(value => {
      const zScore = Math.abs((value - mean) / stdDev);
      const isAnomaly = zScore > this.zScoreThreshold;
      
      return {
        isAnomaly,
        confidence: this.calculateConfidence(zScore),
        explanation: this.generateExplanation(value, mean, stdDev, zScore),
        suggestedAction: isAnomaly ? this.suggestAction(value, mean) : undefined
      };
    });
  }

  private calculateMean(data: number[]): number {
    return data.reduce((sum, value) => sum + value, 0) / data.length;
  }

  private calculateStandardDeviation(data: number[], mean: number): number {
    const variance = data.reduce((sum, value) => 
      sum + Math.pow(value - mean, 2), 0
    ) / data.length;
    return Math.sqrt(variance);
  }

  private calculateConfidence(zScore: number): number {
    return Math.min(1, Math.abs(zScore) / this.zScoreThreshold);
  }

  private generateExplanation(value: number, mean: number, stdDev: number, zScore: number): string {
    const deviation = ((value - mean) / mean * 100).toFixed(1);
    const direction = value > mean ? 'above' : 'below';
    
    if (zScore > this.zScoreThreshold) {
      return `Value deviates ${deviation}% ${direction} the mean, which is statistically significant`;
    }
    return `Value is within normal range, ${deviation}% ${direction} the mean`;
  }

  private suggestAction(value: number, mean: number): string {
    if (value > mean) {
      return 'Investigate potential factors contributing to this unusual increase';
    }
    return 'Review possible causes for this significant decrease';
  }
}