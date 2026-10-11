import React, { useState } from 'react';
import { Calendar, ChevronDown, Search } from 'lucide-react';

export default function SummaryReportView() {
  const [dateRange, setDateRange] = useState('01/01/2569 - 28/02/2569');
  const [selectedLeaveType, setSelectedLeaveType] = useState('ทั้งหมด');
  const [selectedEmployee, setSelectedEmployee] = useState('ทั้งหมด');

  // Chart data matching Image 2 exactly
  // X categories: ลากิจ (7), ลาพักร้อน (45), ลาป่วย (25), ลาคลอด (15), อื่นๆ (1)
  const chartBars = [
    { label: 'ลากิจ', value: 7, color: '#f0932b', heightPct: 14 },
    { label: 'ลาพักร้อน', value: 45, color: '#f87171', heightPct: 90 },
    { label: 'ลาป่วย', value: 25, color: '#6ee7b7', heightPct: 50 },
    { label: 'ลาคลอด', value: 15, color: '#e879f9', heightPct: 30 },
    { label: 'อื่นๆ', value: 1, color: '#2dd4bf', heightPct: 4 }
  ];

  // Department Table data matching Image 2
  const departmentRows = [
    { dept: '1', count: 15, days: 42 },
    { dept: '2', count: 16, days: 37 },
    { dept: '3', count: 18, days: 33 },
    { dept: '4', count: 20, days: 23 }
  ];

  const totalCount = departmentRows.reduce((sum, r) => sum + r.count, 0); // 69
  const totalDays = departmentRows.reduce((sum, r) => sum + r.days, 0);   // 135

  const handleFilterSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="report-page-container">
      {/* Title */}
      <div className="report-page-header">
        <h1 className="page-title-text" style={{ fontSize: '24px', fontWeight: 700, color: '#1a334e', marginBottom: '16px' }}>
          สรุปรายงานการลา
        </h1>

        {/* Date Range Selector */}
        <div className="report-date-range-bar">
          <span className="range-label">ช่วงเวลา</span>
          <div className="range-input-wrapper">
            <input
              type="text"
              id="report-date-range"
              value={dateRange}
              placeholder="วว/ดด/ปป - วว/ดด/ปป"
              onChange={(e) => setDateRange(e.target.value)}
            />
            <span className="range-icon">
              <Calendar size={17} />
            </span>
          </div>
        </div>
      </div>

      {/* 2 Column Layout: Left Chart, Right Department Table */}
      <div className="report-content-grid">
        {/* Left: Statistics Bar Chart Section */}
        <section className="chart-card-wrapper">
          <h2 className="section-sub-title">สถิติการลาตามประเภท</h2>
          <div className="chart-card" id="chart-leave-types">
            {/* Legend on top right */}
            <div className="chart-legend-top-right">
              <span className="legend-chip">
                <span className="legend-dot dot-sick" /> ลาป่วย
              </span>
              <span className="legend-chip">
                <span className="legend-dot dot-business" /> ลากิจ
              </span>
              <span className="legend-chip">
                <span className="legend-dot dot-vacation" /> ลาพักร้อน
              </span>
              <span className="legend-chip">
                <span className="legend-dot dot-maternity" /> ลาคลอด
              </span>
              <span className="legend-chip">
                <span className="legend-dot dot-other" /> อื่นๆ
              </span>
            </div>

            {/* Custom SVG Bar Chart matching Image 2 */}
            <div style={{ paddingTop: '20px', width: '100%', overflowX: 'auto' }}>
              <svg viewBox="0 0 500 280" className="bar-chart-svg" style={{ minWidth: '380px' }}>
                {/* Y-Axis lines and numbers */}
                {[
                  { val: 50, y: 30 },
                  { val: 44, y: 56 },
                  { val: 37, y: 88 },
                  { val: 29, y: 120 },
                  { val: 22, y: 150 },
                  { val: 15, y: 180 },
                  { val: 7, y: 215 },
                  { val: 0, y: 245 }
                ].map((tick) => (
                  <g key={`y-${tick.val}`}>
                    <text x="35" y={tick.y + 4} fontSize="11" fill="#64748b" textAnchor="end">
                      {tick.val}
                    </text>
                    <line x1="45" y1={tick.y} x2="480" y2={tick.y} stroke="#e2e8f0" strokeDasharray="3,3" />
                  </g>
                ))}

                {/* Y-Axis base line */}
                <line x1="45" y1="245" x2="480" y2="245" stroke="#475569" strokeWidth="1.5" />
                <line x1="45" y1="20" x2="45" y2="245" stroke="#475569" strokeWidth="1.5" />

                {/* 5 Bars */}
                {chartBars.map((bar, idx) => {
                  const barWidth = 46;
                  // Distribute bars across X axis
                  const x = 70 + idx * 82;
                  const maxHeight = 215; // from y=30 to y=245
                  const barHeight = (bar.value / 50) * maxHeight;
                  const y = 245 - barHeight;

                  return (
                    <g key={bar.label} style={{ cursor: 'pointer' }}>
                      {/* Value label on top of bar */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        fontSize="12"
                        fontWeight="600"
                        fill="#334155"
                        textAnchor="middle"
                      >
                        {bar.value}
                      </text>

                      {/* Bar rectangle with hover effect */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={bar.color}
                        rx="2"
                        ry="2"
                        opacity="0.95"
                      >
                        <title>{`${bar.label}: ${bar.value} วัน`}</title>
                      </rect>

                      {/* X-axis Label below bar */}
                      <text
                        x={x + barWidth / 2}
                        y="262"
                        fontSize="11.5"
                        fill="#334155"
                        fontWeight="500"
                        textAnchor="middle"
                      >
                        {bar.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </section>

        {/* Right: Department Table Section */}
        <section className="report-table-section">
          {/* Filters Form */}
          <form className="report-filter-row" onSubmit={handleFilterSearch}>
            <div className="report-filter-item">
              <label htmlFor="filter-report-type">ประเภทการลา</label>
              <div className="report-select-wrap">
                <select
                  id="filter-report-type"
                  className="report-select"
                  value={selectedLeaveType}
                  onChange={(e) => setSelectedLeaveType(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  <option value="ลาป่วย">ลาป่วย</option>
                  <option value="ลากิจ">ลากิจ</option>
                  <option value="ลาพักร้อน">ลาพักร้อน</option>
                  <option value="ลาคลอด">ลาคลอด</option>
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
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  <option value="นายยุทธศักดิ์ มีดาบ">นายยุทธศักดิ์ มีดาบ</option>
                  <option value="นายอดิสรณ์ สมบัติ">นายอดิสรณ์ สมบัติ</option>
                  <option value="นายอัครพล มีอยู่">นายอัครพล มีอยู่</option>
                  <option value="นางสาวมณีวงศ์ สำราญ">นางสาวมณีวงศ์ สำราญ</option>
                </select>
                <span className="report-select-arrow">
                  <ChevronDown size={16} />
                </span>
              </div>
            </div>

            <button type="submit" className="btn-report-search" id="btn-report-search">
              ค้นหา
            </button>
          </form>

          {/* Department Leave Summary Table */}
          <div className="dept-table-card">
            <table className="dept-summary-table" aria-label="ตารางสถิติการลาแยกตามแผนก">
              <thead>
                <tr>
                  <th style={{ width: '33.33%' }}>แผนก</th>
                  <th style={{ width: '33.33%' }}>จำนวนครั้ง</th>
                  <th style={{ width: '33.33%' }}>จำนวนวัน</th>
                </tr>
              </thead>
              <tbody>
                {departmentRows.map((row) => (
                  <tr key={`dept-${row.dept}`}>
                    <td>{row.dept}</td>
                    <td>{row.count}</td>
                    <td>{row.days}</td>
                  </tr>
                ))}
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
