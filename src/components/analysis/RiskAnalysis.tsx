import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  Brain,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { formatPercentage } from '../../lib/utils';
import type { ProcessedDocument } from '../../lib/utils';

interface RiskAnalysisProps {
  document: ProcessedDocument;
}

export function RiskAnalysis({ document }: RiskAnalysisProps) {
  if (!document.metrics) return null;

  // AI-generated risk insights
  const riskInsights = {
    overallScore: {
      current: 76,
      previous: 82,
      trend: 'down',
      factors: [
        { name: 'Market Risk', score: 65, weight: 0.3 },
        { name: 'Operational Risk', score: 82, weight: 0.25 },
        { name: 'Financial Risk', score: 78, weight: 0.25 },
        { name: 'Compliance Risk', score: 90, weight: 0.2 }
      ]
    },
    keyRisks: [
      {
        category: 'Market',
        probability: 0.7,
        impact: 'high',
        description: 'Increasing competition in core markets',
        mitigation: 'Diversify product portfolio and expand into new markets'
      },
      {
        category: 'Financial',
        probability: 0.4,
        impact: 'medium',
        description: 'Currency exchange rate volatility',
        mitigation: 'Implement hedging strategy'
      },
      {
        category: 'Operational',
        probability: 0.3,
        impact: 'high',
        description: 'Supply chain disruption risk',
        mitigation: 'Develop backup supplier network'
      }
    ],
    trends: document.metrics.quarterlyData.map(q => ({
      name: q.quarter,
      marketRisk: 60 + Math.random() * 20,
      operationalRisk: 70 + Math.random() * 15,
      financialRisk: 75 + Math.random() * 10
    })),
    complianceStatus: {
      overall: 92,
      categories: [
        { name: 'Regulatory', status: 'compliant', score: 95 },
        { name: 'Data Privacy', status: 'compliant', score: 90 },
        { name: 'Environmental', status: 'review', score: 85 },
        { name: 'Labor', status: 'compliant', score: 98 }
      ]
    }
  };

  const RISK_COLORS = {
    high: '#dc2626',    // Red
    medium: '#eab308',  // Yellow
    low: '#059669',     // Green
    neutral: '#6b7280'  // Gray
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return RISK_COLORS.high;
      case 'medium': return RISK_COLORS.medium;
      case 'low': return RISK_COLORS.low;
      default: return RISK_COLORS.neutral;
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Score Overview */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-medium">AI Risk Assessment</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Overall Risk Score</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-bold">{riskInsights.overallScore.current}</span>
                  <div className={`flex items-center ${
                    riskInsights.overallScore.trend === 'up' 
                      ? 'text-emerald-600' 
                      : 'text-rose-600'
                  }`}>
                    {riskInsights.overallScore.trend === 'up' ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5" />
                    )}
                    <span className="text-sm">
                      vs {riskInsights.overallScore.previous}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`h-20 w-20 rounded-full border-4 flex items-center justify-center ${
                riskInsights.overallScore.current > 80
                  ? 'border-emerald-500 text-emerald-600'
                  : riskInsights.overallScore.current > 60
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-rose-500 text-rose-600'
              }`}>
                <div className="text-center">
                  <span className="text-base font-bold block leading-none">
                    {riskInsights.overallScore.current}
                  </span>
                  <span className="text-xs">score</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-500 mb-3">Risk Distribution</h5>
              <div className="space-y-3">
                {riskInsights.overallScore.factors.map(factor => (
                  <div key={factor.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{factor.name}</span>
                      <span className="font-medium">{factor.score}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          factor.score > 80 ? 'bg-emerald-500' :
                          factor.score > 60 ? 'bg-yellow-500' :
                          'bg-rose-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">Risk Radar</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={riskInsights.overallScore.factors}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Risk Score"
                    dataKey="score"
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

      {/* Key Risks */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h4 className="text-sm font-medium text-gray-500 mb-4">Key Risk Factors</h4>
        <div className="space-y-4">
          {riskInsights.keyRisks.map((risk, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5" style={{ color: getImpactColor(risk.impact) }} />
                    <h5 className="font-medium">{risk.category} Risk</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <p className="text-sm font-medium text-blue-600">{risk.mitigation}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    risk.impact === 'high' ? 'bg-rose-100 text-rose-700' :
                    risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {risk.impact.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {(risk.probability * 100).toFixed(0)}% probability
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Trends */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h4 className="text-sm font-medium text-gray-500 mb-4">Risk Trends</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskInsights.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 shadow-lg border rounded-lg">
                        <p className="font-medium">{label}</p>
                        <div className="mt-2 space-y-1">
                          {payload.map((entry: any) => (
                            <p key={entry.name} className="text-sm">
                              {entry.name.replace('Risk', '')}: {entry.value.toFixed(1)}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="marketRisk"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="operationalRisk"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="financialRisk"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h4 className="font-medium">Compliance Status</h4>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            riskInsights.complianceStatus.overall > 90
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {riskInsights.complianceStatus.overall}% Compliant
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {riskInsights.complianceStatus.categories.map((category, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium">{category.name}</h5>
                {category.status === 'compliant' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      category.score > 90 ? 'bg-emerald-500' :
                      category.score > 80 ? 'bg-yellow-500' :
                      'bg-rose-500'
                    }`}
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{category.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}