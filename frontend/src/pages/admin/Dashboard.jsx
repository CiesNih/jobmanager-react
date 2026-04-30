import React from 'react';

import { FaBriefcase, FaUsers, FaBuilding, FaExclamationTriangle } from 'react-icons/fa';

const StatCard = ({ number, title, bgColor, icon }) => {
  return (
    <div className={`stat-card ${bgColor}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="card-content" style={{ zIndex: 2, position: 'relative' }}>
        <h3>{number}</h3>
        <p>{title}</p>
      </div>
      
      {}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '15px',
        fontSize: '4rem',
        color: 'rgba(0,0,0,0.15)', 
        zIndex: 1
      }}>
        {icon}
      </div>

      <a href="#" className="stat-card-footer" style={{ zIndex: 2, position: 'relative' }}>
        Chi tiết ➔
      </a>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontWeight: 'normal', color: '#333' }}>
        Tổng quan hệ thống
      </h2>
      
      <div className="dashboard-grid">
        <StatCard number="363" title="Tổng Việc Làm" bgColor="bg-orange" icon={<FaBriefcase />} />
        <StatCard number="125" title="Tổng Ứng Viên" bgColor="bg-green" icon={<FaUsers />} />
        <StatCard number="42" title="Nhà Tuyển Dụng" bgColor="bg-blue" icon={<FaBuilding />} />
        <StatCard number="5" title="Tin Chờ Duyệt" bgColor="bg-red" icon={<FaExclamationTriangle />} />
      </div>
    </div>
  );
};

export default Dashboard;