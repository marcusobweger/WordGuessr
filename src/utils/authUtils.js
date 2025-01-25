import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInAnonymously,
} from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};
export const doSignInWithEmailAndPassword = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};
export const doSignInWithGithub = async () => {
  const provider = new GithubAuthProvider();
  return await signInWithPopup(auth, provider);
};
export const doSignInAnonymously = async () => {
  return await signInAnonymously(auth);
};
export const doSignOut = async () => {
  return await auth.signOut();
};
