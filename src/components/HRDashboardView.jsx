
import React from 'react';
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  FileText,
  BarChart3,
  Settings2,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Users,
} from 'lucide-react';

const getStatus = (status) => {
  const value = String(status || '').trim().toLowerCase();

  if (
    value.includes('ไม่อนุมัติ') ||
    value.includes('ปฏิเสธ') ||
    value === 'rejected'
  ) {
    return { label: status || 'ไม่อนุมัติ', className: 'rejected' };
  }

  if (
    value === 'อนุมัติ' ||
    value === 'approved'
  ) {
    return { label: status || 'อนุมัติ', className: 'approved' };
  }

  return {
    label: status || 'รอดำเนินการ',
    className: 'pending',
  };
};

function HRDashboardView({
  requests = [],
  currentUser,
  onNavigateTab,
}) {
  const safeRequests = Array.isArray(requests) ? requests : [];

  const pending = safeRequests.filter(
    (item) => getStatus(item.status).className === 'pending'
  );

  const approved = safeRequests.filter(
    (item) => getStatus(item.status).className === 'approved'
  );

  const rejected = safeRequests.filter(
    (item) => getStatus(item.status).className === 'rejected'
  );

  const stats = [
    {
      title: 'คำขอลาทั้งหมด',
      value: safeRequests.length,
      detail: 'คำขอในระบบ',
      icon: ClipboardList,
      color: 'blue',
    },
    {
      title: 'รอดำเนินการ',
      value: pending.length,
      detail: 'รายการที่ต้องติดตาม',
      icon: Clock3,
      color: 'orange',
    },
    {
      title: 'อนุมัติแล้ว',
      value: approved.length,
      detail: 'รายการที่ผ่านการอนุมัติ',
      icon: CheckCircle2,
      color: 'green',
    },
    {
      title: 'ไม่อนุมัติ',
      value: rejected.length,
      detail: 'รายการที่ไม่ผ่านการอนุมัติ',
      icon: XCircle,
      color: 'red',
    },
  ];

  const menus = [
    {
      title: 'จัดการคำขอลา',
      description: 'ตรวจสอบและติดตามสถานะคำขอของพนักงาน',
      icon: ClipboardList,
      color: 'blue',
      tab: 'hr-requests',
    },
    {
      title: 'รายงานและสถิติ',
      description: 'ดูภาพรวมและข้อมูลสถิติการลา',
      icon: BarChart3,
      color: 'purple',
      tab: 'reports',
    },
    {
      title: 'ประเภทการลา',
      description: 'จัดการประเภทและเงื่อนไขการลา',
      icon: Settings2,
      color: 'orange',
      tab: 'hr-leave-types',
    },
    {
      title: 'สิทธิ์วันลา',
      description: 'จัดการสิทธิ์วันลาของพนักงาน',
      icon: CalendarDays,
      color: 'green',
      tab: 'hr-leave-entitlements',
    },
  ];

  const recentRequests = [...safeRequests].reverse().slice(0, 5);

  const today = new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'long',
  }).format(new Date());

  const navigate = (tab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  return (
    <div className="hr-dashboard">
      {/* ส่วนหัวต้อนรับ */}
      <section className="hr-hero">
        <div className="hr-hero-content">
          <div className="hr-eyebrow">
            <Sparkles size={15} />
            HUMAN RESOURCES · LEAVE MANAGEMENT
          </div>

          <h1>
            สวัสดี, {currentUser?.name || 'เจ้าหน้าที่ HR'}
          </h1>

          <p>
            ยินดีต้อนรับสู่ระบบบริหารจัดการวันลา
            <br />
            ตรวจสอบคำขอและภาพรวมการลาของพนักงานได้จากที่นี่
          </p>
        </div>

        <div className="hr-hero-date">
          <CalendarDays size={23} />
          <div>
            <strong>วันที่ปัจจุบัน</strong>
            <span>{today}</span>
          </div>
        </div>
      </section>

      {/* ภาพรวมการลา */}
      <div className="hr-section-heading">
        <div>
          <h2>ภาพรวมการลา</h2>
          <p>สรุปสถานะคำขอลาทั้งหมดในระบบ</p>
        </div>
      </div>

      <div className="hr-stats">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              className="hr-stat-card"
              key={item.title}
              onClick={() => navigate('hr-requests')}
            >
              <div className="hr-stat-top">
                <div className={`hr-stat-icon ${item.color}`}>
                  <Icon size={22} />
                </div>
                <ArrowRight className="hr-stat-arrow" size={17} />
              </div>

              <div className="hr-stat-number">{item.value}</div>
              <div className="hr-stat-title">{item.title}</div>
              <div className="hr-stat-detail">{item.detail}</div>
            </button>
          );
        })}
      </div>

      {/* เมนูจัดการงาน HR */}
      <div className="hr-section-heading">
        <div>
          <h2>เมนูจัดการงาน HR</h2>
          <p>เลือกเครื่องมือที่ต้องการใช้งาน</p>
        </div>
      </div>

      <div className="hr-menu-grid">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              className="hr-menu-card"
              key={item.title}
              onClick={() => navigate(item.tab)}
            >
              <div className={`hr-menu-icon ${item.color}`}>
                <Icon size={22} />
              </div>

              <div className="hr-menu-title">{item.title}</div>

              <div className="hr-menu-description">
                {item.description}
              </div>

              <div className="hr-menu-footer">
                <span>เข้าใช้งาน</span>
                <ArrowRight size={16} />
              </div>
            </button>
          );
        })}
      </div>

      {/* คำขอลาล่าสุด */}
      <div className="hr-section-heading">
        <div>
          <h2>คำขอลาล่าสุด</h2>
          <p>รายการล่าสุดที่บันทึกไว้ในระบบ</p>
        </div>
      </div>

      <section className="hr-table-card">
        <div className="hr-table-header">
          <div>
            <h3>
              <Users className="hr-table-title-icon" size={17} />
              รายการคำขอของพนักงาน
            </h3>
            <p>แสดงรายการล่าสุดไม่เกิน 5 รายการ</p>
          </div>

          <button
            type="button"
            className="hr-view-all"
            onClick={() => navigate('hr-requests')}
          >
            ดูทั้งหมด <ArrowRight size={15} />
          </button>
        </div>

        <div className="hr-table-scroll">
          <table className="hr-table">
            <thead>
              <tr>
                <th>พนักงาน</th>
                <th>ประเภทการลา</th>
                <th>ช่วงวันที่ลา</th>
                <th>จำนวนวัน</th>
                <th>สถานะ</th>
              </tr>
            </thead>

            <tbody>
              {recentRequests.length > 0 ? (
                recentRequests.map((item, index) => {
                  const status = getStatus(item.status);
                  const name =
                    item.name || item.employeeName || 'ไม่ระบุชื่อ';

                  return (
                    <tr key={item.id ?? index}>
                      <td>
                        <div className="hr-person">
                          <div className="hr-person-avatar">
                            {name.charAt(0)}
                          </div>

                          <div>
                            <div className="hr-person-name">{name}</div>
                            <div className="hr-person-id">
                              {item.empId ||
                                item.employeeId ||
                                item.employeeCode ||
                                'ไม่ระบุรหัส'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {item.leaveType || item.leaveTypeName || '-'}
                      </td>

                      <td>
                        {item.startDate || '-'}
                        {item.endDate &&
                          item.endDate !== item.startDate &&
                          ` - ${item.endDate}`}
                      </td>

                      <td>{Number(item.days) || 0} วัน</td>

                      <td>
                        <span
                          className={`hr-status ${status.className}`}
                        >
                          {status.className === 'approved' ? (
                            <CheckCircle2 size={13} />
                          ) : status.className === 'rejected' ? (
                            <XCircle size={13} />
                          ) : (
                            <Clock3 size={13} />
                          )}

                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="hr-empty">
                      <FileText
                        className="hr-empty-icon"
                        size={35}
                      />
                      <p>ยังไม่มีคำขอลาในระบบ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default HRDashboardView;
