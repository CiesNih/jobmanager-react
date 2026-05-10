import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/admin.css';

const EmployerDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    applications: 0,
    interviews: 0
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
    }

    // TODO: Fetch employer stats from API
    // Mock data for now
    setStats({
      totalJobs: 12,
      activeJobs: 8,
      applications: 45,
      interviews: 5
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontWeight: 400, color: '#333', marginTop: 0, marginBottom: '5px' }}>
          Chào mừng trở lại, {user?.companyName || user?.name || 'Nhà tuyển dụng'}! 👋
        </h2>
        <p style={{ color: '#777', fontSize: '14px', margin: 0 }}>
          Quản lý tin tuyển dụng và ứng viên của bạn
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card bg-orange">
          <div className="inner">
            <h3>{stats.totalJobs}</h3>
            <p>Tổng tin tuyển dụng</p>
          </div>
          <div className="icon">💼</div>
          <Link to="/employer/jobs" className="stat-card-footer">
            Chi tiết →
          </Link>
        </div>

        <div className="stat-card bg-green">
          <div className="inner">
            <h3>{stats.activeJobs}</h3>
            <p>Tin đang hoạt động</p>
          </div>
          <div className="icon">✅</div>
          <Link to="/employer/jobs" className="stat-card-footer">
            Chi tiết →
          </Link>
        </div>

        <div className="stat-card bg-blue">
          <div className="inner">
            <h3>{stats.applications}</h3>
            <p>Đơn ứng tuyển</p>
          </div>
          <div className="icon">📄</div>
          <Link to="/employer/applications" className="stat-card-footer">
            Chi tiết →
          </Link>
        </div>

        <div className="stat-card bg-red">
          <div className="inner">
            <h3>{stats.interviews}</h3>
            <p>Lịch phỏng vấn</p>
          </div>
          <div className="icon">📅</div>
          <Link to="/employer/interviews" className="stat-card-footer">
            Chi tiết →
          </Link>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-panel primary-border">
          <h3>📊 Hoạt động gần đây</h3>
          <div className="stats-list">
            <div className="stat-item">
              <strong>5</strong> đơn ứng tuyển mới hôm nay
            </div>
            <div className="stat-item">
              <strong>2</strong> lịch phỏng vấn sắp tới
            </div>
            <div className="stat-item">
              <strong>3</strong> tin tuyển dụng sắp hết hạn
            </div>
            <div className="stat-item">
              <strong>15</strong> ứng viên đã xem hồ sơ công ty
            </div>
          </div>
        </div>

        <div className="dashboard-panel success-border">
          <h3>⚡ Thao tác nhanh</h3>
          <div className="quick-actions">
            <Link to="/employer/jobs" className="quick-btn"> Đăng tin tuyển dụng</Link>
            <Link to="/employer/applications" className="quick-btn"> Xem đơn ứng tuyển</Link>
            <Link to="/employer/interviews" className="quick-btn"> Quản lý lịch phỏng vấn</Link>
            <Link to="/employer/company" className="quick-btn"> Cập nhật thông tin công ty</Link>
          </div>
        </div>
      </div>

      <div className="dashboard-panel" style={{ marginTop: '20px' }}>
        <h3>💡 Mẹo tuyển dụng hiệu quả</h3>
        <ul style={{ lineHeight: '1.8', color: '#555' }}>
          <li>✓ Viết mô tả công việc rõ ràng, chi tiết về yêu cầu và quyền lợi</li>
          <li>✓ Cập nhật thông tin công ty thường xuyên để thu hút ứng viên</li>
          <li>✓ Phản hồi đơn ứng tuyển trong vòng 24-48 giờ</li>
          <li>✓ Sử dụng các từ khóa phổ biến để tin tuyển dụng dễ tìm kiếm hơn</li>
        </ul>
      </div>
    </div>
  );
};

export default EmployerDashboard;
