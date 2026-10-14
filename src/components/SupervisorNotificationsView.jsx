import React from 'react';
import { Bell, Clock3, Eye, Inbox } from 'lucide-react';

export default function SupervisorNotificationsView({ notifications = [], onOpenNotification }) {
  const sorted = [...notifications].sort((a, b) => Number(Boolean(a.read)) - Number(Boolean(b.read)));
  return (
    <section className="supervisor-page">
      <div className="supervisor-page-heading">
        <div><p className="supervisor-eyebrow">NOTIFICATIONS</p><h1><Bell size={25} /> การแจ้งเตือนทั้งหมด</h1><p>รายการแจ้งเตือนเมื่อพนักงานส่งคำขอลาเข้ามาให้หัวหน้าพิจารณา</p></div>
      </div>
      <div className="supervisor-panel supervisor-notifications-panel">
        <div className="supervisor-notifications-heading"><h2><Bell size={18} /> รายการแจ้งเตือน</h2><span>{sorted.filter((item) => !item.read).length} รายการยังไม่อ่าน</span></div>
        {sorted.length === 0 ? <div className="supervisor-empty-state"><Inbox size={30} /><strong>ยังไม่มีการแจ้งเตือน</strong><span>เมื่อมีพนักงานส่งคำขอลา รายการแจ้งเตือนจะแสดงที่นี่</span></div> : <div className="supervisor-notification-list">
          {sorted.map((item) => <article className={`supervisor-notification-row ${item.read ? 'read' : 'unread'}`} key={item.id}>
            <div className="supervisor-notification-accent" />
            <div className="supervisor-notification-content"><h3>{item.title}</h3><p>{item.message}</p><small><Clock3 size={13} /> {item.time || 'เมื่อสักครู่'}{item.read ? ' · อ่านแล้ว' : ' · ยังไม่อ่าน'}</small></div>
            <button className="supervisor-detail-button" onClick={() => onOpenNotification(item)}><Eye size={15} /> ดูคำขอ</button>
          </article>)}
        </div>}
      </div>
    </section>
  );
}
