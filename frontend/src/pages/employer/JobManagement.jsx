import React, { useState, useEffect } from 'react';
import { getViecLamCuaCongTy, taoViecLam, capNhatViecLam, xoaViecLam } from '../../services/employerService';
import '../../styles/admin.css';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [maCongTy, setMaCongTy] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0
  });

  const [formData, setFormData] = useState({
    tieuDe: '',
    moTa: '',
    yeuCau: '',
    diaDiem: '',
    soLuong: 1,
    loaiHinhCongViec: 'Full-time',
    capBac: 'Nhân viên',
    mucLuong: '',
    thoiGian: '',
    hanUngTuyen: '',
    luongToThieu: '',
    luongToiDa: '',
    ngayHetHan: ''
  });

  useEffect(() => {
    const storedMaCongTy = localStorage.getItem('maCongTy');
    if (storedMaCongTy) {
      setMaCongTy(storedMaCongTy);
      fetchJobs(storedMaCongTy);
    } else {
      setLoading(false);
      alert('Vui lòng cấu hình Mã Công Ty trong Dashboard!');
    }
  }, []);

  const fetchJobs = async (congTyId, page = 1) => {
    try {
      setLoading(true);
      const response = await getViecLamCuaCongTy(congTyId, {
        page,
        pageSize: pagination.pageSize
      });

      if (response.success) {
        setJobs(response.data);
        setPagination({
          ...pagination,
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách việc làm:', error);
      alert('Không thể tải danh sách việc làm!');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        tieuDe: job.tieuDe || '',
        moTa: job.moTa || '',
        yeuCau: job.yeuCau || '',
        diaDiem: job.diaDiem || '',
        soLuong: job.soLuong || 1,
        loaiHinhCongViec: job.loaiHinhCongViec || 'Full-time',
        capBac: job.capBac || 'Nhân viên',
        mucLuong: job.mucLuong || '',
        thoiGian: job.thoiGian || '',
        hanUngTuyen: job.hanUngTuyen ? job.hanUngTuyen.split('T')[0] : '',
        luongToThieu: job.luongToThieu || '',
        luongToiDa: job.luongToiDa || '',
        ngayHetHan: job.ngayHetHan ? job.ngayHetHan.split('T')[0] : ''
      });
    } else {
      setEditingJob(null);
      setFormData({
        tieuDe: '',
        moTa: '',
        yeuCau: '',
        diaDiem: '',
        soLuong: 1,
        loaiHinhCongViec: 'Full-time',
        capBac: 'Nhân viên',
        mucLuong: '',
        thoiGian: '',
        hanUngTuyen: '',
        luongToThieu: '',
        luongToiDa: '',
        ngayHetHan: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingJob(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        maCongTy: maCongTy,
        soLuong: parseInt(formData.soLuong) || 1,
        hanUngTuyen: formData.hanUngTuyen ? new Date(formData.hanUngTuyen).toISOString() : null,
        ngayHetHan: formData.ngayHetHan ? new Date(formData.ngayHetHan).toISOString() : new Date().toISOString()
      };

      let response;
      if (editingJob) {
        response = await capNhatViecLam(editingJob.maViecLam, dataToSend);
      } else {
        response = await taoViecLam(dataToSend);
      }

      if (response.success) {
        alert(editingJob ? 'Cập nhật thành công!' : 'Tạo tin tuyển dụng thành công!');
        handleCloseModal();
        fetchJobs(maCongTy);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert(error.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin này?')) return;

    try {
      const response = await xoaViecLam(id);
      if (response.success) {
        alert('Xóa thành công!');
        fetchJobs(maCongTy);
      }
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert(error.message || 'Không thể xóa tin này!');
    }
  };

  if (loading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-header-actions">
        <h2>Quản lý Tin tuyển dụng</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          ➕ Đăng tin mới
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Địa điểm</th>
              <th>Cấp bậc</th>
              <th>Mức lương</th>
              <th>Hạn ứng tuyển</th>
              <th>Trạng thái</th>
              <th>Lượt xem</th>
              <th>Số đơn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                  Chưa có tin tuyển dụng nào
                </td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr key={job.maViecLam}>
                  <td className="fw-bold">{job.tieuDe}</td>
                  <td>{job.diaDiem || 'N/A'}</td>
                  <td>{job.capBac || 'N/A'}</td>
                  <td>{job.mucLuong || `${job.luongToThieu} - ${job.luongToiDa}`}</td>
                  <td>
                    {job.hanUngTuyen 
                      ? new Date(job.hanUngTuyen).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </td>
                  <td>
                    <span className={`status-badge ${job.daDuyet ? 'active' : ''}`}>
                      {job.daDuyet ? '✅ Đã duyệt' : '⏳ Chờ duyệt'}
                    </span>
                  </td>
                  <td>{job.luotXem || 0}</td>
                  <td>
                    <a href={`/employer/applications?maViecLam=${job.maViecLam}`} className="text-link">
                      {job.soLuongUngTuyen || 0} đơn
                    </a>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="text-btn edit-btn" 
                        onClick={() => handleOpenModal(job)}
                      >
                        ✏️ Sửa
                      </button>
                      <button 
                        className="text-btn delete-btn" 
                        onClick={() => handleDelete(job.maViecLam)}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            disabled={pagination.currentPage === 1}
            onClick={() => fetchJobs(maCongTy, pagination.currentPage - 1)}
            className="btn-secondary"
          >
            ← Trước
          </button>
          <span style={{ margin: '0 15px' }}>
            Trang {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button 
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => fetchJobs(maCongTy, pagination.currentPage + 1)}
            className="btn-secondary"
          >
            Sau →
          </button>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingJob ? 'Cập nhật tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tiêu đề <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="tieuDe"
                  className="form-control"
                  value={formData.tieuDe}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Địa điểm</label>
                <input
                  type="text"
                  name="diaDiem"
                  className="form-control"
                  value={formData.diaDiem}
                  onChange={handleInputChange}
                  placeholder="Hà Nội, TP.HCM..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label>Loại hình</label>
                  <select
                    name="loaiHinhCongViec"
                    className="form-control"
                    value={formData.loaiHinhCongViec}
                    onChange={handleInputChange}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Cấp bậc</label>
                  <select
                    name="capBac"
                    className="form-control"
                    value={formData.capBac}
                    onChange={handleInputChange}
                  >
                    <option value="Thực tập sinh">Thực tập sinh</option>
                    <option value="Nhân viên">Nhân viên</option>
                    <option value="Trưởng nhóm">Trưởng nhóm</option>
                    <option value="Quản lý">Quản lý</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label>Số lượng</label>
                  <input
                    type="number"
                    name="soLuong"
                    className="form-control"
                    value={formData.soLuong}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Lương tối thiểu</label>
                  <input
                    type="text"
                    name="luongToThieu"
                    className="form-control"
                    value={formData.luongToThieu}
                    onChange={handleInputChange}
                    placeholder="10 triệu"
                  />
                </div>

                <div className="form-group">
                  <label>Lương tối đa</label>
                  <input
                    type="text"
                    name="luongToiDa"
                    className="form-control"
                    value={formData.luongToiDa}
                    onChange={handleInputChange}
                    placeholder="20 triệu"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label>Hạn ứng tuyển</label>
                  <input
                    type="date"
                    name="hanUngTuyen"
                    className="form-control"
                    value={formData.hanUngTuyen}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Ngày hết hạn</label>
                  <input
                    type="date"
                    name="ngayHetHan"
                    className="form-control"
                    value={formData.ngayHetHan}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả công việc</label>
                <textarea
                  name="moTa"
                  className="form-control"
                  value={formData.moTa}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Mô tả chi tiết về công việc..."
                />
              </div>

              <div className="form-group">
                <label>Yêu cầu</label>
                <textarea
                  name="yeuCau"
                  className="form-control"
                  value={formData.yeuCau}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Yêu cầu về kinh nghiệm, kỹ năng..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingJob ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
