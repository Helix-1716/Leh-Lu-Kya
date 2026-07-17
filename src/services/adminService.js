import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  doc, 
  updateDoc,
  getDocs,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { kuliIdService } from './kuliIdService';
import { blockchainService } from './blockchainService';
import { verificationService } from './verificationService';

/**
 * Service to handle all admin-related live data fetching
 */
export const adminService = {
  /**
   * Listen to all users with optional role filtering
   */
  listenToUsers(role = null, callback) {
    let q = collection(db, 'users');
    if (role) {
      q = query(q, where('role', '==', role));
    }
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(users);
    });
  },

  /**
   * Listen to pending kuli approvals
   */
  listenToPendingKulis(callback) {
    const q = query(
      collection(db, 'users'), 
      where('role', '==', 'kuli'), 
      where('status', '==', 'pending')
    );
    return onSnapshot(q, (snapshot) => {
      const kulis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(kulis);
    });
  },

  /**
   * Listen to live bookings
   */
  listenToLiveBookings(callback) {
    // Current active bookings (status not completed/cancelled)
    const q = query(
      collection(db, 'bookings'),
      where('status', 'not-in', ['completed', 'cancelled'])
    );
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const aTs = a.createdAt?.toMillis?.() ?? 0;
          const bTs = b.createdAt?.toMillis?.() ?? 0;
          return bTs - aTs;
        });
      callback(bookings);
    });
  },

  /**
   * Listen to alerts
   */
  listenToAlerts(callback) {
    const q = query(
      collection(db, 'alerts'),
      where('status', '==', 'unread')
    );
    return onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const aTs = a.createdAt?.toMillis?.() ?? 0;
          const bTs = b.createdAt?.toMillis?.() ?? 0;
          return bTs - aTs;
        });
      callback(alerts);
    });
  },

  /**
   * Listen to completed bookings/revenue
   */
  listenToRevenue(callback) {
    const q = query(
      collection(db, 'payments'),
      where('status', '==', 'completed')
    );
    return onSnapshot(q, (snapshot) => {
      const revenue = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const aTs = a.createdAt?.toMillis?.() ?? 0;
          const bTs = b.createdAt?.toMillis?.() ?? 0;
          return bTs - aTs;
        });
      callback(revenue);
    });
  },

  /**
   * Listen to dashboard stats
   */
  listenToStats(callback) {
    // We combine multiple snapshots for the dashboard
    // This is a simplified version, in production you might use cloud functions 
    // to maintain a 'stats' document for better performance/cost.
    
    let stats = {
      totalRevenue: 0,
      activeBookings: 0,
      totalKulis: 0,
      systemAlerts: 0,
      totalCustomers: 0,
      pendingApprovals: 0
    };

    const unsubscribers = [];

    // Revenue calculation
    unsubscribers.push(onSnapshot(query(collection(db, 'payments'), where('status', '==', 'completed')), (snap) => {
      stats.totalRevenue = snap.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);
      callback({ ...stats });
    }));

    // Active Bookings
    unsubscribers.push(onSnapshot(query(collection(db, 'bookings'), where('status', 'not-in', ['completed', 'cancelled'])), (snap) => {
      stats.activeBookings = snap.size;
      callback({ ...stats });
    }));

    // Active Fleet (Online Porters)
    unsubscribers.push(onSnapshot(query(collection(db, 'users'), where('role', '==', 'kuli'), where('status', '==', 'active'), where('isOnline', '==', true)), (snap) => {
      stats.totalKulis = snap.size;
      callback({ ...stats });
    }));

    // Pending Approvals
    unsubscribers.push(onSnapshot(query(collection(db, 'users'), where('role', '==', 'kuli'), where('status', '==', 'pending')), (snap) => {
      stats.pendingApprovals = snap.size;
      callback({ ...stats });
    }));

    // Customers
    unsubscribers.push(onSnapshot(query(collection(db, 'users'), where('role', '==', 'customer')), (snap) => {
      stats.totalCustomers = snap.size;
      callback({ ...stats });
    }));

    // Alerts
    unsubscribers.push(onSnapshot(query(collection(db, 'alerts'), where('status', '==', 'unread')), (snap) => {
      stats.systemAlerts = snap.size;
      callback({ ...stats });
    }));

    return () => unsubscribers.forEach(unsub => unsub());
  },

  /**
   * Admin Actions
   */
  async approveKuli(uid) {
    const kuliRef = doc(db, 'users', uid);
    return updateDoc(kuliRef, {
      status: 'active',
      verifiedAt: new Date().toISOString()
    });
  },

  async rejectKuli(uid) {
    const kuliRef = doc(db, 'users', uid);
    return updateDoc(kuliRef, {
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    });
  },

  async updateUserStatus(uid, status) {
    const userRef = doc(db, 'users', uid);
    return updateDoc(userRef, { status });
  },

  /**
   * Listen to all pending identity verification requests
   */
  listenToVerificationRequests(callback) {
    const q = query(
      collection(db, 'verificationRequests'),
      where('status', '==', 'pending')
    );
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(requests);
    });
  },

  /**
   * Approve a Kuli Identity and Seal on Blockchain
   */
  async approveIdentity(requestId, uid, stationCode) {
    try {
      // 1. Generate unique Kuli ID
      const kuliId = await kuliIdService.generateKuliId(stationCode);
      
      // 2. Register on Blockchain प्रूफ (Proof)
      const blockchainProof = await blockchainService.recordVerificationProof(uid, kuliId, {
        timestamp: new Date().toISOString(),
        issuer: 'KULI_ADMIN_SYSTEM_V3'
      });

      // 3. Update verification request
      await updateDoc(doc(db, 'verificationRequests', requestId), {
        status: 'approved',
        reviewedAt: serverTimestamp(),
        blockchainStatus: 'confirmed',
        transactionHash: blockchainProof.transactionHash,
        kuliId: kuliId
      });

      // 4. Update core user profile
      await updateDoc(doc(db, 'users', uid), {
        verificationStatus: 'verified',
        isVerified: true,
        kuliId: kuliId,
        verifiedAt: serverTimestamp(),
        blockchainProofId: blockchainProof.transactionHash
      });

      return kuliId;
    } catch (error) {
      console.error("Identity Approval Error:", error);
      throw error;
    }
  },

  /**
   * Reject a Kuli Identity with reason
   */
  async rejectIdentity(requestId, uid, reason) {
    // 1. Update request status
    await updateDoc(doc(db, 'verificationRequests', requestId), {
      status: 'rejected',
      reviewedAt: serverTimestamp(),
      rejectionReason: reason
    });

    // 2. Notify user via profile status
    await updateDoc(doc(db, 'users', uid), {
      verificationStatus: 'rejected',
      rejectionReason: reason
    });
  }
};
