import React, { useState, useEffect } from 'react';
import '../../styles/admin.css';

export default function ManageEmployers() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Quản lý trạng thái Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Khởi tạo state với ĐÚNG 5 trường mà API yêu cầu
  const [formData, setFormData] = useState({
    tenCongTy: '',
    website: '',
    moTa: '',
    logo: '',
    taoBoi: ''
  });

  const API_BASE = import.meta.env.VITE_API_BASE || 'https://localhost:7272';

  // ==========================================
  // 1. GET: Lấy danh sách công ty
  // ==========================================
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/CongTy`);
      if (!res.ok) throw new Error('Lỗi tải dữ liệu');
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error(err);
      setError('Không thể kết nối API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ==========================================
  // 2. POST / PUT: Lưu dữ liệu (Fix lỗi 400)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing ? `${API_BASE}/api/CongTy/${currentId}` : `${API_BASE}/api/CongTy`;
    const method = isEditing ? 'PUT' : 'POST';

    // Đóng gói ĐÚNG 5 trường theo yêu cầu của Swagger
    const payload = {
      tenCongTy: formData.tenCongTy,
      website: formData.website || '',
      moTa: formData.moTa || '',
      logo: formData.logo || '', // Nếu không có logo thì để chuỗi rỗng
      
      // Nếu là POST (Thêm mới), có thể backend bắt buộc taoBoi là GUID của Admin.
      // Nếu là PUT (Sửa), giữ nguyên taoBoi cũ.
      taoBoi: formData.taoBoi || '00000000-0000-0000-0000-000000000000' 
    };

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        console.error("Lỗi Backend:", errorMsg);
        throw new Error('Lưu thất bại');
      }
      
      setShowModal(false);
      fetchCompanies(); 
      alert(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu dữ liệu. Hãy kiểm tra tab Network/Console.');
    }
  };

  // ==========================================
  // 3. DELETE: Xóa công ty
  // ==========================================
  const handleDelete = async (id, ten) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa công ty "${ten}" không?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/CongTy/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Xóa thất bại');
      fetchCompanies(); 
    } catch (err) {
      console.error(err);
      alert('Không thể xóa công ty này.');
    }
  };

  // ==========================================
  // 4. MỞ MODAL THÊM / SỬA
  // ==========================================
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ tenCongTy: '', website: '', moTa: '', logo: '', taoBoi: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (company) => {
    setIsEditing(true);
    setCurrentId(company.maCongTy);
    // Hứng toàn bộ dữ liệu cũ đổ vào form
    setFormData({
      tenCongTy: company.tenCongTy || '',
      website: company.website || '',
      moTa: company.moTa || '',
      logo: company.logo || '',
      taoBoi: company.taoBoi || ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Lọc dữ liệu tìm kiếm
  const filteredCompanies = companies.filter(company => 
    company.tenCongTy && company.tenCongTy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page-container">
      <div className="admin-header-actions" style={{ marginBottom: '15px' }}>
        <h2>Quản lý Công Ty (Nhà tuyển dụng)</h2>
        <div>
          <button className="btn-secondary" onClick={fetchCompanies} style={{ marginRight: '10px' }}>Làm mới</button>
          <button className="btn-primary" onClick={handleOpenAdd}>+ Thêm Công Ty</button>
        </div>
      </div>

      {/* THANH TÌM KIẾM */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="🔍 Nhập tên công ty cần tìm..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ maxWidth: '350px' }}
        />
        {searchTerm && (
          <span style={{ marginLeft: '15px', color: '#666', fontSize: '14px' }}>
            Tìm thấy <strong>{filteredCompanies.length}</strong> kết quả
          </span>
        )}
      </div>

      {error && <div className="admin-error-msg">{error}</div>}

      <div className="admin-table-wrapper">
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Logo</th>
                <th>Tên Công Ty</th>
                <th>Website</th>
                <th>Ngày Tạo</th>
                <th style={{ width: '150px' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy công ty nào.</td>
                </tr>
              ) : (
                filteredCompanies.map((company, index) => {
                  // LOGIC HIỂN THỊ LOGO: Dùng logo thật, hoặc tạo Avatar chữ cái nếu null/rỗng
                  const displayLogo = company.logo 
                    ? company.logo 
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(company.tenCongTy)}&background=random&color=fff&size=128`;

                  return (
                    <tr key={company.maCongTy}>
                      <td>{index + 1}</td>
                      <td>
                        <img 
                          src={displayLogo} 
                          alt={company.tenCongTy} 
                          style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                      </td>
                      <td className="fw-bold">{company.tenCongTy}</td>
                      <td>
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noreferrer" className="text-link">Truy cập</a>
                        ) : '---'}
                      </td>
                      <td>{formatDate(company.ngayTao)}</td>
                      <td className="action-cell">
                        <button className="text-btn edit-btn" onClick={() => handleOpenEdit(company)}>Sửa</button>
                        <span style={{ color: '#ccc' }}> | </span>
                        <button className="text-btn delete-btn" onClick={() => handleDelete(company.maCongTy, company.tenCongTy)}>Xóa</button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL THÊM / SỬA */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Cập nhật Công ty' : 'Thêm Công ty mới'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Công Ty (*)</label>
                <input 
                  type="text" name="tenCongTy" value={formData.tenCongTy} 
                  onChange={handleInputChange} required className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Logo (URL hình ảnh)</label>
                <input 
                  type="url" name="logo" value={formData.logo} 
                  onChange={handleInputChange} className="form-control"
                  placeholder="https://..."
                />
                <small style={{ color: '#888', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  * Bỏ trống nếu chưa có, hệ thống sẽ tự tạo Avatar chữ cái.
                </small>
              </div>
              <div className="form-group">
                <label>Website</label>
                <input 
                  type="url" name="website" value={formData.website} 
                  onChange={handleInputChange} className="form-control"
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea 
                  name="moTa" value={formData.moTa} 
                  onChange={handleInputChange} className="form-control" rows="4"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu dữ liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}