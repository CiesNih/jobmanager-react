import React, { useEffect, useMemo, useState } from 'react';
import { getAllCompanies } from '../services/companyService';
import '../styles/CompaniesSection.css';
import { useNavigate } from 'react-router-dom';

export default function CompaniesSection({ jobs = [] }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getAllCompanies();
        if (mounted) setCompanies(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        console.error('Load companies error', err);
        if (mounted) setCompanies([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  const counts = useMemo(() => {
    const m = {};
    for (const j of jobs || []) {
      
      const compId = j.maCongTy; 
      if (!compId) continue;
      m[compId] = (m[compId] || 0) + 1;
    }
    return m;
  }, [jobs]);

  if (loading) return <section className="companies-section"><p>Đang tải danh sách doanh nghiệp...</p></section>;

  return (
    <section className="companies-section">
      <div className="container">
        <h2 className="section-title">Doanh nghiệp hàng đầu đang tuyển dụng</h2>
        <span className="section-subtitle">Khám phá cơ hội nghề nghiệp tại các công ty uy tín</span>
        
        <div className="company-grid">
          {companies.map((c) => {
            const jobsCount = counts[c.maCongTy] || 0;
            
            // ==========================================
            // LOGIC XỬ LÝ LOGO MỚI Ở ĐÂY
            // ==========================================
            const displayLogo = (c.logo && c.logo.startsWith('http'))
              ? c.logo 
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.tenCongTy)}&background=random&color=fff&size=128`;
            
            return (
              <div 
                className="company-card" 
                key={c.maCongTy} 
                onClick={() => navigate(`/companies/${c.maCongTy}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="company-logo-wrapper">
                  
                  <img 
                    src={displayLogo} 
                    alt={c.tenCongTy} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.tenCongTy)}&background=random&color=fff&size=128`;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
                <div className="company-info-text">
                  <h4>{c.tenCongTy}</h4>
                  
                  <span className="company-jobs-count">
                    {jobsCount} việc làm đang tuyển
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}