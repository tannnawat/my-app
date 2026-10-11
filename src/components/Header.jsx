import React, { useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import { User, Bell, LogOut, CheckCircle, Clock, X, KeyRound } from 'lucide-react';
export default function Header({ currentUser, currentRole, onChangeRole, onLogout, notifications = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const displayName = currentUser?.name || 'นายยุทธศักดิ์ มีดาบ';
  const displayRoleTitle = currentUser?.roleTitleTh || (currentRole === 'employee' ? 'พนักงาน' : currentRole === 'supervisor' ? 'หัวหน้างาน' : 'เจ้าหน้าที่ HR');

  return (
    <header className="top-header">
      {/* User profile info */}
      <div className="user-profile-widget" id="user-profile-widget">
        <div className="avatar-box" title="โปรไฟล์ผู้ใช้งาน">
          <User size={28} strokeWidth={2.2} />
        </div>
        <div className="user-details">
          <span className="user-name">{displayName}</span>
          <div className="user-role-badge">
            <span>{displayRoleTitle}</span>
            {currentUser?.empId && (
              <span className="user-empid-pill">({currentUser.empId})</span>
            )}
            {/* Quick role toggle for preview */}
            <button
              type="button"
              className="role-switcher-btn"
              title="สลับมุมมองบทบาทการทำงาน"
              onClick={() => {
                const roles = ['employee', 'supervisor', 'hr'];
                const nextRole = roles[(roles.indexOf(currentRole) + 1) % roles.length];
                onChangeRole(nextRole);
              }}
            >
              สลับบทบาท: {currentRole === 'employee' ? 'พนักงาน' : currentRole === 'supervisor' ? 'หัวหน้า' : 'HR'}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications & Logout */}
      <div className="header-actions">
        <button
          className="icon-btn"
          id="btn-notifications"
          title="การแจ้งเตือน"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={24} />
          {notifications.length > 0 && <span className="badge-dot" />}
        </button>
        <button
          type="button"
          className="icon-btn"
          title="เปลี่ยนรหัสผ่าน"
          aria-label="เปลี่ยนรหัสผ่าน"
          onClick={() => setShowChangePassword(true)}
        >
          <KeyRound size={24} />
        </button>

        {/* Notification Dropdown Popover */}
        {showNotifications && (
          <div className="notifications-popover" id="notifications-popover">
            <div className="notif-header">
              <span>การแจ้งเตือน ({notifications.length})</span>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setShowNotifications(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {notifications.map((n) => (
                <div key={n.id} className="notif-item">
                  <div className="notif-item-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {n.type === 'approved' ? (
                      <CheckCircle size={15} color="#16a34a" />
                    ) : (
                      <Clock size={15} color="#d97706" />
                    )}
                    {n.title}
                  </div>
                  <div style={{ color: '#475569', fontSize: '12.5px', marginTop: '2px' }}>
                    {n.message}
                  </div>
                  <div className="notif-item-time">{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="icon-btn"
          id="btn-logout"
          title="ออกจากระบบ"
          onClick={() => {
            if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
              if (onLogout) {
                onLogout();
              } else {
                window.location.reload();
              }
            }
          }}
        >
          <LogOut size={24} />
        </button>
      </div>
      {showChangePassword && (
        <ChangePasswordModal
          empCode={currentUser?.empId}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </header>
  );
}
