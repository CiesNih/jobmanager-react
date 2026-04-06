import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import CandidateListPage from './pages/CandidateListPage';
import TestAPI from './pages/TestAPI';
import JobDetail from './pages/JobDetail';
import JobListPage from './pages/JobListPage';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import './styles/App.css';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode = 'login') => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        setAuthMode(mode);
        setShowAuth(true);
      }, 80);
    } else {
      setAuthMode(mode);
      setShowAuth(true);
    }
  };

  const closeAuth = () => setShowAuth(false);

  return (
    <>
      <ScrollToTop />
      <Header onOpenAuth={openAuth} />
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/candidates" element={<CandidateListPage />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/test-api" element={<TestAPI />} />
          </Routes>
        </main>
      </div>
      <Footer />
      {location.pathname === '/' && showAuth && (
        <AuthModal mode={authMode} onClose={closeAuth} />
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}