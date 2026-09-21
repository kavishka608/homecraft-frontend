import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public pages
import Home from './pages/Home';
import Professionals from './pages/Professionals';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfessionalProfile from './pages/ProfessionalProfile';

// Role-specific pages
import Profile from './pages/Profile';
import PostProject from './pages/PostProject';
import MyProjects from './pages/MyProjects';
import MyBids from './pages/MyBids';
import PortfolioUpload from './pages/PortfolioUpload';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminApprovals from './pages/AdminApprovals';

// ============ Protected route wrapper ============
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-gray-50">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
        <a href="/" className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700">
          Go Home
        </a>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>

            {/* ============ PUBLIC ============ */}
            <Route path="/" element={<Home />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/professionals/:id" element={<ProfessionalProfile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ============ CLIENT ============ */}
            <Route
              path="/post-project"
              element={
                <ProtectedRoute allowedRoles={['CLIENT', 'HOMEOWNER']}>
                  <PostProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-projects"
              element={
                <ProtectedRoute allowedRoles={['CLIENT', 'HOMEOWNER']}>
                  <MyProjects />
                </ProtectedRoute>
              }
            />

            {/* ============ PROFESSIONAL ============ */}
            <Route
              path="/my-bids"
              element={
                <ProtectedRoute allowedRoles={['PROFESSIONAL']}>
                  <MyBids />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute allowedRoles={['PROFESSIONAL']}>
                  <PortfolioUpload />
                </ProtectedRoute>
              }
            />

            {/* ============ SHARED (any logged-in user) ============ */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ============ ADMIN ============ */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminApprovals />
                </ProtectedRoute>
              }
            />

            {/* ============ FALLBACK ============ */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;