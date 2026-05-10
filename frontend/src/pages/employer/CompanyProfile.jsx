import React, { useState, useEffect } from 'react';
import { getThongTinCongTy, capNhatCongTy } from '../../services/employerService';
import '../../styles/admin.css';

const CompanyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maCongTy, setMaCongTy] = useState('');
  const [formData, setFormData] = useState({
    tenCongTy: '',
    slug: '',
    website: '',
    moTa: '',
    logo: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const storedMaCongTy = localStorage.getItem('maCongTy');
    if (storedMaCongTy) {
      setMaCongTy(storedMaCongTy);
      fetchCompanyInfo(storedMaCongTy);
    } else {
      setLoading(false);
      alert('Vui lòng cấu hình Mã Công Ty trong Dashboard!');
    }
  }, []);

  useEffect(() => {
    // Check if form data has changed
    if (originalData) {
      const changed = Object.keys(formData).some(
        key => formData[key] !== originalData[key]
      );
      setHasChanges(changed);
    }
  }, [formData, originalData]);

  const fetchCompanyInfo = async (congTyId) => {
    try {
      setLoading(true);
      const response = await getThongTinCongTy(congTyId);
      
      if (response.success) {
        const data = {
          tenCongTy: response.data.tenCongTy || '',
          slug: response.data.slug || '',
          website: response.data.website || '',
          moTa: response.data.moTa || '',
          logo: response.data.logo || ''
        };
        setFormData(data);
        setOriginalData(data);
      } else {
        alert('Không thể tải thông tin công ty!');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Không thể tải thông tin công ty!');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasChanges) {
      alert('Không có thay đổi nào để lưu!');
      return;
    }

    try {
      setSaving(true);
      const response = await capNhatCongTy(maCongTy, formData);
      
      if (response.success) {
        alert('✅ Cập nhật thông tin công ty thành công!');
        setOriginalData(formData);
        setHasChanges(false);
      } else {
        alert('❌ Cập nhật thất bại: ' + (response.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('❌ Không thể cập nhật thông tin công ty!');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn hủy các thay đổi?')) {
      setFormData(originalData);
      setHasChanges(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.tenCongTy
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    setFormData(prev => ({ ...prev, slug }));
  };

  if (loading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-header-actions">
        <h2>Hồ sơ Công ty</h2>
        {hasChanges && (
          <span style={{ 
            color: '#ffc107', 
            fontSize: '14px', 
            fontWeight: '600',
            marginLeft: '10px'
          }}>
            ⚠️ Có thay đổi chưa lưu
          </span>
        )}
      </div>

      <div className="dashboard-panel">
        <form onSubmit={handleSubmit}>
          {/* Thông tin cơ bản */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              color: '#3c8dbc', 
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #3c8dbc'
            }}>
              📋 Thông tin cơ bản
            </h3>

            <div className="form-group">
              <label className="required">Tên công ty</label>
              <input
                type="text"
                name="tenCongTy"
                className="form-control"
                value={formData.tenCongTy}
                onChange={handleInputChange}
                required
                placeholder="Ví dụ: Công ty TNHH ABC"
              />
            </div>

            <div className="form-group">
              <label className="required">Slug (URL thân thiện)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  name="slug"
                  className="form-control"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  placeholder="cong-ty-abc"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={generateSlug}
                  title="Tự động tạo slug từ tên công ty"
                >
                  🔄 Tạo tự động
                </button>
              </div>
              <small style={{ color: '#666', fontSize: '12px' }}>
                URL sẽ là: /companies/{formData.slug || 'slug'}
              </small>
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                className="form-control"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              color: '#3c8dbc', 
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #3c8dbc'
            }}>
              📝 Mô tả công ty
            </h3>

            <div className="form-group">
              <label>Mô tả chi tiết</label>
              <textarea
                name="moTa"
                className="form-control"
                value={formData.moTa}
                onChange={handleInputChange}
                rows="8"
                placeholder="Giới thiệu về công ty, lĩnh vực hoạt động, văn hóa doanh nghiệp..."
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                {formData.moTa.length} ký tự
              </small>
            </div>
          </div>

          {/* Logo */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              color: '#3c8dbc', 
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #3c8dbc'
            }}>
              🖼️ Logo công ty
            </h3>

            <div className="form-group">
              <label>URL Logo</label>
              <input
                type="url"
                name="logo"
                className="form-control"
                value={formData.logo}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Nhập URL hình ảnh logo công ty (khuyến nghị: 200x200px, PNG/JPG)
              </small>
            </div>

            {formData.logo && (
              <div style={{ marginTop: '15px' }}>
                <p style={{ fontWeight: '600', marginBottom: '10px' }}>Xem trước:</p>
                <div style={{ 
                  padding: '20px', 
                  background: '#f5f5f5', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <img 
                    src={formData.logo} 
                    alt="Logo công ty"
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px',
                      objectFit: 'contain',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: 'white',
                      padding: '10px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <p style={{ 
                    display: 'none', 
                    color: '#dc3545',
                    marginTop: '10px'
                  }}>
                    ❌ Không thể tải hình ảnh. Vui lòng kiểm tra URL!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Thông tin hệ thống */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              color: '#999', 
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #ddd'
            }}>
              ℹ️ Thông tin hệ thống
            </h3>

            <div style={{ 
              background: '#f9f9f9', 
              padding: '15px', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#666'
            }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Mã công ty:</strong> {maCongTy}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Lưu ý:</strong> Các thông tin như Ngày tạo, Ngày cập nhật được quản lý tự động bởi hệ thống.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions" style={{ 
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '2px solid #eee'
          }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              disabled={!hasChanges || saving}
            >
              🔄 Hủy thay đổi
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!hasChanges || saving}
            >
              {saving ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="dashboard-panel" style={{ 
        marginTop: '20px',
        background: '#e7f3ff',
        borderLeft: '4px solid #3c8dbc'
      }}>
        <h4 style={{ marginTop: 0, color: '#3c8dbc' }}>💡 Mẹo</h4>
        <ul style={{ marginBottom: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Tên công ty nên rõ ràng, dễ nhớ và phản ánh đúng thương hiệu</li>
          <li>Slug được dùng trong URL, nên ngắn gọn và không chứa ký tự đặc biệt</li>
          <li>Mô tả chi tiết giúp ứng viên hiểu rõ hơn về công ty</li>
          <li>Logo nên có kích thước phù hợp (khuyến nghị 200x200px) và định dạng PNG/JPG</li>
          <li>Cập nhật thông tin thường xuyên để thu hút ứng viên chất lượng</li>
        </ul>
      </div>
    </div>
  );
};

export default CompanyProfile;
