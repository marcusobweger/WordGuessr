import { setDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./authContext";
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

  return { createNewUser, updateUserName };
};
export default useUserActions;
