import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function calculateGrowthRate(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

interface ExecutiveCompensation {
  name: string;
  title: string;
  salary: number;
  bonus: number;
  stockAwards: number;
  optionAwards: number;
  totalCompensation: number;
}

interface ESGMetrics {
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  carbonFootprint: number;
  diversityScore: number;
  boardIndependence: number;
}

interface FinancialRatios {
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  returnOnEquity: number;
  returnOnAssets: number;
  operatingMargin: number;
  peRatio: number;
  priceToBookRatio: number;
}

interface CompetitorMetrics {
  name: string;
  marketShare: number;
  revenue: number;
  profitMargin: number;
  peRatio: number;
}

// Simulated document processing utilities
export function generateFinancialMetrics(filename: string) {
  const baseRevenue = Math.random() * 1000000000 + 500000000;
  const baseProfit = baseRevenue * (Math.random() * 0.3 + 0.1);
  const baseGrowth = Math.random() * 20 - 5;
  
  const executiveCompensation: ExecutiveCompensation[] = [
    {
      name: "John Smith",
      title: "CEO",
      salary: 1200000,
      bonus: 2500000,
      stockAwards: 5000000,
      optionAwards: 3000000,
      totalCompensation: 11700000
    },
    {
      name: "Sarah Johnson",
      title: "CFO",
      salary: 800000,
      bonus: 1500000,
      stockAwards: 2500000,
      optionAwards: 1500000,
      totalCompensation: 6300000
    },
    {
      name: "Michael Chen",
      title: "COO",
      salary: 750000,
      bonus: 1200000,
      stockAwards: 2000000,
      optionAwards: 1200000,
      totalCompensation: 5150000
    }
  ];

  const esgMetrics: ESGMetrics = {
    environmentalScore: Math.random() * 40 + 60,
    socialScore: Math.random() * 30 + 65,
    governanceScore: Math.random() * 25 + 70,
    carbonFootprint: Math.random() * 1000000 + 500000,
    diversityScore: Math.random() * 30 + 65,
    boardIndependence: Math.random() * 20 + 75
  };

  const financialRatios: FinancialRatios = {
    currentRatio: Math.random() * 1 + 1.5,
    quickRatio: Math.random() * 0.8 + 0.8,
    debtToEquity: Math.random() * 0.8 + 0.4,
    returnOnEquity: Math.random() * 15 + 10,
    returnOnAssets: Math.random() * 8 + 5,
    operatingMargin: Math.random() * 15 + 10,
    peRatio: Math.random() * 20 + 15,
    priceToBookRatio: Math.random() * 3 + 2
  };

  const competitors: CompetitorMetrics[] = [
    {
      name: "Company A",
      marketShare: Math.random() * 15 + 10,
      revenue: baseRevenue * (Math.random() * 0.5 + 0.75),
      profitMargin: Math.random() * 10 + 8,
      peRatio: Math.random() * 15 + 18
    },
    {
      name: "Company B",
      marketShare: Math.random() * 12 + 8,
      revenue: baseRevenue * (Math.random() * 0.4 + 0.6),
      profitMargin: Math.random() * 8 + 7,
      peRatio: Math.random() * 12 + 16
    },
    {
      name: "Company C",
      marketShare: Math.random() * 10 + 5,
      revenue: baseRevenue * (Math.random() * 0.3 + 0.4),
      profitMargin: Math.random() * 6 + 6,
      peRatio: Math.random() * 10 + 14
    }
  ];
  
  return {
    revenue: baseRevenue,
    profit: baseProfit,
    margins: (baseProfit / baseRevenue) * 100,
    growth: baseGrowth,
    keyMetrics: {
      operatingExpenses: baseRevenue * (Math.random() * 0.4 + 0.3),
      cashFlow: baseProfit * (Math.random() * 0.8 + 0.4),
      debtRatio: Math.random() * 0.5 + 0.2,
      employeeCount: Math.floor(Math.random() * 50000) + 10000,
      customerCount: Math.floor(Math.random() * 1000000) + 100000,
      marketSize: baseRevenue * (Math.random() * 10 + 5),
    },
    quarterlyData: Array.from({ length: 8 }, (_, i) => ({
      quarter: `Q${i % 4 + 1} ${Math.floor(i / 4) + 2023}`,
      revenue: baseRevenue * (1 + (Math.random() * 0.4 - 0.2)),
      profit: baseProfit * (1 + (Math.random() * 0.4 - 0.2)),
      growth: baseGrowth + (Math.random() * 10 - 5),
      eps: (baseProfit / 1000000) * (1 + (Math.random() * 0.4 - 0.2))
    })),
    riskFactors: [
      'Market volatility',
      'Supply chain disruptions',
      'Regulatory changes',
      'Competition pressure',
      'Technology disruption',
      'Economic uncertainty',
      'Cybersecurity threats',
      'Talent retention',
      'ESG compliance',
      'Geopolitical risks'
    ].slice(0, Math.floor(Math.random() * 3) + 4),
    sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
    competitorComparison: {
      marketShare: Math.random() * 30 + 10,
      growthRank: Math.floor(Math.random() * 5) + 1,
      profitabilityRank: Math.floor(Math.random() * 5) + 1
    },
    executiveCompensation,
    esgMetrics,
    financialRatios,
    competitors,
    segmentData: [
      { name: 'Product A', value: baseRevenue * 0.4, growth: Math.random() * 20 + 5 },
      { name: 'Product B', value: baseRevenue * 0.3, growth: Math.random() * 15 + 3 },
      { name: 'Product C', value: baseRevenue * 0.2, growth: Math.random() * 10 + 2 },
      { name: 'Other', value: baseRevenue * 0.1, growth: Math.random() * 5 + 1 }
    ]
  };
}

export function simulateProcessingTime(): number {
  return Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
}

export interface ProcessedDocument {
  id: string;
  filename: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  metrics?: ReturnType<typeof generateFinancialMetrics>;
  processedAt?: Date;
}

export function generateDocumentId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function calculateAggregateMetrics(documents: ProcessedDocument[]) {
  const completedDocs = documents.filter(doc => doc.status === 'completed' && doc.metrics);
  if (completedDocs.length === 0) return null;

  const totals = completedDocs.reduce((acc, doc) => {
    const metrics = doc.metrics!;
    return {
      revenue: acc.revenue + metrics.revenue,
      profit: acc.profit + metrics.profit,
      growth: acc.growth + metrics.growth,
      marketShare: acc.marketShare + metrics.competitorComparison.marketShare
    };
  }, { revenue: 0, profit: 0, growth: 0, marketShare: 0 });

  return {
    revenueGrowth: totals.growth / completedDocs.length,
    profitMargin: (totals.profit / totals.revenue) * 100,
    marketShare: totals.marketShare / completedDocs.length,
    riskScore: Math.floor(Math.random() * 30) + 60
  };
}