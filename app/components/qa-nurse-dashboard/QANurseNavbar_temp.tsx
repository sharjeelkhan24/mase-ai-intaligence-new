'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  BarChart3,
  CheckCircle,
  Shield,
  FileText,
  GraduationCap,
  Settings,
  LogOut,
  Stethoscope,
  Database,
  Brain
} from 'lucide-react';
import Image from 'next/image';

interface QANurseNavbarProps {
  activeTab: string;
}

export default function QANurseNavbar({ activeTab }: QANurseNavbarProps) {
  const router = useRouter();
  const [agencyName, setAgencyName] = useState('');
  const [userInfo, setUserInfo] = useState({
    email: '',
    role: '',
    agency: ''
  });

  useEffect(() => {
    // Get user information from localStorage
    const staffEmail = localStorage.getItem('staffEmail');
    const staffRole = localStorage.getItem('staffRole');
    const staffAgency = localStorage.getItem('staffAgency');
    
    if (staffEmail && staffRole && staffAgency) {
      setUserInfo({
        email: staffEmail,
        role: staffRole,
        agency: staffAgency
      });
    // Update agency name
    const updateAgencyName = () => {
      if (typeof window === 'undefined') return;
      
      let newAgencyName = 'MASE AI';
      
      // First try: staffData with agency_name
      const cachedData = localStorage.getItem('staffData');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          if (parsedData.agency_name) {
            newAgencyName = parsedData.agency_name;
          }
        } catch (e) {}
      }
      
      // Second try: staffAgency fallback
      if (newAgencyName === 'MASE AI' && staffAgency) {
        newAgencyName = staffAgency;
        
        // Update staffData if it exists but missing agency_name
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            if (!parsedData.agency_name) {
              parsedData.agency_name = staffAgency;
              localStorage.setItem('staffData', JSON.stringify(parsedData));
          } catch (e) {}
      
      setAgencyName(newAgencyName);
    };

    updateAgencyName();
    window.addEventListener('storage', updateAgencyName);
    
    return () => {
      window.removeEventListener('storage', updateAgencyName);
    };
  }, []);

  // Show loading state in navbar while user info is being loaded
  if (!userInfo) {
    return (
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col z-10">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 relative">
              <Image
                src="/images/signin/logo2.png"
                alt="MASE AI Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                {agencyName}
              </h1>
              <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                QA Nurse Portal
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/qa-nurse-dashboard' },
    { id: 'quality-checks', label: 'Quality Checks', icon: CheckCircle, href: '/qa-nurse-dashboard/quality-checks' },
    { id: 'compliance', label: 'Compliance', icon: Shield, href: '/qa-nurse-dashboard/compliance' },
    { id: 'documentation', label: 'Documentation', icon: FileText, href: '/qa-nurse-dashboard/documentation' },
    { id: 'training', label: 'Training', icon: GraduationCap, href: '/qa-nurse-dashboard/training' },
    { id: 'axcess-integration', label: 'QA Data Management', icon: Database, href: '/qa-nurse-dashboard/axcess-integration' },
    { id: 'qa-ai-analysis', label: 'QA AI Analysis', icon: Brain, href: '/qa-nurse-dashboard/qa-ai-analysis' },
    { id: 'reports', label: 'Reports', icon: BarChart3, href: '/qa-nurse-dashboard/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/qa-nurse-dashboard/settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col z-10">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 relative">
            <Image
              src="/images/signin/logo2.png"
              alt="MASE AI Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
              {(() => {
                if (typeof window === 'undefined') {
                  return 'MASE AI';
                const cachedData = localStorage.getItem('staffData');
                const staffAgency = localStorage.getItem('staffAgency');
                
                if (cachedData) {
                  try {
                    const parsedData = JSON.parse(cachedData);
                    
                    // If agency_name is missing, add it
                    if (!parsedData.agency_name && staffAgency) {
                      parsedData.agency_name = staffAgency;
                      localStorage.setItem('staffData', JSON.stringify(parsedData));
                    
                    return parsedData.agency_name || 'MASE AI';
                  } catch (e) {}
                return 'MASE AI';
              })()}
            </h1>
            <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
              QA Nurse Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-[family-name:var(--font-adlam-display)] ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        {/* User Profile */}
        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 mb-3 space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
            <span className="text-white text-sm font-semibold">
              {userInfo ? userInfo.email.substring(0, 2).toUpperCase() : 'LD'}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
              {userInfo ? userInfo.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
              {userInfo?.role || 'QA Nurse'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => router.push('/signin')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-[family-name:var(--font-adlam-display)]"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
} 
 
 } 
 
 
