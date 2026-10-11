import React from 'react';

export default function Navbar({ activeTab, setActiveTab, currentRole = 'employee' }) {
  // Navigation menu items for Employee role (as shown in both Image 1 and Image 2)
  const employeeMenuItems = [
    { id: 'dashboard', label: 'หน้าหลัก' },
    { id: 'request', label: 'ยื่นคำขอลา' },
    { id: 'history', label: 'รายการประวัติ /\nสถานะคำขอ' },
    { id: 'calendar', label: 'ปฏิทินวันลา /\nสิทธิ์คงเหลือ' },
    { id: 'reports', label: 'รายงานสรุป' },
  ];

  // If role is supervisor/hr, include "อนุมัติคำขอ"
  const supervisorMenuItems = [
    { id: 'dashboard', label: 'หน้าหลัก' },
    { id: 'request', label: 'ยื่นคำขอลา' },
    { id: 'history', label: 'รายการประวัติ /\nสถานะคำขอ' },
    { id: 'approval', label: 'อนุมัติคำขอ' },
    { id: 'calendar', label: 'ปฏิทินวันลา /\nสิทธิ์คงเหลือ' },
    { id: 'reports', label: 'รายงานสรุป' },
  ];

  const menuItems = currentRole === 'employee' ? employeeMenuItems : supervisorMenuItems;

  return (
    <nav className="main-nav" aria-label="Main Navigation">
      <div className="nav-container">
        {/* Brand Logo / Title */}
        <div className="nav-brand" id="brand-logo" onClick={() => setActiveTab('calendar')} style={{ cursor: 'pointer' }}>
          <span className="brand-title">Leave System</span>
          <span className="brand-subtitle">ระบบการลา</span>
        </div>

        {/* Menu Items */}
        <ul className="nav-menu-list">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  id={`nav-item-${item.id}`}
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
