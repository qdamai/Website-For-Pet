import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB1iyjAl9YiX9lyjKOk8jpBsGDb2iZ4gpg",
  authDomain: "pawpaw-finder.firebaseapp.com",
  projectId: "pawpaw-finder",
  storageBucket: "pawpaw-finder.firebasestorage.app",
  messagingSenderId: "823178875601",
  appId: "1:8231F78875601:web:2c7ddfca251b619cf3ebf0",
  measurementId: "G-4TE35J1P31"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
