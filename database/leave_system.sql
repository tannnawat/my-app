-- ====================================================================
-- ระบบการลา (Leave Management System) - PostgreSQL Version
-- Database Name: leave_system
-- DBMS: PostgreSQL 15 / 16 (UTF-8 Compatible)
-- Course / Project: System Analysis and Design (SA)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. ตาราง roles (บทบาทและสิทธิ์การใช้งานในระบบ)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS approval_history CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS leave_quotas CASCADE;
DROP TABLE IF EXISTS leave_types CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS positions CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  role_title_th VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE roles IS 'ตารางบทบาทและสิทธิ์การใช้งาน';
COMMENT ON COLUMN roles.role_name IS 'ชื่อสิทธิ์ เช่น EMPLOYEE, SUPERVISOR, HR, ADMIN';
COMMENT ON COLUMN roles.role_title_th IS 'ชื่อภาษาไทย เช่น พนักงาน, หัวหน้างาน, เจ้าหน้าที่ HR';

-- --------------------------------------------------------------------
-- 2. ตาราง departments (แผนก / ฝ่าย)
-- --------------------------------------------------------------------
CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  department_code VARCHAR(20) NOT NULL UNIQUE,
  department_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE departments IS 'ตารางแผนกในองค์กร';
COMMENT ON COLUMN departments.department_code IS 'รหัสแผนก เช่น DEPT-01, IT, HR';

-- --------------------------------------------------------------------
-- 3. ตาราง positions (ตำแหน่งงาน)
-- --------------------------------------------------------------------
CREATE TABLE positions (
  position_id SERIAL PRIMARY KEY,
  department_id INT NOT NULL REFERENCES departments(department_id) ON DELETE CASCADE,
  position_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE positions IS 'ตารางตำแหน่งงาน';

-- --------------------------------------------------------------------
-- 4. ตาราง employees (ข้อมูลพนักงานและผู้ใช้งานระบบ)
-- --------------------------------------------------------------------
CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  emp_code VARCHAR(20) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  prefix VARCHAR(20) DEFAULT 'นาย',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  department_id INT NOT NULL REFERENCES departments(department_id),
  position_id INT NOT NULL REFERENCES positions(position_id),
  role_id INT NOT NULL REFERENCES roles(role_id),
  supervisor_id INT REFERENCES employees(employee_id) ON DELETE SET NULL,
  hire_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'RESIGNED')),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE employees IS 'ตารางข้อมูลพนักงานและบัญชีผู้ใช้';
COMMENT ON COLUMN employees.emp_code IS 'รหัสพนักงาน เช่น EMP-0042';

