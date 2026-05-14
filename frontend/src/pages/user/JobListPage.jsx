import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllJobs } from '../../services/jobService';
import Sidebar from '../../components/Sidebar';
import '../../styles/Home.css';
import '../../styles/JobList.css';
import { CATEGORIES } from '../../utils/categoryData';

export default function JobListPage() {
  const navigate = useNavigate();
  
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSalary, setFilterSalary] = useState('');

  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const itemsPerPage = 10;

  const extractCategory = (tieuDe) => {
    const title = (tieuDe || '').toLowerCase();
    
    if (title.includes('lập trình') || title.includes('developer') || title.includes('it') || title.includes('code')) return 'Công nghệ';
    if (title.includes('bán hàng') || title.includes('sales')) return 'Bán hàng';
    if (title.includes('kế toán') || title.includes('tài chính')) return 'Kế toán';
    if (title.includes('marketing') || title.includes('tiếp thị')) return 'Marketing';
    if (title.includes('nhân sự') || title.includes('hr')) return 'Nhân sự';
    if (title.includes('thiết kế') || title.includes('designer')) return 'Thiết kế';
    if (title.includes('quản lý') || title.includes('manager')) return 'Quản lý';
    if (title.includes('tư vấn')) return 'Tư vấn';
    
    return 'Khác';
  };

  const getUniqueCategories = () => {
    const categories = new Set(jobs.map(j => extractCategory(j.tieuDe))); // ← Bây giờ jobs accessible
    return Array.from(categories).sort();
  };

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    applyFilters();
  }, [keyword, location, jobs, filterCategory, filterType, filterSalary]); 

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const favoriteIds = savedJobs.map(job => job.maViecLam);
    setFavorites(favoriteIds);
  }; 

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      const data = res?.data || [];
      setJobs(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let out = jobs;
    
    // 1. Lọc theo Từ khóa
    if (keyword) {
      const k = keyword.toLowerCase();
      out = out.filter(j =>
        (j.tieuDe || '').toLowerCase().includes(k) ||
        (j.tenCongTy || '').toLowerCase().includes(k)
      );
    }
    
    // 2. Lọc theo Địa điểm
    if (location) {
      const l = location.toLowerCase();
      out = out.filter(j => (j.diaDiem || '').toLowerCase().includes(l));
    }

    // 3. Lọc theo Ngành nghề (NEW)
    if (filterCategory) {
      out = out.filter(j => extractCategory(j.tieuDe) === filterCategory);
    }

    // 4. Lọc theo Loại hình
    if (filterType) {
      out = out.filter(j => (j.loaiHinhCongViec || '').toLowerCase() === filterType.toLowerCase());
    }

    // 5. Lọc theo Mức lương
    if (filterSalary) {
      out = out.filter(j => {
        const min = j.luongToiThieu || 0;
        if (filterSalary === 'duoi10') return min > 0 && min < 10000000;
        if (filterSalary === '10-20') return min >= 10000000 && min <= 20000000;
        if (filterSalary === 'tren20') return min > 20000000;
        return true;
      });
    }

    setFiltered(out);
    setCurrentPage(1); 
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const toggleFavorite = (e, job) => {
    e.stopPropagation(); // Prevent card click
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (!savedUser) {
      alert('Vui lòng đăng nhập để lưu việc làm!');
      return;
    }

    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isSaved = savedJobs.some(j => j.maViecLam === job.maViecLam);
    
    if (isSaved) {
      // Remove from saved
      const updatedJobs = savedJobs.filter(j => j.maViecLam !== job.maViecLam);
      localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
      setFavorites(prev => prev.filter(id => id !== job.maViecLam));
      alert('Đã bỏ lưu việc làm này!');
    } else {
      // Add to saved
      const savedJob = {
        ...job,
        savedAt: new Date().toISOString()
      };
      savedJobs.push(savedJob);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setFavorites(prev => [...prev, job.maViecLam]);
      alert('✅ Đã lưu việc làm!');
    }
  };

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="joblist-page">
      <section className="joblist-search-wrap">
        <form className="joblist-search" onSubmit={handleSearchSubmit}>
          <input
            className="jl-input jl-keyword"
            placeholder="Từ khóa: Việc, công ty, ngành nghề..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <div className="jl-divider" />
          <input
            className="jl-input jl-location"
            placeholder="Địa điểm: Tỉnh/thành, quận..."
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <button className="jl-search-btn" type="submit">TÌM VIỆC</button>
        </form>

        <div className="joblist-filters">
          {/* LỌC NGÀNH NGHỀ (NEW) */}
          <select 
            className="filter-select-blue" 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="" hidden>Ngành nghề</option>
            <option value="">Tất cả ngành nghề</option>
            {getUniqueCategories().map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* LỌC LOẠI HÌNH */}
          <select className="filter-select-blue" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="" hidden>Loại hình</option>
            <option value="">Tất cả loại hình</option>
            {CATEGORIES.JOB_TYPES.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>

          {/* LỌC MỨC LƯƠNG */}
          <select className="filter-select-blue" value={filterSalary} onChange={(e) => setFilterSalary(e.target.value)}>
            <option value="" hidden>Mức lương</option>
            <option value="">Tất cả mức lương</option>
            {CATEGORIES.SALARIES.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="results-section">
        <div className="results-container">
          <div className="main-content">
            <div className="results-header">
              <h2>Tuyển dụng <span className="highlight">{filtered.length}</span> việc làm</h2>
              <div className="pagination-info">
                {filtered.length > 0 ? `Việc ${ (currentPage-1)*itemsPerPage + 1 } - ${ Math.min(currentPage*itemsPerPage, filtered.length) } / ${filtered.length}` : 'Không có kết quả'}
              </div>
            </div>

            {loading && <div className="loading-state"><div className="spinner"></div><p>Đang tải...</p></div>}

            {!loading && paginated.length > 0 && (
              <div className="jobs-grid joblist-grid">
                {paginated.map(job => (
                  <div 
                    key={job.maViecLam} 
                    className="job-card joblist-card"
                    onClick={() => navigate(`/jobs/${job.maViecLam}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-left">
                      <div className="company-logo large">
                        <span>{(job.tieuDe || '').charAt(0).toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="card-center">
                      <h3 className="job-title">
                        {job.tieuDe}
                      </h3>
                      <p className="company-name">{job.tenCongTy}</p>
                      
                      <div className="job-meta-info">
                        <span className="meta-salary">
                          {job.luongToiThieu ? `${job.luongToiThieu.toLocaleString()} - ${job.luongToiDa?.toLocaleString()} VNĐ` : 'Thỏa thuận'}
                        </span>
                        <span className="meta-location">{job.diaDiem || 'Bình Dương'}</span>
                      </div>

                      <div className="job-tags">
                        <span className="tag">{job.loaiHinhCongViec || 'Full-time'}</span>
                        <span className="tag">Không yêu cầu</span>
                        <span className="tag">16 phút trước</span>
                      </div>
                    </div>

                    <div className="card-right">
                      <button 
                        className={`btn-favorite-job ${favorites.includes(job.maViecLam) ? 'active' : ''}`}
                        onClick={(e) => toggleFavorite(e, job)}
                        title={favorites.includes(job.maViecLam) ? 'Bỏ lưu' : 'Lưu việc làm'}
                      >
                        {favorites.includes(job.maViecLam) ? '♥' : '♡'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1}>← Trang trước</button>
                {Array.from({length: totalPages}, (_,i) => i+1).map(p => (
                  <button key={p} className={`page-btn ${currentPage===p ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
                ))}
                <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages}>Trang sau →</button>
              </div>
            )}
          </div>

          <aside className="sidebar">
            <Sidebar />
          </aside>
        </div>
      </section>
    </div>
  );
}

