'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAgencyAuth } from '@/lib/contexts/AgencyAuthContext';
import { Shield, ArrowLeft } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredSubscription: string;
  featureName: string;
}

export default function SubscriptionGuard({ 
  children, 
  requiredSubscription, 
  featureName 
}: SubscriptionGuardProps) {
  const { subscriptions, isLoading } = useAgencyAuth();
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Check if user has the required subscription (active or trial)
  const hasSubscription = subscriptions.some(
    sub => sub.subscription_type === requiredSubscription && 
    (sub.status === 'active' || sub.status === 'trial')
  );

  // If user doesn't have subscription, show access denied page
  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
              Access Restricted
            </h1>
            <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
              You don't have access to <span className="font-semibold">{featureName}</span>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2 font-[family-name:var(--font-adlam-display)]">
              Required Subscription
            </h3>
            <p className="text-sm text-blue-700 font-[family-name:var(--font-adlam-display)]">
              {requiredSubscription}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/agency-dashboard')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-[family-name:var(--font-adlam-display)]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            
            <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
              Contact your administrator to upgrade your subscription
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Your Current Subscriptions:
            </h4>
            {subscriptions.length > 0 ? (
              <div className="space-y-1">
                {subscriptions.map((sub) => (
                  <span
                    key={sub.id}
                    className={`inline-block text-xs px-2 py-1 rounded-full mr-1 mb-1 font-[family-name:var(--font-adlam-display)] ${
                      sub.status === 'trial' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {sub.subscription_type} {sub.status === 'trial' && '(Trial)'}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                No active subscriptions
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If user has subscription, render the protected content
  return <>{children}</>;
}
