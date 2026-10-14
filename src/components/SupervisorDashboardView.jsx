
import React, { useMemo } from 'react';
import {
  ClipboardList,
  Users,
  CalendarDays,
  ArrowRight,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  BriefcaseBusiness,
} from 'lucide-react';

const isPending = (request) =>
  ['รอการตรวจสอบ', 'รออนุมัติ', 'PENDING'].includes(request.status);

const getLeaveTypeClass = (type) => {
  switch (type) {
    case 'ลาป่วย':
      return 'sick';
    case 'ลากิจ':
      return 'business';
    case 'ลาพักร้อน':
      return 'vacation';
    case 'ลาคลอด':
      return 'maternity';
    default:
      return 'other';
  }
};

export default function SupervisorDashboardView({
  requests = [],
  onNavigateTab,
  onOpenRequest,
  onApproveRequest,
}) {
  const { pending, approved, rejected } = useMemo(() => ({
    pending: requests.filter(isPending),
    approved: requests.filter((request) => request.status === 'อนุมัติ'),
    rejected: requests.filter((request) => request.status === 'ไม่อนุมัติ'),
  }), [requests]);

  return (
    <section className="supervisor-page supervisor-dashboard">
      {/* ส่วนหัว */}
      <div className="supervisor-page-heading dashboard-heading">
        <div>
          <p className="supervisor-eyebrow">SUPERVISOR WORKSPACE</p>
          <h1>ภาพรวมการลา</h1>
          <p>
            ติดตามคำขอลาของพนักงานในทีม
            และตรวจสอบสถานะการพิจารณาได้จากที่เดียว
          </p>
        </div>

        <button
          type="button"
          className="dashboard-main-button"
          onClick={() => onNavigateTab?.('approval')}
        >
          <ClipboardList size={18} />
          ดูคำขอทั้งหมด
          <ArrowRight size={16} />
        </button>
      </div>

      {/* การ์ดสรุปสถานะ */}
      <div className="supervisor-summary-grid dashboard-summary-grid">
        <button
          type="button"
          className="supervisor-summary-card dashboard-summary-card dashboard-pending-card"
          onClick={() => onNavigateTab?.('approval')}
        >
          <div className="dashboard-card-top">
            <span className="supervisor-summary-icon pending">
              <Clock3 size={22} />
            </span>
            <span className="dashboard-card-arrow">
              <ArrowRight size={17} />
            </span>
          </div>

          <span className="supervisor-summary-label">คำขอรออนุมัติ</span>
          <strong>
            {pending.length}
            <small>รายการ</small>
          </strong>
          <span className="supervisor-summary-hint">
            รายการที่ต้องตรวจสอบ
          </span>
        </button>

        <div className="supervisor-summary-card dashboard-summary-card">
          <div className="dashboard-card-top">
            <span className="supervisor-summary-icon approved">
              <CheckCircle2 size={22} />
            </span>
            <span className="dashboard-status-label approved-label">
              ดำเนินการแล้ว
            </span>
          </div>

          <span className="supervisor-summary-label">อนุมัติแล้ว</span>
          <strong>
            {approved.length}
            <small>รายการ</small>
          </strong>
          <span className="supervisor-summary-hint">
            คำขอที่ผ่านการพิจารณา
          </span>
        </div>

        <div className="supervisor-summary-card dashboard-summary-card">
          <div className="dashboard-card-top">
            <span className="supervisor-summary-icon rejected">
              <XCircle size={22} />
            </span>
            <span className="dashboard-status-label rejected-label">
              ไม่ผ่านการพิจารณา
            </span>
          </div>

          <span className="supervisor-summary-label">ไม่อนุมัติ</span>
          <strong>
            {rejected.length}
            <small>รายการ</small>
          </strong>
          <span className="supervisor-summary-hint">
            คำขอที่ไม่ผ่านการพิจารณา
          </span>
        </div>
      </div>

      {/* รายการคำขอล่าสุดที่รออนุมัติ */}
      <div className="supervisor-panel dashboard-request-panel">
        <div className="supervisor-panel-heading dashboard-request-heading">
          <div>
            <div className="dashboard-section-title">
              <span className="dashboard-section-icon">
                <ClipboardList size={20} />
              </span>
              <h2>คำขอลาที่รอการอนุมัติ</h2>
            </div>
            <p>
              รายการที่ต้องตรวจสอบก่อนดำเนินการพิจารณา
            </p>
          </div>

          <button
            type="button"
            className="supervisor-link-button dashboard-view-all"
            onClick={() => onNavigateTab?.('approval')}
          >
            ดูทั้งหมด
            <ArrowRight size={16} />
          </button>
        </div>

        {pending.length === 0 ? (
          <div className="supervisor-empty-state dashboard-empty-state">
            <span className="dashboard-empty-icon">
              <CheckCircle2 size={30} />
            </span>
            <strong>ไม่มีคำขอที่รออนุมัติ</strong>
            <span>
              เมื่อพนักงานยื่นคำขอลา รายการจะแสดงที่หน้านี้
            </span>
          </div>
        ) : (
          <>
            <div className="dashboard-pending-banner">
              <div className="dashboard-pending-banner-icon">
                <Clock3 size={19} />
              </div>
              <div>
                <strong>มีคำขอที่ต้องตรวจสอบ</strong>
                <p>
                  มีคำขอรอพิจารณาทั้งหมด {pending.length} รายการ
                </p>
              </div>
            </div>

            <div className="supervisor-request-list dashboard-request-list">
              {pending.slice(0, 5).map((request) => (
                <article
                  className="supervisor-request-row dashboard-request-row"
                  key={request.id}
                >
                  <div className="supervisor-request-person">
                    <span className="supervisor-person-avatar">
                      {String(request.name || '?').trim().charAt(0)}
                    </span>

                    <div className="dashboard-person-info">
                      <strong>{request.name || 'ไม่ระบุชื่อ'}</strong>
                      <small>
                        รหัสพนักงาน: {request.empId || '-'}
                      </small>
                      <small className="dashboard-department">
                        <BriefcaseBusiness size={12} />
                        {request.department || 'ไม่ระบุแผนก'}
                      </small>
                    </div>
                  </div>

                  <div className="supervisor-request-type dashboard-request-type">
                    <span
                      className={`leave-type-chip ${getLeaveTypeClass(
                        request.leaveType
                      )}`}
                    >
                      {request.leaveType || 'อื่นๆ'}
                    </span>

                    <small className="dashboard-request-date">
                      <CalendarDays size={13} />
                      <span>
                        {request.startDate || '-'}
                        {request.endDate &&
                          request.endDate !== request.startDate
                          ? ` – ${request.endDate}`
                          : ''}
                      </span>
                    </small>

                    <small className="dashboard-request-days">
                      {request.days ?? 0} วัน
                    </small>
                  </div>

                  <div className="supervisor-request-actions dashboard-request-actions">
                    <button
                      type="button"
                      className="supervisor-detail-button"
                      onClick={() => onOpenRequest?.(request)}
                    >
                      <Eye size={15} />
                      ดูรายละเอียด
                    </button>

                    <button
                      type="button"
                      className="supervisor-approve-button"
                      onClick={() => onOpenRequest?.(request)}
                    >
                      <CheckCircle2 size={15} />
                      ตรวจสอบ
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {pending.length > 5 && (
              <div className="dashboard-footer">
                <span>
                  แสดง 5 จาก {pending.length} รายการ
                </span>
                <button
                  type="button"
                  className="supervisor-link-button"
                  onClick={() => onNavigateTab?.('approval')}
                >
                  ดูคำขอที่เหลือ
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}