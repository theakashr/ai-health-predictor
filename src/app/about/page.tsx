import React from 'react';
import { Brain, ShieldCheck, Activity, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Pioneering Predictive Healthcare</h1>
          <p className="text-xl text-gray-600">
            We believe that the future of medicine is preventative. By leveraging advanced artificial intelligence, we help individuals anticipate health risks before they become critical.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              To democratize access to predictive healthcare analytics, empowering every individual with the knowledge and foresight needed to make proactive, life-saving lifestyle changes.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Activity className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Providing accurate, AI-driven health forecasts.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Ensuring absolute data privacy and security.</span>
              </li>
              <li className="flex items-start">
                <Users className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Making complex medical data understandable for everyone.</span>
              </li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-2xl p-8 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 rounded-full"></div>
              <Brain className="h-48 w-48 text-primary relative z-10" />
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How Our AI Engine Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-primary">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Data Collection</h3>
                <p className="text-gray-600">
                  You securely input your vital signs, lifestyle habits, and medical history into our platform.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-emerald-500">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analysis</h3>
                <p className="text-gray-600">
                  Our proprietary algorithm analyzes hundreds of data points against established medical risk factors.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-orange-500">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Future Forecasting</h3>
                <p className="text-gray-600">
                  We generate a comprehensive report predicting your health trajectory over the next 12 months.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
