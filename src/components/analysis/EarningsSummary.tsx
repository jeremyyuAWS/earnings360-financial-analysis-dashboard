import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  MessageSquare,
  BarChart,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Target,
  LineChart,
  Zap,
  ChevronRight,
  PieChart,
  DollarSign,
  Scale,
  Users,
  Building2
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import type { ProcessedDocument } from '../../lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface EarningsSummaryProps {
  document: ProcessedDocument;
}

export function EarningsSummary({ document }: EarningsSummaryProps) {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'margins' | 'growth'>('revenue');
  const [selectedPeriod, setSelectedPeriod] = useState<'quarterly' | 'annual'>('quarterly');

  if (!document.metrics) return null;

  const { metrics } = document;

  const sentimentColor = 
    metrics.sentiment === 'positive' ? 'text-emerald-600' :
    metrics.sentiment === 'negative' ? 'text-rose-600' :
    'text-blue-600';

  // Generate AI insights
  const aiInsights = {
    performance: [
      {
        title: "Revenue Growth",
        value: formatPercentage(metrics.growth),
        change: `+${formatPercentage(metrics.growth - 8.5)} vs Industry`,
        analysis: "Outperforming sector average, driven by strong product adoption"
      },
      {
        title: "Profit Margins",
        value: formatPercentage(metrics.margins),
        change: `${metrics.margins > 20 ? '+' : '-'}${formatPercentage(Math.abs(metrics.margins - 20))} vs Target`,
        analysis: "Margin expansion through operational efficiency initiatives"
      },
      {
        title: "Market Share",
        value: formatPercentage(metrics.competitorComparison.marketShare),
        change: `Rank #${metrics.competitorComparison.growthRank} in sector`,
        analysis: "Gaining market share in key segments"
      }
    ],
    segmentAnalysis: metrics.segmentData.map(segment => ({
      name: segment.name,
      contribution: (segment.value / metrics.revenue) * 100,
      growth: segment.growth,
      potential: segment.growth > 15 ? 'High' : segment.growth > 10 ? 'Medium' : 'Low'
    })),
    keyDrivers: [
      {
        metric: "Customer Acquisition",
        value: formatPercentage(15 + Math.random() * 10),
        impact: "Positive",
        details: "Strong growth in enterprise segment"
      },
      {
        metric: "Product Mix",
        value: formatPercentage(20 + Math.random() * 15),
        impact: "Positive",
        details: "Higher margin products gaining share"
      },
      {
        metric: "Operating Leverage",
        value: formatPercentage(10 + Math.random() * 8),
        impact: "Positive",
        details: "Improved cost structure"
      }
    ]
  };

  // Prepare chart data
  const trendData = metrics.quarterlyData.map(q => ({
    name: q.quarter,
    revenue: q.revenue,
    profit: q.revenue * (metrics.margins / 100),
    growth: q.growth
  }));

  const competitiveData = [
    { metric: 'Market Share', value: metrics.competitorComparison.marketShare },
    { metric: 'Revenue Growth', value: metrics.growth },
    { metric: 'Profit Margin', value: metrics.margins },
    { metric: 'Customer Growth', value: 25 + Math.random() * 15 },
    { metric: 'Innovation Score', value: 70 + Math.random() * 20 }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">AI-Generated Executive Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiInsights.performance.map((insight, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-500">{insight.title}</h4>
                <span className={`text-sm font-medium ${
                  insight.change.includes('+') ? 'text-emerald-600' : 'text-gray-600'
                }`}>
                  {insight.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{insight.value}</p>
              <p className="text-sm text-gray-600">{insight.analysis}</p>
            </div>
          ))}
        </div>

        {/* Trend Chart */}
        <div className="mt-6 h-64">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-gray-500" />
              <h4 className="font-medium">Performance Trends</h4>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="text-sm border rounded-lg px-2 py-1"
              >
                <option value="revenue">Revenue</option>
                <option value="margins">Margins</option>
                <option value="growth">Growth</option>
              </select>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="text-sm border rounded-lg px-2 py-1"
              >
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 shadow-lg border rounded-lg">
                        <p className="font-medium">{label}</p>
                        {payload.map((entry: any) => (
                          <p key={entry.name} className="text-sm">
                            {entry.name}: {
                              typeof entry.value === 'number'
                                ? entry.name === 'growth'
                                  ? formatPercentage(entry.value)
                                  : formatCurrency(entry.value)
                                : entry.value
                            }
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segment Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-medium">Segment Performance</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {aiInsights.segmentAnalysis.map((segment, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{segment.name}</h4>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    segment.potential === 'High'
                      ? 'bg-emerald-100 text-emerald-700'
                      : segment.potential === 'Medium'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {segment.potential} Potential
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Contribution</p>
                    <p className="font-medium">{formatPercentage(segment.contribution)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Growth</p>
                    <p className="font-medium">{formatPercentage(segment.growth)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-medium mb-4">Competitive Position</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={competitiveData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Company"
                    dataKey="value"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Drivers */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-medium">Key Performance Drivers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiInsights.keyDrivers.map((driver, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {index === 0 && <Users className="h-5 w-5 text-blue-600" />}
                {index === 1 && <Building2 className="h-5 w-5 text-purple-600" />}
                {index === 2 && <Scale className="h-5 w-5 text-emerald-600" />}
                <h4 className="font-medium">{driver.metric}</h4>
              </div>
              <p className="text-2xl font-bold mb-2">{driver.value}</p>
              <p className="text-sm text-gray-600">{driver.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}