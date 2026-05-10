import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import '../styles/admin.css';

const EmployerLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra đăng nhập
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    
    if (!savedUser) {
      // Chưa đăng nhập -> Chuyển về trang chủ
      alert('Vui lòng đăng nhập với tài khoản Nhà tuyển dụng!');
      navigate('/');
      return;
    }

    const user = JSON.parse(savedUser);
    
    // Kiểm tra role
    if (user.role !== 'employer') {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
      return;
    }
  }, [navigate]);

  const user = JSON.parse(
    localStorage.getItem('authUser') || 
    sessionStorage.getItem('authUser') || 
    '{}'
  );

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authUser');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>🏢</span>
          <span>Nhà Tuyển Dụng</span>
        </div>
        <ul className="admin-menu">
          <li>
            <Link to="/employer" className={window.location.pathname === '/employer' || window.location.pathname === '/employer/dashboard' ? 'active' : ''}>
              📊 Tổng quan
            </Link>
          </li>
          <li>
            <Link to="/employer/jobs" className={window.location.pathname === '/employer/jobs' ? 'active' : ''}>
              💼 Quản lý Tin tuyển dụng
            </Link>
          </li>
          <li>
            <Link to="/employer/candidates" className={window.location.pathname === '/employer/candidates' ? 'active' : ''}>
              👥 Quản lý Ứng viên
            </Link>
          </li>
          <li>
            <Link to="/employer/applications" className={window.location.pathname === '/employer/applications' ? 'active' : ''}>
              📝 Quản lý Đơn ứng tuyển
            </Link>
          </li>
          <li>
            <Link to="/employer/interviews" className={window.location.pathname === '/employer/interviews' ? 'active' : ''}>
              📅 Lịch phỏng vấn
            </Link>
          </li>
          <li>
            <Link to="/employer/company" className={window.location.pathname === '/employer/company' ? 'active' : ''}>
              🏢 Hồ sơ Công ty
            </Link>
          </li>
        </ul>

        <div style={{ padding: '20px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', textDecoration: 'none' }}>
            ← Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-content-wrapper">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h2 style={{ margin: 0 }}>Chào mừng, {user.companyName || user.name || 'Nhà tuyển dụng'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#777' }}>
              {user.email || ''}
            </p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            Đăng xuất
          </button>
        </header>

        {/* Content */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployerLayout;
