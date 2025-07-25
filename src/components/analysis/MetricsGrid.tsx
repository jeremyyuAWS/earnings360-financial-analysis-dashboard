import React from 'react';
import { Users, ShoppingCart, TrendingUp, Scale } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import type { ProcessedDocument } from '../../lib/utils';

interface MetricsGridProps {
  document: ProcessedDocument;
}

export function MetricsGrid({ document }: MetricsGridProps) {
  if (!document.metrics) return null;

  const { keyMetrics, competitorComparison } = document.metrics;

  const metrics = [
    {
      label: 'Employees',
      value: keyMetrics.employeeCount.toLocaleString(),
      icon: Users,
      trend: 'up',
      subtitle: 'Total Workforce'
    },
    {
      label: 'Customers',
      value: keyMetrics.customerCount.toLocaleString(),
      icon: ShoppingCart,
      trend: 'up',
      subtitle: 'Active Accounts'
    },
    {
      label: 'Market Size',
      value: formatCurrency(keyMetrics.marketSize),
      icon: TrendingUp,
      trend: 'neutral',
      subtitle: 'Total Addressable Market'
    },
    {
      label: 'Market Share',
      value: formatPercentage(competitorComparison.marketShare),
      icon: Scale,
      trend: competitorComparison.marketShare > 20 ? 'up' : 'down',
      subtitle: 'Industry Position'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg border border-gray-100 p-4 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {metric.label}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                {metric.subtitle}
              </span>
            </div>
            <metric.icon 
              className={`h-5 w-5 ${
                metric.trend === 'up' 
                  ? 'text-emerald-600' 
                  : metric.trend === 'down' 
                  ? 'text-rose-600' 
                  : 'text-gray-600'
              }`} 
            />
          </div>
          <div className="mt-1">
            <span className="text-2xl font-semibold text-gray-900 tracking-tight">
              {metric.value}
            </span>
          </div>
          <div className="mt-2 flex items-center">
            {metric.trend === 'up' && (
              <span className="text-xs font-medium text-emerald-600">↑ Increasing</span>
            )}
            {metric.trend === 'down' && (
              <span className="text-xs font-medium text-rose-600">↓ Decreasing</span>
            )}
            {metric.trend === 'neutral' && (
              <span className="text-xs font-medium text-gray-600">→ Stable</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}