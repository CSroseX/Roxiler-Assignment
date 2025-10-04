import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserRole } from './types';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import UserDashboard from './pages/UserDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/store-owner"
            element={
              <ProtectedRoute allowedRoles={[UserRole.STORE_OWNER]}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[UserRole.USER]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/unauthorized" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Unauthorized Access</h2>
                    <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
                  </div>
                </div>
              </div>
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
