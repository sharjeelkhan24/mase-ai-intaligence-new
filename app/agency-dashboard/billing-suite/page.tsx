'use client';

import React, { useState } from 'react';
import { CreditCard, DollarSign, FileText, TrendingUp, Calendar, Download, Plus, Filter, Search, Clock, CheckCircle, XCircle } from 'lucide-react';
import AdminNavbar from '@/app/components/admin-dashboard/AdminNavbar';
import SubscriptionGuard from '@/app/components/admin-dashboard/SubscriptionGuard';

export default function BillingSuite() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Sample billing data
  const billingStats = [
    {
      title: 'Total Revenue',
      value: '$125,430',
      change: '+12.5%',
      period: 'this month',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Outstanding Balance',
      value: '$32,150',
      change: '-8.2%',
      period: 'from last month',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Processed Claims',
      value: '1,247',
      change: '+15.3%',
      period: 'this month',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Collection Rate',
      value: '94.2%',
      change: '+2.1%',
      period: 'this month',
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  // Sample invoices data
  const invoices = [
    {
      id: 'INV-2024-001',
      client: 'City General Hospital',
      service: 'Nursing Staff - Emergency Dept',
      amount: 15420.00,
      dueDate: '2024-02-15',
      status: 'paid',
      issueDate: '2024-01-15',
      paymentDate: '2024-01-28'
    },
    {
      id: 'INV-2024-002',
      client: 'Metro Medical Center',
      service: 'ICU Nursing Coverage',
      amount: 22750.00,
      dueDate: '2024-02-10',
      status: 'pending',
      issueDate: '2024-01-10',
      paymentDate: null
    },
    {
      id: 'INV-2024-003',
      client: 'Regional Hospital',
      service: 'Surgical Unit Support',
      amount: 18900.00,
      dueDate: '2024-02-05',
      status: 'overdue',
      issueDate: '2024-01-05',
      paymentDate: null
    },
    {
      id: 'INV-2024-004',
      client: 'Children\'s Hospital',
      service: 'Pediatric Nursing Services',
      amount: 12300.00,
      dueDate: '2024-02-20',
      status: 'draft',
      issueDate: '2024-01-20',
      paymentDate: null
    },
    {
      id: 'INV-2024-005',
      client: 'Suburban Medical',
      service: 'Weekend Coverage',
      amount: 8500.00,
      dueDate: '2024-01-30',
      status: 'paid',
      issueDate: '2024-01-01',
      paymentDate: '2024-01-25'
    }
  ];

  const statusOptions = ['all', 'draft', 'pending', 'paid', 'overdue'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <XCircle className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SubscriptionGuard 
      requiredSubscription="Billing Suite" 
      featureName="Billing Suite"
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
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Billing Suite
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Manage invoices, payments, and financial reporting
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4" />
                <span>New Invoice</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {billingStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">
                      {stat.title}
                    </h3>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                      {stat.value}
                    </p>
                    <div className="flex items-center text-sm">
                      <span className={`font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} font-[family-name:var(--font-adlam-display)]`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 ml-1 font-[family-name:var(--font-adlam-display)]">
                        {stat.period}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revenue Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Revenue Trends
                </h3>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                >
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="quarter">Last 3 months</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-[family-name:var(--font-adlam-display)]">Revenue Chart</p>
                  <p className="text-sm text-gray-400 font-[family-name:var(--font-adlam-display)]">Chart visualization would go here</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-[family-name:var(--font-adlam-display)]">
                Payment Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Credit Card</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Bank Transfer</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Check</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Recent Invoices
                </h3>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-[family-name:var(--font-adlam-display)]">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                          {invoice.id}
                        </div>
                        <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                          Issued: {formatDate(invoice.issueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                          {invoice.client}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">
                          {invoice.service}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                          {formatCurrency(invoice.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center font-[family-name:var(--font-adlam-display)]">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(invoice.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)} font-[family-name:var(--font-adlam-display)]`}>
                          {getStatusIcon(invoice.status)}
                          <span className="capitalize">{invoice.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">
                            View
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 font-[family-name:var(--font-adlam-display)]">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    </SubscriptionGuard>
  );
}
