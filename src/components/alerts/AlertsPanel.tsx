import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, Clock, ArrowUpRight, ExternalLink } from 'lucide-react';
import { simulateERPIntegration } from '../../lib/integrations/erp';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  integration?: {
    type: 'erp' | 'accounting' | 'banking';
    provider: string;
    status: 'pending' | 'synced' | 'failed';
  };
}

export function AlertsPanel() {
  const [alerts, setAlerts] = React.useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Unusual Revenue Pattern',
      message: 'Q3 revenue shows 45% deviation from projected trends',
      timestamp: new Date(),
      status: 'pending',
      integration: {
        type: 'erp',
        provider: 'SAP',
        status: 'pending'
      }
    },
    {
      id: '2',
      type: 'error',
      title: 'Critical Margin Alert',
      message: 'Gross margin dropped below threshold (15%)',
      timestamp: new Date(),
      status: 'pending',
      integration: {
        type: 'accounting',
        provider: 'QuickBooks',
        status: 'pending'
      }
    }
  ]);

  const handleSync = async (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'processing' }
          : alert
      )
    );

    try {
      const result = await simulateERPIntegration(alertId);
      
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? {
                ...alert,
                status: 'completed',
                integration: {
                  ...alert.integration!,
                  status: 'synced'
                }
              }
            : alert
        )
      );
    } catch (error) {
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? {
                ...alert,
                status: 'failed',
                integration: {
                  ...alert.integration!,
                  status: 'failed'
                }
              }
            : alert
        )
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Alerts & Notifications</h2>
          </div>
          <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
            {alerts.length} Active
          </span>
        </div>

        <div className="space-y-4">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${
                alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                alert.type === 'error' ? 'border-rose-200 bg-rose-50' :
                alert.type === 'success' ? 'border-emerald-200 bg-emerald-50' :
                'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                  {alert.type === 'error' && <AlertTriangle className="h-5 w-5 text-rose-600" />}
                  {alert.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                  {alert.type === 'info' && <Bell className="h-5 w-5 text-blue-600" />}
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    
                    {alert.integration && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Integration: {alert.integration.provider}
                        </span>
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                          alert.integration.status === 'synced' 
                            ? 'bg-emerald-100 text-emerald-700'
                            : alert.integration.status === 'failed'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {alert.integration.status === 'synced' && <CheckCircle2 className="h-3 w-3" />}
                          {alert.integration.status === 'failed' && <AlertTriangle className="h-3 w-3" />}
                          {alert.integration.status === 'pending' && <Clock className="h-3 w-3" />}
                          {alert.integration.status.charAt(0).toUpperCase() + alert.integration.status.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSync(alert.id)}
                    disabled={alert.status === 'processing' || alert.integration?.status === 'synced'}
                    className={`px-3 py-1 text-sm rounded-lg flex items-center gap-1 ${
                      alert.status === 'processing'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : alert.integration?.status === 'synced'
                        ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {alert.status === 'processing' ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : alert.integration?.status === 'synced' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Synced
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="h-4 w-4" />
                        Sync to {alert.integration?.provider}
                      </>
                    )}
                  </button>
                  
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="View in ERP"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}