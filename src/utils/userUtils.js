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

// function for creating a new user in the users collection
export const createNewUser = async (currentUser) => {
  const docRef = doc(db, "users", currentUser.uid);
  // check if the user already exists
  const userRef = await getDoc(docRef);
  // if not, create a new user with default values
  if (!userRef.exists()) {
    await setDoc(docRef, {
      name: "Guest",
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
// function to update the userData
export const updateUserData = async (currentUser, updatedFields) => {
  await updateDoc(doc(db, "users", currentUser.uid), updatedFields);
};
// function to delete an anonymous user
export const deleteAnonymousUser = async (currentUser) => {
  // check if the user is anonymous (provided by firebase)
  if (currentUser?.isAnonymous) {
    // delete the userData
    await deleteDoc(doc(db, "users", currentUser.uid));
    // delete the actual user
    await deleteUser(currentUser);
  }
};
// function to fetch the leaderboard data
export const getLeaderboardData = async (type, wordCount, gamemode) => {
  try {
    let orderString = "";
    // custom string for orderBy based on the type
    if (type === "highScores") {
      orderString = `${type}.${wordCount}`;
    } else if (type === "wins") {
      orderString = `${type}.${gamemode}.${wordCount}`;
    }
    // firebase query in the users collection, get the top 50 players
    const q = query(collection(db, "users"), orderBy(orderString, "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    // if the fetching passes, return the data
    if (!querySnapshot.empty) {
      return querySnapshot.docs;
      // else return an empty array
    } else {
      return [];
    }
  } catch (error) {}
};
