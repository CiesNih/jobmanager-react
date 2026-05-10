import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AppliedJobs.css';

export default function AppliedJobs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Check authentication
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (!savedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(savedUser));

    // Load applied jobs
    loadAppliedJobs();
  }, [navigate]);

  const loadAppliedJobs = () => {
    const jobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    // Sort by applied date (newest first)
    jobs.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    setAppliedJobs(jobs);
  };

  const handleCancelApplication = (jobId) => {
    if (window.confirm('Bạn có chắc muốn hủy đơn ứng tuyển này?')) {
      const updatedJobs = appliedJobs.filter(job => job.maViecLam !== jobId);
      localStorage.setItem('appliedJobs', JSON.stringify(updatedJobs));
      setAppliedJobs(updatedJobs);
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'status-submitted',
      'approved': 'status-accepted',
      'rejected': 'status-rejected',
      // Legacy statuses (for backward compatibility)
      'Đã nộp': 'status-submitted',
      'Đã xem': 'status-viewed',
      'Phỏng vấn': 'status-interview',
      'Từ chối': 'status-rejected',
      'Chấp nhận': 'status-accepted'
    };
    return colors[status] || 'status-submitted';
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': '⏳ Chờ xử lý',
      'approved': '✅ Đã chấp nhận',
      'rejected': '❌ Đã từ chối',
      // Legacy statuses
      'Đã nộp': '📤 Đã nộp',
      'Đã xem': '👁️ Đã xem',
      'Phỏng vấn': '📅 Phỏng vấn',
      'Từ chối': '❌ Từ chối',
      'Chấp nhận': '✅ Chấp nhận'
    };
    return texts[status] || '📤 Đã nộp';
  };

  const filteredJobs = filterStatus === 'all' 
    ? appliedJobs 
    : appliedJobs.filter(job => job.status === filterStatus);

  if (!user) {
    return null;
  }

  return (
    <div className="applied-jobs-page">
      <div className="applied-jobs-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>📋 Việc làm đã ứng tuyển</h1>
            <p>Quản lý và theo dõi trạng thái các đơn ứng tuyển của bạn</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-number">{appliedJobs.length}</div>
              <div className="stat-label">Tổng đơn</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{appliedJobs.filter(j => j.status === 'Đã nộp').length}</div>
              <div className="stat-label">Đã nộp</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{appliedJobs.filter(j => j.status === 'Phỏng vấn').length}</div>
              <div className="stat-label">Phỏng vấn</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Tất cả ({appliedJobs.length})
          </button>
          <button 
            className={`filter-tab ${filterStatus === 'Đã nộp' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Đã nộp')}
          >
            Đã nộp ({appliedJobs.filter(j => j.status === 'Đã nộp').length})
          </button>
          <button 
            className={`filter-tab ${filterStatus === 'Đã xem' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Đã xem')}
          >
            Đã xem ({appliedJobs.filter(j => j.status === 'Đã xem').length})
          </button>
          <button 
            className={`filter-tab ${filterStatus === 'Phỏng vấn' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Phỏng vấn')}
          >
            Phỏng vấn ({appliedJobs.filter(j => j.status === 'Phỏng vấn').length})
          </button>
        </div>

        {/* Jobs List */}
        <div className="jobs-content">
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Chưa có đơn ứng tuyển nào</h3>
              <p>
                {filterStatus === 'all' 
                  ? 'Bạn chưa ứng tuyển công việc nào. Hãy tìm kiếm và ứng tuyển ngay!' 
                  : `Không có đơn ứng tuyển nào ở trạng thái "${filterStatus}"`}
              </p>
              <button 
                className="btn-find-jobs"
                onClick={() => navigate('/jobs')}
              >
                Tìm việc làm
              </button>
            </div>
          ) : (
            <div className="jobs-list">
              {filteredJobs.map((job) => (
                <div key={job.maViecLam} className="job-application-card">
                  <div className="card-header">
                    <div className="company-logo">
                      {job.tieuDe?.charAt(0).toUpperCase() || '💼'}
                    </div>
                    <div className="job-info">
                      <h3 className="job-title">{job.tieuDe}</h3>
                      <p className="company-name">{job.tenCongTy}</p>
                      <div className="job-meta">
                        <span className="meta-item">📍 {job.diaDiem}</span>
                        <span className="meta-item">💰 {job.luongToiThieu?.toLocaleString()} - {job.luongToiDa?.toLocaleString()} VNĐ</span>
                        <span className="meta-item">⏰ {job.loaiHinhCongViec || 'Full-time'}</span>
                      </div>
                    </div>
                    <div className="card-status">
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {getStatusText(job.status)}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="application-info">
                      <div className="info-row">
                        <span className="info-label">🕒 Thời gian ứng tuyển:</span>
                        <span className="info-value">{formatDate(job.appliedAt)}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">📅 Ngày đăng tin:</span>
                        <span className="info-value">{new Date(job.ngayDang).toLocaleDateString('vi-VN')}</span>
                      </div>
                      {job.ngayHetHan && (
                        <div className="info-row">
                          <span className="info-label">⏳ Hạn nộp hồ sơ:</span>
                          <span className="info-value">{new Date(job.ngayHetHan).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer">
                    <button 
                      className="btn-action btn-view"
                      onClick={() => handleViewJob(job.maViecLam)}
                    >
                      👁️ Xem chi tiết
                    </button>
                    <button 
                      className="btn-action btn-cancel"
                      onClick={() => handleCancelApplication(job.maViecLam)}
                    >
                      ❌ Hủy ứng tuyển
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
