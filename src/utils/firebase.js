import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxlOni3H55zUX5LAYjvjiZi6WsSBY8Nec",
  authDomain: "wordguessr-765ac.firebaseapp.com",
  projectId: "wordguessr-765ac",
  storageBucket: "wordguessr-765ac.firebasestorage.app",
  messagingSenderId: "399645604891",
  appId: "1:399645604891:web:9b652c37330166d9208cbe",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export default getFirestore(app);
