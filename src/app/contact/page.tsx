"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Have questions about our predictive engine or need support with your account? Our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover-lift">
            <CardContent className="pt-8 pb-8">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-2">For general inquiries and support</p>
              <a href="mailto:support@aihealthrisk.com" className="text-primary font-medium hover:underline">
                support@aihealthrisk.com
              </a>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift">
            <CardContent className="pt-8 pb-8">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-2">Mon-Fri from 8am to 5pm</p>
              <a href="tel:+18001234567" className="text-emerald-600 font-medium hover:underline">
                +1 (800) 123-4567
              </a>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift">
            <CardContent className="pt-8 pb-8">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-2">Headquarters</p>
              <p className="text-gray-900 font-medium">
                123 Health Tech Ave, Suite 500<br/>San Francisco, CA 94105
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Send us a Message</h2>
          
          {isSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center">
              <Send className="w-5 h-5 mr-3" />
              Your message has been sent successfully. We'll be in touch soon!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>
            
            <Input
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              required
            />
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>
            
            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
              Send Message
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
