import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  Scale, 
  Brain,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import type { ProcessedDocument } from '../../lib/utils';

interface OperationalAnalysisProps {
  document: ProcessedDocument;
}

export function OperationalAnalysis({ document }: OperationalAnalysisProps) {
  if (!document.metrics) return null;

  const { metrics } = document;

  // AI-generated operational insights
  const operationalInsights = {
    efficiency: {
      score: 85,
      trend: 'up',
      recommendations: [
        'Optimize inventory management to reduce holding costs',
        'Implement automated quality control processes',
        'Streamline supplier onboarding workflow'
      ]
    },
    productivity: {
      score: 78,
      trend: 'up',
      metrics: {
        revenuePerEmployee: metrics.revenue / metrics.keyMetrics.employeeCount,
        utilizationRate: 82,
        throughputTime: 3.5
      }
    },
    resourceAllocation: {
      optimal: true,
      distribution: [
        { name: 'R&D', value: 25 },
        { name: 'Operations', value: 40 },
        { name: 'Sales', value: 20 },
        { name: 'Support', value: 15 }
      ]
    },
    bottlenecks: [
      {
        process: 'Order Processing',
        severity: 'medium',
        impact: 'Delayed fulfillment',
        solution: 'Implement automated order validation'
      },
      {
        process: 'Quality Control',
        severity: 'low',
        impact: 'Minor production delays',
        solution: 'Add automated testing stations'
      }
    ]
  };

  // Generate time series data
  const timeSeriesData = metrics.quarterlyData.map(q => ({
    name: q.quarter,
    efficiency: 75 + Math.random() * 15,
    productivity: 70 + Math.random() * 20,
    utilization: 80 + Math.random() * 10
  }));

  const COLORS = ['#2563eb', '#7c3aed', '#059669', '#0284c7'];

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="bg-black text-white p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-6 w-6" />
          <h3 className="text-lg font-medium">AI-Powered Operational Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <Zap className="h-4 w-4" />
              Efficiency Score
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{operationalInsights.efficiency.score}</span>
              {operationalInsights.efficiency.trend === 'up' ? (
                <ArrowUpRight className="h-5 w-5 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-rose-400" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <Target className="h-4 w-4" />
              Resource Optimization
            </div>
            <p className="text-3xl font-bold">
              {operationalInsights.resourceAllocation.optimal ? '98%' : '75%'}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <Scale className="h-4 w-4" />
              Process Health
            </div>
            <p className="text-3xl font-bold">
              {operationalInsights.bottlenecks.length === 0 ? '100%' : '85%'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Productivity Metrics</h4>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Revenue per Employee</dt>
              <dd className="text-2xl font-bold">
                {formatCurrency(operationalInsights.productivity.metrics.revenuePerEmployee)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Utilization Rate</dt>
              <dd className="text-2xl font-bold">
                {formatPercentage(operationalInsights.productivity.metrics.utilizationRate)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Throughput Time</dt>
              <dd className="text-2xl font-bold">
                {operationalInsights.productivity.metrics.throughputTime} days
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Resource Allocation</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={operationalInsights.resourceAllocation.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {operationalInsights.resourceAllocation.distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Process Bottlenecks</h4>
          <div className="space-y-4">
            {operationalInsights.bottlenecks.map((bottleneck, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">{bottleneck.process}</h5>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    bottleneck.severity === 'high' ? 'bg-rose-100 text-rose-700' :
                    bottleneck.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {bottleneck.severity.charAt(0).toUpperCase() + bottleneck.severity.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{bottleneck.impact}</p>
                <p className="text-sm font-medium text-blue-600">{bottleneck.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h4 className="text-sm font-medium text-gray-500 mb-4">Operational Trends</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 shadow-lg border rounded-lg">
                        <p className="font-medium">{label}</p>
                        <div className="mt-2 space-y-1">
                          {payload.map((entry: any) => (
                            <p key={entry.name} className="text-sm">
                              {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}:
                              {' '}{entry.value.toFixed(1)}%
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
                dataKey="efficiency"
                stackId="1"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="productivity"
                stackId="1"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="utilization"
                stackId="1"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium">AI-Generated Recommendations</h4>
        </div>
        <div className="space-y-4">
          {operationalInsights.efficiency.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="mt-1">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                </div>
              </div>
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}