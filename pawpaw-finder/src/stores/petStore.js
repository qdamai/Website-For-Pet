import { defineStore } from 'pinia';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';

export const usePetStore = defineStore('pet', {
  state: () => ({
    lostPets: [],
    foundPets: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchLostPets() {
      this.loading = true;
      this.error = null;
      try {
        const q = query(collection(db, 'finder_lost_pets'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        this.lostPets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (err) {
        console.error("Error fetching lost pets:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchFoundPets() {
      this.loading = true;
      this.error = null;
      try {
        const q = query(collection(db, 'finder_found_pets'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        this.foundPets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (err) {
        console.error("Error fetching found pets:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchPetById(type, id) { // type can be 'lost' or 'found'
      try {
        const coll = type === 'lost' ? 'finder_lost_pets' : 'finder_found_pets';
        const docRef = doc(db, coll, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
      } catch (err) {
        console.error("Error fetching pet by id:", err);
        return null;
      }
    },
    async updatePetStatus(type, id, status) {
       try {
        const coll = type === 'lost' ? 'finder_lost_pets' : 'finder_found_pets';
        const docRef = doc(db, coll, id);
        await updateDoc(docRef, { status });
        
        // Optimistic UI update
        if (type === 'lost') {
            const pet = this.lostPets.find(p => p.id === id || p.petId === id);
            if (pet) pet.status = status;
        } else {
            const pet = this.foundPets.find(p => p.id === id || p.reportId === id);
            if (pet) pet.status = status;
        }
      } catch (err) {
        console.error("Error updating pet status:", err);
        throw err;
      }
    }
  }
});
