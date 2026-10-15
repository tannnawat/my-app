
import React from 'react';
import {
  Users,
  ClipboardList,
  CheckCircle2,
  Clock3,
  XCircle,
  FileBarChart,
  Settings,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';

const isPending = (request) =>
  ['รอการตรวจสอบ', 'รออนุมัติ', 'PENDING'].includes(
    request.status
  );

export default function HRDashboardView({
  requests = [],
  currentUser,
  onNavigateTab,
}) {
  const pending = requests.filter(isPending);
  const approved = requests.filter(
    (request) => request.status === 'อนุมัติ'
  );
  const rejected = requests.filter(
    (request) => request.status === 'ไม่อนุมัติ'
  );

  const actions = [
    {
      title: 'จัดการคำขอลา',
      description: 'ตรวจสอบและติดตามคำขอลาของพนักงาน',
      icon: ClipboardList,
      tab: 'hr-requests',
      color: '#2563eb',
      background: '#eff6ff',
    },
    {
      title: 'รายงานและสรุปข้อมูลการลา',
      description: 'ค้นหาและวิเคราะห์สถิติการลา',
      icon: FileBarChart,
      tab: 'reports',
      color: '#7c3aed',
      background: '#f5f3ff',
    },
    {
      title: 'จัดการประเภทการลา',
      description: 'ดูแลประเภทการลาที่ระบบรองรับ',
      icon: Settings,
      tab: 'hr-leave-types',
      color: '#0d9488',
      background: '#f0fdfa',
    },
    {
      title: 'จัดการสิทธิ์การลา',
      description: 'ตรวจสอบและจัดการสิทธิ์วันลา',
      icon: CalendarDays,
      tab: 'hr-leave-entitlements',
      color: '#d97706',
      background: '#fffbeb',
    },
  ];

  return (
    <section className="supervisor-page hr-dashboard-page">
      <div className="supervisor-page-heading">
        <div>
          <p className="supervisor-eyebrow">
            HR WORKSPACE
          </p>

          <h1>หน้าหลักฝ่ายทรัพยากรบุคคล</h1>

          <p>
            ยินดีต้อนรับ {currentUser?.name || 'เจ้าหน้าที่ HR'}
            {' '}ติดตามภาพรวมและจัดการข้อมูลการลาของพนักงาน
          </p>
        </div>

        <button
          type="button"
          className="supervisor-secondary-button"
          onClick={() => onNavigateTab('hr-requests')}
        >
          ดูคำขอทั้งหมด
          <ArrowRight size={16} />
        </button>
      </div>

      {/* สรุปสถานะคำขอ */}
      <div
        className="hr-dashboard-stats"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="supervisor-summary-card">
          <span className="supervisor-summary-icon calendar">
            <Users size={21} />
          </span>
          <span className="supervisor-summary-label">
            คำขอทั้งหมด
          </span>
          <strong>
            {requests.length} <small>รายการ</small>
          </strong>
          <span className="supervisor-summary-hint">
            คำขอลาในระบบ
          </span>
        </div>

        <div className="supervisor-summary-card">
          <span className="supervisor-summary-icon pending">
            <Clock3 size={21} />
          </span>
          <span className="supervisor-summary-label">
            รอพิจารณา
          </span>
          <strong>
            {pending.length} <small>รายการ</small>
          </strong>
          <span className="supervisor-summary-hint">
            รายการที่รอดำเนินการ
          </span>
        </div>

        <div className="supervisor-summary-card">
          <span className="supervisor-summary-icon approved">
            <CheckCircle2 size={21} />
          </span>
          <span className="supervisor-summary-label">
            อนุมัติแล้ว
          </span>
          <strong>
            {approved.length} <small>รายการ</small>
          </strong>
          <span className="supervisor-summary-hint">
            คำขอที่ได้รับอนุมัติ
          </span>
        </div>

        <div className="supervisor-summary-card">
          <span
            className="supervisor-summary-icon"
            style={{ background: '#fff1f2', color: '#e11d48' }}
          >
            <XCircle size={21} />
          </span>
          <span className="supervisor-summary-label">
            ไม่อนุมัติ
          </span>
          <strong>
            {rejected.length} <small>รายการ</small>
          </strong>
          <span className="supervisor-summary-hint">
            คำขอที่ไม่ได้รับอนุมัติ
          </span>
        </div>
      </div>

      {/* เมนูลัด */}
      <div className="supervisor-panel">
        <div className="supervisor-panel-heading">
          <div>
            <h2>เมนูจัดการสำหรับ HR</h2>
            <p>
              เลือกเมนูเพื่อเข้าสู่การทำงานที่ต้องการ
            </p>
          </div>
        </div>

        <div
          className="hr-dashboard-actions"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            padding: '20px',
          }}
        >
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                type="button"
                key={action.tab}
                onClick={() => onNavigateTab(action.tab)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '20px',
                  textAlign: 'left',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  minHeight: '155px',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    color: action.color,
                    background: action.background,
                  }}
                >
                  <Icon size={22} />
                </span>

                <strong style={{ color: '#1e293b', fontSize: '15px' }}>
                  {action.title}
                </strong>

                <span
                  style={{
                    color: '#64748b',
                    fontSize: '13px',
                    lineHeight: 1.6,
                  }}
                >
                  {action.description}
                </span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: action.color,
                    fontSize: '13px',
                    fontWeight: 700,
                    marginTop: 'auto',
                  }}
                >
                  เปิดหน้า
                  <ArrowRight size={15} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* คำขอล่าสุด */}
      <div className="supervisor-panel">
        <div className="supervisor-panel-heading">
          <div>
            <h2>
              <ClipboardList size={19} />
              คำขอลาล่าสุด
            </h2>
            <p>รายการล่าสุดที่บันทึกอยู่ในระบบ</p>
          </div>

          <button
            type="button"
            className="supervisor-link-button"
            onClick={() => onNavigateTab('hr-requests')}
          >
            ดูทั้งหมด
            <ArrowRight size={15} />
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="supervisor-empty-state">
            <ClipboardList size={30} />
            <strong>ยังไม่มีคำขอลา</strong>
            <span>เมื่อมีคำขอลา รายการจะแสดงที่นี่</span>
          </div>
        ) : (
          <div className="supervisor-request-list">
            {requests.slice(0, 5).map((request) => (
              <article
                className="supervisor-request-row"
                key={request.id}
              >
                <div className="supervisor-request-person">
                  <span className="supervisor-person-avatar">
                    {(request.name || '?').slice(0, 1)}
                  </span>

                  <div>
                    <strong>{request.name || 'ไม่ระบุชื่อ'}</strong>
                    <small>
                      {request.empId || request.employeeId || '-'}
                      {' · '}
                      {request.department || 'ไม่ระบุแผนก'}
                    </small>
                  </div>
                </div>

                <div className="supervisor-request-type">
                  <span className="leave-type-chip">
                    {request.leaveType || 'ไม่ระบุประเภท'}
                  </span>
                  <small>
                    {request.startDate || '-'}
                    {' · '}
                    {Number(request.days) || 0} วัน
                  </small>
                </div>

                <div className="hr-dashboard-status">
                  {request.status || 'ไม่ระบุสถานะ'}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
