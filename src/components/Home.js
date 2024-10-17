import { useState, useEffect, useRef } from "react";
import { Navbar } from "./widgets/Navbar";
import { Header } from "./widgets/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import copy from "copy-to-clipboard";

import PhoneInput from "react-phone-input-2";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
  createWeb3Modal,
  defaultConfig,
} from "@web3modal/ethers/react";
import {
  parseUnits,
  formatEther,
  BrowserProvider,
  Contract,
  JsonRpcProvider,
  parseEther,
  toBigInt,
} from "ethers";
import { getUSerReferral, registerUser } from "./services/user";
import {
  metaRequestInsert,
  getTotalUsdt,
  getTransaction,
  generateReferral,
} from "./services/transaction";
import { toast } from "react-toastify";
import $ from "jquery";

import {
  ethChainId,
  binanceChainId,
  bscRpcUrl,
  EthRpcUrl,
  tokenAddress,
  tokenAbi,
  polygonRpcUrl,
  polygonChainId,
  usdtPolygon,
  usdcPolygon,
  usdcPolygonabi,
  usdtPolygonabi,
  gasWizardPolygonAddress,
  gasWizardPolygonabi,
  arbitrumChainId,
  arbitrumRpcUrl,
  gasWizardArbitrumAddress,
  gasWizardArbitrumabi,
  usdtArbitrum,
  usdcArbitrum,
  usdtArbitrumAbi,
  usdcArbitrumAbi,
  explorerUrlBsc,
  explorerUrlEth,
  explorerUrlPolygon,
  explorerUrlArbitrum,
  explorerUrlAvalanche,
  avalancheChainId,
  avalancheRpcUrl,
  gasWizardAvalancheAddress,
  gasWizardAvalancheAbi,
  usdtAvalanche,
  usdcAvalanche,
  usdtAvalancheAbi,
  usdcAvalancheAbi,
} from "../constant";

import {
  wbtc,
  weth,
  usdt,
  usdc,
  bep20abi,
  gasWizardAddress,
  gasWizardabi,
  gasWizardEthAddress,
  gasWizardEthabi,
  erc20abi,
  usdterc20abi,
  usdcerc20abi,
  wbtc20abi,
  wbtcErc,
  usdtErc,
  usdcErc,
} from "../constant";
import { Footer } from "./widgets/Footer";
import { checkUser, authUser } from "./services/auth/auth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Emailpattern } from "./pattern/Pattern";
import { RegisterUser } from "./auth/RegisterUser";
import { baseUrl, copyUrl } from "./Constant/BaseUrl";

