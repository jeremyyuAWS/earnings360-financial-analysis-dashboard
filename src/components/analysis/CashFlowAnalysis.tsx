import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../lib/utils';
import type { ProcessedDocument } from '../../lib/utils';

interface CashFlowAnalysisProps {
  metrics: NonNullable<ProcessedDocument['metrics']>;
}

export function CashFlowAnalysis({ metrics }: CashFlowAnalysisProps) {
  const cashFlowData = metrics.quarterlyData.map((quarter) => ({
    name: quarter.quarter,
    operatingCashFlow: quarter.revenue * (Math.random() * 0.2 + 0.1),
    investingCashFlow: -quarter.revenue * (Math.random() * 0.15),
    financingCashFlow: quarter.revenue * (Math.random() * 0.1 - 0.05)
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Cash Flow Analysis</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={cashFlowData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 shadow-lg border border-gray-100 rounded-lg">
                      <p className="font-semibold text-gray-900">{label}</p>
                      <div className="mt-2 space-y-1">
                        {payload.map((entry: any) => (
                          <p key={entry.name} className="text-sm flex items-center">
                            <span
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-gray-600">{entry.name}:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {formatCurrency(entry.value)}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="operatingCashFlow"
              stackId="1"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.3}
              name="Operating Cash Flow"
            />
            <Area
              type="monotone"
              dataKey="investingCashFlow"
              stackId="1"
              stroke="#7c3aed"
              fill="#7c3aed"
              fillOpacity={0.3}
              name="Investing Cash Flow"
            />
            <Area
              type="monotone"
              dataKey="financingCashFlow"
              stackId="1"
              stroke="#059669"
              fill="#059669"
              fillOpacity={0.3}
              name="Financing Cash Flow"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}