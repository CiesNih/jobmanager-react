import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CreateCV.css';

// Simple Auth Component
function AuthModalContent({ onSuccess }) {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu không khớp!');
          setLoading(false);
          return;
        }
      }

      // Giả lập đăng nhập/đăng ký thành công
      const userData = {
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        role: 'user'
      };

      localStorage.setItem('authUser', JSON.stringify(userData));
      window.dispatchEvent(new Event('authChange'));
      
      setTimeout(() => {
        setLoading(false);
        onSuccess();
      }, 500);
    } catch (err) {
      setError('Đã có lỗi xảy ra!');
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h2>
      <p className="auth-subtitle">
        {mode === 'login' 
          ? 'Đăng nhập để sử dụng công cụ tạo CV' 
          : 'Tạo tài khoản mới để bắt đầu'}
      </p>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        {mode === 'register' && (
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng nhập' : 'Đăng ký')}
        </button>
      </form>

      <div className="auth-switch">
        {mode === 'login' ? (
          <p>
            Chưa có tài khoản?{' '}
            <button onClick={() => setMode('register')}>Đăng ký ngay</button>
          </p>
        ) : (
          <p>
            Đã có tài khoản?{' '}
            <button onClick={() => setMode('login')}>Đăng nhập</button>
          </p>
        )}
      </div>
    </div>
  );
}

export default function CreateCV() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedTemplateForAuth, setSelectedTemplateForAuth] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [cvData, setCvData] = useState({
    // Thông tin cá nhân
    fullName: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    avatar: '',
    
    // Giới thiệu
    summary: '',
    
    // Học vấn
    education: [
      { school: '', major: '', period: '', description: '' }
    ],
    
    // Kinh nghiệm
    experience: [
      { company: '', position: '', period: '', description: '' }
    ],
    
    // Kỹ năng
    skills: [
      { name: '', level: 'intermediate' }
    ],
    
    // Dự án
    projects: [
      { name: '', role: '', period: '', description: '' }
    ],
    
    // Chứng chỉ
    certificates: [
      { name: '', issuer: '', year: '' }
    ],
    
    // Sở thích
    hobbies: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
      if (savedUser) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const handleUseTemplate = (templateId) => {
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    
    if (!savedUser) {
      // Chưa đăng nhập -> hiện modal đăng nhập
      setSelectedTemplateForAuth(templateId);
      setShowAuthModal(true);
    } else {
      // Đã đăng nhập -> chuyển đến form tạo CV
      setSelectedTemplate(templateId);
      setIsAuthenticated(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setIsAuthenticated(true);
    if (selectedTemplateForAuth) {
      setSelectedTemplate(selectedTemplateForAuth);
    }
  };

  const templates = [
    {
      id: 'modern',
      name: 'Đào Phú Quý',
      category: 'Đơn giản',
      tag: 'NEW',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=400&fit=crop',
      description: 'Mẫu CV hiện đại, chuyên nghiệp phù hợp với mọi ngành nghề'
    },
    {
      id: 'classic',
      name: 'Đào Phú Quốc',
      category: 'Đơn giản',
      tag: 'NEW',
      image: 'https://images.unsplash.com/photo-1586281380614-7c8f83b3a4e9?w=300&h=400&fit=crop',
      description: 'Mẫu CV cổ điển, trang nhã, dễ đọc'
    },
    {
      id: 'creative',
      name: 'Đào Nam Du',
      category: 'Đơn giản',
      tag: 'NEW',
      image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=300&h=400&fit=crop',
      description: 'Mẫu CV sáng tạo, nổi bật cho ngành thiết kế'
    },
    {
      id: 'professional',
      name: 'Đào Bình Ba',
      category: 'Sáng tạo',
      tag: 'NEW',
      image: 'https://images.unsplash.com/photo-1586281380923-93e59a1b0a5f?w=300&h=400&fit=crop',
      description: 'Mẫu CV chuyên nghiệp cho vị trí quản lý'
    }
  ];

  const [filterCategory, setFilterCategory] = useState('all');

  const handleInputChange = (field, value) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setCvData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const addArrayItem = (field, template) => {
    setCvData(prev => ({
      ...prev,
      [field]: [...prev[field], template]
    }));
  };

  const removeArrayItem = (field, index) => {
    setCvData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleExportPDF = () => {
    alert('Tính năng xuất PDF đang được phát triển!');
  };

  const handleExportWord = () => {
    alert('Tính năng xuất Word đang được phát triển!');
  };

  const handleSaveCV = () => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (!savedUser) {
      alert('Vui lòng đăng nhập để lưu CV!');
      return;
    }

    // Validate required fields
    if (!cvData.fullName || !cvData.position) {
      alert('Vui lòng điền ít nhất Họ tên và Vị trí ứng tuyển!');
      return;
    }

    // Get existing CVs
    const existingCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
    
    // Create CV object
    const cvObject = {
      id: Date.now().toString(),
      template: selectedTemplate,
      data: cvData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to array
    existingCVs.push(cvObject);
    
    // Save to localStorage
    localStorage.setItem('savedCVs', JSON.stringify(existingCVs));
    
    alert('✅ Lưu CV thành công! Bạn có thể xem CV đã lưu trong "Quản lý hồ sơ".');
  };

  // Nếu chưa đăng nhập hoặc chưa chọn template -> hiện landing page
  if (!isAuthenticated) {
    return (
      <div className="create-cv-landing">
        {/* Auth Modal */}
        {showAuthModal && (
          <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>✕</button>
              <AuthModalContent onSuccess={handleAuthSuccess} />
            </div>
          </div>
        )}

        <div className="landing-container">
          {/* Header */}
          <div className="landing-header">
            <h1>Danh sách các mẫu CV được Top nhà tuyển dụng ưa thích</h1>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <span className="filter-label">Lọc theo chủ đề:</span>
            <button 
              className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              ✓ Tất cả
            </button>
            <button 
              className={`filter-btn ${filterCategory === 'simple' ? 'active' : ''}`}
              onClick={() => setFilterCategory('simple')}
            >
              Đơn giản
            </button>
            <button 
              className={`filter-btn ${filterCategory === 'modern' ? 'active' : ''}`}
              onClick={() => setFilterCategory('modern')}
            >
              Hiện đại
            </button>
            <button 
              className={`filter-btn ${filterCategory === 'creative' ? 'active' : ''}`}
              onClick={() => setFilterCategory('creative')}
            >
              Sáng tạo
            </button>
            <button 
              className={`filter-btn ${filterCategory === 'professional' ? 'active' : ''}`}
              onClick={() => setFilterCategory('professional')}
            >
              Chuyên nghiệp
            </button>
          </div>

          {/* Templates Grid */}
          <div className="templates-grid">
            {templates.map((template) => (
              <div key={template.id} className="template-card">
                {template.tag && <span className="template-tag">{template.tag}</span>}
                
                <div className="template-preview">
                  <img src={template.image} alt={template.name} />
                  <div className="template-overlay">
                    <button 
                      className="btn-use-template"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Dùng mẫu này
                    </button>
                  </div>
                </div>

                <div className="template-info">
                  <h3>{template.name}</h3>
                  <div className="template-actions">
                    <button 
                      className="btn-simple"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Đơn giản
                    </button>
                    <button 
                      className="btn-professional"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Chuyên nghiệp
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Đã đăng nhập -> hiện form tạo CV

  return (
    <div className="create-cv-page">
      <div className="cv-container">
        {/* Header */}
        <div className="cv-header">
          <h1>🎨 Tạo CV Chuyên Nghiệp</h1>
          <p>Tạo CV ấn tượng trong vài phút với công cụ miễn phí của chúng tôi</p>
        </div>

        {/* Template Selection */}
        <div className="template-selection">
          <h3>Chọn mẫu CV:</h3>
          <div className="template-options">
            <button 
              className={`template-btn ${selectedTemplate === 'modern' ? 'active' : ''}`}
              onClick={() => setSelectedTemplate('modern')}
            >
              📄 Hiện đại
            </button>
            <button 
              className={`template-btn ${selectedTemplate === 'classic' ? 'active' : ''}`}
              onClick={() => setSelectedTemplate('classic')}
            >
              📋 Cổ điển
            </button>
            <button 
              className={`template-btn ${selectedTemplate === 'creative' ? 'active' : ''}`}
              onClick={() => setSelectedTemplate('creative')}
            >
              🎨 Sáng tạo
            </button>
          </div>
        </div>

        <div className="cv-content">
          {/* Left Panel - Form */}
          <div className="cv-form-panel">
            {/* Tabs */}
            <div className="form-tabs">
              <button 
                className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                👤 Cá nhân
              </button>
              <button 
                className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                onClick={() => setActiveTab('education')}
              >
                🎓 Học vấn
              </button>
              <button 
                className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                💼 Kinh nghiệm
              </button>
              <button 
                className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                ⚡ Kỹ năng
              </button>
              <button 
                className={`tab-btn ${activeTab === 'other' ? 'active' : ''}`}
                onClick={() => setActiveTab('other')}
              >
                ➕ Khác
              </button>
            </div>

            {/* Form Content */}
            <div className="form-content">
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="form-section">
                  <h3>Thông tin cá nhân</h3>
                  
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input 
                      type="text" 
                      placeholder="Nguyễn Văn A"
                      value={cvData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Vị trí ứng tuyển *</label>
                    <input 
                      type="text" 
                      placeholder="Frontend Developer"
                      value={cvData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input 
                        type="email" 
                        placeholder="example@email.com"
                        value={cvData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Số điện thoại *</label>
                      <input 
                        type="tel" 
                        placeholder="0123456789"
                        value={cvData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Địa chỉ</label>
                    <input 
                      type="text" 
                      placeholder="Hà Nội, Việt Nam"
                      value={cvData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <input 
                      type="date"
                      value={cvData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Giới thiệu bản thân</label>
                    <textarea 
                      rows="5" 
                      placeholder="Viết vài dòng giới thiệu về bản thân, mục tiêu nghề nghiệp..."
                      value={cvData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Education Tab */}
              {activeTab === 'education' && (
                <div className="form-section">
                  <h3>Học vấn</h3>
                  
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="array-item">
                      <div className="array-item-header">
                        <h4>Học vấn #{index + 1}</h4>
                        {cvData.education.length > 1 && (
                          <button 
                            className="btn-remove"
                            onClick={() => removeArrayItem('education', index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Trường/Đại học</label>
                        <input 
                          type="text" 
                          placeholder="Đại học Bách Khoa Hà Nội"
                          value={edu.school}
                          onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Chuyên ngành</label>
                        <input 
                          type="text" 
                          placeholder="Công nghệ thông tin"
                          value={edu.major}
                          onChange={(e) => handleArrayChange('education', index, 'major', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Thời gian</label>
                        <input 
                          type="text" 
                          placeholder="2018 - 2022"
                          value={edu.period}
                          onChange={(e) => handleArrayChange('education', index, 'period', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Mô tả</label>
                        <textarea 
                          rows="3" 
                          placeholder="GPA: 3.5/4.0, Tốt nghiệp loại Giỏi..."
                          value={edu.description}
                          onChange={(e) => handleArrayChange('education', index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    className="btn-add"
                    onClick={() => addArrayItem('education', { school: '', major: '', period: '', description: '' })}
                  >
                    + Thêm học vấn
                  </button>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && (
                <div className="form-section">
                  <h3>Kinh nghiệm làm việc</h3>
                  
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="array-item">
                      <div className="array-item-header">
                        <h4>Kinh nghiệm #{index + 1}</h4>
                        {cvData.experience.length > 1 && (
                          <button 
                            className="btn-remove"
                            onClick={() => removeArrayItem('experience', index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Công ty</label>
                        <input 
                          type="text" 
                          placeholder="Công ty ABC"
                          value={exp.company}
                          onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Vị trí</label>
                        <input 
                          type="text" 
                          placeholder="Frontend Developer"
                          value={exp.position}
                          onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Thời gian</label>
                        <input 
                          type="text" 
                          placeholder="01/2022 - Hiện tại"
                          value={exp.period}
                          onChange={(e) => handleArrayChange('experience', index, 'period', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Mô tả công việc</label>
                        <textarea 
                          rows="4" 
                          placeholder="- Phát triển giao diện web với React&#10;- Tối ưu hiệu suất ứng dụng&#10;- Làm việc nhóm với team Backend"
                          value={exp.description}
                          onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    className="btn-add"
                    onClick={() => addArrayItem('experience', { company: '', position: '', period: '', description: '' })}
                  >
                    + Thêm kinh nghiệm
                  </button>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="form-section">
                  <h3>Kỹ năng</h3>
                  
                  {cvData.skills.map((skill, index) => (
                    <div key={index} className="array-item-inline">
                      <div className="form-group flex-1">
                        <input 
                          type="text" 
                          placeholder="Tên kỹ năng (VD: ReactJS, NodeJS...)"
                          value={skill.name}
                          onChange={(e) => handleArrayChange('skills', index, 'name', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <select 
                          value={skill.level}
                          onChange={(e) => handleArrayChange('skills', index, 'level', e.target.value)}
                        >
                          <option value="beginner">Cơ bản</option>
                          <option value="intermediate">Trung bình</option>
                          <option value="advanced">Nâng cao</option>
                          <option value="expert">Chuyên gia</option>
                        </select>
                      </div>

                      {cvData.skills.length > 1 && (
                        <button 
                          className="btn-remove-inline"
                          onClick={() => removeArrayItem('skills', index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button 
                    className="btn-add"
                    onClick={() => addArrayItem('skills', { name: '', level: 'intermediate' })}
                  >
                    + Thêm kỹ năng
                  </button>
                </div>
              )}

              {/* Other Tab */}
              {activeTab === 'other' && (
                <div className="form-section">
                  <h3>Thông tin khác</h3>
                  
                  {/* Projects */}
                  <div className="subsection">
                    <h4>Dự án</h4>
                    {cvData.projects.map((project, index) => (
                      <div key={index} className="array-item">
                        <div className="array-item-header">
                          <span>Dự án #{index + 1}</span>
                          {cvData.projects.length > 1 && (
                            <button 
                              className="btn-remove"
                              onClick={() => removeArrayItem('projects', index)}
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="form-group">
                          <input 
                            type="text" 
                            placeholder="Tên dự án"
                            value={project.name}
                            onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)}
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <input 
                              type="text" 
                              placeholder="Vai trò"
                              value={project.role}
                              onChange={(e) => handleArrayChange('projects', index, 'role', e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <input 
                              type="text" 
                              placeholder="Thời gian"
                              value={project.period}
                              onChange={(e) => handleArrayChange('projects', index, 'period', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <textarea 
                            rows="2" 
                            placeholder="Mô tả dự án"
                            value={project.description}
                            onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      className="btn-add-small"
                      onClick={() => addArrayItem('projects', { name: '', role: '', period: '', description: '' })}
                    >
                      + Thêm dự án
                    </button>
                  </div>

                  {/* Certificates */}
                  <div className="subsection">
                    <h4>Chứng chỉ</h4>
                    {cvData.certificates.map((cert, index) => (
                      <div key={index} className="array-item-inline">
                        <div className="form-group flex-2">
                          <input 
                            type="text" 
                            placeholder="Tên chứng chỉ"
                            value={cert.name}
                            onChange={(e) => handleArrayChange('certificates', index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="form-group flex-1">
                          <input 
                            type="text" 
                            placeholder="Đơn vị cấp"
                            value={cert.issuer}
                            onChange={(e) => handleArrayChange('certificates', index, 'issuer', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <input 
                            type="text" 
                            placeholder="Năm"
                            value={cert.year}
                            onChange={(e) => handleArrayChange('certificates', index, 'year', e.target.value)}
                          />
                        </div>
                        {cvData.certificates.length > 1 && (
                          <button 
                            className="btn-remove-inline"
                            onClick={() => removeArrayItem('certificates', index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      className="btn-add-small"
                      onClick={() => addArrayItem('certificates', { name: '', issuer: '', year: '' })}
                    >
                      + Thêm chứng chỉ
                    </button>
                  </div>

                  {/* Hobbies */}
                  <div className="subsection">
                    <h4>Sở thích</h4>
                    <div className="form-group">
                      <textarea 
                        rows="3" 
                        placeholder="Đọc sách, du lịch, chơi thể thao..."
                        value={cvData.hobbies}
                        onChange={(e) => handleInputChange('hobbies', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="cv-preview-panel">
            <div className="preview-header">
              <h3>👁️ Xem trước CV</h3>
              <div className="preview-actions">
                <button className="btn-export" onClick={handleSaveCV}>
                  💾 Lưu CV
                </button>
                <button className="btn-export" onClick={handleExportPDF}>
                  📄 PDF
                </button>
                <button className="btn-export" onClick={handleExportWord}>
                  📝 Word
                </button>
              </div>
            </div>

            <div className={`cv-preview cv-template-${selectedTemplate}`}>
              {/* CV Header */}
              <div className="cv-preview-header">
                <div className="cv-avatar">
                  {cvData.fullName ? cvData.fullName.charAt(0).toUpperCase() : '👤'}
                </div>
                <div className="cv-header-info">
                  <h2>{cvData.fullName || 'Họ và tên'}</h2>
                  <h3>{cvData.position || 'Vị trí ứng tuyển'}</h3>
                  <div className="cv-contact">
                    {cvData.email && <span>📧 {cvData.email}</span>}
                    {cvData.phone && <span>📱 {cvData.phone}</span>}
                    {cvData.address && <span>📍 {cvData.address}</span>}
                  </div>
                </div>
              </div>

              {/* Summary */}
              {cvData.summary && (
                <div className="cv-section">
                  <h4>Giới thiệu</h4>
                  <p>{cvData.summary}</p>
                </div>
              )}

              {/* Experience */}
              {cvData.experience.some(exp => exp.company) && (
                <div className="cv-section">
                  <h4>Kinh nghiệm làm việc</h4>
                  {cvData.experience.map((exp, index) => (
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
              {cvData.education.some(edu => edu.school) && (
                <div className="cv-section">
                  <h4>Học vấn</h4>
                  {cvData.education.map((edu, index) => (
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
              {cvData.skills.some(skill => skill.name) && (
                <div className="cv-section">
                  <h4>Kỹ năng</h4>
                  <div className="cv-skills">
                    {cvData.skills.map((skill, index) => (
                      skill.name && (
                        <div key={index} className="cv-skill-item">
                          <span className="skill-name">{skill.name}</span>
                          <div className="skill-bar">
                            <div 
                              className={`skill-level skill-level-${skill.level}`}
                            ></div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {cvData.projects.some(proj => proj.name) && (
                <div className="cv-section">
                  <h4>Dự án</h4>
                  {cvData.projects.map((proj, index) => (
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
              {cvData.certificates.some(cert => cert.name) && (
                <div className="cv-section">
                  <h4>Chứng chỉ</h4>
                  {cvData.certificates.map((cert, index) => (
                    cert.name && (
                      <div key={index} className="cv-cert-item">
                        • {cert.name} {cert.issuer && `- ${cert.issuer}`} {cert.year && `(${cert.year})`}
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Hobbies */}
              {cvData.hobbies && (
                <div className="cv-section">
                  <h4>Sở thích</h4>
                  <p>{cvData.hobbies}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
