import React from 'react';

const AdminHeader = () => {
  return (
    <header className="admin-header">
      {/* Nút menu này sau này bạn có thể gắn sự kiện onClick để ẩn/hiện Sidebar */}
      <div className="menu-toggle" style={{ cursor: 'pointer' }}>☰</div>
      
      <div className="admin-user-info">
        <span>Xin chào, <strong>Admin</strong></span>
        {/* Sau này có thể thêm nút Đăng xuất ở đây */}
      </div>
    </header>
  );
};

export default AdminHeader;