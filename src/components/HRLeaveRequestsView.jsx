
import React, { useMemo, useState } from 'react';
import { Search, ClipboardList, Eye, RotateCcw } from 'lucide-react';

export default function HRLeaveRequestsView({ requests = [] }) {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);

    const filteredRequests = useMemo(() => {
        const query = searchText.trim().toLowerCase();

        return requests.filter((request) => {
            const matchesSearch =
                !query ||
                [
                    request.name,
                    request.empId,
                    request.department,
                    request.leaveType,
                ].some((value) =>
                    String(value || '').toLowerCase().includes(query)
                );

            const matchesStatus =
                statusFilter === 'all' ||
                request.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [requests, searchText, statusFilter]);

    const pendingCount = requests.filter((r) =>
        ['รอการตรวจสอบ', 'รออนุมัติ', 'PENDING'].includes(r.status)
    ).length;

    const approvedCount = requests.filter(
        (r) => r.status === 'อนุมัติ'
    ).length;

    const rejectedCount = requests.filter(
        (r) => r.status === 'ไม่อนุมัติ'
    ).length;

    const getStatusClass = (status) => {
        if (['รอการตรวจสอบ', 'รออนุมัติ', 'PENDING'].includes(status)) {
            return 'pending';
        }
        if (status === 'อนุมัติ') return 'approved';
        if (status === 'ไม่อนุมัติ') return 'rejected';
        return 'other';
    };

    return (
        <section className="supervisor-page hr-page">
            <div className="supervisor-page-heading">
                <div>
                    <p className="supervisor-eyebrow">HUMAN RESOURCES</p>
                    <h1>จัดการคำขอลา</h1>
                    <p>
                        ตรวจสอบและติดตามคำขอลาของพนักงานทั้งหมด
                    </p>
                </div>
            </div>

            <div className="supervisor-summary-grid">
                <div className="supervisor-summary-card">
                    <span className="supervisor-summary-label">
                        คำขอทั้งหมด
                    </span>
                    <strong>{requests.length} <small>รายการ</small></strong>
                    <span className="supervisor-summary-hint">
                        คำขอลาในระบบ
                    </span>
                </div>

                <div className="supervisor-summary-card">
                    <span className="supervisor-summary-label">
                        รอพิจารณา
                    </span>
                    <strong>{pendingCount} <small>รายการ</small></strong>
                    <span className="supervisor-summary-hint">
                        ยังไม่ดำเนินการเสร็จ
                    </span>
                </div>

                <div className="supervisor-summary-card">
                    <span className="supervisor-summary-label">
                        อนุมัติแล้ว
                    </span>
                    <strong>{approvedCount} <small>รายการ</small></strong>
                    <span className="supervisor-summary-hint">
                        คำขอที่ผ่านการอนุมัติ
                    </span>
                </div>

                <div className="supervisor-summary-card">
                    <span className="supervisor-summary-label">
                        ไม่อนุมัติ
                    </span>
                    <strong>{rejectedCount} <small>รายการ</small></strong>
                    <span className="supervisor-summary-hint">
                        คำขอที่ไม่ผ่านการอนุมัติ
                    </span>
                </div>
            </div>

            <div className="supervisor-filter-bar">
                <label className="supervisor-search-field">
                    <Search size={18} />
                    <input
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        placeholder="ค้นหาชื่อ รหัสพนักงาน หรือประเภทการลา"
                    />
                </label>

                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="กรองสถานะคำขอลา"
                >
                    <option value="all">ทุกสถานะ</option>
                    <option value="รอการตรวจสอบ">รอการตรวจสอบ</option>
                    <option value="รออนุมัติ">รออนุมัติ</option>
                    <option value="PENDING">PENDING</option>
                    <option value="อนุมัติ">อนุมัติแล้ว</option>
                    <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
                </select>

                {(searchText || statusFilter !== 'all') && (
                    <button
                        type="button"
                        className="supervisor-reset-button"
                        onClick={() => {
                            setSearchText('');
                            setStatusFilter('all');
                        }}
                    >
                        <RotateCcw size={14} />
                        ล้างตัวกรอง
                    </button>
                )}
            </div>

            <div className="supervisor-panel supervisor-approval-panel">
                <div className="supervisor-panel-heading">
                    <div>
                        <h2>
                            <ClipboardList size={19} />
                            รายการคำขอลาทั้งหมด
                        </h2>
                        <p>พบ {filteredRequests.length} รายการ</p>
                    </div>
                </div>

                <div className="supervisor-table-wrap">
                    <table className="supervisor-table">
                        <thead>
                            <tr>
                                <th>พนักงาน</th>
                                <th>ประเภทการลา</th>
                                <th>วันที่ลา</th>
                                <th>จำนวนวัน</th>
                                <th>สถานะ</th>
                                <th>รายละเอียด</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRequests.map((request, index) => (
                                <tr key={request.id ?? index}>
                                    <td>
                                        <strong>{request.name || 'ไม่ระบุชื่อ'}</strong>
                                        <small>{request.empId || request.employeeId || '-'}</small>
                                    </td>

                                    <td>{request.leaveType || '-'}</td>

                                    <td>
                                        {request.startDate || '-'}
                                        {request.endDate &&
                                            request.endDate !== request.startDate
                                            ? ` – ${request.endDate}`
                                            : ''}
                                    </td>

                                    <td>{request.days ?? 0} วัน</td>

                                    <td>
                                        <span
                                            className={`leave-type-chip ${getStatusClass(
                                                request.status
                                            )}`}
                                        >
                                            {request.status || 'ไม่ระบุสถานะ'}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="supervisor-detail-button"
                                            onClick={() => setSelectedRequest(request)}
                                        >
                                            <Eye size={14} />
                                            ดูรายละเอียด
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan="6">
                                        <div className="supervisor-table-empty">
                                            ไม่พบคำขอลาที่ตรงกับเงื่อนไข
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedRequest && (
                <div
                    className="hr-modal-backdrop"
                    onClick={() => setSelectedRequest(null)}
                >
                    <div
                        className="supervisor-panel hr-detail-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="รายละเอียดคำขอลา"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="supervisor-panel-heading">
                            <div>
                                <h2>รายละเอียดคำขอลา</h2>
                                <p>ข้อมูลคำขอของพนักงาน</p>
                            </div>

                            <button
                                type="button"
                                className="supervisor-reset-button"
                                onClick={() => setSelectedRequest(null)}
                            >
                                ปิด
                            </button>
                        </div>

                        <p><strong>ชื่อพนักงาน:</strong> {selectedRequest.name || '-'}</p>
                        <p><strong>รหัสพนักงาน:</strong> {selectedRequest.empId || selectedRequest.employeeId || '-'}</p>
                        <p><strong>แผนก:</strong> {selectedRequest.department || '-'}</p>
                        <p><strong>ประเภทการลา:</strong> {selectedRequest.leaveType || '-'}</p>
                        <p><strong>วันที่เริ่มลา:</strong> {selectedRequest.startDate || '-'}</p>
                        <p><strong>วันที่สิ้นสุด:</strong> {selectedRequest.endDate || selectedRequest.startDate || '-'}</p>
                        <p><strong>จำนวนวัน:</strong> {selectedRequest.days ?? 0} วัน</p>
                        <p><strong>สถานะ:</strong> {selectedRequest.status || '-'}</p>
                        <p><strong>เหตุผล:</strong> {selectedRequest.reason || selectedRequest.note || '-'}</p>
                    </div>
                </div>
            )}
        </section>
    );
}