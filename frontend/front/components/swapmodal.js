import React, { useState, useRef, useEffect } from "react";
// import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import eth from "../public/eth.svg";
import poly from "../public/polygon-token.svg";
import fil from "../public/Fil.png";
import arb from "../public/arb.png";
import usdc from "../public/usdc.png";
import usdt from "../public/usdt.png";
import waxl from "../public/waxl.png";
import dai from "../public/dai.png";
import { IoSwapVerticalSharp } from "react-icons/io5";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Swapmodal = () => {
  const [originChain, setOriginChain] = useState("Ethereum");
  const [originToken, setOriginToken] = useState("USDC");
  const [finalChain, setFinalChain] = useState("Polygon");
  const [finalToken, setFinalToken] = useState("USDT");
  const [openOC, setOpenOC] = useState(false);
  const [openOT, setOpenOT] = useState(false);
  const [openFC, setOpenFC] = useState(false);
  const [openFT, setOpenFT] = useState(false);
  const { isConnected } = useAccount();
  const [originTokenLogo, setOriginTokenLogo] = useState(usdc);
  const [originChainLogo, setoriginChainLogo] = useState(eth);
  const [finalChainLogo, setfinalChainLogo] = useState(poly);
  const [finalTokenLogo, setfinalTokenLogo] = useState(usdt);
  const menuRef = useRef();
  const buttonRef = useRef();

  const [inputValueOC, setInputValueOC] = useState('')

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target !== menuRef.current && e.target !== buttonRef.current) {
        setOpenOC(false) 
      }
    });
  }, []);

//   function openModal() {
//     setIsOpen(true);
//   }

