import React from 'react';
import { ClipboardList, Users, CalendarDays, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';

const isPending = (request) => ['รอการตรวจสอบ', 'รออนุมัติ', 'PENDING'].includes(request.status);

export default function SupervisorDashboardView({ requests = [], onNavigateTab, onOpenRequest, onApproveRequest }) {
  const pending = requests.filter(isPending);
  const approved = requests.filter((request) => request.status === 'อนุมัติ');
  const rejected = requests.filter((request) => request.status === 'ไม่อนุมัติ');

  return (
    <section className="supervisor-page">
      <div className="supervisor-page-heading">
        <div>
          <p className="supervisor-eyebrow">SUPERVISOR WORKSPACE</p>
          <h1>ภาพรวมการลา</h1>
          <p>ตรวจสอบคำขอลาของพนักงานในทีมและติดตามสถานะการพิจารณา</p>
        </div>
        <button className="supervisor-secondary-button" onClick={() => onNavigateTab('approval')}>
          ดูคำขอทั้งหมด <ArrowRight size={16} />
        </button>
      </div>

      <div className="supervisor-summary-grid">
        <button className="supervisor-summary-card" onClick={() => onNavigateTab('approval')}>
          <span className="supervisor-summary-icon pending"><ClipboardList size={21} /></span>
          <span className="supervisor-summary-label">คำขอรออนุมัติ</span>
          <strong>{pending.length} <small>รายการ</small></strong>
          <span className="supervisor-summary-hint">รายการที่ต้องตรวจสอบ</span>
        </button>
        <div className="supervisor-summary-card">
          <span className="supervisor-summary-icon approved"><Users size={21} /></span>
          <span className="supervisor-summary-label">อนุมัติแล้ว</span>
          <strong>{approved.length} <small>รายการ</small></strong>
          <span className="supervisor-summary-hint">คำขอที่พิจารณาแล้ว</span>
        </div>
        <div className="supervisor-summary-card">
          <span className="supervisor-summary-icon calendar"><CalendarDays size={21} /></span>
          <span className="supervisor-summary-label">ไม่อนุมัติ</span>
          <strong>{rejected.length} <small>รายการ</small></strong>
          <span className="supervisor-summary-hint">คำขอที่ไม่ผ่านการพิจารณา</span>
        </div>
      </div>

      <div className="supervisor-panel">
        <div className="supervisor-panel-heading">
          <div>
            <h2><ClipboardList size={19} /> คำขอลาที่รอการอนุมัติ</h2>
            <p>ตรวจสอบข้อมูลก่อนดำเนินการอนุมัติหรือไม่อนุมัติ</p>
          </div>
          <button className="supervisor-link-button" onClick={() => onNavigateTab('approval')}>
            ดูทั้งหมด <ArrowRight size={15} />
          </button>
        </div>

        {pending.length === 0 ? (
          <div className="supervisor-empty-state">
            <CheckCircle2 size={30} />
            <strong>ไม่มีคำขอที่รออนุมัติ</strong>
            <span>เมื่อพนักงานยื่นคำขอลา รายการจะแสดงที่หน้านี้</span>
          </div>
        ) : (
          <div className="supervisor-request-list">
            {pending.slice(0, 5).map((request) => (
              <article className="supervisor-request-row" key={request.id}>
                <div className="supervisor-request-person">
                  <span className="supervisor-person-avatar">{(request.name || '?').slice(0, 1)}</span>
                  <div>
                    <strong>{request.name}</strong>
                    <small>{request.empId} · {request.department || 'ไม่ระบุแผนก'}</small>
                  </div>
                </div>
                <div className="supervisor-request-type">
                  <span className={`leave-type-chip ${request.leaveType === 'ลาป่วย' ? 'sick' : request.leaveType === 'ลากิจ' ? 'business' : request.leaveType === 'ลาพักร้อน' ? 'vacation' : request.leaveType === 'ลาคลอด' ? 'maternity' : 'other'}`}>{request.leaveType}</span>
                  <small>{request.startDate}{request.endDate && request.endDate !== request.startDate ? ` – ${request.endDate}` : ''} · {request.days} วัน</small>
                </div>
                <div className="supervisor-request-actions">
                  <button className="supervisor-detail-button" onClick={() => onOpenRequest(request)}><Eye size={15} /> ดูรายละเอียด</button>
                  <button className="supervisor-approve-button" onClick={() => onOpenRequest(request)}><CheckCircle2 size={15} /> ตรวจสอบ</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
