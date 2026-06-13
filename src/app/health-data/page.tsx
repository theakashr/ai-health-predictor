import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import HealthForm from '@/components/HealthForm';

export default function HealthDataPage() {
  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Data Entry</h1>
            <p className="text-gray-600">
              Provide your current health metrics to generate an accurate AI-powered future health risk forecast.
            </p>
          </div>
          
          <HealthForm />
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
