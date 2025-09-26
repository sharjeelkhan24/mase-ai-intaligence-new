'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Users, Settings, LogOut, Home, Shield, CreditCard, TrendingUp } from 'lucide-react';
import { useAgencyAuth } from '@/lib/contexts/AgencyAuthContext';
import Image from 'next/image';

interface AdminNavbarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function AdminNavbar({ activeSection, onSectionChange }: AdminNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { agency, subscriptions, isLoading, clearAgencyData } = useAgencyAuth();

  // Debug logging
  console.log('AdminNavbar render - agency:', agency, 'subscriptions:', subscriptions, 'isLoading:', isLoading);

  // All possible navigation items with their subscription requirements
  const allNavigationItems = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/agency-dashboard', requiresSubscription: null }, // Always available
    { id: 'hr-management', label: 'HR Management', icon: Users, path: '/agency-dashboard/hr-management', requiresSubscription: 'HR Management' },
    { id: 'quality-assurance', label: 'Quality Assurance', icon: Shield, path: '/agency-dashboard/quality-assurance', requiresSubscription: 'Quality Assurance' },
    { id: 'billing-suite', label: 'Billing Suite', icon: CreditCard, path: '/agency-dashboard/billing-suite', requiresSubscription: 'Billing Suite' },
    { id: 'analytics-pro', label: 'Analytics Pro', icon: TrendingUp, path: '/agency-dashboard/analytics-pro', requiresSubscription: 'Analytics Pro' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/agency-dashboard/settings', requiresSubscription: null }, // Always available
  ];

  // Get active and trial subscription types
  const availableSubscriptionTypes = subscriptions
    .filter(sub => sub.status === 'active' || sub.status === 'trial')
    .map(sub => sub.subscription_type);
  console.log('Available subscription types:', availableSubscriptionTypes);
  
  // Also track which are trial for potential UI indicators
  const trialSubscriptions = subscriptions
    .filter(sub => sub.status === 'trial')
    .map(sub => sub.subscription_type);
  console.log('Trial subscriptions:', trialSubscriptions);

  // Filter navigation items based on subscriptions
  const navigationItems = allNavigationItems.filter(item => {
    if (item.requiresSubscription === null) {
      return true; // Always show Overview and Settings
    }
    return availableSubscriptionTypes.includes(item.requiresSubscription);
  });

  console.log('Filtered navigation items:', navigationItems.map(item => item.label));

  const handleNavigation = (item: typeof navigationItems[0]) => {
    // Use router to navigate to the specific page
    router.push(item.path);
    
    // Also call the callback if provided (for backward compatibility)
    if (onSectionChange) {
      onSectionChange(item.id);
    }
  };

  const getActiveSection = () => {
    // Determine active section based on current pathname
    if (pathname === '/agency-dashboard') return 'overview';
    if (pathname.includes('/hr-management')) return 'hr-management';
    if (pathname.includes('/quality-assurance')) return 'quality-assurance';
    if (pathname.includes('/billing-suite')) return 'billing-suite';
    if (pathname.includes('/analytics-pro')) return 'analytics-pro';
    if (pathname.includes('/settings')) return 'settings';
    return activeSection || 'overview';
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Clear agency data from localStorage
    localStorage.removeItem('agencyEmail');
    // Clear context data
    clearAgencyData();
    // Redirect to signin page
    router.push('/signin');
  };

  // Get initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
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
                const cachedData = localStorage.getItem('agencyData');
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
              Agency Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const currentActive = getActiveSection();
            
            
            // Regular navigation items
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-[family-name:var(--font-adlam-display)] ${
                    currentActive === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.requiresSubscription && trialSubscriptions.includes(item.requiresSubscription) && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Trial
                    </span>
                  )}
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
            {!isLoading && agency?.profile_image ? (
              <img
                src={agency.profile_image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold">
                {isLoading ? '...' : agency ? getInitials(agency.contact_name || agency.agency_name) : 'A'}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
              {isLoading ? 'Loading...' : agency?.contact_name || 'Agency Admin'}
            </p>
            <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
              {isLoading ? 'Loading...' : agency?.email || 'admin@agency.com'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-[family-name:var(--font-adlam-display)]"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
