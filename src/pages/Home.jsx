import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllJobs } from '../services/jobService';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  const itemsPerPage = 6;

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [keyword, location, jobs]);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (keyword) {
      filtered = filtered.filter(job =>
        job.tieuDe?.toLowerCase().includes(keyword.toLowerCase()) ||
        job.tenCongTy?.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(job =>
        job.diaDiem?.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterJobs();
  };

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Tìm Việc Làm Phù Hợp</h1>
          <p>Nền tảng kết nối tuyển dụng hàng đầu</p>

          {/* Search Bar */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-inputs">
              <div className="search-group">
                <label>Từ khóa:</label>
                <input
                  type="text"
                  placeholder="Vị trí công việc, công ty..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="search-group">
                <label>Địa điểm:</label>
                <input
                  type="text"
                  placeholder="Tính/Thành phố, Quận/Huyện..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-search">
                🔍 TÌM VIỆC
              </button>
            </div>

            {/* Filters */}
            <div className="filters">
              <button type="button" className="filter-btn">
                <span>🏢</span> Ngành nghề
              </button>
              <button type="button" className="filter-btn">
                <span>📋</span> Loại hình
              </button>
              <button type="button" className="filter-btn">
                <span>💰</span> Mức lương
              </button>
              <button type="button" className="filter-btn">
                <span>👤</span> Chức vụ
              </button>
              <button type="button" className="filter-btn">
                <span>⭐</span> Kinh nghiệm
              </button>
              <button type="button" className="filter-btn">
                <span>🎓</span> Học vấn
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section">
        <div className="results-container">
          {/* Main Content */}
          <div className="main-content">
            {/* Results Header */}
            <div className="results-header">
              <h2>
                Danh sách việc làm{' '}
                <span className="highlight">{filteredJobs.length}</span> kết quả
              </h2>
              <div className="pagination-info">
                {filteredJobs.length > 0 ? (
                  <span>
                    Việc làm {(currentPage - 1) * itemsPerPage + 1} -{' '}
                    {Math.min(currentPage * itemsPerPage, filteredJobs.length)} /
                    {filteredJobs.length}
                  </span>
                ) : (
                  <span>Không có kết quả</span>
                )}
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredJobs.length === 0 && (
              <div className="empty-state">
                <p>😕 Không tìm thấy việc làm phù hợp</p>
              </div>
            )}

            {/* Job Cards Grid */}
            {!loading && paginatedJobs.length > 0 && (
              <div className="jobs-grid">
                {paginatedJobs.map(job => (
                  <div key={job.maViecLam} className="job-card">
                    <div className="card-header">
                      <div className="company-logo">
                        <span>{job.tieuDe?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="card-header-content">
                        <h3 className="job-title" style={{ color: '#d32f2f' }}>{job.tieuDe}</h3>
                        <p className="company-name">{job.tenCongTy}</p>
                      </div>
                      <button
                       className={`btn-favorite ${favorites.includes(job.maViecLam) ? 'active' : ''}`}
                       onClick={() => toggleFavorite(job.maViecLam)}
                     >
                      ♡
                      </button>
                      </div>
                      {/* Card Body */}
                      <div className="card-body">
                      <p className="location">
                      📍 <strong>{job.diaDiem || 'Bình Dương'}</strong>
                      </p>
                      <p className="salary">
                       💰<strong>
                      {job.luongToiThieu?.toLocaleString()} - {job.luongToiDa?.toLocaleString()} VNĐ
                      </strong>
                      </p>
                  </div>
                  {/* Card Footer */}
                  <div className="card-footer">
                   <div className="job-tags">
                    <span className="tag">{job.loaiHinhCongViec || 'Full-time'}</span>
                    <span className="tag">Mới đăng</span>
                    <span className="tag">13 phút trước</span>
                    </div>
                  </div>

                  {/* Card Action */}
                  <button
                  className="btn-apply"
                  onClick={() => navigate(`/jobs/${job.maViecLam}`)}
                  >
                  Xem Chi Tiết
                </button>
              </div>
            ))}
              </div>)}
            {/* Pagination */}
            {!loading && filteredJobs.length > 0 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  ← Trang trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={() =>
                    setCurrentPage(prev => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Trang sau →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>📢 Thông Báo Tuyển Dụng</h3>
              <p>Hãy đăng ký để nhận thông báo về các việc làm mới phù hợp với bạn</p>
              <button className="btn-register">Đăng Ký Ngay</button>
            </div>

            <div className="sidebar-card">
              <h3>💡 Mẹo Tuyển Dụng</h3>
              <ul>
                <li>✓ Cập nhật CV thường xuyên</li>
                <li>✓ Điền đầy đủ thông tin</li>
                <li>✓ Kiểm tra email thường xuyên</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}