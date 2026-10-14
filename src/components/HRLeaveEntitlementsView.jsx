import { useMemo, useState } from 'react';
import { Search, Pencil, Check, X } from 'lucide-react';

const initialEmployees = [
    {
        id: 'EMP001',
        name: 'สมชาย ใจดี',
        department: 'IT',
        sick: 30,
        personal: 7,
        vacation: 6,
    },
    {
        id: 'EMP002',
        name: 'สมหญิง รักงาน',
        department: 'HR',
        sick: 30,
        personal: 7,
        vacation: 10,
    },
    {
        id: 'EMP003',
        name: 'อนันต์ ขยันดี',
        department: 'บัญชี',
        sick: 30,
        personal: 7,
        vacation: 6,
    },
];

const leaveFields = [
    { key: 'sick', label: 'ลาป่วย' },
    { key: 'personal', label: 'ลากิจ' },
    { key: 'vacation', label: 'ลาพักร้อน' },
];

export default function HRLeaveEntitlementsView() {
    const [employees, setEmployees] = useState(initialEmployees);
    const [searchText, setSearchText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    // ค้นหาจากรหัส ชื่อ หรือแผนก
    const filteredEmployees = useMemo(() => {
        const query = searchText.trim().toLowerCase();

        return employees.filter((employee) =>
            [
                employee.id,
                employee.name,
                employee.department,
            ].some((value) =>
                String(value).toLowerCase().includes(query)
            )
        );
    }, [employees, searchText]);

    // เริ่มแก้ไขข้อมูลพนักงาน
    const startEdit = (employee) => {
        setEditingId(employee.id);
        setEditValues({
            sick: String(employee.sick),
            personal: String(employee.personal),
            vacation: String(employee.vacation),
        });
    };

    // บันทึกจำนวนวันลา
    const saveEdit = (id) => {
        const values = {};

        for (const field of leaveFields) {
            const rawValue = editValues[field.key];

            if (
                rawValue === '' ||
                !Number.isFinite(Number(rawValue)) ||
                Number(rawValue) < 0
            ) {
                alert('กรุณากรอกจำนวนวันลาเป็นตัวเลขตั้งแต่ 0 ขึ้นไป');
                return;
            }

            values[field.key] = Number(rawValue);
        }

        setEmployees((prev) =>
            prev.map((employee) =>
                employee.id === id
                    ? { ...employee, ...values }
                    : employee
            )
        );

        setEditingId(null);
        setEditValues({});
    };

    // ยกเลิกการแก้ไข
    const cancelEdit = () => {
        setEditingId(null);
        setEditValues({});
    };

    return (
        <div className="supervisor-page hr-leave-entitlements-page">
            <div className="supervisor-page-heading">
                <div>
                    <h2>จัดการสิทธิ์การลา</h2>
                    <p>ตรวจสอบและกำหนดจำนวนวันลาของพนักงานแต่ละคน</p>
                </div>
            </div>

            {/* สรุปข้อมูล */}
            <div className="supervisor-summary-grid">
                <div className="supervisor-summary-card">
                    <span>พนักงานทั้งหมด</span>
                    <h3>{employees.length}</h3>
                </div>

                <div className="supervisor-summary-card">
                    <span>ประเภทสิทธิ์การลา</span>
                    <h3>{leaveFields.length}</h3>
                </div>

                <div className="supervisor-summary-card">
                    <span>ผลการค้นหา</span>
                    <h3>{filteredEmployees.length}</h3>
                </div>
            </div>

            {/* ตารางสิทธิ์วันลา */}
            <div className="supervisor-panel">
                <div className="supervisor-panel-heading">
                    <h3>สิทธิ์วันลารายบุคคล</h3>
                </div>

                <div className="supervisor-filter-bar hr-entitlement-filter">
                    <div className="supervisor-search-field">
                        <Search size={18} />

                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="ค้นหาชื่อ รหัสพนักงาน หรือแผนก..."
                            aria-label="ค้นหาพนักงาน"
                        />

                        {searchText && (
                            <button
                                type="button"
                                onClick={() => setSearchText('')}
                                title="ล้างคำค้นหา"
                                aria-label="ล้างคำค้นหา"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="supervisor-table-wrap">
                    <table className="supervisor-table">
                        <thead>
                            <tr>
                                <th>รหัสพนักงาน</th>
                                <th>ชื่อพนักงาน</th>
                                <th>แผนก</th>

                                {leaveFields.map((field) => (
                                    <th key={field.key}>
                                        {field.label}
                                    </th>
                                ))}

                                <th>จัดการ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredEmployees.map((employee) => {
                                const isEditing =
                                    editingId === employee.id;

                                return (
                                    <tr key={employee.id}>
                                        <td>{employee.id}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.department}</td>

                                        {leaveFields.map((field) => (
                                            <td key={field.key}>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={
                                                            editValues[field.key] ?? ''
                                                        }
                                                        onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev,
                                                                [field.key]:
                                                                    e.target.value,
                                                            }))
                                                        }
                                                        style={{ width: 75 }}
                                                        aria-label={
                                                            `${field.label} ${employee.name}`
                                                        }
                                                    />
                                                ) : (
                                                    `${employee[field.key]} วัน`
                                                )}
                                            </td>
                                        ))}

                                        <td>
                                            {isEditing ? (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: 8,
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            saveEdit(employee.id)
                                                        }
                                                        title="บันทึก"
                                                        aria-label="บันทึก"
                                                    >
                                                        <Check size={18} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        title="ยกเลิก"
                                                        aria-label="ยกเลิก"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        startEdit(employee)
                                                    }
                                                >
                                                    <Pencil size={16} /> แก้ไข
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4 + leaveFields.length}
                                        style={{
                                            textAlign: 'center',
                                            padding: 24,
                                        }}
                                    >
                                        ไม่พบข้อมูลพนักงาน
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <p
                style={{
                    marginTop: 12,
                    color: '#64748b',
                    fontSize: 13,
                }}
            >
                * ข้อมูลตัวอย่างสำหรับทดสอบหน้าเว็บ ยังไม่ได้เชื่อมต่อฐานข้อมูลจริง
            </p>
        </div>
    );
}
