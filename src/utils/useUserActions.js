import { setDoc, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./authContext";
import { deleteUser } from "firebase/auth";
const useUserActions = () => {
  const { currentUser } = useAuth();
  const createNewUser = async () => {
    const docRef = doc(db, "users", currentUser.uid);
    const userRef = await getDoc(docRef);
    if (!userRef.exists()) {
      await setDoc(docRef, {
        name: "Anonymous",
        highScores: [],
      });
    }
  };
  const updateUserName = async (name) => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      name: name,
    });
  };
  const deleteAnonymousUser = async () => {
    if (currentUser?.isAnonymous) {
      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(currentUser);
    }
  };

  return { createNewUser, updateUserName, deleteAnonymousUser };
};
export default useUserActions;
