export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  age?: number;
  gender?: string;
  role?: 'user' | 'admin';
  createdAt: number;
}

export interface HealthData {
  id?: string;
  userId: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  bloodPressure: string; // e.g., "120/80"
  heartRate: number;
  cholesterol: number;
  bloodSugar: number;
  oxygenLevel: number;
  bodyTemperature: number;
  smokingStatus: string;
  exerciseFrequency: string;
  sleepDuration: number;
  familyMedicalHistory: string[];
  timestamp: number;
}

export interface Prediction {
  id?: string;
  userId: string;
  healthDataId?: string;
  currentHealthScore: number;
  predictedScore3Months: number;
  predictedScore6Months: number;
  predictedScore12Months: number;
  overallRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  diseaseRisks: {
    heartDisease: number;
    diabetes: number;
    hypertension: number;
    obesity: number;
    cardiovascularDisease: number;
    stressDisorders: number;
  };
  recommendations: string[];
  createdAt: number;
}
