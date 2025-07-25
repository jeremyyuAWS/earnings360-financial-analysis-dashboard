import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatPercentage } from '../../lib/utils';
import type { ProcessedDocument } from '../../lib/utils';

interface CompetitiveAnalysisProps {
  metrics: NonNullable<ProcessedDocument['metrics']>;
}

export function CompetitiveAnalysis({ metrics }: CompetitiveAnalysisProps) {
  const competitorData = metrics.competitors.map((comp) => ({
    name: comp.name,
    marketShare: comp.marketShare,
    profitMargin: comp.profitMargin,
    peRatio: (comp.peRatio / 30) * 100, // Normalize PE ratio to percentage
    growth: Math.random() * 30 + 10, // Simulated growth rate
    efficiency: Math.random() * 40 + 60 // Simulated operational efficiency
  }));

  const metrics_normalized = {
    marketShare: metrics.competitorComparison.marketShare,
    profitMargin: metrics.margins,
    peRatio: (metrics.financialRatios.peRatio / 30) * 100,
    growth: metrics.growth,
    efficiency: 85 // Simulated
  };

  const radarData = [
    { metric: 'Market Share', A: metrics_normalized.marketShare },
    { metric: 'Profit Margin', A: metrics_normalized.profitMargin },
    { metric: 'Growth Rate', A: metrics_normalized.growth },
    { metric: 'P/E Ratio', A: metrics_normalized.peRatio },
    { metric: 'Efficiency', A: metrics_normalized.efficiency }
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Competitive Position</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#E5E5E5" />
              <PolarAngleAxis dataKey="metric" stroke="#666666" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#666666" />
              <Radar
                name="Company Metrics"
                dataKey="A"
                stroke="#000000"
                fill="#000000"
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 shadow-lg border border-gray-100">
                        <p className="font-semibold">{label}</p>
                        <p className="text-sm">
                          Value: {formatPercentage(payload[0].value)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}