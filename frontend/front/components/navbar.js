import React from "react";
import logo from "../public/logo.png";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="w-screen flex">
      <div className="px-10 flex align-middle mt-4 justify-start items-center">
        <Image src={logo} alt="hello" className="h-16 w-16" />
        <p className="mx-2 text-2xl text-white">FTX Swap</p>
      </div>
    </div>
  );
};

export default Navbar;
