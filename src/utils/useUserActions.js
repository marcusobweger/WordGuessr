import { setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./authContext";
const useUserActions = () => {
  const { currentUser } = useAuth();
  const createNewUser = async (name) => {
    await setDoc(doc(db, "users", currentUser.uid), {
      name: name,
      lobbyId: "",
      highScores: [],
    });
  };
  const updateUser = async (highScores) => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      highScores: highScores,
    });
  };
  return { createNewUser, updateUser };
};
export default useUserActions;
