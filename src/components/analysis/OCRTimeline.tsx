import React from 'react';
import { Progress } from '../ui/progress';
import {
  FileText,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Scale,
  DollarSign,
  Languages
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface OCRTimelineProps {
  steps: any[];
}

export function OCRTimeline({ steps }: OCRTimelineProps) {
  // Filter OCR-specific steps
  const ocrSteps = steps.filter(s => s.name.includes('Text Extraction'));

  // Add provider name abbreviations
  const getProviderAbbr = (name: string): string => {
    const map: Record<string, string> = {
      'Amazon Textract': 'AWS',
      'Google Vision AI': 'GCP',
      'Azure Computer Vision': 'Azure',
      'Tesseract OCR': 'Tess',
      'ABBYY FineReader': 'ABBYY'
    };
    
    return map[name] || name;
  };

  // Calculate metrics with abbreviated names
  const metrics = ocrSteps.map(step => ({
    name: getProviderAbbr(step.provider.replace('Text Extraction (', '').replace(')', '')),
    fullName: step.provider,
    accuracy: step.progress === 100 ? step.confidence * 100 : 0,
    speed: step.processingTime ? (2000 - step.processingTime) / 20 : 0,
    cost: step.costPerPage ? (1 - step.costPerPage) * 100 : 0,
    progress: step.progress
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = metrics.find(m => m.name === label);
      return (
        <div className="bg-white p-3 shadow-lg border rounded-lg">
          <p className="font-medium text-gray-900">{data?.fullName}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any) => (
              <p key={entry.dataKey} className="text-sm">
                {entry.dataKey === 'accuracy' && 'Accuracy: '}
                {entry.dataKey === 'speed' && 'Processing Speed: '}
                {entry.dataKey === 'cost' && 'Cost Efficiency: '}
                {entry.value.toFixed(1)}%
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (progress: number, confidence: number) => {
    if (progress < 100) return 'bg-blue-500';
    if (confidence > 0.9) return 'bg-emerald-500';
    if (confidence > 0.7) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Scale className="h-4 w-4" />
            Average Accuracy
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics} margin={{ top: 5, right: 5, bottom: 25, left: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  height={40}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={CustomTooltip} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Clock className="h-4 w-4" />
            Processing Speed
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics} margin={{ top: 5, right: 5, bottom: 25, left: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  height={40}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={CustomTooltip} />
                <Bar dataKey="speed" fill="#059669">
                  {metrics.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.progress < 100 ? '#e5e7eb' : '#059669'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <DollarSign className="h-4 w-4" />
            Cost Efficiency
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics} margin={{ top: 5, right: 5, bottom: 25, left: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  height={40}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={CustomTooltip} />
                <Bar dataKey="cost" fill="#7c3aed">
                  {metrics.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.progress < 100 ? '#e5e7eb' : '#7c3aed'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />
        
        {ocrSteps.map((step, index) => (
          <div key={step.id} className="relative pl-8 pb-6">
            {/* Timeline Node */}
            <div 
              className={`absolute left-8 w-4 h-4 rounded-full -translate-x-[8px] mt-2 ${
                getStatusColor(step.progress, step.confidence || 0)
              }`}
            />
            
            <div className="flex items-start gap-4">
              {/* Provider Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${
                    step.progress === 100
                      ? step.confidence > 0.9 
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-blue-50 text-blue-600'
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{step.provider}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {step.progress === 100 ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress and Metrics */}
                <div className="space-y-3">
                  <Progress 
                    value={step.progress} 
                    className="h-1"
                  />
                  
                  {step.progress === 100 && (
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Scale className="h-3 w-3" />
                          Accuracy
                        </div>
                        <p className="text-sm font-medium mt-1">
                          {(step.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          Speed
                        </div>
                        <p className="text-sm font-medium mt-1">
                          {step.processingTime}ms
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <DollarSign className="h-3 w-3" />
                          Cost
                        </div>
                        <p className="text-sm font-medium mt-1">
                          ${step.costPerPage.toFixed(3)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Anomalies */}
                  {step.anomalies && step.anomalies.length > 0 && (
                    <div className="mt-2">
                      {step.anomalies.map((anomaly: any, idx: number) => (
                        <div 
                          key={idx}
                          className={`flex items-start gap-2 text-sm p-2 rounded mt-2 ${
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
                  )}
                </div>
              </div>

              {/* Results Preview */}
              {step.progress === 100 && (
                <div className="w-64 bg-gray-50 p-3 rounded text-sm">
                  <h5 className="font-medium mb-1">Extracted Data</h5>
                  <p className="text-gray-600">{step.result}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}