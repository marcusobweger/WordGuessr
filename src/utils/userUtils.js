import {
  setDoc,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  orderBy,
  limit,
  query,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { deleteUser } from "firebase/auth";

export const createNewUser = async (currentUser) => {
  const docRef = doc(db, "users", currentUser.uid);
  const userRef = await getDoc(docRef);
  if (!userRef.exists()) {
    await setDoc(docRef, {
      name: "Anonymous",
      highScores: { 3: 0, 5: 0, 10: 0, 15: 0 },
      wins: {
        0: { 3: 0, 5: 0, 10: 0, 15: 0 },
        1: { 3: 0, 5: 0, 10: 0, 15: 0 },
        2: { 3: 0, 5: 0, 10: 0, 15: 0 },
      },
      state: "idle",
    });
  }
};
export const updateUserData = async (currentUser, updatedFields) => {
  await updateDoc(doc(db, "users", currentUser.uid), updatedFields);
};
export const deleteAnonymousUser = async (currentUser) => {
  if (currentUser?.isAnonymous) {
    await deleteDoc(doc(db, "users", currentUser.uid));
    await deleteUser(currentUser);
  }
};
//currently only works for highscores, when win functionality implemented adjust query accordingly
export const getLeaderboardData = async (type, wordCount) => {
  try {
    const orderString = `${type}.${wordCount}`;
    const q = query(collection(db, "users"), orderBy(orderString), limit(50));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    if (!querySnapshot.empty) {
      return querySnapshot.docs;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};
