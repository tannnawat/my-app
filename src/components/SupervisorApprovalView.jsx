import React, { useMemo, useState } from 'react';
import { Search, Eye, CheckCircle2, RotateCcw, ClipboardList } from 'lucide-react';

const isPending = (request) => ['รอการตรวจสอบ', 'รออนุมัติ', 'PENDING'].includes(request.status);

export default function SupervisorApprovalView({ requests = [], searchText = '', onSearchTextChange, onOpenRequest }) {
  const [leaveType, setLeaveType] = useState('all');
  const pending = requests.filter(isPending);
  const filtered = useMemo(() => pending.filter((request) => {
    const query = searchText.trim().toLowerCase();
    const matchesText = !query || [request.name, request.empId, request.department].some((value) => String(value || '').toLowerCase().includes(query));
    const matchesType = leaveType === 'all' || request.leaveType === leaveType;
    return matchesText && matchesType;
  }), [pending, searchText, leaveType]);

  return (
    <section className="supervisor-page">
      <div className="supervisor-page-heading">
        <div>
          <p className="supervisor-eyebrow">LEAVE APPROVAL</p>
          <h1>รายการคำขอรอการอนุมัติ <span className="supervisor-count-badge">{filtered.length} รายการ</span></h1>
          <p>เลือกดูรายละเอียดเพื่อตรวจสอบเหตุผล เอกสารแนบ และสิทธิ์วันลาก่อนตัดสินใจ</p>
        </div>
      </div>

      <div className="supervisor-filter-bar">
        <label className="supervisor-search-field">
          <Search size={18} />
          <input value={searchText} onChange={(event) => onSearchTextChange?.(event.target.value)} placeholder="ค้นหาชื่อหรือรหัสพนักงาน" />
        </label>
        <select value={leaveType} onChange={(event) => setLeaveType(event.target.value)} aria-label="กรองตามประเภทการลา">
          <option value="all">ประเภทการลาทั้งหมด</option>
          <option value="ลาป่วย">ลาป่วย</option>
          <option value="ลากิจ">ลากิจ</option>
          <option value="ลาพักร้อน">ลาพักร้อน</option>
          <option value="ลาคลอด">ลาคลอด</option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>
        {(searchText || leaveType !== 'all') && <button className="supervisor-reset-button" onClick={() => { onSearchTextChange?.(''); setLeaveType('all'); }}><RotateCcw size={14} /> ล้างตัวกรอง</button>}
      </div>

      <div className="supervisor-panel supervisor-approval-panel">
        <div className="supervisor-panel-heading">
          <div><h2><ClipboardList size={19} /> รายการคำขอลารออนุมัติ</h2><p>แสดงเฉพาะคำขอที่ยังต้องพิจารณา</p></div>
        </div>
        <div className="supervisor-table-wrap">
          <table className="supervisor-table">
            <thead><tr><th>ชื่อ-นามสกุล</th><th>ประเภทการลา</th><th>ช่วงวันที่ลา</th><th>จำนวนวัน</th><th>การจัดการ</th></tr></thead>
            <tbody>
              {filtered.map((request) => (
                <tr key={request.id}>
                  <td><strong>{request.name}</strong><small>{request.empId}</small></td>
                  <td><span className={`leave-type-chip ${request.leaveType === 'ลาป่วย' ? 'sick' : request.leaveType === 'ลากิจ' ? 'business' : request.leaveType === 'ลาพักร้อน' ? 'vacation' : request.leaveType === 'ลาคลอด' ? 'maternity' : 'other'}`}>{request.leaveType}</span></td>
                  <td>{request.startDate}{request.endDate && request.endDate !== request.startDate ? ` – ${request.endDate}` : ''}</td>
                  <td>{request.days} วัน</td>
                  <td><div className="supervisor-table-actions"><button className="supervisor-detail-button" onClick={() => onOpenRequest(request)}><Eye size={14} /> ดูรายละเอียด</button><button className="supervisor-approve-button" onClick={() => onOpenRequest(request)}><CheckCircle2 size={14} /> พิจารณา</button></div></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="5"><div className="supervisor-table-empty">ไม่พบคำขอที่ตรงกับตัวกรอง</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
