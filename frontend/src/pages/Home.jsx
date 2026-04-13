import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllJobs } from '../services/jobService';
import Sidebar from '../components/Sidebar';
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

  const featuredEmployers = [
    { name: 'Công Ty Cổ Phần Clever Group', jobs: 1 },
    { name: 'Công Ty Cổ phần Giao Hàng Tiết Kiệm', jobs: 1 },
    { name: 'Công Ty Cổ Phần Zinca Việt Nam', jobs: 5 },
    { name: 'Công Ty Cổ Phần VINHOMES', jobs: 17 },
    { name: 'Công Ty Cổ Phần BCONS PS', jobs: 4 }
  ];

  const popularIndustries = [
    { key: 'kinh-doanh', name: 'Kinh Doanh', count: '11K+', color: '#E6F0FF', icon: '💼' },
    { key: 'nhan-su', name: 'Nhân Sự', count: '1.9K+', color: '#FFF0F6', icon: '👥' },
    { key: 'luat', name: 'Luật', count: '510+', color: '#F5F7FF', icon: '📜' },
    { key: 'ke-toan', name: 'Kế Toán', count: '4.1K+', color: '#FFF7ED', icon: '🧾' },
    { key: 'cong-nghe', name: 'Công Nghệ', count: '1.9K+', color: '#F0FDFF', icon: '🧠' },
    { key: 'marketing', name: 'Marketing', count: '3.8K+', color: '#F0FFF6', icon: '📣' },
    { key: 'tai-chinh', name: 'Tài Chính', count: '2.2K+', color: '#FFF8F0', icon: '💰' },
    { key: 'san-xuat', name: 'Sản Xuất', count: '3.8K+', color: '#F7FBFF', icon: '🏭' },
    { key: 'logistics', name: 'Logistics', count: '3.8K+', color: '#F3FFF7', icon: '🚚' },
    { key: 'nha-hang', name: 'Nhà Hàng', count: '1.4K+', color: '#FFF5F8', icon: '🍽️' },
    { key: 'thiet-ke', name: 'Thiết Kế', count: '2.4K+', color: '#FFF8FF', icon: '🎨' },
    { key: 'y-te', name: 'Y Tế', count: '800+', color: '#FFF0F4', icon: '❤️' }
  ];

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
                 TÌM VIỆC
              </button>
            </div>

            {/* Filters */}
            <div className="filters">
              <button type="button" className="filter-btn">
                <span></span> Ngành nghề
              </button>
              <button type="button" className="filter-btn">
                <span></span> Loại hình
              </button>
              <button type="button" className="filter-btn">
                <span></span> Mức lương
              </button>
              <button type="button" className="filter-btn">
                <span></span> Chức vụ
              </button>
              <button type="button" className="filter-btn">
                <span></span> Kinh nghiệm
              </button>
              <button type="button" className="filter-btn">
                <span></span> Học vấn
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
              </div>
              )}{/* Pagination Controls */}
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
            <Sidebar />
          </aside>
        </div>
      </section>

      {/* Featured employers */}
      <section className="featured-employers">
        <div className="fe-container">
          <h3>Nhà Tuyển Dụng Tiêu Biểu</h3>
          <div className="employers-list">
            {featuredEmployers.map((e) => (
              <div key={e.name} className="employer-card">
                <div className="employer-logo">
                  <span>{e.name.charAt(0)}</span>
                </div>
                <div className="employer-name">{e.name}</div>
                <div className="employer-badge">{e.jobs} việc làm đang tuyển</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular industries */}
      <section className="popular-industries">
        <div className="pi-container">
          <div className="pi-header">
            <h3>Ngành Nghề Nổi Bật</h3>
            <a className="pi-more" href="/jobs">Xem thêm ›</a>
          </div>

          <div className="pi-grid">
            {popularIndustries.map(ind => (
              <button
                key={ind.key}
                className="pi-card"
                onClick={() => {
                  setKeyword(ind.name); // cập nhật search từ khoá nếu muốn
                  filterJobs(); // chạy filter hiện có
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                style={{ background: ind.color }}
              >
                <div className="pi-icon">{ind.icon}</div>
                <div className="pi-info">
                  <div className="pi-name">{ind.name}</div>
                  <div className="pi-count">{ind.count} Việc làm</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}