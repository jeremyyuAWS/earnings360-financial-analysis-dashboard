import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  FileSearch,
  LineChart,
  AlertTriangle,
  Gauge,
  ArrowRight,
  ArrowLeft,
  X,
  Zap,
  Scale,
  Clock,
  DollarSign,
  CheckCircle2,
  Network,
  Sparkles,
  Bot,
  Lock,
  TrendingUp,
  Fingerprint,
  BarChart,
  MessagesSquare
} from 'lucide-react';

interface WelcomeScreenProps {
  onClose: () => void;
}

const features = [
  {
    Icon: Brain,
    title: "Multi-Provider OCR Intelligence",
    description: "Our advanced AI orchestrator automatically compares and selects the best OCR provider for your documents, ensuring maximum accuracy and efficiency.",
    benefits: [
      "Real-time accuracy comparison across providers",
      "Automated provider selection based on document type",
      "Cost-efficiency optimization"
    ],
    metrics: [
      {
        icon: Zap,
        label: "Accuracy",
        value: "Up to 98%",
        color: "text-blue-500"
      },
      {
        icon: Clock,
        label: "Processing Speed",
        value: "800ms avg",
        color: "text-emerald-500"
      },
      {
        icon: Scale,
        label: "Error Rate",
        value: "< 0.1%",
        color: "text-purple-500"
      },
      {
        icon: DollarSign,
        label: "Cost Savings",
        value: "Up to 40%",
        color: "text-amber-500"
      }
    ],
    providers: [
      { name: "Amazon Textract", accuracy: 96, speed: 92 },
      { name: "Google Vision AI", accuracy: 95, speed: 94 },
      { name: "Azure Vision", accuracy: 94, speed: 90 },
      { name: "Tesseract", accuracy: 88, speed: 85 }
    ],
    color: "bg-blue-500"
  },
  {
    Icon: LineChart,
    title: "Intelligent Financial Insights",
    description: "Get deep, AI-driven insights into your company's financial performance with automated trend analysis and forecasting.",
    benefits: [
      "Real-time performance metrics",
      "Predictive analytics and forecasting",
      "Competitive benchmarking"
    ],
    color: "bg-emerald-500"
  },
  {
    Icon: Gauge,
    title: "Operational Excellence",
    description: "Transform operations with AI-driven efficiency analysis and automated performance optimization recommendations.",
    benefits: [
      "Process bottleneck detection",
      "Resource allocation optimization",
      "Automated efficiency recommendations"
    ],
    color: "bg-purple-500"
  },
  {
    Icon: AlertTriangle,
    title: "Proactive Risk Management",
    description: "Let AI monitor and identify potential risks before they impact your business, with real-time alerts and mitigation strategies.",
    benefits: [
      "Real-time risk monitoring",
      "Automated compliance checks",
      "AI-powered mitigation strategies"
    ],
    color: "bg-amber-500"
  },
  {
    Icon: Network,
    title: "AI-Powered ERP Integration",
    description: "Seamlessly connect with your existing ERP systems using our intelligent integration layer that automatically maps and reconciles data.",
    benefits: [
      "Automated data synchronization",
      "Smart field mapping",
      "Real-time validation"
    ],
    color: "bg-indigo-500"
  },
  {
    Icon: TrendingUp,
    title: "AI Financial Trend Detection",
    description: "Coming Soon: Advanced AI algorithms that identify growth trends, seasonality, anomalies, and risk factors in your financial data.",
    benefits: [
      "Pattern recognition and trend analysis",
      "Seasonality detection",
      "Automated benchmarking",
      "Risk factor identification"
    ],
    color: "bg-rose-500",
    comingSoon: true
  },
  {
    Icon: BarChart,
    title: "Market Data Integration",
    description: "Coming Soon: Real-time integration with market data and economic indicators through advanced APIs and data providers.",
    benefits: [
      "Live market data feeds",
      "Economic indicator tracking",
      "Automated SEC filing analysis",
      "Market sentiment analysis"
    ],
    color: "bg-cyan-500",
    comingSoon: true
  },
  {
    Icon: MessagesSquare,
    title: "AI Financial Assistant",
    description: "Coming Soon: Natural language processing powered chatbot that answers complex financial queries and provides instant insights.",
    benefits: [
      "Natural language queries",
      "Instant financial insights",
      "Automated report summaries",
      "Contextual recommendations"
    ],
    color: "bg-orange-500",
    comingSoon: true
  }
];

export function WelcomeScreen({ onClose }: WelcomeScreenProps) {
  const [currentFeature, setCurrentFeature] = useState(0);

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  const CurrentIcon = features[currentFeature].Icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-50"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold mb-2">Welcome to Earnings360</h1>
              <p className="text-gray-600">
                Discover how AI transforms financial analysis
              </p>
            </motion.div>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="grid grid-cols-2 gap-8"
              >
                {/* Feature Visualization */}
                <div className="relative flex items-center justify-center">
                  {currentFeature === 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        {features[0].metrics.map((metric, index) => (
                          <motion.div
                            key={index}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <metric.icon className={`h-5 w-5 ${metric.color} mb-2`} />
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <div className="text-sm text-gray-600">{metric.label}</div>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h3 className="text-sm font-medium text-gray-600 mb-3">Provider Comparison</h3>
                        <div className="space-y-3">
                          {features[0].providers.map((provider, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{provider.name}</span>
                                <span className="font-medium">{provider.accuracy}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${provider.accuracy}%` }}
                                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                  className="h-full bg-blue-500 rounded-full"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <>
                      <div 
                        className={`${features[currentFeature].color} w-64 h-64 rounded-full absolute opacity-10`} 
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                      />
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`${features[currentFeature].color} p-8 rounded-2xl text-white relative z-10`}
                      >
                        <CurrentIcon className="h-16 w-16" />
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Feature Description */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-semibold"
                    >
                      {features[currentFeature].title}
                    </motion.h2>
                    {features[currentFeature].comingSoon && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                      >
                        Coming Soon
                      </motion.span>
                    )}
                  </div>
                  
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600"
                  >
                    {features[currentFeature].description}
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    {features[currentFeature].benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle2 className={`h-4 w-4 ${features[currentFeature].color.replace('bg-', 'text-')}`} />
                        {benefit}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <button
              onClick={prevFeature}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            
            <div className="flex gap-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`h-2 w-12 rounded-full transition-colors ${
                    index === currentFeature ? features[currentFeature].color : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextFeature}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {currentFeature + 1} of {features.length} features
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}