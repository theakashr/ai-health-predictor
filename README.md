# AI-Based Future Health Risk Monitoring System 🏥✨

An advanced, AI-powered healthcare web application built by 1st-year engineering students to predict future health risks using heuristic algorithms, historical health data, and trend analysis.

**Live Demo:** [https://ai-health-predictor-theta.vercel.app](https://ai-health-predictor-theta.vercel.app)

---

## 👥 Meet the Team
This project was collaboratively built by:
* **Akash R**
* **Akash P**
* **Adarsh B A**

## 🚀 Features
* **Authentication & Security:** Secure Email/Password & Google login powered by Firebase Auth.
* **Comprehensive Health Form:** Captures 15+ vital data points including BMI, Blood Pressure, Sugar, Oxygen, and Lifestyle habits.
* **AI Risk Prediction:** Custom prediction engine that forecasts 3, 6, and 12-month health trajectories based on user data.
* **Dynamic Analytics:** Beautiful, interactive charts (via Recharts) mapping patient vitals over time.
* **Medical Reports:** One-click generation of fully formatted, downloadable Clinical PDF Reports.
* **Admin Dashboard:** Global monitoring of all users and high-risk patients on the platform.

## 🛠️ Tech Stack
* **Frontend:** Next.js 15 (App Router), React, TypeScript
* **Styling:** Tailwind CSS, Framer Motion
* **Database & Auth:** Firebase Authentication, Cloud Firestore
* **Data Visualization:** Recharts
* **Deployment:** Vercel

---

## 💻 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/theakashr/ai-health-predictor.git
cd ai-health-predictor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Firebase Configuration
Create a `.env.local` file in the root of the project and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

### 4. Firestore Setup
* Go to your Firebase Console.
* Enable **Email/Password** Authentication.
* Create a **Firestore Database** in Test Mode.
* When running the app, if you get an index error in the console while generating predictions, click the provided Firebase link to create the required **Composite Indexes** for sorting `healthData` and `predictions`.

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Firestore Security Rules
If you are deploying this to production, make sure to update your Firestore rules to restrict access:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
