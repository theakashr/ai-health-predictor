"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getLatestPrediction } from '@/lib/firestoreService';
import { Prediction } from '@/types/health';
import { Activity, ArrowRight, HeartPulse, Brain, PlusCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [latestPrediction, setLatestPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const prediction = await getLatestPrediction(user.uid);
          setLatestPrediction(prediction);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [user]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-emerald-600 bg-emerald-100 border-emerald-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-600';
  };

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome Back, {userProfile?.fullName || 'User'}
              </h1>
              <p className="mt-2 text-gray-600">
                AI Health Risk Monitoring System
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link href="/health-data">
                <Button className="flex items-center gap-2 shadow-sm">
                  <PlusCircle className="w-4 h-4" />
                  New Health Entry
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Activity className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : !latestPrediction ? (
            <Card className="text-center py-20 border-dashed border-2">
              <CardContent>
                <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Health Data Yet</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  To get your AI-powered future health risk prediction, please enter your current health data first.
                </p>
                <Link href="/health-data">
                  <Button size="lg" className="shadow-md hover-lift">
                    Enter Health Data Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              
              {/* Alert for High/Critical Risk */}
              {(latestPrediction.overallRiskLevel === 'High' || latestPrediction.overallRiskLevel === 'Critical') && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-xl border flex items-start gap-4 shadow-sm ${
                    latestPrediction.overallRiskLevel === 'Critical' 
                      ? 'bg-red-50 border-red-200 text-red-800' 
                      : 'bg-orange-50 border-orange-200 text-orange-800'
                  }`}
                >
                  <AlertTriangle className="w-7 h-7 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      {latestPrediction.overallRiskLevel === 'Critical' 
                        ? 'Critical Future Health Risk Forecast. Immediate Medical Attention Recommended.' 
                        : 'High Future Health Risk Detected. Medical Consultation Recommended.'}
                    </h3>
                    <p className="opacity-90">
                      Based on our AI trend analysis of your latest health data, you are at a significantly elevated risk for severe health complications in the coming months.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Main KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Current Health Score</p>
                    <div className="flex items-end gap-2">
                      <h3 className={`text-4xl font-bold ${getScoreColor(latestPrediction.currentHealthScore)}`}>
                        {latestPrediction.currentHealthScore}
                      </h3>
                      <span className="text-gray-400 mb-1">/100</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">Overall Future Risk</p>
                    <div className={`mt-1 inline-flex items-center px-4 py-1 rounded-full border font-bold text-lg ${getRiskColor(latestPrediction.overallRiskLevel)}`}>
                      {latestPrediction.overallRiskLevel} Risk
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">12-Month Forecast</p>
                    <div className="flex items-end gap-2">
                      <h3 className={`text-4xl font-bold ${getScoreColor(latestPrediction.predictedScore12Months)}`}>
                        {latestPrediction.predictedScore12Months}
                      </h3>
                      <span className="text-gray-400 mb-1">/100</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {latestPrediction.predictedScore12Months < latestPrediction.currentHealthScore 
                        ? 'Downward trend projected' 
                        : 'Upward trend projected'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-lift bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-md">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">AI Insights</p>
                      <h3 className="text-xl font-bold">View Full Forecast</h3>
                    </div>
                    <Link href="/predictions" className="mt-4 flex items-center text-sm font-medium text-white hover:text-blue-200 transition-colors">
                      Explore Predictions <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Predictions Summary */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <HeartPulse className="w-5 h-5 text-primary" />
                        Disease Risk Percentages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-5 mt-6">
                        {Object.entries(latestPrediction.diseaseRisks)
                          .sort(([,a], [,b]) => b - a)
                          .map(([disease, risk]) => (
                            <div key={disease}>
                              <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="capitalize text-gray-700">{disease.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className={risk > 70 ? 'text-red-600 font-bold' : risk > 40 ? 'text-yellow-600 font-bold' : 'text-emerald-600'}>
                                  {risk}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${risk}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className={`h-full rounded-full ${
                                    risk > 70 ? 'bg-red-500' : risk > 40 ? 'bg-yellow-400' : 'bg-emerald-500'
                                  }`} 
                                ></motion.div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <div className="space-y-6">
                  <Card className="h-full">
                    <CardHeader className="pb-4 bg-blue-50/50 rounded-t-xl border-b border-gray-100">
                      <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                        <Brain className="w-5 h-5 text-primary" />
                        AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-4">
                        {latestPrediction.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex gap-3 items-start">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                              {idx + 1}
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">{rec}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <Link href="/analytics">
                          <Button variant="outline" className="w-full hover-lift">
                            View Detailed Analytics
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
