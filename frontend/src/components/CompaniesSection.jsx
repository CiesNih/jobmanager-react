import React, { useEffect, useMemo, useState } from 'react';
import { getAllCompanies } from '../services/companyService';
import '../styles/Companies.css';

export default function CompaniesSection({ jobs = [] }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getAllCompanies();
        if (mounted) setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Load companies error', err);
        if (mounted) setCompanies([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // count jobs per company by matching company name
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
      <div className="companies-header">
        <h2>Doanh nghiệp hàng đầu đang tuyển dụng</h2>
        <p className="companies-sub">Các công ty hàng đầu đang tuyển dụng</p>
      </div>

      <div className="companies-grid">
        {companies.map((c) => {
          const key = c.maCongTy ?? c.tenCongTy;
          const jobsCount = counts[c.tenCongTy] || 0;
          return (
            <div className="company-card" key={key}>
              <div className="company-logo">
                {c.logo ? (
                  <img src={c.logo} alt={c.tenCongTy} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="company-logo-placeholder">{(c.tenCongTy || 'C').charAt(0)}</div>
                )}
              </div>

              <div className="company-body">
                <h3 className="company-name">{c.tenCongTy}</h3>
                <div className="company-meta">
                  <span className="jobs-count">{jobsCount} việc làm đang tuyển</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}