"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center">
          <KeyRound className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <Card>
          <CardContent className="pt-8 pb-8 px-8">
            
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">Check your email</h3>
                  <p className="text-sm">
                    We've sent a password reset link to <strong>{email}</strong>. Please check your inbox (and spam folder) to continue.
                  </p>
                </div>
                <Link href="/login" className="inline-flex items-center justify-center text-sm font-medium text-primary hover:text-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Login
                </Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>

                <div>
                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    Send Reset Link
                  </Button>
                </div>
                
                <div className="text-center text-sm pt-2">
                  <Link href="/login" className="font-medium text-gray-600 hover:text-primary transition-colors inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to log in
                  </Link>
                </div>
              </form>
            )}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
