
import React from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Eye,
  ClipboardList,
} from 'lucide-react';

export default function LeaveHistoryView({
  requests = [],
  onSelectRequest,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'อนุมัติ':
        return (
          <span className="history-status approved">
            <CheckCircle size={15} />
            อนุมัติ
          </span>
        );

      case 'ไม่อนุมัติ':
        return (
          <span className="history-status rejected">
            <XCircle size={15} />
            ไม่อนุมัติ
          </span>
        );

      default:
        return (
          <span className="history-status pending">
            <Clock size={15} />
            รอการตรวจสอบ
          </span>
        );
    }
  };

  const approvedCount = requests.filter(
    (item) => item.status === 'อนุมัติ'
  ).length;

  const pendingCount = requests.filter(
    (item) =>
      ['รอการตรวจสอบ', 'รออนุมัติ', 'PENDING'].includes(item.status)
  ).length;

  const rejectedCount = requests.filter(
    (item) => item.status === 'ไม่อนุมัติ'
  ).length;

  return (
    <div className="leave-history-page">
      <div className="history-page-heading">
        <div className="history-heading-icon">
          <ClipboardList size={27} />
        </div>

        <div>
          <p className="history-eyebrow">LEAVE MANAGEMENT</p>
          <h1>ประวัติการลา</h1>
          <p className="history-subtitle">
            ตรวจสอบรายการและติดตามสถานะคำขอลาของคุณ
          </p>
        </div>
      </div>

      <div className="history-summary">
        <div className="history-summary-card total">
          <div className="history-summary-icon">
            <FileText size={21} />
          </div>
          <div>
            <p>คำขอทั้งหมด</p>
            <strong>{requests.length}</strong>
            <span>รายการ</span>
          </div>
        </div>

        <div className="history-summary-card approved">
          <div className="history-summary-icon">
            <CheckCircle size={21} />
          </div>
          <div>
            <p>อนุมัติแล้ว</p>
            <strong>{approvedCount}</strong>
            <span>รายการ</span>
          </div>
        </div>

        <div className="history-summary-card pending">
          <div className="history-summary-icon">
            <Clock size={21} />
          </div>
          <div>
            <p>รอตรวจสอบ</p>
            <strong>{pendingCount}</strong>
            <span>รายการ</span>
          </div>
        </div>

        <div className="history-summary-card rejected">
          <div className="history-summary-icon">
            <XCircle size={21} />
          </div>
          <div>
            <p>ไม่อนุมัติ</p>
            <strong>{rejectedCount}</strong>
            <span>รายการ</span>
          </div>
        </div>
      </div>

      <div className="history-table-card">
        <div className="history-table-heading">
          <div>
            <h2>รายการคำขอลา</h2>
            <p>ประวัติการยื่นคำขอและผลการพิจารณา</p>
          </div>

          <span className="history-record-count">
            {requests.length} รายการ
          </span>
        </div>

        <div className="history-table-scroll">
          <table className="leave-table history-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ประเภทการลา</th>
                <th>ช่วงวันที่ลา</th>
                <th>จำนวนวัน</th>
                <th>วันที่ยื่นคำขอ</th>
                <th>สถานะ</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>

            <tbody>
              {requests.length > 0 ? (
                requests.map((item, idx) => (
                  <tr key={item.id ?? idx}>
                    <td>
                      <span className="history-row-number">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </td>

                    <td>
                      <div className="history-leave-type">
                        <span className="history-type-icon">
                          <Calendar size={17} />
                        </span>
                        <strong>{item.leaveType || '-'}</strong>
                      </div>
                    </td>

                    <td>
                      <div className="history-date-range">
                        <span>{item.startDate || '-'}</span>
                        {item.endDate &&
                          item.endDate !== item.startDate && (
                            <>
                              <span className="history-date-separator">
                                ถึง
                              </span>
                              <span>{item.endDate}</span>
                            </>
                          )}
                      </div>
                    </td>

                    <td>
                      <span className="history-days">
                        {item.days ?? 0}
                        <small>วัน</small>
                      </span>
                    </td>

                    <td>
                      <span className="history-request-date">
                        {item.requestDate || '-'}
                      </span>
                    </td>

                    <td>{getStatusBadge(item.status)}</td>

                    <td>
                      <button
                        type="button"
                        className="btn-view-details history-view-button"
                        onClick={() => onSelectRequest?.(item)}
                      >
                        <Eye size={16} />
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="history-empty-state">
                      <div className="history-empty-icon">
                        <FileText size={29} />
                      </div>
                      <strong>ยังไม่มีประวัติการลา</strong>
                      <p>
                        เมื่อคุณยื่นคำขอลา รายการจะแสดงที่หน้านี้
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {requests.length > 0 && (
          <div className="history-table-footer">
            <span>
              แสดงทั้งหมด {requests.length} รายการ
            </span>
            <span>ข้อมูลประวัติคำขอลา</span>
          </div>
        )}
      </div>
    </div>
  );
}
