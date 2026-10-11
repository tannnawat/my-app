// ข้อมูลบัญชีผู้ใช้งานระบบ (Default Users Data)
// คุณสามารถแก้ไข หรือเพิ่มรหัสพนักงาน (empId) และรหัสผ่าน (password) ได้ที่นี่โดยตรง

export const defaultUsers = [
  {
    id: 1,
    empId: 'EMP001',          // รหัสพนักงาน (ใช้เข้าสู่ระบบได้)
    altEmpId: 'EMP-0042',     // รหัสพนักงานทางเลือก
    username: 'employee',      // ชื่อผู้ใช้ (ใช้เข้าสู่ระบบได้)
    email: 'employee@company.com',
    password: '1234',         // รหัสผ่าน
    role: 'employee',         // บทบาท: employee (พนักงาน)
    roleTitleTh: 'พนักงาน',
    prefix: 'นาย',
    firstName: 'ยุทธศักดิ์',
    lastName: 'มีดาบ',
    name: 'นายยุทธศักดิ์ มีดาบ',
    department: 'ฝ่ายพัฒนาเทคโนโลยีสารสนเทศ (IT)',
    position: 'นักพัฒนาระบบ (Software Engineer)'
  },
  {
    id: 2,
    empId: 'SUP001',          // รหัสหัวหน้างาน (ใช้เข้าสู่ระบบได้)
    altEmpId: 'EMP-0010',     // รหัสพนักงานทางเลือก
    username: 'supervisor',    // ชื่อผู้ใช้ (ใช้เข้าสู่ระบบได้)
    email: 'supervisor@company.com',
    password: '1234',         // รหัสผ่าน
    role: 'supervisor',       // บทบาท: supervisor (หัวหน้างาน)
    roleTitleTh: 'หัวหน้างาน',
    prefix: 'นาย',
    firstName: 'สมชาย',
    lastName: 'สายเทค',
    name: 'นายสมชาย สายเทค',
    department: 'ฝ่ายพัฒนาเทคโนโลยีสารสนเทศ (IT)',
    position: 'หัวหน้าฝ่ายพัฒนาเทคโนโลยีสารสนเทศ'
  },
  {
    id: 3,
    empId: 'HR001',           // รหัสเจ้าหน้าที่ HR (ใช้เข้าสู่ระบบได้)
    altEmpId: 'EMP-0062',     // รหัสพนักงานทางเลือก
    username: 'hr',            // ชื่อผู้ใช้ (ใช้เข้าสู่ระบบได้)
    email: 'hr@company.com',
    password: '1234',         // รหัสผ่าน
    role: 'hr',               // บทบาท: hr (เจ้าหน้าที่ฝ่ายทรัพยากรบุคคล)
    roleTitleTh: 'เจ้าหน้าที่ HR',
    prefix: 'นางสาว',
    firstName: 'สุรุรีรัตน์',
    lastName: 'กลิ่นหอม',
    name: 'นางสาวสุรุรีรัตน์ กลิ่นหอม',
    department: 'ฝ่ายทรัพยากรบุคคล (HR)',
    position: 'เจ้าหน้าที่สรรหาบุคลากร (HR Specialist)'
  }
];

/**
 * ฟังก์ชันสำหรับตรวจสอบการเข้าสู่ระบบ
 * รองรับการค้นหาจาก empId, altEmpId, username หรือ email (ไม่สนตัวพิมพ์เล็กใหญ่)
 */
export function authenticateUser(identifier, password, userList = defaultUsers) {
  if (!identifier || !password) {
    return { success: false, message: 'กรุณากรอกรหัสพนักงาน/อีเมล และรหัสผ่าน' };
  }

  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = password.trim();

  const user = userList.find((u) => {
    return (
      u.empId.toLowerCase() === cleanId ||
      (u.altEmpId && u.altEmpId.toLowerCase() === cleanId) ||
      u.username.toLowerCase() === cleanId ||
      u.email.toLowerCase() === cleanId
    );
  });

  if (!user) {
    return { success: false, message: 'ไม่พบข้อมูลรหัสพนักงานหรืออีเมลนี้ในระบบ' };
  }

  if (user.password !== cleanPass) {
    return { success: false, message: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง' };
  }

  return { success: true, user };
}
