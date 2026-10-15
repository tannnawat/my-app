import React, { useState } from 'react';
import { Calendar, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function LeaveRequestFormView({ onSubmitRequest, onNavigateToHistory }) {
  const [leaveType, setLeaveType] = useState('ลาป่วย');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Quota map for preview
  
// Quota map for preview
const quotaMap = {
  'ลาป่วย': 5,
  'ลากิจ': 3,
  'ลาพักร้อน': 10,
  'ลาคลอด': 0,
  'อื่นๆ': 6,

  // เพิ่มประเภทการลาใหม่
  'ลาป่วย (ต้องแนบหลักฐาน)': 5,
  'ลาคลอด (ต้องแนบหลักฐาน)': 90,
  'ลาอื่นๆ/ฝึกอบรม (ต้องแนบหลักฐาน)': 5
};

  

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('กรุณาระบุวันที่เริ่มต้นและสิ้นสุดการลา');
      return;
    }

    const newRequest = {
      id: Date.now(),
      name: 'นายยุทธศักดิ์ มีดาบ',
      empId: 'EMP-0042',
      department: 'ฝ่ายพัฒนาเทคโนโลยีสารสนเทศ',
      position: 'พนักงาน',
      leaveType,
      days: 1, // calculate or default
      startDate,
      endDate,
      status: 'รอการตรวจสอบ',
      reason,
      attachment: fileName || null,
      remainingQuota: `${quotaMap[leaveType] || 0} วัน`,
      requestDate: new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      approver: null
    };

    if (onSubmitRequest) {
      onSubmitRequest(newRequest);
    }
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="form-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <CheckCircle size={56} color="#16a34a" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '22px', color: '#166534', marginBottom: '8px' }}>ยื่นคำขอลาเรียบร้อยแล้ว</h2>
        <p style={{ color: '#4b5563', marginBottom: '24px' }}>
          คำขอของคุณถูกส่งไปยังหัวหน้างานเพื่อรอการตรวจสอบและอนุมัติแล้ว
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn-header-search"
            style={{ padding: '10px 20px' }}
            onClick={() => setIsSuccess(false)}
          >
            ยื่นคำขออื่นเพิ่มเติม
          </button>
          <button
            type="button"
            className="btn-reset-filter"
            style={{ padding: '10px 20px', borderColor: '#2563eb', color: '#2563eb' }}
            onClick={onNavigateToHistory}
          >
            ไปที่ประวัติคำขอลา
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a334e', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText size={22} color="#1f3e61" />
        แบบฟอร์มยื่นคำขอลา
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          {/* Leave Type */}
          <div className="form-group">
            <label htmlFor="form-leave-type">ประเภทการลา *</label>
            <select
              id="form-leave-type"
              className="form-control"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="ลาป่วย">ลาป่วย (สิทธิ์คงเหลือ: 5 วัน)</option>
              <option value="ลากิจ">ลากิจ (สิทธิ์คงเหลือ: 3 วัน)</option>
              <option value="ลาพักร้อน">ลาพักร้อน (สิทธิ์คงเหลือ: 10 วัน)</option>
              <option value="ลาคลอด">ลาคลอด (สิทธิ์คงเหลือ: 0 วัน)</option>
              <option value="อื่นๆ">อื่นๆ (สิทธิ์คงเหลือ: 6 วัน)</option>
            </select>
          </div>

          ```jsx
          {/* ประเภทการลา */}
          <div className="form-group">
            <label htmlFor="leaveType">
              ประเภทการลา <span style={{ color: '#dc2626' }}>*</span>
            </label>

            <select
              id="leaveType"
              name="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
              style={{
                width: '100%',
                height: '50px',
                padding: '0 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                backgroundColor: '#fff',
                color: '#334155',
                fontSize: '15px',
                outlineColor: '#647fc5',
                cursor: 'pointer'
              }}
            >
              <option value="">-- เลือกประเภทการลา --</option>
              <option value="ลาป่วย (ต้องแนบหลักฐาน)">
                ลาป่วย (ต้องแนบหลักฐาน)
              </option>
              <option value="ลากิจ">ลากิจ</option>
              <option value="ลาพักร้อน">ลาพักร้อน</option>
              <option value="ลาคลอด (ต้องแนบหลักฐาน)">
                ลาคลอด (ต้องแนบหลักฐาน)
              </option>
              <option value="ลาอื่นๆ/ฝึกอบรม (ต้องแนบหลักฐาน)">
                ลาอื่นๆ/ฝึกอบรม (ต้องแนบหลักฐาน)
              </option>
            </select>
          </div>
          ```
        </div>

        {/* Date Ranges */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="form-start-date">วันที่เริ่มลา *</label>
            <input
              type="date"
              id="form-start-date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="form-end-date">วันที่สิ้นสุดการลา *</label>
            <input
              type="date"
              id="form-end-date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Reason */}
        <div className="form-group" style={{ marginBottom: '18px' }}>
          <label htmlFor="form-reason">เหตุผลการลา *</label>
          <textarea
            id="form-reason"
            className="form-control"
            placeholder="โปรดระบุเหตุผลและรายละเอียดความจำเป็นในการลา..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        {/* File attachment */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label>แนบเอกสารประกอบ</label>
          <label className="file-upload-box" htmlFor="file-upload-input">
            <input
              type="file"
              id="file-upload-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Upload size={28} color="#557b9d" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '14px', color: '#334e68', fontWeight: 500 }}>
              {fileName ? `ไฟล์ที่เลือก: ${fileName}` : 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่'}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              รองรับไฟล์ PDF, JPG, PNG ขนาดไม่เกิน 10MB
            </div>
          </label>
        </div>

        {/* Submit button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            className="btn-action-cancel"
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setReason('');
              setFileName('');
            }}
          >
            ล้างข้อมูล
          </button>
          <button
            type="submit"
            className="btn-header-search"
            id="btn-submit-leave-request"
            style={{ padding: '0 28px', height: '44px' }}
          >
            ส่งคำขอลา
          </button>
        </div>
      </form>
    </div>
  );
}
