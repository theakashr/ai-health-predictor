"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getLatestPrediction, getLatestHealthData } from '@/lib/firestoreService';
import { Prediction, HealthData } from '@/types/health';
import { PDFReport } from '@/components/PDFReport';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Download, Activity, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ReportsPage() {
  const { user, userProfile } = useAuth();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const [predData, healthInfo] = await Promise.all([
            getLatestPrediction(user.uid),
            getLatestHealthData(user.uid)
          ]);
          setPrediction(predData);
          setHealthData(healthInfo);
        } catch (error) {
          console.error("Error fetching report data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Activity className="w-10 h-10 text-primary animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!prediction || !healthData || !userProfile) {
    return (
      <ProtectedRoute>
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
          <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">No Reports Available</h2>
          <p className="text-gray-600 max-w-md mx-auto text-center">
            You need to generate an AI prediction first before downloading a medical report.
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Medical Reports
            </h1>
            <p className="text-gray-600 mt-2">
              Download and securely share your AI-generated health risk forecast with your doctor.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader className="bg-blue-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Latest Comprehensive Report
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">AI Health Forecast Report</h3>
                  <p className="text-gray-500 text-sm">Generated on {new Date(prediction.createdAt).toLocaleDateString()}</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-full text-sm font-medium text-gray-700">
                    <Activity className="w-4 h-4 text-primary" />
                    Overall Risk: {prediction.overallRiskLevel}
                  </div>
                </div>
                
                <PDFDownloadLink
                  document={
                    <PDFReport 
                      userProfile={userProfile} 
                      healthData={healthData} 
                      prediction={prediction} 
                    />
                  }
                  fileName={`Health-Report-${userProfile.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`}
                >
                  {({ loading: pdfLoading }) => (
                    <Button 
                      size="lg" 
                      className="shadow-md flex items-center gap-2"
                      disabled={pdfLoading}
                    >
                      {pdfLoading ? (
                        <>Generating PDF...</>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
              
              <div className="mt-6 text-sm text-gray-500 bg-white p-4 rounded-lg border border-gray-100">
                <strong>What's included in this report:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Complete patient vitals and lifestyle summary</li>
                  <li>12-month projected health score</li>
                  <li>Specific percentage risks for 6 major disease categories</li>
                  <li>Personalized, AI-generated action plan</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
