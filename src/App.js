import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // <--- Added Navigate here
import './App.css'; 
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Professionals from './pages/Professionals';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminApprovals from './pages/AdminApprovals';
import PortfolioUpload from './pages/PortfolioUpload';
import ProfessionalProfile from './pages/ProfessionalProfile'; // <--- Fixed path (removed leading slash)

// This component checks if the user is an Admin
const ProtectedAdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  if (role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/professionals/:id" element={<ProfessionalProfile />} /> {/* <--- Added this route */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/portfolio" element={<PortfolioUpload />} />
            
            {/* PROTECTED ADMIN ROUTES */}
            <Route path="/admin/dashboard" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/approvals" element={
              <ProtectedAdminRoute>
                <AdminApprovals />
              </ProtectedAdminRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;