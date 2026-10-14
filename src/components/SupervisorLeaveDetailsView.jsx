import React, { useState } from 'react';
import { ArrowLeft, CalendarDays, Paperclip, CheckCircle2, XCircle, FileText, UserRound, AlertCircle } from 'lucide-react';

export default function SupervisorLeaveDetailsView({ request, reviewerName, onBack, onApprove, onReject }) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!request) {
    return <section className="supervisor-panel supervisor-empty-state"><strong>ไม่พบคำขอลาที่เลือก</strong><button className="supervisor-secondary-button" onClick={onBack}>กลับไปรายการคำขอ</button></section>;
  }
  const isPending = ['รอการตรวจสอบ', 'รออนุมัติ', 'PENDING'].includes(request.status);

  const confirmReject = () => {
    if (!showRejectInput) { setShowRejectInput(true); return; }
    if (!rejectReason.trim()) { window.alert('กรุณาระบุเหตุผลที่ไม่อนุมัติ'); return; }
    onReject(request.id, rejectReason.trim());
  };

  return (
    <section className="supervisor-page">
      <button className="supervisor-back-button" onClick={onBack}><ArrowLeft size={16} /> กลับไปรายการคำขอ</button>
      <div className="supervisor-page-heading supervisor-detail-heading">
        <div><p className="supervisor-eyebrow">REVIEW LEAVE REQUEST</p><h1>รายละเอียดคำขอลา</h1><p>ตรวจสอบข้อมูลและสิทธิ์วันลาของพนักงานก่อนพิจารณา</p></div>
        <span className={`supervisor-status-pill ${isPending ? 'pending' : request.status === 'อนุมัติ' ? 'approved' : 'rejected'}`}>{request.status}</span>
      </div>

      <div className="supervisor-detail-layout">
        <article className="supervisor-panel supervisor-detail-main">
          <div className="supervisor-applicant-heading">
            <div className="supervisor-applicant-avatar"><UserRound size={25} /></div>
            <div><h2>{request.name}</h2><p>{request.empId} · {request.position || 'พนักงาน'} · {request.department || 'ไม่ระบุแผนก'}</p></div>
          </div>
          <div className="supervisor-detail-fields">
            <div><label>ประเภทการลา</label><strong>{request.leaveType}</strong></div>
            <div><label>ช่วงวันที่ลา</label><strong><CalendarDays size={15} /> {request.startDate}{request.endDate && request.endDate !== request.startDate ? ` – ${request.endDate}` : ''}</strong></div>
            <div><label>จำนวนวันลา</label><strong>{request.days} วัน</strong></div>
            <div><label>วันที่ส่งคำขอ</label><strong>{request.requestDate || '-'}</strong></div>
            <div className="wide"><label>เหตุผลประกอบการลา</label><p>{request.reason || 'ไม่ได้ระบุเหตุผล'}</p></div>
            <div className="wide"><label><Paperclip size={14} /> เอกสารแนบประกอบ</label>{request.attachment ? <a href="#attachment" onClick={(event) => { event.preventDefault(); window.alert(`ไฟล์แนบตัวอย่าง: ${request.attachment}`); }}><FileText size={15} /> {request.attachment} <span>ดูเอกสาร</span></a> : <p className="supervisor-muted">ไม่มีเอกสารแนบ</p>}</div>
            {request.rejectionReason && <div className="wide supervisor-rejection-reason"><label><AlertCircle size={14} /> เหตุผลที่ไม่อนุมัติ</label><p>{request.rejectionReason}</p></div>}
            {showRejectInput && <div className="wide supervisor-reject-editor"><label htmlFor="reject-reason">เหตุผลที่ไม่อนุมัติ (จำเป็น)</label><textarea id="reject-reason" value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} placeholder="ระบุเหตุผลให้พนักงานทราบ" rows={3} /></div>}
          </div>
          <div className="supervisor-detail-footer"><span>ผู้พิจารณา: {reviewerName || 'หัวหน้างาน'}</span><div className="supervisor-table-actions"><button className="supervisor-secondary-button" onClick={onBack}>ปิด</button>{isPending && <><button className="supervisor-reject-button" onClick={confirmReject}><XCircle size={16} /> {showRejectInput ? 'ยืนยันไม่อนุมัติ' : 'ไม่อนุมัติ'}</button><button className="supervisor-approve-button" onClick={() => onApprove(request.id)}><CheckCircle2 size={16} /> อนุมัติคำขอ</button></>}</div></div>
        </article>

        <aside className="supervisor-panel supervisor-quota-card">
          <h2>สิทธิ์วันลาคงเหลือของพนักงาน</h2>
          <p>ตรวจสอบสิทธิ์ที่เหลือก่อนอนุมัติ</p>
          {[
            ['ลาป่วย', request.quotaSick || '28 / 30 วัน'],
            ['ลากิจ', request.quotaBusiness || '5 / 6 วัน'],
            ['ลาพักร้อน', request.quotaVacation || request.remainingQuota || '8 / 10 วัน'],
          ].map(([label, value]) => <div className="supervisor-quota-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
          <div className="supervisor-quota-note">* ตัวเลขสิทธิ์ในหน้าตัวอย่างยังเป็นข้อมูลจำลอง ต้องเชื่อมกับข้อมูลโควตาจริงก่อนใช้งานจริง</div>
        </aside>
      </div>
    </section>
  );
}
