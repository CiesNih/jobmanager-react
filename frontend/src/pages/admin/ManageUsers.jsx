import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import '../../styles/admin.css';

const API_URL = import.meta.env.VITE_API_ADMIN ? `${import.meta.env.VITE_API_ADMIN}/api/NguoiDung` : 'https://localhost:7272/api/NguoiDung';

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

const ROLE_MAP = {
  1: 'Admin',
  2: 'Nhà tuyển dụng',
  3: 'Ứng viên'
};

const getProp = (obj, keys) => {
  if (!obj) return undefined;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
};

function normalizeUser(u) {
  if (!u) return null;
  const id = getProp(u, ['MaNguoiDung','maNguoiDung','id','Id','MaNguoi','maNguoi']);
  const ten = getProp(u, ['HoTen','hoTen','Ten','ten','FullName','fullName','Name','name']);
  const email = getProp(u, ['Email','email','UserName','userName','username']);
  const matKhauHash = getProp(u, ['MatKhauHash','matKhauHash','MatKhau','matKhau','passwordHash','PasswordHash']);
  const soDienThoai = getProp(u, ['SoDienThoai','soDienThoai','phone','Phone','Sdt','sdt']);
  const maQuyen = getProp(u, ['MaQuyen','maQuyen','Role','role']) ?? 0;
  const trangThai = getProp(u, ['TrangThai','trangThai','Status','status']) ?? 0;

  return {
    id: String(id ?? ''),
    ten: String(ten ?? ''),
    email: String(email ?? ''),
    matKhauHash: String(matKhauHash ?? ''),
    soDienThoai: String(soDienThoai ?? ''),
    maQuyen: Number(maQuyen),
    trangThai: Number(trangThai),
    raw: u
  };
}

const generateRandomPassword = (len = 10) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

