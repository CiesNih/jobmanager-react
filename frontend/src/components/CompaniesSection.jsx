import React, { useEffect, useMemo, useState } from 'react';
import { getAllCompanies } from '../services/companyService';
import '../styles/CompaniesSection.css';
import { useNavigate } from 'react-router-dom'; // THÊM DÒNG NÀY

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

  // Logic đếm số việc làm (Đã chuẩn)
  const counts = useMemo(() => {
    const m = {};
    for (const j of jobs || []) {
      const name = (j.tenCongTy || '').trim();
      if (!name) continue;
      m[name] = (m[name] || 0) + 1;
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

            const jobCount = counts[c.tenCongTy] || 0;
            
            return (
              <div 
                className="company-card" 
                key={c.maCongTy} 
                onClick={() => navigate(`/companies/${c.maCongTy}`)}
              >
                <div className="company-logo-wrapper">
                  {c.logo ? (
                    <img src={c.logo} alt={c.tenCongTy} />
                  ) : (
                    <span>{c.tenCongTy?.charAt(0)}</span>
                  )}
                </div>
                <div className="company-info-text">
                  <h4>{c.tenCongTy}</h4>
                  {/* HIỂN THỊ SỐ LƯỢNG THẬT TẠI ĐÂY */}
                  <span className="company-jobs-count">
                    {jobCount} việc làm đang tuyển
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