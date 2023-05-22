import React, { useState } from "react";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import eth from "../public/eth.svg";
import poly from "../public/polygon-token.svg";
import fil from "../public/Fil.png";
import arb from "../public/arb.png";
import { IoSwapVerticalSharp } from "react-icons/io5";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Swapmodal = () => {
  const [originChain, setOriginChain] = useState("Ethereum");
  const [originToken, setOriginToken] = useState("Usdc");
  const [finalChain, setFinalChain] = useState("Polygon");
  const [finalToken, setFinalToken] = useState("Usdt");
  const [openOC, setOpenOC] = useState(false);
  const [openOT, setOpenOT] = useState(false);
  const [openFC, setOpenFC] = useState(false);
  const [openFT, setOpenFT] = useState(false);
  const { isConnected } = useAccount();

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const selectOriginChain = (chainName) => {
    setOriginChain(chainName);
    console.log(chainName);
    closeModal();
  };
  const selectOriginToken = (tokenName) => {
    setOriginToken(chainName);
    console.log(chainName);
    closeModal();
  };
  const selectFinalChain = (chainName) => {
    setFinalChain(chainName);
    console.log(chainName);
    closeModal();
  };
  const selectFinalToken = (tokenName) => {
    setFinalToken(chainName);
    console.log(chainName);
    closeModal();
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
                    className="px-4 py-3 flex rounded-xl hover:bg-slate-700 cursor-pointer bg-slate-800"
                    onClick={() => openModal()}
                  >
                    <div className="hidden rounded-full md:inline-flex h-6 w-6 2xl:h-9 2xl:w-9 text-white">
                      {/* <Image src={flag} alt="hello"/> */}
                    </div>
                    <p className="text-white mx-2 2xl:text-3xl">
                      {originChain}
                    </p>
                  </div>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Choose chain"
                    className="bg-slate-800 justify-center items-center mx-auto w-96 mt-48 rounded-xl px-4 py-3 text-white"
                  >
                    <div className="flex flex-col justify-center items-center">
                      <div className="flex justify-between w-full align-middle items-center">
                        <p className="mx-3">Choose Chain</p>
                        <AiOutlineClose
                          onClick={closeModal}
                          className="text-xl cursor-pointer"
                        />
                      </div>
                      <div className="mt-4 w-full mx-3">
                        <ul className="flex justify-center text-white flex-col">
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer">
                            <div className="flex align-middle items-center">
                              <Image
                                src={fil}
                                alt="fil"
                                className="w-10 h-10 mr-3"
                              />
                              <p className="font-semibold">FVM</p>
                            </div>
                          </li>
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer mt-2">
                            <div className="flex align-middle items-center">
                              <Image
                                src={poly}
                                alt="polygon"
                                className="w-10 h-10 mr-3"
                              />
                              <p className="font-semibold">Polygon</p>
                            </div>
                          </li>
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer mt-2">
                            <div className="flex align-middle items-center">
                              <Image
                                src={arb}
                                alt="arb"
                                className="w-10 h-10 mr-3 rounded-full"
                              />
                              <p className="font-semibold">Arbitrium</p>
                            </div>
                          </li>
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer mt-2">
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
                      </div>
                    </div>
                  </Modal>
                </div>
                <div className="w-1/2 mb-5">
                  <div
                    className="px-4 py-3 flex rounded-xl hover:bg-slate-700 cursor-pointer bg-slate-800"
                    onClick={() => setOpenOT(!openOT)}
                  >
                    <div className="hidden rounded-full md:inline-flex h-6 w-6 2xl:h-9 2xl:w-9 text-white">
                      {/* <Image src={flag} alt="hello"/> */}
                    </div>
                    <p className="text-white mx-2 2xl:text-3xl">
                      {originToken}
                    </p>
                  </div>
                  {openOT && (
                    <ul className="flex justify-center text-black flex-col">
                      <li className="flex px-4 py-2 hover:bg-slate-300 justify-center align-middle 2xl:text-xl cursor-pointer">
                        <div className="hidden rounded-full md:inline-flex h-6 w-6 2xl:h-9 2xl:w-9"></div>
                        <p className="text-black mx-2 2xl:text-3xl">english</p>
                      </li>
                      <li className="flex px-4 py-2 hover:bg-slate-300 justify-center align-middle 2xl:text-xl cursor-pointer">
                        <div className="hidden rounded-full md:inline-flex h-6 w-6 2xl:h-9 2xl:w-9"></div>
                        <p className="text-black mx-2 2xl:text-3xl">spanish</p>
                      </li>
                      <li className="flex px-4 py-2 hover:bg-slate-300 justify-center align-middle 2xl:text-xl cursor-pointer">
                        <div className="hidden rounded-full md:inline-flex h-6 w-6 2xl:h-9 2xl:w-9"></div>
                        <p className="text-black mx-2 2xl:text-3xl">german</p>
                      </li>
                      <li className="flex px-4 py-2 hover:bg-slate-300 justify-center align-middle 2xl:text-xl cursor-pointer">
                        <div className="hidden rounded-full md:inline-flex h-6 w-6 2xl:h-9 2xl:w-9"></div>
                        <p className="text-black mx-2 2xl:text-3xl">french</p>
                      </li>
                      <li className="flex px-4 py-2 hover:bg-slate-300 justify-center align-middle 2xl:text-xl cursor-pointer">
                        <div className="hidden rounded-full md:inline-flex h-6 w-6 2xl:h-9 2xl:w-9"></div>
                        <p className="text-black mx-2 2xl:text-3xl">Japanese</p>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div>
              <input
                className="w-full px-4 py-2 bg-slate-900 text-3xl text-white outline-none"
                placeholder="0" disabled={isConnected ? false : true}
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
                    onClick={() => openModal()}
                  >
                    <div className="hidden rounded-full md:inline-flex h-6 w-6 2xl:h-9 2xl:w-9 text-white">
                      {/* <Image src={flag} alt="hello"/> */}
                    </div>
                    <p className="text-white mx-2 2xl:text-3xl">{finalChain}</p>
                  </div>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Choose chain"
                    className=" bg-slate-800 justify-center items-center mx-auto w-96 mt-48 rounded-xl px-4 py-3 text-white"
                  >
                    <div className="flex flex-col justify-center items-center">
                      <div className="flex justify-between w-full align-middle items-center">
                        <p className="mx-3">Choose Chain</p>
                        <AiOutlineClose
                          onClick={closeModal}
                          className="text-xl cursor-pointer"
                        />
                      </div>
                      <div className="mt-4 w-full mx-3">
                        <ul className="flex justify-center text-white flex-col">
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer">
                            <div className="flex align-middle items-center">
                              <Image
                                src={fil}
                                alt="fil"
                                className="w-10 h-10 mr-3"
                              />
                              <p className="font-semibold">FVM</p>
                            </div>
                          </li>
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer mt-2">
                            <div className="flex align-middle items-center">
                              <Image
                                src={poly}
                                alt="polygon"
                                className="w-10 h-10 mr-3"
                              />
                              <p className="font-semibold">Polygon</p>
                            </div>
                          </li>
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer mt-2">
                            <div className="flex align-middle items-center">
                              <Image
                                src={arb}
                                alt="arb"
                                className="w-10 h-10 mr-3 rounded-full"
                              />
                              <p className="font-semibold">Arbitrium</p>
                            </div>
                          </li>
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer mt-2">
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
                      </div>
                    </div>
                  </Modal>
                </div>
                <div className="w-1/2">
                  <div
                    className="px-4 py-3 flex rounded-xl hover:bg-slate-700 cursor-pointer bg-slate-800"
                    onClick={() => openModal()}
                  >
                    <div className="hidden rounded-full md:inline-flex h-6 w-6 2xl:h-9 2xl:w-9 text-white">
                      {/* <Image src={flag} alt="hello"/> */}
                    </div>
                    <p className="text-white mx-2 2xl:text-3xl">{finalToken}</p>
                  </div>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Choose chain"
                    className=" bg-slate-800 justify-center items-center mx-auto w-96 mt-48 rounded-xl px-4 py-3 text-white"
                  >
                    <div className="flex flex-col justify-center items-center">
                      <div className="flex justify-between w-full align-middle items-center">
                        <p className="mx-3">Choose Chain</p>
                        <AiOutlineClose
                          onClick={closeModal}
                          className="text-xl cursor-pointer"
                        />
                      </div>
                      <div className="mt-4 w-full mx-3">
                        <ul className="flex justify-center text-white flex-col">
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer">
                            <div className="flex align-middle items-center">
                              <Image
                                src={fil}
                                alt="fil"
                                className="w-10 h-10 mr-3"
                              />
                              <p className="font-semibold">FVM</p>
                            </div>
                          </li>
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer mt-2">
                            <div className="flex align-middle items-center">
                              <Image
                                src={poly}
                                alt="polygon"
                                className="w-10 h-10 mr-3"
                              />
                              <p className="font-semibold">Polygon</p>
                            </div>
                          </li>
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer mt-2">
                            <div className="flex align-middle items-center">
                              <Image
                                src={arb}
                                alt="arb"
                                className="w-10 h-10 mr-3 rounded-full"
                              />
                              <p className="font-semibold">Arbitrium</p>
                            </div>
                          </li>
                          <li className="px-6 py-2 rounded-xl hover:bg-slate-700 cursor-pointer mt-2">
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
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
            <div className="mt-3 mb-2">
              <input
                className="w-full px-4 py-2 bg-slate-900 text-3xl text-white outline-none"
                placeholder="0" disabled={true}
              ></input>
            </div>
            <div className="mt-4 flex justify-center">
              {isConnected ? (
                <button className="flex justify-center items-center mx-auto bg-indigo-700 w-full rounded-xl px-3 py-3 text-xl text-white hover:scale-105 hover:bg-white hover:text-indigo-700 duration-300">
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
