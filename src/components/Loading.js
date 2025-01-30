import React from "react";
import { orbit } from "ldrs";

orbit.register();

const Loading = () => {
  return <l-orbit size="50" speed="1.5" color="white"></l-orbit>;
};
export default Loading;
