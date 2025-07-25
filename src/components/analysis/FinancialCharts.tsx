import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import type { ProcessedDocument } from '../../lib/utils';

interface FinancialChartsProps {
  document: ProcessedDocument;
}

// Professional color palette with more vibrancy
const CHART_COLORS = {
  primary: '#2563eb',    // Rich blue
  secondary: '#3b82f6',  // Lighter blue
  tertiary: '#60a5fa',   // Sky blue
  accent1: '#7c3aed',    // Purple
  accent2: '#8b5cf6',    // Lighter purple
  accent3: '#a78bfa',    // Lavender
  success: '#059669',    // Emerald
  warning: '#d97706',    // Amber
  error: '#dc2626',      // Red
  neutral: '#6b7280',    // Gray
};

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.accent1,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.tertiary,
  CHART_COLORS.accent3,
];

export function FinancialCharts({ document }: FinancialChartsProps) {
  if (!document.metrics) return null;

  const { quarterlyData, segmentData, esgMetrics, executiveCompensation, competitors, financialRatios } = document.metrics;

  const esgData = [
    { name: 'Environmental', value: esgMetrics.environmentalScore },
    { name: 'Social', value: esgMetrics.socialScore },
    { name: 'Governance', value: esgMetrics.governanceScore }
  ];

  const competitorData = competitors.map(comp => ({
    name: comp.name,
    marketShare: comp.marketShare,
    profitMargin: comp.profitMargin,
    peRatio: comp.peRatio
  }));

  const ratiosData = [
    { metric: 'Current Ratio', value: financialRatios.currentRatio },
    { metric: 'Quick Ratio', value: financialRatios.quickRatio },
    { metric: 'Debt to Equity', value: financialRatios.debtToEquity },
    { metric: 'ROE', value: financialRatios.returnOnEquity / 100 },
    { metric: 'ROA', value: financialRatios.returnOnAssets / 100 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg border border-gray-100 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-gray-600">
              {entry.name}: {typeof entry.value === 'number' ? 
                entry.value.toLocaleString(undefined, {
                  style: entry.name.toLowerCase().includes('ratio') ? 'decimal' : 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-base font-medium mb-4">Revenue & EPS Trends</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="quarter" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                height={50}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                yAxisId="left" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value, true)}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                dot={false}
                name="Revenue"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="eps"
                stroke={CHART_COLORS.accent1}
                strokeWidth={2}
                dot={false}
                name="EPS"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-medium mb-4">Executive Compensation Breakdown</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={executiveCompensation}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="salary" stackId="a" fill={CHART_COLORS.primary} name="Salary" />
              <Bar dataKey="bonus" stackId="a" fill={CHART_COLORS.secondary} name="Bonus" />
              <Bar dataKey="stockAwards" stackId="a" fill={CHART_COLORS.tertiary} name="Stock Awards" />
              <Bar dataKey="optionAwards" stackId="a" fill={CHART_COLORS.accent3} name="Option Awards" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-medium mb-4">ESG Performance</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={esgData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Radar
                name="ESG Score"
                dataKey="value"
                stroke={CHART_COLORS.primary}
                fill={CHART_COLORS.primary}
                fillOpacity={0.3}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-medium mb-4">Revenue by Segment</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              >
                {segmentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-medium mb-4">Competitor Analysis</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={competitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="marketShare" fill={CHART_COLORS.primary} name="Market Share %" />
              <Bar dataKey="profitMargin" fill={CHART_COLORS.accent1} name="Profit Margin %" />
              <Bar dataKey="peRatio" fill={CHART_COLORS.success} name="P/E Ratio" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-medium mb-4">Key Financial Ratios</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratiosData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis dataKey="metric" type="category" width={100} stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={CHART_COLORS.primary}>
                {ratiosData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}