import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CandidateListPage from './pages/CandidateListPage';
import TestAPI from './pages/TestAPI';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/candidates" element={<CandidateListPage />} />
            <Route path="/test-api" element={<TestAPI />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
}

export default App;