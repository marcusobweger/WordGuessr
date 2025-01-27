import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase"; // Your Firebase configuration file
import { useAuth } from "./authContext"; // Assuming this provides currentUser

const useUserListener = () => {
  const { currentUser } = useAuth(); // Get the currently logged-in user
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Ensure the currentUser is available
    if (!currentUser) {
      console.error("No user is logged in.");
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid); // Reference to the user's document

    // Add a real-time listener
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log("Listening to user data:", docSnapshot.data());
        setUserData(docSnapshot.data()); // Update state with user data
      } else {
        console.error("No user document found!");
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return userData; // Return the user data for consumption in components
};

export default useUserListener;
