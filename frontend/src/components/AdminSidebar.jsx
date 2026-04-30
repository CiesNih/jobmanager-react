import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <span>Admin Panel</span>
      </div>
      <ul className="admin-menu">
        {/* Dùng NavLink để hỗ trợ active menu */}
        <li>
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : ""}>
            Tổng quan
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/candidates" className={({ isActive }) => isActive ? "active" : ""}>
            Quản lý Ứng viên
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/employers" className={({ isActive }) => isActive ? "active" : ""}>
            Quản lý Nhà tuyển dụng
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/jobs" className={({ isActive }) => isActive ? "active" : ""}>
            Duyệt tin tuyển dụng
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;