import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/JobDetail.css';

export default function JobDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchAndFilterJob = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:7272';
        
        // ✅ Gọi API
        const res = await axios.get(`${baseUrl}/api/ViecLam/${id}`);
        
        // ✅ Lấy res.data.data vì API wrap data
        if (res.data && res.data.data) {
          const jobData = res.data.data;
          setJob(jobData);
          checkIfApplied(jobData.maViecLam);
          checkIfSaved(jobData.maViecLam);
        } else {
          console.error("Không tìm thấy công việc");
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

  const checkIfApplied = (jobId) => {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    const applied = appliedJobs.some(job => job.maViecLam === jobId);
    setHasApplied(applied);
  };

  const checkIfSaved = (jobId) => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const saved = savedJobs.some(job => job.maViecLam === jobId);
    setIsSaved(saved);
  };

  const handleSaveJob = () => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (!savedUser) {
      alert('Vui lòng đăng nhập để lưu việc làm!');
      navigate('/');
      return;
    }

    // Get existing saved jobs
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updatedJobs = savedJobs.filter(j => j.maViecLam !== job.maViecLam);
      localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
      setIsSaved(false);
      alert('Đã bỏ lưu việc làm này!');
    } else {
      // Add to saved
      const savedJob = {
        ...job,
        savedAt: new Date().toISOString()
      };
      savedJobs.push(savedJob);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setIsSaved(true);
      alert('✅ Đã lưu việc làm! Bạn có thể xem trong "Việc làm đã lưu".');
    }
  };

  const handleApply = () => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (!savedUser) {
      alert('Vui lòng đăng nhập để ứng tuyển!');
      navigate('/');
      return;
    }

    if (hasApplied) {
      alert('Bạn đã ứng tuyển công việc này rồi!');
      return;
    }

    const user = JSON.parse(savedUser);

    // Get existing applied jobs
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    
    // Create application object with full candidate info
    const application = {
      ...job,
      applicationId: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appliedAt: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
      userId: user.id || user.email,
      candidateName: user.name || 'Ứng viên',
      candidateEmail: user.email || user.id,
      candidatePhone: user.phone || '0123456789',
      experience: '2 năm', // Có thể lấy từ profile
      education: 'Đại học', // Có thể lấy từ profile
      coverLetter: `Tôi rất quan tâm đến vị trí ${job.tieuDe} tại ${job.tenCongTy}. Tôi tin rằng với kinh nghiệm và kỹ năng của mình, tôi có thể đóng góp tích cực cho công ty.`
    };

    // Add to array
    appliedJobs.push(application);
    
    // Save to localStorage
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
    
    setHasApplied(true);
    alert('✅ Ứng tuyển thành công! Bạn có thể xem trong "Việc làm đã ứng tuyển".');
  };

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
            <button 
              className={`btn-apply-large ${hasApplied ? 'applied' : ''}`}
              onClick={handleApply}
              disabled={hasApplied}
            >
              {hasApplied ? '✓ ĐÃ ỨNG TUYỂN' : 'ỨNG TUYỂN NGAY'}
            </button>
            <button className="btn-chat-detail">Chat với NTD</button>
            <button 
              className={`btn-icon-detail heart-icon ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveJob}
              title={isSaved ? 'Bỏ lưu' : 'Lưu việc làm'}
            >
              {isSaved ? '♥' : '♡'}
            </button>
            <button className="btn-icon-detail share-icon">🔗</button>
          </div>
        </div>

        {}
        <div className="detail-card location-card">
          <h3>🗺️ Địa điểm làm việc: <span className="text-blue">{job.diaDiem}</span></h3>
          <p className="specific-address">Ghi chú: Công việc được đưa lên bởi Job Tin</p>
        </div>

        {}
        <div className="detail-card content-card">
          <h2 className="section-title-detail">Chi Tiết Công Việc</h2>
          
          <h3>Mô Tả Công Việc:</h3>
          {}
          <p className="job-description-text">
            {job.moTa || 'Công việc sẽ được cập nhật chi tiết từ hệ thống...'}
          </p>

          <h3>Yêu Cầu Ứng Viên:</h3>
          {}
          <p className="job-description-text">
            {job.yeuCau || 'Yêu cầu chi tiết: Kinh nghiệm 1 năm, tốt nghiệp cao đẳng trở lên. Ưu tiên ứng viên có kỹ năng giao tiếp tốt.'}
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