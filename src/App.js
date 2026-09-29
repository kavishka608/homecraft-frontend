import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

// Public pages
import Home from './pages/Home';
import Professionals from './pages/Professionals';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfessionalProfile from './pages/ProfessionalProfile';

// Role-specific pages
import Profile from './pages/Profile';
import PostProject from './pages/PostProject';
import MyBids from './pages/MyBids';
import PortfolioUpload from './pages/PortfolioUpload';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminApprovals from './pages/AdminApprovals';
import AdminUsers from './pages/AdminUsers';
import AdminProjects from './pages/AdminProjects';
import AdminSettings from './pages/AdminSettings';

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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#ffffff',
            color: '#1F2937',
            padding: '14px 18px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #E5E7EB',
            maxWidth: '420px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff',
            },
            style: {
              border: '1px solid #FECACA',
              background: '#FEF2F2',
            },
          },
        }}
      />

      <Routes>

        {/* ============================================ */}
        {/* ADMIN ROUTES — with shared sidebar layout */}
        {/* ============================================ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="approvals" element={<AdminApprovals />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ============================================ */}
        {/* PUBLIC + CLIENT + PROFESSIONAL ROUTES */}
        {/* ============================================ */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>

                  {/* Public */}
                  <Route path="/" element={<Home />} />
                  <Route path="/professionals" element={<Professionals />} />
                  <Route path="/professionals/:id" element={<ProfessionalProfile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Projects — list */}
                  <Route
                    path="/projects"
                    element={
                      <ProtectedRoute allowedRoles={['CLIENT', 'HOMEOWNER', 'PROFESSIONAL', 'ADMIN']}>
                        <Projects />
                      </ProtectedRoute>
                    }
                  />

                  {/* Project Detail */}
                  <Route
                    path="/projects/:id"
                    element={
                      <ProtectedRoute allowedRoles={['CLIENT', 'HOMEOWNER', 'ADMIN']}>
                        <ProjectDetail />
                      </ProtectedRoute>
                    }
                  />

                  {/* Client */}
                  <Route
                    path="/post-project"
                    element={
                      <ProtectedRoute allowedRoles={['CLIENT', 'HOMEOWNER']}>
                        <PostProject />
                      </ProtectedRoute>
                    }
                  />

                  {/* Professional */}
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

                  {/* Shared */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;