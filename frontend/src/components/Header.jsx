import React, { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

export default function Header({ onOpenAuth }) {
  const [showJobMenu, setShowJobMenu] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
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

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authUser');
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  // Dữ liệu tĩnh cho Menu
  const jobCategories = {
    nganhNghe: ["Tài Chính/Ngân Hàng", "Kế Toán/Kiểm Toán", "Hành Chính/Văn Phòng", "Kinh Doanh/Bán Hàng", "Marketing/Quảng Cáo", "Xây dựng/Kiến Trúc", "Công Nghệ Thông Tin", "Nhân Sự"],
    diaDiem: ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Bình Dương", "Hải Phòng", "Đồng Nai", "Quảng Ninh"],
    nhuCau: ["Tuyển Gấp", "Nổi Bật", "Lao động phổ thông", "Không cần bằng cấp", "Online tại nhà", "Part-time", "Thời vụ", "Remote"]
  };
  
  const companyCategories = [
    "Ngân hàng", "Bảo hiểm", "Phần mềm", "Xây dựng", 
    "Bất động sản", "Thương mại điện tử", "Sản xuất", "Dịch vụ"
  ];

  return (
    <header className="header">
      <div className="header-container">
        
        {/* LOGO */}
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <span className="logo-icon">💼</span>
            <span className="logo-text">Tìm Jobs cùng tôi</span>
          </Link>
        </div>

        {/* NAVIGATION MENU */}
        <nav className="nav-menu">
          
          {/* MENU: VIỆC LÀM */}
          <div 
            className="nav-item"
            onMouseEnter={() => setShowJobMenu(true)} 
            onMouseLeave={() => setShowJobMenu(false)} 
          >
            <Link to="/jobs" className="nav-link">Việc làm <span>▼</span></Link>
            {showJobMenu && (
              <div className="mega-menu">
                <div className="mega-menu-container">
                  <div className="mega-col">
                    <h4>Việc theo ngành nghề</h4>
                    {jobCategories.nganhNghe.map(item => (
                      <Link key={item} to={`/jobs/${item}`}>{item}</Link>
                    ))}
                  </div>
                  <div className="mega-col">
                    <h4>Việc theo địa điểm</h4>
                    {jobCategories.diaDiem.map(item => (
                      <Link key={item} to={`/location/${item}`}>{item}</Link>
                    ))}
                  </div>
                  <div className="mega-col">
                    <h4>Việc theo nhu cầu</h4>
                    {jobCategories.nhuCau.map(item => (
                      <Link key={item} to={`/type/${item}`}>{item}</Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MENU: CÔNG TY */}
          <div className="nav-item" onMouseEnter={() => setShowCompanyMenu(true)} onMouseLeave={() => setShowCompanyMenu(false)}>
            <Link to="/companies" className="nav-link">Công ty <span>▼</span></Link>
            {showCompanyMenu && (
              <div className="mega-menu mini-menu">
                <div className="mega-menu-container single-col">
                  <div className="mega-col">
                    <h4>Top ngành nghề phổ biến</h4>
                    <div className="company-grid">
                       {companyCategories.map(item => (
                         <Link key={item} to={`/companies/${item}`}>{item}</Link>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-item">
            <Link to="/candidates" className="nav-link">CV/Hồ sơ <span>▼</span></Link>
          </div>
          <div className="nav-item">
            <Link to="/tools" className="nav-link">Công cụ <span>▼</span></Link>
          </div>
          <div className="nav-item">
            <Link to="/blog" className="nav-link">Thông báo thống kê</Link>
          </div>
        </nav>

        {/* AUTHENTICATION SECTION */}
        <div className="header-auth">
          {!user ? (
            // Trạng thái: CHƯA ĐĂNG NHẬP
            <>
              <button className="btn-login" onClick={() => onOpenAuth && onOpenAuth('login')}>Đăng nhập</button>
              <button className="btn-register" onClick={() => onOpenAuth && onOpenAuth('register')}>Đăng ký</button>
            </>
          ) : (
            // Trạng thái: ĐÃ ĐĂNG NHẬP
            <div className="header-user">
              {/* Nút hiển thị chữ Xin chào */}
              <button className="user-btn" onClick={() => setShowUserMenu(s => !s)}>
                <span className="user-name">Xin chào, <strong>{user.name}</strong> <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span></span>
              </button>
              
              {/* DROPDOWN USER MENU GIỐNG ẢNH */}
              {showUserMenu && (
                <div className="user-menu custom-dropdown">
                  {user.role === 'admin' ? (
                    <>
                      <button className="menu-item" onClick={() => { setShowUserMenu(false); navigate('/admin'); }}>Dashboard Admin</button>
                      <hr className="menu-divider" />
                      <button className="menu-item logout-item" onClick={handleLogout}>Đăng xuất</button>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" className="menu-item" onClick={() => setShowUserMenu(false)}>Quản lý hồ sơ</Link>
                      <Link to="/applied-jobs" className="menu-item" onClick={() => setShowUserMenu(false)}>Việc làm đã ứng tuyển</Link>
                      <Link to="/saved-jobs" className="menu-item" onClick={() => setShowUserMenu(false)}>Việc làm đã lưu</Link>
                      <Link to="/change-password" className="menu-item" onClick={() => setShowUserMenu(false)}>Đổi mật khẩu</Link>
                      <Link to="/settings" className="menu-item" onClick={() => setShowUserMenu(false)}>Cài đặt thông báo</Link>
                      <hr className="menu-divider" />
                      <button className="menu-item logout-item" onClick={handleLogout}>Đăng xuất</button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          
          <Link to="/employer" className="btn-employer">NHÀ TUYỂN DỤNG</Link>
        </div>
        
      </div>
    </header>
  );
}