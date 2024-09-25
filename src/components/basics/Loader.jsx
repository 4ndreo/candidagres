import React from "react";
import "./Loader.css";
import Lottie from "lottie-react";
import LOADER from "../../lotties/loader.json";

export default function Loader() {
  return (
    <Lottie animationData={LOADER} />
  );
}

// export default Header;
