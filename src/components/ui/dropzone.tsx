import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Progress } from './progress';
import { ProcessingPipeline } from './processing-pipeline';

interface FileDropzoneProps {
  onFileAccepted: (files: File[]) => void;
  onContinueToAnalysis: () => void;
  className?: string;
}

export function FileDropzone({ onFileAccepted, onContinueToAnalysis, className }: FileDropzoneProps) {
  const [draggedFiles, setDraggedFiles] = useState<File[]>([]);
  const [processingSteps, setProcessingSteps] = useState<any[]>([]);

  const simulateProcessingSteps = async (file: File) => {
    // Simulate OCR processing with multiple providers
    const ocrSteps = [
      {
        id: 'ocr-aws',
        name: 'Text Extraction (AWS)',
        provider: 'Amazon Textract',
        status: 'processing',
        progress: 0,
        icon: File,
        confidence: 0.92,
        result: 'Revenue: $1.2M, Growth: 15%',
        processingTime: 1200,
        costPerPage: 0.015,
        anomalies: [
          {
            severity: 'medium',
            description: 'Unusual revenue growth pattern detected'
          }
        ]
      },
      {
        id: 'ocr-google',
        name: 'Text Extraction (Google)',
        provider: 'Google Vision AI',
        status: 'processing',
        progress: 0,
        icon: File,
        confidence: 0.88,
        result: 'Revenue: $1.23M, Growth: 15.5%',
        processingTime: 800,
        costPerPage: 0.02,
        anomalies: [
          {
            severity: 'low',
            description: 'Minor discrepancy in revenue recognition'
          }
        ]
      },
      {
        id: 'ocr-azure',
        name: 'Text Extraction (Azure)',
        provider: 'Azure Computer Vision',
        status: 'processing',
        progress: 0,
        icon: File,
        confidence: 0.90,
        result: 'Revenue: $1.21M, Growth: 15.2%',
        processingTime: 950,
        costPerPage: 0.018,
        anomalies: [
          {
            severity: 'low',
            description: 'Formatting inconsistency detected'
          }
        ]
      },
      {
        id: 'ocr-tesseract',
        name: 'Text Extraction (Tesseract)',
        provider: 'Tesseract OCR',
        status: 'processing',
        progress: 0,
        icon: File,
        confidence: 0.85,
        result: 'Revenue: $1.19M, Growth: 14.8%',
        processingTime: 1500,
        costPerPage: 0,
        anomalies: [
          {
            severity: 'medium',
            description: 'Table structure recognition issues'
          }
        ]
      },
      {
        id: 'ocr-abbyy',
        name: 'Text Extraction (ABBYY)',
        provider: 'ABBYY FineReader',
        status: 'processing',
        progress: 0,
        icon: File,
        confidence: 0.94,
        result: 'Revenue: $1.215M, Growth: 15.1%',
        processingTime: 1100,
        costPerPage: 0.025,
        anomalies: [
          {
            severity: 'low',
            description: 'Minor font recognition variance'
          }
        ]
      }
    ];

    // Simulate NLP analysis with multiple providers
    const nlpSteps = [
      {
        id: 'nlp-openai',
        name: 'Financial Analysis',
        provider: 'OpenAI GPT-4',
        status: 'waiting',
        progress: 0,
        icon: File,
        confidence: 0.95,
        result: 'Strong financial performance with sustainable growth',
        processingTime: 2000,
        costPerPage: 0.03,
        anomalies: [
          {
            severity: 'high',
            description: 'Significant deviation from industry average margins'
          }
        ]
      },
      {
        id: 'nlp-cohere',
        name: 'Sentiment Analysis',
        provider: 'Cohere',
        status: 'waiting',
        progress: 0,
        icon: File,
        confidence: 0.87,
        result: 'Positive sentiment with cautious outlook',
        processingTime: 1800,
        costPerPage: 0.02,
        anomalies: [
          {
            severity: 'medium',
            description: 'Mixed sentiment signals in forward-looking statements'
          }
        ]
      }
    ];

    setProcessingSteps([...ocrSteps, ...nlpSteps]);

    // Simulate OCR processing
    for (const step of ocrSteps) {
      await simulateStepProgress(step);
    }

    // Simulate NLP processing
    for (const step of nlpSteps) {
      await simulateStepProgress(step);
    }

    // Simulate result reconciliation
    const reconciliationStep = {
      id: 'reconciliation',
      name: 'Result Reconciliation',
      provider: 'AI Orchestrator',
      status: 'processing',
      progress: 0,
      icon: File,
      needsReview: true,
      result: 'Revenue: $1.215M, Growth: 15.25%',
      alternativeResults: ocrSteps.map(step => ({
        provider: step.provider,
        value: step.result,
        confidence: step.confidence
      })),
      anomalies: [
        {
          severity: 'medium',
          description: 'Variance between provider results requires reconciliation'
        }
      ]
    };

    setProcessingSteps(prev => [...prev, reconciliationStep]);
    await simulateStepProgress(reconciliationStep);
  };

  const simulateStepProgress = async (step: any) => {
    const duration = 2000; // Fixed 2-second processing time
    const interval = 100;
    const steps = duration / interval;
    
    for (let i = 0; i <= steps; i++) {
      const progress = (i / steps) * 100;
      setProcessingSteps(prev => 
        prev.map(s => 
          s.id === step.id 
            ? { 
                ...s, 
                status: progress < 100 ? 'processing' : 'completed',
                progress 
              }
            : s
        )
      );
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setDraggedFiles(acceptedFiles);
    
    for (const file of acceptedFiles) {
      await simulateProcessingSteps(file);
    }
    
    onFileAccepted(acceptedFiles);
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isDragActive ? (
            <Upload className="h-10 w-10 text-blue-500" />
          ) : (
            <File className="h-10 w-10 text-gray-400" />
          )}
          <p className="text-lg font-medium">
            {isDragActive ? "Drop files here" : "Drag & drop financial documents"}
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: PDF, Excel, and Word documents
          </p>
          <button className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Browse Files
          </button>
        </div>
      </div>

      {processingSteps.length > 0 && (
        <ProcessingPipeline 
          steps={processingSteps}
          onContinueToAnalysis={onContinueToAnalysis}
        />
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-gray-600" />
          Document Guidelines
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Financial statements should be in standard formats</li>
          <li>• Ensure documents are properly formatted and complete</li>
          <li>• Maximum file size: 10MB per document</li>
          <li>• Avoid password-protected or encrypted files</li>
        </ul>
      </div>
    </div>
  );
}