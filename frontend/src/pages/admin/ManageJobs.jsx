import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import '../../styles/admin.css';

const API_URL = import.meta.env.VITE_API_ADMIN ? `${import.meta.env.VITE_API_ADMIN}/api/ViecLam` : 'https://localhost:7272/api/ViecLam';

const getAuthToken = () => {
  const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      return user.token || null;
    } catch {
      return null;
    }
  }
  return null;
};

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, pending, rejected
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching jobs from:', API_URL);
      console.log('🔑 Token:', getAuthToken() ? 'Có token' : 'Không có token');
      
      const res = await fetch(API_URL, {
        headers: getHeaders()
      });
      
      console.log('📡 Response status:', res.status);
      
      // Nếu 401 và có token, nghĩa là token hết hạn
      if (res.status === 401 && getAuthToken()) {
        console.error('❌ 401 Unauthorized - Token không hợp lệ');
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/';
        return;
      }
      
      // Nếu 401 nhưng không có token, thử gọi lại không cần auth
      if (res.status === 401 && !getAuthToken()) {
        console.log('⚠️ 401 but no token, retrying without auth...');
        const res2 = await fetch(API_URL);
        if (res2.ok) {
          const data = await res2.json();
          console.log('✅ Data received (no auth):', data);
          const jobsList = data.data || data || [];
          setJobs(Array.isArray(jobsList) ? jobsList : []);
          setLoading(false);
          return;
        }
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ API Error:', errorText);
        throw new Error('Lỗi khi tải dữ liệu');
      }
      
      const data = await res.json();
      console.log('✅ Data received:', data);
      
      // API trả về {success: true, data: [...]} nên cần lấy data.data
      const jobsList = data.data || data || [];
      console.log('✅ Jobs list:', jobsList);
      
      setJobs(Array.isArray(jobsList) ? jobsList : []);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      alert('Không thể tải danh sách việc làm! Chi tiết: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa việc làm "${title}" không?`)) return;
    
    try {
      const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (!res.ok) throw new Error('Xóa thất bại');
      
      alert('Xóa việc làm thành công!');
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa việc làm!');
    }
  };

  const handleApprove = async (job) => {
    if (!window.confirm(`Duyệt tin tuyển dụng "${job.tieuDe}"?`)) return;
    
    try {
      const res = await fetch(`${API_URL}/${encodeURIComponent(job.maViecLam)}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          ...job,
          trangThai: 'approved' // Hoặc status code tùy backend
        })
      });
      
      if (!res.ok) throw new Error('Duyệt thất bại');
      
      alert('Duyệt tin thành công!');
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi duyệt tin!');
    }
  };

  const handleReject = async (job) => {
    const reason = window.prompt('Nhập lý do từ chối:');
    if (!reason) return;
    
    try {
      const res = await fetch(`${API_URL}/${encodeURIComponent(job.maViecLam)}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          ...job,
          trangThai: 'rejected',
          lyDoTuChoi: reason
        })
      });
      
      if (!res.ok) throw new Error('Từ chối thất bại');
      
      alert('Đã từ chối tin tuyển dụng!');
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi từ chối tin!');
    }
  };

  const handleViewDetail = (job) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    return `${min?.toLocaleString() || '0'} - ${max?.toLocaleString() || '0'} VNĐ`;
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchSearch = job.tieuDe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       job.tenCongTy?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || 
                       (filterStatus === 'active' && job.trangThai === 'approved') ||
                       (filterStatus === 'pending' && job.trangThai === 'pending') ||
                       (filterStatus === 'rejected' && job.trangThai === 'rejected');
    
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontWeight: 'normal', color: '#333', margin: 0 }}>Quản lý Việc làm</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="block-btn" onClick={fetchJobs}>🔄 Làm mới</button>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-panel" style={{ marginBottom: '20px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: 15, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            className="search-input"
            placeholder="🔍 Tìm kiếm theo tiêu đề hoặc công ty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '300px' }}
          />
          
          <select 
            className="input" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đã duyệt</option>
            <option value="pending">Chờ duyệt</option>
            <option value="rejected">Đã từ chối</option>
          </select>

          {searchTerm && (
            <span style={{ color: '#666', fontSize: '14px' }}>
              Tìm thấy <strong>{filteredJobs.length}</strong> kết quả
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="dashboard-panel">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải dữ liệu...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>STT</th>
                <th>Tiêu đề</th>
                <th>Công ty</th>
                <th>Địa điểm</th>
                <th>Lương</th>
                <th>Ngày đăng</th>
                <th>Trạng thái</th>
                <th style={{ width: '200px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                    Không tìm thấy việc làm nào.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job, index) => (
                  <tr key={job.maViecLam}>
                    <td>{index + 1}</td>
                    <td>
                      <strong style={{ color: '#d32f2f' }}>{job.tieuDe}</strong>
                    </td>
                    <td>{job.tenCongTy || 'N/A'}</td>
                    <td>{job.diaDiem || 'N/A'}</td>
                    <td>{formatSalary(job.luongToiThieu, job.luongToiDa)}</td>
                    <td>{formatDate(job.ngayDang)}</td>
                    <td>
                      {job.trangThai === 'approved' && (
                        <span className="status-badge active">Đã duyệt</span>
                      )}
                      {job.trangThai === 'pending' && (
                        <span className="status-badge" style={{ background: '#ffc107', color: '#fff' }}>Chờ duyệt</span>
                      )}
                      {job.trangThai === 'rejected' && (
                        <span className="status-badge" style={{ background: '#f44336', color: '#fff' }}>Đã từ chối</span>
                      )}
                      {!job.trangThai && (
                        <span className="status-badge active">Hoạt động</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <button 
                          className="block-btn" 
                          onClick={() => handleViewDetail(job)}
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        {job.trangThai === 'pending' && (
                          <>
                            <button 
                              className="block-btn block-add" 
                              onClick={() => handleApprove(job)}
                              style={{ padding: '6px 10px', fontSize: '12px' }}
                              title="Duyệt tin"
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="block-btn" 
                              onClick={() => handleReject(job)}
                              style={{ padding: '6px 10px', fontSize: '12px', background: '#ff9800' }}
                              title="Từ chối"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        <button 
                          className="block-btn block-delete" 
                          onClick={() => handleDelete(job.maViecLam, job.tieuDe)}
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Chi tiết việc làm</h3>
              <button 
                className="block-btn block-delete" 
                onClick={() => setShowDetailModal(false)}
                style={{ padding: '8px 16px' }}
              >
                ✕ Đóng
              </button>
            </div>

            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h2 style={{ color: '#d32f2f', marginTop: 0 }}>{selectedJob.tieuDe}</h2>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                <strong>Công ty:</strong> {selectedJob.tenCongTy}
              </p>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                <strong>Địa điểm:</strong> {selectedJob.diaDiem}
              </p>
              <p style={{ fontSize: '16px', color: '#1e73d9', marginBottom: '10px' }}>
                <strong>Mức lương:</strong> {formatSalary(selectedJob.luongToiThieu, selectedJob.luongToiDa)}
              </p>
              <p style={{ fontSize: '14px', color: '#999' }}>
                <strong>Ngày đăng:</strong> {formatDate(selectedJob.ngayDang)}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ borderLeft: '4px solid #1e73d9', paddingLeft: '12px', marginBottom: '15px' }}>
                Mô tả công việc
              </h4>
              <p style={{ lineHeight: '1.8', color: '#555', whiteSpace: 'pre-line' }}>
                {selectedJob.moTa || 'Chưa có mô tả'}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ borderLeft: '4px solid #1e73d9', paddingLeft: '12px', marginBottom: '15px' }}>
                Yêu cầu ứng viên
              </h4>
              <p style={{ lineHeight: '1.8', color: '#555', whiteSpace: 'pre-line' }}>
                {selectedJob.yeuCau || 'Chưa có yêu cầu'}
              </p>
            </div>

            <div>
              <h4 style={{ borderLeft: '4px solid #1e73d9', paddingLeft: '12px', marginBottom: '15px' }}>
                Quyền lợi
              </h4>
              <p style={{ lineHeight: '1.8', color: '#555', whiteSpace: 'pre-line' }}>
                {selectedJob.quyenLoi || 'Chưa có thông tin quyền lợi'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
