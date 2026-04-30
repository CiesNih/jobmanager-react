import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import '../styles/admin.css'; 

const AdminLayout = () => {
  return (
    <div className="admin-container">
      {/* Gắn Sidebar vào */}
      <AdminSidebar />

      <div className="admin-content-wrapper">
        {/* Gắn Header vào */}
        <AdminHeader />
        
        <main className="admin-main-content">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;