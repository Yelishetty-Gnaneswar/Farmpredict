import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ReloadPrompt from './components/ReloadPrompt';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import DataPreviewSection from './components/DataPreviewSection';
import GovIntegrationSection from './components/GovIntegrationSection';
import Footer from './components/Footer';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Components
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import CropRecommendation from './pages/dashboard/CropRecommendation';
import DiseaseDetection from './pages/dashboard/DiseaseDetection';
import WeatherInsights from './pages/dashboard/WeatherInsights';
import YieldPrediction from './pages/dashboard/YieldPrediction';
import IrrigationPlanning from './pages/dashboard/IrrigationPlanning';
import MarketPriceTracker from './pages/dashboard/MarketPriceTracker';
import DiseaseAlerts from './pages/dashboard/DiseaseAlerts';
import GovtSchemes from './pages/dashboard/GovtSchemes';
import PredictionHistory from './pages/dashboard/PredictionHistory';
import Profile from './pages/dashboard/Profile';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <DataPreviewSection />
        <GovIntegrationSection />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <ReloadPrompt />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes with Shared Layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/predict" element={<CropRecommendation />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/weather-insights" element={<WeatherInsights />} />
          <Route path="/yield-prediction" element={<YieldPrediction />} />
          <Route path="/irrigation-planner" element={<IrrigationPlanning />} />
          <Route path="/market-insights" element={<MarketPriceTracker />} />
          <Route path="/disease-alerts" element={<DiseaseAlerts />} />
          <Route path="/government-schemes" element={<GovtSchemes />} />
          <Route path="/history" element={<PredictionHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Catch all redirect to landing or dashboard if logged in */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