const handleResetPassword = async (id) => {
  // hỏi admin mật khẩu mới, nếu để trống thì tự sinh
  let newPassword = window.prompt('Nhập mật khẩu mới cho user (để trống để tự tạo):');
  if (newPassword === null) return; // cancel
  if (!newPassword) {
    newPassword = generateRandomPassword(12);
    if (!window.confirm(`Sẽ tạo mật khẩu tự động:\n${newPassword}\nTiếp tục?`)) return;
  }

  try {
    const res = await fetch(`${API_URL}/${encodeURIComponent(id)}/reset-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword })
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => res.statusText);
      throw new Error(txt || 'Server error');
    }
    alert('Reset mật khẩu thành công.\nMật khẩu mới: ' + newPassword);
  } catch (err) {
    console.error('Reset password error', err);
    alert('Reset mật khẩu thất bại: ' + (err.message || ''));
  }
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // search input
  const [searchId, setSearchId] = useState('');

  // modal & form
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ten: '', email: '', matKhau: '', soDienThoai: '', maQuyen: '3', trangThai: true });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching users from:', API_URL);
      console.log('🔑 Token:', getAuthToken() ? 'Có token' : 'Không có token');
      
      const res = await fetch(API_URL, {
        headers: getHeaders()
      });
      
      console.log('📡 Response status:', res.status);
      
      // Nếu 401, nghĩa là chưa đăng nhập hoặc token hết hạn
      if (res.status === 401) {
        console.error('❌ 401 Unauthorized - Token không hợp lệ');
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/';
        return;
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ API Error:', errorText);
        throw new Error('Lỗi khi tải dữ liệu');
      }
      
      const data = await res.json();
      console.log('✅ Data received:', data);
      
      const list = Array.isArray(data) ? data.map(normalizeUser) : [];
      console.log('✅ Normalized users:', list.length, 'users');
      
      setUsers(list);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      alert('Không thể tải danh sách người dùng! Chi tiết: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({ ten: '', email: '', matKhau: '', soDienThoai: '', maQuyen: '3', trangThai: true });
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setIsEditing(true);
    setEditingId(user.id);
    setForm({
      ten: user.ten || '',
      email: user.email || '',
      matKhau: '',
      soDienThoai: user.soDienThoai || '',
      maQuyen: String(user.maQuyen || 3),
      trangThai: (user.trangThai === 1 || user.trangThai === true)
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const createUser = async (payload) => {
    try {
      const res = await sendWithOptionalWrapper(API_URL, 'POST', payload);
      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText);
        throw new Error(txt || 'Lỗi tạo user');
      }
      alert('Thêm người dùng thành công');
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Thêm thất bại: ' + (err.message || ''));
    }
  };

  const updateUser = async (id, payload) => {
    try {
      const url = `${API_URL}/${encodeURIComponent(id)}`;
      const res = await sendWithOptionalWrapper(url, 'PUT', payload);
      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText);
        throw new Error(txt || 'Lỗi cập nhật');
      }
      alert('Cập nhật thành công');
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Cập nhật thất bại: ' + (err.message || ''));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Xóa thất bại');
      alert('Xóa thành công');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa người dùng!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payloadBase = {
      HoTen: form.ten,
      Email: form.email,
      SoDienThoai: form.soDienThoai,
      MaQuyen: Number(form.maQuyen),
      TrangThai: !!form.trangThai   // <- boolean true/false
    };

    if (isEditing) {
      const payload = { ...payloadBase };
      if (form.matKhau) payload.MatKhau = form.matKhau;
      updateUser(editingId, payload);
    } else {
      const payload = { ...payloadBase, MatKhau: form.matKhau || '123456' };
      createUser(payload);
    }
  };

  //  { dto: payload }
  const sendWithOptionalWrapper = async (url, method, body) => {
    const opts = { method, headers: getHeaders() };
    let res = await fetch(url, { ...opts, body: JSON.stringify(body) });
    if (res.ok) return res;

    // đọc text để check lỗi trả về
    const txt = await res.text().catch(() => '');
    if (/dto/i.test(txt) || res.status === 400) {
      // thử gửi với wrapper { dto: body } (một số API .NET yêu cầu wrapper)
      res = await fetch(url, { ...opts, body: JSON.stringify({ dto: body }) });
    }
    return res;
  };

  // improved search: try local match first (id or email), else call GET /api/NguoiDung/{id}
  const handleSearchById = async () => {
    if (!searchId) { alert('Nhập Mã người dùng hoặc email'); return; }
    // local search (loose match)
    const q = searchId.trim().toLowerCase();
    const found = users.find(u => (u.id && u.id.toLowerCase().includes(q)) || (u.email && u.email.toLowerCase().includes(q)));
    if (found) {
      openEdit(found);
      return;
    }

    // fallback: call server by id
    try {
      setLoading(true);
      const res = await sendWithOptionalWrapper(`${API_URL}/${encodeURIComponent(searchId)}`);
      if (!res.ok) {
        alert('Không tìm thấy người dùng với mã này');
        return;
      }
      const data = await res.json();
      const user = normalizeUser(data);
      if (user) openEdit(user);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* header: title + search (Add moved below) */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 'normal', color: '#333', margin: 0 }}>Quản lý Người Dùng</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="search-input" placeholder="Nhập Mã người dùng hoặc email" value={searchId} onChange={e => setSearchId(e.target.value)} />
          <button className="block-btn" onClick={handleSearchById}>Tìm</button>
        </div>
      </div>

      <div className="dashboard-panel" style={{ marginTop: 12 }}>
        {/* Add button on left above table */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
          <button className="block-btn block-add" onClick={openAdd}><FaPlus style={{ marginRight: 8 }} /> Thêm người dùng</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>MaNguoiDung</th>
                <th>Họ và Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((user) => (
                <tr key={user.id}>
                  <td style={{ maxWidth: 200, wordBreak: 'break-all' }}>{user.id}</td>
                  <td><strong>{user.ten || 'Chưa cập nhật'}</strong></td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.soDienThoai || '-'}</td>
                  <td>{ROLE_MAP[user.maQuyen] ?? user.maQuyen ?? 'N/A'}</td>
                  <td>
                    {user.trangThai === 1 ? <span className="status-badge active">Hoạt động</span> : <span className="status-badge">Không hoạt động</span>}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="block-btn block-edit" onClick={() => openEdit(user)}>Sửa</button>
                      <button className="block-btn block-delete" onClick={() => handleDelete(user.id)}>Xóa</button>
                      <button className="block-btn block-reset" onClick={() => handleResetPassword(user.id)}>Reset</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#888' }}>Chưa có người dùng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onMouseDown={closeModal}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>{isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</h3>
            <form onSubmit={e => { e.preventDefault(); handleSubmit(e); }}>
              <div className="form-row">
                <label>Họ và Tên</label>
                <input className="input" value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} />
              </div>

              <div className="form-row">
                <label>Email</label>
                <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>

              {!isEditing && (
                <div className="form-row">
                  <label>Mật khẩu</label>
                  <input type="password" className="input" value={form.matKhau} onChange={(e) => setForm({ ...form, matKhau: e.target.value })} />
                </div>
              )}

              <div className="form-row">
                <label>Số điện thoại</label>
                <input className="input" value={form.soDienThoai} onChange={(e) => setForm({ ...form, soDienThoai: e.target.value })} />
              </div>

              <div className="form-row">
                <label>Vai trò</label>
                <select className="input" value={form.maQuyen} onChange={(e) => setForm({ ...form, maQuyen: e.target.value })}>
                  <option value="1">Admin</option>
                  <option value="2">Nhà tuyển dụng</option>
                  <option value="3">Ứng viên</option>
                </select>
              </div>

              <div className="form-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label>Trạng thái</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={form.trangThai} onChange={(e) => setForm({ ...form, trangThai: e.target.checked })} />
                  Hoạt động
                </label>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="block-btn" onClick={closeModal} style={{ background: '#f3f4f6' }}>Hủy</button>
                <button type="submit" className="block-btn block-add">{isEditing ? 'Lưu' : 'Tạo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;