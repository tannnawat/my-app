
import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, X } from 'lucide-react';

const API_URL = 'https://my-app-7yiq.onrender.com/api';

export default function ChangePasswordModal({ empCode, onClose }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (newPassword !== confirmPassword) {
            setIsError(true);
            setMessage('รหัสผ่านใหม่และการยืนยันไม่ตรงกัน');
            return;
        }

        if (newPassword.length < 8 || newPassword.length > 72) {
            setIsError(true);
            setMessage('รหัสผ่านใหม่ต้องมี 8-72 ตัวอักษร');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    empCode,
                    currentPassword,
                    newPassword,
                }),
            });

            const result = await response.json();

            setIsError(!response.ok || !result.success);
            setMessage(result.message || 'เกิดข้อผิดพลาด');

            if (response.ok && result.success) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            setIsError(true);
            setMessage('เชื่อมต่อ Backend ไม่ได้ กรุณาตรวจสอบเซิร์ฟเวอร์');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px',
        marginTop: '6px',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        fontSize: '15px',
    };

    return (
        <div
            className="login-modal-backdrop"
            onClick={onClose}
            style={{ zIndex: 1000 }}
        >
            <div
                className="login-modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="change-password-title"
                onClick={(e) => e.stopPropagation()}
                style={{ width: 'min(440px, 92vw)' }}
            >
                <div className="login-modal-header">
                    <KeyRound size={24} color="#2563eb" />
                    <h3 id="change-password-title">เปลี่ยนรหัสผ่าน</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="ปิดหน้าต่าง"
                        style={{ marginLeft: 'auto', border: 0, background: 'none', cursor: 'pointer' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                    <p style={{ color: '#64748b', marginTop: 0 }}>
                        บัญชี: {empCode}
                    </p>

                    <label>
                        รหัสผ่านปัจจุบัน
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </label>

                    <label style={{ display: 'block', marginTop: '16px' }}>
                        รหัสผ่านใหม่
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={8}
                            maxLength={72}
                            style={inputStyle}
                            required
                        />
                    </label>

                    <label style={{ display: 'block', marginTop: '16px' }}>
                        ยืนยันรหัสผ่านใหม่
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength={8}
                            maxLength={72}
                            style={inputStyle}
                            required
                        />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                        <input
                            type="checkbox"
                            checked={showPasswords}
                            onChange={(e) => setShowPasswords(e.target.checked)}
                        />
                        แสดงรหัสผ่าน
                    </label>

                    {message && (
                        <p
                            role="status"
                            style={{
                                color: isError ? '#dc2626' : '#15803d',
                                marginTop: '14px',
                            }}
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            marginTop: '20px',
                            padding: '12px',
                            border: 0,
                            borderRadius: '8px',
                            background: '#2563eb',
                            color: 'white',
                            cursor: loading ? 'wait' : 'pointer',
                            fontSize: '15px',
                        }}
                    >
                        {loading ? 'กำลังเปลี่ยนรหัสผ่าน...' : 'บันทึกรหัสผ่านใหม่'}
                    </button>
                </form>
            </div>
        </div>
    );
}
