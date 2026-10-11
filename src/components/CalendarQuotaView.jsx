import React, { useState } from 'react';
import { ChevronDown, Calendar, Info, X } from 'lucide-react';

export default function CalendarQuotaView() {
  const [selectedMonth, setSelectedMonth] = useState('กุมภาพันธ์ 2569');
  const [activeDateModal, setActiveDateModal] = useState(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Leave quota data matching Image 1
  const quotaData = [
    { type: 'ลาป่วย', days: 5, colorClass: 'dot-sick' },
    { type: 'ลากิจ', days: 3, colorClass: 'dot-business' },
    { type: 'ลาพักร้อน', days: 10, colorClass: 'dot-vacation' },
    { type: 'ลาคลอด', days: 0, colorClass: 'dot-maternity' },
    { type: 'อื่นๆ', days: 6, colorClass: 'dot-other' },
  ];

  // Specific event dates in February 2569 as pictured in Image 1
  const leaveEvents = {
    6: {
      type: 'ลากิจ',
      class: 'cal-cell-event-business',
      color: '#f6ad55',
      title: 'ลากิจ (1 วัน)',
      desc: 'ติดต่อทำธุรกรรมทางราชการ ณ สำนักงานที่ดิน'
    },
    11: {
      type: 'ลาพักร้อน',
      class: 'cal-cell-event-vacation',
      color: '#f87171',
      title: 'ลาพักร้อน (1 วัน)',
      desc: 'พักผ่อนประจำปี'
    },
    16: {
      type: 'ลาป่วย',
      class: 'cal-cell-event-sick',
      color: '#6ee7b7',
      title: 'ลาป่วย (1 วัน)',
      desc: 'มีไข้หวัดและปวดศีรษะ พบแพทย์ตามนัดหมาย'
    },
    22: {
      type: 'อื่นๆ',
      class: 'cal-cell-event-other',
      color: '#2dd4bf',
      title: 'อื่นๆ (ลาฝึกอบรม 1 วัน)',
      desc: 'เข้าร่วมสัมมนาการใช้งานระบบความปลอดภัยทางไซเบอร์'
    },
    27: {
      type: 'ลาคลอด',
      class: 'cal-cell-event-maternity',
      color: '#e879f9',
      title: 'ลาคลอด (1 วัน)',
      desc: 'นัดตรวจสุขภาพครรภ์ที่โรงพยาบาล'
    }
  };

  // Calendar days 1 to 28 (February 2569 / 2026)
  // Grid layout for 4 weeks x 7 days = 28 days exactly as shown in the screenshot
  const weeks = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28]
  ];

  const handleCellClick = (day) => {
    if (leaveEvents[day]) {
      setActiveDateModal({
        day,
        ...leaveEvents[day]
      });
    }
  };

  return (
    <div className="calendar-page-layout">
      {/* Main Calendar Section (Left) */}
      <section className="calendar-main-section">
        {/* Top bar with Month Dropdown & Color Legends */}
        <div className="calendar-top-bar">
          <button
            type="button"
            className="month-dropdown-btn"
            id="month-selector-btn"
            onClick={() => {
              const months = ['มกราคม 2569', 'กุมภาพันธ์ 2569', 'มีนาคม 2569', 'เมษายน 2569'];
              const nextIndex = (months.indexOf(selectedMonth) + 1) % months.length;
              setSelectedMonth(months[nextIndex]);
            }}
          >
            <span>{selectedMonth}</span>
            <ChevronDown size={17} />
          </button>

          {/* Color Legends */}
          <div className="calendar-legend-group">
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
        </div>

        {/* Calendar Grid Table matching Image 1 */}
        <div className="calendar-table-card">
          <table className="calendar-grid-table" aria-label="ปฏิทินวันลา กุมภาพันธ์ 2569">
            <thead>
              <tr>
                <th>อา</th>
                <th>จ</th>
                <th>อ</th>
                <th>พ</th>
                <th>พฤ</th>
                <th>ศ</th>
                <th>ส</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wIndex) => (
                <tr key={`week-${wIndex}`}>
                  {week.map((day) => {
                    const event = leaveEvents[day];
                    return (
                      <td
                        key={`day-${day}`}
                        id={`cal-day-${day}`}
                        className={event ? event.class : ''}
                        onClick={() => handleCellClick(day)}
                        title={event ? `${day} ก.พ.: ${event.title}` : `${day} กุมภาพันธ์`}
                      >
                        {day}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Right Sidebar Section */}
      <aside className="calendar-sidebar">
        {/* Card 1: วันลาคงเหลือ */}
        <div className="sidebar-info-card" id="card-remaining-quota">
          <h2 className="sidebar-card-title">วันลาคงเหลือ</h2>
          <div className="quota-list">
            {quotaData.map((item) => (
              <div key={item.type} className="quota-row">
                <span className="quota-type-label">
                  <span className={`legend-dot ${item.colorClass}`} />
                  {item.type}
                </span>
                <span className="quota-value">{item.days} วัน</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: ประเภทการลา */}
        <div className="sidebar-info-card" id="card-leave-types">
          <h2 className="sidebar-card-title">ประเภทการลา</h2>
          <div className="leave-types-grid">
            <div>ลาป่วย</div>
            <div>ลากิจ</div>
            <div>ลาพักร้อน</div>
            <div>ลาคลอด</div>
            <div>อื่นๆ</div>
          </div>
          <a
            href="#policy"
            className="view-all-link"
            onClick={(e) => {
              e.preventDefault();
              setShowPolicyModal(true);
            }}
          >
            ดูรายละเอียดทั้งหมด
          </a>
        </div>
      </aside>

      {/* Date Event Detail Modal */}
      {activeDateModal && (
        <div className="modal-backdrop" onClick={() => setActiveDateModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header" style={{ backgroundColor: '#1e3a5f' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} />
                <h3>รายละเอียดวันลา: วันที่ {activeDateModal.day} {selectedMonth}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveDateModal(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span
                  style={{
                    backgroundColor: activeDateModal.color,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                >
                  {activeDateModal.type}
                </span>
                <strong style={{ fontSize: '15px' }}>{activeDateModal.title}</strong>
              </div>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                <strong>รายละเอียด/เหตุผล:</strong> {activeDateModal.desc}
              </p>
              <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
                สถานะ: <span style={{ color: '#16a34a', fontWeight: 600 }}>อนุมัติแล้ว</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Policy Modal */}
      {showPolicyModal && (
        <div className="modal-backdrop" onClick={() => setShowPolicyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={18} />
                <h3>สิทธิ์และระเบียบประเภทการลา</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowPolicyModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div style={{ borderLeft: '3px solid var(--color-sick)', paddingLeft: '10px' }}>
                  <strong>1. ลาป่วย (Sick Leave)</strong>
                  <p style={{ color: '#64748b', marginTop: '2px' }}>
                    สิทธิ์ 30 วันทำงาน/ปี โดยได้รับค่าจ้าง หากลาป่วยติดต่อกันตั้งแต่ 3 วันทำงานขึ้นไป ต้องแนบใบรับรองแพทย์
                  </p>
                </div>
                <div style={{ borderLeft: '3px solid var(--color-business)', paddingLeft: '10px' }}>
                  <strong>2. ลากิจ (Business Leave)</strong>
                  <p style={{ color: '#64748b', marginTop: '2px' }}>
                    สิทธิ์ 6 วันทำงาน/ปี เพื่อทำธุระส่วนตัวอันจำเป็น โดยต้องยื่นขอล่วงหน้าอย่างน้อย 1 วันทำการ
                  </p>
                </div>
                <div style={{ borderLeft: '3px solid var(--color-vacation)', paddingLeft: '10px' }}>
                  <strong>3. ลาพักร้อน (Vacation Leave)</strong>
                  <p style={{ color: '#64748b', marginTop: '2px' }}>
                    สิทธิ์ 10 วันทำงาน/ปี (สำหรับพนักงานที่ผ่านการทดลองงานครบ 1 ปีขึ้นไป)
                  </p>
                </div>
                <div style={{ borderLeft: '3px solid var(--color-maternity)', paddingLeft: '10px' }}>
                  <strong>4. ลาคลอด (Maternity Leave)</strong>
                  <p style={{ color: '#64748b', marginTop: '2px' }}>
                    สิทธิ์ลาเพื่อคลอดบุตรได้ไม่เกิน 98 วัน โดยได้รับค่าจ้างตามกฎหมายแรงงาน
                  </p>
                </div>
                <div style={{ borderLeft: '3px solid var(--color-other)', paddingLeft: '10px' }}>
                  <strong>5. อื่นๆ (Other Leave)</strong>
                  <p style={{ color: '#64748b', marginTop: '2px' }}>
                    เช่น ลาเพื่อฝึกอบรมสัมมนา, ลาเพื่อทำหมัน, ลารับราชการทหาร ตามระเบียบข้อบังคับบริษัท
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
