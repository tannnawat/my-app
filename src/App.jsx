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
import SupervisorApprovalView from './components/SupervisorApprovalView';
import SupervisorDashboardView from './components/SupervisorDashboardView';
import SupervisorLeaveDetailsView from './components/SupervisorLeaveDetailsView';
import SupervisorNotificationsView from './components/SupervisorNotificationsView';
import HRLeaveRequestsView from './components/HRLeaveRequestsView';
import HRLeaveTypesView from './components/HRLeaveTypesView';
import HRLeaveEntitlementsView from './components/HRLeaveEntitlementsView';
import { initialLeaveRequests } from './data/leaveData';
import { CheckCircle } from 'lucide-react';

function App() {
  // Current logged-in user (null = show Login screen)
  const [currentUser, setCurrentUser] = useState(null);

  // Roles: 'employee', 'supervisor', 'hr'
  const [currentRole, setCurrentRole] = useState('employee');

  // Active tab
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

  // Modal and toast state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Search text for the supervisor approval page
  const [supervisorSearchText, setSupervisorSearchText] = useState('');
  const [reviewRequest, setReviewRequest] = useState(null);

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
            rejectionReason:
              newStatus === 'ไม่อนุมัติ'
                ? reason || 'ไม่อนุมัติโดยหัวหน้างาน'
                : null
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
          rejectionReason:
            newStatus === 'ไม่อนุมัติ'
              ? reason || 'ไม่อนุมัติโดยหัวหน้างาน'
              : null
        }
        : null
    );

    showToast(`อัปเดตสถานะเป็น "${newStatus}" เรียบร้อยแล้ว`);
  };


  const handleLoginSuccess = (user) => {
    // เก็บข้อมูลผู้ใช้และ Role
    setCurrentUser(user);
    setCurrentRole(user.role);

    // กำหนดหน้าแรกตาม Role
    if (user.role === 'employee') {
      setActiveTab('calendar');
    } else if (user.role === 'supervisor') {
      setActiveTab('dashboard');
    } else if (user.role === 'hr') {
      setActiveTab('reports');
    } else {
      // ถ้า Role ไม่ตรง ให้แจ้งเตือน
      showToast(`ไม่พบ Role ที่รองรับ: ${user.role}`);
      return;
    }

    showToast(
      `เข้าสู่ระบบสำเร็จ: ยินดีต้อนรับ ${user.name} (${user.roleTitleTh})`
    );
  };


  const handleLogout = () => {
    setCurrentUser(null);
    showToast('ออกจากระบบเรียบร้อยแล้ว');
  };

  // If user is not logged in, show the Login screen
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

  return (
    <div className="leave-app-wrapper">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        currentRole={currentRole}
        onChangeRole={(newRole) => {
          setCurrentRole(newRole);
          if (currentUser) {
            setCurrentUser((prev) => ({
              ...prev,
              role: newRole,
              roleTitleTh:
                newRole === 'employee'
                  ? 'พนักงาน'
                  : newRole === 'supervisor'
                    ? 'หัวหน้างาน'
                    : 'เจ้าหน้าที่ HR'
            }));
          }
          showToast(
            `สลับไปที่มุมมอง: ${newRole === 'employee'
              ? 'พนักงาน'
              : newRole === 'supervisor'
                ? 'หัวหน้างาน'
                : 'HR'
            }`
          );
        }}
        onLogout={handleLogout}
        notifications={notifications}
        onOpenNotifications={() => setActiveTab('notifications')}
      />

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
      />

      {/* Main Page Content */}
      <main className="page-container">
        {/* TAB 1: Calendar and leave quota */}
        {activeTab === 'calendar' && <CalendarQuotaView />}

        {/* TAB 2: Leave reports */}
        {activeTab === 'reports' && <SummaryReportView />}


        {/* หน้า HR: จัดการคำขอลา */}
        {activeTab === 'hr-requests' && currentRole === 'hr' && (
          <HRLeaveRequestsView requests={leaveRequests} />
        )}

        {/* หน้า HR: จัดการประเภทการลา */}
        {activeTab === 'hr-leave-types' && currentRole === 'hr' && (
          <HRLeaveTypesView />
        )}

        {/* หน้า HR: จัดการสิทธิ์การลา */}
        {activeTab === 'hr-leave-entitlements' && currentRole === 'hr' && (
          <HRLeaveEntitlementsView />
        )}



        {/* TAB 3: Dashboard */}
        {activeTab === 'dashboard' && currentRole === 'supervisor' && (
          <SupervisorDashboardView
            requests={leaveRequests}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenRequest={(request) => {
              setSelectedRequest(request);
              setActiveTab('approval-detail');
            }}
            onApproveRequest={(request) => {
              setSelectedRequest(request);
              setActiveTab('approval-detail');
            }}
          />
        )}

        {activeTab === 'dashboard' && currentRole !== 'supervisor' && (
          <DashboardView onNavigateTab={(tab) => setActiveTab(tab)} />
        )}

        {/* TAB 4: Submit leave request */}
        {activeTab === 'request' && (
          <LeaveRequestFormView
            currentUser={currentUser}
            onSubmitRequest={handleAddNewRequest}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}

        {/* TAB 5: Leave history and request status */}

        {activeTab === 'history' && (
          <LeaveHistoryView
            requests={
              currentRole === 'supervisor'
                ? leaveRequests
                : leaveRequests.filter(
                  (r) =>
                    r.empId === currentUser.empId ||
                    r.employeeId === currentUser.id
                )
            }
            onSelectRequest={(item) => setSelectedRequest(item)}
          />
        )}


        {/* TAB 6: Supervisor approval */}
        {activeTab === 'approval' && currentRole === 'supervisor' && (
          <SupervisorApprovalView
            requests={leaveRequests}
            searchText={supervisorSearchText}
            onSearchTextChange={setSupervisorSearchText}
            onOpenRequest={(request) => {
              setSelectedRequest(request);
              setActiveTab('approval-detail');
            }}
          />
        )}
        {activeTab === 'approval-detail' &&
          currentRole === 'supervisor' &&
          selectedRequest && (
            <SupervisorLeaveDetailsView
              request={selectedRequest}
              reviewerName={currentUser?.name || 'หัวหน้างาน'}
              currentRole={currentRole}
              onBack={() => setActiveTab('approval')}
              onApprove={() => {
                handleUpdateStatus(selectedRequest.id, 'อนุมัติ');
                setSelectedRequest(null);
                setActiveTab('approval');
              }}
              onReject={(id, reason) => {
                handleUpdateStatus(id, 'ไม่อนุมัติ', reason);
                setSelectedRequest(null);
                setActiveTab('approval');
              }}
            />
          )}

        {activeTab === 'notifications' && currentRole === 'supervisor' && (
          <SupervisorNotificationsView
            notifications={notifications}
            onOpenNotification={(notification) => {
              const requestId = notification.requestId ?? notification.leaveRequestId;
              const matchingRequest = leaveRequests.find((request) => request.id === requestId);
              if (matchingRequest) {
                setSelectedRequest(matchingRequest);
                setActiveTab('approval-detail');
              } else {
                showToast(notification.title || 'เปิดการแจ้งเตือนแล้ว');
              }
            }}
          />
        )}
      </main>

      {/* Details and action modal */}
      {selectedRequest && activeTab !== 'approval-detail' && (
        <LeaveDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Toast notice */}
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
