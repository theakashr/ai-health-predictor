"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getUserHealthData } from '@/lib/firestoreService';
import { HealthData } from '@/types/health';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity, TrendingUp, AlertCircle } from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const data = await getUserHealthData(user.uid, 20);
          // Reverse to show chronological order (oldest to newest left to right)
          setHistory(data.reverse());
        } catch (error) {
          console.error("Error fetching analytics data:", error);
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

  if (history.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
          <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6">
            <TrendingUp className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">No Analytics Available</h2>
          <p className="text-gray-600 max-w-md mx-auto text-center">
            Enter your health data over time to unlock historical trend charts and deeper analytics.
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  // Formatting data for charts
  const chartData = history.map((item, index) => {
    const date = new Date(item.timestamp);
    return {
      name: `Entry ${index + 1}`,
      date: `${date.getMonth()+1}/${date.getDate()}`,
      bmi: item.bmi,
      sysBP: parseInt(item.bloodPressure.split('/')[0]),
      diaBP: parseInt(item.bloodPressure.split('/')[1]),
      heartRate: item.heartRate,
      sugar: item.bloodSugar,
      cholesterol: item.cholesterol
    };
  });

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              Health Trend Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Track how your vitals have changed over your last {history.length} entries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* BMI Trend */}
            <Card>
              <CardHeader className="border-b border-gray-50">
                <CardTitle>BMI Trend</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Line type="monotone" dataKey="bmi" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Blood Pressure Trend */}
            <Card>
              <CardHeader className="border-b border-gray-50">
                <CardTitle>Blood Pressure Trend</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Legend verticalAlign="top" height={36}/>
                      <Line type="monotone" dataKey="sysBP" name="Systolic" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="diaBP" name="Diastolic" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Blood Sugar vs Cholesterol */}
            <Card className="lg:col-span-2">
              <CardHeader className="border-b border-gray-50">
                <CardTitle>Blood Sugar & Cholesterol</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} cursor={{fill: '#F3F4F6'}} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar yAxisId="left" dataKey="sugar" name="Blood Sugar (mg/dL)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="cholesterol" name="Cholesterol (mg/dL)" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
