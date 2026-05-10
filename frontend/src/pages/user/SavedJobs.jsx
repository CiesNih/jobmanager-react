import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/SavedJobs.css';

export default function SavedJobs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Check authentication
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (!savedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(savedUser));

    // Load saved jobs
    loadSavedJobs();
  }, [navigate]);

  const loadSavedJobs = () => {
    const jobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(jobs);
  };

  const handleRemoveJob = (jobId) => {
    if (window.confirm('Bạn có chắc muốn bỏ lưu việc làm này?')) {
      const updatedJobs = savedJobs.filter(job => job.maViecLam !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
      setSavedJobs(updatedJobs);
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleApplyJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return `${Math.floor(diffDays / 30)} tháng trước`;
  };

  const sortedJobs = [...savedJobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.savedAt) - new Date(a.savedAt);
      case 'oldest':
        return new Date(a.savedAt) - new Date(b.savedAt);
      case 'salary-high':
        return (b.luongToiDa || 0) - (a.luongToiDa || 0);
      case 'salary-low':
        return (a.luongToiThieu || 0) - (b.luongToiThieu || 0);
      default:
        return 0;
    }
  });

  if (!user) {
    return null;
  }

  return (
    <div className="saved-jobs-page">
      <div className="saved-jobs-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>💾 Việc làm đã lưu</h1>
            <p>Danh sách các công việc bạn quan tâm và muốn ứng tuyển sau</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-info">
                <div className="stat-number">{savedJobs.length}</div>
                <div className="stat-label">Việc làm đã lưu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="result-count">
              Hiển thị <strong>{sortedJobs.length}</strong> việc làm
            </span>
          </div>
          <div className="toolbar-right">
            <label htmlFor="sort-select">Sắp xếp:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Mới lưu nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="salary-high">Lương cao nhất</option>
              <option value="salary-low">Lương thấp nhất</option>
            </select>
          </div>
        </div>

        {/* Jobs Content */}
        <div className="jobs-content">
          {sortedJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💾</div>
              <h3>Chưa có việc làm nào được lưu</h3>
              <p>Hãy lưu các công việc bạn quan tâm để dễ dàng theo dõi và ứng tuyển sau!</p>
              <button 
                className="btn-find-jobs"
                onClick={() => navigate('/jobs')}
              >
                Tìm việc làm ngay
              </button>
            </div>
          ) : (
            <div className="jobs-grid">
              {sortedJobs.map((job) => (
                <div key={job.maViecLam} className="job-card">
                  <div className="card-header">
                    <div className="company-logo">
                      {job.tieuDe?.charAt(0).toUpperCase() || '💼'}
                    </div>
                    <button 
                      className="btn-remove-save"
                      onClick={() => handleRemoveJob(job.maViecLam)}
                      title="Bỏ lưu"
                    >
                      ❌
                    </button>
                  </div>

                  <div className="card-body">
                    <h3 className="job-title" onClick={() => handleViewJob(job.maViecLam)}>
                      {job.tieuDe}
                    </h3>
                    <p className="company-name">{job.tenCongTy}</p>

                    <div className="job-details">
                      <div className="detail-item">
                        <span className="detail-icon">💰</span>
                        <span className="detail-text">
                          {job.luongToiThieu?.toLocaleString()} - {job.luongToiDa?.toLocaleString()} VNĐ
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{job.diaDiem || 'Bình Dương'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">⏰</span>
                        <span className="detail-text">{job.loaiHinhCongViec || 'Full-time'}</span>
                      </div>
                    </div>

                    <div className="job-footer">
                      <div className="job-meta">
                        <span className="meta-badge">Đã lưu {formatTimeAgo(job.savedAt)}</span>
                        <span className="meta-badge">Đăng {formatDate(job.ngayDang)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="btn-action btn-view"
                      onClick={() => handleViewJob(job.maViecLam)}
                    >
                      👁️ Xem chi tiết
                    </button>
                    <button 
                      className="btn-action btn-apply"
                      onClick={() => handleApplyJob(job.maViecLam)}
                    >
                      📝 Ứng tuyển
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
