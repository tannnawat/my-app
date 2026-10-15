
import React from 'react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentRole = 'employee'
}) {
  // เมนูของพนักงาน
  const employeeMenuItems = [
    { id: 'dashboard', label: 'หน้าหลัก' },
    { id: 'request', label: 'ยื่นคำขอลา' },
    { id: 'history', label: 'ประวัติ / สถานะคำขอ' },
    { id: 'calendar', label: 'ปฏิทินวันลา / สิทธิ์คงเหลือ' }
  ];

  // เมนูของหัวหน้างาน

  const supervisorMenuItems = [
    { id: 'dashboard', label: 'หน้าหลัก' },
    { id: 'approval', label: 'อนุมัติคำขอ' },
    { id: 'history', label: 'ประวัติคำขอลา' },
    { id: 'notifications', label: 'การแจ้งเตือน' },
  ];

  // เมนูของ HR


  const hrMenuItems = [
    { id: 'dashboard', label: 'หน้าหลัก' },
    { id: 'hr-requests', label: 'จัดการคำขอลา' },
    { id: 'hr-leave-types', label: 'ประเภทการลา' },
    { id: 'hr-leave-entitlements', label: 'สิทธิ์การลา' },
    { id: 'reports', label: 'รายงานและสรุปข้อมูลการลา' },
    { id: 'calendar', label: 'ปฏิทินวันลา / สิทธิ์คงเหลือ' },
  ];

  // เลือกเมนูตาม Role
  const menuItems =
    currentRole === 'supervisor'
      ? supervisorMenuItems
      : currentRole === 'hr'
        ? hrMenuItems
        : employeeMenuItems;


  return (
    <nav className="main-nav" aria-label="Main Navigation">
      <div className="nav-container">
        <div
          className="nav-brand"
          id="brand-logo"
          onClick={() => {
            if (currentRole === 'supervisor') {
              setActiveTab('dashboard');
            } else if (currentRole === 'hr') {
              setActiveTab('reports');
            } else {
              setActiveTab('calendar');
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <span className="brand-title">Leave System</span>
          <span className="brand-subtitle">ระบบการลา</span>
        </div>

        <ul className="nav-menu-list">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  id={`nav-item-${item.id}`}
                  className={`nav-item-btn ${isActive ? 'active' : ''
                    }`}
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