//   function closeModal() {
//     setIsOpen(false);
//   }

  const selectOriginChain = (chainName, logo) => {
    setOriginChain(chainName);
    console.log(chainName);
    setoriginChainLogo(logo);
    setOpenOC(false);
  };
  const selectOriginToken = (tokenName, logo) => {
    setOriginToken(tokenName);
    console.log(tokenName);
    setOriginTokenLogo(logo);
    setOpenOT(false);
  };
  const selectFinalChain = (chainName, logo) => {
    setFinalChain(chainName);
    console.log(chainName);
    setfinalChainLogo(logo);
    setOpenFC(false)
  };
  const selectFinalToken = (tokenName, logo) => {
    setFinalToken(tokenName);
    console.log(tokenName);
    setfinalTokenLogo(logo);
    setOpenFT(false)
  };

  return (
    <div className="w-screen mt-12">
      <div className="flex justify-center items-center mx-auto">
        <div className="px-10 py-6 w-[500px] bg-gray-900 rounded-xl">
          <div className="flex flex-col">
            <div>
              <p className="text-white">FROM</p>
              <div className="flex gap-x-5 mt-3 w-full">
                <div className="w-1/2">
                  <div
                    className="px-4 py-3 flex rounded-xl hover:bg-slate-700 cursor-pointer bg-slate-800 duration-200"
                    onClick={() => setOpenOC(!openOC)}
                    ref={buttonRef}
                  >
                    <div className="rounded-full h-6 w-6 2xl:h-9 2xl:w-9 text-white">
                      <Image src={originChainLogo} alt="logo" />
                    </div>
                    <p className="text-white mx-2 2xl:text-3xl">
                      {originChain}
                    </p>
                  </div>
                  {openOC && (
                    <ul
                      ref={menuRef}
                      className="flex justify-center text-white flex-col absolute bg-gray-700 rounded-xl mt-1"
                    >
                      <li className="py-2 px-10 rounded-xl hover:bg-gray-800 cursor-pointer">
                        <div
                          onClick={() => selectOriginChain("fvm", fil)}
                          className="flex justify-start align-middle items-center"
                        >
                          <Image
                            src={fil}
                            alt="fil"
                            className="w-10 h-10 mr-3"
                          />
                          <p className="font-semibold">Filecoin</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectOriginChain("polygon", poly)}
                        className="px-10 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={poly}
                            alt="polygon"
                            className="w-10 h-10 mr-3"
                          />
                          <p className="font-semibold">Polygon</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectOriginChain("arbitrium", arb)}
                        className="px-10 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={arb}
                            alt="arb"
                            className="w-10 h-10 mr-3 rounded-full"
                          />
                          <p className="font-semibold">Arbitrium</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectOriginChain("ethereum", eth)}
                        className="px-10 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2 mb-1"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={eth}
                            alt="eth"
                            className="w-10 h-10 mr-3 rounded-full"
                          />
                          <p className="font-semibold">Ethereum</p>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
                <div className="w-1/2 mb-5">
                  <div
                    className="px-4 py-3 flex rounded-xl hover:bg-slate-700 cursor-pointer bg-slate-800 w-full"
                    onClick={() => setOpenOT(!openOT)}
                  >
                    <div className="rounded-full h-6 w-6 2xl:h-9 2xl:w-9 text-white">
                      <Image src={originTokenLogo} alt="logo" />
                    </div>
                    <p className="text-white mx-2 2xl:text-3xl">
                      {originToken}
                    </p>
                  </div>
                  {openOT && (
                    <ul className="flex justify-center text-white flex-col absolute bg-gray-700 rounded-xl mt-1">
                      <li className="py-2 px-14 rounded-xl hover:bg-gray-800 cursor-pointer">
                        <div
                          onClick={() => selectOriginToken("USDC", usdc)}
                          className="flex justify-start align-middle items-center"
                        >
                          <Image
                            src={usdc}
                            alt="usdc"
                            className="w-10 h-10 mr-3"
                          />
                          <p className="font-semibold">USDC</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectOriginToken("wAXL", waxl)}
                        className="px-14 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={waxl}
                            alt="waxl"
                            className="w-10 h-10 mr-3 rounded-full"
                          />
                          <p className="font-semibold">wAXL</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectOriginToken("DAI", dai)}
                        className="px-14 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={dai}
                            alt="dai"
                            className="w-10 h-10 mr-3 rounded-full"
                          />
                          <p className="font-semibold">DAI</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectOriginToken("USDT", usdt)}
                        className="px-14 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2 mb-1"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={usdt}
                            alt="usdt"
                            className="w-10 h-10 mr-3 rounded-full"
                          />
                          <p className="font-semibold">USDT</p>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div>
              <input
                className="w-full px-4 py-2 bg-slate-900 text-3xl text-white outline-none"
                placeholder="0"
                disabled={isConnected ? false : true}
                value={inputValueOC}
                onChange={(e) => setInputValueOC(e.target.value)}
              ></input>
            </div>
            <div className="mt-3">
              <IoSwapVerticalSharp className="text-white flex justify-center items-center mx-auto text-4xl border border-white rounded-full font-semibold bg-clip-content bg-blue-500" />
            </div>
            <div className="mt-3">
              <p className="text-white">TO</p>
              <div className="flex gap-x-5 mt-3">
                <div className="w-1/2">
                  <div
                    className="px-4 py-3 flex rounded-xl hover:bg-slate-700 cursor-pointer bg-slate-800"
                    onClick={() => setOpenFC(!openFC)}
                  >
                    <div className="rounded-full h-6 w-6 2xl:h-9 2xl:w-9 text-white justify-start">
                      <Image src={finalChainLogo} alt="logo" />
                    </div>
                    <p className="text-white mx-2 2xl:text-3xl">{finalChain}</p>
                  </div>
                  {openFC && (
                    <ul
                      ref={menuRef}
                      className="flex justify-center text-white flex-col absolute bg-gray-700 rounded-xl mt-1 z-50"
                    >
                      <li className="py-2 px-10 rounded-xl hover:bg-gray-800 cursor-pointer">
                        <div
                          onClick={() => selectFinalChain("fvm", fil)}
                          className="flex justify-start align-middle items-center"
                        >
                          <Image
                            src={fil}
                            alt="fil"
                            className="w-10 h-10 mr-3"
                          />
                          <p className="font-semibold">Filecoin</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectFinalChain("polygon", poly)}
                        className="px-10 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={poly}
                            alt="polygon"
                            className="w-10 h-10 mr-3"
                          />
                          <p className="font-semibold">Polygon</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectFinalChain("arbitrium", arb)}
                        className="px-10 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={arb}
                            alt="arb"
                            className="w-10 h-10 mr-3 rounded-full"
                          />
                          <p className="font-semibold">Arbitrium</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectFinalChain("ethereum", eth)}
                        className="px-10 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2 mb-1"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={eth}
                            alt="eth"
                            className="w-10 h-10 mr-3 rounded-full"
                          />
                          <p className="font-semibold">Ethereum</p>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
                <div className="w-1/2">
                  <div
                    className="px-4 py-3 flex rounded-xl hover:bg-slate-700 cursor-pointer bg-slate-800"
                    onClick={() => setOpenFT(!openFT)}
                  >
                    <div className="rounded-full h-6 w-6 2xl:h-9 2xl:w-9 text-white">
                      <Image src={finalTokenLogo} alt="logo" />
                    </div>
                    <p className="text-white mx-2 2xl:text-3xl">{finalToken}</p>
                  </div>
                  {openFT && (
                    <ul className="flex justify-center text-white flex-col absolute bg-gray-700 rounded-xl mt-1">
                      <li className="py-2 px-14 rounded-xl hover:bg-gray-800 cursor-pointer">
                        <div
                          onClick={() => selectFinalToken("USDC", usdc)}
                          className="flex justify-start align-middle items-center"
                        >
                          <Image
                            src={usdc}
                            alt="usdc"
                            className="w-10 h-10 mr-3"
                          />
                          <p className="font-semibold">USDC</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectFinalToken("wAXL", waxl)}
                        className="px-14 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={waxl}
                            alt="waxl"
                            className="w-10 h-10 mr-3 rounded-full"
                          />
                          <p className="font-semibold">wAXL</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectFinalToken("DAI", dai)}
                        className="px-14 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={dai}
                            alt="dai"
                            className="w-10 h-10 mr-3 rounded-full"
                          />
                          <p className="font-semibold">DAI</p>
                        </div>
                      </li>
                      <li
                        onClick={() => selectFinalToken("USDT", usdt)}
                        className="px-14 py-2 rounded-xl hover:bg-gray-800 cursor-pointer mt-2 mb-1"
                      >
                        <div className="flex align-middle items-center">
                          <Image
                            src={usdt}
                            alt="usdt"
                            className="w-10 h-10 mr-3 rounded-full"
                          />
                          <p className="font-semibold">USDT</p>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 mb-2">
              <input
                className="w-full px-4 py-2 bg-slate-900 text-3xl text-white outline-none"
                placeholder="0"
                disabled={true}
              ></input>
            </div>
            <div className="mt-4 flex justify-center">
              {isConnected ? (
                <button disabled={inputValueOC == '' ? true : false} className="flex justify-center items-center mx-auto bg-indigo-700 w-full rounded-xl px-3 py-3 text-xl text-white hover:scale-105 hover:bg-white hover:text-indigo-700 duration-300">
                  Swap
                </button>
              ) : (
                <ConnectButton
                  showBalance={false}
                  className="flex justify-center items-center mx-auto bg-indigo-700 w-full rounded-xl px-3 py-3 text-xl text-white hover:scale-105 hover:bg-white hover:text-indigo-700 duration-300"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swapmodal;
