import { HealthData } from '../types/health';

export const calculateHealthScore = (data: HealthData): number => {
  let score = 100;

  // Deduct based on BMI
  if (data.bmi >= 25 && data.bmi < 30) score -= 5;
  else if (data.bmi >= 30 && data.bmi < 35) score -= 10;
  else if (data.bmi >= 35) score -= 15;
  else if (data.bmi < 18.5) score -= 5;

  // Deduct based on blood pressure
  const [systolic, diastolic] = data.bloodPressure.split('/').map(Number);
  if (systolic > 120 || diastolic > 80) score -= 5;
  if (systolic > 130 || diastolic > 89) score -= 10;
  if (systolic > 140 || diastolic > 90) score -= 15;

  // Deduct based on blood sugar
  if (data.bloodSugar > 100 && data.bloodSugar <= 125) score -= 5;
  if (data.bloodSugar > 125) score -= 15;

  // Deduct based on cholesterol
  if (data.cholesterol > 200 && data.cholesterol <= 239) score -= 5;
  if (data.cholesterol >= 240) score -= 10;

  // Deduct based on habits
  if (data.smokingStatus === 'Current') score -= 15;
  if (data.smokingStatus === 'Former') score -= 5;

  if (data.exerciseFrequency === 'Never') score -= 10;
  if (data.exerciseFrequency === 'Rarely') score -= 5;
  
  if (data.sleepDuration < 6) score -= 10;
  if (data.sleepDuration > 9) score -= 5;

  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score));
};

export const getRiskLevel = (score: number): 'Excellent' | 'Good' | 'Moderate' | 'High Risk' => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Moderate';
  return 'High Risk';
};
