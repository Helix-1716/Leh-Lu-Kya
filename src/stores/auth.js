import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { auth, db, storage } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  reload
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const role = ref(localStorage.getItem('kuli-role') || null);
  const loading = ref(true);
  const error = ref(null);
  const userData = ref(null);

  const isAdmin = computed(() => role.value === 'admin');
  const isKuli = computed(() => role.value === 'kuli');
  const isCustomer = computed(() => role.value === 'customer');
  const isVerified = computed(() => {
    // Admin accounts are auto-verified (verified by official railway staff)
    if (role.value === 'admin') return true;
    return user.value?.emailVerified || userData.value?.emailVerified || false;
  });

  // Advanced Profile Photo Resolution
  const profilePhoto = computed(() => {
    const photo = userData.value?.customPhotoURL || 
                  userData.value?.googlePhotoURL || 
                  userData.value?.photoURL || 
                  user.value?.photoURL;
    
    // Ensure it's a valid truthy string and looks like a URL
    if (photo && typeof photo === 'string' && photo.length > 0 && (photo.startsWith('http') || photo.startsWith('blob:'))) {
      return photo;
    }
    return null;
  });

  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      userData.value = userDoc.data();
      role.value = userData.value.role;
      localStorage.setItem('kuli-role', role.value);
      
      // Sync verification status
      if (user.value?.emailVerified && !userData.value.emailVerified) {
        await updateDoc(doc(db, "users", uid), { emailVerified: true });
      }

      // Proactive Google Photo Refresh
      if (user.value?.providerData?.some(p => p.providerId === 'google.com')) {
        const googlePhoto = user.value.photoURL;
        if (googlePhoto && userData.value.googlePhotoURL !== googlePhoto) {
          await updateDoc(doc(db, "users", uid), { googlePhotoURL: googlePhoto, updatedAt: serverTimestamp() });
          userData.value.googlePhotoURL = googlePhoto;
        }
      }
    }
  };

  let userUnsub = null;

  const init = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser;
          
          // Setup real-time listener for user data
          if (userUnsub) userUnsub();
          userUnsub = onSnapshot(doc(db, "users", firebaseUser.uid), (snapshot) => {
            if (snapshot.exists()) {
              userData.value = snapshot.data();
              role.value = userData.value.role;
              localStorage.setItem('kuli-role', role.value);
            }
          });

          await fetchUserData(firebaseUser.uid);
        } else {
          if (userUnsub) userUnsub();
          user.value = null;
          userData.value = null;
          role.value = null;
          localStorage.removeItem('kuli-role');
        }
        loading.value = false;
        resolve(firebaseUser);
      });
    });
  };

  const login = async (email, password) => {
    try {
      error.value = null;
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      
      await reload(firebaseUser);
      user.value = auth.currentUser;
      
      await fetchUserData(firebaseUser.uid);
      // Admin accounts are auto-verified by their role, not by Firebase email verification
      const verified = role.value === 'admin' ? true : user.value.emailVerified;
      return { user: user.value, role: role.value, verified };
    } catch (err) {
      // Admin seeding logic remains same
      const isDefaultAdmin = email === 'adminaccess@portal.in' && password === 'admin@2026';
      if ((err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') && isDefaultAdmin) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = result.user;
        const adminData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: "Chief Rail Official",
          role: 'admin',
          emailVerified: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: 'active',
          provider: 'password'
        };
        await setDoc(doc(db, "users", firebaseUser.uid), adminData);
        user.value = firebaseUser;
        userData.value = adminData;
        role.value = 'admin';
        localStorage.setItem('kuli-role', 'admin');
        return { user: firebaseUser, role: 'admin', verified: true };
      }
      error.value = err.message;
      throw err;
    }
  };

  const signup = async (email, password, additionalData) => {
    try {
      error.value = null;
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(firebaseUser);
      
      const newUserData = {
        ...additionalData,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: false,
        provider: 'password',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        wallet: 0,
        status: additionalData.role === 'kuli' ? 'pending' : 'active',
        customPhotoURL: "",
        googlePhotoURL: ""
      };

      await setDoc(doc(db, "users", firebaseUser.uid), newUserData);
      user.value = firebaseUser;
      userData.value = newUserData;
      role.value = additionalData.role;
      return firebaseUser;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const signInWithGoogle = async (selectedRole = 'customer') => {
    try {
      error.value = null;
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const existingData = userDoc.data();
        // Safe update: sync Google photo but don't overwrite custom settings
        const updates = {
          googlePhotoURL: firebaseUser.photoURL || "",
          updatedAt: serverTimestamp()
        };
        // Fix missing names/emails if any
        if (!existingData.name) updates.name = firebaseUser.displayName;
        
        await updateDoc(userDocRef, updates);
        userData.value = { ...existingData, ...updates };
        role.value = existingData.role;
      } else {
        const newUserData = {
          name: firebaseUser.displayName || "Unknown Person",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || "",
          googlePhotoURL: firebaseUser.photoURL || "",
          customPhotoURL: "",
          uid: firebaseUser.uid,
          role: selectedRole,
          emailVerified: firebaseUser.emailVerified,
          provider: 'google',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          wallet: 0,
          status: selectedRole === 'kuli' ? 'pending' : 'active'
        };
        await setDoc(userDocRef, newUserData);
        userData.value = newUserData;
        role.value = selectedRole;
      }
      
      user.value = firebaseUser;
      localStorage.setItem('kuli-role', role.value);
      return { user: firebaseUser, role: role.value };
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
  };

  const reloadAndCheckVerification = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      user.value = auth.currentUser;
      if (user.value.emailVerified) {
        await updateDoc(doc(db, "users", user.value.uid), { emailVerified: true, updatedAt: serverTimestamp() });
        if (userData.value) userData.value.emailVerified = true;
      }
      return user.value;
    }
  };

  const updateProfilePicture = async (file) => {
    if (!user.value) throw new Error("Authentication required.");
    console.log("Starting upload for user:", user.value.uid);
    try {
      const storagePath = `users/${user.value.uid}/profile_${Date.now()}`;
      const fileRef = storageRef(storage, storagePath);
      
      console.log("Uploading to storage...");
      await uploadBytes(fileRef, file);
      
      console.log("Getting download URL...");
      const downloadURL = await getDownloadURL(fileRef);
      
      console.log("Updating Auth profile...");
      await updateProfile(user.value, { photoURL: downloadURL });
      
      console.log("Updating Firestore document...");
      await updateDoc(doc(db, "users", user.value.uid), { 
        customPhotoURL: downloadURL,
        updatedAt: serverTimestamp() 
      });
      
      if (userData.value) {
        userData.value.customPhotoURL = downloadURL;
      }
      
      console.log("Upload successful!");
      return downloadURL;
    } catch (err) {
      console.error("FIREBASE ERROR:", err.code, err.message);
      error.value = err.message;
      throw err;
    }
  };

  const updateProfileDetails = async (updates) => {
    if (!user.value) throw new Error("Authentication required.");
    try {
      const userRef = doc(db, "users", user.value.uid);
      
      if (updates.name) {
        await updateProfile(user.value, { displayName: updates.name });
      }
      
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      if (userData.value) {
        userData.value = { ...userData.value, ...updates };
      }
      return true;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const updateSubscriptionTier = async (tier) => {
    if (!user.value) throw new Error("Authentication required.");
    try {
      const userRef = doc(db, "users", user.value.uid);
      await updateDoc(userRef, { 
        tier,
        updatedAt: serverTimestamp() 
      });
      if (userData.value) {
        userData.value.tier = tier;
      }
      return true;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const useGooglePhoto = async () => {
    if (!user.value || !user.value.photoURL) return;
    await updateDoc(doc(db, "users", user.value.uid), { 
      customPhotoURL: "", 
      updatedAt: serverTimestamp() 
    });
    if (userData.value) userData.value.customPhotoURL = "";
  };

  const logout = async () => {
    await signOut(auth);
    user.value = null;
    userData.value = null;
    role.value = null;
    localStorage.removeItem('kuli-role');
  };

  return { 
    user, userData, role, loading, error, 
    isAdmin, isKuli, isCustomer, isVerified, profilePhoto,
    init, login, signup, signInWithGoogle, 
    sendVerificationEmail, reloadAndCheckVerification,
    updateProfilePicture, useGooglePhoto, updateProfileDetails, updateSubscriptionTier, logout 
  };
});

