import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// 1. Import Layouts 
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import EmployerLayout from './layouts/EmployerLayout';

// 2. Import Pages - User
import Home from './pages/user/Home';
import CompaniesPage from './pages/user/CompanyListPage';
import CompanyDetail from './pages/user/CompanyDetail';
import JobDetail from './pages/user/JobDetail';
import JobListPage from './pages/user/JobListPage';
import SalaryCalculator from './pages/user/SalaryCalculator';
import CareerGuidance from './pages/user/CareerGuidance';
import CareerArticleDetail from './pages/user/CareerArticleDetail';
import CreateCV from './pages/user/CreateCV';
import Profile from './pages/user/Profile';
import AppliedJobs from './pages/user/AppliedJobs';
import SavedJobs from './pages/user/SavedJobs';
import CareerHandbook from './pages/user/CareerHandbook';
import BlogDetail from './pages/user/BlogDetail';

// 3. Import Pages - Admin
import Dashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageEmployers from './pages/admin/ManageEmployers';
import ManageJobCategories from './pages/admin/ManageJobCategories';
import ManageJobs from './pages/admin/ManageJobs';


// 4. Import Pages - Employer (Nhà Tuyển Dụng)
import EmployerDashboard from './pages/employer/Dashboard';
import JobManagement from './pages/employer/JobManagement';
import ApplicationManagement from './pages/employer/ApplicationManagement';
import InterviewManagement from './pages/employer/InterviewManagement';
import CompanyProfile from './pages/employer/CompanyProfile';
import CandidateManagement from './pages/employer/CandidateManagement';

// 5. Test
import TestAPI from './pages/TestAPI'; 

// 3. Import Components
import ScrollToTop from './components/ScrollToTop';
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
      
      <Routes>
        {/* =========================================
            NHÁNH 1: DÀNH CHO USER
            Sử dụng UserLayout
        ========================================= */}
        <Route element={<UserLayout onOpenAuth={openAuth} />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/tools/salary-calculator" element={<SalaryCalculator />} />
          <Route path="/tools/career-guidance" element={<CareerGuidance />} />
          <Route path="/tools/career-guidance/:id" element={<CareerArticleDetail />} />
          <Route path="/tools/create-cv" element={<CreateCV />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/blog" element={<CareerHandbook />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Route>

        {/* =========================================
            NHÁNH 2: DÀNH CHO ADMIN
        ========================================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="employers" element={<ManageEmployers />} />
          <Route path="categories" element={<ManageJobCategories />} />
          <Route path="jobs" element={<ManageJobs />} />
        </Route>

        {/* =========================================
            NHÁNH 3: DÀNH CHO NHÀ TUYỂN DỤNG
        ========================================= */}
        <Route path="/employer" element={<EmployerLayout />}>
          <Route index element={<EmployerDashboard />} />
          <Route path="dashboard" element={<EmployerDashboard />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="applications" element={<ApplicationManagement />} />
          <Route path="candidates" element={<CandidateManagement />} />
          <Route path="interviews" element={<InterviewManagement />} />
          <Route path="company" element={<CompanyProfile />} />
        </Route>

        {/* =========================================
            CÁC TRANG ĐỘC LẬP
        ========================================= */}
        <Route path="/test-api" element={<TestAPI />} />
        
      </Routes>

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