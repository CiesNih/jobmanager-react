import '../styles/Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3> Tìm kiếm nhanh</h3>
        <ul>
          <li> Công việc hot</li>
          <li> Bàn luận</li>
          <li> Việc Làm</li>
          <li> Hồ Sơ</li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3> Dịch vụ</h3>
        <ul>
          <li> Tư vấn</li>
          <li> Bảo Mật</li>
          <li> Thông Báo</li>
        </ul>
      </div>
    </aside>
  );
}