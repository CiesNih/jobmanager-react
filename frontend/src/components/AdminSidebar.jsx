import { NavLink, Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <span>⚙️ Admin Panel</span>
      </div>
      <ul className="admin-menu">
        
        {/* Phần 1: Thống kê & Người dùng */}
        <li>
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : ""}>
            📊 Tổng quan
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>
            👥 Quản lý Người dùng
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/employers" className={({ isActive }) => isActive ? "active" : ""}>
            🏢 Quản lý Nhà tuyển dụng
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/jobs" className={({ isActive }) => isActive ? "active" : ""}>
            💼 Quản lý Tin tuyển dụng
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "active" : ""}>
            📁 Danh mục việc làm
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/reports" className={({ isActive }) => isActive ? "active" : ""}>
            📋 Báo cáo & Vi phạm
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "active" : ""}>
            ⚙️ Cài đặt hệ thống
          </NavLink>
        </li>

      </ul>

      <div style={{ padding: '20px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', textDecoration: 'none' }}>
          ← Về trang chủ
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;