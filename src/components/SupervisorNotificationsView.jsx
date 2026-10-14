
import React from 'react';
import {
  Bell,
  Clock3,
  Eye,
  Inbox,
  CheckCircle2,
  Circle,
  ArrowUpRight,
} from 'lucide-react';

export default function SupervisorNotificationsView({
  notifications = [],
  onOpenNotification,
}) {
  // เรียงรายการที่ยังไม่อ่านไว้ด้านบน
  const sorted = [...notifications].sort(
    (a, b) => Number(Boolean(a.read)) - Number(Boolean(b.read))
  );

  const unreadCount = sorted.filter((item) => !item.read).length;
  const readCount = sorted.length - unreadCount;

  return (
    <section className="supervisor-page notification-page">
      {/* ส่วนหัว */}
      <div className="supervisor-page-heading">
        <div>
          <p className="supervisor-eyebrow">NOTIFICATION CENTER</p>

          <h1 className="notification-page-title">
            <span className="notification-title-icon">
              <Bell size={23} />
            </span>
            การแจ้งเตือน
          </h1>

          <p>
            ติดตามคำขอลาใหม่และตรวจสอบรายการที่รอการพิจารณา
          </p>
        </div>
      </div>

      {/* สรุปจำนวนแจ้งเตือน */}
      <div className="notification-summary-grid">
        <div className="notification-summary-card">
          <span className="notification-summary-icon unread-icon">
            <Bell size={21} />
          </span>
          <div>
            <span>ยังไม่อ่าน</span>
            <strong>{unreadCount}</strong>
            <small>รายการแจ้งเตือนใหม่</small>
          </div>
        </div>

        <div className="notification-summary-card">
          <span className="notification-summary-icon read-icon">
            <CheckCircle2 size={21} />
          </span>
          <div>
            <span>อ่านแล้ว</span>
            <strong>{readCount}</strong>
            <small>รายการที่เปิดดูแล้ว</small>
          </div>
        </div>

        <div className="notification-summary-card">
          <span className="notification-summary-icon total-icon">
            <Inbox size={21} />
          </span>
          <div>
            <span>ทั้งหมด</span>
            <strong>{sorted.length}</strong>
            <small>รายการแจ้งเตือนทั้งหมด</small>
          </div>
        </div>
      </div>

      {/* รายการแจ้งเตือน */}
      <div className="supervisor-panel notification-panel">
        <div className="notification-panel-heading">
          <div>
            <h2>
              <Inbox size={20} />
              รายการแจ้งเตือน
            </h2>
            <p>รายการที่ยังไม่อ่านจะแสดงอยู่ด้านบน</p>
          </div>

          <span className="notification-unread-badge">
            <Circle size={9} fill="currentColor" />
            {unreadCount} ยังไม่อ่าน
          </span>
        </div>

        {sorted.length === 0 ? (
          <div className="supervisor-empty-state notification-empty">
            <span className="notification-empty-icon">
              <Inbox size={30} />
            </span>
            <strong>ยังไม่มีการแจ้งเตือน</strong>
            <span>
              เมื่อมีพนักงานส่งคำขอลา รายการแจ้งเตือนจะแสดงที่นี่
            </span>
          </div>
        ) : (
          <div className="supervisor-notification-list notification-list">
            {sorted.map((item) => (
              <article
                className={`supervisor-notification-row notification-row ${item.read ? 'read' : 'unread'
                  }`}
                key={item.id}
              >
                <div className="notification-status-bar" />

                <div className="notification-bell-wrap">
                  <Bell size={20} />
                  {!item.read && (
                    <span className="notification-dot" />
                  )}
                </div>

                <div className="supervisor-notification-content notification-content">
                  <div className="notification-title-line">
                    <h3>{item.title || 'การแจ้งเตือน'}</h3>
                    {!item.read && (
                      <span className="notification-new-label">
                        ใหม่
                      </span>
                    )}
                  </div>

                  <p>{item.message || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>

                  <small className="notification-time">
                    <Clock3 size={14} />
                    {item.time || 'เมื่อสักครู่'}
                    <span className="notification-time-separator">·</span>
                    {item.read ? (
                      <>
                        <CheckCircle2 size={13} />
                        อ่านแล้ว
                      </>
                    ) : (
                      <>
                        <Circle size={9} fill="currentColor" />
                        ยังไม่อ่าน
                      </>
                    )}
                  </small>
                </div>

                <button
                  type="button"
                  className="supervisor-detail-button notification-open-button"
                  onClick={() => onOpenNotification?.(item)}
                >
                  <Eye size={15} />
                  ดูคำขอ
                  <ArrowUpRight size={14} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
