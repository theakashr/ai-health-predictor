import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-gray-900 tracking-tight">
                AI Health Risk Monitor
              </span>
            </Link>
            <p className="text-gray-500 text-sm max-w-sm mb-4">
              Advanced predictive healthcare analytics using artificial intelligence to forecast future health risks and provide actionable insights for a healthier tomorrow.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">
                LinkedIn
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-primary transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link href="/predictions" className="text-sm text-gray-500 hover:text-primary transition-colors">Risk Prediction</Link>
              </li>
              <li>
                <Link href="/analytics" className="text-sm text-gray-500 hover:text-primary transition-colors">Analytics</Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-gray-500 hover:text-primary transition-colors">Reports</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-primary transition-colors">Contact</Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} AI Health Risk Monitor. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2 md:mt-0 flex items-center">
            Designed for better health outcomes
          </p>
        </div>
      </div>
    </footer>
  );
}
