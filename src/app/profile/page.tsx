"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { User as UserIcon, Mail, Phone, Calendar, Clock, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { userProfile, logout } = useAuth();

  if (!userProfile) return null;

  const joinDate = new Date(userProfile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and personal information.</p>
          </div>

          <div className="space-y-6">
            
            {/* Profile Overview */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 bg-blue-100 text-primary rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-md">
                    <UserIcon className="w-10 h-10" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">{userProfile.fullName}</h2>
                    <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1">
                      <Mail className="w-4 h-4" /> {userProfile.email}
                    </p>
                    <div className="mt-3 inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                      Active Account
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card>
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-lg">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <UserIcon className="w-4 h-4" /> Full Name
                    </p>
                    <p className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-100">{userProfile.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> Email Address
                    </p>
                    <p className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-100">{userProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" /> Mobile Number
                    </p>
                    <p className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                      {userProfile.mobileNumber || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Age & Gender
                    </p>
                    <p className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                      {userProfile.age ? `${userProfile.age} yrs` : 'Not provided'} • {userProfile.gender || 'Not provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-primary rounded-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Member Since</p>
                      <p className="text-sm text-gray-500">{joinDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-primary rounded-lg">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Account Role</p>
                      <p className="text-sm text-gray-500 capitalize">{userProfile.role}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button variant="danger" className="w-full flex items-center justify-center gap-2" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
