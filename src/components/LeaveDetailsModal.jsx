import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Calendar, FileText, UserCheck, Clock, AlertTriangle } from 'lucide-react';

export default function LeaveDetailsModal({ request, onClose, onUpdateStatus, currentRole }) {
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  if (!request) return null;

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'อนุมัติ':
        return {
          bg: 'var(--status-approved-bg)',
          color: 'var(--status-approved-text)',
          icon: <CheckCircle size={16} />
        };
      case 'ไม่อนุมัติ':
        return {
          bg: 'var(--status-rejected-bg)',
          color: 'var(--status-rejected-text)',
          icon: <XCircle size={16} />
        };
      case 'รอการตรวจสอบ':
      default:
        return {
          bg: 'var(--status-pending-bg)',
          color: 'var(--status-pending-text)',
          icon: <Clock size={16} />
        };
    }
  };

  const statusStyle = getStatusBadgeStyle(request.status);

  const handleApprove = () => {
    onUpdateStatus(request.id, 'อนุมัติ');
  };

  const handleReject = () => {
    if (!showRejectBox) {
      setShowRejectBox(true);
      return;
    }
    onUpdateStatus(request.id, 'ไม่อนุมัติ', rejectReasonInput || 'ไม่ผ่านเกณฑ์การพิจารณา');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} />
            <h3>รายละเอียดคำขอลา #{request.id}</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Applicant Info */}
          <div className="applicant-card">
            
            <div className="applicant-info">
              <h4>{request.name}</h4>
              <div className="applicant-meta">
                รหัสพนักงาน: <strong>{request.empId}</strong> | {request.department}
              </div>
              <div className="applicant-meta" style={{ color: '#475569' }}>
                ตำแหน่ง: {request.position}
              </div>
            </div>
          </div>

          {/* Leave Details Grid */}
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">ประเภทการลา</div>
              <div className="detail-value">{request.leaveType}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">จำนวนวันลา</div>
              <div className="detail-value">{request.days} วัน</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">ช่วงวันที่ลา</div>
              <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="#2563eb" />
                {request.startDate} - {request.endDate}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">สิทธิ์คงเหลือหลังอนุมัติ</div>
              <div className="detail-value" style={{ color: '#0d9488' }}>
                {request.remainingQuota}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">วันที่ส่งคำขอ</div>
              <div className="detail-value">{request.requestDate}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">สถานะปัจจุบัน</div>
              <div
                className="status-badge-pill"
                style={{
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.color,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {statusStyle.icon}
                {request.status}
              </div>
            </div>

            <div className="detail-item full-width">
              <div className="detail-label">เหตุผลประกอบการลา</div>
              <div className="detail-value" style={{ fontWeight: 400, lineHeight: 1.6, marginTop: '4px' }}>
                {request.reason || '-'}
              </div>
            </div>

            {request.attachment && (
              <div className="detail-item full-width">
                <div className="detail-label">เอกสารแนบประกอบ</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <FileText size={16} color="#2563eb" />
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`กำลังเปิดไฟล์เอกสาร: ${request.attachment}`);
                    }}
                    style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '14px', fontWeight: 500 }}
                  >
                    {request.attachment}
                  </a>
                </div>
              </div>
            )}

            {request.rejectionReason && (
              <div className="detail-item full-width" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                <div className="detail-label" style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={14} /> เหตุผลที่ไม่อนุมัติ
                </div>
                <div className="detail-value" style={{ color: '#991b1b', fontWeight: 500, marginTop: '4px' }}>
                  {request.rejectionReason}
                </div>
              </div>
            )}

            {showRejectBox && (
              <div className="detail-item full-width" style={{ background: '#fff1f2', borderColor: '#fda4af' }}>
                <div className="detail-label" style={{ color: '#e11d48' }}>ระบุเหตุผลที่ไม่อนุมัติคำขอ:</div>
                <textarea
                  style={{
                    width: '100%',
                    height: '60px',
                    padding: '8px',
                    marginTop: '6px',
                    borderRadius: '6px',
                    border: '1px solid #f43f5e',
                    fontFamily: 'inherit',
                    fontSize: '13.5px'
                  }}
                  placeholder="เช่น ติดภารกิจโครงการสำคัญ, เอกสารประกอบไม่ครบถ้วน..."
                  value={rejectReasonInput}
                  onChange={(e) => setRejectReasonInput(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        
        {/* Modal Footer */}
        <div className="modal-footer">
          <div
            style={{
              fontSize: '13px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <UserCheck size={16} />
            ผู้ตรวจสอบ: นายยุทธศักดิ์ มีดาบ
          </div>

          {/* ซ่อนปุ่มทั้งหมดเมื่อเป็นพนักงาน */}
          {String(currentRole).toLowerCase() !== 'employee' && (
            <div className="action-buttons-group">
              <button
                type="button"
                className="btn-action-cancel"
                onClick={onClose}
              >
                ปิด
              </button>

              <button
                type="button"
                className="btn-action-reject"
                onClick={handleReject}
                id="btn-modal-reject"
              >
                <XCircle size={16} />
                {showRejectBox ? 'ยืนยันไม่อนุมัติ' : 'ไม่อนุมัติ'}
              </button>

              <button
                type="button"
                className="btn-action-approve"
                onClick={handleApprove}
                id="btn-modal-approve"
              >
                <CheckCircle size={16} />
                อนุมัติ
              </button>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
