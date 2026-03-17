import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCandidates } from '../services/candidateService';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  const itemsPerPage = 6;

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [keyword, location, candidates]);

  const fetchCandidates = async () => {
    try {
      const res = await getAllCandidates();
      setCandidates(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = candidates;

    if (keyword) {
      filtered = filtered.filter(c =>
        c.tieuDeHoSo?.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(c =>
        c.diaChi?.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredCandidates(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterCandidates();
  };

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Tìm Việc Làm & Ứng Viên Phù Hợp</h1>
          <p>Nền tảng kết nối tuyển dụng hàng đầu</p>

          {/* Search Bar */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-inputs">
              <div className="search-group">
                <label>Từ khóa:</label>
                <input
                  type="text"
                  placeholder="Vị trí công việc, Quản Lý..."
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
                Danh sách ứng viên{' '}
                <span className="highlight">{filteredCandidates.length}</span> kết quả
              </h2>
              <div className="pagination-info">
                {filteredCandidates.length > 0 ? (
                  <span>
                    Ứng viên {(currentPage - 1) * itemsPerPage + 1} -{' '}
                    {Math.min(currentPage * itemsPerPage, filteredCandidates.length)} /
                    {filteredCandidates.length}
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
            {!loading && filteredCandidates.length === 0 && (
              <div className="empty-state">
                <p>😕 Không tìm thấy ứng viên phù hợp</p>
              </div>
            )}

            {/* Job Cards Grid */}
            {!loading && paginatedCandidates.length > 0 && (
              <div className="jobs-grid">
                {paginatedCandidates.map(candidate => (
                  <div key={candidate.maUngVien} className="job-card">
                    {/* Card Header */}
                    <div className="card-header">
                      <div className="company-logo">
                        <span>{candidate.tieuDeHoSo?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="card-header-content">
                        <h3 className="job-title">{candidate.tieuDeHoSo}</h3>
                        <p className="company-name">Ứng Viên</p>
                      </div>
                      <button
                        className={`btn-favorite ${
                          favorites.includes(candidate.maUngVien) ? 'active' : ''
                        }`}
                        onClick={() => toggleFavorite(candidate.maUngVien)}
                      >
                        ♡
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      <p className="location">
                        📍 <strong>{candidate.diaChi || 'Chưa cập nhật'}</strong>
                      </p>
                      <p className="salary">
                        💰 <strong>{candidate.soNamKinhNghiem || 0} năm kinh nghiệm</strong>
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer">
                      <div className="job-tags">
                        <span className="tag">Full-time</span>
                        <span className="tag">
                          {candidate.soNamKinhNghiem || 0}+ năm
                        </span>
                        <span className="tag">13 phút trước</span>
                      </div>
                    </div>

                    {/* Card Action */}
                    <button
                      className="btn-apply"
                      onClick={() => navigate(`/candidates`)}
                    >
                      Xem Chi Tiết
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredCandidates.length > 0 && (
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