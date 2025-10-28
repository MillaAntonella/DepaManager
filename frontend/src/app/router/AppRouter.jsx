import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from '../../services/api/auth';

// Public Pages
import LandingPage from '../../pages/public/LandingPage';
import AdminAuthPage from '../../pages/public/AdminAuthPage';
import TenantLoginPage from '../../pages/public/TenantLoginPage';

// Admin Pages
import AdminDashboard from '../../pages/admin/Dashboard';
import TenantsManagement from '../../pages/admin/TenantsManagement';

// Tenant Pages
import TenantLayout from '../../components/layout/TenantLayout';
import TenantDashboard from '../../pages/tenant/Dashboard';
import TenantPayments from '../../pages/tenant/Payments';
import TenantHistory from '../../pages/tenant/History';
import TenantIncidents from '../../pages/tenant/Incidents';
import TenantNotifications from '../../pages/tenant/Notifications';
import TenantProfile from '../../pages/tenant/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && currentUser?.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-auth" element={<AdminAuthPage />} />
        <Route path="/tenant-login" element={<TenantLoginPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="propietario">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tenants"
          element={
            <ProtectedRoute requiredRole="propietario">
              <TenantsManagement />
            </ProtectedRoute>
          }
        />

        {/* Tenant Routes with Layout */}
        <Route
          path="/tenant/*"
          element={
            <ProtectedRoute requiredRole="inquilino">
              <TenantLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TenantDashboard />} />
          <Route path="payments" element={<TenantPayments />} />
          <Route path="history" element={<TenantHistory />} />
          <Route path="incidents" element={<TenantIncidents />} />
          <Route path="notifications" element={<TenantNotifications />} />
          <Route path="profile" element={<TenantProfile />} />
        </Route>

        {/* Legacy tenant route redirect */}
        <Route
          path="/tenant-dashboard"
          element={<Navigate to="/tenant/dashboard" replace />}
        />

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;