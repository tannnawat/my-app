-- ====================================================================
-- รวมคำสั่ง SQL Query (PostgreSQL Version)
-- สอดคล้องกับหน้าจอ UI ทั้ง 3 หน้าจอในระบบการลา
-- ====================================================================

-- ====================================================================
-- 1. หน้า "ปฏิทินวันลา / สิทธิ์คงเหลือ" (Calendar & Quotas View)
-- ====================================================================

-- 1.1 ดึงสิทธิ์วันลาและวันลาคงเหลือของพนักงาน (นายยุทธศักดิ์ EMP-0042 ปี 2569)
SELECT 
    lt.type_name AS "ประเภทการลา",
    lq.remaining_days AS "วันลาคงเหลือ",
    lq.used_days AS "ใช้ไปแล้ว",
    lq.total_allowed AS "สิทธิ์ทั้งหมด",
    lt.color_code AS "โค้ดสี"
FROM leave_quotas lq
JOIN leave_types lt ON lq.leave_type_id = lt.leave_type_id
WHERE lq.employee_id = 1 AND lq.fiscal_year = 2569
ORDER BY lt.leave_type_id ASC;

-- 1.2 ดึงรายการวันลาในเดือนกุมภาพันธ์ (เดือน 2 ปี 2026 / 2569) เพื่อปักหมุดสีในปฏิทิน
SELECT 
    lr.request_id,
    EXTRACT(DAY FROM lr.start_date) AS "วัน_เริ่ม",
    EXTRACT(DAY FROM lr.end_date) AS "วัน_สิ้นสุด",
    lt.type_name AS "ประเภทลา",
    lt.color_code AS "สี",
    lr.days_count AS "จำนวนวัน",
    lr.reason AS "เหตุผล",
    lr.status AS "สถานะ"
FROM leave_requests lr
JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id
WHERE lr.employee_id = 1 
  AND EXTRACT(MONTH FROM lr.start_date) = 2 
  AND EXTRACT(YEAR FROM lr.start_date) = 2026
  AND lr.status = 'APPROVED';

-- ====================================================================
-- 2. หน้า "สรุปรายงานการลา" (Summary Reports & Charts)
-- ====================================================================

-- 2.1 สถิติจำนวนวันลาแยกตามประเภท (ข้อมูลสำหรับกราฟแท่ง Bar Chart)
SELECT 
    lt.type_name AS "ประเภทการลา",
    COALESCE(SUM(lr.days_count), 0) AS "จำนวนวันลาสะสม",
    COUNT(lr.request_id) AS "จำนวนครั้ง",
    lt.color_code AS "สีแท่งกราฟ"
FROM leave_types lt
LEFT JOIN leave_requests lr 
    ON lt.leave_type_id = lr.leave_type_id 
    AND lr.status = 'APPROVED'
GROUP BY lt.leave_type_id, lt.type_name, lt.color_code
ORDER BY lt.leave_type_id;

-- 2.2 สรุปการลาแยกตามแผนก (สำหรับตารางฝั่งขวา: แผนก 1, 2, 3, 4)
SELECT 
    d.department_id AS "รหัสแผนก",
    d.department_name AS "ชื่อแผนก",
    COUNT(lr.request_id) AS "จำนวนครั้ง",
    COALESCE(SUM(lr.days_count), 0) AS "จำนวนวัน"
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
LEFT JOIN leave_requests lr ON e.employee_id = lr.employee_id AND lr.status = 'APPROVED'
WHERE d.department_id IN (1, 2, 3, 4)
GROUP BY d.department_id, d.department_name
ORDER BY d.department_id ASC;

-- ====================================================================
-- 3. หน้า "รายการรออนุมัติ" (Supervisor Approval List View)
-- ====================================================================

-- 3.1 ดึงรายการคำขอลาทั้งหมดที่แสดงในตารางรออนุมัติ
SELECT 
    lr.request_id AS "ลำดับ",
    CONCAT(e.first_name, ' ', e.last_name) AS "ชื่อ_สกุล",
    d.department_name AS "แผนก",
    lt.type_name AS "ประเภทลา",
    CONCAT(lr.days_count, ' วัน') AS "จำนวนวัน",
    TO_CHAR(lr.start_date, 'DD/MM/YYYY') AS "วันเริ่ม",
    TO_CHAR(lr.end_date, 'DD/MM/YYYY') AS "วันสิ้นสุด",
    CASE 
        WHEN lr.status = 'APPROVED' THEN 'อนุมัติ'
        WHEN lr.status = 'PENDING' THEN 'รอการตรวจสอบ'
        WHEN lr.status = 'REJECTED' THEN 'ไม่อนุมัติ'
        ELSE 'ยกเลิก'
    END AS "สถานะ",
    lr.attachment_file AS "เอกสารแนบ",
    lr.reason AS "เหตุผล"
FROM leave_requests lr
JOIN employees e ON lr.employee_id = e.employee_id
JOIN departments d ON e.department_id = d.department_id
JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id
ORDER BY lr.request_id ASC;

-- 3.2 หัวหน้างานกด "อนุมัติ" (Approve Leave Request) ใน PostgreSQL
-- ขั้นตอน 1: อัปเดตสถานะคำขอ
UPDATE leave_requests 
SET status = 'APPROVED', 
    approver_id = 2, 
    approved_at = NOW()
WHERE request_id = 8;

-- ขั้นตอน 2: หักจำนวนวันลาคงเหลือใน leave_quotas
UPDATE leave_quotas lq
SET used_days = lq.used_days + lr.days_count,
    remaining_days = lq.remaining_days - lr.days_count
FROM leave_requests lr
WHERE lq.employee_id = lr.employee_id 
  AND lq.leave_type_id = lr.leave_type_id
  AND lr.request_id = 8 
  AND lq.fiscal_year = 2569;

-- ขั้นตอน 3: ส่งการแจ้งเตือนไปยังพนักงาน
INSERT INTO notifications (recipient_id, request_id, title, message, notif_type)
VALUES (
    5, 
    8, 
    'แจ้งผลอนุมัติคำขอลากิจ', 
    'คำขอลากิจของคุณได้รับการอนุมัติเรียบร้อยแล้ว', 
    'APPROVED'
);
