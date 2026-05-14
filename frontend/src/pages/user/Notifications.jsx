import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Notifications.css';

export default function Notifications() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    // Check authentication
    const savedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (!savedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(savedUser));
    loadNotifications();
  }, [navigate]);

  const loadNotifications = () => {
    // Load notifications from localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(storedNotifications);
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (notificationId) => {
    if (window.confirm('Bạn có chắc muốn xóa thông báo này?')) {
      const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
      setNotifications(updatedNotifications);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    }
  };

  const clearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả thông báo?')) {
      setNotifications([]);
      localStorage.setItem('notifications', JSON.stringify([]));
    }
  };

  const getFilteredNotifications = () => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.read);
    } else if (filter === 'read') {
      return notifications.filter(n => n.read);
    }
    return notifications;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'interview':
        return '📅';
      case 'message':
        return '💬';
      default:
        return '🔔';
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'accepted':
        return 'notif-success';
      case 'rejected':
        return 'notif-danger';
      case 'interview':
        return 'notif-info';
      case 'message':
        return 'notif-primary';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) {
    return null;
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <div className="header-left">
            <h1>🔔 Thông báo</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} chưa đọc</span>
            )}
          </div>
          <div className="header-actions">
            {unreadCount > 0 && (
              <button className="btn-mark-all" onClick={markAllAsRead}>
                Đánh dấu tất cả đã đọc
              </button>
            )}
            {notifications.length > 0 && (
              <button className="btn-clear-all" onClick={clearAll}>
                Xóa tất cả
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="notifications-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Chưa đọc ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Đã đọc ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-notifications">
              <div className="empty-icon">📭</div>
              <h3>Không có thông báo</h3>
              <p>
                {filter === 'unread' 
                  ? 'Bạn đã đọc hết tất cả thông báo!'
                  : filter === 'read'
                  ? 'Chưa có thông báo nào được đọc.'
                  : 'Bạn chưa có thông báo nào. Thông báo về đơn ứng tuyển sẽ xuất hiện ở đây.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-item ${!notif.read ? 'unread' : ''} ${getNotificationClass(notif.type)}`}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                <div className="notif-icon">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="notif-content">
                  <div className="notif-header">
                    <h4>{notif.title}</h4>
                    {!notif.read && <span className="unread-dot"></span>}
                  </div>
                  <p className="notif-message">{notif.message}</p>
                  <div className="notif-meta">
                    <span className="notif-time">{formatDate(notif.createdAt)}</span>
                    {notif.jobTitle && (
                      <span className="notif-job">• {notif.jobTitle}</span>
                    )}
                    {notif.companyName && (
                      <span className="notif-company">• {notif.companyName}</span>
                    )}
                  </div>
                </div>
                <div className="notif-actions">
                  <button
                    className="btn-delete-notif"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    title="Xóa thông báo"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        {notifications.length === 0 && (
          <div className="notifications-info">
            <h3>💡 Về thông báo</h3>
            <p>Bạn sẽ nhận được thông báo khi:</p>
            <ul>
              <li>✅ Đơn ứng tuyển được chấp nhận</li>
              <li>❌ Đơn ứng tuyển bị từ chối</li>
              <li>📅 Được mời phỏng vấn</li>
              <li>💬 Nhà tuyển dụng gửi tin nhắn</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
