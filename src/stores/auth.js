import { defineStore } from 'pinia';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: true,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.profile?.role === 'admin',
  },
  actions: {
    async init() {
      return new Promise((resolve) => {
        // Cek hardcoded session
        const hardcodedUid = localStorage.getItem('hardcodedUid');
        if (hardcodedUid) {
          this.user = { uid: hardcodedUid, email: 'hardcoded@pawpaw.com' };
          this.fetchProfile(hardcodedUid).then(() => {
            this.loading = false;
            resolve();
          });
          return;
        }

        onAuthStateChanged(auth, async (user) => {
          this.user = user;
          if (user) {
            await this.fetchProfile(user.uid);
          } else {
            this.profile = null;
          }
          this.loading = false;
          resolve();
        });
      });
    },
    async fetchProfile(uid) {
      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.profile = docSnap.data();
        } else {
          this.profile = null;
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    },
    async login(email, password) {
      this.error = null;
      try {
        // --- HARDCODED ADMIN BYPASS ---
        if (email === 'nazira@pawpaw.com' || email === 'damai@pawpaw.com' || email === 'rafi@pawpaw.com') {
          // Mewajibkan password spesifik untuk akun hardcode
          const isAdmin = email.includes('nazira') || email.includes('damai');
          const correctPassword = isAdmin ? 'pawpaw2026' : 'user123';
          
          if (password !== correctPassword) {
            throw new Error('Password salah untuk akun khusus ini!');
          }

          let uid = 'user1'; // Default
          if (email === 'nazira@pawpaw.com') uid = 'admin1';
          if (email === 'damai@pawpaw.com') uid = 'admin2';
          
          this.user = { uid, email };
          localStorage.setItem('hardcodedUid', uid);
          await this.fetchProfile(uid);
          return;
        }
        // ------------------------------

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await this.fetchProfile(userCredential.user.uid);
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },
    async register(email, password, fullname) {
      this.error = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save initial profile
        const newProfile = {
          uid: user.uid,
          fullname,
          email,
          role: 'user', // Default role
          phone: '',
          profilePhoto: 'https://images.unsplash.com/photo-1544168190-79c154273140', // Default cartoonish avatar
          bio: '',
          location: '',
          createdAt: new Date()
        };
        
        await setDoc(doc(db, 'users', user.uid), newProfile);
        this.profile = newProfile;
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },
    async logout() {
      try {
        localStorage.removeItem('hardcodedUid');
        await signOut(auth);
        this.user = null;
        this.profile = null;
      } catch (err) {
        console.error("Logout error", err);
      }
    }
  }
});
