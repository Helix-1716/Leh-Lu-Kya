import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  doc, 
  updateDoc,
  serverTimestamp,
  addDoc,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const kuliService = {
  /**
   * Listen to available booking requests (Pending state)
   */
  listenToAvailableRequests(zoneStationStr, callback) {
    // Retrieve ALL pending requests to avoid missing new ones due to arbitrary limit
    const q = query(
      collection(db, 'bookings'),
      where('status', '==', 'pending')
    );

    return onSnapshot(q, (snapshot) => {
      let requests = snapshot.docs.map(doc => {
        const data = doc.data();
        let createdAtDate = new Date();
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          createdAtDate = data.createdAt.toDate();
        }

        return { 
          id: doc.id, 
          ...data,
          name: data.customerName || 'Anonymous Traveler',
          items: data.itemsCount || data.items || 0,
          weight: data.weightCategory || data.weight || 'Medium',
          location: data.pickupStation || data.location || 'Railway Station',
          price: data.offeredPrice || data.price || 0,
          createdAt: createdAtDate
        };
      });
      
      // Filter by station loosely (case insensitive substring) if provided
      if (zoneStationStr && zoneStationStr.trim() !== '') {
        const queryTerm = zoneStationStr.toLowerCase().trim();
        requests = requests.filter(req => {
          return req.pickupStation && req.pickupStation.toLowerCase().includes(queryTerm);
        });
      }

      requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      callback(requests);
    }, (error) => {
      console.error("Kuli Service Error:", error);
      callback([]);
    });
  },

  /**
   * Listen to Porter's active assigned mission
   */
  listenToActiveMission(uid, callback) {
    const q = query(
      collection(db, 'bookings'),
      where('kuliId', '==', uid),
      where('status', 'in', ['accepted', 'started', 'arrived'])
    );
    
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(null);
      } else {
        // Just take the first active one
        const doc = snapshot.docs[0];
        callback({ id: doc.id, ...doc.data() });
      }
    });
  },

  /**
   * Update Porter Online/Offline status
   */
  async updateDutyStatus(uid, isOnline) {
    const userRef = doc(db, 'users', uid);
    return updateDoc(userRef, {
      isOnline,
      lastStatusUpdate: serverTimestamp()
    });
  },

  /**
   * Update Working Zone for Porter
   */
  async updateZone(uid, newZone) {
    const userRef = doc(db, 'users', uid);
    return updateDoc(userRef, {
      activeZone: newZone,
      updatedAt: serverTimestamp()
    });
  },

  /**
   * Porter accepts a request with race-condition prevention
   */
  async acceptRequest(bookingId, kuliId, kuliName) {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    return runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(bookingRef);
      if (!docSnap.exists()) {
        throw new Error("Booking does not exist!");
      }
      
      if (docSnap.data().status !== 'pending') {
        throw new Error("This request was already accepted by someone else or cancelled.");
      }
      
      transaction.update(bookingRef, {
        status: 'accepted',
        kuliId,
        kuliName,
        acceptedAt: serverTimestamp()
      });
    });
  },

  /**
   * Complete mission
   */
  async completeMission(bookingId) {
    const bookingRef = doc(db, 'bookings', bookingId);
    return updateDoc(bookingRef, {
      status: 'completed',
      completedAt: serverTimestamp()
    });
  },

  /**
   * Listen to Porter's personal ratings and stats
   */
  listenToPorterRatings(kuliId, callback) {
    // In a real app, ratings would be in professional 'reviews' collection
    // but for now we look at the 'users' document where average may be cached
    return onSnapshot(doc(db, 'users', kuliId), (doc) => {
      const data = doc.data();
      callback({
        rating: data?.rating || 0,
        trips: data?.tripsCompleted || 0,
        earnings: data?.dailyEarnings || 0
      });
    });
  }
};
