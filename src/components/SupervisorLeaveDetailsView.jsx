
import React, { useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Paperclip,
  CheckCircle2,
  XCircle,
  FileText,
  UserRound,
  AlertCircle,
  Clock3,
  Building2,
  BriefcaseBusiness,
  ShieldCheck,
  Info,
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

export default function SupervisorLeaveDetailsView({
  request,
  reviewerName,
  currentRole,
  onBack,
  onApprove,
  onReject,
}) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  if (!request) {
    return (
      <section className="supervisor-panel supervisor-empty-state supervisor-leave-details leave-detail-not-found">
        <span className="leave-detail-empty-icon">
          <FileText size={30} />
        </span>
        <strong>ไม่พบคำขอลาที่เลือก</strong>
        <p>คำขออาจถูกลบหรือไม่มีข้อมูลให้แสดง</p>
        <button
          type="button"
          className="supervisor-secondary-button"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          กลับไปรายการคำขอ
        </button>
      </section>
    );
  }

  const isRequestPending = isPending(request);
  const statusClass = isRequestPending
    ? 'pending'
    : request.status === 'อนุมัติ'
      ? 'approved'
      : 'rejected';

  const confirmReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      setRejectError('');
      return;
    }

    if (!rejectReason.trim()) {
      setRejectError('กรุณาระบุเหตุผลที่ไม่อนุมัติ');
      return;
    }

    // ส่ง ID และเหตุผลกลับไปให้ระบบเดิมจัดการ
    onReject?.(request.id, rejectReason.trim());
  };

  const handleApprove = () => {
    onApprove?.(request.id);
  };

  const handleRejectReasonChange = (event) => {
    setRejectReason(event.target.value);
    if (event.target.value.trim()) {
      setRejectError('');
    }
  };

  const dateRange = request.startDate
    ? `${request.startDate}${request.endDate && request.endDate !== request.startDate
      ? ` – ${request.endDate}`
      : ''
    }`
    : '-';

  const quotaItems = [
    {
      label: 'ลาป่วย',
      value: request.quotaSick || '28 / 30 วัน',
      className: 'quota-sick',
    },
    {
      label: 'ลากิจ',
      value: request.quotaBusiness || '5 / 6 วัน',
      className: 'quota-business',
    },
    {
      label: 'ลาพักร้อน',
      value:
        request.quotaVacation ||
        request.remainingQuota ||
        '8 / 10 วัน',
      className: 'quota-vacation',
    },
  ];

  return (
    <section className="supervisor-page supervisor-leave-details">
      {/* ปุ่มย้อนกลับ */}
      <button
        type="button"
        className="supervisor-back-button leave-detail-back"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        กลับไปรายการคำขอ
      </button>

      {/* ส่วนหัว */}
      <div className="supervisor-page-heading supervisor-detail-heading leave-detail-heading">
        <div>
          <p className="supervisor-eyebrow">LEAVE REQUEST REVIEW</p>
          <h1>รายละเอียดคำขอลา</h1>
          <p>
            ตรวจสอบข้อมูลพนักงาน เหตุผลการลา และสิทธิ์วันลา
            ก่อนตัดสินใจ
          </p>
        </div>

        <span className={`supervisor-status-pill ${statusClass}`}>
          <span className="leave-detail-status-dot" />
          {request.status || 'ไม่ระบุสถานะ'}
        </span>
      </div>

      {/* เนื้อหาหลัก */}
      <div className="supervisor-detail-layout leave-detail-layout">
        <article className="supervisor-panel supervisor-detail-main leave-detail-main">
          {/* ข้อมูลพนักงาน */}
          <div className="supervisor-applicant-heading leave-applicant-heading">
            <div className="supervisor-applicant-avatar leave-applicant-avatar">
              <UserRound size={27} />
            </div>

            <div className="leave-applicant-info">
              <span className="leave-section-eyebrow">
                EMPLOYEE INFORMATION
              </span>
              <h2>{request.name || 'ไม่ระบุชื่อพนักงาน'}</h2>

              <div className="leave-applicant-meta">
                <span>
                  <UserRound size={14} />
                  {request.empId || '-'}
                </span>
                <span>
                  <BriefcaseBusiness size={14} />
                  {request.position || 'พนักงาน'}
                </span>
                <span>
                  <Building2 size={14} />
                  {request.department || 'ไม่ระบุแผนก'}
                </span>
              </div>
            </div>
          </div>

          {/* รายละเอียดคำขอลา */}
          <div className="leave-detail-section">
            <div className="leave-section-heading">
              <span className="leave-section-icon">
                <CalendarDays size={19} />
              </span>
              <div>
                <h3>ข้อมูลการลา</h3>
                <p>รายละเอียดวันลาและข้อมูลประกอบคำขอ</p>
              </div>
            </div>

            <div className="supervisor-detail-fields leave-detail-fields">
              <div className="leave-info-field">
                <label>ประเภทการลา</label>
                <div>
                  <span
                    className={`leave-type-chip ${getLeaveTypeClass(
                      request.leaveType
                    )}`}
                  >
                    {request.leaveType || 'ไม่ระบุประเภท'}
                  </span>
                </div>
              </div>

              <div className="leave-info-field">
                <label>จำนวนวันลา</label>
                <strong className="leave-days-value">
                  {request.days ?? 0}
                  <small>วัน</small>
                </strong>
              </div>

              <div className="leave-info-field leave-field-wide">
                <label>ช่วงวันที่ลา</label>
                <strong className="leave-date-value">
                  <CalendarDays size={17} />
                  {dateRange}
                </strong>
              </div>

              <div className="leave-info-field">
                <label>วันที่ส่งคำขอ</label>
                <strong>
                  <Clock3 size={15} />
                  {request.requestDate || '-'}
                </strong>
              </div>

              <div className="leave-info-field">
                <label>ผู้พิจารณา</label>
                <strong>
                  <ShieldCheck size={16} />
                  {reviewerName || 'หัวหน้างาน'}
                </strong>
              </div>
            </div>
          </div>

          {/* เหตุผลการลา */}
          <div className="leave-detail-section">
            <div className="leave-section-heading">
              <span className="leave-section-icon leave-reason-icon">
                <FileText size={19} />
              </span>
              <div>
                <h3>เหตุผลประกอบการลา</h3>
                <p>เหตุผลที่พนักงานระบุในคำขอ</p>
              </div>
            </div>

            <div className="leave-reason-box">
              <p>{request.reason || 'พนักงานไม่ได้ระบุเหตุผลการลา'}</p>
            </div>
          </div>

          {/* เอกสารแนบ */}
          <div className="leave-detail-section">
            <div className="leave-section-heading">
              <span className="leave-section-icon leave-attachment-icon">
                <Paperclip size={19} />
              </span>
              <div>
                <h3>เอกสารประกอบ</h3>
                <p>ไฟล์ที่พนักงานแนบมากับคำขอ</p>
              </div>
            </div>

            {request.attachment ? (
              <div className="leave-attachment-card">
                <div className="leave-attachment-file-icon">
                  <FileText size={22} />
                </div>

                <div className="leave-attachment-info">
                  <strong>{request.attachment}</strong>
                  <small>เอกสารแนบจากคำขอลา</small>
                </div>

                <button
                  type="button"
                  className="leave-attachment-view-button"
                  onClick={() =>
                    window.alert(
                      `ไฟล์แนบตัวอย่าง: ${request.attachment}`
                    )
                  }
                >
                  ดูเอกสาร
                </button>
              </div>
            ) : (
              <div className="leave-no-attachment">
                <Paperclip size={18} />
                <span>ไม่มีเอกสารแนบในคำขอนี้</span>
              </div>
            )}
          </div>

          {/* เหตุผลที่เคยไม่อนุมัติ */}
          {request.rejectionReason && (
            <div className="leave-rejection-history">
              <div className="leave-section-heading">
                <span className="leave-rejection-icon">
                  <AlertCircle size={19} />
                </span>
                <div>
                  <h3>เหตุผลที่ไม่อนุมัติ</h3>
                  <p>รายละเอียดจากการพิจารณาครั้งก่อน</p>
                </div>
              </div>
              <p>{request.rejectionReason}</p>
            </div>
          )}

          {/* ฟอร์มระบุเหตุผลที่ไม่อนุมัติ */}
          {showRejectInput && isRequestPending && (
            <div className="leave-reject-editor">
              <label htmlFor="reject-reason">
                เหตุผลที่ไม่อนุมัติ
                <span>* จำเป็นต้องระบุ</span>
              </label>

              <textarea
                id="reject-reason"
                value={rejectReason}
                onChange={handleRejectReasonChange}
                placeholder="อธิบายเหตุผลให้พนักงานเข้าใจ เช่น เอกสารไม่ครบ หรือวันที่ลาไม่เหมาะสม"
                rows={4}
                aria-invalid={Boolean(rejectError)}
                aria-describedby={
                  rejectError ? 'reject-reason-error' : undefined
                }
              />

              {rejectError && (
                <p
                  id="reject-reason-error"
                  className="leave-reject-error"
                  role="alert"
                >
                  <AlertCircle size={15} />
                  {rejectError}
                </p>
              )}

              <p className="leave-reject-hint">
                โปรดใช้เหตุผลที่ชัดเจนและเกี่ยวข้องกับคำขอ
              </p>
            </div>
          )}

          {/* ปุ่มดำเนินการ */}

          <div className="supervisor-detail-footer leave-detail-footer">
            {currentRole === 'SUPERVISOR' && (
              <span className="leave-reviewer-note">
                <ShieldCheck size={16} />
                ผู้พิจารณา: {reviewerName || 'หัวหน้างาน'}
              </span>
            )}

            <div className="supervisor-table-actions leave-detail-actions">
              <button
                type="button"
                className="supervisor-secondary-button"
                onClick={onBack}
              >
                ปิด
              </button>



              {isRequestPending && currentRole === 'supervisor' && (
                <>
                  <button
                    type="button"
                    className="supervisor-reject-button"
                    onClick={confirmReject}
                  >
                    <XCircle size={16} />
                    {showRejectInput ? 'ยืนยันไม่อนุมัติ' : 'ไม่อนุมัติ'}
                  </button>

                  <button
                    type="button"
                    className="supervisor-approve-button"
                    onClick={handleApprove}
                  >
                    <CheckCircle2 size={17} />
                    อนุมัติคำขอ
                  </button>
                </>
              )}

            </div>
          </div>

        </article>

        {/* แถบสิทธิ์วันลาคงเหลือ */}
        <aside className="supervisor-panel supervisor-quota-card leave-quota-card">
          <div className="leave-quota-heading">
            <span className="leave-quota-heading-icon">
              <ShieldCheck size={21} />
            </span>
            <div>
              <h2>สิทธิ์วันลาคงเหลือ</h2>
              <p>ข้อมูลสิทธิ์วันลาของพนักงาน</p>
            </div>
          </div>

          <div className="leave-quota-list">
            {quotaItems.map((item) => (
              <div className="supervisor-quota-row leave-quota-row" key={item.label}>
                <span className="leave-quota-label">
                  <span className={`leave-quota-dot ${item.className}`} />
                  {item.label}
                </span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="supervisor-quota-note leave-quota-note">
            <Info size={17} />
            <p>
              <strong>หมายเหตุ</strong>
              <br />
              ตัวเลขสิทธิ์วันลาในตัวอย่างยังเป็นข้อมูลจำลอง
              ควรเชื่อมกับข้อมูลโควตาจริงก่อนใช้งานจริง
            </p>
          </div>

          <div className="leave-quota-checklist">
            <h3>รายการที่ควรตรวจสอบ</h3>
            <div>
              <CheckCircle2 size={16} />
              <span>ตรวจสอบช่วงวันที่ลา</span>
            </div>
            <div>
              <CheckCircle2 size={16} />
              <span>ตรวจสอบเหตุผลการลา</span>
            </div>
            <div>
              <CheckCircle2 size={16} />
              <span>ตรวจสอบสิทธิ์วันลาคงเหลือ</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
