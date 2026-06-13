import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { HealthData, Prediction, UserProfile } from '@/types/health';

// Create styles
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 30, borderBottom: '2 solid #2563EB', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 12, color: '#6B7280', marginTop: 5 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', backgroundColor: '#F3F4F6', padding: 5, marginBottom: 10 },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 150, fontSize: 10, color: '#6B7280' },
  value: { flex: 1, fontSize: 10, fontWeight: 'bold' },
  diseaseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottom: '1 solid #E5E7EB' },
  diseaseName: { fontSize: 10 },
  diseaseRisk: { fontSize: 10, fontWeight: 'bold' },
  recommendation: { fontSize: 10, marginBottom: 4, lineHeight: 1.4 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, color: '#9CA3AF', textAlign: 'center', borderTop: '1 solid #E5E7EB', paddingTop: 10 }
});

interface PDFReportProps {
  userProfile: UserProfile;
  healthData: HealthData;
  prediction: Prediction;
}

export const PDFReport = ({ userProfile, healthData, prediction }: PDFReportProps) => {
  const date = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Health Risk Forecast Report</Text>
          <Text style={styles.subtitle}>Generated on: {date}</Text>
        </View>

        {/* Patient Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userProfile.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userProfile.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Age / Gender:</Text>
            <Text style={styles.value}>{healthData.age} / {healthData.gender}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Height / Weight:</Text>
            <Text style={styles.value}>{healthData.height} cm / {healthData.weight} kg (BMI: {healthData.bmi})</Text>
          </View>
        </View>

        {/* Vital Signs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Vitals</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Blood Pressure:</Text>
            <Text style={styles.value}>{healthData.bloodPressure} mmHg</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Heart Rate:</Text>
            <Text style={styles.value}>{healthData.heartRate} bpm</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Blood Sugar:</Text>
            <Text style={styles.value}>{healthData.bloodSugar} mg/dL</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cholesterol:</Text>
            <Text style={styles.value}>{healthData.cholesterol} mg/dL</Text>
          </View>
        </View>

        {/* Predictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Forecast & Predictions</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Current Health Score:</Text>
            <Text style={styles.value}>{prediction.currentHealthScore} / 100</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Predicted Score (12M):</Text>
            <Text style={styles.value}>{prediction.predictedScore12Months} / 100</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Overall Future Risk Level:</Text>
            <Text style={styles.value}>{prediction.overallRiskLevel.toUpperCase()}</Text>
          </View>
        </View>

        {/* Disease Specific Risks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specific Disease Risks (Next 12 Months)</Text>
          {Object.entries(prediction.diseaseRisks).map(([disease, risk]) => (
            <View style={styles.diseaseRow} key={disease}>
              <Text style={styles.diseaseName}>{disease.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</Text>
              <Text style={styles.diseaseRisk}>{risk}%</Text>
            </View>
          ))}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
          {prediction.recommendations.map((rec, i) => (
            <Text key={i} style={styles.recommendation}>• {rec}</Text>
          ))}
        </View>

        <Text style={styles.footer}>
          This report is generated by an Artificial Intelligence engine based on provided data. It is for informational purposes only and does not constitute medical advice. Please consult a healthcare professional for clinical decisions.
        </Text>
      </Page>
    </Document>
  );
};
