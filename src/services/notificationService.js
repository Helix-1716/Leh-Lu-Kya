import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  doc, 
  updateDoc,
  writeBatch,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const notificationService = {
  /**
   * Listen to real-time notifications
   */
  listenToNotifications(callback) {
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  },

  /**
   * Listen to unread count
   */
  listenToUnreadCount(callback) {
    const q = query(collection(db, 'notifications'), where('read', '==', false));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    });
  },

  /**
   * Mark as read
   */
  async markAsRead(id) {
    const ref = doc(db, 'notifications', id);
    return updateDoc(ref, { read: true });
  },

  /**
   * Mark all as read
   */
  async markAllAsRead(notifications) {
    const batch = writeBatch(db);
    notifications.forEach(n => {
      if (!n.read) {
        const ref = doc(db, 'notifications', n.id);
        batch.update(ref, { read: true });
      }
    });
    return batch.commit();
  },

  /**
   * System Status Logic
   * In a real app, this might listen to a 'system_status' doc or 
   * compute based on active critical alerts.
   */
  listenToSystemStatus(callback) {
    const q = query(
      collection(db, 'alerts'),
      where('status', '==', 'active'),
      where('severity', 'in', ['critical', 'high'])
    );
    
    return onSnapshot(q, (snapshot) => {
      let status = {
        state: 'operational',
        label: 'System Operational',
        color: 'bg-green-500',
        bg: 'bg-green-50',
        text: 'text-green-600',
        lastUpdated: new Date()
      };

      if (snapshot.size > 0) {
        const hasCritical = snapshot.docs.some(d => d.data().severity === 'critical');
        if (hasCritical) {
          status = {
            state: 'critical',
            label: 'Critical Alert',
            color: 'bg-red-500',
            bg: 'bg-red-50',
            text: 'text-red-600',
            lastUpdated: new Date()
          };
        } else {
          status = {
            state: 'warning',
            label: 'Minor Issues',
            color: 'bg-amber-500',
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            lastUpdated: new Date()
          };
        }
      }
      callback(status);
    });
  }
};
