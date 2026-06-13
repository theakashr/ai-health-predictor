import { HealthData, Prediction } from '../types/health';
import { calculateHealthScore } from './healthScoring';

// Base disease calculation
const calculateDiseaseRisks = (data: HealthData) => {
  let heartDisease = 10;
  let diabetes = 5;
  let hypertension = 10;
  let obesity = 5;
  let cardiovascularDisease = 10;
  let stressDisorders = 10;

  // Age factor
  if (data.age > 45) {
    heartDisease += 10;
    diabetes += 5;
    hypertension += 10;
    cardiovascularDisease += 10;
  }

  // BMI factor
  if (data.bmi > 25) {
    diabetes += 15;
    hypertension += 15;
    obesity += 40;
    heartDisease += 15;
    cardiovascularDisease += 15;
  }
  if (data.bmi > 30) {
    diabetes += 15;
    obesity += 40;
  }

  // Blood pressure
  const [systolic, diastolic] = data.bloodPressure.split('/').map(Number);
  if (systolic > 130 || diastolic > 80) {
    hypertension += 40;
    heartDisease += 20;
    cardiovascularDisease += 20;
  }

  // Blood sugar
  if (data.bloodSugar > 100) {
    diabetes += 40;
    heartDisease += 10;
  }
  if (data.bloodSugar > 125) {
    diabetes += 30;
  }

  // Cholesterol
  if (data.cholesterol > 200) {
    heartDisease += 20;
    cardiovascularDisease += 20;
  }

  // Smoking
  if (data.smokingStatus === 'Current') {
    heartDisease += 25;
    cardiovascularDisease += 30;
    hypertension += 15;
  }

  // Family History
  if (data.familyMedicalHistory.includes('Heart Disease')) heartDisease += 20;
  if (data.familyMedicalHistory.includes('Diabetes')) diabetes += 20;
  if (data.familyMedicalHistory.includes('Hypertension')) hypertension += 20;

  // Stress & Sleep
  if (data.sleepDuration < 6) {
    stressDisorders += 30;
    hypertension += 10;
  }
  if (data.heartRate > 90) {
    stressDisorders += 20;
  }

  return {
    heartDisease: Math.min(99, heartDisease),
    diabetes: Math.min(99, diabetes),
    hypertension: Math.min(99, hypertension),
    obesity: Math.min(99, obesity),
    cardiovascularDisease: Math.min(99, cardiovascularDisease),
    stressDisorders: Math.min(99, stressDisorders),
  };
};

const getRecommendations = (data: HealthData, risks: any): string[] => {
  const recs: string[] = [];

  if (risks.heartDisease > 60 || risks.cardiovascularDisease > 60) {
    recs.push("Schedule a cardiovascular check-up soon.");
    if (data.cholesterol > 200) recs.push("Reduce saturated fats and cholesterol in your diet.");
  }
  
  if (risks.diabetes > 60 || data.bloodSugar > 100) {
    recs.push("Reduce sugar intake and monitor your blood glucose levels.");
  }

  if (risks.hypertension > 60) {
    recs.push("Monitor blood pressure regularly and limit sodium intake.");
  }

  if (data.bmi > 25) {
    recs.push("Engage in at least 30 minutes of moderate exercise daily.");
  }

  if (data.smokingStatus === 'Current') {
    recs.push("Consider smoking cessation programs to significantly lower health risks.");
  }

  if (data.sleepDuration < 7) {
    recs.push("Improve sleep quality; aim for 7-8 hours per night.");
  }

  if (recs.length === 0) {
    recs.push("Maintain your current healthy lifestyle and continue regular check-ups.");
  }

  return recs;
};

export const generatePrediction = (
  currentData: HealthData, 
  historicalData: HealthData[]
): Omit<Prediction, 'id' | 'createdAt'> => {
  
  const currentScore = calculateHealthScore(currentData);
  const risks = calculateDiseaseRisks(currentData);
  
  // Predict future scores based on current risks
  const maxRisk = Math.max(...Object.values(risks));
  
  // Trend factor based on max risk
  const degradationFactor = maxRisk / 100;
  
  // In 3 months
  let p3 = currentScore - (5 * degradationFactor);
  // In 6 months
  let p6 = currentScore - (10 * degradationFactor);
  // In 12 months
  let p12 = currentScore - (15 * degradationFactor);
  
  // Adjust based on exercise & habits (positive trend)
  if (currentData.exerciseFrequency === 'Daily' && currentData.smokingStatus === 'Never') {
    p3 += 2; p6 += 5; p12 += 10;
  }

  const overallRiskLevel = maxRisk > 90 ? 'Critical' : maxRisk > 70 ? 'High' : maxRisk > 40 ? 'Medium' : 'Low';

  return {
    userId: currentData.userId,
    healthDataId: currentData.id,
    currentHealthScore: Math.round(currentScore),
    predictedScore3Months: Math.min(100, Math.max(0, Math.round(p3))),
    predictedScore6Months: Math.min(100, Math.max(0, Math.round(p6))),
    predictedScore12Months: Math.min(100, Math.max(0, Math.round(p12))),
    overallRiskLevel,
    diseaseRisks: risks,
    recommendations: getRecommendations(currentData, risks),
  };
};
