import React, { useState, useEffect } from 'react';
import { getDonUngTuyen, capNhatTrangThaiDon, taoLichPhongVan } from '../../services/employerService';
import '../../styles/admin.css';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('');
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0
  });

  const [interviewData, setInterviewData] = useState({
    thoiGian: '',
    thoiLuong: '60 phút',
    diaDiem: '',
    ghiChu: '',
    maDangPhongVan: 'Offline'
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const maViecLam = params.get('maViecLam');
    if (maViecLam) {
      setSelectedJob(maViecLam);
      fetchApplications(maViecLam);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchApplications = async (maViecLam, filters = {}) => {
    try {
      setLoading(true);
      const response = await getDonUngTuyen({
        maViecLam,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...filters
      });

      if (response.success) {
        setApplications(response.data.items);
        setPagination({
          currentPage: response.data.currentPage,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages
        });
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Không thể tải danh sách đơn ứng tuyển!');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (maDon, newStatus) => {
    try {
      const response = await capNhatTrangThaiDon(maDon, {
        trangThai: newStatus
      });

      if (response.success) {
        alert('Cập nhật trạng thái thành công!');
        fetchApplications(selectedJob);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Không thể cập nhật trạng thái!');
    }
  };

  const handleOpenInterviewModal = (application) => {
    setSelectedApplication(application);
    setInterviewData({
      thoiGian: '',
      thoiLuong: '60 phút',
      diaDiem: '',
      ghiChu: '',
      maDangPhongVan: 'Offline'
    });
    setShowInterviewModal(true);
  };

  const handleCreateInterview = async (e) => {
    e.preventDefault();

    try {
      const response = await taoLichPhongVan({
        maDon: selectedApplication.maDonUngTuyen,
        ...interviewData
      });

      if (response.success) {
        alert('Tạo lịch phỏng vấn thành công!');
        setShowInterviewModal(false);
        fetchApplications(selectedJob);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert(error.message || 'Không thể tạo lịch phỏng vấn!');
    }
  };
  if (loading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  if (!selectedJob) {
    return (
      <div className="admin-page-container">
        <h2>Vui lòng chọn tin tuyển dụng để xem đơn ứng tuyển</h2>
        <a href="/employer/jobs" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          ← Quay lại Quản lý Tin tuyển dụng
        </a>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="admin-header-actions">
        <h2>Quản lý Đơn ứng tuyển</h2>
        <a href="/employer/jobs" className="btn-secondary">
          ← Quay lại
        </a>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ fontWeight: '600' }}>Lọc theo trạng thái:</label>
        <select 
          className="form-control" 
          style={{ maxWidth: '200px' }}
          onChange={(e) => fetchApplications(selectedJob, { trangThai: e.target.value })}
        >
          <option value="">Tất cả</option>
          <option value="DaNop">📩 Đơn mới</option>
          <option value="DaXem">👀 Đã xem</option>
          <option value="PhongVan">📅 Phỏng vấn</option>
          <option value="ChapNhan">✅ Chấp nhận</option>
          <option value="TuChoi">❌ Từ chối</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ứng viên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Kinh nghiệm</th>
              <th>Ngày nộp</th>
              <th>Trạng thái</th>
              <th>CV</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                  Chưa có đơn ứng tuyển nào
                </td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app.maDonUngTuyen}>
                  <td className="fw-bold">{app.hoTen}</td>
                  <td>{app.email}</td>
                  <td>{app.soDienThoai || 'N/A'}</td>
                  <td>{app.soNamKinhNghiem || 'N/A'}</td>
                  <td>{new Date(app.ngayNop).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <select
                      className="form-control"
                      value={app.trangThai || 'DaNop'}
                      onChange={(e) => handleStatusChange(app.maDonUngTuyen, e.target.value)}
                      style={{ minWidth: '140px', fontSize: '13px' }}
                    >
                      <option value="DaNop">📩 Đơn mới</option>
                      <option value="DaXem">👀 Đã xem</option>
                      <option value="PhongVan">📅 Phỏng vấn</option>
                      <option value="ChapNhan">✅ Chấp nhận</option>
                      <option value="TuChoi">❌ Từ chối</option>
                    </select>
                  </td>
                  <td>
                    {app.duongDanLuuTru ? (
                      <a 
                        href={app.duongDanLuuTru} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-link"
                      >
                        📄 Xem CV
                      </a>
                    ) : (
                      <span className="text-muted">Chưa có</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className={app.daCoLichPhongVan ? 'btn-secondary' : 'btn-primary'}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => handleOpenInterviewModal(app)}
                      disabled={app.daCoLichPhongVan}
                    >
                      {app.daCoLichPhongVan ? '✅ Đã có lịch' : '📅 Tạo lịch PV'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            disabled={pagination.currentPage === 1}
            onClick={() => {
              setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
              fetchApplications(selectedJob);
            }}
            className="btn-secondary"
          >
            ← Trước
          </button>
          <span style={{ margin: '0 15px' }}>
            Trang {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button 
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => {
              setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
              fetchApplications(selectedJob);
            }}
            className="btn-secondary"
          >
            Sau →
          </button>
        </div>
      )}

      {/* Modal tạo lịch phỏng vấn */}
      {showInterviewModal && (
        <div className="modal-overlay" onClick={() => setShowInterviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Tạo lịch phỏng vấn</h3>
            <p style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
              <strong>Ứng viên:</strong> {selectedApplication?.hoTen}<br />
              <strong>Email:</strong> {selectedApplication?.email}<br />
              <strong>SĐT:</strong> {selectedApplication?.soDienThoai}
            </p>
            
            <form onSubmit={handleCreateInterview}>
              <div className="form-group">
                <label>Hình thức phỏng vấn</label>
                <select
                  className="form-control"
                  value={interviewData.maDangPhongVan}
                  onChange={(e) => setInterviewData({ ...interviewData, maDangPhongVan: e.target.value })}
                >
                  <option value="Offline">Offline (Trực tiếp)</option>
                  <option value="Online">Online (Video call)</option>
                  <option value="Hybrid">Hybrid (Kết hợp)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Thời gian <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={interviewData.thoiGian}
                  onChange={(e) => setInterviewData({ ...interviewData, thoiGian: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Thời lượng</label>
                <input
                  type="text"
                  className="form-control"
                  value={interviewData.thoiLuong}
                  onChange={(e) => setInterviewData({ ...interviewData, thoiLuong: e.target.value })}
                  placeholder="60 phút"
                />
              </div>

              <div className="form-group">
                <label>Địa điểm / Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={interviewData.diaDiem}
                  onChange={(e) => setInterviewData({ ...interviewData, diaDiem: e.target.value })}
                  placeholder="Phòng họp A, Tầng 5 hoặc https://meet.google.com/..."
                />
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  className="form-control"
                  value={interviewData.ghiChu}
                  onChange={(e) => setInterviewData({ ...interviewData, ghiChu: e.target.value })}
                  rows="3"
                  placeholder="Mang theo CMND, bằng cấp, giấy tờ liên quan..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowInterviewModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Tạo lịch phỏng vấn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
