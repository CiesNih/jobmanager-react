import React, { useEffect, useState } from 'react';
import '../styles/Auth.css';

export default function AuthModal({ mode = 'login', onClose = () => {} }) {
  const [tab, setTab] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    setTab(mode);
  }, [mode]);

  const submitLogin = (e) => {
    e.preventDefault();
    console.log('login', { email, password, remember });
    if (onClose) onClose();
  };

  const submitRegister = (e) => {
    e.preventDefault();
    console.log('register (modal)');
    setTab('login');
  };

  return (
    <div className="auth-overlay" onMouseDown={onClose}>
      <div className="auth-dialog" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="auth-close" onClick={onClose} aria-label="Đóng">✕</button>

        <h3 className="auth-title">{tab === 'login' ? 'Đăng nhập hệ thống' : 'Tạo tài khoản'}</h3>

        <div className="auth-socials">
          <button className="social-btn fb">f</button>
          <button className="social-btn gg">G</button>
          <button className="social-btn zalo">Z</button>
        </div>

        <div className="auth-or">Hoặc đăng nhập bằng tài khoản</div>

        {tab === 'login' ? (
          <form onSubmit={submitLogin} className="auth-form">
            <label>Tài khoản</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <div className="auth-row">
              <label className="auth-remember">
                <input type="checkbox" checked={remember} onChange={() => setRemember(r => !r)} /> Tự động đăng nhập
              </label>
              <a className="auth-forgot" href="#!" onClick={(e)=>e.preventDefault()}>Quên mật khẩu?</a>
            </div>

            <button className="auth-primary" type="submit">ĐĂNG NHẬP</button>

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