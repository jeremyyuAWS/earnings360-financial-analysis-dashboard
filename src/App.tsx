import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  TrendingUp, 
  AlertCircle, 
  FileText, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  CircleDollarSign,
  LineChart
} from 'lucide-react';
import { FileDropzone } from './components/ui/dropzone';
import { Progress } from './components/ui/progress';
import { DetailedAnalysis } from './components/analysis/DetailedAnalysis';
import { AlertsPanel } from './components/alerts/AlertsPanel';
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from './components/ui/toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { 
  formatCurrency, 
  formatPercentage,
  generateFinancialMetrics,
  simulateProcessingTime,
  type ProcessedDocument,
  generateDocumentId,
  calculateAggregateMetrics
} from './lib/utils';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUploadToast, setShowUploadToast] = useState(false);
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<ProcessedDocument | null>(null);
  const [aggregatedMetrics, setAggregatedMetrics] = useState({
    revenueGrowth: 12.5,
    profitMargin: 24.8,
    marketShare: 32.4,
    riskScore: 76,
  });

  const handleContinueToAnalysis = (document: ProcessedDocument) => {
    if (document.status === 'completed') {
      setSelectedDocument(document);
      setActiveTab('analysis');
    }
  };

  const handleFileAccepted = async (acceptedFiles: File[]) => {
    const newDocuments: ProcessedDocument[] = acceptedFiles.map(file => ({
      id: generateDocumentId(),
      filename: file.name,
      status: 'processing',
      progress: 0,
    }));

    setProcessedDocuments(prev => [...prev, ...newDocuments]);
    setShowUploadToast(true);
    setActiveTab('documents');

    for (const doc of newDocuments) {
      const processingTime = simulateProcessingTime();
      const progressInterval = setInterval(() => {
        setProcessedDocuments(prev => 
          prev.map(d => 
            d.id === doc.id
              ? { ...d, progress: Math.min(d.progress + 10, 90) }
              : d
          )
        );
      }, processingTime / 10);

      setTimeout(() => {
        clearInterval(progressInterval);
        const processedDoc = {
          ...doc,
          status: 'completed' as const,
          progress: 100,
          metrics: generateFinancialMetrics(doc.filename),
          processedAt: new Date(),
        };
        
        setProcessedDocuments(prev =>
          prev.map(d => d.id === doc.id ? processedDoc : d)
        );
      }, processingTime);
    }
  };

  const removeDocument = (id: string) => {
    setProcessedDocuments(prev => prev.filter(doc => doc.id !== id));
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
      setActiveTab('documents');
    }
  };

  const handleTabChange = (tab: string) => {
    // Reset selected document when switching away from analysis
    if (tab !== 'analysis') {
      setSelectedDocument(null);
    }
    setActiveTab(tab);
  };

  const navigateToDocument = (doc: ProcessedDocument) => {
    setSelectedDocument(doc);
    if (doc.status === 'completed') {
      setActiveTab('analysis');
    } else {
      setActiveTab('documents');
    }
  };

  useEffect(() => {
    const metrics = calculateAggregateMetrics(processedDocuments);
    if (metrics) {
      setAggregatedMetrics(metrics);
    }
  }, [processedDocuments]);

  const getBreadcrumb = () => {
    if (selectedDocument) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <button 
            onClick={() => handleTabChange('dashboard')} 
            className="hover:text-gray-700 transition-colors"
          >
            Dashboard
          </button>
          <ChevronRight className="h-4 w-4" />
          <button 
            onClick={() => {
              setSelectedDocument(null);
              handleTabChange('documents');
            }} 
            className="hover:text-gray-700 transition-colors"
          >
            Documents
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-700">{selectedDocument.filename}</span>
        </div>
      );
    }
    return null;
  };

  const isTabDisabled = (tabId: string) => {
    if (tabId === 'analysis') {
      return !selectedDocument?.status || selectedDocument.status !== 'completed';
    }
    return false;
  };

  return (
    <ToastProvider>
      {showWelcome && <WelcomeScreen onClose={() => setShowWelcome(false)} />}
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed w-64 h-full bg-white border-r border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-black rounded-lg transform rotate-45"></div>
              <div className="absolute inset-[3px] bg-white rounded transform rotate-45 flex items-center justify-center">
                <LineChart 
                  className="h-5 w-5 text-black transform -rotate-45" 
                  strokeWidth={2.5}
                />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Earnings360</h1>
              <p className="text-xs text-gray-500">A full-circle view of financial performance</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: PieChart, label: 'Dashboard' },
              { id: 'documents', icon: FileText, label: 'Documents' },
              { 
                id: 'analysis', 
                icon: TrendingUp, 
                label: 'Analysis',
                disabled: isTabDisabled('analysis')
              },
              { id: 'alerts', icon: AlertCircle, label: 'Alerts' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => !item.disabled && handleTabChange(item.id)}
                disabled={item.disabled}
                className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-gray-900 text-white font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <item.icon className={`h-5 w-5 ${
                  activeTab === item.id ? 'text-white' : 'text-gray-500'
                }`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Document Quick Access */}
          {processedDocuments.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Documents</h3>
              <div className="space-y-2">
                {processedDocuments.slice(0, 5).map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => navigateToDocument(doc)}
                    className={`w-full text-left px-2 py-1 text-sm rounded flex items-center gap-2 transition-colors ${
                      selectedDocument?.id === doc.id 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <FileText className={`h-4 w-4 ${
                      selectedDocument?.id === doc.id ? 'text-gray-900' : 'text-gray-400'
                    }`} />
                    <span className="truncate flex-1">{doc.filename}</span>
                    {doc.status === 'processing' && (
                      <Clock className="h-3 w-3 text-blue-500 animate-spin" />
                    )}
                    {doc.status === 'completed' && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="ml-64 p-8">
          {/* Breadcrumb */}
          {getBreadcrumb()}

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedDocument ? selectedDocument.filename : 'Financial Analysis Dashboard'}
              </h2>
              <p className="text-gray-500">
                {selectedDocument 
                  ? `Processed on ${selectedDocument.processedAt?.toLocaleDateString()}`
                  : 'Upload and analyze your financial documents'}
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search analysis..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <FileDropzone 
                onFileAccepted={handleFileAccepted}
                onContinueToAnalysis={() => {
                  const lastProcessedDoc = processedDocuments[processedDocuments.length - 1];
                  if (lastProcessedDoc?.status === 'completed') {
                    handleContinueToAnalysis(lastProcessedDoc);
                  }
                }}
                className="mb-6"
              />

              {/* Processing Status */}
              {processedDocuments.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Document Processing</h3>
                  <div className="space-y-4">
                    {processedDocuments.map((doc) => (
                      <div 
                        key={doc.id} 
                        className={`border border-gray-100 rounded-lg p-4 transition-colors ${
                          selectedDocument?.id === doc.id ? 'border-black bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <span className="font-medium">{doc.filename}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.status === 'completed' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-black animate-spin" />
                            )}
                            <button
                              onClick={() => removeDocument(doc.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <Progress value={doc.progress} className="mb-2" />
                        
                        {doc.status === 'completed' && doc.metrics && (
                          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Revenue</p>
                              <p className="font-semibold">{formatCurrency(doc.metrics.revenue)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Profit Margins</p>
                              <p className="font-semibold">{formatPercentage(doc.metrics.margins)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Growth Rate</p>
                              <p className="font-semibold">{formatPercentage(doc.metrics.growth)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Sentiment</p>
                              <p className="font-semibold capitalize">{doc.metrics.sentiment}</p>
                            </div>
                          </div>
                        )}

                        {/* Quick Actions */}
                        {doc.status === 'completed' && (
                          <div className="mt-4 flex gap-2">
                            <button 
                              onClick={() => handleContinueToAnalysis(doc)}
                              className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                            >
                              View Analysis
                            </button>
                            <button 
                              className="text-sm px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                            >
                              Export
                            </button>
                          </div>
                        )}

                        {/* Processing Error Handling */}
                        {doc.status === 'failed' && (
                          <div className="mt-4 flex items-center gap-2 text-red-500">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="text-sm">Processing failed. Please try again.</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && selectedDocument && (
            <DetailedAnalysis document={selectedDocument} />
          )}

          {activeTab === 'alerts' && (
            <AlertsPanel />
          )}

          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Revenue Growth', value: formatPercentage(aggregatedMetrics.revenueGrowth), trend: 'up' },
                  { label: 'Profit Margin', value: formatPercentage(aggregatedMetrics.profitMargin), trend: 'down' },
                  { label: 'Market Share', value: formatPercentage(aggregatedMetrics.marketShare), trend: 'up' },
                  { label: 'Risk Score', value: `${aggregatedMetrics.riskScore}/100`, trend: 'neutral' },
                ].map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                      ) : stat.trend === 'down' ? (
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Analysis */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Recent Analysis</h3>
                <div className="space-y-4">
                  {processedDocuments
                    .filter(doc => doc.status === 'completed')
                    .slice(0, 3)
                    .map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContinueToAnalysis(doc)}
                      >
                        <div>
                          <h4 className="font-medium text-gray-800">{doc.filename}</h4>
                          <p className="text-sm text-gray-500">
                            {doc.processedAt ? new Date(doc.processedAt).toLocaleDateString() : ''}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ToastViewport />
      {showUploadToast && (
        <Toast>
          <div className="grid gap-1">
            <ToastTitle>Files uploaded successfully</ToastTitle>
            <ToastDescription>
              Your documents have been uploaded and are being processed.
            </ToastDescription>
          </div>
          <ToastClose onClick={() => setShowUploadToast(false)} />
        </Toast>
      )}
    </ToastProvider>
  );
}

export default App;