import { defineStore } from 'pinia';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    wishlistedIds: [],
    loading: false
  }),
  actions: {
    async fetchWishlist(userId) {
      if (!userId) return;
      this.loading = true;
      try {
        const docRef = doc(db, 'favorites', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.wishlistedIds = docSnap.data().petIds || [];
        } else {
          this.wishlistedIds = [];
        }
      } catch (err) {
        console.error("Error fetching wishlist (favorites):", err);
      } finally {
        this.loading = false;
      }
    },
    async toggleWishlist(userId, petId) {
      if (!userId) return;
      const isAlreadyWishlisted = this.wishlistedIds.includes(petId);
      
      try {
        const docRef = doc(db, 'favorites', userId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          await setDoc(docRef, { petIds: [petId] });
          this.wishlistedIds = [petId];
        } else {
          if (isAlreadyWishlisted) {
            await updateDoc(docRef, { petIds: arrayRemove(petId) });
            this.wishlistedIds = this.wishlistedIds.filter(id => id !== petId);
          } else {
            await updateDoc(docRef, { petIds: arrayUnion(petId) });
            this.wishlistedIds.push(petId);
          }
        }
      } catch (err) {
        console.error("Error toggling wishlist (favorites):", err);
      }
    }
  }
});
