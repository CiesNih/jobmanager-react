import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem('authUser') || 
    sessionStorage.getItem('authUser') || 
    '{}'
  );

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authUser');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <header className="admin-header">
      {/* Nút menu này sau này bạn có thể gắn sự kiện onClick để ẩn/hiện Sidebar */}
      <div className="menu-toggle" style={{ cursor: 'pointer' }}>☰</div>
      
      <div className="admin-user-info">
        <div>
          <span>Xin chào, <strong>{user.name || 'Admin'}</strong></span>
          {user.email && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
              {user.email}
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="btn-secondary" style={{ marginLeft: '15px' }}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;