import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllJobs } from '../services/jobService';
import Sidebar from '../components/Sidebar';
import '../styles/Home.css';
import '../styles/JobList.css';

export default function JobListPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    applyFilters();
  }, [keyword, location, jobs]);

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
    if (keyword) {
      const k = keyword.toLowerCase();
      out = out.filter(j =>
        (j.tieuDe || '').toLowerCase().includes(k) ||
        (j.tenCongTy || '').toLowerCase().includes(k)
      );
    }
    if (location) {
      const l = location.toLowerCase();
      out = out.filter(j => (j.diaDiem || '').toLowerCase().includes(l));
    }
    setFiltered(out);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
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
          <button className="filter-pill">Ngành nghề ▾</button>
          <button className="filter-pill">Loại hình ▾</button>
          <button className="filter-pill">Mức lương ▾</button>
          <button className="filter-pill">Chức vụ ▾</button>
          <button className="filter-pill">Kinh nghiệm ▾</button>
          <button className="filter-pill">Học vấn ▾</button>
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
                  <div key={job.maViecLam} className="job-card joblist-card">
                    <div className="card-left">
                      <div className="company-logo large">
                        <span>{(job.tieuDe || '').charAt(0).toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="card-center">
                      <h3 className="job-title">{job.tieuDe}</h3>
                      <p className="company-name">{job.tenCongTy}</p>
                      <div className="meta-row">
                        <span className="meta-item">{job.luongToiThieu ? `${job.luongToiThieu.toLocaleString()} - ${job.luongToiDa?.toLocaleString()} VNĐ` : 'Thỏa thuận'}</span>
                        <span className="meta-item">{job.diaDiem || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="card-right">
                      <button className="btn-apply" onClick={() => navigate(`/jobs/${job.maViecLam}`)}>Xem Chi Tiết</button>
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