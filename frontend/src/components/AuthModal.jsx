import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function AuthModal({ mode = 'login', onClose = () => {} }) {
  const [tab, setTab] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();


  useEffect(() => setTab(mode), [mode]);


  const staticUsers = [
    { 
      email: 'candidate11@example.com', 
      password: '123456', 
      role: 'user', 
      name: 'Bùi Tạp Vụ' 
    },
    { 
      email: 'admin@example.com', 
      password: 'admin123', 
      role: 'admin', 
      name: 'Quản trị viên' 
    },
    { 
      email: 'employer@example.com', 
      password: 'employer123', 
      role: 'employer', 
      name: 'Công ty ABC',
      companyName: 'Công ty Cổ phần ABC Technology'
    }
  ];

  // 2. XỬ LÝ SUBMIT ĐĂNG NHẬP
  const submitLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Giả lập thời gian chờ của mạng (delay 800ms) cho chân thực
      await new Promise(resolve => setTimeout(resolve, 800));

      // Kiểm tra tài khoản
      const foundUser = staticUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        setError('Đăng nhập thất bại. Sai email hoặc mật khẩu!');
        setLoading(false);
        return;
      }

      // Đăng nhập thành công: Lưu thông tin vào localStorage để App nhận diện
      const userSession = {
        id: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        companyName: foundUser.companyName || '',
        token: 'fake-jwt-token-123'
      };

      if (remember) {
        localStorage.setItem('authUser', JSON.stringify(userSession));
      } else {
        sessionStorage.setItem('authUser', JSON.stringify(userSession)); // Tắt trình duyệt là mất
      }
      window.dispatchEvent(new Event('authChange'));

      // Đóng modal trước
      if (onClose) onClose();

      // Chuyển hướng người dùng dựa theo role
      if (foundUser.role === 'admin') {
        navigate('/admin');
      } else if (foundUser.role === 'employer') {
        navigate('/employer');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Lỗi logic:', err);
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // 3. XỬ LÝ SUBMIT ĐĂNG KÝ (Tạm thời chuyển về tab đăng nhập)
  const submitRegister = (e) => {
    e.preventDefault();
    alert('Chức năng đăng ký đang được hoàn thiện!');
    setTab('login');
  };

  return (
    <div className="auth-overlay" onMouseDown={onClose}>
      <div className="auth-dialog" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="auth-close" onClick={onClose} aria-label="Đóng">✕</button>

        <h3 className="auth-title">{tab === 'login' ? 'Đăng nhập hệ thống' : 'Tạo tài khoản'}</h3>

        {tab === 'login' && (
          <div style={{ 
            background: '#f0f7ff', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '15px',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            <strong>💡 Tài khoản demo:</strong>
            <div style={{ marginTop: '8px' }}>
              <div>👤 <strong>Ứng viên:</strong> candidate11@example.com / 123456</div>
              <div>🏢 <strong>Nhà tuyển dụng:</strong> employer@example.com / employer123</div>
              <div>⚙️ <strong>Admin:</strong> admin@example.com / admin123</div>
            </div>
          </div>
        )}

        <div className="auth-or">Hoặc đăng nhập bằng tài khoản đã có</div>

        {tab === 'login' ? (
          <form onSubmit={submitLogin} className="auth-form">
            <label>Tài khoản (Email)</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <div className="auth-row">
              <label className="auth-remember">
                <input type="checkbox" checked={remember} onChange={() => setRemember(r => !r)} /> Tự động đăng nhập
              </label>
              <a className="auth-forgot" href="#!" onClick={(e)=>e.preventDefault()}>Quên mật khẩu?</a>
            </div>

            {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}

            <button className="auth-primary" type="submit" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
            </button>

            <div className="auth-footer">
              Bạn chưa có tài khoản? <button type="button" className="link-like" onClick={() => setTab('register')}>Đăng ký nhanh</button>
            </div>
          </form>
        ) : (
          <form onSubmit={submitRegister} className="auth-form">
            <label>Họ & Tên</label>
            <input type="text" required />

            <label>Email</label>
            <input type="email" required />

            <label>Mật khẩu</label>
            <input type="password" required />

            <button className="auth-primary" type="submit">Tạo tài khoản</button>

            <div className="auth-footer">
              Đã có tài khoản? <button type="button" className="link-like" onClick={() => setTab('login')}>Đăng nhập</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}