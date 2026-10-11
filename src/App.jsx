import React, { useState } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import CalendarQuotaView from './components/CalendarQuotaView';
import SummaryReportView from './components/SummaryReportView';
import LeaveRequestFormView from './components/LeaveRequestFormView';
import LeaveHistoryView from './components/LeaveHistoryView';
import DashboardView from './components/DashboardView';
import LeaveDetailsModal from './components/LeaveDetailsModal';
import { initialLeaveRequests } from './data/leaveData';
import { Search, ChevronDown, Eye, RotateCcw, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

function App() {
  // Current Logged-in User (null = show Login screen)
  const [currentUser, setCurrentUser] = useState(null);

  // Roles: 'employee' (default), 'supervisor', 'hr'
  const [currentRole, setCurrentRole] = useState('employee');

  // Active Tab: Default to 'calendar' as requested in Image 1!
  const [activeTab, setActiveTab] = useState('calendar');

  // Leave requests state
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 101,
      name: 'นายยุทธศักดิ์ มีดาบ',
      empId: 'EMP-0042',
      department: 'ฝ่ายพัฒนาเทคโนโลยีสารสนเทศ',
      position: 'พนักงาน',
      leaveType: 'ลาป่วย',
      days: 1,
      startDate: '16/02/2569',
      endDate: '16/02/2569',
      status: 'อนุมัติ',
      reason: 'มีไข้หวัดและปวดศีรษะ พบแพทย์ตามนัดหมาย',
      attachment: 'Medical_Cert_Yutthasak.pdf',
      remainingQuota: '5 วัน',
      requestDate: '15/02/2569 08:30',
      approver: 'หัวหน้าฝ่าย IT'
    },
    {
      id: 102,
      name: 'นายยุทธศักดิ์ มีดาบ',
      empId: 'EMP-0042',
      department: 'ฝ่ายพัฒนาเทคโนโลยีสารสนเทศ',
      position: 'พนักงาน',
      leaveType: 'ลากิจ',
      days: 1,
      startDate: '06/02/2569',
      endDate: '06/02/2569',
      status: 'อนุมัติ',
      reason: 'ติดต่อทำธุรกรรมทางราชการ ณ สำนักงานที่ดิน',
      attachment: null,
      remainingQuota: '3 วัน',
      requestDate: '04/02/2569 11:20',
      approver: 'หัวหน้าฝ่าย IT'
    },
    {
      id: 103,
      name: 'นายยุทธศักดิ์ มีดาบ',
      empId: 'EMP-0042',
      department: 'ฝ่ายพัฒนาเทคโนโลยีสารสนเทศ',
      position: 'พนักงาน',
      leaveType: 'ลาพักร้อน',
      days: 1,
      startDate: '11/02/2569',
      endDate: '11/02/2569',
      status: 'อนุมัติ',
      reason: 'พักผ่อนประจำปี',
      attachment: null,
      remainingQuota: '10 วัน',
      requestDate: '08/02/2569 14:15',
      approver: 'หัวหน้าฝ่าย IT'
    },
    {
      id: 104,
      name: 'นายยุทธศักดิ์ มีดาบ',
      empId: 'EMP-0042',
      department: 'ฝ่ายพัฒนาเทคโนโลยีสารสนเทศ',
      position: 'พนักงาน',
      leaveType: 'อื่นๆ',
      days: 1,
      startDate: '22/02/2569',
      endDate: '22/02/2569',
      status: 'อนุมัติ',
      reason: 'เข้าร่วมสัมมนาการใช้งานระบบความปลอดภัยทางไซเบอร์',
      attachment: 'Seminar_Cert.pdf',
      remainingQuota: '6 วัน',
      requestDate: '18/02/2569 16:00',
      approver: 'หัวหน้าฝ่าย IT'
    },
    {
      id: 105,
      name: 'นายยุทธศักดิ์ มีดาบ',
      empId: 'EMP-0042',
      department: 'ฝ่ายพัฒนาเทคโนโลยีสารสนเทศ',
      position: 'พนักงาน',
      leaveType: 'ลาคลอด',
      days: 1,
      startDate: '27/02/2569',
      endDate: '27/02/2569',
      status: 'อนุมัติ',
      reason: 'นัดตรวจสุขภาพครรภ์ที่โรงพยาบาล',
      attachment: 'Maternity_Note.pdf',
      remainingQuota: '0 วัน',
      requestDate: '24/02/2569 10:00',
      approver: 'หัวหน้าฝ่าย IT'
    },
    ...initialLeaveRequests
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'approved',
      title: 'แจ้งผลอนุมัติคำขอลาป่วย',
      message: 'คำขอลาป่วย วันที่ 16 ก.พ. 2569 ได้รับการอนุมัติแล้ว',
      time: '1 วันที่แล้ว'
    },
    {
      id: 2,
      type: 'approved',
      title: 'แจ้งผลอนุมัติคำขอลากิจ',
      message: 'คำขอลากิจ วันที่ 06 ก.พ. 2569 ได้รับการอนุมัติแล้ว',
      time: '2 วันที่แล้ว'
    }
  ]);

  // Modal & Toast state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Supervisor Approval Table search states (when viewing approval)
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDays, setSelectedDays] = useState('all');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddNewRequest = (newReq) => {
    setLeaveRequests((prev) => [newReq, ...prev]);
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: 'pending',
        title: `ยื่นคำขอ${newReq.leaveType}สำเร็จ`,
        message: `คำขอลา ${newReq.leaveType} วันที่ ${newReq.startDate} อยู่ระหว่างรอการตรวจสอบ`,
        time: 'เมื่อสักครู่'
      },
      ...prev
    ]);
    showToast(`ยื่นคำขอ ${newReq.leaveType} เรียบร้อยแล้ว`);
  };

  const handleUpdateStatus = (id, newStatus, reason = null) => {
    setLeaveRequests((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            rejectionReason: newStatus === 'ไม่อนุมัติ' ? (reason || 'ไม่อนุมัติโดยหัวหน้างาน') : null
          };
        }
        return item;
      })
    );

    setSelectedRequest((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status: newStatus,
            rejectionReason: newStatus === 'ไม่อนุมัติ' ? (reason || 'ไม่อนุมัติโดยหัวหน้างาน') : null
          }
        : null
    );

    showToast(`อัปเดตสถานะเป็น "${newStatus}" เรียบร้อยแล้ว`);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'employee') {
      setActiveTab('calendar');
    } else if (user.role === 'supervisor') {
      setActiveTab('approval');
    } else if (user.role === 'hr') {
      setActiveTab('reports');
    }
    showToast(`เข้าสู่ระบบสำเร็จ: ยินดีต้อนรับ ${user.name} (${user.roleTitleTh})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('ออกจากระบบเรียบร้อยแล้ว');
  };

  // If user is not logged in, show the Login screen!
  if (!currentUser) {
    return (
      <div className="login-root-container">
        <LoginView onLoginSuccess={handleLoginSuccess} />
        {toastMessage && (
          <div className="toast-notice" id="toast-notification">
            <CheckCircle size={18} color="#4ade80" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // Filtered requests for supervisor approval
  const filteredSupervisorRequests = leaveRequests.filter((item) => {
    if (
      employeeSearch.trim() &&
      !item.name.toLowerCase().includes(employeeSearch.trim().toLowerCase()) &&
      !item.empId.toLowerCase().includes(employeeSearch.trim().toLowerCase())
    ) {
      return false;
    }
    if (selectedType !== 'all' && item.leaveType !== selectedType) return false;
    if (selectedDays !== 'all') {
      const daysNum = parseInt(selectedDays, 10);
      if (daysNum === 6) {
        if (item.days < 6) return false;
      } else if (item.days !== daysNum) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="leave-app-wrapper">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        currentRole={currentRole}
        onChangeRole={(newRole) => {
          setCurrentRole(newRole);
          if (currentUser) {
            setCurrentUser(prev => ({
              ...prev,
              role: newRole,
              roleTitleTh: newRole === 'employee' ? 'พนักงาน' : newRole === 'supervisor' ? 'หัวหน้างาน' : 'เจ้าหน้าที่ HR'
            }));
          }
          showToast(`สลับไปที่มุมมอง: ${newRole === 'employee' ? 'พนักงาน' : newRole === 'supervisor' ? 'หัวหน้างาน' : 'HR'}`);
        }}
        onLogout={handleLogout}
        notifications={notifications}
      />

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
      />

      {/* Main Page Content */}
      <main className="page-container">
        {/* TAB 1: ปฏิทินวันลา / สิทธิ์คงเหลือ (IMAGE 1) */}
        {activeTab === 'calendar' && (
          <CalendarQuotaView />
        )}

        {/* TAB 2: สรุปรายงานการลา (IMAGE 2) */}
        {activeTab === 'reports' && (
          <SummaryReportView />
        )}

        {/* TAB 3: หน้าหลัก (Dashboard) */}
        {activeTab === 'dashboard' && (
          <DashboardView onNavigateTab={(tab) => setActiveTab(tab)} />
        )}

        {/* TAB 4: ยื่นคำขอลา */}
        {activeTab === 'request' && (
          <LeaveRequestFormView
            onSubmitRequest={handleAddNewRequest}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}

        {/* TAB 5: รายการประวัติ / สถานะคำขอ */}
        {activeTab === 'history' && (
          <LeaveHistoryView
            requests={leaveRequests.filter(r => r.name === 'นายยุทธศักดิ์ มีดาบ')}
            onSelectRequest={(item) => setSelectedRequest(item)}
          />
        )}

        {/* TAB 6: อนุมัติคำขอ (Supervisor / HR View from Turn 1) */}
        {activeTab === 'approval' && (
          <>
            <h1 className="page-title">
              รายการรออนุมัติ
              <span className="badge-counter">{filteredSupervisorRequests.length} รายการ</span>
            </h1>

            {/* Filter toolbar */}
            <div className="filter-toolbar">
              <div className="employee-search-box">
                <input
                  id="filter-employee-search"
                  type="text"
                  placeholder="search your employess"
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                />
                <span className="search-icon">
                  <Search size={19} />
                </span>
              </div>

              <div className="filter-select-wrapper">
                <select
                  id="filter-leave-type"
                  className="filter-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">ประเภทการลา</option>
                  <option value="ลาป่วย">ลาป่วย</option>
                  <option value="ลากิจ">ลากิจ</option>
                  <option value="ลาพักร้อน">ลาพักร้อน</option>
                  <option value="ลาคลอด">ลาคลอด</option>
                </select>
                <span className="select-arrow">
                  <ChevronDown size={18} />
                </span>
              </div>

              <div className="filter-select-wrapper">
                <select
                  id="filter-leave-days"
                  className="filter-select"
                  value={selectedDays}
                  onChange={(e) => setSelectedDays(e.target.value)}
                >
                  <option value="all">จำนวนวัน</option>
                  <option value="1">1 วัน</option>
                  <option value="2">2 วัน</option>
                  <option value="5">5 วัน</option>
                  <option value="6">6 วันขึ้นไป</option>
                </select>
                <span className="select-arrow">
                  <ChevronDown size={18} />
                </span>
              </div>

              {(employeeSearch || selectedType !== 'all' || selectedDays !== 'all') && (
                <button
                  type="button"
                  className="btn-reset-filter"
                  onClick={() => {
                    setEmployeeSearch('');
                    setSelectedType('all');
                    setSelectedDays('all');
                  }}
                >
                  <RotateCcw size={15} /> ล้างตัวกรอง
                </button>
              )}
            </div>

            <div className="table-card">
              <table className="leave-table">
                <thead>
                  <tr>
                    <th className="col-seq">ลำดับ</th>
                    <th className="col-name">ชื่อ-สกุล</th>
                    <th className="col-type">ประเภทลา</th>
                    <th className="col-days">จำนวนวัน</th>
                    <th className="col-status">สถานะ</th>
                    <th className="col-action">ดูรายละเอียด</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSupervisorRequests.map((item, index) => (
                    <tr key={item.id}>
                      <td className="col-seq">{item.id || index + 1}</td>
                      <td className="col-name">{item.name}</td>
                      <td className="col-type">{item.leaveType}</td>
                      <td className="col-days">{item.days} วัน</td>
                      <td className="col-status">
                        <div className={`status-cell ${
                          item.status === 'อนุมัติ' ? 'status-approved' :
                          item.status === 'รอการตรวจสอบ' ? 'status-pending' : 'status-rejected'
                        }`}>
                          {item.status}
                        </div>
                      </td>
                      <td className="col-action">
                        <button
                          type="button"
                          className="btn-view-details"
                          onClick={() => setSelectedRequest(item)}
                        >
                          <Eye size={16} /> ดู
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* Details & Action Modal */}
      {selectedRequest && (
        <LeaveDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Toast Notice */}
      {toastMessage && (
        <div className="toast-notice" id="toast-notification">
          <CheckCircle size={18} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
