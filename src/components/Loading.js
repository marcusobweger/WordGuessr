import React from "react";
import { orbit } from "ldrs";
// the loader from the ldrs library, see https://uiball.com/ldrs/
orbit.register();

const Loading = () => {
  return <l-orbit size="50" speed="1.5" color="white"></l-orbit>;
};
export default Loading;
