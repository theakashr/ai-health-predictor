"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, Shield, TrendingUp, HeartPulse, Brain, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const features = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning algorithms analyze your health data to predict future risks with high accuracy."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Trend Analysis",
      description: "Track your health metrics over time and see how your lifestyle choices affect your future health trajectory."
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Multi-Period Forecasts",
      description: "Get predictive insights for the next 3, 6, and 12 months based on your current health trajectory."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Early Warning System",
      description: "Receive immediate alerts when your health metrics indicate a critical future risk."
    },
    {
      icon: <HeartPulse className="h-6 w-6 text-primary" />,
      title: "6 Disease Categories",
      description: "Comprehensive risk assessment for Heart Disease, Diabetes, Hypertension, Obesity, CVD, and Stress."
    },
    {
      icon: <Activity className="h-6 w-6 text-primary" />,
      title: "Personalized Insights",
      description: "Receive actionable, tailored recommendations based on your unique health profile and predicted risks."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                Predict Your Health Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">AI Precision</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10">
                Stop reacting to health issues and start preventing them. Our advanced AI engine analyzes your vitals and lifestyle to forecast future risks before they happen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-blue-500/30">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-blue-50 blur-3xl opacity-70"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] rounded-full bg-emerald-50 blur-3xl opacity-70"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose AI Health Risk Monitor?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We go beyond standard health tracking. Our predictive engine provides a clear window into your future health.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 modern-shadow hover-lift"
              >
                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 md:p-16 text-center text-white modern-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to Take Control of Your Future Health?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of users who are proactively managing their health with our AI-powered predictions.
            </p>
            <Link href="/register" className="relative z-10">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 hover:text-blue-700 shadow-xl">
                Create Your Account Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
