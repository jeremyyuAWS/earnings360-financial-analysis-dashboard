interface ERPProvider {
  name: string;
  type: 'erp' | 'accounting' | 'banking';
  endpoints: {
    sync: string;
    status: string;
    data: string;
  };
}

const providers: Record<string, ERPProvider> = {
  SAP: {
    name: 'SAP',
    type: 'erp',
    endpoints: {
      sync: 'https://api.sap.example/sync',
      status: 'https://api.sap.example/status',
      data: 'https://api.sap.example/data'
    }
  },
  Oracle: {
    name: 'Oracle',
    type: 'erp',
    endpoints: {
      sync: 'https://api.oracle.example/sync',
      status: 'https://api.oracle.example/status',
      data: 'https://api.oracle.example/data'
    }
  },
  QuickBooks: {
    name: 'QuickBooks',
    type: 'accounting',
    endpoints: {
      sync: 'https://api.quickbooks.example/sync',
      status: 'https://api.quickbooks.example/status',
      data: 'https://api.quickbooks.example/data'
    }
  }
};

export async function simulateERPIntegration(alertId: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  // Simulate success/failure
  if (Math.random() > 0.2) {
    return true;
  }
  throw new Error('Integration failed');
}

export async function checkIntegrationStatus(provider: string, syncId: string): Promise<'pending' | 'synced' | 'failed'> {
  // Simulate status check
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  const statuses: Array<'pending' | 'synced' | 'failed'> = ['pending', 'synced', 'failed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

export async function fetchERPData(provider: string, dataType: string): Promise<any> {
  // Simulate data fetch
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500));
  
  return {
    success: true,
    data: {
      revenue: Math.random() * 1000000,
      expenses: Math.random() * 800000,
      profit: Math.random() * 200000
    }
  };
}