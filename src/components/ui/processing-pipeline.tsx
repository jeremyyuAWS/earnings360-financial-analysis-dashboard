import React from 'react';
import { OCRTimeline } from '../analysis/OCRTimeline';
import { Button } from '../ui/button';
import { CheckCircle2, Clock } from 'lucide-react';

interface ProcessingPipelineProps {
  steps: any[];
  onContinueToAnalysis?: () => void;
}

export function ProcessingPipeline({ steps, onContinueToAnalysis }: ProcessingPipelineProps) {
  const allCompleted = steps.every(step => step.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Status Indicator */}
      <div className={`flex items-center justify-between p-4 rounded-lg border ${
        allCompleted 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-center gap-3">
          {allCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <Clock className="h-5 w-5 text-blue-600 animate-spin" />
          )}
          <div>
            <h3 className="font-medium">
              {allCompleted ? 'Processing Complete' : 'Processing Documents'}
            </h3>
            <p className="text-sm text-gray-600">
              {allCompleted 
                ? 'All documents have been successfully processed'
                : 'Analyzing documents using multiple OCR providers'
              }
            </p>
          </div>
        </div>
        {allCompleted && (
          <Button
            onClick={onContinueToAnalysis}
            className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm"
          >
            Continue to Analysis
          </Button>
        )}
      </div>

      <OCRTimeline steps={steps} />
    </div>
  );
}