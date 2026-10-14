
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const initialTypes = [
    { id: 1, name: 'ลาป่วย', days: 30, paid: true, active: true },
    { id: 2, name: 'ลากิจ', days: 7, paid: true, active: true },
    { id: 3, name: 'ลาพักร้อน', days: 6, paid: true, active: true },
    { id: 4, name: 'ลาคลอด', days: 98, paid: true, active: true },
    { id: 5, name: 'ลาไม่รับค่าจ้าง', days: 0, paid: false, active: true },
];

export default function HRLeaveTypesView() {
    const [types, setTypes] = useState(initialTypes);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        name: '',
        days: 1,
        paid: true,
    });

    const openAddForm = () => {
        setEditingId(null);
        setForm({ name: '', days: 1, paid: true });
        setShowForm(true);
    };

    const openEditForm = (item) => {
        setEditingId(item.id);
        setForm({
            name: item.name,
            days: item.days,
            paid: item.paid,
        });
        setShowForm(true);
    };

    const saveType = (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert('กรุณากรอกชื่อประเภทการลา');
            return;
        }

        const duplicate = types.some(
            (item) =>
                item.name.trim().toLowerCase() ===
                form.name.trim().toLowerCase() &&
                item.id !== editingId
        );

        if (duplicate) {
            alert('มีประเภทการลานี้แล้ว');
            return;
        }

        if (editingId !== null) {
            setTypes((prev) =>
                prev.map((item) =>
                    item.id === editingId
                        ? { ...item, ...form, days: Number(form.days) }
                        : item
                )
            );
        } else {
            setTypes((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    ...form,
                    days: Number(form.days),
                    active: true,
                },
            ]);
        }

        setShowForm(false);
    };

    const toggleActive = (id) => {
        setTypes((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, active: !item.active } : item
            )
        );
    };

    const deleteType = (id) => {
        const confirmed = window.confirm(
            'ต้องการลบประเภทการลานี้หรือไม่?'
        );

        if (confirmed) {
            setTypes((prev) => prev.filter((item) => item.id !== id));
        }
    };

    return (
        <div className="supervisor-page hr-leave-types-page">
            <div className="supervisor-page-heading">
                <div>
                    <h2>จัดการประเภทการลา</h2>
                    <p>กำหนดประเภทการลา จำนวนวัน และเงื่อนไขการจ่ายค่าจ้าง</p>
                </div>

                <button className="supervisor-primary-button" onClick={openAddForm}>
                    <Plus size={18} /> เพิ่มประเภทการลา
                </button>
            </div>

            <div className="supervisor-summary-grid">
                <div className="supervisor-summary-card">
                    <span>ประเภทการลาทั้งหมด</span>
                    <h3>{types.length}</h3>
                </div>

                <div className="supervisor-summary-card">
                    <span>เปิดใช้งาน</span>
                    <h3>{types.filter((item) => item.active).length}</h3>
                </div>

                <div className="supervisor-summary-card">
                    <span>ปิดใช้งาน</span>
                    <h3>{types.filter((item) => !item.active).length}</h3>
                </div>
            </div>

            <div className="supervisor-panel">
                <div className="supervisor-panel-heading">
                    <h3>รายการประเภทการลา</h3>
                </div>


                <div className="supervisor-table-wrap">
                    <table className="supervisor-table">
                        <thead>
                            <tr>
                                <th>ประเภทการลา</th>
                                <th>จำนวนวันต่อปี</th>
                                <th>ค่าจ้าง</th>
                                <th>สถานะ</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {types.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.days} วัน</td>
                                    <td>
                                        {item.paid ? 'ได้รับค่าจ้าง' : 'ไม่รับค่าจ้าง'}
                                    </td>
                                    <td>
                                        <span
                                            className="leave-type-chip"
                                            style={{
                                                background: item.active ? '#dcfce7' : '#f1f5f9',
                                                color: item.active ? '#166534' : '#64748b',
                                            }}
                                        >
                                            {item.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="hr-leave-type-actions">
                                            <button
                                                type="button"
                                                onClick={() => openEditForm(item)}
                                                title="แก้ไข"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => toggleActive(item.id)}
                                            >
                                                {item.active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => deleteType(item.id)}
                                                title="ลบ"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {types.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center' }}>
                                        ยังไม่มีประเภทการลา
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {showForm && (
                <div className="hr-modal-backdrop">
                    <div className="hr-detail-modal">
                        <div className="supervisor-panel-heading">
                            <h3>{editingId !== null ? 'แก้ไขประเภทการลา' : 'เพิ่มประเภทการลา'}</h3>
                            <button type="button" onClick={() => setShowForm(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={saveType}>
                            <div style={{ marginBottom: 16 }}>
                                <label>ชื่อประเภทการลา</label>
                                <input
                                    className="supervisor-search-field"
                                    style={{ width: '100%', marginTop: 6 }}
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    placeholder="เช่น ลาป่วย"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label>จำนวนวันต่อปี</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="supervisor-search-field"
                                    style={{ width: '100%', marginTop: 6 }}
                                    value={form.days}
                                    onChange={(e) =>
                                        setForm({ ...form, days: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <label style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                                <input
                                    type="checkbox"
                                    checked={form.paid}
                                    onChange={(e) =>
                                        setForm({ ...form, paid: e.target.checked })
                                    }
                                />
                                ได้รับค่าจ้างระหว่างลา
                            </label>

                            <div style={{ display: 'flex', gap: 10 }}>
                                <button type="submit" className="supervisor-primary-button">
                                    <Check size={16} /> บันทึก
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}>
                                    ยกเลิก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
