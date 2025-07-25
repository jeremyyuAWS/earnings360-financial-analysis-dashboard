import { detectPatterns, detectAnomalies } from './trendAnalysis';

interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
}

interface ForecastResult {
  forecast: TimeSeriesPoint[];
  confidence: number;
  trend: string;
  seasonality: boolean;
  anomalies: TimeSeriesPoint[];
}

export class TimeSeriesAnalyzer {
  private data: TimeSeriesPoint[];
  private windowSize: number;

  constructor(data: TimeSeriesPoint[], windowSize = 4) {
    this.data = data;
    this.windowSize = windowSize;
  }

  async generateForecast(periods: number): Promise<ForecastResult> {
    // Extract numerical values for analysis
    const values = this.data.map(point => point.value);
    
    // Detect patterns and anomalies
    const patterns = detectPatterns(values);
    const anomalies = detectAnomalies(values);
    
    // Calculate moving averages
    const movingAverages = this.calculateMovingAverage(values);
    
    // Generate forecast points
    const forecast = this.generateForecastPoints(movingAverages, periods);
    
    // Calculate confidence based on historical accuracy
    const confidence = this.calculateConfidence(values, movingAverages);
    
    // Detect seasonality
    const seasonality = this.detectSeasonality(values);
    
    return {
      forecast,
      confidence,
      trend: patterns.pattern,
      seasonality,
      anomalies: anomalies.map((value, index) => ({
        timestamp: this.data[index].timestamp,
        value
      }))
    };
  }

  private calculateMovingAverage(values: number[]): number[] {
    const result: number[] = [];
    for (let i = this.windowSize - 1; i < values.length; i++) {
      const sum = values.slice(i - this.windowSize + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / this.windowSize);
    }
    return result;
  }

  private generateForecastPoints(movingAverages: number[], periods: number): TimeSeriesPoint[] {
    const lastDate = this.data[this.data.length - 1].timestamp;
    const forecast: TimeSeriesPoint[] = [];
    
    // Use exponential smoothing for forecasting
    let lastValue = movingAverages[movingAverages.length - 1];
    const alpha = 0.3; // smoothing factor
    
    for (let i = 1; i <= periods; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setMonth(nextDate.getMonth() + i);
      
      // Calculate next value using exponential smoothing
      lastValue = this.calculateNextValue(lastValue, movingAverages, alpha);
      
      forecast.push({
        timestamp: nextDate,
        value: lastValue
      });
    }
    
    return forecast;
  }

  private calculateNextValue(lastValue: number, historicalValues: number[], alpha: number): number {
    const trend = this.calculateTrend(historicalValues);
    const seasonal = this.calculateSeasonalFactor(historicalValues);
    return lastValue * (1 + trend) * seasonal;
  }

  private calculateTrend(values: number[]): number {
    const recentValues = values.slice(-this.windowSize);
    const averageChange = recentValues.reduce((acc, val, i) => {
      if (i === 0) return acc;
      return acc + (val - recentValues[i - 1]) / recentValues[i - 1];
    }, 0) / (recentValues.length - 1);
    
    return averageChange;
  }

  private calculateSeasonalFactor(values: number[]): number {
    // Simplified seasonal factor calculation
    const seasonalPeriod = 4; // quarters
    const seasonalFactors = new Array(seasonalPeriod).fill(0);
    let count = new Array(seasonalPeriod).fill(0);
    
    values.forEach((value, index) => {
      const season = index % seasonalPeriod;
      seasonalFactors[season] += value;
      count[season]++;
    });
    
    const averageSeasonalFactor = seasonalFactors.map((total, i) => 
      total / count[i] / (values.reduce((a, b) => a + b, 0) / values.length)
    );
    
    return averageSeasonalFactor[values.length % seasonalPeriod];
  }

  private calculateConfidence(actual: number[], predicted: number[]): number {
    // Calculate MAPE (Mean Absolute Percentage Error)
    const errors = actual.slice(this.windowSize).map((value, index) => 
      Math.abs((value - predicted[index]) / value)
    );
    
    const mape = errors.reduce((a, b) => a + b, 0) / errors.length;
    return Math.max(0, 1 - mape); // Convert to confidence score
  }

  private detectSeasonality(values: number[]): boolean {
    // Implement autocorrelation analysis
    const lag = 4; // quarters
    const correlations = this.calculateAutocorrelation(values, lag);
    return Math.abs(correlations[lag - 1]) > 0.7;
  }

  private calculateAutocorrelation(values: number[], lag: number): number[] {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    
    return Array.from({ length: lag }, (_, k) => {
      const correlation = values.slice(0, -k - 1).reduce((acc, val, i) => 
        acc + (val - mean) * (values[i + k + 1] - mean), 0
      );
      return correlation / variance;
    });
  }
}