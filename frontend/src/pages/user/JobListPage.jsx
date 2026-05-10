import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllJobs } from '../../services/jobService';
import Sidebar from '../../components/Sidebar';
import '../../styles/Home.css';
import '../../styles/JobList.css';
import { CATEGORIES } from '../../utils/categoryData';

export default function JobListPage() {
  const navigate = useNavigate();
  
  // State tìm kiếm cơ bản
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  
  // MỚI: State cho các Dropdown Filters
  const [filterCategory, setFilterCategory] = useState(''); // Ngành nghề
  const [filterType, setFilterType] = useState('');         // Loại hình
  const [filterSalary, setFilterSalary] = useState('');     // Mức lương
  const [filterRole, setFilterRole] = useState('');         // Chức vụ
  const [filterExp, setFilterExp] = useState('');           // Kinh nghiệm
  const [filterEdu, setFilterEdu] = useState('');           // Học vấn

  // State dữ liệu
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchJobs(); }, []);


  useEffect(() => {
    applyFilters();
  }, [keyword, location, jobs, filterCategory, filterType, filterSalary, filterRole, filterExp, filterEdu]);

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

  
    if (filterCategory) {
      out = out.filter(j => (j.nganhNghe || '').toLowerCase() === filterCategory.toLowerCase());
    }

    // 4. Lọc theo Loại hình (Type)
    if (filterType) {
      out = out.filter(j => (j.loaiHinh || '').toLowerCase() === filterType.toLowerCase());
    }

    // 5. Lọc theo Mức lương (Logic khoảng giá)
    if (filterSalary) {
      out = out.filter(j => {
        // Nếu chọn thỏa thuận
        if (filterSalary === 'thoathuan') return !j.luongToiThieu && !j.luongToiDa;
        
        const min = j.luongToiThieu || 0;
        if (filterSalary === 'duoi10') return min > 0 && min < 10000000;
        if (filterSalary === '10-20') return min >= 10000000 && min <= 20000000;
        if (filterSalary === 'tren20') return min > 20000000;
        return true;
      });
    }

    // 6. Lọc theo Chức vụ / Cấp bậc
    if (filterRole) {
      out = out.filter(j => (j.capBac || '').toLowerCase() === filterRole.toLowerCase());
    }

    // 7. Lọc theo Kinh nghiệm
    if (filterExp) {
      out = out.filter(j => {
        const expStr = (j.kinhNghiem || '').toLowerCase();
        if (filterExp === '0') return expStr.includes('không') || expStr.includes('chưa');
        if (filterExp === '1-3') return expStr.includes('1') || expStr.includes('2') || expStr.includes('3');
        if (filterExp === '3-5') return expStr.includes('3') || expStr.includes('4') || expStr.includes('5');
        return true;
      });
    }

    // 8. Lọc theo Học vấn
    if (filterEdu) {
      out = out.filter(j => (j.hocVan || '').toLowerCase().includes(filterEdu.toLowerCase()));
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
  
        {/* LỌC NGÀNH NGHỀ */}
        <select className="filter-select-blue" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="" hidden>Ngành nghề</option>
          <option value="">Tất cả ngành nghề</option>
          {CATEGORIES.INDUSTRIES.map(item => (
            <option key={item.id} value={item.id}>{item.label}</option>
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

        {/* LỌC CHỨC VỤ */}
        <select className="filter-select-blue" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="" hidden>Chức vụ</option>
          <option value="">Tất cả chức vụ</option>
          {CATEGORIES.ROLES.map(item => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>

        {/* LỌC KINH NGHIỆM */}
        <select className="filter-select-blue" value={filterExp} onChange={(e) => setFilterExp(e.target.value)}>
          <option value="" hidden>Kinh nghiệm</option>
          <option value="">Mọi kinh nghiệm</option>
          {CATEGORIES.EXPERIENCES.map(item => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>

        {/* LỌC HỌC VẤN */}
        <select className="filter-select-blue" value={filterEdu} onChange={(e) => setFilterEdu(e.target.value)}>
          <option value="" hidden>Học vấn</option>
          <option value="">Mọi trình độ</option>
          {CATEGORIES.EDUCATIONS.map(item => (
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
                        className="btn-favorite-job"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          // TODO: Add favorite logic here
                          console.log('Favorite clicked:', job.maViecLam);
                        }}
                      >
                        ♡
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