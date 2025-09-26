'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Settings,
  LogOut,
  Stethoscope
} from 'lucide-react';
import Image from 'next/image';
import { useStaffData } from '@/lib/hooks/useStaffData';
import { logoutStaff } from '@/lib/utils/logoutUtils';

interface NurseManagerNavbarProps {
  activeTab: string;
}

export default function NurseManagerNavbar({ activeTab }: NurseManagerNavbarProps) {
  const router = useRouter();
  const { staffData, isLoading } = useStaffData();
  const [agencyName, setAgencyName] = useState('');
  const [userInitials, setUserInitials] = useState('NM');

  // Update agency name when localStorage changes
  useEffect(() => {
    const updateAgencyName = () => {
      if (typeof window === 'undefined') return;
      
      // Try multiple sources for agency name
      let newAgencyName = '';
      
      // First try: staffData with agency_name
      const cachedData = localStorage.getItem('staffData');
      const staffAgency = localStorage.getItem('staffAgency');
      
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          if (parsedData.agency_name) {
            newAgencyName = parsedData.agency_name;
          }
          
          // Set user initials from staff data
          if (parsedData?.first_name && parsedData?.last_name) {
            setUserInitials(`${parsedData.first_name.charAt(0)}${parsedData.last_name.charAt(0)}`.toUpperCase());
          }
        } catch (e) {}
      }
      
      // Second try: staffAgency fallback
      if (!newAgencyName && staffAgency) {
        newAgencyName = staffAgency;
        
        // Update staffData if it exists but missing agency_name
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            if (!parsedData.agency_name) {
              parsedData.agency_name = staffAgency;
              localStorage.setItem('staffData', JSON.stringify(parsedData));
            }
          } catch (e) {}
        }
      }
      
      setAgencyName(newAgencyName);
    };

    // Update immediately
    updateAgencyName();


    // Listen for storage changes (when other tabs update localStorage)
    window.addEventListener('storage', updateAgencyName);
    
    // Also update when staffData changes
    if (staffData?.agency_name) {
      setAgencyName(staffData.agency_name);
    }

        return () => {
          window.removeEventListener('storage', updateAgencyName);
        };
  }, [staffData]);

  // Get user display name from staffData or localStorage
  const [userDisplayName, setUserDisplayName] = useState('Nurse Manager');

  useEffect(() => {
    const getUserDisplayName = () => {
      // First try staffData from hook (this is consistent between server and client)
      if (staffData?.first_name && staffData?.last_name) {
        return `${staffData.first_name} ${staffData.last_name}`;
      }
      
      // Only access localStorage on client side after hydration
      try {
        // Try to get from localStorage (cached data)
        const cachedData = localStorage.getItem('staffData');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData?.first_name && parsedData?.last_name) {
            return `${parsedData.first_name} ${parsedData.last_name}`;
          }
        }
        
        // Fallback to email parsing
        const staffEmail = localStorage.getItem('staffEmail');
        if (staffEmail) {
          return staffEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
      } catch (e) {
        console.error('Error accessing localStorage:', e);
      }
      
      return 'Nurse Manager';
    };

    setUserDisplayName(getUserDisplayName());
  }, [staffData]);

  // Show loading state in navbar only if we have no cached data AND it's loading
  if (isLoading && typeof window !== 'undefined' && !localStorage.getItem('staffData')) {
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
                Nurse Manager Portal
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

        {/* User Profile Loading State */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 mb-3 space-y-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-gray-500 text-sm font-semibold">...</span>
            </div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/nurse-manager-dashboard' },
    { id: 'staff-schedule', label: 'Staff Schedule', icon: Calendar, href: '/nurse-manager-dashboard/staff-schedule' },
    { id: 'patient-care', label: 'Patient Care', icon: Users, href: '/nurse-manager-dashboard/patient-care' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, href: '/nurse-manager-dashboard/performance' },
    { id: 'quality', label: 'Quality', icon: CheckCircle, href: '/nurse-manager-dashboard/quality' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/nurse-manager-dashboard/messages' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/nurse-manager-dashboard/settings' },
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
              {agencyName || 'Loading...'}
            </h1>
            <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
              Nurse Manager Portal
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
            {staffData?.profile_image ? (
              <img
                src={staffData.profile_image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold">
                {userInitials}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
              {userDisplayName}
            </p>
            <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
              {staffData?.role || 'Nurse Manager'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={async () => {
            // Get staff data from localStorage for logout
            const staffDataString = localStorage.getItem('staffData');
            if (staffDataString) {
              const staffData = JSON.parse(staffDataString);
              await logoutStaff(staffData);
            } else {
              // Fallback: clear auth data even if staffData is not available
              localStorage.removeItem('staffEmail');
              localStorage.removeItem('staffRole');
              localStorage.removeItem('staffAgency');
              localStorage.removeItem('staffData');
              localStorage.removeItem('agencyEmail');
              localStorage.removeItem('agencyData');
            }
            console.log('Logged out - all authentication data cleared');
            router.push('/signin');
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
