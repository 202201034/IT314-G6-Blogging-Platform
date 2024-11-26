import React from "react";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black z-50">
      <Image
        src="/logo.png"
        alt="Loading..."
        width={100} // Adjust size if needed
        height={100}
        className="animate-pulse"
      />
    </div>
  );
};

export default Loader;
