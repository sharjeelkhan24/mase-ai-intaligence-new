'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Heart,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  LogOut
} from 'lucide-react';
import Image from 'next/image';
import { usePatientAuth } from '@/lib/contexts/PatientAuthContext';
import { logoutPatient } from '@/lib/utils/logoutUtils';
import { debugAgencyLookup } from '@/lib/utils/debugUtils';

interface PatientNavbarProps {
  activeTab: string;
}

export default function PatientNavbar({ activeTab }: PatientNavbarProps) {
  const { patient, clearPatientData } = usePatientAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [agencyName, setAgencyName] = useState('Loading...');

  useEffect(() => {
    // Get user information from localStorage
    const patientData = localStorage.getItem('patientData');
    
    if (patientData) {
      try {
        const parsedData = JSON.parse(patientData);
        setUserInfo({
          id: parsedData.id,
          email: parsedData.email,
          first_name: parsedData.first_name,
          last_name: parsedData.last_name,
          agency_name: parsedData.agency_name,
          profile_image: parsedData.profile_image,
          role: 'Patient'
        });
        setAgencyName(parsedData.agency_name || 'Loading...');
      } catch (error) {
        console.error('Error parsing patient data:', error);
      }
    }
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
                Patient Portal
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
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Heart, href: '/patient-dashboard' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/patient-dashboard/appointments' },
    { id: 'care-team', label: 'Care Team', icon: Users, href: '/patient-dashboard/care-team' },
    { id: 'health-records', label: 'Health Records', icon: FileText, href: '/patient-dashboard/health-records' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/patient-dashboard/messages' },
    { id: 'feedback', label: 'Feedback', icon: User, href: '/patient-dashboard/feedback' },
    { id: 'settings', label: 'Settings', icon: User, href: '/patient-dashboard/settings' }
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
                }
                const cachedData = localStorage.getItem('patientData');
                if (cachedData) {
                  try {
                    const parsedData = JSON.parse(cachedData);
                    return parsedData.agency_name || 'MASE AI';
                  } catch (e) {}
                }
                return 'MASE AI';
              })()}
            </h1>
            <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
              Patient Portal
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
            {userInfo?.profile_image ? (
              <img
                src={userInfo.profile_image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold">
                {userInfo?.first_name && userInfo?.last_name 
                  ? `${userInfo.first_name.charAt(0)}${userInfo.last_name.charAt(0)}`.toUpperCase()
                  : userInfo?.email 
                    ? userInfo.email.substring(0, 2).toUpperCase() 
                    : 'P'}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
              {userInfo?.first_name && userInfo?.last_name 
                ? `${userInfo.first_name} ${userInfo.last_name}`
                : userInfo?.email 
                  ? userInfo.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  : 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
              {userInfo?.role || 'Patient'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={async () => {
            // Get patient data from localStorage for logout
            const patientDataString = localStorage.getItem('patientData');
            if (patientDataString) {
              const patientData = JSON.parse(patientDataString);
              console.log('Patient data for logout:', patientData);
              
              // Debug agency lookup if we have agency name
              if (patientData.agency_name) {
                await debugAgencyLookup(patientData.agency_name);
              }
              
              await logoutPatient(patientData);
            } else {
              // Fallback: clear auth data even if patientData is not available
              clearPatientData();
            }
            router.push('/patient-signin');
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-[family-name:var(--font-adlam-display)]"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
