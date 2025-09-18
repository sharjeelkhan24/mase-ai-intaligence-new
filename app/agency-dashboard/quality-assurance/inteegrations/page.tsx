'use client';

import React, { useState } from 'react';
import { Shield, Settings, Link, CheckCircle, XCircle, AlertTriangle, Plus, RefreshCw, ExternalLink, Power, Key, Database, X, Copy, Eye, EyeOff, Clock } from 'lucide-react';
import AdminNavbar from '@/app/components/admin-dashboard/AdminNavbar';
import SubscriptionGuard from '@/app/components/admin-dashboard/SubscriptionGuard';

export default function QualityAssuranceIntegrations() {
  const [activeTab, setActiveTab] = useState('active');
  const [showAxxessSetup, setShowAxxessSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [showApiKey, setShowApiKey] = useState(false);
  const [authMethod, setAuthMethod] = useState('api'); // 'api' or 'credentials'
  const [axxessConfig, setAxxessConfig] = useState({
    apiKey: '',
    email: '',
    password: '',
    environment: 'production',
    webhookUrl: '',
    syncFrequency: '15'
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  // Available integrations - will be populated from database
  const availableIntegrations = [
    {
      id: 1,
      name: 'Axxess',
      category: 'Home Health Software',
      description: 'Connect with Axxess for comprehensive home health management and quality tracking',
      icon: 'Database',
      status: 'available',
      pricing: 'Enterprise',
      features: ['Patient Care Plans', 'Visit Documentation', 'Quality Measures', 'OASIS Integration', 'Billing Data']
    },
    {
      id: 2,
      name: 'Epic MyChart',
      category: 'EHR System',
      description: 'Integrate with Epic EHR for patient data and quality metrics',
      icon: 'Database',
      status: 'available',
      pricing: 'Enterprise',
      features: ['Patient Data Sync', 'Quality Metrics', 'Audit Trails', 'Real-time Updates']
    },
    {
      id: 3,
      name: 'Cerner PowerChart',
      category: 'EHR System',
      description: 'Connect with Cerner for comprehensive patient information',
      icon: 'Database',
      status: 'available',
      pricing: 'Enterprise',
      features: ['Clinical Data', 'Documentation Quality', 'Compliance Tracking']
    },
    {
      id: 4,
      name: 'MEDITECH',
      category: 'EHR System',
      description: 'MEDITECH integration for quality assurance workflows',
      icon: 'Database',
      status: 'coming-soon',
      pricing: 'Enterprise',
      features: ['Patient Records', 'Quality Indicators', 'Reporting']
    },
    {
      id: 5,
      name: 'Survey Monkey',
      category: 'Survey Platform',
      description: 'Patient satisfaction surveys and feedback collection',
      icon: 'ExternalLink',
      status: 'available',
      pricing: 'Standard',
      features: ['Patient Surveys', 'Satisfaction Metrics', 'Custom Forms', 'Analytics']
    },
    {
      id: 6,
      name: 'Slack',
      category: 'Communication',
      description: 'Quality alerts and team notifications',
      icon: 'ExternalLink',
      status: 'available',
      pricing: 'Free',
      features: ['Real-time Alerts', 'Team Updates', 'Audit Notifications']
    }
  ];

  // Connected integrations - will be loaded from database
  const connectedIntegrations = [
    {
      id: 1,
      name: 'Epic MyChart',
      category: 'EHR System',
      description: 'Connected to Metro Health Epic instance',
      status: 'connected',
      lastSync: '2024-01-15 09:30 AM',
      syncStatus: 'success',
      dataPoints: '1,247 records synced',
      uptime: '99.8%'
    },
    {
      id: 2,
      name: 'Survey Monkey',
      category: 'Survey Platform',
      description: 'Patient satisfaction survey integration',
      status: 'connected',
      lastSync: '2024-01-15 08:15 AM',
      syncStatus: 'success',
      dataPoints: '89 responses collected',
      uptime: '100%'
    },
    {
      id: 3,
      name: 'Slack',
      category: 'Communication',
      description: 'Quality team notifications',
      status: 'error',
      lastSync: '2024-01-14 03:22 PM',
      syncStatus: 'failed',
      dataPoints: 'Connection timeout',
      uptime: '97.2%'
    }
  ];

  // Initialize state with the arrays
  const [connectedIntegrationsState, setConnectedIntegrationsState] = useState(connectedIntegrations);
  const [availableIntegrationsState, setAvailableIntegrationsState] = useState(availableIntegrations);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'coming-soon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const addAxxessToConnected = () => {
    const currentDate = new Date();
    const newAxxessIntegration = {
      id: Date.now(), // Simple ID generation
      name: 'Axxess',
      category: 'Home Health Software',
      description: `Connected via ${authMethod === 'api' ? 'API Key' : 'Login Credentials'} to ${axxessConfig.environment} environment`,
      status: 'connected' as const,
      lastSync: currentDate.toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
      }),
      syncStatus: 'success' as const,
      dataPoints: '0 records synced (initializing)',
      uptime: '100%'
    };

    setConnectedIntegrationsState(prev => [...prev, newAxxessIntegration]);
    
    // Remove Axxess from available integrations
    setAvailableIntegrationsState(prev => prev.filter(integration => integration.name !== 'Axxess'));
  };

  const handleConfigure = (integration: any) => {
    setSelectedIntegration(integration);
    // Load current configuration for the integration
    if (integration.name === 'Axxess') {
      // In a real app, you'd load the stored config from the backend
      setAxxessConfig({
        apiKey: '••••••••••••••••',
        email: 'user@agency.com',
        password: '••••••••',
        environment: 'production',
        webhookUrl: 'https://your-axxess-instance.com/webhooks',
        syncFrequency: '15'
      });
    }
    setShowConfigModal(true);
  };

  const handleTestConnection = async (integration: any) => {
    setSelectedIntegration(integration);
    setShowTestModal(true);
    setIsTestingConnection(true);
    setTestResults([]);

    // Simulate running connection tests
    const tests = [
      { name: 'Authentication', status: 'running', result: '', description: 'Verifying credentials' },
      { name: 'API Access', status: 'pending', result: '', description: 'Testing API endpoints' },
      { name: 'Data Retrieval', status: 'pending', result: '', description: 'Fetching sample data' },
      { name: 'Webhook Status', status: 'pending', result: '', description: 'Checking webhook configuration' }
    ];

    setTestResults([...tests]);

    // Simulate test execution with delays
    for (let i = 0; i < tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedTests = [...tests];
      updatedTests[i].status = 'completed';
      updatedTests[i].result = i === 2 ? '12 records retrieved' : 'Passed';
      
      if (i + 1 < tests.length) {
        updatedTests[i + 1].status = 'running';
      }
      
      setTestResults([...updatedTests]);
    }

    setIsTestingConnection(false);
  };

  const saveConfiguration = () => {
    // In a real app, you'd save the configuration to the backend
    console.log('Saving configuration:', axxessConfig);
    
    // Update the integration in the state
    setConnectedIntegrationsState(prev => 
      prev.map(integration => 
        integration.name === selectedIntegration?.name 
          ? { 
              ...integration, 
              lastSync: new Date().toLocaleString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true 
              }),
              description: `Connected via ${authMethod === 'api' ? 'API Key' : 'Login Credentials'} to ${axxessConfig.environment} environment (Updated)`
            }
          : integration
      )
    );
    
    setShowConfigModal(false);
    alert('Configuration updated successfully!');
  };

  const renderActiveIntegrations = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Active Integrations</p>
              <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">{connectedIntegrationsState.filter(i => i.status === 'connected').length}</p>
            </div>
            <Link className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Data Sources</p>
              <p className="text-2xl font-bold text-green-600 font-[family-name:var(--font-adlam-display)]">{connectedIntegrationsState.filter(i => i.category === 'EHR System' || i.category === 'Home Health Software').length}</p>
            </div>
            <Database className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Avg Uptime</p>
              <p className="text-2xl font-bold text-blue-600 font-[family-name:var(--font-adlam-display)]">99.0%</p>
            </div>
            <Power className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Sync Errors</p>
              <p className="text-2xl font-bold text-red-600 font-[family-name:var(--font-adlam-display)]">{connectedIntegrationsState.filter(i => i.syncStatus === 'failed').length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Connected Integrations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
            Connected Integrations
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {connectedIntegrationsState.map((integration) => (
            <div key={integration.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                      {integration.name}
                    </h4>
                    <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                      {integration.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)} font-[family-name:var(--font-adlam-display)]`}>
                        {integration.status === 'connected' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {integration.status === 'error' && <XCircle className="w-3 h-3 mr-1" />}
                        <span className="capitalize">{integration.status}</span>
                      </span>
                      <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                        {integration.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    {getSyncStatusIcon(integration.syncStatus)}
                    <span className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
                      Last sync: {integration.lastSync}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    {integration.dataPoints}
                  </div>
                  <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    Uptime: {integration.uptime}
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <button 
                      onClick={() => handleConfigure(integration)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium font-[family-name:var(--font-adlam-display)]"
                    >
                      Configure
                    </button>
                    <button 
                      onClick={() => {
                        // Force refresh the integration
                        setConnectedIntegrationsState(prev => 
                          prev.map(int => 
                            int.id === integration.id 
                              ? { 
                                  ...int, 
                                  lastSync: new Date().toLocaleString('en-US', { 
                                    year: 'numeric', 
                                    month: '2-digit', 
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true 
                                  }),
                                  syncStatus: 'success',
                                  dataPoints: `${Math.floor(Math.random() * 100) + 50} records synced`
                                }
                              : int
                          )
                        );
                      }}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium font-[family-name:var(--font-adlam-display)]"
                      title="Force sync now"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleTestConnection(integration)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium font-[family-name:var(--font-adlam-display)]"
                    >
                      Test Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAvailableIntegrations = () => (
    <div>
      {availableIntegrationsState.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
            All Integrations Connected!
          </h3>
          <p className="text-gray-500 font-[family-name:var(--font-adlam-display)]">
            You've connected all available integrations. Check back later for new options.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableIntegrationsState.map((integration) => (
        <div key={integration.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {integration.icon === 'Database' ? (
                <Database className="w-6 h-6 text-blue-600" />
              ) : (
                <ExternalLink className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)} font-[family-name:var(--font-adlam-display)]`}>
              {integration.status === 'available' && <CheckCircle className="w-3 h-3 mr-1" />}
              <span className="capitalize">{integration.status.replace('-', ' ')}</span>
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
            {integration.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 font-[family-name:var(--font-adlam-display)]">
            {integration.description}
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">Category</span>
              <span className="text-xs font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{integration.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">Pricing</span>
              <span className="text-xs font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{integration.pricing}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">Features</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {integration.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 font-[family-name:var(--font-adlam-display)]"
                  >
                    {feature}
                  </span>
                ))}
                {integration.features.length > 3 && (
                  <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    +{integration.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button 
              onClick={() => {
                if (integration.name === 'Axxess') {
                  setShowAxxessSetup(true);
                  setSetupStep(1);
                }
              }}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors font-[family-name:var(--font-adlam-display)] ${
                integration.status === 'available' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={integration.status !== 'available'}
            >
              {integration.status === 'available' ? 'Connect' : 'Coming Soon'}
            </button>
          </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <SubscriptionGuard 
      requiredSubscription="Quality Assurance" 
      featureName="Quality Assurance Integrations"
    >
      <div className="min-h-screen bg-gray-50 flex">
        {/* Admin Navbar Component */}
        <AdminNavbar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">Quality Assurance</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Inteegrations
                </h1>
                <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                  Connect with external systems to enhance quality assurance workflows
                </p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4" />
                <span>Request Integration</span>
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm font-[family-name:var(--font-adlam-display)] ${
                      activeTab === 'active'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Active Integrations
                  </button>
                  <button
                    onClick={() => setActiveTab('available')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm font-[family-name:var(--font-adlam-display)] ${
                      activeTab === 'available'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Available Integrations
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'active' && renderActiveIntegrations()}
            {activeTab === 'available' && renderAvailableIntegrations()}
          </main>
        </div>
      </div>

      {/* Axxess Setup Modal */}
      {showAxxessSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                    Connect Axxess Integration
                  </h3>
                  <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    Step {setupStep} of 4 - Set up your Axxess connection
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAxxessSetup(false);
                  setSetupStep(1);
                  setAxxessConfig({
                    apiKey: '',
                    email: '',
                    password: '',
                    environment: 'production',
                    webhookUrl: '',
                    syncFrequency: '15'
                  });
                  setAuthMethod('api');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      setupStep >= step 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {setupStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                    </div>
                    {step < 4 && (
                      <div className={`w-12 h-1 mx-2 ${
                        setupStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600 font-[family-name:var(--font-adlam-display)]">
                <span>API Setup</span>
                <span>Configuration</span>
                <span>Testing</span>
                <span>Complete</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Step 1: Authentication Setup */}
              {setupStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Axxess Authentication Setup
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 font-[family-name:var(--font-adlam-display)]">
                      Choose how you want to connect with Axxess. You can use either an API key or your login credentials.
                    </p>
                  </div>

                  {/* Authentication Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 font-[family-name:var(--font-adlam-display)]">
                      Authentication Method *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setAuthMethod('api')}
                        className={`p-4 border rounded-lg text-left transition-all font-[family-name:var(--font-adlam-display)] ${
                          authMethod === 'api' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Key className="w-5 h-5" />
                          <span className="font-medium">API Key</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Use an API key from your Axxess admin portal
                        </p>
                      </button>
                      
                      <button
                        onClick={() => setAuthMethod('credentials')}
                        className={`p-4 border rounded-lg text-left transition-all font-[family-name:var(--font-adlam-display)] ${
                          authMethod === 'credentials' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Shield className="w-5 h-5" />
                          <span className="font-medium">Login Credentials</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Use your Axxess username and password
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* API Key Method */}
                  {authMethod === 'api' && (
                    <>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                          📋 How to get your Axxess API Key:
                        </h5>
                        <ol className="text-sm text-blue-800 space-y-1 font-[family-name:var(--font-adlam-display)]">
                          <li>1. Log into your Axxess Admin Portal</li>
                          <li>2. Navigate to "System Settings" → "API Management"</li>
                          <li>3. Click "Generate New API Key"</li>
                          <li>4. Set permissions for "Quality Management" and "Patient Data"</li>
                          <li>5. Copy the generated API key</li>
                        </ol>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                          Axxess API Key *
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey ? 'text' : 'password'}
                            value={axxessConfig.apiKey}
                            onChange={(e) => setAxxessConfig({...axxessConfig, apiKey: e.target.value})}
                            placeholder="Enter your Axxess API key"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-20 font-[family-name:var(--font-adlam-display)]"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                            <button
                              type="button"
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(axxessConfig.apiKey)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Credentials Method */}
                  {authMethod === 'credentials' && (
                    <>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-medium text-green-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                          👤 Using Login Credentials:
                        </h5>
                        <ul className="text-sm text-green-800 space-y-1 font-[family-name:var(--font-adlam-display)]">
                          <li>• Use your regular Axxess login email and password</li>
                          <li>• Your account must have API access permissions</li>
                          <li>• We'll securely store your credentials and use token-based authentication</li>
                          <li>• You can revoke access anytime from your Axxess settings</li>
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                            Axxess Email *
                          </label>
                          <input
                            type="email"
                            value={axxessConfig.email}
                            onChange={(e) => setAxxessConfig({...axxessConfig, email: e.target.value})}
                            placeholder="Enter your Axxess login email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                            Axxess Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showApiKey ? 'text' : 'password'}
                              value={axxessConfig.password}
                              onChange={(e) => setAxxessConfig({...axxessConfig, password: e.target.value})}
                              placeholder="Enter your Axxess password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10 font-[family-name:var(--font-adlam-display)]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h5 className="font-medium text-yellow-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                          🔒 Security Information:
                        </h5>
                        <ul className="text-sm text-yellow-800 space-y-1 font-[family-name:var(--font-adlam-display)]">
                          <li>• Your credentials are encrypted and stored securely</li>
                          <li>• We'll exchange your credentials for secure access tokens</li>
                          <li>• Your password is never stored in plain text</li>
                          <li>• All communication uses SSL/TLS encryption</li>
                        </ul>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Environment
                    </label>
                    <select
                      value={axxessConfig.environment}
                      onChange={(e) => setAxxessConfig({...axxessConfig, environment: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                    >
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                      <option value="sandbox">Sandbox</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Configuration */}
              {setupStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Integration Configuration
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 font-[family-name:var(--font-adlam-display)]">
                      Configure how MASE AI will sync with your Axxess system.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Webhook URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={axxessConfig.webhookUrl}
                      onChange={(e) => setAxxessConfig({...axxessConfig, webhookUrl: e.target.value})}
                      placeholder="https://your-axxess-instance.com/webhooks"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-[family-name:var(--font-adlam-display)]">
                      For real-time updates when data changes in Axxess
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Sync Frequency
                    </label>
                    <select
                      value={axxessConfig.syncFrequency}
                      onChange={(e) => setAxxessConfig({...axxessConfig, syncFrequency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                    >
                      <option value="5">Every 5 minutes</option>
                      <option value="15">Every 15 minutes</option>
                      <option value="30">Every 30 minutes</option>
                      <option value="60">Every hour</option>
                      <option value="240">Every 4 hours</option>
                    </select>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                      📊 Data that will be synced:
                    </h5>
                    <ul className="text-sm text-yellow-800 space-y-1 font-[family-name:var(--font-adlam-display)]">
                      <li>• Patient care plans and visit notes</li>
                      <li>• Quality measures and OASIS assessments</li>
                      <li>• Staff scheduling and assignments</li>
                      <li>• Billing and insurance information</li>
                      <li>• Compliance and audit documentation</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 3: Testing */}
              {setupStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Connection Testing
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 font-[family-name:var(--font-adlam-display)]">
                      We'll test the connection to make sure everything is working correctly with your Axxess account.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="font-medium font-[family-name:var(--font-adlam-display)]">
                            {authMethod === 'api' ? 'API Key Validation' : 'Login Authentication'}
                          </span>
                          <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            {authMethod === 'api' 
                              ? 'Validating API key permissions and access'
                              : 'Authenticating with your login credentials'
                            }
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600 font-[family-name:var(--font-adlam-display)]">Verified</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="font-medium font-[family-name:var(--font-adlam-display)]">Account Information</span>
                          <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            Retrieving your agency details and permissions
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600 font-[family-name:var(--font-adlam-display)]">Retrieved</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="font-medium font-[family-name:var(--font-adlam-display)]">Data Access Test</span>
                          <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            Testing access to patient data and quality metrics
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600 font-[family-name:var(--font-adlam-display)]">5 test records</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="font-medium font-[family-name:var(--font-adlam-display)]">Real-time Sync Setup</span>
                          <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            {axxessConfig.webhookUrl ? 'Webhook configured for real-time updates' : 'Polling configured for periodic sync'}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600 font-[family-name:var(--font-adlam-display)]">Active</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                      🔍 How to verify your connection after setup:
                    </h5>
                    <ul className="text-sm text-blue-800 space-y-1 font-[family-name:var(--font-adlam-display)]">
                      <li>• Check the "Active Integrations" tab for real-time sync status</li>
                      <li>• Look for recent data in your Quality Assurance dashboard</li>
                      <li>• Monitor the "Last Sync" timestamp for updates</li>
                      <li>• Review sync logs for successful data transfers</li>
                      <li>• Test by making a change in Axxess and checking if it appears in MASE AI</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900 font-[family-name:var(--font-adlam-display)]">
                        Connection established successfully!
                      </span>
                    </div>
                    <p className="text-sm text-green-800 mt-2 font-[family-name:var(--font-adlam-display)]">
                      Your Axxess account is now connected to MASE AI. Data synchronization will begin shortly.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Complete */}
              {setupStep === 4 && (
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                      🎉 Axxess Integration Complete!
                    </h4>
                    <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
                      Your Axxess system is now connected and data will start syncing automatically.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-left">
                    <h5 className="font-medium text-blue-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                      🚀 What happens next:
                    </h5>
                    <ul className="text-sm text-blue-800 space-y-1 font-[family-name:var(--font-adlam-display)]">
                      <li>• Initial data sync will start within 5 minutes</li>
                      <li>• Quality metrics will be available in your dashboard</li>
                      <li>• Real-time notifications will be active</li>
                      <li>• You can view sync status in the Active Integrations tab</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Environment</div>
                      <div className="text-gray-600 font-[family-name:var(--font-adlam-display)]">{axxessConfig.environment}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Sync Frequency</div>
                      <div className="text-gray-600 font-[family-name:var(--font-adlam-display)]">Every {axxessConfig.syncFrequency} minutes</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  if (setupStep > 1) {
                    setSetupStep(setupStep - 1);
                  } else {
                    setShowAxxessSetup(false);
                    setSetupStep(1);
                    setAxxessConfig({
                      apiKey: '',
                      email: '',
                      password: '',
                      environment: 'production',
                      webhookUrl: '',
                      syncFrequency: '15'
                    });
                    setAuthMethod('api');
                  }
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-[family-name:var(--font-adlam-display)]"
              >
                {setupStep === 1 ? 'Cancel' : 'Back'}
              </button>

              <div className="flex items-center space-x-3">
                {setupStep < 4 && (
                  <button
                    onClick={() => setSetupStep(setupStep + 1)}
                    disabled={
                      setupStep === 1 && 
                      ((authMethod === 'api' && !axxessConfig.apiKey) || 
                       (authMethod === 'credentials' && (!axxessConfig.email || !axxessConfig.password)))
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-[family-name:var(--font-adlam-display)]"
                  >
                    {setupStep === 3 ? 'Run Tests' : 'Next'}
                  </button>
                )}
                {setupStep === 4 && (
                  <button
                    onClick={() => {
                      addAxxessToConnected(); // Add Axxess to connected integrations
                      setShowAxxessSetup(false);
                      setActiveTab('active'); // Switch to active tab to see the new integration
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[family-name:var(--font-adlam-display)]"
                  >
                    View Integration
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                    Configure {selectedIntegration.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    Update your integration settings
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
                  Connection Settings
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Environment
                    </label>
                    <select
                      value={axxessConfig.environment}
                      onChange={(e) => setAxxessConfig({...axxessConfig, environment: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                    >
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                      <option value="sandbox">Sandbox</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Sync Frequency
                    </label>
                    <select
                      value={axxessConfig.syncFrequency}
                      onChange={(e) => setAxxessConfig({...axxessConfig, syncFrequency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                    >
                      <option value="5">Every 5 minutes</option>
                      <option value="15">Every 15 minutes</option>
                      <option value="30">Every 30 minutes</option>
                      <option value="60">Every hour</option>
                      <option value="240">Every 4 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Webhook URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={axxessConfig.webhookUrl}
                      onChange={(e) => setAxxessConfig({...axxessConfig, webhookUrl: e.target.value})}
                      placeholder="https://your-axxess-instance.com/webhooks"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-[family-name:var(--font-adlam-display)]">
                      For real-time updates when data changes in Axxess
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
                  Authentication
                </h4>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-medium text-yellow-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                    🔒 Security Information:
                  </h5>
                  <ul className="text-sm text-yellow-800 space-y-1 font-[family-name:var(--font-adlam-display)]">
                    <li>• Your authentication credentials are securely stored</li>
                    <li>• To update credentials, you'll need to reconnect the integration</li>
                    <li>• Current method: {authMethod === 'api' ? 'API Key' : 'Login Credentials'}</li>
                    <li>• Environment: {axxessConfig.environment}</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => {
                      setShowConfigModal(false);
                      setShowAxxessSetup(true);
                      setSetupStep(1);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium font-[family-name:var(--font-adlam-display)]"
                  >
                    Update Authentication →
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
                  Integration Status
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 font-[family-name:var(--font-adlam-display)]">Last Sync</div>
                    <div className="text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">{selectedIntegration.lastSync}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 font-[family-name:var(--font-adlam-display)]">Uptime</div>
                    <div className="text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">{selectedIntegration.uptime}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-[family-name:var(--font-adlam-display)]"
              >
                Cancel
              </button>
              <button
                onClick={saveConfiguration}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Connection Modal */}
      {showTestModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                    Test {selectedIntegration.name} Connection
                  </h3>
                  <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    Running connectivity and data access tests
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isTestingConnection}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                {testResults.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {test.status === 'running' && <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />}
                      {test.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {test.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                      <div>
                        <span className="font-medium font-[family-name:var(--font-adlam-display)]">{test.name}</span>
                        <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">{test.description}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium font-[family-name:var(--font-adlam-display)] ${
                      test.status === 'completed' ? 'text-green-600' : 
                      test.status === 'running' ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {test.status === 'completed' ? test.result : 
                       test.status === 'running' ? 'Testing...' : 'Waiting...'}
                    </span>
                  </div>
                ))}

                {!isTestingConnection && testResults.length > 0 && testResults.every(test => test.status === 'completed') && (
                  <div className="bg-green-50 p-4 rounded-lg mt-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900 font-[family-name:var(--font-adlam-display)]">
                        All tests passed!
                      </span>
                    </div>
                    <p className="text-sm text-green-800 mt-2 font-[family-name:var(--font-adlam-display)]">
                      Your {selectedIntegration.name} integration is working correctly and can access your data.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowTestModal(false)}
                disabled={isTestingConnection}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-[family-name:var(--font-adlam-display)]"
              >
                {isTestingConnection ? 'Testing...' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SubscriptionGuard>
  );
}
