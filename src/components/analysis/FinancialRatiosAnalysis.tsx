import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatPercentage } from '../../lib/utils';
import type { ProcessedDocument } from '../../lib/utils';

interface FinancialRatiosAnalysisProps {
  metrics: NonNullable<ProcessedDocument['metrics']>;
}

// Professional color palette
const CHART_COLORS = [
  '#2563eb', // Blue
  '#7c3aed', // Purple
  '#059669', // Emerald
  '#0284c7', // Sky
  '#6366f1', // Indigo
];

export function FinancialRatiosAnalysis({ metrics }: FinancialRatiosAnalysisProps) {
  const ratiosData = [
    {
      name: 'Current Ratio',
      value: metrics.financialRatios.currentRatio,
      benchmark: 2,
      description: 'Ability to pay short-term obligations'
    },
    {
      name: 'Quick Ratio',
      value: metrics.financialRatios.quickRatio,
      benchmark: 1,
      description: 'Immediate ability to pay short-term obligations'
    },
    {
      name: 'Debt/Equity',
      value: metrics.financialRatios.debtToEquity,
      benchmark: 1.5,
      description: 'Financial leverage and risk'
    },
    {
      name: 'ROE',
      value: metrics.financialRatios.returnOnEquity / 100,
      benchmark: 0.15,
      description: 'Return on shareholder investment'
    },
    {
      name: 'ROA',
      value: metrics.financialRatios.returnOnAssets / 100,
      benchmark: 0.05,
      description: 'Asset utilization efficiency'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Financial Ratios</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ratiosData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 shadow-lg border border-gray-100 rounded-lg">
                      <p className="font-semibold text-gray-900">{label}</p>
                      <p className="text-sm text-gray-600 mt-1">{data.description}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Value:</span> {data.value.toFixed(2)}x
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Benchmark:</span> {data.benchmark}x
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value">
              {ratiosData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}