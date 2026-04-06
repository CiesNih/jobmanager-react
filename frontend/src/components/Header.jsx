import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import '../styles/Header.css';

export default function Header({ onOpenAuth }) {
  const [showJobMenu, setShowJobMenu] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

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
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <span className="logo-icon">💼</span>
            <span className="logo-text">Tìm Jobs cùng tôi</span>
          </Link>
        </div>

        <nav className="nav-menu">
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

          <div className="nav-item" onMouseEnter={() => setShowCompanyMenu(true)} onMouseLeave={() => setShowCompanyMenu(false)}>
            <Link to="/companies" className="nav-link">Công ty <span>▼</span></Link>
            {showCompanyMenu && (
              <div className="mega-menu mini-menu"> {}
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

        <div className="header-auth">
          {onOpenAuth ? (
            <>
              <button className="btn-register" onClick={() => onOpenAuth('register')}>Đăng ký</button>
              <button className="btn-login" onClick={() => onOpenAuth('login')}>Đăng nhập</button>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-register">Đăng ký</Link>
              <Link to="/login" className="btn-login">Đăng nhập</Link>
            </>
          )}
          <Link to="/employer" className="btn-employer">NHÀ TUYỂN DỤNG</Link>
        </div>
      </div>
    </header>
  );
}

