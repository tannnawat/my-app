import React, { useMemo, useState } from 'react';
import { Calendar, ChevronDown, Search, RotateCcw } from 'lucide-react';

export default function SummaryReportView({ requests = [] }) {
  const [dateRange, setDateRange] = useState('01/01/2569 - 28/02/2569');

  // ค่าที่เลือกในช่องค้นหา
  const [searchText, setSearchText] = useState('');
  const [selectedLeaveType, setSelectedLeaveType] = useState('ทั้งหมด');
  const [selectedEmployee, setSelectedEmployee] = useState('ทั้งหมด');

  // ค่าที่นำไปกรองจริงเมื่อกดค้นหา
  const [filters, setFilters] = useState({
    searchText: '',
    leaveType: 'ทั้งหมด',
    employee: 'ทั้งหมด',
  });

  const getEmployeeName = (request) =>
    request.name || request.employeeName || request.fullName || 'ไม่ระบุชื่อ';

  const getEmployeeId = (request) =>
    String(request.empId ?? request.employeeId ?? getEmployeeName(request));

  // สร้างตัวเลือกประเภทการลาจากข้อมูลจริง
  const leaveTypes = useMemo(() => {
    const types = ['ลากิจ', 'ลาพักร้อน', 'ลาป่วย', 'ลาคลอด', 'อื่นๆ'];

    requests.forEach((request) => {
      const type = request.leaveType;
      if (type && !types.includes(type)) types.push(type);
    });

    return types;
  }, [requests]);

  // สร้างตัวเลือกพนักงานจากข้อมูลจริง
  const employees = useMemo(() => {
    const employeeMap = new Map();

    requests.forEach((request) => {
      const id = getEmployeeId(request);
      if (!employeeMap.has(id)) {
        employeeMap.set(id, {
          id,
          name: getEmployeeName(request),
          empId: request.empId || request.employeeId || '',
        });
      }
    });

    return Array.from(employeeMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'th')
    );
  }, [requests]);

  // กรองข้อมูลตามชื่อ/รหัสพนักงาน/แผนก/ประเภทการลา
  const filteredRequests = useMemo(() => {
    const keyword = filters.searchText.trim().toLowerCase();

    return requests.filter((request) => {
      const name = getEmployeeName(request);
      const employeeId = getEmployeeId(request);
      const department = request.department || '';
      const leaveType = request.leaveType || '';

      const matchesKeyword =
        !keyword ||
        [name, employeeId, department, leaveType, request.reason, request.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword));

      const matchesLeaveType =
        filters.leaveType === 'ทั้งหมด' || leaveType === filters.leaveType;

      const matchesEmployee =
        filters.employee === 'ทั้งหมด' || employeeId === filters.employee;

      return matchesKeyword && matchesLeaveType && matchesEmployee;
    });
  }, [requests, filters]);

  // สรุปจำนวนวันลาตามประเภทจากข้อมูลที่กรองแล้ว
  const chartBars = useMemo(() => {
    const colors = [
      '#f0932b',
      '#f87171',
      '#6ee7b7',
      '#e879f9',
      '#2dd4bf',
      '#60a5fa',
      '#a78bfa',
    ];

    return leaveTypes.map((label, index) => ({
      label,
      color: colors[index % colors.length],
      value: filteredRequests.reduce(
        (sum, request) =>
          sum + (request.leaveType === label ? Number(request.days) || 0 : 0),
        0
      ),
    }));
  }, [leaveTypes, filteredRequests]);

  // สรุปจำนวนครั้งและจำนวนวันลาแยกตามแผนก
  const departmentRows = useMemo(() => {
    const departmentMap = new Map();

    filteredRequests.forEach((request) => {
      const department = request.department || 'ไม่ระบุแผนก';

      if (!departmentMap.has(department)) {
        departmentMap.set(department, { dept: department, count: 0, days: 0 });
      }

      const row = departmentMap.get(department);
      row.count += 1;
      row.days += Number(request.days) || 0;
    });

    return Array.from(departmentMap.values()).sort((a, b) =>
      a.dept.localeCompare(b.dept, 'th')
    );
  }, [filteredRequests]);

  const totalCount = filteredRequests.length;
  const totalDays = filteredRequests.reduce(
    (sum, request) => sum + (Number(request.days) || 0),
    0
  );

  const chartMax = Math.max(
    5,
    Math.ceil(Math.max(0, ...chartBars.map((bar) => bar.value)) / 5) * 5
  );

  const applyFilters = (event) => {
    event.preventDefault();
    setFilters({
      searchText,
      leaveType: selectedLeaveType,
      employee: selectedEmployee,
    });
  };

  const resetFilters = () => {
    setSearchText('');
    setSelectedLeaveType('ทั้งหมด');
    setSelectedEmployee('ทั้งหมด');
    setFilters({ searchText: '', leaveType: 'ทั้งหมด', employee: 'ทั้งหมด' });
  };

  return (
    <div className="report-page-container">
      <div className="report-page-header">
        <h1
          className="page-title-text"
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1a334e',
            marginBottom: '16px',
          }}
        >
          รายงานและสรุปข้อมูลการลา
        </h1>

        <div className="report-date-range-bar">
          <span className="range-label">ช่วงเวลา</span>
          <div className="range-input-wrapper">
            <input
              type="text"
              id="report-date-range"
              value={dateRange}
              placeholder="วว/ดด/ปป - วว/ดด/ปป"
              onChange={(event) => setDateRange(event.target.value)}
            />
            <span className="range-icon">
              <Calendar size={17} />
            </span>
          </div>
        </div>
      </div>

      {/* ย้ายฟอร์มค้นหาออกมาไว้นอก report-content-grid เพื่อให้กว้างเต็มหน้า */}
      <form className="report-filter-row" onSubmit={applyFilters}>
        <div className="report-filter-item report-text-search">
          <label htmlFor="report-search-text">ค้นหาพนักงาน</label>
          <div className="report-search-input-wrap">
            <Search size={17} />
            <input
              id="report-search-text"
              type="text"
              value={searchText}
              placeholder="ชื่อ รหัส หรือแผนก"
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
        </div>

        <div className="report-filter-item">
          <label htmlFor="filter-report-type">ประเภทการลา</label>
          <div className="report-select-wrap">
            <select
              id="filter-report-type"
              className="report-select"
              value={selectedLeaveType}
              onChange={(event) => setSelectedLeaveType(event.target.value)}
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              {leaveTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <span className="report-select-arrow">
              <ChevronDown size={16} />
            </span>
          </div>
        </div>

        <div className="report-filter-item">
          <label htmlFor="filter-report-emp">พนักงาน</label>
          <div className="report-select-wrap">
            <select
              id="filter-report-emp"
              className="report-select"
              value={selectedEmployee}
              onChange={(event) => setSelectedEmployee(event.target.value)}
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                  {employee.empId ? ` (${employee.empId})` : ''}
                </option>
              ))}
            </select>
            <span className="report-select-arrow">
              <ChevronDown size={16} />
            </span>
          </div>
        </div>

        <div className="report-filter-actions">
          <button type="submit" className="btn-report-search" id="btn-report-search">
            <Search size={16} />
            ค้นหา
          </button>
          <button type="button" className="btn-report-reset" onClick={resetFilters}>
            <RotateCcw size={15} />
            ล้างค่า
          </button>
        </div>
      </form>

      {/* กราฟและตารางอยู่ใน grid แยกจากแถบค้นหา */}
      <div className="report-content-grid">
        <section className="chart-card-wrapper">
          <h2 className="section-sub-title">สถิติการลาตามประเภท</h2>

          <div className="chart-card" id="chart-leave-types">
            <div className="chart-legend-top-right">
              {chartBars.map((bar) => (
                <span className="legend-chip" key={bar.label}>
                  <span className="legend-dot" style={{ backgroundColor: bar.color }} />
                  {bar.label}
                </span>
              ))}
            </div>

            <div style={{ paddingTop: '20px', width: '100%', overflowX: 'auto' }}>
              <svg
                viewBox="0 0 500 280"
                className="bar-chart-svg"
                style={{ minWidth: '380px', width: '100%' }}
              >
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const value = (chartMax * (5 - index)) / 5;
                  const y = 32 + index * 42;

                  return (
                    <g key={index}>
                      <text x="35" y={y + 4} fontSize="11" fill="#64748b" textAnchor="end">
                        {Math.round(value)}
                      </text>
                      <line
                        x1="45"
                        y1={y}
                        x2="480"
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="3,3"
                      />
                    </g>
                  );
                })}

                <line x1="45" y1="242" x2="480" y2="242" stroke="#475569" strokeWidth="1.5" />
                <line x1="45" y1="32" x2="45" y2="242" stroke="#475569" strokeWidth="1.5" />

                {chartBars.map((bar, index) => {
                  const step = 420 / Math.max(chartBars.length, 1);
                  const width = Math.min(48, step * 0.58);
                  const x = 52 + index * step + (step - width) / 2;
                  const height = (bar.value / chartMax) * 210;
                  const y = 242 - height;

                  return (
                    <g key={bar.label}>
                      <text
                        x={x + width / 2}
                        y={Math.max(24, y - 8)}
                        fontSize="12"
                        fontWeight="600"
                        fill="#334155"
                        textAnchor="middle"
                      >
                        {bar.value}
                      </text>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={Math.max(bar.value ? height : 0, 0)}
                        fill={bar.color}
                        rx="3"
                      >
                        <title>{`${bar.label}: ${bar.value} วัน`}</title>
                      </rect>
                      <text
                        x={x + width / 2}
                        y="262"
                        fontSize="11"
                        fill="#334155"
                        textAnchor="middle"
                      >
                        {bar.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="report-result-note">
              กำลังแสดงข้อมูล {filteredRequests.length} คำขอ
            </p>
          </div>
        </section>

        <section className="report-table-section">
          <div className="dept-table-card">
            <table className="dept-summary-table" aria-label="ตารางสถิติการลาแยกตามแผนก">
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>แผนก</th>
                  <th style={{ width: '25%' }}>จำนวนครั้ง</th>
                  <th style={{ width: '25%' }}>จำนวนวัน</th>
                </tr>
              </thead>
              <tbody>
                {departmentRows.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  departmentRows.map((row) => (
                    <tr key={row.dept}>
                      <td>{row.dept}</td>
                      <td>{row.count}</td>
                      <td>{row.days}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td>รวมทั้งหมด</td>
                  <td>{totalCount}</td>
                  <td>{totalDays}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