export const Home = () => {
  const navigate = useNavigate();
  const params = useParams();

  const projectId = "6c9760534aa3c822cb8a072339bbca59";
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const { walletProvider } = useWeb3ModalProvider();
  const [bnbPrice, setbnbPrice] = useState();
  const [btcPrice, setbtcPrice] = useState();

  const [tokenPrice, settokenPrice] = useState();
  const [ethPrice, setethPrice] = useState();
  const [totalUsdt, setTotalUsdt] = useState();
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalToken, setTotalToken] = useState(0);
  const [selectedChain, setSelectedChain] = useState(0);
  const [selectedCurrencyUserBalance, setselectedCurrencyUserBalance] =
    useState();
  const [selectChains, setSelectChain] = useState("0");
  const [userUkcBalance, setuserUkcBalance] = useState(0);

  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [name, setName] = useState("");
  const [mobile_number, setMobile_number] = useState("+44");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [bonus, setBonus] = useState("");
  const [referralBonus, setReferralBonus] = useState("");

  const [mobile_numberErr, setMobile_numberErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [country_code, setCountry_code] = useState();
  const [tokenInput, settokenInput] = useState();
  const [ukcInput, setukcInput] = useState();
  const [referral_code, setReferral_code] = useState();
  const [buyBtnText, setbuyBtnText] = useState("Select Currency");
  const [copyText, setCopyText] = useState("Copy");
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [mainloaderStatus, setMainLoaderStatus] = useState(false);
  const mainnet = [
    {
      chainId: binanceChainId,
      name: "Binance Smart Chain",
      currency: "BNB",
      explorerUrl: explorerUrlBsc,
      rpcUrl: bscRpcUrl,
    },
    {
      chainId: ethChainId,
      name: "Ethereum Mainnet",
      currency: "ETH",
      explorerUrl: explorerUrlEth,

      rpcUrl: EthRpcUrl,
    },
    {
      chainId: polygonChainId,
      name: "Polygon",
      currency: "MATIC",
      explorerUrl: explorerUrlPolygon,

      rpcUrl: polygonRpcUrl,
    },
    // {
    //   chainId: arbitrumChainId,
    //   name: "Arbitrum Sepolia Testnet",
    //   currency: "ETH",
    //   explorerUrl: explorerUrlArbitrum,

    //   rpcUrl: arbitrumRpcUrl,
    // },
    // {
    //   chainId: avalancheChainId,
    //   name: "Avalanche",
    //   currency: "AVAX",
    //   explorerUrl: explorerUrlAvalanche,

    //   rpcUrl: arbitrumRpcUrl,
    // },
  ];

  const bscRpc = bscRpcUrl;
  const EthRpc = EthRpcUrl;
  const polygonRpc = polygonRpcUrl;
  const arbitrumRpc = arbitrumRpcUrl;
  const avalancheRpc = avalancheRpcUrl;

  const metadata = {
    name: "gaswizard",
    description: "gaswizard",
    url: "https://gaswizard.io/",

    icons: ["https://gaswizard.io/html//img/favicon.ico"],
  };
  useEffect(() => {
    if (params.walletAddress) {
      localStorage.setItem("referral_code", params.walletAddress);
    }
  }, [params.walletAddress]);

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        try {
          const result = await generateReferral({ wallet_address: address });

          setReferral_code(result?.data);
        } catch (error) {
          console.error("Error fetching referral:", error);
        }
      }
    };

    fetchData();
  }, [address]);

  createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: mainnet,
    projectId,
    enableAnalytics: true,
  });

  const selectAddress =
    selectChains == 0
      ? gasWizardAddress
      : selectChains == 1
      ? gasWizardEthAddress
      : selectChains == 2
      ? gasWizardPolygonAddress
      : selectChains == 3
      ? gasWizardArbitrumAddress
      : selectChains == 4
      ? gasWizardAvalancheAddress
      : "";
  const selectAbi =
    selectChains == 0
      ? gasWizardabi
      : selectChains == 1
      ? gasWizardEthabi
      : selectChains == 2
      ? gasWizardPolygonabi
      : selectChains == 3
      ? gasWizardArbitrumabi
      : selectChains == 4
      ? gasWizardAvalancheAbi
      : "";

  const getSignerOrProvider = async (needSigner = false) => {
    try {
      if (!isConnected) {
        throw Error("User disconnected");
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      if (needSigner) {
        const signer = await ethersProvider.getSigner();

        return signer;
      }

      return signer;
    } catch (error) {
      // console.error("Error in getWeb3Provider:", error);
      throw error;
    }
  };

  const selectCurrency = async (e) => {
    try {
      if (isConnected) {
        setSelectedCurrency(e.target.value);
        let getTokenAddr;
        let provider;
        if (selectChains == 0) {
          provider = new JsonRpcProvider(bscRpc);
        } else if (selectChains == 1) {
          provider = new JsonRpcProvider(EthRpc);
        } else if (selectChains == 2) {
          provider = new JsonRpcProvider(polygonRpc);
        } else if (selectChains == 3) {
          provider = new JsonRpcProvider(arbitrumRpc);
        } else if (selectChains == 4) {
          provider = new JsonRpcProvider(avalancheRpc);
        }

        const signer = await getSignerOrProvider(true);
        if (e.target.value == "") {
          setselectedCurrencyUserBalance("");
          setbuyBtnText("Select Currency");
        } else {
          setbuyBtnText("Approve & Buy");
        }

        if (selectChains == 0) {
          if (e.target.value == "1") {
            getTokenAddr = wbtc;
          } else if (e.target.value == "2") {
            getTokenAddr = weth;
          } else if (e.target.value == "3") {
            getTokenAddr = usdt;
          } else if (e.target.value == "4") {
            getTokenAddr = usdc;
          }
        } else if (selectChains == 1) {
          if (e.target.value == "1") {
            getTokenAddr = wbtcErc;
          } else if (e.target.value == "2") {
            getTokenAddr = usdtErc;
          } else if (e.target.value == "3") {
            getTokenAddr = usdcErc;
          }
        } else if (selectChains == 2) {
          if (e.target.value == "1") {
            getTokenAddr = usdtPolygon;
          } else if (e.target.value == "2") {
            getTokenAddr = usdcPolygon;
          }
        } else if (selectChains == 3) {
          if (e.target.value == "1") {
            getTokenAddr = usdtArbitrum;
          } else if (e.target.value == "2") {
            getTokenAddr = usdcArbitrum;
          }
        } else if (selectChains == 4) {
          if (e.target.value == "1") {
            getTokenAddr = usdtAvalanche;
          } else if (e.target.value == "2") {
            getTokenAddr = usdcAvalanche;
          }
        }

        setukcInput("");
        settokenInput("");

        if (e.target.value == "0") {
          const balance = await provider.getBalance(address);
          const balanceInEther = formatEther(balance);

          setselectedCurrencyUserBalance(balanceInEther);
        } else {
          let chainnnn;
          if (selectChains == 0) {
            chainnnn = bep20abi;
          } else if (selectChains == 1) {
            if (e.target.value == 0) {
              chainnnn = erc20abi;
            } else if (e.target.value == 1 || e.target.value == 3) {
              chainnnn = wbtc20abi;
            } else if (e.target.value == 2) {
              chainnnn = usdterc20abi;
            }
          } else if (selectChains == 2) {
            if (e.target.value == 0) {
              chainnnn = erc20abi;
            } else if (e.target.value == 1) {
              chainnnn = usdtPolygonabi;
            } else if (e.target.value == 2) {
              chainnnn = usdcPolygonabi;
            }
          } else if (selectChains == 3) {
            if (e.target.value == 0) {
              chainnnn = erc20abi;
            } else if (e.target.value == 1) {
              chainnnn = usdtArbitrumAbi;
            } else if (e.target.value == 2) {
              chainnnn = usdcArbitrumAbi;
            }
          } else if (selectChains == 4) {
            if (e.target.value == 0) {
              chainnnn = erc20abi;
            } else if (e.target.value == 1) {
              chainnnn = usdtAvalancheAbi;
            } else if (e.target.value == 2) {
              chainnnn = usdcAvalancheAbi;
            }
          }
          let balance;

          if (selectChains == 0) {
            const contract = new Contract(getTokenAddr, chainnnn, provider);
            balance = await contract.balanceOf(address);
          } else if (selectChains == 1) {
            if (e.target.value == 0) {
              const contract = new Contract(getTokenAddr, chainnnn, provider);
              balance = await contract?.balanceOf(address);
            } else if (e.target.value == 1 || e.target.value == 3) {
              const contract = new Contract(getTokenAddr, chainnnn, provider);

              balance = await contract?.balanceOf(address);
            } else if (e.target.value == 2) {
              const contract = new Contract(getTokenAddr, chainnnn, provider);
              balance = await contract?.balances(address);
            }
          } else if (
            selectChains == 2 ||
            selectChains == 3 ||
            selectChains == 4
          ) {
            if (e.target.value == 0) {
              const contract = new Contract(getTokenAddr, chainnnn, provider);
              balance = await contract?.balanceOf(address);
            } else if (e.target.value == 1 || e.target.value == 2) {
              const contract = new Contract(getTokenAddr, chainnnn, provider);

              balance = await contract?.balanceOf(address);
            }
          }

          balance = Number(balance);

          if (selectChains == "1") {
            let newUpdateBal;
            if (e.target.value == "0") {
              const hnewUpdateBal = balance / 10 ** 18;
              setselectedCurrencyUserBalance(hnewUpdateBal);
            } else if (e.target.value == "1") {
              newUpdateBal = balance / 10 ** 8;
            } else if (e.target.value == "2" || e.target.value == "3") {
              newUpdateBal = balance / 10 ** 6;
            }
            newUpdateBal = parseFloat(newUpdateBal ? newUpdateBal : 0).toFixed(
              2
            );
            setselectedCurrencyUserBalance(newUpdateBal);
          } else if (selectChains == "0") {
            let nbalance = balance / 10 ** 18;
            nbalance = nbalance?.toFixed(2);
            setselectedCurrencyUserBalance(nbalance);
          } else if (
            selectChains == "2" ||
            selectChains == "3" ||
            selectChains == "4"
          ) {
            let nbalance = balance / 10 ** 6;
            nbalance = nbalance?.toFixed(2);
            setselectedCurrencyUserBalance(nbalance);
          }

          setbuyBtnText("Approve & Buy");
        }
      } else {
        toast.dismiss();
        toast.error("Please connect with  wallet");
      }
    } catch (err) {
      // console.error(err);
    }
  };
  // ============= eth chain======//
  const selectChain = async (val) => {
    setSelectChain(val);
    setSelectedCurrency("");
    try {
      if (isConnected) {
        const provider = new JsonRpcProvider(bscRpc);

        const signer = await getSignerOrProvider(true);
        setukcInput("");
        settokenInput("");
        if (val == "") {
          setselectedCurrencyUserBalance("");
          setbuyBtnText("Select Chain");
        } else {
          setbuyBtnText("Approve & Buy");
        }
      } else {
        toast.dismiss();
        toast.error("Please connect with  wallet");
      }
    } catch (err) {
      // console.error(err);
    }
  };
  // ============= eth chain======//
  const getBalance = async () => {
    let provider;
    if (selectChains == 0) {
      provider = new JsonRpcProvider(bscRpc);
    } else if (selectChains == 1) {
      provider = new JsonRpcProvider(EthRpc);
    } else if (selectChains == 2) {
      provider = new JsonRpcProvider(polygonRpc);
    } else if (selectChains == 3) {
      provider = new JsonRpcProvider(arbitrumRpc);
    } else if (selectChains == 4) {
      provider = new JsonRpcProvider(avalancheRpc);
    }

    const signer = await getSignerOrProvider(true);
    let balance = 0;
    if (selectedCurrency == null) {
      balance = 0;
    } else if (selectedCurrency == 0) {
      balance = await provider.getBalance(address);
      balance = formatEther(balance);
    } else {
      let getTokenAddr;
      let chainnnn;

      if (selectChains == 0) {
        if (selectedCurrency == "1") {
          getTokenAddr = wbtc;
        } else if (selectedCurrency == "2") {
          getTokenAddr = weth;
        } else if (selectedCurrency == "3") {
          getTokenAddr = usdt;
        } else if (selectedCurrency == "4") {
          getTokenAddr = usdc;
        }
        chainnnn = bep20abi;
      } else if (selectChains == 1) {
        if (selectedCurrency == "1") {
          chainnnn = wbtc20abi;
          getTokenAddr = wbtcErc;
        } else if (selectedCurrency == "2") {
          chainnnn = usdterc20abi;
          getTokenAddr = usdtErc;
        } else if (selectedCurrency == "3") {
          getTokenAddr = usdcErc;
          chainnnn = wbtc20abi;
        }
      } else if (selectChains == 2) {
        if (selectedCurrency == "1") {
          chainnnn = usdtPolygon;
          getTokenAddr = usdtPolygonabi;
        } else if (selectedCurrency == "2") {
          chainnnn = usdcPolygon;
          getTokenAddr = usdcPolygonabi;
        }
      } else if (selectChains == 3) {
        if (selectedCurrency == "1") {
          chainnnn = usdtArbitrumAbi;
          getTokenAddr = usdtArbitrum;
        } else if (selectedCurrency == "2") {
          chainnnn = usdcArbitrumAbi;
          getTokenAddr = usdcArbitrum;
        }
      } else if (selectChains == 4) {
        if (selectedCurrency == "1") {
          chainnnn = usdtAvalancheAbi;
          getTokenAddr = usdtAvalanche;
        } else if (selectedCurrency == "2") {
          chainnnn = usdcAvalancheAbi;
          getTokenAddr = usdcAvalanche;
        }
      }
      if (selectChains == 0) {
        const contract = new Contract(getTokenAddr, chainnnn, provider);
        balance = await contract.balanceOf(address);
      } else if (selectChains == 1) {
        if (selectedCurrency == 0) {
          const contract = new Contract(getTokenAddr, chainnnn, provider);
          balance = await contract?.balanceOf(address);
        } else if (
          (selectedCurrency == 1 && address) ||
          (selectedCurrency == 3 && address)
        ) {
          const contract = new Contract(getTokenAddr, chainnnn, provider);
          balance = await contract?.balanceOf(address);
        } else if (selectedCurrency == 2 && address) {
          const contract = new Contract(getTokenAddr, chainnnn, provider);
          balance = await contract?.balances(address);
        }
      }

      balance = Number(balance);

      balance = balance / 10 ** 18;
      balance = balance.toFixed(4);

      if (selectChains == 2 || selectChains == 3 || selectChains == 4) {
        if (selectedCurrency == 0) {
          const contract = new Contract(getTokenAddr, chainnnn, provider);
          balance = await contract?.balanceOf(address);
        }
      }
      balance = balance / 10 ** 6;
      balance = balance.toFixed(4);
    }
    return balance;
  };

  useEffect(() => {
    const chain = localStorage.getItem("chain");
    const currency = localStorage.getItem("currency");

    const tokenInput = localStorage.getItem("tokenInput");
    const ukcInput = localStorage.getItem("ukcInput");
    const selectedCurrencyUserBalance = localStorage.getItem(
      "selectedCurrencyUserBalance"
    );
    if (chain) {
      setSelectChain(chain);

      localStorage.removeItem("chain");
    }
    if (currency) {
      setSelectedCurrency(currency);
      localStorage.removeItem("currency");
    }
    if (tokenInput) {
      settokenInput(tokenInput);
      localStorage.removeItem("tokenInput");
    }
    if (selectedCurrencyUserBalance) {
      setselectedCurrencyUserBalance(selectedCurrencyUserBalance);
      localStorage.removeItem("selectedCurrencyUserBalance");
    }
    if (ukcInput) {
      let amt = Number(ukcInput).toFixed(2);
      console.log(amt, "amt");
      setukcInput(amt);
      setbuyBtnText("Approve & Buy");
      localStorage.removeItem("ukcInput");
    }
  }, [localStorage]);

  useEffect(() => {
    TotalUsdtGet();
  }, []);

  const trnsactionGet = async () => {
    if (address) {
      const resp = await getTransaction({ address });
      console.log(resp, "resp");

      if (resp.status) {
        setBonus(resp?.bonus);
        setReferralBonus(resp?.referralAmount);
      }
    }
  };

  useEffect(() => {
    getTotalSupply();
    trnsactionGet();
  }, [address]);

  const TotalUsdtGet = async () => {
    const resp = await getTotalUsdt();

    if (resp.status) {
      let totalusdt = parseInt(resp?.usdtAmt);
      let totalToken = parseInt(resp?.tokenAmt);
      console.log(totalusdt, "totalusdt");
      setTotalUsdt(totalusdt);
      setTotalToken(totalToken);
    }
  };
  const formatNumber = (number) => {
    return number !== null && number !== undefined
      ? number.toLocaleString("en-US")
      : "";
  };

  let formattedTotalToken = formatNumber(totalToken * 10);
  let formattedTotalUsdt = formatNumber(totalUsdt);
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };

  const buy = async () => {
    try {
      if (isConnected) {
        if (!selectChains) {
          toast.dismiss();
          toast.error("Please select chain");
          return;
        }

        if (!selectedCurrency) {
          toast.dismiss();
          toast.error("Please select Currency");

          return;
        }

        // try {
        if (
          tokenInput == undefined ||
          tokenInput.length == 0 ||
          tokenInput <= 0
        ) {
          toast.dismiss();
          toast.error("Invalid Amount");

          return;
        }

        if (selectedCurrency == "0") {
          var tokenBalance = await getBalance();

          if (tokenBalance < tokenInput) {
            toast.dismiss();
            toast.error("Insufficient Balance");

            return;
          }

          const signer = await getSignerOrProvider(true);
          const provider = await getSignerOrProvider();

          if (selectChains == 0) {
            if (chainId != binanceChainId) {
              toast.dismiss();
              toast.error("Please change network to binanace smart chain");
              return;
            }
          } else if (selectChains == 1) {
            if (chainId != ethChainId) {
              toast.dismiss();
              toast.error("Please change network to  Eth chain");
              return;
            }
          } else if (selectChains == 2) {
            if (chainId != polygonChainId) {
              toast.dismiss();
              toast.error("Please change network to  Polygon chain");
              return;
            }
          } else if (selectChains == 3) {
            if (chainId != arbitrumChainId) {
              toast.dismiss();
              toast.error("Please change network to  Arbitrum chain");
              return;
            }
          } else if (selectChains == 4) {
            if (chainId != avalancheChainId) {
              toast.dismiss();
              toast.error("Please change network to  Avalanche chain");
              return;
            }
          }

          const res = await checkUser({ address });
          if (res.status) {
            window.addEventListener("beforeunload", handleBeforeUnload);
            const contract = new Contract(selectAddress, selectAbi, provider);
            const valueInWei = parseEther(tokenInput.toString());

            let balance;
            if (selectChains == 0) {
              balance = await contract.buyTokenWithbnb(
                process.env.REACT_APP_getfundBinanceAddress,
                {
                  value: valueInWei,
                }
              );
            } else if (selectChains == 1) {
              balance = await contract.buyTokenWithETH(
                process.env.REACT_APP_getfundEthreumAddress,
                {
                  value: valueInWei,
                }
              );
            } else if (selectChains == 2) {
              balance = await contract.buyTokenWithMATIC(
                process.env.REACT_APP_getfundBinanceAddress,
                {
                  value: valueInWei,
                }
              );
            } else if (selectChains == 3) {
              balance = await contract.buyTokenWithArbitrumETH(
                process.env.REACT_APP_getfundEthreumAddress,
                {
                  value: valueInWei,
                }
              );
            } else if (selectChains == 4) {
              balance = await contract.buyTokenWithAVAX(
                process.env.REACT_APP_getfundAvalancheAddress,
                {
                  value: valueInWei,
                }
              );
            }
            const referral_code = localStorage.getItem("referral_code");
            const transactionHash = balance.hash;

            const data = {
              userAddress: address,
              chain: selectChains,
              currency: selectedCurrency,
              amount: tokenInput,
              tokenAmount: ukcInput,
              trans_id: transactionHash,
              reffer_from: referral_code,
            };
            const token = localStorage.getItem("jwtToken");
            const result = await metaRequestInsert(data, token);

            if (result.status) {
              window.removeEventListener("beforeunload", handleBeforeUnload);
              toast.dismiss("");
              toast.success(result.message);

              setTimeout(() => {
                window.location.reload();
              }, [10000]);
            } else {
              toast.dismiss("");
              toast.dismiss(result.message);
            }
          } else {
            toast.error(res.message);
            localStorage.setItem("chain", selectChains);
            localStorage.setItem("currency", selectedCurrency);
            localStorage.setItem("tokenInput", tokenInput);
            localStorage.setItem("ukcInput", ukcInput);
            localStorage.setItem(
              "selectedCurrencyUserBalance",
              selectedCurrencyUserBalance
            );
            setTimeout(() => {
              navigate("/sign-up");
            }, 2000);
          }
        } else {
          const signer = await getSignerOrProvider(true);
          const provider = await getSignerOrProvider();
          const inputamount = parseUnits(tokenInput, 18);

          let getTokenAddr;
          let updatetAmt = Number(tokenInput);
          let chainnnn;
          if (selectChains == 0) {
            if (chainId != binanceChainId) {
              toast.dismiss();
              toast.error("Please change network to binanace smart chain");
              return;
            }
            if (selectedCurrency == "1") {
              getTokenAddr = wbtc;
            } else if (selectedCurrency == "2") {
              getTokenAddr = weth;
            } else if (selectedCurrency == "3") {
              getTokenAddr = usdt;
            } else if (selectedCurrency == "4") {
              getTokenAddr = usdc;
            }
            chainnnn = bep20abi;
          } else if (selectChains == 1) {
            if (chainId != ethChainId) {
              toast.dismiss();
              toast.error("Please change network to  Eth chain");
              return;
            }
            await getBalance();

            if (selectedCurrency == "1") {
              getTokenAddr = wbtcErc;
              chainnnn = wbtc20abi;
              updatetAmt = updatetAmt * 10 ** 8;
            } else if (selectedCurrency == "2") {
              chainnnn = usdterc20abi;

              getTokenAddr = usdtErc;
              updatetAmt = updatetAmt * 10 ** 6;
            } else if (selectedCurrency == "3") {
              chainnnn = usdcerc20abi;
              getTokenAddr = usdcErc;
              updatetAmt = updatetAmt * 10 ** 6;
            }
          } else if (selectChains == 2) {
            if (chainId != polygonChainId) {
              toast.dismiss();
              toast.error("Please change network to  Polygon chain");
              return;
            }
            await getBalance();

            if (selectedCurrency == "1") {
              getTokenAddr = usdtPolygon;
              chainnnn = usdterc20abi;
              updatetAmt = updatetAmt * 10 ** 6;
            } else if (selectedCurrency == "2") {
              chainnnn = usdcPolygonabi;

              getTokenAddr = usdcPolygon;
              updatetAmt = updatetAmt * 10 ** 6;
            }
          } else if (selectChains == 3) {
            if (chainId != arbitrumChainId) {
              toast.dismiss();
              toast.error("Please change network to  Arbitrum chain");
              return;
            }
            await getBalance();

            if (selectedCurrency == "1") {
              getTokenAddr = usdtArbitrum;
              chainnnn = usdtArbitrumAbi;
              updatetAmt = updatetAmt * 10 ** 6;
            } else if (selectedCurrency == "2") {
              getTokenAddr = usdcArbitrum;
              chainnnn = usdcArbitrumAbi;
              updatetAmt = updatetAmt * 10 ** 6;
            }
          } else if (selectChains == 4) {
            if (chainId != avalancheChainId) {
              toast.dismiss();
              toast.error("Please change network to  Avalanche chain");
              return;
            }
            await getBalance();

            if (selectedCurrency == "1") {
              getTokenAddr = usdtAvalanche;
              chainnnn = usdtAvalancheAbi;
              updatetAmt = updatetAmt * 10 ** 6;
            } else if (selectedCurrency == "2") {
              getTokenAddr = usdcAvalanche;
              chainnnn = usdcAvalancheAbi;
              updatetAmt = updatetAmt * 10 ** 6;
            }
          }

          const res = await checkUser({ address });
          if (res.status) {
            window.addEventListener("beforeunload", handleBeforeUnload);
            const valueInWeii = parseEther(inputamount.toString());
            let balance;

            let contract = new Contract(getTokenAddr, chainnnn, provider);

            if (selectChains == 0) {
              const contract = new Contract(getTokenAddr, chainnnn, provider);

              const checkA = (balance = await contract.allowance(
                address,
                selectAddress
              ));
              if (Number(checkA) / 10 ** 18 < tokenInput) {
                const contract = new Contract(getTokenAddr, chainnnn, provider);

                balance = await contract.approve(
                  selectAddress,
                  "10000000000000000000000000000000000000000000000000000"
                );
                await balance.wait();
                toast.success(" Approved Success");
              }
            } else if (selectChains == 1) {
              if (selectedCurrency == 1 || selectedCurrency == 3) {
                const contract = new Contract(getTokenAddr, chainnnn, provider);

                const checkA = (balance = await contract.allowance(
                  address,
                  selectAddress
                ));

                if (Number(checkA) / 10 ** 8 < tokenInput) {
                  balance = await contract.approve(
                    selectAddress,
                    "10000000000000000000000000000000000000000000000000000"
                  );
                }

                await balance.wait();
                toast.success(" Approved Success");
              } else if (selectedCurrency == 2) {
                const valueInWeii = updatetAmt.toString();

                try {
                  const contract = new Contract(
                    getTokenAddr,
                    chainnnn,
                    provider
                  );

                  const checkA = (balance = await contract.allowance(
                    address,
                    selectAddress
                  ));

                  if (Number(checkA) / 10 ** 6 < tokenInput) {
                    balance = await contract.approve(
                      selectAddress,
                      "10000000000000000000000000000000000000000000000000000"
                    );
                  }
                  await balance.wait();
                  toast.success(" Approved Success");
                } catch (error) {
                  console.log(error, "hhhhhhhhhhhh");
                }

                //
              }

              // }
              // approve (0x095ea7b3)
            } else if (
              selectChains == 2 ||
              selectChains == 3 ||
              selectChains == 4
            ) {
              if (selectedCurrency == 1 || selectedCurrency == 2) {
                const contract = new Contract(getTokenAddr, chainnnn, provider);

                const checkA = (balance = await contract.allowance(
                  address,
                  selectAddress
                ));

                if (Number(checkA) / 10 ** 6 < tokenInput) {
                  balance = await contract.approve(
                    selectAddress,
                    "10000000000000000000000000000000000000000000000000000"
                  );
                  await balance.wait();
                  toast.success(" Approved Success");
                }
              }
            }

            contract = new Contract(selectAddress, selectAbi, provider);

            if (selectChains == 0) {
              balance = await contract.buyWithToken(
                inputamount,
                selectedCurrency
              );
            } else {
              balance = await contract.buyWithToken(
                updatetAmt,
                selectedCurrency
              );
            }

            // const balances=  await balance.wait();

            const transactionHash = balance.hash;
            const referral_code = localStorage.getItem("referral_code");
            const data = {
              userAddress: address,
              chain: selectChains,
              currency: selectedCurrency,
              amount: tokenInput,
              tokenAmount: ukcInput,
              trans_id: transactionHash,
              reffer_from: referral_code,
            };
            const token = localStorage.getItem("jwtToken");
            const result = await metaRequestInsert(data, token);

            if (result.status) {
              window.removeEventListener("beforeunload", handleBeforeUnload);
              toast.dismiss("");
              toast.success(result.message);

              setTimeout(() => {
                window.location.reload();
              }, [10000]);
            } else {
              toast.dismiss("");
              toast.error(result.message);
            }
          } else {
            toast.error(res.message);
            localStorage.setItem("chain", selectChains);
            localStorage.setItem("currency", selectedCurrency);
            localStorage.setItem("tokenInput", tokenInput);
            localStorage.setItem("ukcInput", ukcInput);
            localStorage.setItem(
              "selectedCurrencyUserBalance",
              selectedCurrencyUserBalance
            );

            setTimeout(() => {
              navigate("/sign-up");
            }, 2000);
          }
        }
      } else {
        toast.dismiss();
        toast.error("Please connect with  wallet");
      }
    } catch (err) {
      console.log(err, "hh");
      if (
        err.message.includes(
          `execution reverted: "ERC20: insufficient allowance"`
        )
      ) {
        toast.error("Insufficient allowance");
      }
    }
  };

  const busdPrice = async (e) => {
    var busdAmt = e.target.value;

    settokenInput(busdAmt);
    let res;
    //await checkApproval();
    var getVal = selectedCurrency;

    if (getVal == "0") {
      res = (busdAmt * bnbPrice) / (tokenPrice * 100000000);
    } else {
      var otherTokenPrice = 1;

      if (getVal == "1") {
        otherTokenPrice = btcPrice;
      } else if (getVal == "2") {
        otherTokenPrice = ethPrice;
      }
      res = (busdAmt * otherTokenPrice) / tokenPrice;

      if (selectChains == "1") {
        if (getVal == "2") {
          res = (busdAmt * 1) / tokenPrice;
        }
      }
      if (selectChains == "2" || selectChains == "3" || selectChains == "4") {
        if (getVal == "1" || getVal == "2") {
          res = (busdAmt * 1) / tokenPrice;
        }
      }
    }

    res = res.toFixed(2);
    console.log(res, "res0000");

    setukcInput(res);
  };

  const getTotalSupply = async () => {
    try {
      let provider = new JsonRpcProvider(EthRpc);

      let contract = new Contract(tokenAddress, tokenAbi, provider);

      let balance = await contract?.totalSupply();

      balance = Number(balance);

      balance = balance / 10 ** 18;

      setTotalSupply(balance);
    } catch (error) {
      console.error("An error occurred while getting total supply:", error);
    }
  };

  const reverceBusdPrice = async (e) => {
    var tokenAmt = e.target.value;
    let res;
    tokenAmt = tokenAmt.toFixed(2);
    setukcInput(tokenAmt);
    var getVal = selectedCurrency;

    if (getVal == "0") {
      res = (tokenAmt * 100000000 * tokenPrice) / bnbPrice;
    } else {
      var otherTokenPrice = 1;
      if (getVal == "1") {
        otherTokenPrice = btcPrice;
      } else if (getVal == "2") {
        otherTokenPrice = ethPrice;
      }
      if (selectChains == "1") {
        if (getVal == "2") {
          res = (tokenAmt * 1) / tokenPrice;
        }
      }
      res = (tokenAmt * tokenPrice) / otherTokenPrice;
    }

    res = res.toFixed(8);
    settokenInput(res);
  };

  const getAllPrice = async () => {
    try {
      let provider;
      if (selectChains == 0) {
        provider = new JsonRpcProvider(bscRpc);
      } else if (selectChains == 1) {
        provider = new JsonRpcProvider(EthRpc);
      } else if (selectChains == 2) {
        provider = new JsonRpcProvider(polygonRpc);
      } else if (selectChains == 3) {
        provider = new JsonRpcProvider(arbitrumRpc);
      } else if (selectChains == 4) {
        provider = new JsonRpcProvider(avalancheRpc);
      }

      const contract = new Contract(selectAddress, selectAbi, provider);

      const result = await contract.allPrice();

      let bnbPrice = Number(result[0]); //bnbPRice

      let tokenPrice = Number(result[1]);

      let tokenPriceDecimalVal = Number(result[2]);
      let tokenPriceDecimal = Math.pow(10, tokenPriceDecimalVal);
      let price = tokenPrice / tokenPriceDecimal;
      let priceLatest = Number(price)
        .toFixed(tokenPriceDecimalVal)
        .replace(/\.?0+$/, "");

      let wbtcTokenPrice = Number(result[3]);
      let wbtcTokenPriceDecimalVal = Number(result[4]);
      let wbtcTokenPriceDecimal = Math.pow(10, wbtcTokenPriceDecimalVal);
      let wbtcPrice = wbtcTokenPrice / wbtcTokenPriceDecimal;

      let wbtcPriceLatest = Number(wbtcPrice)
        .toFixed(wbtcTokenPriceDecimalVal)
        .replace(/\.?0+$/, "");

      let wethTokenPrice = Number(result[5]);
      let wethTokenPriceDecimalVal = Number(result[6]);
      let wethTokenPriceDecimal = Math.pow(10, wethTokenPriceDecimalVal);
      var wethPrice = wethTokenPrice / wethTokenPriceDecimal;
      let wethPriceLatest = Number(wethPrice)
        .toFixed(wethTokenPriceDecimalVal)
        .replace(/\.?0+$/, "");

      setbnbPrice(bnbPrice);
      setethPrice(wethPriceLatest);
      setbtcPrice(wbtcPriceLatest);
      settokenPrice(priceLatest);
    } catch (err) {
      // console.error(err);
    }
  };

  useEffect(() => {
    if (
      (isConnected && chainId == binanceChainId) ||
      (isConnected && chainId == ethChainId) ||
      (isConnected && chainId == polygonChainId) ||
      (isConnected && chainId == arbitrumChainId) ||
      (isConnected && chainId == avalancheChainId)
    ) {
      getAllPrice();
      getBalance();
      getTotalSupply();

      if (chainId != binanceChainId) {
      }
    }

    if (!isConnected) {
      localStorage.removeItem("jwtToken");
      setSelectedCurrency("");
      setukcInput("");
      settokenInput("");
      setuserUkcBalance("");
      setselectedCurrencyUserBalance("");
      $("#currency_id").val("");
      $("#table_body").html();
    }
  }, [tokenInput, address, selectChains, selectedCurrency]);
  const authUserData = async () => {
    // console.log(address, "address00554");
    if (address && address) {
      const data = await authUser({ address });
      localStorage.setItem("jwtToken", data.token);
      // console.log(data.token, "ujyhbhb");
    }
  };
  useEffect(() => {
    authUserData();
  }, [address]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const localAddress = localStorage.getItem("address");

      if (isConnected && localAddress !== address) {
        localStorage.setItem("address", address);

        window.location.reload();
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isConnected, address]);

  const validNumber = (e) => {
    if (!/[\d.]/.test(e.key)) {
      e.preventDefault();
    }
  };
  const handleOnChanges = (value, country) => {
    setMobile_number(value);

    let adjustedMobile = value.startsWith(country.dialCode)
      ? value.replace(country.dialCode, "")
      : value;

    if (!adjustedMobile) {
      setMobile_numberErr("Mobile Number is required");
    } else {
      setMobile_numberErr("");
    }
    setNumber(adjustedMobile);
    setCountry_code("+" + country.dialCode);
  };
  const registerHandler = async () => {
    if (!name) {
      setNameErr("Name is required");
      return;
    }
    if (!email) {
      setEmailErr("This field is required");
      return;
    }
    if (!Emailpattern.test(email)) {
      setEmailErr("Please enter valid email");
      return;
    }
    if (!number) {
      setMobile_numberErr("This field is required");
      return;
    }

    // const address = localStorage.getItem("address");
    // if (!address) {
    //   return toast.error("Please connect with metamusk");
    // }

    let data = {
      name,
      email,
      mobile_number: number,
      country_code,
    };

    const result = await registerUser(data);
    if (result.status) {
      let token = result.token;
      localStorage.setItem("jwtToken", token);

      setTimeout(() => {
        navigate("/#buy-now", { replace: true });
        setTimeout(() => {
          window.scrollTo(0, window.scrollY);
        }, 100);
      }, 2000);

      toast.success(result.message);
      setName("");
      setCountry_code(" ");
      setEmail("");
      setMobile_number("");
    } else {
      toast.error(result.message);
    }
  };

  const homeRef = useRef(null);
  const tokenomicsRef = useRef(null);
  const faqRef = useRef(null);
  const roadmapRef = useRef(null);
  const aboutUsRef = useRef(null);
  const buynowRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (params.walletAddress) {
      getUSerReferralCode(params.walletAddress);
    } else {
      setLoaderStatus(false);
      setMainLoaderStatus(false);
    }
  }, [params.walletAddress]);

  useEffect(() => {
    if (location.hash || homeRef.current) {
      const targetRef =
        location.hash === "#about-us"
          ? aboutUsRef
          : location.hash === "#tokenomics"
          ? tokenomicsRef
          : location.hash === "#faq"
          ? faqRef
          : location.hash === "#roadmap"
          ? roadmapRef
          : location.hash === "#buy-now"
          ? buynowRef
          : location.hash === "/"
          ? homeRef
          : null;
      if (targetRef && !loaderStatus) {
        targetRef.current.scrollIntoView({ behavior: "auto", block: "start" });
      }
      // if (targetRef) {
      //   targetRef.current.scrollIntoView({ behavior: "auto", block: "start" });
      // }
    }else {
      if (!loaderStatus) {
        const targetRef = homeRef;
       
        window.scrollTo(0, 0);
      }
    }
  }, [location.hash, loaderStatus]);

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const scrollToHome = () => {
    if (homeRef.current) {
      homeRef.current.scrollIntoView({ behavior: "smooth" });
    }
    $(document).ready(function () {
      $("#toggler1").toggleClass("collapsed");
    });
  };
  const scrollToAbout = () => {
    if (aboutUsRef.current) {
      aboutUsRef.current.scrollIntoView({ behavior: "smooth" });
    }
    $(document).ready(function () {
      $("#toggler1").toggleClass("collapsed");
    });
  };
  const scrollToTokenomics = () => {
    if (tokenomicsRef.current) {
      tokenomicsRef.current.scrollIntoView({ behavior: "smooth" });
    }
    $(document).ready(function () {
      $("#toggler1").toggleClass("collapsed");
    });
  };
  const scrollToFaq = () => {
    if (faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: "smooth" });
    }
    $(document).ready(function () {
      $("#toggler1").toggleClass("collapsed");
    });
  };
  const scrollTobuynow = () => {
    if (buynowRef.current) {
      // buynowRef.current.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({ behavior: "smooth", top: 950 });
    }
    $(document).ready(function () {
      $("#toggler1").toggleClass("collapsed");
    });
  };
  const scrollToRoadmap = () => {
    if (roadmapRef.current) {
      roadmapRef.current.scrollIntoView({ behavior: "smooth" });
    }
    $(document).ready(function () {
      $("#toggler1").toggleClass("collapsed");
    });
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  //============== for chain changes ==============//
  const handleChange = (e) => {
    const err = "This field is required";
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
      if (value === "") {
        setNameErr("Name is required");
      } else {
        setNameErr("");
      }
    }
    if (name == "email") {
      setEmail(value);

      if (value == "") {
        setEmailErr(err);
      } else {
        if (!Emailpattern.test(value)) {
          setEmailErr("Please enter valid email");
        } else {
          setEmailErr("");
        }
      }
    }
    if (name == "mobile_number") {
      setMobile_number(value);

      if (value === "") {
        setMobile_numberErr("Mobile Number is required");
      } else {
        setMobile_numberErr("");
      }
    }
  };
  const chainImages = [
    "/img/bnb-white.png",
    "/img/eth-white.png",
    "/img/polygon-white.png",
    "/img/arbitrum-white.png",
    "/img/avalanche-white.png",
    // "/img/optimism-white.png",
    // "/img/fantom-white.png",
  ];

  const handleSelectChain = (index) => {
    setSelectedChain(index);
  };
  const chainButtons = [
    { index: "0", imgSrc: "/img/bnb-white.png", alt: "bnb" },
    { index: "1", imgSrc: "/img/eth-white.png", alt: "usdt" },
    { index: "2", imgSrc: "/img/polygon-white.png", alt: "polygon" },
    // { index: "3", imgSrc: "/img/arbitrum-white.png", alt: "arbitrum" },
    { index: "4", imgSrc: "/img/avalanche-white.png", alt: "avalanche" },
    // { index: "5", imgSrc: "/img/optimism-white.png", alt: "optimism" },
    // { index: "6", imgSrc: "/img/fantom-white.png", alt: "fantom" },
  ];
  const copyToClipboard = (address) => {
    if (address) {
      copy(copyUrl + referral_code);
      setCopyText("Copied");
    }
  };
  const getUSerReferralCode = async (referral) => {
    let data = {
      referral_code: referral,
    };

    const result = await getUSerReferral(data);
    if (result.status) {
      localStorage.setItem("referral_code", params.walletAddress);
      setLoaderStatus(false);
      setMainLoaderStatus(false);
    } else {
      setLoaderStatus(true);
      setMainLoaderStatus(true);
    }
  };

  //============== for chain changes ==============//
  return (
    <>
      {loaderStatus ? (
        <h2> {mainloaderStatus ? "Invalid URL" : ""}</h2>
      ) : (
        <div className="overflow-hidden">
          <section className="bg2 position-relative">
            <img className="bg11" src="/img/bg2.jpg" alt="bg" />
            <Navbar
              scrollToHome={scrollToHome}
              scrollToAbout={scrollToAbout}
              scrollToTokenomics={scrollToTokenomics}
              scrollToFaq={scrollToFaq}
              scrollToRoadmap={scrollToRoadmap}
              scrollTobuynow={scrollTobuynow}
            />
            <Header scrollTobuynow={scrollTobuynow} />
            <div id="scroll-to-top">
              <i className="bi bi-chevron-up fa-fw" />
            </div>

            {/* <section className="logos p70 pb-2 pb-md-5 mb-md-2">
            <Slider {...settings}>
              <div style={{ margin: "0 10px", display: "inline-block" }}>
                <img
                  className="img-fluid"
                  src="/img/binance-logo.png"
                  alt="binance-logo.png"
                />
              </div>
              <div style={{ margin: "0 10px", display: "inline-block" }}>
                <img
                  className="img-fluid"
                  src="/img/nasdaq-logo.png"
                  alt="nasdaq-logo"
                />
              </div>
              <div style={{ margin: "0 10px", display: "inline-block" }}>
                <img
                  className="img-fluid"
                  src="/img/bloomberg.png"
                  alt="bloomberg"
                />
              </div>
              <div style={{ margin: "0 10px", display: "inline-block" }}>
                <img
                  className="img-fluid"
                  src="/img/yahoo_news_logo.png"
                  alt="yahoo_news_logo.png"
                />
              </div>
              <div style={{ margin: "0 10px", display: "inline-block" }}>
                <img
                  className="img-fluid"
                  src="/img/cointelegraph.png"
                  alt="Cointelegraph"
                />
              </div>
            </Slider>
          </section> */}

            <section
              className="ex_box p70  "
              onClick={scrollTobuynow}
              id="buy-now"
              ref={buynowRef}
            >
              <div className="container  position-relative">
                <img
                  src="/img/bg-tl.png"
                  alt="bg-tl "
                  className="app_coins position-absolute"
                />

                <div className="token_address">
                  <a
                    href="https://etherscan.io/address/0x228ce526d70cd1d7853edfc39aa84e5e3438f4fc"
                    target="_blank"
                    style={{ color: "black" }}
                  >
                    <div className="home_profile_text">
                      Token Address: {tokenAddress}
                    </div>
                  </a>
                  {/* <div className="home_profile_text">
                    Token Address: 0x228ce526d70cd1d7853edfc39aa84e5e3438f4fc
                  </div> */}
                </div>
                <div
                  className="ex_box_in box70 position-relative box token_info_man"
                  id="buy-now"
                  ref={buynowRef}
                  // onClick={scrollTobuynow}
                >
                  {/* <div className="d-flex align-items-center">
                      

                        <div className="home_profile_right text-right ml-auto">
                          <h4 className="color1 mb-0">
                            1 <span className="ffa"></span>GWIZ = $
                            {tokenPrice ? tokenPrice : "0.01"}
                          </h4>
                        </div>
                      </div> */}

                  {/* Balance :
                        <span id="busd_balance">
                          {selectedCurrencyUserBalance
                            ? selectedCurrencyUserBalance
                            : "0"}
                        </span> */}
                  <div className="home_profile_text mb-3">
                    <span className="btn p-0 border0">
                      <w3m-button balance="hide" />
                    </span>
                  </div>
                  <h3 className="fw800 mo_f22">GASWIZARD TOKEN PRESALE</h3>
                  <div className="mt-2">
                    <h6 className="mb-0 d-inline-block">USDT RAISED:</h6>
                    <span className="t_gr value_ex f_dgo">
                      <span className="ffa "> $ </span>
                      {totalUsdt ? formattedTotalUsdt : "0"}
                      {/* /400,000,000 */}
                    </span>
                  </div>
                  {/* <div className="">
                    <h6 className="mb-0 d-inline-block">TOTAL TOKENS SOLD :</h6>
                    <span className="t_gr value_ex f_dgo">
                      <span className="ffa"> GWIZ </span>
                     {totalToken?formattedTotalToken:0}
             
                    </span>
                  </div> */}
                  <div className="">
                    <h6 className="mb-0 d-inline-block">TOKEN PRICE:</h6>
                    <span className="t_gr value_ex f_dgo">
                      <span className="ffa"> $</span>
                      0.001
                      {/* {totalUsdt ? formattedTotalUsdt : "0"} */}
                    </span>
                  </div>
                  <div className="">
                    <h6 className="mb-0 d-inline-block">LISTING PRICE:</h6>
                    <span className="t_gr value_ex f_dgo">
                      <span className="ffa"> $</span>
                      0.05
                      {/* {totalUsdt ? formattedTotalUsdt : "0"} */}
                    </span>
                  </div>

                  {/*                             
                        
                        
                     
                      <h6 className="text-center mb-1 mt-4">
                        Bonus Token: {bonus ? bonus : "0"}
                      </h6>*/}

                  <div className="pt-3">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="progress mb-1 mt-md-0">
                          <div
                            className="progress-bar"
                            style={{
                              width: totalSupply
                                ? `${
                                    parseInt((totalToken * 100) / 400000000) %
                                    100
                                  }%`
                                : "0%",
                            }}
                          >
                            <span className="pp">
                              {totalSupply
                                ? parseInt((totalToken * 100) / 400000000)
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                        <h6 className=" mb-3 ">
                          Referral Bonus Token:
                          {referralBonus ? referralBonus : "0"}
                        </h6>
                      </div>

                      <div className="col-md-6">
                        <div className="btn btn3 mb-3 w100 cip">Stage 1</div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group ex_input_box position-relative">
                          <span className="label_po">YOU PAY</span>
                          <input
                            // type="number"
                            onKeyPress={validNumber}
                            step="0.1"
                            onChange={busdPrice}
                            min="0"
                            placeholder="0"
                            value={tokenInput}
                            id="busdAmtIdo"
                            className="input_item"
                          />

                          <img
                            src={chainImages[selectChains]}
                            alt="Chain Logo"
                            className="in_icon position-absolute"
                            onClick={() => handleSelectChain(selectChains)}
                          />
                          <select
                            class=" select_dark "
                            onChange={(e) => selectCurrency(e)}
                            id="currency_id"
                            name="currency_id"
                            value={selectedCurrency}
                          >
                            <option value="">Select Currency</option>
                            {selectChains == 0 ? (
                              <>
                                <option value="0">BNB</option>
                                <option value="1">WBTC (BEP20)</option>
                                <option value="2">WETH (BEP20)</option>
                                <option value="3">USDT (BEP20)</option>
                                <option value="4">USDC (BEP20)</option>
                              </>
                            ) : selectChains == 1 ? (
                              <>
                                <option value="0">ETH</option>
                                <option value="1">WBTC (ERC20)</option>
                                <option value="2">USDT (ERC20)</option>
                                <option value="3">USDC (ERC20)</option>
                              </>
                            ) : selectChains == 2 ? (
                              <>
                                <option value="0">MATIC</option>
                                <option value="1">USDT (polygon)</option>
                                <option value="2">USDC (polygon)</option>
                              </>
                            ) : selectChains == 3 ? (
                              <>
                                <option value="0">ARB</option>
                                <option value="1">USDT (ARB)</option>
                                <option value="2">USDC (ARB)</option>
                              </>
                            ) : selectChains == 4 ? (
                              <>
                                <option value="0">AVAX</option>
                                <option value="1">USDT (AVAX)</option>
                                <option value="2">USDC (AVAX)</option>
                              </>
                            ) : null}
                          </select>
                        </div>

                        <div className="form-group ex_input_box position-relative">
                          <span className="label_po">YOU GET</span>
                          <input
                            // type="number"
                            class="reverceBusdPrice"
                            onChange={reverceBusdPrice}
                            min="0"
                            placeholder="0"
                            value={
                              ukcInput == "NaN" || ukcInput == "NaN"
                                ? "0"
                                : ukcInput
                            }
                            disabled
                            id="tokenAmtIdo2"
                            className="input_item"
                          />
                          <img
                            src="img/coin_logo.png"
                            alt="Chain Logo"
                            className="in_icon position-absolute"
                          />
                          <span className="select_dark">$GWIZ</span>
                        </div>

                        <div className="mb-2 text-center">
                          <button
                            className="btn w100"
                            id="btn-connect-wallet"
                            onClick={buy}
                          >
                            {buyBtnText}
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="tab_btn d-flex mb-3">
                          {chainButtons.map(({ index, imgSrc, alt }) => (
                            <button
                              key={index}
                              onClick={() => selectChain(index)}
                              className={selectChains === index ? "active" : ""}
                            >
                              <img src={imgSrc} alt={alt} />
                            </button>
                          ))}
                        </div>

                        <a
                          href="/transaction-details"
                          className="btn  w100  "
                          id="btn-connect-wallet"
                        >
                          TRANSACTION DASHBOARD
                        </a>

                        <a
                          href="https://github.com/Coinsult/solidity/blob/main/Coinsult_GasWizard_0x22...f4fc_Audit.pdf"
                          className="btn btn3 w100 mt-3"
                          target="_blank"
                          id="btn-connect-wallet"
                        >
                          <span className="text-right d-inline-block">
                            VIEW AUDIT FILE
                            <br />
                            <small>GWIZ x Coinsult</small>
                          </span>
                        </a>
                        <div className="d-flex p-2 fw800">
                          <span>100% SECURE</span>
                          <span className="ml-auto">AUDITED BY COINSULT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              className=" p70   mmu_man"
              data-scroll-index={1}
              id="about-us"
              ref={aboutUsRef}
            >
              <div className="container  position-relative">
                <div className="row">
                  <div className="col-md-10 m-auto">
                    <h2 className="text-md-right hadding  mb-0 ttu">
                      Meme <br />
                      meets <br />
                      utility
                    </h2>
                    <p className="ttu text-md-right sub_hadding">
                      with Gas Wizard Tokens!{" "}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-5 ml-auto">
                    <div className="box p80_75  mmu1 font23 h100">
                      <span className="token_mame">
                        {" "}
                        <img src="/img/token.png" alt="token " className=" " />
                      </span>
                      <br />
                      <p className="pt-5">
                        Welcome to GasWizard AI, where tech wizardry meets meme
                        magic!
                      </p>{" "}
                      <p className="mb-0">
                        Our app not only predicts gas prices with mind-blowing
                        accuracy using cutting-edge machine learning but also
                        turns your fuel planning into a fun and rewarding
                        adventure.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-5 mr-auto ">
                    <div className="box p80_75 font23 h100">
                      <p>
                        Bet on price changes to win GWIZ tokens, our epic
                        memecoin, and dive into hilarious play-to-earn games.
                      </p>{" "}
                      <p className="mb-0">
                        Rev up your excitement with our car racing game, where
                        you can speed your way to more GWIZ tokens.
                      </p>
                    </div>
                  </div>
                </div>
                <img src="/img/mmu.png" alt="token " className="mmu_p" />
              </div>
            </section>

            <section className="p70 pb-0">
              <div className="container  position-relative">
                <div className="row">
                  <div className="col-md-10 m-auto">
                    <h2 className=" hadding  mb-4 ttu">
                      WHAT IS <br />
                      THIS ABOUT?
                    </h2>
                  </div>
                </div>
                <div className="row text-center">
                  <div className="col-md-4 ">
                    <div className="wita">
                      <img
                        src="/img/erg1.png"
                        alt="erg"
                        className="img-fluid mb-4"
                      />
                      <h4>Earn More with GasWizard</h4>
                      <p>
                        Copy your referral link below and earn an additional 10%
                        for every purchase made through your link. Click here to
                        generate your referral link.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 ">
                    <div className="wita">
                      <img
                        src="/img/erg2.png"
                        alt="erg"
                        className="img-fluid mb-4"
                      />
                      <h4>Race for Riches</h4>
                      <p>
                        Step into the fantastical realm of GasWizard, where
                        thrilling car races and magical adventures await!
                        Compete against fellow wizards in adrenaline-pumping
                        races across mystical landscapes to collect GWIZ tokens.
                        Upgrade your vehicle, outmaneuver rivals, and aim to
                        become the ultimate GasWizard Champion.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="wita">
                      <img
                        src="/img/erg3.png"
                        alt="erg"
                        className="img-fluid mb-4"
                      />
                      <h4>GasWizard AI Fuel Price Prediction</h4>
                      <p>
                        GasWizard AI revolutionizes fuel price forecasting with
                        advanced AI technologies, providing accurate, timely
                        predictions globally. Integrated into the GasWizard app,
                        alongside the exciting GWIZ play-to-earn game, it
                        creates a dynamic and engaging ecosystem.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>
          <section className=" position-relative">
            <img className="bg11 t-18" src="/img/bg12.jpg" alt="bg" />
            <section
              className="p70 "
              // data-scroll-index={2}
              id="tokenomics"
              ref={tokenomicsRef}
            >
              <div className="container mt-md-5">
                <div className="row mb-4 mb-md-5">
                  <div className="col-md-10 m-auto">
                    <p class="ttu  sub_hadding mb-0">It’s always about the </p>
                    <h2 className=" hadding  ttu hadding100">tokenomics</h2>
                  </div>
                </div>

                <div className="box2  justify-content-center  position-relative">
                  <div className="p-md-5 ml-md-5 pb-4">
                    <img
                      src="/img/tokenomics.png"
                      alt="tokenomics"
                      className="img-fluid"
                    />
                  </div>
                  <div className="token_contract_item f_dgo">
                    <span className="tbg tbg1">Presale Bonus and Airdrop</span>
                    <span className="tbg tbg2">Staking Rewards</span>
                    <span className="tbg tbg3">Marketing</span>
                    <br />
                    <span className="tbg tbg4">Exchange and Liquidity</span>
                    <span className="tbg tbg5">Community Rewards</span>
                    <span className="tbg tbg6">Presale</span>
                  </div>

                  <img
                    src="/img/tokenomics_r.png"
                    alt="tokenomics"
                    className="tokenomics_img"
                  />
                </div>
              </div>
            </section>

            <section className="roadmap p70">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h2 className=" hadding  ttu app_text  mb-0">
                      GWIZ
                      <br />
                      APP
                    </h2>
                    <img
                      src="/img/app.png"
                      alt="app"
                      className=" img-fluid app"
                    />
                  </div>
                  <div className="col-md-7  text-right mr-auto ">
                    <h2 className=" hadding  text-right ttu  app_text2  mb-0">
                      P2E <br />
                      Game
                    </h2>
                    <img
                      src="/img/app2.png"
                      alt="app"
                      className=" img-fluid app"
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-10 m-auto font23 ">
                    <div className=" text-center box font23 ">
                      <p>
                        Step into the fantastical realm of GasWizard, where
                        thrilling <br />
                        car races and magical adventures await!
                      </p>
                      <p>
                        Compete against fellow wizards in adrenaline-pumping{" "}
                        <br /> races across mystical landscapes to collect GWIZ
                        tokens.
                      </p>
                      <p className="mb-0">
                        Upgrade your vehicle, outmaneuver rivals, and aim to{" "}
                        <br /> become the ultimate GasWizard Champion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="roadmap p70 mt-md-5"
              data-scroll-index={4}
              id="roadmap"
              ref={roadmapRef}
            >
              <div className="container  position-relative ">
                <div className="row">
                  <div className="col-md-11 m-auto">
                    <h2 className="hadding hadding140  mb-3 ttu">
                      {" "}
                      ROAD <br />
                      MAP{" "}
                    </h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-9 mr-auto ">
                    <div className="box roadmap_box">
                      <div className="row">
                        <div className="col-md-8">
                          <Slider {...settings}>
                            <div>
                              <h3 className="f_dgo text-center">STAGE 1</h3>
                              <h5 className=" text-center mb-4">
                                The Concept (Q1-Q2 2024)
                              </h5>

                              <ul>
                                <li>
                                  Gas Wizard website launch preparation, Presale
                                  website launch, Build Telegram community,
                                  Launch socials.
                                </li>
                                <li>
                                  Launch of worldwide presale marketing
                                  campaigns.
                                </li>
                                <li>
                                  Build GWIZ token on Ethereum blockchain and
                                  submit for audit
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h3 className="f_dgo text-center">STAGE 2</h3>
                              <h5 className=" text-center mb-4">
                                Public Presale (Q3-Q4 2024)
                              </h5>
                              <ul>
                                <li>Commencement of public presale </li>
                                <li>Listing on CoinMarketCap and CoinGecko</li>
                                <li>GWIZ Token Audit</li>
                                <li>Listing on Uniswap V3</li>
                                <li>KOL marketing campaign</li>
                                <li>Release of GWIZ P2E for presale buyers</li>
                              </ul>
                            </div>
                            <div>
                              <h3 className="f_dgo text-center">STAGE 3</h3>
                              <h5 className=" text-center mb-4">
                                Listings and Releases (Q1 2025)
                              </h5>
                              <ul>
                                <li>
                                  Public launch of Gas Wizard mobile Play 2 Earn
                                  Game
                                </li>
                                <li>Staking Launch</li>
                                <li>
                                  Launch of GasWizard AI Price Prediction App{" "}
                                </li>
                                <li>Listing on Tier 2 CEX </li>
                                <li>
                                  Commencement of Phase 2 Marketing campaigns
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h3 className="f_dgo text-center">STAGE 4</h3>
                              <h5 className=" text-center mb-4">Growth</h5>
                              <ul>
                                <li>List on Tier 1 CEX</li>
                                <li>Worldwide KOL Blast</li>
                                <li>Reach 100,000 App users </li>
                                <li>The Moon</li>
                              </ul>
                            </div>
                          </Slider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <img
                  src="/img/petrol.png"
                  alt="token "
                  className="petrol_img"
                />
              </div>
            </section>
          </section>

          <section className=" position-relative">
            <img className="bg11" src="/img/bg11.jpg" alt="bg" />
            <section className="overflow-hidden p70 ">
              <div className="container">
                <h3 className="hadding hadding100 mb-4 mb-md-5 f_dgo ttu text-center">
                  Referral
                  <br />
                  Bonus
                </h3>
                <div className="ex_box_in earn_more_box position-relative box p-md-5 br60">
                  <div className="row align-items-center mt-md-4 mb-md-4">
                    <div className="col-lg-4 pr-lg-0">
                      <h3 className="  h3_mobile mb-3 f_dgo mb-md-4">
                        Earn more $GWIZ
                        <br />
                        by referring your friends and community
                      </h3>

                      <p className=" ">
                        Share your unique link below and recieve 10% of all
                        transactions realized with your link instantly
                      </p>
                      <div className="referr_box">
                        <p className="mb-0">
                          {address
                            ? `${copyUrl}${referral_code}`
                            : "Connect Wallet for Referral Link"}
                        </p>

                        <button
                          class="btn ml-auto"
                          onClick={() => {
                            copyToClipboard(address);
                          }}
                        >
                          <i class="bi bi-copy mr-2"></i>
                          {copyText}
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-4 pt-4 p-lg-0">
                      <img
                        src="/img/token.png"
                        alt="token "
                        className="img-fluid token_logo_referr"
                      />
                    </div>
                    <div className="col-lg-4 pt-4 ">
                      <h3 className="earn_font f_dgo">
                        10%
                        <br />
                        Bonus
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="faq p70 "
              data-scroll-index={5}
              id="faq"
              ref={faqRef}
            >
              <div className="container ">
                <h2 className="hadding hadding100 text-center mb-4">FAQs</h2>
                <div className="row ">
                  <div className="col-lg-6">
                    <div
                      className="accordion md-accordion style-2"
                      id="accordionEx"
                      role="tablist"
                      aria-multiselectable="true"
                    >
                      <div className="card">
                        <div
                          className="card-header"
                          role="tab"
                          id="headingOne1"
                        >
                          <a
                            className="collapsed"
                            data-toggle="collapse"
                            data-parent="#accordionEx"
                            href="#collapseOne1"
                            aria-expanded="true"
                            aria-controls="collapseOne1"
                          >
                            What payment methods can I use to buy GWIZ?
                          </a>
                        </div>
                        {/* Card body */}
                        <div
                          id="collapseOne1"
                          className="collapse "
                          role="tabpanel"
                          aria-labelledby="headingOne1"
                          data-parent="#accordionEx"
                        >
                          <div className="card-body">
                            You can use a variety of cryptocurrency such as ETH,
                            BNB, MATIC, AVAX, USDT, USDC and more.
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div
                          className="card-header"
                          role="tab"
                          id="headingTwo2"
                        >
                          <a
                            className="collapsed"
                            data-toggle="collapse"
                            data-parent="#accordionEx"
                            href="#collapseTwo2"
                            aria-expanded="false"
                            aria-controls="collapseTwo2"
                          >
                            What is GasWizard?
                          </a>
                        </div>
                        <div
                          id="collapseTwo2"
                          className="collapse"
                          role="tabpanel"
                          aria-labelledby="headingTwo2"
                          data-parent="#accordionEx"
                        >
                          <div className="card-body">
                            GasWizard is an ecosystem where meme, AI and
                            functionality meet together.
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div
                          className="card-header"
                          role="tab"
                          id="headingTwo4"
                        >
                          <a
                            className="collapsed"
                            data-toggle="collapse"
                            data-parent="#accordionEx"
                            href="#collapseTwo4"
                            aria-expanded="false"
                            aria-controls="collapseTwo4"
                          >
                            When do I receive my GWIZ tokens?
                          </a>
                        </div>
                        <div
                          id="collapseTwo4"
                          className="collapse"
                          role="tabpanel"
                          aria-labelledby="headingTwo2"
                          data-parent="#accordionEx"
                        >
                          <div className="card-body">
                            After purchase, you can use the same wallet to claim
                            your GWIZ tokens before the exchange listings.
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div
                          className="card-header"
                          role="tab"
                          id="headingTwo5"
                        >
                          <a
                            className="collapsed"
                            data-toggle="collapse"
                            data-parent="#accordionEx"
                            href="#collapseTwo5"
                            aria-expanded="false"
                            aria-controls="collapseTwo5"
                          >
                            Can I stake GWIZ?
                          </a>
                        </div>
                        <div
                          id="collapseTwo5"
                          className="collapse"
                          role="tabpanel"
                          aria-labelledby="headingTwo5"
                          data-parent="#accordionEx"
                        >
                          <div className="card-body">
                            Staking involves locking your GWIZ tokens into a
                            smart contract for a specified period. This allows
                            you to earn additional GWIZ tokens at a variable
                            rate over time. GWIZ staking will be introduced upon
                            listing. More information here.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div
                      className="accordion md-accordion style-2"
                      id="accordionEx2"
                      role="tablist"
                      aria-multiselectable="true"
                    >
                      <div className="card">
                        <div
                          className="card-header"
                          role="tab"
                          id="headingTwo6"
                        >
                          <a
                            className="collapsed"
                            data-toggle="collapse"
                            data-parent="#accordionEx2"
                            href="#collapseTwo6"
                            aria-expanded="false"
                            aria-controls="collapseTwo6"
                          >
                            Is there any BUY/SELL tax?
                          </a>
                        </div>
                        <div
                          id="collapseTwo6"
                          className="collapse"
                          role="tabpanel"
                          aria-labelledby="headingTwo6"
                          data-parent="#accordionEx2"
                        >
                          <div className="card-body">
                            No buy or sell tax is applicable to your tokens.
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div
                          className="card-header"
                          role="tab"
                          id="headingTwo61"
                        >
                          <a
                            className="collapsed"
                            data-toggle="collapse"
                            data-parent="#accordionEx2"
                            href="#collapseTwo61"
                            aria-expanded="false"
                            aria-controls="collapseTwo61"
                          >
                            Are there any bonuses for purchasing GWIZ tokens
                            during presale?
                          </a>
                        </div>
                        <div
                          id="collapseTwo61"
                          className="collapse"
                          role="tabpanel"
                          aria-labelledby="headingTwo61"
                          data-parent="#accordionEx2"
                        >
                          <div className="card-body">
                            Yes, there is a bonus for early investors. A 10%
                            bonus is available for the first 10 days after a new
                            presale stage starts.
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div
                          className="card-header"
                          role="tab"
                          id="headingTwo62"
                        >
                          <a
                            className="collapsed"
                            data-toggle="collapse"
                            data-parent="#accordionEx2"
                            href="#collapseTwo62"
                            aria-expanded="false"
                            aria-controls="collapseTwo62"
                          >
                            What is the strategy for unsold tokens?
                          </a>
                        </div>
                        <div
                          id="collapseTwo62"
                          className="collapse"
                          role="tabpanel"
                          aria-labelledby="headingTwo62"
                          data-parent="#accordionEx2"
                        >
                          <div className="card-body">
                            Any unsold tokens will be burned prior launch during
                            a community live event
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="ex_box siup_section p70  new_footer">
              <div className="container  position-relative mt-md-5 mb-md-5">
                <div className="ex_box_in position-relative ">
                  <img
                    src="/img/signin.png"
                    alt="token "
                    className="img-fluid signin"
                  />
                  <div className="row align-items-center">
                    <div className="col-md-7 ">
                      <div className=" lh70 mb-4">
                        <h3 className="hadding hadding60 ttu mb-3 mb-md-4">
                          sign up for <br />
                          $GWIZ airdrop{" "}
                        </h3>
                      </div>
                      <div className="form-group ex_input_box position-relative mb-md-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter  User Name"
                          class="input_item2"
                          value={name}
                          onChange={handleChange}
                        />
                        <span className="text-danger">{nameErr}</span>
                      </div>
                      <div className="form-group ex_input_box position-relative mb-md-4">
                        <input
                          type="text"
                          name="email"
                          placeholder="Enter  Email"
                          class="input_item2"
                          value={email}
                          onChange={handleChange}
                        />
                        <span className="text-danger">{emailErr}</span>
                      </div>
                      <div className="form-group ex_input_box position-relative mb-md-4">
                        <PhoneInput
                          key={"phoneInput"}
                          country="IND"
                          value={mobile_number}
                          onChange={handleOnChanges}
                          className="input_item2"
                          placeholder="Email/Mobile"
                          countryCodeEditable={false}
                          enableSearch={true}
                          inputProps={{
                            autoFocus: true,
                            name: "mobile_number",
                          }}
                          // disabled={disableGetCode}
                        />
                        <span className="text-danger">{mobile_numberErr}</span>
                      </div>
                      <div className>
                        <button className="btn w100" onClick={registerHandler}>
                          Sign Up
                        </button>
                      </div>
                      {/* <p class="f_dgo mt-4 mt-md-5">© GIZWIZARD, 2024</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>

          <Footer
            scrollTobuynow={scrollTobuynow}
            scrollToAbout={scrollToAbout}
          />
        </div>
      )}
    </>
  );
};
