"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getLatestPrediction } from '@/lib/firestoreService';
import { Prediction } from '@/types/health';
import FutureRiskChart from '@/components/FutureRiskChart';
import { Activity, Brain, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PredictionsPage() {
  const { user } = useAuth();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const data = await getLatestPrediction(user.uid);
          setPrediction(data);
        } catch (error) {
          console.error("Error fetching prediction data:", error);
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

  if (!prediction) {
    return (
      <ProtectedRoute>
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
          <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6">
            <Brain className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">No AI Prediction Found</h2>
          <p className="text-gray-600 max-w-md mx-auto text-center mb-8">
            You need to enter your health data first so our AI engine can analyze your trends and generate a forecast.
          </p>
          <Link href="/health-data">
            <Button size="lg" className="shadow-lg hover-lift">
              Enter Health Data
            </Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  const isCritical = prediction.overallRiskLevel === 'Critical';
  const isHigh = prediction.overallRiskLevel === 'High';

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-primary mb-2 inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="w-8 h-8 text-primary" />
                Future Risk Forecast
              </h1>
            </div>
            <div>
              <Link href="/health-data">
                <Button variant="outline" className="flex items-center gap-2 bg-white">
                  <RefreshCw className="w-4 h-4" />
                  Update Data & Recalculate
                </Button>
              </Link>
            </div>
          </div>

          {(isHigh || isCritical) && (
            <div className={`p-5 rounded-xl border flex items-start gap-4 shadow-sm mb-8 ${
              isCritical ? 'bg-red-50 border-red-200 text-red-800' : 'bg-orange-50 border-orange-200 text-orange-800'
            }`}>
              <AlertTriangle className="w-7 h-7 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">
                  {isCritical 
                    ? 'Critical Future Health Risk Forecast. Immediate Medical Attention Recommended.' 
                    : 'High Future Health Risk Detected. Medical Consultation Recommended.'}
                </h3>
                <p className="opacity-90">
                  Based on our AI trend analysis of your latest health data, you are at a significantly elevated risk for severe health complications. Please review the detailed disease risks below.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Chart & Disease Breakdown */}
            <div className="lg:col-span-2 space-y-8">
              
              <Card>
                <CardHeader className="border-b border-gray-50">
                  <CardTitle>Health Score Trajectory (12 Months)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <FutureRiskChart prediction={prediction} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-gray-50">
                  <CardTitle>Specific Disease Risks Forecast</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(prediction.diseaseRisks)
                      .sort(([,a], [,b]) => b - a)
                      .map(([disease, risk]) => (
                        <div key={disease} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex justify-between text-sm font-medium mb-3">
                            <span className="capitalize text-gray-900">{disease.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className={risk > 70 ? 'text-red-600 font-bold' : risk > 40 ? 'text-yellow-600 font-bold' : 'text-emerald-600 font-bold'}>
                              {risk}% Risk
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                risk > 70 ? 'bg-red-500' : risk > 40 ? 'bg-yellow-400' : 'bg-emerald-500'
                              }`} 
                              style={{ width: `${risk}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                            {risk > 70 
                              ? 'High probability based on current vitals and lifestyle trends. Immediate action required.' 
                              : risk > 40 
                              ? 'Moderate risk detected. Consider preventative measures.' 
                              : 'Low probability. Keep maintaining healthy habits.'}
                          </p>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column: AI Insights */}
            <div className="space-y-8">
              
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-lg">
                <CardContent className="p-8">
                  <p className="text-gray-400 font-medium mb-2 uppercase tracking-wider text-xs">Prediction Summary</p>
                  <h3 className="text-3xl font-bold mb-6">
                    Your health is trending <span className={prediction.predictedScore12Months > prediction.currentHealthScore ? 'text-emerald-400' : 'text-red-400'}>
                      {prediction.predictedScore12Months > prediction.currentHealthScore ? 'upwards' : 'downwards'}
                    </span>.
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                      <span className="text-gray-300">Current Score</span>
                      <span className="font-bold text-xl">{prediction.currentHealthScore}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                      <span className="text-gray-300">In 6 Months</span>
                      <span className="font-bold text-xl text-blue-300">{prediction.predictedScore6Months}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">In 12 Months</span>
                      <span className="font-bold text-xl text-blue-400">{prediction.predictedScore12Months}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-blue-50/50 rounded-t-xl border-b border-gray-100">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Personalized Action Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {prediction.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 text-sm leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <Link href="/reports">
                      <Button className="w-full">
                        Download Detailed PDF Report
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
