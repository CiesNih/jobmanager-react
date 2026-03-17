// src/pages/CandidateListPage.jsx
import { useEffect, useState } from 'react';
import { getAllCandidates, deleteCandidate } from '../services/candidateService';
import '../styles/CandidateListPage.css';

export default function CandidateListPage() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [searchTerm, candidates]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await getAllCandidates();
      setCandidates(res.data);
    } catch (err) {
      setError('Không thể tải dữ liệu: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    if (!searchTerm.trim()) {
      setFilteredCandidates(candidates);
      return;
    }

    const filtered = candidates.filter(candidate =>
      (candidate.tieuDeHoSo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (candidate.diaChi?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCandidates(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá ứng viên này?')) {
      try {
        await deleteCandidate(id);
        setCandidates(candidates.filter(c => c.maUngVien !== id));
        alert('✅ Xoá thành công!');
      } catch (err) {
        alert('❌ Lỗi: ' + err.message);
      }
    }
  };

  return (
    <div className="candidate-list-page">
      <div className="page-header">
        <h1>👥 Danh Sách Ứng Viên</h1>
        <p>Quản lý và theo dõi tất cả ứng viên trong hệ thống</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Tìm theo tên, địa chỉ hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="result-count">
          {filteredCandidates.length}/{candidates.length} kết quả
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>⚠️ {error}</p>
          <button onClick={fetchCandidates} className="btn-retry">
            Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCandidates.length === 0 && (
        <div className="empty-state">
          <p>😕 Không tìm thấy ứng viên nào</p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="btn-reset">
              Xóa tìm kiếm
            </button>
          )}
        </div>
      )}

      {/* Candidates Grid */}
      {!loading && !error && filteredCandidates.length > 0 && (
        <div className="candidates-grid">
          {filteredCandidates.map(candidate => (
            <div key={candidate.maUngVien} className="candidate-card">
              {/* Card Header */}
              <div className="card-header">
                <div className="avatar">
                  {candidate.tieuDeHoSo?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="card-header-info">
                  <h3>{candidate.tieuDeHoSo || 'Chưa cập nhật'}</h3>
                  <p className="location">📍 {candidate.diaChi || 'Chưa cập nhật'}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">Kinh nghiệm:</span>
                  <span className="info-value">{candidate.soNamKinhNghiem || 0} năm</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{candidate.email || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Điện thoại:</span>
                  <span className="info-value">{candidate.soDienThoai || 'N/A'}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="card-footer">
                <button 
                  className="btn-view"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  👁️ Xem Chi Tiết
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(candidate.maUngVien)}
                >
                  🗑️ Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedCandidate && (
        <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCandidate(null)}>
              ✕
            </button>

            <div className="modal-body">
              <h2>{selectedCandidate.tieuDeHoSo}</h2>

              <div className="modal-section">
                <h4>📍 Thông Tin Địa Chỉ</h4>
                <p>{selectedCandidate.diaChi || 'Chưa cập nhật'}</p>
              </div>

              <div className="modal-section">
                <h4>💼 Kinh Nghiệm</h4>
                <p>{selectedCandidate.soNamKinhNghiem || 0} năm kinh nghiệm</p>
              </div>

              <div className="modal-section">
                <h4>📧 Thông Tin Liên Hệ</h4>
                <p><strong>Email:</strong> {selectedCandidate.email || 'N/A'}</p>
                <p><strong>Điện thoại:</strong> {selectedCandidate.soDienThoai || 'N/A'}</p>
              </div>

              <div className="modal-section">
                <h4>📋 ID Ứng Viên</h4>
                <p className="code-block">{selectedCandidate.maUngVien}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}