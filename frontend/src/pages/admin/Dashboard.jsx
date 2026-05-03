import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaUsers, FaBuilding, FaClipboardCheck, FaArrowCircleRight } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../styles/admin.css';

const StatCard = ({ number, title, bgColor, icon, linkTo }) => {
  return (
    <div className={`stat-card ${bgColor}`}>
      <div className="inner">
        <h3>{number}</h3>
        <p>{title}</p>
      </div>
      <div className="icon">{icon}</div>
      <Link to={linkTo} className="stat-card-footer">
        Chi tiết <FaArrowCircleRight style={{ marginLeft: '5px', fontSize: '0.9em' }} />
      </Link>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    users: 0,
    employers: 0,
    jobs: 0,
    pendingJobs: 0
  });

  // sample chart data
  const chartData = [
    { month: 'T1', jobs: 12 }, { month: 'T2', jobs: 25 },
    { month: 'T3', jobs: 40 }, { month: 'T4', jobs: 30 },
    { month: 'T5', jobs: 55 }, { month: 'T6', jobs: 80 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE || 'https://localhost:7272';

        const [nguoiDungRes, congTyRes] = await Promise.all([
          fetch(`${baseUrl}/api/NguoiDung`).then(r => r.ok ? r.json() : []).catch(() => []),
          fetch(`${baseUrl}/api/CongTy`).then(r => r.ok ? r.json() : []).catch(() => []),
        ]);

        const usersList = Array.isArray(nguoiDungRes) ? nguoiDungRes : [];
        const companiesList = Array.isArray(congTyRes) ? congTyRes : [];

        setStats({
          users: usersList.length,
          employers: companiesList.length,
          jobs: 363,
          pendingJobs: 5
        });

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-container"><h2>Đang tải dữ liệu hệ thống...</h2></div>;
  }

  return (
    <div>
      <h2 style={{ fontWeight: 400, color: '#333', marginTop: 0 }}>
        Tổng quan <small style={{ fontSize: '14px', color: '#777' }}>Hệ thống quản lý</small>
      </h2>

      <div className="dashboard-grid">
        <StatCard number={stats.jobs} title="Tổng Việc Làm" bgColor="bg-orange" icon={<FaBriefcase />} linkTo="/admin/jobs" />
        <StatCard number={stats.users} title="Tổng Người Dùng" bgColor="bg-green" icon={<FaUsers />} linkTo="/admin/users" />
        <StatCard number={stats.employers} title="Nhà Tuyển Dụng" bgColor="bg-blue" icon={<FaBuilding />} linkTo="/admin/employers" />
        <StatCard number={stats.pendingJobs} title="Tin Chờ Duyệt" bgColor="bg-red" icon={<FaClipboardCheck />} linkTo="/admin/jobs?status=pending" />
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-panel primary-border">
          <h3>Xu hướng tin tuyển dụng đăng mới</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3c8dbc" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3c8dbc" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="jobs" stroke="#3c8dbc" fillOpacity={1} fill="url(#colorJobs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-panel success-border">
          <h3>Nhanh</h3>
          <div className="quick-actions">
            <Link to="/admin/users" className="quick-btn">Quản lý Người dùng</Link>
            <Link to="/admin/employers" className="quick-btn">Quản lý Nhà tuyển dụng</Link>
            <Link to="/admin/jobs" className="quick-btn">Duyệt tin tuyển dụng</Link>
          </div>

          <div className="stats-list" style={{ marginTop: 12 }}>
            <div className="stat-item"><strong>{stats.users}</strong> Người dùng</div>
            <div className="stat-item"><strong>{stats.employers}</strong> Nhà tuyển dụng</div>
            <div className="stat-item"><strong>{stats.jobs}</strong> Tổng tin tuyển dụng</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;