-- --------------------------------------------------------------------
-- 5. ตาราง leave_types (ประเภทการลา)
-- --------------------------------------------------------------------
CREATE TABLE leave_types (
  leave_type_id SERIAL PRIMARY KEY,
  type_code VARCHAR(20) NOT NULL UNIQUE,
  type_name VARCHAR(50) NOT NULL,
  default_days_per_year NUMERIC(5,1) NOT NULL DEFAULT 0.0,
  is_paid BOOLEAN DEFAULT TRUE,
  require_attachment BOOLEAN DEFAULT FALSE,
  color_code VARCHAR(10) NOT NULL DEFAULT '#2563eb',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE leave_types IS 'ตารางประเภทการลาและเงื่อนไข';

-- --------------------------------------------------------------------
-- 6. ตาราง leave_quotas (สิทธิ์วันลาและวันลาคงเหลือประจำปี)
-- --------------------------------------------------------------------
CREATE TABLE leave_quotas (
  quota_id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  leave_type_id INT NOT NULL REFERENCES leave_types(leave_type_id) ON DELETE CASCADE,
  fiscal_year INT NOT NULL,
  total_allowed NUMERIC(5,1) NOT NULL,
  used_days NUMERIC(5,1) NOT NULL DEFAULT 0.0,
  remaining_days NUMERIC(5,1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_emp_type_year UNIQUE (employee_id, leave_type_id, fiscal_year)
);

COMMENT ON TABLE leave_quotas IS 'ตารางสิทธิ์วันลาและวันคงเหลือประจำปี';

-- --------------------------------------------------------------------
-- 7. ตาราง leave_requests (คำขอลาของพนักงาน)
-- --------------------------------------------------------------------
CREATE TABLE leave_requests (
  request_id SERIAL PRIMARY KEY,
  request_no VARCHAR(30) NOT NULL UNIQUE,
  employee_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  leave_type_id INT NOT NULL REFERENCES leave_types(leave_type_id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count NUMERIC(4,1) NOT NULL,
  reason TEXT NOT NULL,
  attachment_file VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
  approver_id INT REFERENCES employees(employee_id) ON DELETE SET NULL,
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE leave_requests IS 'ตารางคำขออนุมัติการลา';

-- --------------------------------------------------------------------
-- 8. ตาราง approval_history (ประวัติการดำเนินการ / Audit Log)
-- --------------------------------------------------------------------
CREATE TABLE approval_history (
  history_id SERIAL PRIMARY KEY,
  request_id INT NOT NULL REFERENCES leave_requests(request_id) ON DELETE CASCADE,
  action_by INT NOT NULL REFERENCES employees(employee_id),
  action_status VARCHAR(20) NOT NULL CHECK (action_status IN ('SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE approval_history IS 'ตารางบันทึกประวัติการพิจารณาอนุมัติ';

-- --------------------------------------------------------------------
-- 9. ตาราง notifications (ระบบแจ้งเตือนผลและสถานะ)
-- --------------------------------------------------------------------
CREATE TABLE notifications (
  notification_id SERIAL PRIMARY KEY,
  recipient_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  request_id INT REFERENCES leave_requests(request_id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  notif_type VARCHAR(20) NOT NULL CHECK (notif_type IN ('SUBMITTED', 'APPROVED', 'REJECTED', 'REMINDER')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE notifications IS 'ตารางการแจ้งเตือนผู้ใช้งาน';

-- ====================================================================
-- SEED DATA (ข้อมูลเริ่มต้นและตัวอย่างตามหน้าจอระบบ)
-- ====================================================================

-- 1. ข้อมูล Roles
INSERT INTO roles (role_id, role_name, role_title_th, description) VALUES
(1, 'EMPLOYEE', 'พนักงาน', 'สิทธิ์ยื่นคำขอลา ดูประวัติ สิทธิ์วันลา ปฏิทิน และรายงาน'),
(2, 'SUPERVISOR', 'หัวหน้างาน', 'สิทธิ์ตรวจสอบและพิจารณาอนุมัติคำขอลาของผู้ใต้บังคับบัญชา'),
(3, 'HR', 'เจ้าหน้าที่ HR', 'สิทธิ์จัดการข้อมูลสิทธิ์การลา ภาพรวมองค์กร และสรุปรายงาน'),
(4, 'ADMIN', 'ผู้ดูแลระบบ', 'สิทธิ์ดูแลจัดการระบบและกำหนดค่าผู้ใช้งานทั้งหมด');

-- 2. ข้อมูล แผนก (Departments)
INSERT INTO departments (department_id, department_code, department_name) VALUES
(1, 'DEPT-01', 'ฝ่ายพัฒนาเทคโนโลยีสารสนเทศ (IT)'),
(2, 'DEPT-02', 'ฝ่ายบัญชีและการเงิน (Accounting & Finance)'),
(3, 'DEPT-03', 'ฝ่ายการตลาดและประชาสัมพันธ์ (Marketing)'),
(4, 'DEPT-04', 'ฝ่ายจัดซื้อและคลังสินค้า (Procurement & Warehouse)'),
(5, 'DEPT-05', 'ฝ่ายทรัพยากรบุคคล (HR)');

-- 3. ข้อมูล ตำแหน่ง (Positions)
INSERT INTO positions (position_id, department_id, position_name) VALUES
(1, 1, 'นักพัฒนาระบบ (Software Engineer)'),
(2, 1, 'หัวหน้าฝ่ายพัฒนาเทคโนโลยีสารสนเทศ'),
(3, 2, 'เจ้าหน้าที่บัญชีอาวุโส'),
(4, 3, 'ผู้เชี่ยวชาญด้านการตลาดดิจิทัล'),
(5, 4, 'เจ้าหน้าที่ประสานงานคลังสินค้า'),
(6, 5, 'เจ้าหน้าที่สรรหาบุคลากร');

-- 4. ข้อมูล ประเภทการลา (Leave Types)
INSERT INTO leave_types (leave_type_id, type_code, type_name, default_days_per_year, is_paid, require_attachment, color_code, description) VALUES
(1, 'SICK', 'ลาป่วย', 30.0, TRUE, TRUE, '#52c41a', 'สิทธิ์ 30 วันทำงาน/ปี หากลาติดต่อกันตั้งแต่ 3 วันขึ้นไปต้องแนบใบรับรองแพทย์'),
(2, 'BUSINESS', 'ลากิจ', 6.0, TRUE, FALSE, '#f59e0b', 'สิทธิ์ 6 วันทำงาน/ปี เพื่อทำธุระจำเป็น ต้องยื่นขอล่วงหน้า'),
(3, 'VACATION', 'ลาพักร้อน', 10.0, TRUE, FALSE, '#f87171', 'สิทธิ์ 10 วันทำงาน/ปี สำหรับพนักงานประจำที่ผ่านทดลองงาน'),
(4, 'MATERNITY', 'ลาคลอด', 98.0, TRUE, TRUE, '#d946ef', 'สิทธิ์ลาเพื่อคลอดบุตรไม่เกิน 98 วันตามกฎหมายแรงงาน'),
(5, 'OTHER', 'อื่นๆ', 10.0, TRUE, FALSE, '#22d3ee', 'ลาเพื่อฝึกอบรมสัมมนา หรือลาอื่นๆ ตามระเบียบข้อบังคับ');

-- 5. ข้อมูล พนักงาน (Employees)
INSERT INTO employees (employee_id, emp_code, username, password_hash, prefix, first_name, last_name, email, phone, department_id, position_id, role_id, supervisor_id, hire_date, status) VALUES
(1, 'EMP-0042', 'yutthasak.m', '$2y$10$abcdefghijklmnopqrstuvw123456', 'นาย', 'ยุทธศักดิ์', 'มีดาบ', 'yutthasak.m@company.com', '081-234-5678', 1, 1, 1, 2, '2023-01-15', 'ACTIVE'),
(2, 'EMP-0010', 'somchai.it', '$2y$10$abcdefghijklmnopqrstuvw123456', 'นาย', 'สมชาย', 'สายเทค', 'somchai.s@company.com', '089-999-8888', 1, 2, 2, NULL, '2020-05-01', 'ACTIVE'),
(3, 'EMP-0102', 'adisorn.s', '$2y$10$abcdefghijklmnopqrstuvw123456', 'นาย', 'อดิสรณ์', 'สมบัติ', 'adisorn.s@company.com', '082-111-2222', 2, 3, 1, 2, '2022-03-10', 'ACTIVE'),
(4, 'EMP-0118', 'akkarapol.m', '$2y$10$abcdefghijklmnopqrstuvw123456', 'นาย', 'อัครพล', 'มีอยู่', 'akkarapol.m@company.com', '083-222-3333', 3, 4, 1, 2, '2022-07-20', 'ACTIVE'),
(5, 'EMP-0145', 'maneevong.s', '$2y$10$abcdefghijklmnopqrstuvw123456', 'นางสาว', 'มณีวงศ์', 'สำราญ', 'maneevong.s@company.com', '084-333-4444', 1, 1, 1, 2, '2024-02-01', 'ACTIVE'),
(6, 'EMP-0089', 'biwpol.c', '$2y$10$abcdefghijklmnopqrstuvw123456', 'นาย', 'บิวพล', 'เชิญยิ้ม', 'biwpol.c@company.com', '085-444-5555', 4, 5, 1, 2, '2021-11-15', 'ACTIVE'),
(7, 'EMP-0062', 'surureerat.k', '$2y$10$abcdefghijklmnopqrstuvw123456', 'นางสาว', 'สุรุรีรัตน์', 'กลิ่นหอม', 'surureerat.k@company.com', '086-555-6666', 5, 6, 3, 2, '2021-08-01', 'ACTIVE');

-- 6. ข้อมูล สิทธิ์วันลาประจำปี 2569 ของ ยุทธศักดิ์ มีดาบ (EMP-0042)
INSERT INTO leave_quotas (employee_id, leave_type_id, fiscal_year, total_allowed, used_days, remaining_days) VALUES
(1, 1, 2569, 30.0, 25.0, 5.0),   -- ลาป่วย: สิทธิ์ 30, ใช้ 25, เหลือ 5 วัน
(1, 2, 2569, 6.0,  3.0,  3.0),   -- ลากิจ: สิทธิ์ 6, ใช้ 3, เหลือ 3 วัน
(1, 3, 2569, 10.0, 0.0,  10.0),  -- ลาพักร้อน: สิทธิ์ 10, ใช้ 0, เหลือ 10 วัน
(1, 4, 2569, 0.0,  0.0,  0.0),   -- ลาคลอด: สิทธิ์ 0, เหลือ 0 วัน
(1, 5, 2569, 10.0, 4.0,  6.0);   -- อื่นๆ: สิทธิ์ 10, ใช้ 4, เหลือ 6 วัน

-- 7. ข้อมูล คำขอลา (Leave Requests)
INSERT INTO leave_requests (request_id, request_no, employee_id, leave_type_id, start_date, end_date, days_count, reason, attachment_file, status, approver_id, approved_at, rejection_reason, created_at) VALUES
(1, 'LV-2569-001', 1, 2, '2026-02-06', '2026-02-06', 1.0, 'ติดต่อทำธุรกรรมทางราชการ ณ สำนักงานที่ดิน', NULL, 'APPROVED', 2, '2026-02-05 10:00:00', NULL, '2026-02-04 11:20:00'),
(2, 'LV-2569-002', 1, 3, '2026-02-11', '2026-02-11', 1.0, 'พักผ่อนประจำปี', NULL, 'APPROVED', 2, '2026-02-10 09:30:00', NULL, '2026-02-08 14:15:00'),
(3, 'LV-2569-003', 1, 1, '2026-02-16', '2026-02-16', 1.0, 'มีไข้หวัดและปวดศีรษะ พบแพทย์ตามนัดหมาย', 'Medical_Cert_Yutthasak.pdf', 'APPROVED', 2, '2026-02-16 09:00:00', NULL, '2026-02-15 08:30:00'),
(4, 'LV-2569-004', 1, 5, '2026-02-22', '2026-02-22', 1.0, 'เข้าร่วมสัมมนาการใช้งานระบบความปลอดภัยทางไซเบอร์', 'Seminar_Cert.pdf', 'APPROVED', 2, '2026-02-20 15:30:00', NULL, '2026-02-18 16:00:00'),
(5, 'LV-2569-005', 1, 4, '2026-02-27', '2026-02-27', 1.0, 'นัดตรวจสุขภาพครรภ์ที่โรงพยาบาล', 'Maternity_Note.pdf', 'APPROVED', 2, '2026-02-26 11:00:00', NULL, '2026-02-24 10:00:00'),
(6, 'LV-2569-006', 3, 1, '2026-10-08', '2026-10-09', 2.0, 'มีอาการท้องร่วงและเป็นไข้สูง แพทย์สั่งให้หยุดพักรักษาตัว', 'Medical_Cert_Adisorn.pdf', 'APPROVED', 2, '2026-10-08 09:00:00', NULL, '2026-10-07 16:30:00'),
(7, 'LV-2569-007', 4, 1, '2026-10-10', '2026-10-11', 2.0, 'ปวดศีรษะไมเกรนเฉียบพลันและสายตาพร่ามัว', 'Doctor_Note_Akkarapol.pdf', 'APPROVED', 2, '2026-10-10 10:15:00', NULL, '2026-10-09 18:15:00'),
(8, 'LV-2569-008', 5, 2, '2026-10-12', '2026-10-12', 1.0, 'ต้องไปติดต่อทำธุรกรรมโอนกรรมสิทธิ์ที่ดิน ณ สำนักงานที่ดิน', 'Land_Appointment_Doc.pdf', 'PENDING', NULL, NULL, NULL, '2026-10-11 09:20:00'),
(9, 'LV-2569-009', 6, 3, '2026-10-15', '2026-10-19', 5.0, 'เดินทางท่องเที่ยวพักผ่อนประจำปีต่างจังหวัดกับครอบครัว', NULL, 'REJECTED', 2, '2026-10-11 11:00:00', 'ช่วงเวลาดังกล่าวมีงานตรวจนับสต็อกประจำไตรมาส (Quarterly Audit) จึงไม่สามารถอนุมัติได้ในสัปดาห์นี้', '2026-10-10 14:00:00'),
(10, 'LV-2569-010', 7, 4, '2026-10-20', '2026-10-25', 6.0, 'เตรียมตัวคลอดบุตรและพักฟื้นตามสิทธิ์การลาคลอดบุตร', 'Hospital_Maternity_Cert.pdf', 'APPROVED', 2, '2026-10-07 14:00:00', NULL, '2026-10-06 11:45:00');

-- 8. ข้อมูล ประวัติการอนุมัติ (Approval History)
INSERT INTO approval_history (history_id, request_id, action_by, action_status, comment, created_at) VALUES
(1, 1, 1, 'SUBMITTED', 'ยื่นคำขอลากิจ', '2026-02-04 11:20:00'),
(2, 1, 2, 'APPROVED', 'อนุมัติคำขอ', '2026-02-05 10:00:00'),
(3, 8, 5, 'SUBMITTED', 'ยื่นคำขอลากิจ รอการตรวจสอบ', '2026-10-11 09:20:00'),
(4, 9, 6, 'SUBMITTED', 'ยื่นคำขอลาพักร้อน', '2026-10-10 14:00:00'),
(5, 9, 2, 'REJECTED', 'ไม่อนุมัติเนื่องจากติดงานตรวจนับสต็อกประจำไตรมาส', '2026-10-11 11:00:00');

-- 9. ข้อมูล การแจ้งเตือน (Notifications)
INSERT INTO notifications (notification_id, recipient_id, request_id, title, message, notif_type, is_read, created_at) VALUES
(1, 1, 3, 'แจ้งผลอนุมัติคำขอลาป่วย', 'คำขอลาป่วย วันที่ 16 ก.พ. 2569 ได้รับการอนุมัติแล้ว', 'APPROVED', TRUE, '2026-02-16 09:05:00'),
(2, 1, 1, 'แจ้งผลอนุมัติคำขอลากิจ', 'คำขอลากิจ วันที่ 06 ก.พ. 2569 ได้รับการอนุมัติแล้ว', 'APPROVED', TRUE, '2026-02-05 10:05:00'),
(3, 2, 8, 'มีคำขอลาใหม่รอการตรวจสอบ', 'นางสาวมณีวงศ์ สำราญ ยื่นคำขอลากิจ 1 วัน รอให้ท่านตรวจสอบ', 'SUBMITTED', FALSE, '2026-10-11 09:25:00');

-- อัปเดต Sequences ให้ตรงกับจำนวนข้อมูลที่ INSERT ล่าสุด
SELECT setval('roles_role_id_seq', (SELECT MAX(role_id) FROM roles));
SELECT setval('departments_department_id_seq', (SELECT MAX(department_id) FROM departments));
SELECT setval('positions_position_id_seq', (SELECT MAX(position_id) FROM positions));
SELECT setval('employees_employee_id_seq', (SELECT MAX(employee_id) FROM employees));
SELECT setval('leave_types_leave_type_id_seq', (SELECT MAX(leave_type_id) FROM leave_types));
SELECT setval('leave_quotas_quota_id_seq', (SELECT MAX(quota_id) FROM leave_quotas));
SELECT setval('leave_requests_request_id_seq', (SELECT MAX(request_id) FROM leave_requests));
SELECT setval('approval_history_history_id_seq', (SELECT MAX(history_id) FROM approval_history));
SELECT setval('notifications_notification_id_seq', (SELECT MAX(notification_id) FROM notifications));
