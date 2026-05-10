import { useEffect, useState } from 'react';
import '../../styles/admin.css';

export default function CandidateManagement() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchApplications();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    filterApplications();
  }, [searchTerm, filterStatus, applications]);

  const fetchApplications = () => {
    // Lấy danh sách đơn ứng tuyển từ localStorage
    const allAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    
    console.log('Raw appliedJobs from localStorage:', allAppliedJobs); // Debug
    
    // Đảm bảo tất cả đơn đều có status, mặc định là 'pending' nếu chưa có
    const applicationsWithStatus = allAppliedJobs.map((app, index) => {
      const status = app.status || 'pending'; // Nếu không có status thì mặc định là pending
      console.log(`App ${index}: status = "${status}"`); // Debug
      
      return {
        ...app,
        applicationId: app.applicationId || `APP-${Date.now()}-${index}`,
        candidateName: app.candidateName || 'Nguyễn Văn A',
        candidateEmail: app.candidateEmail || 'candidate@example.com',
        candidatePhone: app.candidatePhone || '0123456789',
        status: status, // pending, approved, rejected
        appliedDate: app.appliedAt || app.savedAt || new Date().toISOString(),
        experience: app.experience || '2 năm',
        education: app.education || 'Đại học',
        coverLetter: app.coverLetter || 'Tôi rất quan tâm đến vị trí này...'
      };
    });

    console.log('Applications with status:', applicationsWithStatus); // Debug
    
    // Cập nhật lại localStorage với status mới
    localStorage.setItem('appliedJobs', JSON.stringify(applicationsWithStatus));
    
    setApplications(applicationsWithStatus);
    setLoading(false);
  };

  const filterApplications = () => {
    let filtered = applications;

    // Lọc theo trạng thái
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Lọc theo từ khóa
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.candidateName?.toLowerCase().includes(term) ||
        app.tieuDe?.toLowerCase().includes(term) ||
        app.tenCongTy?.toLowerCase().includes(term) ||
        app.candidateEmail?.toLowerCase().includes(term)
      );
    }

    setFilteredApplications(filtered);
  };

  const handleApprove = (application) => {
    if (window.confirm(`Bạn có chắc chắn muốn CHẤP NHẬN ứng viên "${application.candidateName}"?`)) {
      updateApplicationStatus(application.applicationId, 'approved');
      
      // Tạo thông báo cho ứng viên
      createNotification({
        userId: application.userId || 'user-1',
        title: '✅ Đơn ứng tuyển được chấp nhận',
        message: `Chúc mừng! Đơn ứng tuyển của bạn cho vị trí "${application.tieuDe}" tại ${application.tenCongTy} đã được chấp nhận. Chúng tôi sẽ liên hệ với bạn sớm.`,
        type: 'success',
        jobId: application.maViecLam
      });

      alert('✅ Đã chấp nhận ứng viên và gửi thông báo!');
    }
  };

  const handleReject = (application) => {
    const reason = prompt('Lý do từ chối (tùy chọn):');
    
    if (window.confirm(`Bạn có chắc chắn muốn TỪ CHỐI ứng viên "${application.candidateName}"?`)) {
      updateApplicationStatus(application.applicationId, 'rejected');
      
      // Tạo thông báo cho ứng viên
      createNotification({
        userId: application.userId || 'user-1',
        title: ' Đơn ứng tuyển không được chấp nhận',
        message: `Rất tiếc, đơn ứng tuyển của bạn cho vị trí "${application.tieuDe}" tại ${application.tenCongTy} chưa phù hợp lúc này.${reason ? ` Lý do: ${reason}` : ''} Chúc bạn may mắn lần sau!`,
        type: 'error',
        jobId: application.maViecLam
      });

      alert(' Đã từ chối ứng viên và gửi thông báo!');
    }
  };

  const updateApplicationStatus = (applicationId, newStatus) => {
    // Cập nhật trạng thái trong state
    const updatedApplications = applications.map(app =>
      app.applicationId === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);

    // Cập nhật trong localStorage
    const allAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    const updatedAppliedJobs = allAppliedJobs.map(app =>
      app.applicationId === applicationId ? { ...app, status: newStatus } : app
    );
    localStorage.setItem('appliedJobs', JSON.stringify(updatedAppliedJobs));
  };

  const createNotification = (notification) => {
    // Lưu thông báo vào localStorage
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
      // eslint-disable-next-line react-hooks/purity
      id: `NOTIF-${Date.now()}`,
      ...notification,
      createdAt: new Date().toISOString(),
      read: false
    };
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Dispatch event để cập nhật UI
    window.dispatchEvent(new Event('notificationChange'));
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Chờ xử lý', class: 'badge-warning', icon: '' },
      approved: { text: 'Đã chấp nhận', class: 'badge-success', icon: '' },
      rejected: { text: 'Đã từ chối', class: 'badge-danger', icon: '' }
    };
    return badges[status] || badges.pending;
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  return (
    <div>
      <h2 style={{ fontWeight: 400, color: '#333', marginTop: 0 }}>
        Quản lý Ứng viên <small style={{ fontSize: '14px', color: '#777' }}>Danh sách đơn ứng tuyển</small>
      </h2>

      {/* Debug & Reset Button */}
      <div >
        <button
          onClick={() => {
            if (window.confirm('Xóa tất cả dữ liệu ứng tuyển cũ và tạo dữ liệu mẫu?')) {
              // Xóa dữ liệu cũ
              localStorage.removeItem('appliedJobs');
              
              // Tạo dữ liệu mẫu với status đúng
              const sampleData = [
                {
                  applicationId: 'APP-001',
                  maViecLam: 'JOB-001',
                  tieuDe: 'Công nhân sản xuất',
                  tenCongTy: 'Công ty Hoa Mai',
                  diaDiem: 'Hà Nội',
                  luongToiThieu: 8000000,
                  luongToiDa: 12000000,
                  candidateName: 'Nguyễn Văn A',
                  candidateEmail: 'candidate@example.com',
                  candidatePhone: '0123456789',
                  experience: '2 năm',
                  education: 'Đại học',
                  coverLetter: 'Tôi rất quan tâm đến vị trí này...',
                  status: 'pending',
                  appliedAt: new Date().toISOString()
                },
                {
                  applicationId: 'APP-002',
                  maViecLam: 'JOB-002',
                  tieuDe: 'Nhân viên bán hàng',
                  tenCongTy: 'Công ty Hoa Phát',
                  diaDiem: 'TP.HCM',
                  luongToiThieu: 10000000,
                  luongToiDa: 15000000,
                  candidateName: 'Nguyễn Văn A',
                  candidateEmail: 'candidate@example.com',
                  candidatePhone: '0123456789',
                  experience: '2 năm',
                  education: 'Đại học',
                  coverLetter: 'Tôi có kinh nghiệm trong lĩnh vực này...',
                  status: 'pending',
                  appliedAt: new Date().toISOString()
                }
              ];
              
              localStorage.setItem('appliedJobs', JSON.stringify(sampleData));
              
              // Reload trang
              window.location.reload();
            }
          }}
          style={{
            padding: '8px 16px',
            background: '#ffc107',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#000'
          }}
        >
           Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card bg-info">
          <div className="inner" style={{ color: '#fff' }}>
            <h3 style={{ color: '#fff', fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
              {stats.total}
            </h3>
            <p style={{ color: '#fff', fontSize: '16px', margin: 0 }}>
              Tổng đơn ứng tuyển
            </p>
          </div>
          <div className="icon">📋</div>
        </div>

        <div className="stat-card bg-warning">
          <div className="inner" style={{ color: '#fff' }}>
            <h3 style={{ color: '#fff', fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
              {stats.pending}
            </h3>
            <p style={{ color: '#fff', fontSize: '16px', margin: 0 }}>
              Chờ xử lý
            </p>
          </div>
          <div className="icon">⏳</div>
        </div>

        <div className="stat-card bg-success">
          <div className="inner" style={{ color: '#fff' }}>
            <h3 style={{ color: '#fff', fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
              {stats.approved}
            </h3>
            <p style={{ color: '#fff', fontSize: '16px', margin: 0 }}>
              Đã chấp nhận
            </p>
          </div>
          <div className="icon">✅</div>
        </div>

        <div className="stat-card bg-danger">
          <div className="inner" style={{ color: '#fff' }}>
            <h3 style={{ color: '#fff', fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
              {stats.rejected}
            </h3>
            <p style={{ color: '#fff', fontSize: '16px', margin: 0 }}>
              Đã từ chối
            </p>
          </div>
          <div className="icon">❌</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-header-actions" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 Tìm theo tên ứng viên, vị trí, công ty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">⏳ Chờ xử lý</option>
            <option value="approved">✅ Đã chấp nhận</option>
            <option value="rejected">❌ Đã từ chối</option>
          </select>
        </div>

        <span style={{ color: '#777', fontSize: '14px', alignSelf: 'center' }}>
          {filteredApplications.length}/{applications.length} kết quả
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredApplications.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          background: '#f9f9f9', 
          borderRadius: '8px' 
        }}>
          <p style={{ fontSize: '18px', color: '#999' }}>
            {searchTerm || filterStatus !== 'all' 
              ? '😕 Không tìm thấy đơn ứng tuyển phù hợp' 
              : '📭 Chưa có đơn ứng tuyển nào'}
          </p>
          {(searchTerm || filterStatus !== 'all') && (
            <button 
              onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
              className="btn-primary"
              style={{ marginTop: '15px' }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Applications Table */}
      {!loading && filteredApplications.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ứng viên</th>
                <th>Vị trí ứng tuyển</th>
                <th>Ngày ứng tuyển</th>
                <th>Kinh nghiệm</th>
                <th>Trạng thái</th>
                <th style={{ minWidth: '280px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => {
                const badge = getStatusBadge(app.status);
                return (
                  <tr key={app.applicationId}>
                    <td style={{ color: '#222' }}>
                      <div style={{ color: '#222' }}>
                        <strong style={{ color: '#000' }}>{app.candidateName}</strong>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          📧 {app.candidateEmail}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          📱 {app.candidatePhone}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#222' }}>
                      <div style={{ color: '#222' }}>
                        <strong style={{ color: '#d32f2f' }}>{app.tieuDe}</strong>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {app.tenCongTy}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#222' }}>
                      {new Date(app.appliedDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ color: '#222' }}>{app.experience}</td>
                    <td>
                      <span className={`badge ${badge.class}`}>
                        {badge.icon} {badge.text}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button
                          className="btn-primary"
                          onClick={() => setSelectedApplication(app)}
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '13px',
                            minWidth: '80px'
                          }}
                        >
                          Xem chi tiết
                        </button>
                        
                        {app.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(app)}
                              style={{ 
                                padding: '6px 12px', 
                                fontSize: '13px',
                                background: '#00a65a',
                                border: '1px solid #00a65a',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                minWidth: '80px',
                                fontWeight: '500'
                              }}
                            >
                              Chấp nhận
                            </button>
                            <button
                              onClick={() => handleReject(app)}
                              style={{ 
                                padding: '6px 12px', 
                                fontSize: '13px',
                                background: '#dd4b39',
                                border: '1px solid #dd4b39',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                minWidth: '80px',
                                fontWeight: '500'
                              }}
                            >
                              Từ chối
                            </button>
                          </>
                        ) : app.status === 'approved' ? (
                          <span style={{ color: '#00a65a', fontWeight: 'bold', padding: '6px 12px' }}>
                            ✅ Đã chấp nhận
                          </span>
                        ) : app.status === 'rejected' ? (
                          <span style={{ color: '#dd4b39', fontWeight: 'bold', padding: '6px 12px' }}>
                            ❌ Đã từ chối
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#999', padding: '6px 12px' }}>
                            ⚠️ Trạng thái không xác định
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            <button 
              className="modal-close" 
              onClick={() => setSelectedApplication(null)}
            >
              ✕
            </button>

            <h3 style={{ marginTop: 0 }}>Chi tiết đơn ứng tuyển</h3>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#3c8dbc', marginBottom: '10px' }}>👤 Thông tin ứng viên</h4>
              <p><strong>Họ tên:</strong> {selectedApplication.candidateName}</p>
              <p><strong>Email:</strong> {selectedApplication.candidateEmail}</p>
              <p><strong>Điện thoại:</strong> {selectedApplication.candidatePhone}</p>
              <p><strong>Kinh nghiệm:</strong> {selectedApplication.experience}</p>
              <p><strong>Học vấn:</strong> {selectedApplication.education}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#3c8dbc', marginBottom: '10px' }}>💼 Vị trí ứng tuyển</h4>
              <p><strong>Công việc:</strong> {selectedApplication.tieuDe}</p>
              <p><strong>Công ty:</strong> {selectedApplication.tenCongTy}</p>
              <p><strong>Địa điểm:</strong> {selectedApplication.diaDiem}</p>
              <p><strong>Mức lương:</strong> {selectedApplication.luongToiThieu?.toLocaleString()} - {selectedApplication.luongToiDa?.toLocaleString()} VNĐ</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#3c8dbc', marginBottom: '10px' }}>📝 Thư xin việc</h4>
              <p style={{ 
                background: '#f9f9f9', 
                padding: '15px', 
                borderRadius: '6px',
                lineHeight: '1.6'
              }}>
                {selectedApplication.coverLetter}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#3c8dbc', marginBottom: '10px' }}>📊 Trạng thái</h4>
              <span className={`badge ${getStatusBadge(selectedApplication.status).class}`}>
                {getStatusBadge(selectedApplication.status).icon} {getStatusBadge(selectedApplication.status).text}
              </span>
            </div>

            {selectedApplication.status === 'pending' && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    handleApprove(selectedApplication);
                    setSelectedApplication(null);
                  }}
                  style={{ flex: 1 }}
                >
                  ✅ Chấp nhận
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    handleReject(selectedApplication);
                    setSelectedApplication(null);
                  }}
                  style={{ flex: 1 }}
                >
                  ❌ Từ chối
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
