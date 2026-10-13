import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, Info, CheckCircle2, ShieldCheck } from 'lucide-react';

// Frontend และ API อยู่ใน Render service เดียวกัน จึงใช้ same-origin URL
const API_URL = '/api';

export default function LoginView({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');

  console.log('[Login] กดปุ่ม Login แล้ว');
  console.log('[Login] identifier:', identifier.trim());

  try {
    console.log('[Login] กำลังเรียก API:', `${API_URL}/login`);
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: identifier.trim(),
        password,
      }),
    });

    console.log('[Login] HTTP status:', response.status);
    const result = await response.json();
    console.log('[Login] API result:', result);

    if (!response.ok || !result.success) {
      setErrorMessage(result.message || 'เข้าสู่ระบบไม่สำเร็จ');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('saved_emp_id', identifier.trim());
    } else {
      localStorage.removeItem('saved_emp_id');
    }

    onLoginSuccess(result.user);
  } catch (error) {
    console.error('Login error:', error);
    setErrorMessage(
      'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบ Backend'
    );
  }
};


  // Quick fill demo credentials
  const handleQuickFill = (empId, pass) => {
    setIdentifier(empId);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="login-page-container">
      <div className="login-card-wrapper">
        {/* Main Login Card */}
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">เข้าสู่ระบบ</h1>
            <h2 className="login-subtitle">Leave System</h2>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="login-error-alert" role="alert">
              <AlertCircle size={18} className="error-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Input 1: Email or Employee ID */}
            <div className="login-field-group">
              <label htmlFor="login-identifier" className="login-label">
                Email or Employess(ID)
              </label>
              <div className="login-input-box">
                <input
                  id="login-identifier"
                  type="text"
                  className="login-input"
                  placeholder="Enter your here"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="login-field-group">
              <label htmlFor="login-password" className="login-label">
                Password
              </label>
              <div className="login-input-box">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input password-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Options Row: Remember Me & Forgot Password */}
            <div className="login-options-row">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="login-checkbox"
                />
                <span>จดจำการเข้าสู่ระบบ</span>
              </label>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setShowForgotPasswordModal(true)}
              >
                ลืมรหัสผ่าน?
              </button>
            </div>

            {/* Submit Button */}
            <div className="login-submit-container">
              <button
                id="btn-login-submit"
                type="submit"
                className="btn-login-submit"
              >
                เข้าสู่ระบบ
              </button>
            </div>

            {/* Bottom Contact Admin Link */}
            <div className="login-footer-text">
              <span>ยังไม่มีบัญชี? </span>
              <button
                type="button"
                className="contact-admin-link"
                onClick={() => setShowContactAdminModal(true)}
              >
                ติดต่อผู้ดูแลระบบ
              </button>
            </div>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="quick-accounts-section">
            <div className="quick-accounts-title">
              <ShieldCheck size={14} />
              <span>เลือกล็อกอินตามบทบาท (สำหรับทดสอบระบบ):</span>
            </div>
            <div className="quick-account-buttons">
              <button
                type="button"
                className="btn-quick-account btn-quick-emp"
                title="รหัสพนักงาน: EMP-0042 / รหัสผ่าน: ChangeMe123!"
                onClick={() => handleQuickFill('EMP-0042', 'ChangeMe123!')}
              >
                👤 พนักงาน (EMP-0042)
              </button>
              <button
                type="button"
                className="btn-quick-account btn-quick-sup"
                title="รหัสหัวหน้างาน: EMP-0010 / รหัสผ่าน: ChangeMe123!"
                onClick={() => handleQuickFill('EMP-0010', 'ChangeMe123!')}
              >
                👔 หัวหน้า (EMP-0010)
              </button>
              <button
                type="button"
                className="btn-quick-account btn-quick-hr"
                title="รหัสเจ้าหน้าที่ HR: EMP-0062 / รหัสผ่าน: ChangeMe123!"
                onClick={() => handleQuickFill('EMP-0062', 'ChangeMe123!')}
              >
                💼 HR (EMP-0062)
              </button>
            </div>
            <div className="quick-accounts-note">
              * รหัสผ่านทดสอบคือ: <code>ChangeMe123!</code> (สามารถแก้ที่ <code>src/data/authData.js</code> ได้)
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="login-modal-backdrop" onClick={() => setShowForgotPasswordModal(false)}>
          <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="login-modal-header">
              <Info size={24} color="#2563eb" />
              <h3>ลืมรหัสผ่าน</h3>
            </div>
            <div className="login-modal-body">
              <p>
                กรณีลืมรหัสผ่านเพื่อเข้าใช้งานระบบ Leave System กรุณาแจ้งฝ่ายทรัพยากรบุคคล (HR) หรือผู้ดูแลระบบสารสนเทศ (IT Department) เพื่อทำการรีเซ็ตรหัสผ่านใหม่
              </p>
              <div className="contact-info-box">
                <div><strong>ฝ่ายไอที (IT Support):</strong> ต่อ 1102 หรือ it-support@company.com</div>
                <div><strong>ฝ่ายบุคคล (HR Dept):</strong> ต่อ 1105 หรือ hr@company.com</div>
              </div>
            </div>
            <div className="login-modal-footer">
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowForgotPasswordModal(false)}
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Admin Modal */}
      {showContactAdminModal && (
        <div className="login-modal-backdrop" onClick={() => setShowContactAdminModal(false)}>
          <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="login-modal-header">
              <CheckCircle2 size={24} color="#059669" />
              <h3>ติดต่อผู้ดูแลระบบ</h3>
            </div>
            <div className="login-modal-body">
              <p>
                หากท่านเป็นพนักงานใหม่ที่ยังไม่มีชื่อบัญชี หรือต้องการเปิดสิทธิ์การใช้งานเพิ่มเติม กรุณาติดต่อ:
              </p>
              <div className="contact-info-box">
                <div><strong>อีเมลผู้ดูแล:</strong> admin.leave@company.com</div>
                <div><strong>เบอร์โทรศัพท์:</strong> 02-999-8888 ต่อ 1000</div>
                <div><strong>เวลาทำการ:</strong> จันทร์ - ศุกร์ (08:30 - 17:30 น.)</div>
              </div>
            </div>
            <div className="login-modal-footer">
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowContactAdminModal(false)}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
