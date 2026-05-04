import React, { useEffect, useMemo, useState } from 'react';
import { getAllCompanies } from '../../services/companyService';
import { getAllJobs } from '../../services/jobService';
import '../../styles/Companies.css'; 
import { useNavigate } from 'react-router-dom';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // States cho Tìm kiếm và Phân trang
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [compRes, jobRes] = await Promise.all([
          getAllCompanies(),
          getAllJobs()
        ]);
        setCompanies(Array.isArray(compRes) ? compRes : []);
        setJobs(Array.isArray(jobRes.data) ? jobRes.data : []);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Đếm số việc làm của từng công ty
  const counts = useMemo(() => {
    const m = {};
    for (const j of jobs) {
      const name = (j.tenCongTy || '').trim();
      if (!name) continue;
      m[name] = (m[name] || 0) + 1;
    }
    return m;
  }, [jobs]);

  // Lọc công ty theo từ khóa tìm kiếm
  const filteredCompanies = useMemo(() => {
    if (!keyword) return companies;
    return companies.filter(c => 
      c.tenCongTy?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [companies, keyword]);

  // Cắt mảng để Phân trang
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Lấy thời gian hiện tại (VD: T5/2026)
  const currentDate = new Date();
  const currentMonthYear = `T${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  // Dữ liệu giả lập cho thanh Category 
  const categories = [
    { title: 'Tiêu Biểu', sub: '540+ Doanh nghiệp' },
    { title: 'Nổi Bật', sub: '440+ Doanh nghiệp' },
    { title: 'Ngân Hàng', sub: '100+ Doanh nghiệp' },
    { title: 'Bảo Hiểm', sub: '35+ Doanh nghiệp' },
    { title: 'Công Nghệ', sub: '315+ Doanh nghiệp' },
    { title: 'Xây Dựng', sub: '200+ Doanh nghiệp' }
  ];

  return (
    <div className="cp-wrapper">
      <section className="cp-hero">
        <div className="cp-container">
          <h1>Các công ty hàng đầu đang tuyển dụng</h1>
          <div className="cp-search-box">
            <input 
              type="text" 
              placeholder="Nhập tên công ty..." 
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1); // Gõ tìm kiếm thì reset về trang 1
              }}
            />
            <button className="cp-btn-search">TÌM CÔNG TY</button>
          </div>
        </div>
      </section>

      <div className="cp-container">
        <h2 className="cp-main-title">Doanh nghiệp hàng đầu đang tuyển dụng</h2>

        {/*Danh mục các bộ lọc (Slider tĩnh) */}
        <div className="cp-categories">
          {categories.map((cat, index) => (
            <div className="cp-cat-card" key={index}>
              <div className="cp-cat-title">{cat.title}</div>
              <div className="cp-cat-sub">{cat.sub}</div>
            </div>
          ))}
        </div>

        {/* Tiêu đề đếm số lượng */}
        <h3 className="cp-count-title">
          {filteredCompanies.length} Doanh nghiệp đang tuyển dụng {currentMonthYear}
        </h3>

        {/* Lưới danh sách công ty */}
        {loading ? (
          <p className="cp-loading">Đang tải danh sách doanh nghiệp...</p>
        ) : (
          <div className="cp-grid">
            {paginatedCompanies.map((c) => {
              const key = c.maCongTy ?? c.tenCongTy;
              const jobsCount = counts[c.tenCongTy] || 0;

              // ==========================================
              // LOGIC XỬ LÝ LOGO ĐƯỢC CẬP NHẬT TẠI ĐÂY
              // ==========================================
              const displayLogo = (c.logo && c.logo.startsWith('http'))
                ? c.logo 
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.tenCongTy)}&background=random&color=fff&size=128`;

              return (
                <div className="cp-card" key={key} onClick={() => navigate(`/companies/${c.maCongTy}`)} style={{ cursor: 'pointer' }}>
                  <div className="cp-card-top">
                    <div className="cp-logo">
                      
                      <img 
                        src={displayLogo} 
                        alt={c.tenCongTy} 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.tenCongTy)}&background=random&color=fff&size=128`;
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </div>
                    <div className="cp-info">
                      <h4 className="cp-name">{c.tenCongTy}</h4>    
                      <p className="cp-industry" title={c.moTa}>
                        {c.moTa || 'Đa ngành nghề'}
                      </p>
                    </div>
                  </div>
                  <div className="cp-card-bottom">
                    <span className="cp-badge">{jobsCount} việc làm đang tuyển</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Phân trang (Pagination) */}
        {!loading && totalPages > 1 && (
          <div className="cp-pagination">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
            >
              {'<'}
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                className={currentPage === page ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)}
            >
              {'>'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}