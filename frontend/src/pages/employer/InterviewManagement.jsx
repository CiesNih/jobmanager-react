import React, { useState, useEffect } from 'react';
import { getDonUngTuyen } from '../../services/employerService';
import '../../styles/admin.css';

const InterviewManagement = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maCongTy, setMaCongTy] = useState('');
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState({
    tuNgay: '',
    denNgay: '',
    keyword: ''
  });

  useEffect(() => {
    const storedMaCongTy = localStorage.getItem('maCongTy');
    if (storedMaCongTy) {
      setMaCongTy(storedMaCongTy);
      fetchInterviews(storedMaCongTy);
    } else {
      setLoading(false);
      alert('Vui lòng cấu hình Mã Công Ty trong Dashboard!');
    }
  }, []);

  const fetchInterviews = async (congTyId, filterParams = {}) => {
    try {
      setLoading(true);
      
      // Lấy tất cả đơn ứng tuyển có trạng thái PhongVan
      const response = await getDonUngTuyen({
        trangThai: 'PhongVan',
        ...filterParams,
        page: 1,
        pageSize: 100
      });

      if (response.success) {
        // Filter những đơn có lịch phỏng vấn
        const interviewList = response.data.items.filter(item => item.daCoLichPhongVan);
        setInterviews(interviewList);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Không thể tải danh sách lịch phỏng vấn!');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (interview) => {
    setSelectedInterview(interview);
    setShowDetailModal(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    fetchInterviews(maCongTy, filter);
  };

  const handleResetFilter = () => {
    setFilter({ tuNgay: '', denNgay: '', keyword: '' });
    fetchInterviews(maCongTy);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (thoiGian) => {
    if (!thoiGian) return 'gray';
    const now = new Date();
    const interviewDate = new Date(thoiGian);
    
    if (interviewDate < now) return '#dc3545'; // Đã qua
    if (interviewDate - now < 24 * 60 * 60 * 1000) return '#ffc107'; // Sắp tới (trong 24h)
    return '#28a745'; // Chưa tới
  };

  const getStatusText = (thoiGian) => {
    if (!thoiGian) return 'Chưa xác định';
    const now = new Date();
    const interviewDate = new Date(thoiGian);
    
    if (interviewDate < now) return '✅ Đã phỏng vấn';
    if (interviewDate - now < 24 * 60 * 60 * 1000) return '⚠️ Sắp diễn ra';
    return '📅 Đã lên lịch';
  };

  if (loading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-header-actions">
        <h2>Quản lý Lịch phỏng vấn</h2>
        <a href="/employer/applications" className="btn-primary">
          ➕ Tạo lịch mới
        </a>
      </div>

      {/* Filters */}
      <div className="dashboard-panel" style={{ marginBottom: '20px' }}>
        <h3>Bộ lọc</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Từ ngày</label>
            <input
              type="date"
              name="tuNgay"
              className="form-control"
              value={filter.tuNgay}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Đến ngày</label>
            <input
              type="date"
              name="denNgay"
              className="form-control"
              value={filter.denNgay}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Tìm kiếm</label>
            <input
              type="text"
              name="keyword"
              className="form-control"
              value={filter.keyword}
              onChange={handleFilterChange}
              placeholder="Tên ứng viên, email..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" onClick={handleApplyFilter}>
              🔍 Lọc
            </button>
            <button className="btn-secondary" onClick={handleResetFilter}>
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="dashboard-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card bg-blue">
          <div className="inner">
            <h3>{interviews.length}</h3>
            <p>Tổng lịch phỏng vấn</p>
          </div>
          <div className="icon">📅</div>
        </div>

        <div className="stat-card bg-orange">
          <div className="inner">
            <h3>
              {interviews.filter(i => {
                const date = new Date(i.thoiGianPhongVan);
                const now = new Date();
                return date > now && date - now < 24 * 60 * 60 * 1000;
              }).length}
            </h3>
            <p>Sắp diễn ra (24h)</p>
          </div>
          <div className="icon">⚠️</div>
        </div>

        <div className="stat-card bg-green">
          <div className="inner">
            <h3>
              {interviews.filter(i => {
                const date = new Date(i.thoiGianPhongVan);
                return date > new Date();
              }).length}
            </h3>
            <p>Chưa diễn ra</p>
          </div>
          <div className="icon">📆</div>
        </div>

        <div className="stat-card bg-red">
          <div className="inner">
            <h3>
              {interviews.filter(i => {
                const date = new Date(i.thoiGianPhongVan);
                return date < new Date();
              }).length}
            </h3>
            <p>Đã hoàn thành</p>
          </div>
          <div className="icon">✅</div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ứng viên</th>
              <th>Vị trí ứng tuyển</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Thời gian PV</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {interviews.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Chưa có lịch phỏng vấn nào
                </td>
              </tr>
            ) : (
              interviews.map(interview => (
                <tr key={interview.maDonUngTuyen}>
                  <td className="fw-bold">{interview.hoTen}</td>
                  <td>{interview.tenViecLam}</td>
                  <td>{interview.email}</td>
                  <td>{interview.soDienThoai || 'N/A'}</td>
                  <td>
                    {formatDateTime(interview.thoiGianPhongVan)}
                  </td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ 
                        background: getStatusColor(interview.thoiGianPhongVan),
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      {getStatusText(interview.thoiGianPhongVan)}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="text-btn edit-btn"
                      onClick={() => handleViewDetail(interview)}
                    >
                      👁️ Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Chi tiết */}
      {showDetailModal && selectedInterview && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3>Chi tiết Lịch phỏng vấn</h3>

            <div style={{ marginTop: '20px' }}>
              {/* Thông tin ứng viên */}
              <div className="dashboard-panel" style={{ marginBottom: '15px' }}>
                <h4 style={{ marginTop: 0, fontSize: '16px', color: '#3c8dbc' }}>
                  👤 Thông tin Ứng viên
                </h4>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: '600', width: '150px' }}>Họ tên:</td>
                      <td style={{ padding: '8px 0' }}>{selectedInterview.hoTen}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>Email:</td>
                      <td style={{ padding: '8px 0' }}>{selectedInterview.email}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>Số điện thoại:</td>
                      <td style={{ padding: '8px 0' }}>{selectedInterview.soDienThoai || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>Vị trí ứng tuyển:</td>
                      <td style={{ padding: '8px 0' }}>{selectedInterview.tenViecLam}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>Kinh nghiệm:</td>
                      <td style={{ padding: '8px 0' }}>{selectedInterview.soNamKinhNghiem || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Thông tin phỏng vấn */}
              <div className="dashboard-panel">
                <h4 style={{ marginTop: 0, fontSize: '16px', color: '#28a745' }}>
                  📅 Thông tin Phỏng vấn
                </h4>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: '600', width: '150px' }}>Thời gian:</td>
                      <td style={{ padding: '8px 0' }}>
                        <strong style={{ color: '#dc3545' }}>
                          {formatDateTime(selectedInterview.thoiGianPhongVan)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>Trạng thái:</td>
                      <td style={{ padding: '8px 0' }}>
                        <span 
                          className="status-badge" 
                          style={{ 
                            background: getStatusColor(selectedInterview.thoiGianPhongVan),
                            color: 'white',
                            border: 'none'
                          }}
                        >
                          {getStatusText(selectedInterview.thoiGianPhongVan)}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: '600' }}>Ngày nộp đơn:</td>
                      <td style={{ padding: '8px 0' }}>
                        {new Date(selectedInterview.ngayNop).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CV */}
              {selectedInterview.duongDanLuuTru && (
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <a 
                    href={selectedInterview.duongDanLuuTru} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    📄 Xem CV của ứng viên
                  </a>
                </div>
              )}
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>
                Đóng
              </button>
              <a 
                href={`/employer/applications?maViecLam=${selectedInterview.maViecLam}`}
                className="btn-primary"
              >
                Xem đơn ứng tuyển
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewManagement;
