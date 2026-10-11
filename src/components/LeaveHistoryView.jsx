import React from 'react';
import { Clock, CheckCircle, XCircle, FileText, Calendar, Eye } from 'lucide-react';

export default function LeaveHistoryView({ requests, onSelectRequest }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'อนุมัติ':
        return (
          <span style={{
            background: 'var(--status-approved-bg)',
            color: 'var(--status-approved-text)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <CheckCircle size={14} /> อนุมัติ
          </span>
        );
      case 'ไม่อนุมัติ':
        return (
          <span style={{
            background: 'var(--status-rejected-bg)',
            color: 'var(--status-rejected-text)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <XCircle size={14} /> ไม่อนุมัติ
          </span>
        );
      case 'รอการตรวจสอบ':
      default:
        return (
          <span style={{
            background: 'var(--status-pending-bg)',
            color: 'var(--status-pending-text)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Clock size={14} /> รอการตรวจสอบ
          </span>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a334e', marginBottom: '20px' }}>
        รายการประวัติ / ติดตามสถานะคำขอลา
      </h2>

      <div className="table-card">
        <table className="leave-table" aria-label="ประวัติคำขอลา">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ลำดับ</th>
              <th>ประเภทการลา</th>
              <th>ช่วงวันที่ลา</th>
              <th>จำนวนวัน</th>
              <th>วันที่ยื่นคำขอ</th>
              <th>สถานะ</th>
              <th style={{ width: '100px' }}>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {requests && requests.length > 0 ? (
              requests.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{item.leaveType}</td>
                  <td>{item.startDate} - {item.endDate}</td>
                  <td>{item.days} วัน</td>
                  <td style={{ fontSize: '13.5px', color: '#64748b' }}>{item.requestDate}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-view-details"
                      onClick={() => onSelectRequest(item)}
                    >
                      <Eye size={15} /> ดู
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: '36px', color: '#64748b' }}>
                  ยังไม่มีประวัติการยื่นคำขอลา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
