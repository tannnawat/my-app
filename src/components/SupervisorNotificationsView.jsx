import React, { useMemo, useState } from 'react';
import {
  Bell,
  Clock3,
  Eye,
  Inbox,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Search,
  ClipboardList,
} from 'lucide-react';

export default function SupervisorNotificationsView({
  notifications = [],
  onOpenNotification,
}) {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');

  // นับจำนวนการแจ้งเตือน
  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const readCount = notifications.length - unreadCount;

  // ค้นหาและกรองรายการ พร้อมเรียงรายการยังไม่อ่านไว้ด้านบน
  const filteredNotifications = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return [...notifications]
      .filter((item) => {
        if (filter === 'unread' && item.read) return false;
        if (filter === 'read' && !item.read) return false;

        if (!keyword) return true;

        const searchableText = [
          item.title,
          item.message,
          item.requestId,
          item.leaveRequestId,
          item.type,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(keyword);
      })
      .sort(
        (a, b) =>
          Number(Boolean(a.read)) - Number(Boolean(b.read))
      );
  }, [notifications, searchText, filter]);

  return (
    <section className="supervisor-page sn-page">
      {/* ส่วนหัว */}
      <header className="sn-header">
        <div>
          <div className="sn-eyebrow">
            NOTIFICATION CENTER
          </div>

          <h1 className="sn-heading">
            <span className="sn-heading-icon">
              <Bell size={23} />
            </span>
            การแจ้งเตือน
          </h1>

          <p className="sn-description">
            ติดตามคำขอลาของพนักงานและตรวจสอบรายการที่รอการพิจารณา
          </p>
        </div>

        <div className="sn-header-badge">
          <Bell size={16} />
          สำหรับหัวหน้างาน
        </div>
      </header>

      {/* การ์ดสรุป */}
      <div className="sn-stats">
        <article className="sn-stat-card">
          <span className="sn-stat-icon sn-icon-unread">
            <Bell size={21} />
          </span>
          <div className="sn-stat-info">
            <span>ยังไม่อ่าน</span>
            <strong>{unreadCount}</strong>
            <small>รายการใหม่</small>
          </div>
        </article>

        <article className="sn-stat-card">
          <span className="sn-stat-icon sn-icon-read">
            <CheckCircle2 size={21} />
          </span>
          <div className="sn-stat-info">
            <span>อ่านแล้ว</span>
            <strong>{readCount}</strong>
            <small>รายการที่เปิดดูแล้ว</small>
          </div>
        </article>

        <article className="sn-stat-card">
          <span className="sn-stat-icon sn-icon-total">
            <Inbox size={21} />
          </span>
          <div className="sn-stat-info">
            <span>ทั้งหมด</span>
            <strong>{notifications.length}</strong>
            <small>รายการแจ้งเตือน</small>
          </div>
        </article>
      </div>

      {/* กล่องรายการแจ้งเตือน */}
      <div className="sn-panel">
        <div className="sn-panel-heading">
          <div>
            <h2>
              <ClipboardList size={21} />
              รายการแจ้งเตือน
            </h2>
            <p>เลือกรายการเพื่อเปิดดูรายละเอียดคำขอลา</p>
          </div>

          <span className="sn-unread-count">
            <Circle size={9} fill="currentColor" />
            {unreadCount} ยังไม่อ่าน
          </span>
        </div>

        {/* ค้นหา */}
        <div className="sn-toolbar">
          <label className="sn-search">
            <Search size={18} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ค้นหาชื่อแจ้งเตือน รายละเอียด หรือรหัสคำขอ"
              aria-label="ค้นหาการแจ้งเตือน"
            />

            {searchText && (
              <button
                type="button"
                className="sn-clear-search"
                onClick={() => setSearchText('')}
                aria-label="ล้างคำค้นหา"
              >
                ×
              </button>
            )}
          </label>

          <div className="sn-filters" aria-label="ตัวกรองการแจ้งเตือน">
            <button
              type="button"
              className={`sn-filter ${
                filter === 'all' ? 'active' : ''
              }`}
              onClick={() => setFilter('all')}
            >
              ทั้งหมด
            </button>

            <button
              type="button"
              className={`sn-filter ${
                filter === 'unread' ? 'active' : ''
              }`}
              onClick={() => setFilter('unread')}
            >
              ยังไม่อ่าน
            </button>

            <button
              type="button"
              className={`sn-filter ${
                filter === 'read' ? 'active' : ''
              }`}
              onClick={() => setFilter('read')}
            >
              อ่านแล้ว
            </button>
          </div>
        </div>

        {/* รายการ */}
        {filteredNotifications.length === 0 ? (
          <div className="sn-empty">
            <span className="sn-empty-icon">
              <Inbox size={30} />
            </span>

            <strong>
              {notifications.length === 0
                ? 'ยังไม่มีการแจ้งเตือน'
                : 'ไม่พบรายการแจ้งเตือน'}
            </strong>

            <p>
              {notifications.length === 0
                ? 'เมื่อมีคำขอลาจากพนักงาน รายการจะแสดงที่นี่'
                : 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง แล้วค้นหาอีกครั้ง'}
            </p>

            {(searchText || filter !== 'all') && (
              <button
                type="button"
                className="sn-reset-button"
                onClick={() => {
                  setSearchText('');
                  setFilter('all');
                }}
              >
                ล้างการค้นหา
              </button>
            )}
          </div>
        ) : (
          <div className="sn-list">
            {filteredNotifications.map((item) => (
              <article
                key={item.id}
                className={`sn-item ${
                  item.read ? 'is-read' : 'is-unread'
                }`}
              >
                <span className="sn-item-icon">
                  <Bell size={20} />
                  {!item.read && (
                    <span className="sn-new-dot" />
                  )}
                </span>

                <div className="sn-item-content">
                  <div className="sn-item-title">
                    <h3>{item.title || 'การแจ้งเตือน'}</h3>

                    {!item.read && (
                      <span className="sn-new-label">ใหม่</span>
                    )}
                  </div>

                  <p>
                    {item.message || 'ไม่มีรายละเอียดเพิ่มเติม'}
                  </p>

                  <div className="sn-item-meta">
                    <span>
                      <Clock3 size={14} />
                      {item.time || 'เมื่อสักครู่'}
                    </span>

                    <span>
                      {item.read ? (
                        <>
                          <CheckCircle2 size={14} />
                          อ่านแล้ว
                        </>
                      ) : (
                        <>
                          <Circle size={9} fill="currentColor" />
                          ยังไม่อ่าน
                        </>
                      )}
                    </span>

                    {(item.requestId ?? item.leaveRequestId) != null && (
                      <span>
                        รหัสคำขอ: #
                        {item.requestId ?? item.leaveRequestId}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="sn-open-button"
                  onClick={() => onOpenNotification?.(item)}
                >
                  <Eye size={16} />
                  ดูคำขอ
                  <ArrowUpRight size={15} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}