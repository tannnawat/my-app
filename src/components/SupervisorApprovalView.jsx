
import React, { useMemo, useState } from 'react';
import {
  Search,
  Eye,
  CheckCircle2,
  RotateCcw,
  ClipboardList,
  CalendarDays,
  Users,
  Filter,
  ArrowRight,
} from 'lucide-react';

const isPending = (request) =>
  ['รอการตรวจสอบ', 'รออนุมัติ', 'PENDING'].includes(request.status);

export default function SupervisorApprovalView({
  requests = [],
  searchText = '',
  onSearchTextChange,
  onOpenRequest,
}) {
  const [leaveType, setLeaveType] = useState('all');

  // แสดงเฉพาะคำขอที่ยังรออนุมัติ
  const pending = useMemo(
    () => requests.filter(isPending),
    [requests]
  );

  // ค้นหาจากชื่อ รหัสพนักงาน แผนก และกรองประเภทการลา
  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return pending.filter((request) => {
      const matchesText =
        !query ||
        [request.name, request.empId, request.department].some((value) =>
          String(value || '').toLowerCase().includes(query)
        );

      const matchesType =
        leaveType === 'all' || request.leaveType === leaveType;

      return matchesText && matchesType;
    });
  }, [pending, searchText, leaveType]);

  const hasFilters = searchText.trim() !== '' || leaveType !== 'all';

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

  const clearFilters = () => {
    onSearchTextChange?.('');
    setLeaveType('all');
  };

  return (
    <section className="supervisor-page approval-view">
      {/* หัวข้อหน้า */}
      <div className="supervisor-page-heading">
        <div>
          <p className="supervisor-eyebrow">LEAVE MANAGEMENT</p>
          <h1>อนุมัติคำขอลา</h1>
          <p>
            ตรวจสอบข้อมูลการลา เหตุผล และรายละเอียดของพนักงาน
            ก่อนพิจารณาคำขอ
          </p>
        </div>
      </div>

      {/* การ์ดสรุปข้อมูล */}
      <div className="approval-summary-grid">
        <div className="approval-summary-card">
          <div className="approval-summary-icon pending-icon">
            <ClipboardList size={23} />
          </div>
          <div>
            <p>คำขอรออนุมัติ</p>
            <h2>{pending.length}</h2>
            <span>รายการที่ต้องตรวจสอบ</span>
          </div>
        </div>

        <div className="approval-summary-card">
          <div className="approval-summary-icon result-icon">
            <Filter size={23} />
          </div>
          <div>
            <p>ผลการค้นหา</p>
            <h2>{filtered.length}</h2>
            <span>รายการที่ตรงกับเงื่อนไข</span>
          </div>
        </div>

        <div className="approval-summary-card">
          <div className="approval-summary-icon employee-icon">
            <Users size={23} />
          </div>
          <div>
            <p>ประเภทการลา</p>
            <h2>
              {leaveType === 'all' ? 'ทั้งหมด' : leaveType}
            </h2>
            <span>ประเภทที่กำลังแสดง</span>
          </div>
        </div>
      </div>

      {/* ช่องค้นหาและตัวกรอง */}
      <div className="supervisor-panel approval-filter-panel">
        <div className="approval-filter-title">
          <div>
            <h2>
              <Search size={19} />
              ค้นหาและกรองข้อมูล
            </h2>
            <p>ค้นหาพนักงานหรือเลือกประเภทการลา</p>
          </div>
        </div>

        <div className="supervisor-filter-bar">
          <label className="supervisor-search-field">
            <Search size={18} />
            <input
              value={searchText}
              onChange={(event) =>
                onSearchTextChange?.(event.target.value)
              }
              placeholder="ค้นหาชื่อ รหัสพนักงาน หรือแผนก..."
              aria-label="ค้นหาพนักงาน"
            />
          </label>

          <select
            value={leaveType}
            onChange={(event) => setLeaveType(event.target.value)}
            aria-label="กรองตามประเภทการลา"
          >
            <option value="all">ประเภทการลาทั้งหมด</option>
            <option value="ลาป่วย">ลาป่วย</option>
            <option value="ลากิจ">ลากิจ</option>
            <option value="ลาพักร้อน">ลาพักร้อน</option>
            <option value="ลาคลอด">ลาคลอด</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>

          {hasFilters && (
            <button
              type="button"
              className="supervisor-reset-button"
              onClick={clearFilters}
            >
              <RotateCcw size={15} />
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {/* ตารางคำขอลา */}
      <div className="supervisor-panel supervisor-approval-panel">
        <div className="supervisor-panel-heading">
          <div>
            <h2>
              <ClipboardList size={20} />
              รายการคำขอลารออนุมัติ
            </h2>
            <p>
              พบ {filtered.length} รายการ
              {hasFilters ? ' จากการค้นหาและกรองข้อมูล' : ''}
            </p>
          </div>

          <span className="approval-total-badge">
            {filtered.length} รายการ
          </span>
        </div>

        <div className="supervisor-table-wrap">
          <table className="supervisor-table approval-table">
            <thead>
              <tr>
                <th>พนักงาน</th>
                <th>ประเภทการลา</th>
                <th>ช่วงวันที่ลา</th>
                <th>จำนวนวัน</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div className="approval-employee-cell">
                      <div>
                        <strong>{request.name || 'ไม่ระบุชื่อ'}</strong>
                        <small>
                          รหัสพนักงาน: {request.empId || '-'}
                        </small>
                        {request.department && (
                          <small>{request.department}</small>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`leave-type-chip ${getLeaveTypeClass(
                        request.leaveType
                      )}`}
                    >
                      {request.leaveType || 'อื่นๆ'}
                    </span>
                  </td>

                  <td>
                    <div className="approval-date-cell">
                      <CalendarDays size={15} />
                      <span>
                        {request.startDate || '-'}
                        {request.endDate &&
                          request.endDate !== request.startDate
                          ? ` – ${request.endDate}`
                          : ''}
                      </span>
                    </div>
                  </td>

                  <td>
                    <strong>{request.days ?? 0}</strong> วัน
                  </td>

                  <td>
                    <span className="approval-status-badge">
                      <span className="approval-status-dot" />
                      รออนุมัติ
                    </span>
                  </td>

                  <td>
                    <div className="supervisor-table-actions">
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
                        พิจารณา
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="supervisor-table-empty approval-empty">
                      <div className="approval-empty-icon">
                        <ClipboardList size={30} />
                      </div>
                      <strong>ไม่พบคำขอลา</strong>
                      <p>
                        {hasFilters
                          ? 'ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง แล้วค้นหาอีกครั้ง'
                          : 'ขณะนี้ไม่มีคำขอลาที่รอการอนุมัติ'}
                      </p>

                      {hasFilters && (
                        <button
                          type="button"
                          className="supervisor-reset-button"
                          onClick={clearFilters}
                        >
                          <RotateCcw size={15} />
                          ล้างตัวกรอง
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}