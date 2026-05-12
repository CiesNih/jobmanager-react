import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

export default function Header({ onOpenAuth }) {
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authUser');
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  const handleEmployerClick = (e) => {
    e.preventDefault();
    if (!user) {
      // Chưa đăng nhập -> Hiển thị modal đăng nhập
      if (onOpenAuth) {
        onOpenAuth('login');
      }
    } else if (user.role === 'employer') {
      // Đã đăng nhập với role employer -> Vào dashboard
      navigate('/employer');
    } else {
      // Đã đăng nhập nhưng không phải employer
      alert('Bạn cần đăng nhập với tài khoản Nhà tuyển dụng để truy cập trang này!');
      if (onOpenAuth) {
        onOpenAuth('login');
      }
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <span className="logo-icon">💼</span>
            <span className="logo-text">Tìm Jobs cùng tôi</span>
          </Link>
        </div>

        <nav className="nav-menu">
          <div className="nav-item">
            <Link to="/jobs" className="nav-link">Việc làm</Link>
          </div>

          <div className="nav-item">
            <Link to="/companies" className="nav-link">Công ty</Link>
          </div>

          <div
            className="nav-item"
            onMouseEnter={() => setShowToolsMenu(true)}
            onMouseLeave={() => setShowToolsMenu(false)}
          >
            <Link to="/tools" className="nav-link">Công cụ <span>▼</span></Link>
            {showToolsMenu && (
              <div className="mega-menu tools-menu">
                <div className="mega-menu-container single-col">
                  <div className="mega-col">
                    <h4>Công cụ hữu ích</h4>
                    <Link to="/tools/salary-calculator">Tính lương GROSS - NET</Link>
                    <Link to="/tools/career-guidance">Hướng nghiệp</Link>
                    <Link to="/tools/create-cv">Tạo CV</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-item">
            <Link to="/blog" className="nav-link">Cẩm nang nghề nghiệp</Link>
          </div>
        </nav>

        <div className="header-auth">
          {!user ? (
            <>
              <button className="btn-login" onClick={() => onOpenAuth && onOpenAuth('login')}>Đăng nhập</button>
              <button className="btn-register" onClick={() => onOpenAuth && onOpenAuth('register')}>Đăng ký</button>
            </>
          ) : (
            <div className="header-user">
              <button className="user-btn" onClick={() => setShowUserMenu(s => !s)}>
                <span className="user-name">Xin chào, <strong>{user.name}</strong> <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span></span>
              </button>
              {showUserMenu && (
                <div className="user-menu custom-dropdown">
                  {user.role === 'admin' ? (
                    <>
                      <button className="menu-item" onClick={() => { setShowUserMenu(false); navigate('/admin'); }}>Dashboard Admin</button>
                      <hr className="menu-divider" />
                      <button className="menu-item logout-item" onClick={handleLogout}>Đăng xuất</button>
                    </>
                  ) : user.role === 'employer' ? (
                    <>
                      <button className="menu-item" onClick={() => { setShowUserMenu(false); navigate('/employer'); }}>Dashboard Nhà tuyển dụng</button>
                      <Link to="/employer/jobs" className="menu-item" onClick={() => setShowUserMenu(false)}>Quản lý tin tuyển dụng</Link>
                      <Link to="/employer/applications" className="menu-item" onClick={() => setShowUserMenu(false)}>Đơn ứng tuyển</Link>
                      <Link to="/employer/interviews" className="menu-item" onClick={() => setShowUserMenu(false)}>Lịch phỏng vấn</Link>
                      <Link to="/employer/company" className="menu-item" onClick={() => setShowUserMenu(false)}>Thông tin công ty</Link>
                      <hr className="menu-divider" />
                      <button className="menu-item logout-item" onClick={handleLogout}>Đăng xuất</button>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" className="menu-item" onClick={() => setShowUserMenu(false)}>👤 Quản lý hồ sơ</Link>
                      <Link to="/applied-jobs" className="menu-item" onClick={() => setShowUserMenu(false)}>📝 Việc làm đã ứng tuyển</Link>
                      <Link to="/saved-jobs" className="menu-item" onClick={() => setShowUserMenu(false)}>💾 Việc làm đã lưu</Link>
                      <Link to="/notifications" className="menu-item" onClick={() => setShowUserMenu(false)}>🔔 Thông báo</Link>
                      <hr className="menu-divider" />
                      <button className="menu-item logout-item" onClick={handleLogout}>Đăng xuất</button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <button 
            onClick={handleEmployerClick}
            className="btn-employer"
          >
            NHÀ TUYỂN DỤNG
          </button>
        </div>
      </div>
    </header>
  );
}