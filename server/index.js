
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool } from "./config/db.js";
import bcrypt from "bcryptjs";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "../dist");

app.use(cors());
app.use(express.json());

// ตรวจสอบว่า Backend ทำงานหรือไม่
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Leave System API is running",
    });
});

// ทดสอบการเชื่อมต่อ PostgreSQL
app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT current_database() AS database, NOW() AS server_time"
        );

        res.json({
            success: true,
            message: "PostgreSQL connected successfully",
            database: result.rows[0].database,
            serverTime: result.rows[0].server_time,
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
});

app.get("/api/employees", async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        employee_id,
        emp_code,
        username,
        prefix,
        first_name,
        last_name,
        email,
        phone,
        department_id,
        position_id,
        role_id,
        status
      FROM employees
      ORDER BY employee_id
    `);

        res.json({
            success: true,
            count: result.rowCount,
            employees: result.rows,
        });
    } catch (error) {
        console.error("Get employees failed:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve employees",
        });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (
            typeof identifier !== "string" ||
            typeof password !== "string" ||
            !identifier.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
            });
        }

        const result = await pool.query(
            `SELECT
         e.employee_id,
         e.emp_code,
         e.username,
         e.password_hash,
         e.prefix,
         e.first_name,
         e.last_name,
         e.email,
         e.status,
         r.role_name,
         r.role_title_th
       FROM employees e
       JOIN roles r ON e.role_id = r.role_id
       WHERE (
         LOWER(e.username) = LOWER($1)
         OR LOWER(e.emp_code) = LOWER($1)
         OR LOWER(e.email) = LOWER($1)
       )
       LIMIT 1`,
            [identifier.trim()]
        );

        const employee = result.rows[0];

        if (!employee || employee.status !== "ACTIVE") {
            return res.status(401).json({
                success: false,
                message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
            });
        }

        // รองรับ bcrypt hash ที่ขึ้นต้นด้วย $2y$
        const hash = employee.password_hash.replace(/^\$2y\$/, "$2b$");
        const passwordMatches = await bcrypt.compare(password, hash);

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
            });
        }

        const user = {
            id: employee.employee_id,
            empId: employee.emp_code,
            username: employee.username,
            email: employee.email,
            name: `${employee.prefix || ""}${employee.first_name} ${employee.last_name}`.trim(),
            firstName: employee.first_name,
            lastName: employee.last_name,
            role: employee.role_name.toLowerCase(),
            roleTitle: employee.role_title_th,
        };

        return res.json({
            success: true,
            message: "เข้าสู่ระบบสำเร็จ",
            user,
        });
    } catch (error) {
        console.error("Login failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        });
    }
});

app.post("/api/change-password", async (req, res) => {
    try {
        const { empCode, currentPassword, newPassword } = req.body;

        if (
            typeof empCode !== "string" ||
            typeof currentPassword !== "string" ||
            typeof newPassword !== "string" ||
            !empCode.trim() ||
            !currentPassword ||
            newPassword.length < 8 ||
            newPassword.length > 72
        ) {
            return res.status(400).json({
                success: false,
                message: "กรุณากรอกข้อมูลให้ถูกต้อง รหัสผ่านใหม่ต้องมี 8-72 ตัวอักษร",
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม",
            });
        }

        const result = await pool.query(
            `SELECT employee_id, password_hash, status
             FROM employees
             WHERE UPPER(emp_code) = UPPER($1)
             LIMIT 1`,
            [empCode.trim()]
        );

        const employee = result.rows[0];

        if (!employee || employee.status !== "ACTIVE") {
            return res.status(401).json({
                success: false,
                message: "ไม่พบบัญชีหรือบัญชีไม่สามารถใช้งานได้",
            });
        }

        const oldHash = employee.password_hash.replace(/^\$2y\$/, "$2b$");
        const matches = await bcrypt.compare(currentPassword, oldHash);

        if (!matches) {
            return res.status(401).json({
                success: false,
                message: "รหัสผ่านปัจจุบันไม่ถูกต้อง",
            });
        }

        const newHash = await bcrypt.hash(newPassword, 10);

        await pool.query(
            `UPDATE employees
             SET password_hash = $1
             WHERE employee_id = $2`,
            [newHash, employee.employee_id]
        );

        return res.json({
            success: true,
            message: "เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่",
        });
    } catch (error) {
        console.error("Change password failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
        });
    }
});


// ให้ Express ส่งไฟล์หน้าเว็บ React/Vite ที่ได้จาก npm run build
app.use(express.static(DIST_DIR));

// สำหรับเส้นทางหน้าเว็บอื่น ๆ ให้ React จัดการต่อ (SPA fallback)
app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
        return next();
    }

    res.sendFile(path.join(DIST_DIR, "index.html"), (error) => {
        if (error) next(error);
    });
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
