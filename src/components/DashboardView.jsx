import React from 'react';
import { Calendar, PlusCircle, CheckCircle, Clock, FileText, ArrowRight } from 'lucide-react';

export default function DashboardView({ onNavigateTab }) {
  const quotas = [
    { type: 'ลาป่วย', remaining: 5, total: 30, color: 'var(--color-sick)' },
    { type: 'ลากิจ', remaining: 3, total: 6, color: 'var(--color-business)' },
    { type: 'ลาพักร้อน', remaining: 10, total: 10, color: 'var(--color-vacation)' },
    { type: 'ลาคลอด', remaining: 0, total: 98, color: 'var(--color-maternity)' },
    { type: 'อื่นๆ', remaining: 6, total: 10, color: 'var(--color-other)' },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1f3e61 0%, #2a527c 100%)',
        borderRadius: '12px',
        padding: '24px 30px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
            ยินดีต้อนรับ, คุณยุทธศักดิ์ มีดาบ
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '14.5px' }}>
            ระบบจัดการสิทธิ์และคำขอลาพนักงาน ประจำปี 2569
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('request')}
          style={{
            background: '#ffffff',
            color: '#1f3e61',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
          }}
        >
          <PlusCircle size={18} />
          ยื่นคำขอลาใหม่
        </button>
      </div>

      {/* Quota Overview Cards */}
      <div>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1a334e', marginBottom: '14px' }}>
          สิทธิ์วันลาคงเหลือของคุณ (ปี 2569)
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px'
        }}>
          {quotas.map((q) => (
            <div
              key={q.type}
              style={{
                background: '#ffffff',
                border: '1.5px solid #bed6e8',
                borderRadius: '10px',
                padding: '16px',
                borderTop: `4px solid ${q.color}`,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ fontSize: '13.5px', color: '#64748b', fontWeight: 500 }}>
                {q.type}
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#102a43', margin: '4px 0' }}>
                {q.remaining} <span style={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>วัน</span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                จากสิทธิ์ทั้งหมด {q.total} วัน
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #bed6e8',
            borderRadius: '10px',
            padding: '20px',
            cursor: 'pointer'
          }}
          onClick={() => onNavigateTab('calendar')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#102a43' }}>ปฏิทินวันลา / สิทธิ์คงเหลือ</h4>
            <Calendar size={22} color="#2563eb" />
          </div>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '14px' }}>
            ตรวจสอบวันที่ลาในแต่ละเดือน และจำนวนวันลาคงเหลือ
          </p>
          <span style={{ fontSize: '13.5px', color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            เปิดหน้าปฏิทิน <ArrowRight size={14} />
          </span>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #bed6e8',
            borderRadius: '10px',
            padding: '20px',
            cursor: 'pointer'
          }}
          onClick={() => onNavigateTab('reports')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#102a43' }}>รายงานสรุปการลา</h4>
            <FileText size={22} color="#2563eb" />
          </div>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '14px' }}>
            ดูสถิติการลาตามประเภทกราฟแท่ง และสถิติการลาแยกตามแผนก
          </p>
          <span style={{ fontSize: '13.5px', color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            เปิดหน้ารายงานสรุป <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
