import { setDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./authContext";
const useUserActions = () => {
  const { currentUser } = useAuth();
  const createNewUser = async (name) => {
    await setDoc(doc(db, "users", currentUser.uid), {
      name: name,
      highScores: [],
    });
  };
  const updateUser = async (highScores) => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      highScores: highScores,
    });
  };
  const getCurrentUserData = async () => {
    if (currentUser) {
      const docSnap = await getDoc(doc(db, "users", currentUser.uid));
      console.log(docSnap.data());
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    }
  };
  return { createNewUser, updateUser, getCurrentUserData };
};
export default useUserActions;
