import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedbackPage from './FeedbackPage';
import HomePage from './HomePage';
import LoginPage from './LoginPage'; 
import RegisterPage from './RegisterPage'; 
import QuizPage from './QuizPage';
import DataDisplayPage from './DataDisplayPage';
import LearningPlanForm from './LearningPlanForm';
import FeedbackAnalysis from './FeedbackAnalysis';
import UserPage from './UserPage';
import AdminDashboard from './AdminDashboard';
import TrainerDashboard from './TrainerDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import FileUpload from './FileUpload';
import { AuthProvider } from './AuthContext';  
import PrivateRoute from './PrivateRoute';  // Import PrivateRoute

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login-user" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/generate-learning-plan" element={<LearningPlanForm />} />
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/share-score" element={<QuizPage />} />
            <Route path="/api/feedbacks/analysis" element={<FeedbackAnalysis />} />

            {/* Protect the routes based on authentication */}
            <Route
              path="/admin-dashboard"
              element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
            />
            <Route
              path="/trainer-dashboard"
              element={<PrivateRoute><TrainerDashboard /></PrivateRoute>}
            />
            <Route
              path="/employee-dashboard"
              element={<PrivateRoute><EmployeeDashboard /></PrivateRoute>}
            />
            <Route
              path="/feedback"
              element={<PrivateRoute><FeedbackPage /></PrivateRoute>}
            />
            <Route
              path="/data"
              element={<PrivateRoute><DataDisplayPage /></PrivateRoute>}
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;