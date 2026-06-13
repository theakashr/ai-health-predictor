"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Activity, User, Mail, Lock, Phone, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    age: '',
    gender: 'Male',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: 'bg-gray-200' });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Evaluate password strength
  useEffect(() => {
    const pwd = formData.password;
    let score = 0;
    if (pwd.length > 5) score += 1;
    if (pwd.length > 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (pwd.length === 0) {
      setPasswordStrength({ score: 0, text: '', color: 'bg-gray-200' });
    } else if (score < 3) {
      setPasswordStrength({ score: 1, text: 'Weak', color: 'bg-red-500' });
    } else if (score < 4) {
      setPasswordStrength({ score: 2, text: 'Medium', color: 'bg-yellow-500' });
    } else {
      setPasswordStrength({ score: 3, text: 'Strong', color: 'bg-emerald-500' });
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (passwordStrength.score < 2) {
      setError("Please use a stronger password.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Update Auth Profile
      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });

      // Save to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        age: parseInt(formData.age),
        gender: formData.gender,
        createdAt: Date.now(),
        role: 'user'
      });

      // Will naturally redirect via useEffect
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already in use.");
      } else {
        setError('Failed to create account. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-xl w-full space-y-8">
        
        <div className="text-center">
          <Activity className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start monitoring your future health today
          </p>
        </div>

        <Card>
          <CardContent className="pt-8 pb-8 px-8">
            <form className="space-y-6" onSubmit={handleRegister}>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="mobileNumber"
                    type="tel"
                    placeholder="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      name="age"
                      type="number"
                      placeholder="Age"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                  </div>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other' }
                    ]}
                  />
                </div>
                
                <div className="relative md:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                
                {formData.password && (
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Password Strength:</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.score === 1 ? 'text-red-500' : 
                        passwordStrength.score === 2 ? 'text-yellow-500' : 
                        passwordStrength.score === 3 ? 'text-emerald-500' : ''
                      }`}>{passwordStrength.text}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 flex gap-1">
                      <div className={`h-1.5 rounded-l-full w-1/3 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                      <div className={`h-1.5 w-1/3 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                      <div className={`h-1.5 rounded-r-full w-1/3 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                    </div>
                  </div>
                )}
                
                <div className="relative md:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Register Account
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="font-medium text-primary hover:text-blue-500 transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
