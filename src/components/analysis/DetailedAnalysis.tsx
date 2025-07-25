import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { FinancialCharts } from './FinancialCharts';
import { MetricsGrid } from './MetricsGrid';
import { FinancialRatiosAnalysis } from './FinancialRatiosAnalysis';
import { CashFlowAnalysis } from './CashFlowAnalysis';
import { CompetitiveAnalysis } from './CompetitiveAnalysis';
import { EarningsSummary } from './EarningsSummary';
import { OperationalAnalysis } from './OperationalAnalysis';
import { RiskAnalysis } from './RiskAnalysis';
import type { ProcessedDocument } from '../../lib/utils';

interface DetailedAnalysisProps {
  document: ProcessedDocument;
}

export function DetailedAnalysis({ document }: DetailedAnalysisProps) {
  if (!document.metrics) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{document.filename}</h2>
        <p className="text-sm text-gray-500">
          Processed on {document.processedAt?.toLocaleDateString()}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="border-b border-gray-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="earnings">Earnings Analysis</TabsTrigger>
          <TabsTrigger value="financial">Financial Health</TabsTrigger>
          <TabsTrigger value="market">Market Position</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <MetricsGrid document={document} />
          <div className="mt-6">
            <FinancialCharts document={document} />
          </div>
        </TabsContent>

        <TabsContent value="earnings">
          <EarningsSummary document={document} />
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialRatiosAnalysis metrics={document.metrics} />
            <CashFlowAnalysis metrics={document.metrics} />
          </div>
        </TabsContent>

        <TabsContent value="market">
          <CompetitiveAnalysis metrics={document.metrics} />
        </TabsContent>

        <TabsContent value="operational">
          <OperationalAnalysis document={document} />
        </TabsContent>

        <TabsContent value="risks">
          <RiskAnalysis document={document} />
        </TabsContent>
      </Tabs>
    </div>
  );
}