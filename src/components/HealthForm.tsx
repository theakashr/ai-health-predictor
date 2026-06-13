"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { addHealthData, addPrediction, getUserHealthData } from '@/lib/firestoreService';
import { generatePrediction } from '@/lib/predictionEngine';
import { HealthData } from '@/types/health';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity, HeartPulse, Scale, Droplets, Thermometer, Moon, Cigarette, Activity as Exercise } from 'lucide-react';

export default function HealthForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    heartRate: '',
    cholesterol: '',
    bloodSugar: '',
    oxygenLevel: '',
    bodyTemperature: '',
    smokingStatus: 'Never',
    exerciseFrequency: 'Occasionally',
    sleepDuration: '',
    familyMedicalHistory: [] as string[]
  });

  const familyHistoryOptions = [
    'Heart Disease', 'Diabetes', 'Hypertension', 'Obesity', 'Cancer', 'Stroke'
  ];

  const handleFamilyHistoryChange = (item: string) => {
    setFormData(prev => {
      const list = prev.familyMedicalHistory;
      if (list.includes(item)) {
        return { ...prev, familyMedicalHistory: list.filter(i => i !== item) };
      } else {
        return { ...prev, familyMedicalHistory: [...list, item] };
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError('');
    setIsSubmitting(true);

    try {
      // Calculate BMI
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      const bmi = weightInKg / (heightInMeters * heightInMeters);

      const healthDataEntry: Omit<HealthData, 'id' | 'timestamp'> = {
        userId: user.uid,
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: weightInKg,
        bmi: parseFloat(bmi.toFixed(1)),
        bloodPressure: `${formData.bloodPressureSys}/${formData.bloodPressureDia}`,
        heartRate: parseInt(formData.heartRate),
        cholesterol: parseInt(formData.cholesterol),
        bloodSugar: parseInt(formData.bloodSugar),
        oxygenLevel: parseInt(formData.oxygenLevel),
        bodyTemperature: parseFloat(formData.bodyTemperature),
        smokingStatus: formData.smokingStatus,
        exerciseFrequency: formData.exerciseFrequency,
        sleepDuration: parseInt(formData.sleepDuration),
        familyMedicalHistory: formData.familyMedicalHistory
      };

      // Save Health Data
      const healthDataId = await addHealthData(healthDataEntry);
      
      // Generate Prediction
      const fullHealthData = { id: healthDataId, timestamp: Date.now(), ...healthDataEntry };
      
      // Optional: fetch history for trend analysis
      const history = await getUserHealthData(user.uid, 5);
      
      const prediction = generatePrediction(fullHealthData, history);
      
      // Save Prediction
      await addPrediction(prediction);

      // Redirect to predictions page to show the new result
      router.push('/predictions');

    } catch (err) {
      console.error(err);
      setError('Failed to save health data and generate prediction.');
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-blue-50/50 border-b border-gray-100 pb-4">
        <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
          <Activity className="w-5 h-5 text-primary" />
          Enter Health Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Age (Years)" name="age" type="number" min="1" max="120" required value={formData.age} onChange={handleChange} />
              <Select label="Gender" name="gender" required value={formData.gender} onChange={handleChange} options={[{value: 'Male', label:'Male'}, {value: 'Female', label:'Female'}, {value: 'Other', label:'Other'}]} />
              <Input label="Height (cm)" name="height" type="number" min="50" max="250" required value={formData.height} onChange={handleChange} />
              <Input label="Weight (kg)" name="weight" type="number" min="20" max="300" required value={formData.weight} onChange={handleChange} />
            </div>
          </div>

          {/* Section 2: Vitals */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-red-500" /> Vital Signs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-4">
                <Input label="Sys BP (mmHg)" name="bloodPressureSys" type="number" min="70" max="250" placeholder="e.g. 120" required value={formData.bloodPressureSys} onChange={handleChange} />
                <Input label="Dia BP (mmHg)" name="bloodPressureDia" type="number" min="40" max="150" placeholder="e.g. 80" required value={formData.bloodPressureDia} onChange={handleChange} />
              </div>
              <Input label="Heart Rate (bpm)" name="heartRate" type="number" min="40" max="200" required value={formData.heartRate} onChange={handleChange} />
              <Input label="Body Temp (°F)" name="bodyTemperature" type="number" step="0.1" min="90" max="108" required value={formData.bodyTemperature} onChange={handleChange} />
            </div>
          </div>

          {/* Section 3: Blood Work */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-red-500" /> Blood Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Cholesterol (mg/dL)" name="cholesterol" type="number" min="50" max="500" required value={formData.cholesterol} onChange={handleChange} />
              <Input label="Fasting Sugar (mg/dL)" name="bloodSugar" type="number" min="40" max="400" required value={formData.bloodSugar} onChange={handleChange} />
              <Input label="Oxygen Level (%)" name="oxygenLevel" type="number" min="70" max="100" required value={formData.oxygenLevel} onChange={handleChange} />
            </div>
          </div>

          {/* Section 4: Lifestyle */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
              <Exercise className="w-5 h-5 text-emerald-500" /> Lifestyle Factors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select 
                label="Smoking Status" 
                name="smokingStatus" 
                required 
                value={formData.smokingStatus} 
                onChange={handleChange}
                options={[
                  {value: 'Never', label:'Never'}, 
                  {value: 'Former', label:'Former'}, 
                  {value: 'Current', label:'Current'}
                ]} 
              />
              <Select 
                label="Exercise Frequency" 
                name="exerciseFrequency" 
                required 
                value={formData.exerciseFrequency} 
                onChange={handleChange}
                options={[
                  {value: 'Daily', label:'Daily'}, 
                  {value: 'Weekly', label:'Weekly'}, 
                  {value: 'Occasionally', label:'Occasionally'},
                  {value: 'Rarely', label:'Rarely'},
                  {value: 'Never', label:'Never'}
                ]} 
              />
              <Input label="Sleep Duration (hrs)" name="sleepDuration" type="number" min="0" max="24" required value={formData.sleepDuration} onChange={handleChange} />
            </div>
          </div>

          {/* Section 5: Family History */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Family Medical History</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {familyHistoryOptions.map(option => (
                <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={formData.familyMedicalHistory.includes(option)}
                    onChange={() => handleFamilyHistoryChange(option)}
                  />
                  <span className="text-sm font-medium text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button type="submit" size="lg" className="w-full shadow-lg" isLoading={isSubmitting}>
              Generate AI Health Prediction
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              By submitting, you agree to our data processing terms. All data is encrypted and secure.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
