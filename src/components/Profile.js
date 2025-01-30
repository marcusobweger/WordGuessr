import React, { useState } from "react";
import { doSignOut } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import useUserListener from "../utils/useUserListener";
import useUserActions from "../utils/useUserActions";
import Loading from "./Loading";
function Profile() {
  const navigate = useNavigate();
  const { userData, userDataLoading } = useUserListener();
  const { deleteAnonymousUser } = useUserActions();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await deleteAnonymousUser();
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

  if (userDataLoading) {
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
