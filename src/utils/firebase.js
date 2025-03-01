import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// configuration for firebase integration
const firebaseConfig = {
  apiKey: "AIzaSyAxlOni3H55zUX5LAYjvjiZi6WsSBY8Nec",
  authDomain: "wordguessr-765ac.firebaseapp.com",
  projectId: "wordguessr-765ac",
  storageBucket: "wordguessr-765ac.firebasestorage.app",
  messagingSenderId: "399645604891",
  appId: "1:399645604891:web:9b652c37330166d9208cbe",
};

// initialize firebase
const app = initializeApp(firebaseConfig);
// export important firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
