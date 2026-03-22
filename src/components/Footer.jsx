import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaYoutube, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Cột 1: Giới thiệu */}
        <div className="footer-column branding">
          <h2 className="footer-logo">Job<span>Manager</span></h2>
          <p className="footer-description">
            Nền tảng kết nối ứng viên tài năng và nhà tuyển dụng hàng đầu Việt Nam. 
            Chúng tôi giúp bạn xây dựng sự nghiệp vững chắc.
          </p>
          <div className="social-links">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        {/* Cột 2: Cho Ứng Viên */}
        <div className="footer-column">
          <h3>Dành Cho Ứng Viên</h3>
          <ul>
            <li><Link to="/">Tìm việc làm</Link></li>
            <li><Link to="/candidates">Danh sách ứng viên</Link></li>
            <li><Link to="#">Cẩm nang nghề nghiệp</Link></li>
            <li><Link to="#">Tạo CV chuyên nghiệp</Link></li>
          </ul>
        </div>

        {/* Cột 3: Cho Nhà Tuyển Dụng */}
        <div className="footer-column">
          <h3>Nhà Tuyển Dụng</h3>
          <ul>
            <li><Link to="#">Đăng tin tuyển dụng</Link></li>
            <li><Link to="#">Tìm kiếm hồ sơ</Link></li>
            <li><Link to="#">Sản phẩm dịch vụ</Link></li>
            <li><Link to="/test-api">Hệ thống API</Link></li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div className="footer-column contact-info">
          <h3>Liên Hệ</h3>
          <p><FaMapMarkerAlt /> 123 Đường ABC, Quận 1, TP. HCM</p>
          <p><FaPhoneAlt /> (028) 1234 5678</p>
          <p><FaEnvelope /> support@jobmanager.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 JobManager Project - Software Engineering Student. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Chính sách bảo mật</a>
        </div>
      </div>
    </footer>
  );
}