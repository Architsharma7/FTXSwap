import React, { useState, useRef, useEffect } from "react";
// import Modal from "react-modal";
// import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import eth from "../public/eth.svg";
import poly from "../public/polygon-token.svg";
// import fil from "../public/Fil.png";
// import arb from "../public/arb.png";
import usdc from "../public/usdc.png";
import usdt from "../public/usdt.png";
// import waxl from "../public/waxl.png";
// import dai from "../public/dai.png";
import { IoSwapVerticalSharp } from "react-icons/io5";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/react";
import { OriginChain, FinalChain } from "../constants/chains";
import { OriginTokens, FinalTokens } from "../constants/tokens";
import {
  EthereumTokens,
  FilecoinTokens,
  PolygonTokens,
  ArbitriumTokens,
} from "../constants/tokenaddresses";
// import { useContract, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";
import { getContract } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import {
  AxelarQueryAPI,
  CHAINS,
  Environment,
} from "@axelar-network/axelarjs-sdk";

const Swapmodal = () => {
  const [originChain, setOriginChain] = useState("Ethereum");
  const [originToken, setOriginToken] = useState("USDC");
  const [tokenAddressesOrigin, setTokenAddressesOrigin] = useState();
  const [tokenAddressesDest, setTokenAddressesDest] = useState();
  const [originTokenAddress, setOriginTokenAddress] = useState();
  const [destTokenAddress, setDestTokenAddress] = useState();
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

  const [loadingPrice, setLoadingPrice] = useState(true);

  const menuRef = useRef();
  const buttonRef = useRef();

  const [inputValueOC, setInputValueOC] = useState("");
  // console.log(originTokenAddress, destTokenAddress);

  // useEffect(() => {
  //   selectOriginChain(OriginChain[0].name, OriginChain[0].logo);
  //   selectOriginToken(OriginTokens[0].name, OriginTokens[0].logo, 0);
  // }, []);
  const selecteOriginTokenAddresses = (chainName) => {
    if (chainName == "Ethereum") {
      // console.log(EthereumTokens);
      setTokenAddressesOrigin(EthereumTokens);
    } else if (chainName == "Filecoin") {
      setTokenAddressesOrigin(FilecoinTokens);
    } else if (chainName == "Polygon") {
      setTokenAddressesOrigin(PolygonTokens);
    } else if (chainName == "Arbitrium") {
      setTokenAddressesOrigin(ArbitriumTokens);
    } else {
      console.log("Not the  Right Network");
    }
  };

  const selectDestTokenAddresses = (chainName) => {
    if (chainName == "Ethereum") {
      setTokenAddressesDest(EthereumTokens);
    } else if (chainName == "Polygon") {
      setTokenAddressesDest(PolygonTokens);
    } else if (chainName == "Arbitrium") {
      setTokenAddressesDest(ArbitriumTokens);
    } else {
      console.log("Not the  Right Network");
    }
  };

  const selectOriginChain = (chainName, logo) => {
    setOriginChain(chainName);
    console.log(chainName);
    setoriginChainLogo(logo);
    setOpenOC(false);
    selecteOriginTokenAddresses(chainName);
  };
  const selectOriginToken = (tokenName, logo, index) => {
    setOriginToken(tokenName);
    console.log(tokenName);
    setOriginTokenLogo(logo);
    setOpenOT(false);
    console.log(index);
    setOriginTokenAddress(tokenAddressesOrigin[index].address);
  };
  const selectFinalChain = (chainName, logo) => {
    setFinalChain(chainName);
    console.log(chainName);
    setfinalChainLogo(logo);
    setOpenFC(false);
    selectDestTokenAddresses(chainName);
  };
  const selectFinalToken = (tokenName, logo, index) => {
    setFinalToken(tokenName);
    console.log(tokenName);
    setfinalTokenLogo(logo);
    setOpenFT(false);
    console.log(index);
    setDestTokenAddress(tokenAddressesDest[index].address);
  };

  const sdk = new AxelarQueryAPI({
    environment: "testnet",
  });

  const getGasFees = async() => {
    const fees = await sdk.estimateGasFee('ethereum-2', 'Polygon' , 'WETH', 700000)
    console.log(fees);
  }

  //   const provider = usePublicClient();
  //   const { data: walletClient } = useWalletClient();

  //   const FTXSwapContract = getContract({
  //     // address: ,
  //     // abi: ,
  //     signerOrProvider: walletClient || provider,
  //   });

  // const provider = new ethers.JsonRpcProvider(url)
  // const signer = provider.getSigner()

  // console.log(signer)

  // const contract = new ethers.Contract(address, abi, provider)

  //   const swapOnUniswap = async () => {
  //     try {
  //       const tx = await FTXSwapContract.SwapOnUniswap(
  //         finalChain,
  //         "",
  //         "",
  //         "",
  //         inputValueOC,
  //         originToken.name
  //       );
  //       await tx.wait();
  //       console.log(tx);
  //     } catch (error) {
  //         console.log(error)
  //     }
  //   };

  //   const swapOnUniswapWithLimit = async() => {
  //     try {
  //         const tx = await FTXSwapContract.LimitSwapOnUniswap(
  //           finalChain,
  //           "",
  //           "",
  //           "",
  //           "",
  //           inputValueOC,
  //           originToken.name
  //         );
  //         await tx.wait();
  //         console.log(tx);
  //       } catch (error) {
  //           console.log(error)
  //       }
  //   };
  return (
    <div className="w-screen mt-12">
      <div className="flex justify-center items-center mx-auto">
        <div className="px-10 py-6 w-[500px] bg-gray-900 rounded-xl">
          <Tabs isFitted={true}>
            <TabList className="w-full">
              <Tab className="text-white">Cross Chain Swaps</Tab>
              <Tab>Swaps with Limit Order</Tab>
            </TabList>
            <TabPanels>
              <TabPanel textColor={"white"}>
                <div className="flex flex-col">
                  <div>
                    <p className="text-white">FROM</p>
                    <div className="flex gap-x-5 mt-3 w-full">
                      <div className="w-1/2">
                        <div
                          className="px-4 py-3 flex rounded-xl hover:bg-slate-700 cursor-pointer bg-slate-800 duration-200"
                          onClick={() => setOpenOC(!openOC)}
                          //   ref={buttonRef}
                        >
                          <div className="h-6 w-6 2xl:h-9 2xl:w-9 text-white">
                            <Image
                              src={originChainLogo}
                              alt="logo"
                              className="rounded-full"
                            />
                          </div>
                          <p className="text-white mx-2 2xl:text-3xl">
                            {originChain}
                          </p>
                        </div>
                        {openOC && (
                          <ul
                            // ref={menuRef}
                            className="flex justify-center text-white flex-col absolute bg-gray-700 rounded-xl mt-1"
                          >
                            {OriginChain.map((ochain, index) => {
                              return (
                                <li
                                  className="py-2 px-8 rounded-xl hover:bg-gray-800 cursor-pointer"
                                  key={index}
                                >
                                  <div
                                    onClick={() =>
                                      selectOriginChain(
                                        ochain.name,
                                        ochain.logo
                                      )
                                    }
                                    className="flex justify-start align-middle items-center mb-2"
                                  >
                                    <Image
                                      src={ochain.logo}
                                      alt="chain logo"
                                      className="w-10 h-10 mr-3 rounded-full"
                                    />
                                    <p className="font-semibold">
                                      {ochain.name}
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
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
                            {OriginTokens.map((otoken, index) => {
                              return (
                                <li
                                  className="py-2 px-12 rounded-xl hover:bg-gray-800 cursor-pointer"
                                  key={index}
                                >
                                  <div
                                    onClick={() =>
                                      selectOriginToken(
                                        otoken.name,
                                        otoken.logo,
                                        index
                                      )
                                    }
                                    className="flex justify-start align-middle items-center mb-2"
                                  >
                                    <Image
                                      src={otoken.logo}
                                      alt="token logo"
                                      className="w-10 h-10 mr-3 rounded-full"
                                    />
                                    <p className="font-semibold">
                                      {otoken.name}
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
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
                          <div className="h-6 w-6 2xl:h-9 2xl:w-9 text-white justify-start">
                            <Image
                              src={finalChainLogo}
                              alt="logo"
                              className="rounded-full"
                            />
                          </div>
                          <p className="text-white mx-2 2xl:text-3xl">
                            {finalChain}
                          </p>
                        </div>
                        {openFC && (
                          <ul
                            ref={menuRef}
                            className="flex justify-center text-white flex-col absolute bg-gray-700 rounded-xl mt-1 z-50"
                          >
                            {FinalChain.map((fchain, symbol) => {
                              return (
                                <li
                                  className="py-2 px-8 rounded-xl hover:bg-gray-800 cursor-pointer"
                                  key={symbol}
                                >
                                  <div
                                    onClick={() =>
                                      selectFinalChain(fchain.name, fchain.logo)
                                    }
                                    className="flex justify-start align-middle items-center mb-2"
                                  >
                                    <Image
                                      src={fchain.logo}
                                      alt="chain logo"
                                      className="w-10 h-10 mr-3 rounded-full"
                                    />
                                    <p className="font-semibold">
                                      {fchain.name}
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
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
                          <p className="text-white mx-2 2xl:text-3xl">
                            {finalToken}
                          </p>
                        </div>
                        {openFT && (
                          <ul className="flex justify-center text-white flex-col absolute bg-gray-700 rounded-xl mt-1 z-10">
                            {FinalTokens.map((ftoken, index) => {
                              return (
                                <li
                                  className="py-2 px-12 rounded-xl hover:bg-gray-800 cursor-pointer"
                                  key={index}
                                >
                                  <div
                                    onClick={() =>
                                      selectFinalToken(
                                        ftoken.name,
                                        ftoken.logo,
                                        index
                                      )
                                    }
                                    className="flex justify-start align-middle items-center mb-2"
                                  >
                                    <Image
                                      src={ftoken.logo}
                                      alt="token logo"
                                      className="w-10 h-10 mr-3 rounded-full"
                                    />
                                    <p className="font-semibold">
                                      {ftoken.name}
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
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
                  <div className="w-full flex justify-between">
                    <p className="text-sm text-stone-300 mb-2">Exchange rate</p>
                    {loadingPrice ? (
                      <Skeleton height={4} className="">
                        <p>hello bye yo yo</p>
                      </Skeleton>
                    ) : (
                      <p className="text-sm text-stone-300 mb-2">
                        1 Eth = 2.999 Matic
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex justify-center">
                    {isConnected ? (
                      <button
                        disabled={inputValueOC == "" ? true : false}
                        className={`flex justify-center items-center mx-auto bg-indigo-700 w-full rounded-xl px-3 py-3 text-xl text-white ${
                          inputValueOC == ""
                            ? " cursor-not-allowed"
                            : "hover:scale-105 hover:bg-white hover:text-indigo-700 duration-300"
                        }`}
                      >
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
              </TabPanel>

              <TabPanel color="white">
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
                          <div className="h-6 w-6 2xl:h-9 2xl:w-9 text-white">
                            <Image
                              src={originChainLogo}
                              alt="logo"
                              className="rounded-full"
                            />
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
                            {OriginChain.map((ochain, symbol) => {
                              return (
                                <li
                                  className="py-2 px-8 rounded-xl hover:bg-gray-800 cursor-pointer"
                                  key={symbol}
                                >
                                  <div
                                    onClick={() =>
                                      selectOriginChain(
                                        ochain.name,
                                        ochain.logo
                                      )
                                    }
                                    className="flex justify-start align-middle items-center mb-2"
                                  >
                                    <Image
                                      src={ochain.logo}
                                      alt="chain logo"
                                      className="w-10 h-10 mr-3 rounded-full"
                                    />
                                    <p className="font-semibold">
                                      {ochain.name}
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
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
                            {OriginTokens.map((otoken, symbol) => {
                              return (
                                <li
                                  className="py-2 px-12 rounded-xl hover:bg-gray-800 cursor-pointer"
                                  key={symbol}
                                >
                                  <div
                                    onClick={() =>
                                      selectOriginToken(
                                        otoken.name,
                                        otoken.logo
                                      )
                                    }
                                    className="flex justify-start align-middle items-center mb-2"
                                  >
                                    <Image
                                      src={otoken.logo}
                                      alt="token logo"
                                      className="w-10 h-10 mr-3 rounded-full"
                                    />
                                    <p className="font-semibold">
                                      {otoken.name}
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
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
                          <div className="h-6 w-6 2xl:h-9 2xl:w-9 text-white justify-start">
                            <Image
                              src={finalChainLogo}
                              alt="logo"
                              className="rounded-full"
                            />
                          </div>
                          <p className="text-white mx-2 2xl:text-3xl">
                            {finalChain}
                          </p>
                        </div>
                        {openFC && (
                          <ul
                            ref={menuRef}
                            className="flex justify-center text-white flex-col absolute bg-gray-700 rounded-xl mt-1 z-50"
                          >
                            {FinalChain.map((fchain, symbol) => {
                              return (
                                <li
                                  className="py-2 px-8 rounded-xl hover:bg-gray-800 cursor-pointer"
                                  key={symbol}
                                >
                                  <div
                                    onClick={() =>
                                      selectFinalChain(fchain.name, fchain.logo)
                                    }
                                    className="flex justify-start align-middle items-center mb-2"
                                  >
                                    <Image
                                      src={fchain.logo}
                                      alt="chain logo"
                                      className="w-10 h-10 mr-3 rounded-full"
                                    />
                                    <p className="font-semibold">
                                      {fchain.name}
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
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
                          <p className="text-white mx-2 2xl:text-3xl">
                            {finalToken}
                          </p>
                        </div>
                        {openFT && (
                          <ul className="flex justify-center text-white flex-col absolute bg-gray-700 rounded-xl mt-1 z-10">
                            {FinalTokens.map((ftoken, symbol) => {
                              return (
                                <li
                                  className="py-2 px-12 rounded-xl hover:bg-gray-800 cursor-pointer"
                                  key={symbol}
                                >
                                  <div
                                    onClick={() =>
                                      selectFinalToken(ftoken.name, ftoken.logo)
                                    }
                                    className="flex justify-start align-middle items-center mb-2"
                                  >
                                    <Image
                                      src={ftoken.logo}
                                      alt="token logo"
                                      className="w-10 h-10 mr-3 rounded-full"
                                    />
                                    <p className="font-semibold">
                                      {ftoken.name}
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 mb-4 flex flex-col">
                    <p className="text-white">Swap at Rate</p>
                    <input
                      className="w-full px-4 py-2 bg-slate-900 text-3xl text-white outline-none"
                      placeholder="0"
                    ></input>
                  </div>
                  <div className="mt-3 mb-2 flex flex-col">
                    <p className="text-stone-300 text-sm">Current Rate</p>
                    <input
                      className="w-full px-4 py-2 bg-slate-900 text-3xl text-white outline-none"
                      placeholder="0"
                      disabled={true}
                    ></input>
                  </div>
                  <div className="w-full flex justify-between">
                    <p className="text-sm text-stone-300 mb-2">Exchange rate</p>
                    {loadingPrice ? (
                      <Skeleton height={4} className="">
                        <p>hello bye yo yo</p>
                      </Skeleton>
                    ) : (
                      <p className="text-sm text-stone-300 mb-2">
                        1 Eth = 2.999 Matic
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex justify-center">
                    {isConnected ? (
                      <button
                      onClick={getGasFees()}
                        disabled={inputValueOC == "" ? true : false}
                        className={`flex justify-center items-center mx-auto bg-indigo-700 w-full rounded-xl px-3 py-3 text-xl text-white ${
                          inputValueOC == ""
                            ? " cursor-not-allowed"
                            : "hover:scale-105 hover:bg-white hover:text-indigo-700 duration-300"
                        }`}
                      >
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
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Swapmodal;
