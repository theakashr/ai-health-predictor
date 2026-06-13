"use client";

import React, { useEffect, useState } from 'react';
import AdminRoute from '@/components/AdminRoute';
import { getAllUsers, getAllPredictions } from '@/lib/firestoreService';
import { UserProfile, Prediction } from '@/types/health';
import { ShieldCheck, Users, Activity, AlertTriangle, Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, predsData] = await Promise.all([
          getAllUsers(),
          getAllPredictions()
        ]);
        setUsers(usersData);
        setPredictions(predsData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Activity className="w-10 h-10 text-primary animate-spin" />
        </div>
      </AdminRoute>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const totalPredictions = predictions.length;
  
  // Get latest prediction for each user to determine high risk count
  const latestPredsByUser = new Map();
  predictions.forEach(p => {
    if (!latestPredsByUser.has(p.userId) || latestPredsByUser.get(p.userId).createdAt < p.createdAt) {
      latestPredsByUser.set(p.userId, p);
    }
  });

  let highRiskCount = 0;
  latestPredsByUser.forEach(p => {
    if (p.overallRiskLevel === 'High' || p.overallRiskLevel === 'Critical') {
      highRiskCount++;
    }
  });

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminRoute>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Platform overview and user management.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <h3 className="text-3xl font-bold text-gray-900">{totalUsers}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Activity className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Predictions</p>
                  <h3 className="text-3xl font-bold text-gray-900">{totalPredictions}</h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-xl">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">High Risk Patients</p>
                  <h3 className="text-3xl font-bold text-red-600">{highRiskCount}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card>
            <CardHeader className="bg-white border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 pb-4">
              <CardTitle>User Directory</CardTitle>
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  placeholder="Search users..." 
                  className="pl-9 h-9 text-sm" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">User</th>
                      <th scope="col" className="px-6 py-3">Role</th>
                      <th scope="col" className="px-6 py-3">Joined</th>
                      <th scope="col" className="px-6 py-3">Latest Risk</th>
                      <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No users found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const userPred = latestPredsByUser.get(u.uid);
                        return (
                          <tr key={u.uid} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{u.fullName}</div>
                              <div className="text-gray-500">{u.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                u.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {u.role || 'user'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              {userPred ? (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                  userPred.overallRiskLevel === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                                  userPred.overallRiskLevel === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  userPred.overallRiskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                  {userPred.overallRiskLevel}
                                </span>
                              ) : (
                                <span className="text-gray-400 italic">No data</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AdminRoute>
  );
}
