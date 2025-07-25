import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { 
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Scale,
  Clock,
  DollarSign,
  Zap,
  Languages,
  Table,
  FileCheck
} from 'lucide-react';

interface OCRComparisonProps {
  steps: any[];
}

export function OCRComparison({ steps }: OCRComparisonProps) {
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any[]>([]);
  
  // Extract OCR-specific steps
  const ocrSteps = steps.filter(s => s.name.includes('Text Extraction'));

  // Update chart data when steps progress changes
  useEffect(() => {
    setChartData(ocrSteps.map(step => ({
      name: step.provider.replace('Text Extraction (', '').replace(')', ''),
      accuracy: step.progress === 100 ? step.confidence * 100 : 0,
      processing: step.progress < 100,
      anomalies: step.anomalies?.length || 0
    })));

    // Generate KPI data for radar chart
    setKpiData(ocrSteps.map(step => ({
      name: step.provider.replace('Text Extraction (', '').replace(')', ''),
      accuracy: step.confidence * 100,
      speed: (2000 - step.processingTime) / 20, // Normalize processing time
      costEfficiency: (1 - step.costPerPage) * 100, // Normalize cost
      layoutQuality: 75 + Math.random() * 20, // Simulated layout quality
      languageSupport: 80 + Math.random() * 15 // Simulated language support
    })));
  }, [ocrSteps]);

  const handleProviderClick = (provider: string) => {
    setExpandedProvider(expandedProvider === provider ? null : provider);
  };

  const getBarColor = (accuracy: number) => {
    if (accuracy > 90) return '#059669'; // Emerald-600
    if (accuracy > 80) return '#2563eb'; // Blue-600
    return '#eab308'; // Yellow-500
  };

  return (
    <div className="space-y-6">
      {/* Processing Timeline */}
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <h3 className="font-medium">Processing Timeline</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Zap className="h-4 w-4" />
            Real-time Progress
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
          {ocrSteps.map((step, index) => (
            <div key={step.id} className="relative pl-8 pb-6">
              <div className={`absolute left-0 w-2 h-2 rounded-full -translate-x-[3px] mt-2 ${
                step.progress === 100 
                  ? 'bg-emerald-500' 
                  : step.progress > 0 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`} />
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  step.progress === 100
                    ? 'bg-emerald-50 text-emerald-600'
                    : step.progress > 0
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-50 text-gray-400'
                }`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{step.provider}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          step.progress === 100 
                            ? 'bg-emerald-500' 
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{step.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-gray-600" />
              <h3 className="font-medium">Accuracy Comparison</h3>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                animationDuration={1000}
                animationBegin={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 shadow-lg border rounded-lg">
                          <p className="font-medium text-gray-900">{label}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              Accuracy: {data.accuracy.toFixed(1)}%
                            </p>
                            {data.anomalies > 0 && (
                              <p className="text-sm text-yellow-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {data.anomalies} issue{data.anomalies > 1 ? 's' : ''} detected
                              </p>
                            )}
                            {data.processing && (
                              <p className="text-sm text-blue-600 flex items-center gap-1">
                                <Clock className="h-3 w-3 animate-spin" />
                                Processing...
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="accuracy" 
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.processing ? '#e5e7eb' : getBarColor(entry.accuracy)}
                      className={entry.processing ? 'animate-pulse' : ''}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Radar */}
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-gray-600" />
              <h3 className="font-medium">Performance Metrics</h3>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={kpiData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Radar
                  name="Performance"
                  dataKey="accuracy"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Speed"
                  dataKey="speed"
                  stroke="#059669"
                  fill="#059669"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Cost Efficiency"
                  dataKey="costEfficiency"
                  stroke="#7c3aed"
                  fill="#7c3aed"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Provider Details */}
      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-100">
        {ocrSteps.map((step) => (
          <div key={step.id}>
            {/* Provider Header */}
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleProviderClick(step.provider)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  step.progress === 100
                    ? step.confidence > 0.9 
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-blue-50 text-blue-600'
                    : 'bg-gray-50 text-gray-600'
                }`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{step.provider}</h3>
                  <p className="text-sm text-gray-500">{step.result || 'Processing...'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {step.progress === 100 ? (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      step.confidence > 0.9 ? 'bg-emerald-100 text-emerald-700' :
                      step.confidence > 0.7 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {Math.round(step.confidence * 100)}% confident
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                      <Clock className="h-3 w-3 animate-spin" />
                      Processing
                    </span>
                  )}
                  {step.anomalies && step.anomalies.length > 0 && (
                    <div className="text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  )}
                </div>
                {expandedProvider === step.provider ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedProvider === step.provider && (
              <div className="p-4 bg-gray-50 space-y-4">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Clock className="h-4 w-4" />
                      Processing Time
                    </div>
                    <p className="text-lg font-semibold">{step.processingTime}ms</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Scale className="h-4 w-4" />
                      Accuracy
                    </div>
                    <p className="text-lg font-semibold">
                      {step.progress === 100 ? `${(step.confidence * 100).toFixed(1)}%` : 'Processing...'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <DollarSign className="h-4 w-4" />
                      Cost per Page
                    </div>
                    <p className="text-lg font-semibold">${step.costPerPage.toFixed(3)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Table className="h-4 w-4" />
                      Layout Score
                    </div>
                    <p className="text-lg font-semibold">
                      {Math.round(75 + Math.random() * 20)}%
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Languages className="h-4 w-4" />
                      Language Support
                    </div>
                    <p className="text-lg font-semibold">
                      {Math.round(80 + Math.random() * 15)} languages
                    </p>
                  </div>
                </div>

                {/* Anomalies */}
                {step.anomalies && step.anomalies.length > 0 && (
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Detected Issues</h4>
                    <div className="space-y-2">
                      {step.anomalies.map((anomaly: any, idx: number) => (
                        <div 
                          key={idx}
                          className={`flex items-start gap-2 text-sm p-2 rounded ${
                            anomaly.severity === 'high' ? 'bg-rose-50 text-rose-700' :
                            anomaly.severity === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-blue-50 text-blue-700'
                          }`}
                        >
                          <AlertTriangle className="h-4 w-4 mt-0.5" />
                          <span>{anomaly.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Text */}
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Extracted Text</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {step.result || 'Processing...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}