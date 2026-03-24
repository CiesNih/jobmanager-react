import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/JobDetail.css';

export default function JobDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilterJob = async () => {
      try {
        const res = await axios.get(`https://localhost:7122/api/ViecLam/`);
        const foundJob = res.data.find(item => item.maViecLam === id);
        if (foundJob) {
          setJob(foundJob); 
        } else {
          console.error("Không tìm thấy công việc với ID này");
        }
      } catch (err) {
        console.error("Lỗi khi kết nối API:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAndFilterJob();
    }
  }, [id]);

  if (loading) return <div className="loading-container">Đang tải dữ liệu công việc...</div>;
  if (!job) return <div className="error-container">Không tìm thấy công việc này hoặc đã hết hạn tuyển dụng.</div>;

  return (
    <div className="job-detail-layout">
      {}
      <div className="main-detail-column">
        {}
        <div className="detail-card header-card">
          <button onClick={() => navigate(-1)} className="btn-back-detail">⬅ Quay lại</button>
          
          <h1 className="detail-title">{job.tieuDe}</h1>
          
          <div className="quick-info-grid">
            <div className="info-item">
              <span className="info-icon">💰</span>
              <div className="info-text">
                <span className="info-label">Mức lương</span>
                <span className="info-value">
                  {job.luongToiThieu?.toLocaleString()} - {job.luongToiDa?.toLocaleString()} VNĐ
                </span>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div className="info-text">
                <span className="info-label">Địa điểm</span>
                <span className="info-value text-blue">{job.diaDiem || 'Bình Dương'}</span>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⏳</span>
              <div className="info-text">
                <span className="info-label">Kinh nghiệm</span>
                <span className="info-value">1 năm</span> {}
              </div>
            </div>
          </div>
          
          <p className="deadline-text">Hạn nộp hồ sơ: <strong>{new Date(job.ngayDang).toLocaleDateString()}</strong> (Cập nhật dữ liệu thật từ ngayDang)</p>
          
          <div className="action-buttons-group">
            <button className="btn-apply-large">ỨNG TUYỂN NGAY</button>
            <button className="btn-chat-detail">Chat với NTD</button>
            <button className="btn-icon-detail heart-icon">♡</button>
            <button className="btn-icon-detail share-icon">🔗</button>
          </div>
        </div>

        {}
        <div className="detail-card location-card">
          <h3>🗺️ Địa điểm làm việc: <span className="text-blue">{job.diaDiem}</span></h3>
          <p className="specific-address">Dữ liệu thật từ `diaDiem` API Swagger.</p>
        </div>

        {}
        <div className="detail-card content-card">
          <h2 className="section-title-detail">Chi Tiết Công Việc</h2>
          
          <h3>Mô Tả Công Việc:</h3>
          {}
          <p className="job-description-text">
            {job.moTa || 'Dữ liệu mô tả công việc đang được cập nhật từ hệ thống...'}
          </p>

          <h3>Yêu Cầu Ứng Viên:</h3>
          {}
          <p className="job-description-text">
            {job.yeuCau || 'Dữ liệu yêu cầu ứng viên đang được cập nhật từ hệ thống...'}
          </p>

          <h3>Quyền Lợi:</h3>
          {}
          <p className="job-description-text">
            {job.quyenLoi || 'Lương thưởng hấp dẫn, chế độ đầy đủ. Trao đổi khi phỏng vấn.'}
          </p>
        </div>
      </div>

      {}
      <aside className="sidebar-detail-column">
        {}
        <div className="sidebar-card company-card-detail">
          <div className="company-logo-large">
             {job.tieuDe?.charAt(0).toUpperCase()}
          </div>
          <h3>{job.tenCongTy}</h3>
          <p className="industry-text">Lĩnh vực: <span className="tag-detail">Sản xuất / May mặc</span></p>
        </div>

        {}
        <div className="sidebar-card general-info-card">
          <h3>Thông tin chung</h3>
          <div className="info-list">
            <p>Loại hình: <strong>{job.loaiHinhCongViec || 'Full-time'}</strong></p>
            <p>Cấp bậc: <strong>Nhân viên</strong></p>
            <p>Ngày đăng tuyến: <strong>{new Date(job.ngayDang).toLocaleDateString()}</strong></p>
          </div>
        </div>
      </aside>
    </div>
  );
}