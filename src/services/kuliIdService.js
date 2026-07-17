import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  runTransaction,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Service to generate collision-safe, sequential Kuli IDs
 * Format: KULI-{STATION}-{SEQUENTIAL_NUMBER}
 */
export const kuliIdService = {
  /**
   * Generates a new Kuli ID for a verified porter
   * @param {string} stationCode - e.g. "HWH", "NDLS"
   * @returns {Promise<string>} - The unique Kuli ID
   */
  async generateKuliId(stationCode = 'GEN') {
    const counterRef = doc(db, 'counters', `kuli_id_${stationCode.toUpperCase()}`);
    
    return await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      let nextNumber = 1;
      if (counterDoc.exists()) {
        nextNumber = (counterDoc.data().current || 0) + 1;
      }
      
      // Update the counter
      transaction.set(counterRef, { current: nextNumber }, { merge: true });
      
      // Pad number to 6 digits: 000001
      const paddedNumber = String(nextNumber).padStart(6, '0');
      return `KULI-${stationCode.toUpperCase()}-${paddedNumber}`;
    });
  }
};
