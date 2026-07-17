import { 
  collection, 
  addDoc, 
  doc, 
  onSnapshot,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const verificationService = {
  
  /**
   * Compresses an image and returns a small Base64 string
   */
  compressImage(file, maxWidth = 600, quality = 0.6) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxWidth) {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error("Failed to load image for compression"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  },

  async submitRequest(uid, data, files) {
    console.log("🚀 Starting verification submission (Compressed Base64 Mode)...");
    try {
      // 1. Convert and Compress documents
      const uploadResults = {};
      
      if (files.profile) {
        console.log("📸 Compressing Profile Photo...");
        uploadResults.profilePhotoUrl = await this.compressImage(files.profile, 400, 0.5);
      }
      if (files.idFront) {
        console.log("🪪 Compressing ID Front...");
        uploadResults.idFrontUrl = await this.compressImage(files.idFront, 600, 0.6);
      }
      if (files.idBack) {
        console.log("🪪 Compressing ID Back...");
        uploadResults.idBackUrl = await this.compressImage(files.idBack, 600, 0.6);
      }

      // Check total size (Firestore limit is ~1MB)
      const totalSize = JSON.stringify(uploadResults).length;
      console.log(`📏 Total Data Size: ${(totalSize / 1024).toFixed(2)} KB`);

      if (totalSize > 1000000) {
        throw new Error("Images are still too large. Try using smaller photos.");
      }

      // 2. Prepare request document
      const requestData = {
        uid,
        fullName: data.fullName,
        idNumber: this.maskId(data.idNumber),
        rawIdHash: await this.hashData(data.idNumber),
        phone: data.phone,
        stationCode: data.stationCode || 'GEN',
        ...uploadResults,
        status: 'pending',
        submittedAt: serverTimestamp(),
        blockchainStatus: 'idle'
      };

      // 3. Save to verificationRequests
      console.log("💾 Saving to Firestore...");
      const docRef = await addDoc(collection(db, 'verificationRequests'), requestData);
      
      // 4. Update user status
      console.log("👤 Updating user status...");
      await updateDoc(doc(db, 'users', uid), {
        verificationStatus: 'pending',
        verificationRequestId: docRef.id
      });

      console.log("✅ Submission Successful!");
      return docRef.id;
    } catch (error) {
      console.error("❌ Submission Failed:", error.message);
      alert(`Error: ${error.message}`); // Show exact error to user
      throw error;
    }
  },

  async hashData(data) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  maskId(id) {
    if (!id) return '';
    return id.replace(/.(?=.{4})/g, 'X');
  },

  listenToUserStatus(uid, callback) {
    return onSnapshot(doc(db, 'users', uid), (snapshot) => {
      const data = snapshot.data();
      callback({
        status: data?.verificationStatus || 'unverified',
        isVerified: data?.isVerified || false,
        kuliId: data?.kuliId || null,
        rejectionReason: data?.rejectionReason || null
      });
    });
  }
};
