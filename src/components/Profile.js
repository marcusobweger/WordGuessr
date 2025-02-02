import React, { useState } from "react";
import { doSignOut } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { deleteAnonymousUser } from "../utils/userUtils";
import { useFirebaseContext } from "../utils/firebaseContext";
import { useAuth } from "../utils/authContext";
function Profile() {
  const navigate = useNavigate();
  const { userData } = useFirebaseContext();
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await deleteAnonymousUser(currentUser);
      await doSignOut();
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const SignOutButtonContent = () => {
    if (isLoading) {
      return <Loading />;
    } else {
      return "Sign Out";
    }
  };

  if (!userData) {
    return <Loading />;
  }
  return (
    <div>
      <h1 className="title">{userData.name}</h1> Profile
      <button onClick={handleSignOut}>
        <SignOutButtonContent />
      </button>
    </div>
  );
}
export default Profile;
