import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Profile.css';

// CV Preview Modal Component
function CVPreviewModal({ cv, onClose }) {
  if (!cv) return null;

  return (
    <div className="cv-preview-modal" onClick={onClose}>
      <div className="cv-preview-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <h2>Xem trước CV</h2>
          <span className={`template-badge-large ${cv.template}`}>
            {cv.template === 'modern' && ' Mẫu Hiện đại'}
            {cv.template === 'classic' && ' Mẫu Cổ điển'}
            {cv.template === 'creative' && ' Mẫu Sáng tạo'}
            {cv.template === 'professional' && ' Mẫu Chuyên nghiệp'}
          </span>
        </div>

        <div className={`cv-preview-content cv-template-${cv.template}`}>
          {/* CV Header */}
          <div className="cv-preview-header">
            <div className="cv-avatar-large">
              {cv.data.fullName?.charAt(0).toUpperCase() || '👤'}
            </div>
            <div className="cv-header-info">
              <h2>{cv.data.fullName || 'Họ và tên'}</h2>
              <h3>{cv.data.position || 'Vị trí ứng tuyển'}</h3>
              <div className="cv-contact">
                {cv.data.email && <span>📧 {cv.data.email}</span>}
                {cv.data.phone && <span>📱 {cv.data.phone}</span>}
                {cv.data.address && <span>📍 {cv.data.address}</span>}
                {cv.data.dateOfBirth && <span>🎂 {cv.data.dateOfBirth}</span>}
              </div>
            </div>
          </div>

          {/* Summary */}
          {cv.data.summary && (
            <div className="cv-section">
              <h4>Giới thiệu</h4>
              <p>{cv.data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cv.data.experience?.some(exp => exp.company) && (
            <div className="cv-section">
              <h4>Kinh nghiệm làm việc</h4>
              {cv.data.experience.map((exp, index) => (
                exp.company && (
                  <div key={index} className="cv-item">
                    <div className="cv-item-header">
                      <strong>{exp.position || 'Vị trí'}</strong>
                      <span className="cv-period">{exp.period}</span>
                    </div>
                    <div className="cv-item-subtitle">{exp.company}</div>
                    {exp.description && <p className="cv-item-desc">{exp.description}</p>}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Education */}
          {cv.data.education?.some(edu => edu.school) && (
            <div className="cv-section">
              <h4>Học vấn</h4>
              {cv.data.education.map((edu, index) => (
                edu.school && (
                  <div key={index} className="cv-item">
                    <div className="cv-item-header">
                      <strong>{edu.school}</strong>
                      <span className="cv-period">{edu.period}</span>
                    </div>
                    <div className="cv-item-subtitle">{edu.major}</div>
                    {edu.description && <p className="cv-item-desc">{edu.description}</p>}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Skills */}
          {cv.data.skills?.some(skill => skill.name) && (
            <div className="cv-section">
              <h4>Kỹ năng</h4>
              <div className="cv-skills">
                {cv.data.skills.map((skill, index) => (
                  skill.name && (
                    <div key={index} className="cv-skill-item">
                      <span className="skill-name">{skill.name}</span>
                      <div className="skill-bar">
                        <div className={`skill-level skill-level-${skill.level}`}></div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {cv.data.projects?.some(proj => proj.name) && (
            <div className="cv-section">
              <h4>Dự án</h4>
              {cv.data.projects.map((proj, index) => (
                proj.name && (
                  <div key={index} className="cv-item">
                    <div className="cv-item-header">
                      <strong>{proj.name}</strong>
                      <span className="cv-period">{proj.period}</span>
                    </div>
                    {proj.role && <div className="cv-item-subtitle">Vai trò: {proj.role}</div>}
                    {proj.description && <p className="cv-item-desc">{proj.description}</p>}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Certificates */}
          {cv.data.certificates?.some(cert => cert.name) && (
            <div className="cv-section">
              <h4>Chứng chỉ</h4>
              {cv.data.certificates.map((cert, index) => (
                cert.name && (
                  <div key={index} className="cv-cert-item">
                    • {cert.name} {cert.issuer && `- ${cert.issuer}`} {cert.year && `(${cert.year})`}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Hobbies */}
          {cv.data.hobbies && (
            <div className="cv-section">
              <h4>Sở thích</h4>
              <p>{cv.data.hobbies}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-modal-action btn-print" onClick={() => window.print()}>
            🖨️ In CV
          </button>
          <button className="btn-modal-action btn-download" onClick={() => alert('Tính năng tải xuống đang phát triển!')}>
            📥 Tải xuống
          </button>
          <button className="btn-modal-action btn-close-modal" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [savedCVs, setSavedCVs] = useState([]);
  const [activeTab, setActiveTab] = useState('cvs');
  const [previewCV, setPreviewCV] = useState(null);

  useEffect(() => {
    // Check authentication
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (!savedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(savedUser));

    // Load saved CVs
    // eslint-disable-next-line react-hooks/immutability
    loadSavedCVs();
  }, [navigate]);

  const loadSavedCVs = () => {
    const cvs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
    setSavedCVs(cvs);
  };

  const handleDeleteCV = (cvId) => {
    if (window.confirm('Bạn có chắc muốn xóa CV này?')) {
      const updatedCVs = savedCVs.filter(cv => cv.id !== cvId);
      localStorage.setItem('savedCVs', JSON.stringify(updatedCVs));
      setSavedCVs(updatedCVs);
    }
  };

  const handleEditCV = (cvId) => {
    navigate(`/tools/create-cv?edit=${cvId}`);
  };

  const handleViewCV = (cvId) => {
    const cv = savedCVs.find(c => c.id === cvId);
    if (cv) {
      setPreviewCV(cv);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      {/* CV Preview Modal */}
      {previewCV && (
        <CVPreviewModal 
          cv={previewCV} 
          onClose={() => setPreviewCV(null)} 
        />
      )}

      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase() || '👤'}
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'cvs' ? 'active' : ''}`}
            onClick={() => setActiveTab('cvs')}
          >
            📄 CV của tôi ({savedCVs.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            👤 Thông tin cá nhân
          </button>
        </div>

        {/* Content */}
        <div className="profile-content">
          {activeTab === 'cvs' && (
            <div className="cvs-section">
              <div className="section-header">
                <h2>Danh sách CV đã tạo</h2>
                <button 
                  className="btn-create-new"
                  onClick={() => navigate('/tools/create-cv')}
                >
                  ➕ Tạo CV mới
                </button>
              </div>

              {savedCVs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>Chưa có CV nào</h3>
                  <p>Bạn chưa tạo CV nào. Hãy tạo CV đầu tiên của bạn!</p>
                  <button 
                    className="btn-create-first"
                    onClick={() => navigate('/tools/create-cv')}
                  >
                    Tạo CV ngay
                  </button>
                </div>
              ) : (
                <div className="cvs-grid">
                  {savedCVs.map((cv) => (
                    <div key={cv.id} className="cv-card">
                      <div className="cv-card-header">
                        <div className="cv-preview-mini">
                          <div className="cv-preview-avatar">
                            {cv.data.fullName?.charAt(0).toUpperCase() || '👤'}
                          </div>
                          <div className="cv-preview-info">
                            <h4>{cv.data.fullName || 'Chưa có tên'}</h4>
                            <p>{cv.data.position || 'Chưa có vị trí'}</p>
                          </div>
                        </div>
                        <span className={`cv-template-badge ${cv.template}`}>
                          {cv.template === 'modern' && '📄 Hiện đại'}
                          {cv.template === 'classic' && '📋 Cổ điển'}
                          {cv.template === 'creative' && '🎨 Sáng tạo'}
                          {cv.template === 'professional' && '💼 Chuyên nghiệp'}
                        </span>
                      </div>

                      <div className="cv-card-body">
                        <div className="cv-meta">
                          <span className="cv-meta-item">
                            📧 {cv.data.email || 'Chưa có email'}
                          </span>
                          <span className="cv-meta-item">
                            📱 {cv.data.phone || 'Chưa có SĐT'}
                          </span>
                        </div>
                        
                        <div className="cv-stats">
                          <div className="cv-stat">
                            <span className="stat-label">Kinh nghiệm:</span>
                            <span className="stat-value">{cv.data.experience?.filter(e => e.company).length || 0}</span>
                          </div>
                          <div className="cv-stat">
                            <span className="stat-label">Kỹ năng:</span>
                            <span className="stat-value">{cv.data.skills?.filter(s => s.name).length || 0}</span>
                          </div>
                          <div className="cv-stat">
                            <span className="stat-label">Học vấn:</span>
                            <span className="stat-value">{cv.data.education?.filter(e => e.school).length || 0}</span>
                          </div>
                        </div>

                        <div className="cv-date">
                          <span>🕒 Cập nhật: {formatDate(cv.updatedAt)}</span>
                        </div>
                      </div>

                      <div className="cv-card-actions">
                        <button 
                          className="btn-action btn-view"
                          onClick={() => handleViewCV(cv.id)}
                          title="Xem CV"
                        >
                          👁️ Xem
                        </button>
                        <button 
                          className="btn-action btn-edit"
                          onClick={() => handleEditCV(cv.id)}
                          title="Chỉnh sửa"
                        >
                          ✏️ Sửa
                        </button>
                        <button 
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteCV(cv.id)}
                          title="Xóa"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="info-section">
              <h2>Thông tin cá nhân</h2>
              <div className="info-form">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input type="text" value={user.name} readOnly />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user.email} readOnly />
                </div>
                <div className="form-group">
                  <label>Vai trò</label>
                  <input type="text" value={user.role === 'admin' ? 'Quản trị viên' : 'Ứng viên'} readOnly />
                </div>
                <p className="info-note">
                  💡 Để cập nhật thông tin cá nhân, vui lòng liên hệ quản trị viên.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
