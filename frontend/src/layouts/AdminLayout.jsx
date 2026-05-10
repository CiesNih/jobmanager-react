import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import '../styles/admin.css'; 

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra đăng nhập
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    
    if (!savedUser) {
      // Chưa đăng nhập -> Chuyển về trang chủ
      alert('Vui lòng đăng nhập với tài khoản Admin!');
      navigate('/');
      return;
    }

    const user = JSON.parse(savedUser);
    
    // Kiểm tra role
    if (user.role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
      return;
    }
  }, [navigate]);

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