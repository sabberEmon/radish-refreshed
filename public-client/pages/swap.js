import Layout from "@/components/utils/Layout";
import { Button, Select, Skeleton, message } from "antd";
import Head from "next/head";
import { MdOutlineSettings, MdCircle } from "react-icons/md";
import currencyIcon from "../images/currency-icon.png";
import Image from "next/image";
import { Input } from "antd";
import { MdSwapVert } from "react-icons/md";
import { useEffect, useState } from "react";
import RDS from "../images/swap/RDS.png";
import USDT from "../images/swap/USDT.png";
import ChartComponent from "@components/swap/CoinDetailChart";
import { useTheme } from "next-themes";
import BigNumber from "bignumber.js";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import xrdImage from "../images/Diamond_Shape.png";
import rdsImage from "../images/swap/RDS.png";
import bobbyImage from "../images/swap/bobby_round.png";
import crewImage from "../images/swap/crew_round.png";
import ociImage from "../images/swap/oci_round.png";
import caviarImage from "../images/swap/caviar_round.png";
import caviarSwapLogo from "../images/swap/caviarswap-logo.png";

function roundToTwo(num) {
  return +(Math.round(num + "e+4") + "e-4");
}

const safelyUnwrapAmount = (amount) => {
  const bigAmount = new BigNumber(amount);
  const amountInput = bigAmount.shiftedBy(18); // Atto
  const amountResult = amountInput.toFixed();

  return amountResult;
};

const safelyWrapAmount = (amount) => {
  const bigAmount = new BigNumber(amount);
  const amountInput = bigAmount.shiftedBy(-18); // Atto
  const amountResult = amountInput.toFixed(4);

  return amountResult;
};

export default function Swap() {
  const root = useSelector((state) => state.root);

  const [swapFrom, setSwapFrom] = useState({
    id: "xrd",
    rri: "xrd_rr1qy5wfsfh",
  });
  const [swapTo, setSwapTo] = useState({
    id: "rds",
    rri: "rds_rr1q09zzg0pmjtntq09gxxnqq8hl68rajpy8jhesl9ve3cq2f4nrh",
  });
  const [swapFromAmount, setSwapFromAmount] = useState(100);
  const [swapFromAmountUsd, setSwapFromAmountUsd] = useState(0);
  const [swapToAmount, setSwapToAmount] = useState(0);
  const [swapToAmountUsd, setSwapToAmountUsd] = useState(0);
  const [swapApiData, setSwapApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenDataLoading, setTokenDataLoading] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const { theme, setTheme } = useTheme();

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (swapFromAmount <= 0) {
      setLoading(false);
      // message.error("Please enter a valid amount");
      return;
    }

    const timer = setTimeout(() => {
      axios
        .post("https://api.caviarswap.io/v2/simulate_trade", {
          amount: safelyUnwrapAmount(swapFromAmount),
          message: swapTo.id,
          rri: swapFrom.rri,
        })
        .then((res) => {
          // console.log(res.data);
          if (res.data.result === "RETURNED_NOT_ENOUGH_BALANCE") {
            message.error("RETURNED_NOT_ENOUGH_BALANCE");
            setLoading(false);
            setSwapFromAmount(100);
            return;
          }
          if (res.data.result === "PARTIALLY_SWAPPED") {
            message.error("PARTIALLY_SWAPPED_ERROR");
            setLoading(false);
            setSwapFromAmount(100);
            return;
          }
          if (res.data.result !== "SWAPPED") {
            message.error(res.data.result);
            setLoading(false);
            setSwapFrom({
              id: "xrd",
              rri: "xrd_rr1qy5wfsfh",
            });
            setSwapTo({
              id: "rds",
              rri: "rds_rr1q09zzg0pmjtntq09gxxnqq8hl68rajpy8jhesl9ve3cq2f4nrh",
            });
            return;
          }
          setLoading(false);
          setSwapApiData(res.data);
          setSwapToAmount(safelyWrapAmount(res.data.actions[0].amount));
        });
    }, 2000);

    return () => clearTimeout(timer);
  }, [swapTo, swapFrom, swapFromAmount]);

  useEffect(() => {
    setTokenDataLoading(true);
    const response = axios.get("https://api.dsor.io/v1.0/tokens");

    response.then((res) => {
      // find the token from res.data.token with rri
      const xrdData = res.data.tokens.find(
        (token) => token.rri === "xrd_rr1qy5wfsfh"
      );
      const rdsData = res.data.tokens.find(
        (token) =>
          token.rri ===
          "rds_rr1q09zzg0pmjtntq09gxxnqq8hl68rajpy8jhesl9ve3cq2f4nrh"
      );
      const crewData = res.data.tokens.find(
        (token) =>
          token.rri ===
          "crew_rr1qdvqylly2ga0rpsc6fv03a2mdqp89z4xev3s0mef576systzyx"
      );

      const bobbyData = res.data.tokens.find(
        (token) =>
          token.rri ===
          "bobby_rr1qvadnxcgmssts5vfc553ph8f0npw003zkhvp5cyzd2msvcflay"
      );

      const caviarData = res.data.tokens.find(
        (token) =>
          token.rri ===
          "caviar_rr1qvnxng85y762xs3fklvxmequaww8k0nhraqv7nqjvmxs4ahu3d"
      );

      const ociData = res.data.tokens.find(
        (token) =>
          token.rri ===
          "oci_rr1qws04shqrz3cdjljdp5kczgv7wd3jxytagk95qlk7ecquzq8e7"
      );

      setTokenData({
        xrd: xrdData,
        rds: rdsData,
        crew: crewData,
        bobby: bobbyData,
        caviar: caviarData,
        oci: ociData,
      });

      setTokenDataLoading(false);

      // console.log(
      //   tokenData?.rds?.chart_24h?.price_usd?.map((price) => price["value"])
      // );
    });
  }, []);

  // useEffect(() => {
  //   if (!tokenData || !swapApiData) return;

  // console.log(tokenData, swapApiData);

  //   const xrdToDollar = tokenData?.xrd?.price_usd;
  // }, [tokenData, swapApiData]);

  // console.log(tokenData);

  const handleSwap = async () => {
    if (!session) {
      message.error("Please login to continue");
      router.push("/auth/login");
      return;
    }

    if (!root.actionWallet) {
      message.error("Please connect your wallet");
      return;
    }

    if (swapFromAmount <= 0) {
      message.error("Please enter a valid amount");
      return;
    }

    const tx = {
      actions: [
        {
          type: "TransferTokens",
          from_account: {
            address: root.actionWallet,
          },
          to_account: {
            address:
              "rdx1qspwzj0k5070mnkzcp89sqvyzrngn30cjrvhh56q5tggt48dwld0cgquantum",
          },
          amount: {
            token_identifier: {
              rri: swapFrom.rri, //
            },
            value: safelyUnwrapAmount(swapFromAmount),
          },
        },
      ],
      message: swapTo.id,
      encryptMessage: false,
    };
    if (root.walletType === "z3us") {
      const response = await window.z3us.v1.submitTransaction(tx);
      // console.log(response);
    } else if (root.walletType === "xidar") {
      const response = await window.xidar.v1.submitTransaction(tx);
    }
  };

  const tokens = [
    {
      id: "rds",
      rri: "rds_rr1q09zzg0pmjtntq09gxxnqq8hl68rajpy8jhesl9ve3cq2f4nrh",
      name: "RDS",
      image: rdsImage,
    },
    {
      id: "xrd",
      rri: "xrd_rr1qy5wfsfh",
      name: "XRD",
      image: xrdImage,
    },
    {
      id: "crew",
      rri: "crew_rr1qdvqylly2ga0rpsc6fv03a2mdqp89z4xev3s0mef576systzyx",
      name: "CREW",
      image: crewImage,
    },
    {
      id: "caviar",
      rri: "caviar_rr1qvnxng85y762xs3fklvxmequaww8k0nhraqv7nqjvmxs4ahu3d",
      name: "CAVIAR",
      image: caviarImage,
    },
    {
      id: "bobby",
      rri: "bobby_rr1qvadnxcgmssts5vfc553ph8f0npw003zkhvp5cyzd2msvcflay",
      name: "BOBBY",
      image: bobbyImage,
    },
    {
      id: "oci",
      rr1: "oci_rr1qws04shqrz3cdjljdp5kczgv7wd3jxytagk95qlk7ecquzq8e7",
      name: "OCI",
      image: ociImage,
    },
  ];

  return (
    <>
      <Head>
        <title>Swap | Radish Square</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout includesFooter={false}>
        <main className="min-h-[100vh] w-full bg-secondaryGray bg-opacity-10 relative">
          <div className="w-[300px] h-[300px] absolute hidden xl:block bg-primary rounded-full bottom-[30%] left-[25%]  filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="w-[300px] h-[300px] absolute bg-secondary hidden xl:block rounded-full bottom-[30%] right-[25%]  filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
          <div className="py-10 pb-14 sm:py-20 mx-6 sm:mx-8 gap-8 flex-col flex justify-center items-center">
            <section className="h-auto w-auto sm:w-[500px] min-[2000px]:w-[800px] min-[2000px]:h-[auto] border border-solid border-[#E7E8E7] dark:border-[#E7E8E733] min-[2000px]:py-8 bg-white z-50 rounded-[16px] dark:bg-[#05101C] relative py-8 px-8">
              {/* <MdOutlineSettings className="absolute top-6 right-8 text-xl min-[2000px]:text-3xl cursor-pointer opacity-70 " /> */}
              <h3 className="text-start sm:text-center font-extrabold mt-1 text-[20px] min-[2000px]:text-5xl">
                Swap
              </h3>
              <div className="flex justify-between items-center mb-5 mt-10 min-[2000px]:mt-15">
                <div>
                  <p className="text-sm sm:text-base text-secondaryGray min-[2000px]:text-3xl">
                    Swap from
                  </p>
                  <Input
                    value={swapFromAmount}
                    type="number"
                    onChange={(e) => {
                      // if the value is over 100000 then don't change
                      if (Number(e.target.value) > 10000000) {
                        return;
                      } else {
                        setSwapFromAmount(e.target.value);
                      }
                    }}
                    bordered={false}
                    className="text-[24px] sm:text-[34px] font-bold leading-[42px] min-[2000px]:my-6 pl-0"
                  />
                  {loading ? (
                    <Skeleton.Input
                      active={true}
                      block={true}
                      size="small"
                      className="mt-1 !w-[40px]"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-secondaryGray min-[2000px]:text-2xl">
                      <span className=" font-extrabold ">
                        {tokenData &&
                          `${(
                            swapFromAmount * tokenData[swapFrom.id]?.price_usd
                          ).toFixed(3)}$`}
                      </span>
                    </p>
                  )}
                </div>
                <Select
                  value={swapFrom.id}
                  style={{ width: 170 }}
                  loading={loading}
                  bordered={false}
                  onChange={(value) => {
                    setSwapFrom(tokens.find((token) => token.id === value));
                  }}
                >
                  {tokens.map((token) => (
                    <Select.Option value={token.id}>
                      <div className="flex items-center gap-x-2">
                        <Image
                          width={20}
                          height={20}
                          src={token.image}
                          quality={100}
                        />
                        <span className="font-extrabold text-xs sm:text-sm min-[2000px]:text-2xl">
                          {token.name}
                        </span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div className="relative my-10 min-[2000px]:mt-15">
                <div className="w-full h-[1px] bg-[#97979726]"></div>
                <div
                  className="w-[50px] h-[50px] min-[2000px]:w-[100] min-[2000px]:h-[100] rounded-full flex justify-center items-center bg-primary absolute right-0 z-50 -top-[25px] cursor-pointer"
                  onClick={() => {
                    const temp = swapFrom;
                    setSwapFrom(swapTo);
                    setSwapTo(temp);
                  }}
                >
                  <MdSwapVert className="text-white text-2xl min-[2000px]:text-3xl" />
                </div>
              </div>

              <div className="flex justify-between items-center my-5 min-[2000px]:my-8">
                <div>
                  <p className="text-sm sm:text-base text-secondaryGray min-[2000px]:text-3xl">
                    Swap to
                  </p>
                  <Input
                    value={swapToAmount}
                    disabled={loading}
                    type="number"
                    // onChange={(e) => setSwapToAmount(e.target.value)}
                    bordered={false}
                    className="text-[24px] sm:text-[34px] font-bold leading-[42px] min-[2000px]:my-6 pl-0"
                  />
                  {loading ? (
                    <Skeleton.Input
                      active={true}
                      block={true}
                      size="small"
                      className="mt-1 !w-[40px]"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-secondaryGray min-[2000px]:text-2xl">
                      <span className=" font-extrabold ">
                        {tokenData &&
                          `${(
                            swapToAmount * tokenData[swapTo.id]?.price_usd
                          ).toFixed(3)}$`}
                      </span>
                    </p>
                  )}
                </div>
                <Select
                  value={swapTo.id}
                  style={{ width: 170 }}
                  bordered={false}
                  loading={loading}
                  onChange={(value) => {
                    if (value === swapFrom.id) {
                      message.error("You can't swap to the same token");
                      setSwapTo({
                        id: "rds",
                        rri: "rds_rr1q09zzg0pmjtntq09gxxnqq8hl68rajpy8jhesl9ve3cq2f4nrh",
                      });
                      return;
                    }
                    setSwapTo(tokens.find((token) => token.id === value));
                  }}
                >
                  {tokens.map((token) => (
                    <Select.Option value={token.id}>
                      <div className="flex items-center gap-x-2">
                        <Image
                          width={20}
                          height={20}
                          src={token.image}
                          quality={100}
                        />
                        <span className="font-extrabold text-xs sm:text-sm min-[2000px]:text-2xl">
                          {token.name}
                        </span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {loading || tokenDataLoading ? (
                <>
                  <Skeleton.Input
                    active={true}
                    block={true}
                    size="default"
                    className=""
                  />
                  <Skeleton.Input
                    active={true}
                    block={true}
                    size="default"
                    className="mt-1"
                  />
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center my-3 pr-4">
                    <span className="text-[#979797]">
                      {(Number(swapApiData?.fee).toFixed(3) * 100).toFixed(2)}%
                    </span>
                    <span className="font-bold">Swap Fee</span>
                  </div>
                  <div className="flex justify-between items-center my-3 pr-4">
                    <span className="text-[#979797]">
                      {roundToTwo(Number(swapApiData?.price_impact) * 100)}%
                    </span>
                    <span className="font-bold">Price Impact</span>
                  </div>
                </>
              )}

              <Button
                className="font-extrabold w-full rounded-[100px] h-[48px] min-[2000px]:w-[140] min-[2000px]:text-xl mt-3 sm:mt-6"
                type="primary"
                onClick={handleSwap}
              >
                Swap
              </Button>
            </section>
            <section className="w-full h-auto sm:h-[102px] sm:w-[500px] min-[2000px]:w-[800px] border border-solid border-[#E7E8E7] dark:border-[#E7E8E733] min-[2000px]:h-[auto] min-[2000px]:py-8 bg-white z-50 rounded-[16px] dark:bg-[#05101C] relative py-2 px-8">
              {tokenDataLoading ? (
                <Skeleton.Input
                  active={true}
                  block={true}
                  style={{
                    width: "100%",
                    height: "80px",
                  }}
                />
              ) : (
                <>
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex justify-center items-center flex-col gap-2">
                      <Image src={RDS} width={38} height={38} quality={100} />
                      <p className="text-base sm:text-lg min-[2000px]:text-2xl">
                        RDS
                      </p>
                    </div>
                    <div className="flex justify-center items-end flex-col">
                      <p className="text-sm text-end text-[#979797] min-[2000px]:text-xl">
                        Price
                      </p>
                      <p className="text-bold text-base sm:text-lg min-[2000px]:text-2xl">
                        ${tokenData?.rds?.price_usd?.toFixed(3)}
                      </p>
                    </div>
                    <div className="flex justify-center items-end flex-col">
                      <p className="text:xs sm:text-sm text-end text-[#979797] min-[2000px]:text-xl">
                        24H%
                      </p>
                      <p
                        className={`text-bold text-base sm:text-lg min-[2000px]:text-2xl ${
                          tokenData?.rds?.price_change_24h > 0
                            ? "text-[#04C976]"
                            : "text-[#FF0000]"
                        }`}
                      >
                        {tokenData?.rds?.price_change_24h?.toFixed(3)}%
                      </p>
                    </div>
                    <div className="w-[100px] sm:w-[153px] min-[2000px]:w-[300px]">
                      <ChartComponent
                        xData={tokenData?.rds?.chart_24h?.price_usd?.map(
                          (price) => ""
                        )}
                        yData={tokenData?.rds?.chart_24h?.price_usd?.map(
                          (price) => price["value"]
                        )}
                        canvasHeight="80px"
                      />
                    </div>
                  </div>
                </>
              )}
            </section>
            <section className="w-full h-[102px] sm:w-[500px] min-[2000px]:w-[800px] min-[2000px]:h-[auto] border border-solid border-[#E7E8E7] dark:border-[#E7E8E733] min-[2000px]:py-8 bg-white z-50 rounded-[16px] dark:bg-[#05101C] relative py-2 px-8">
              {tokenDataLoading ? (
                <Skeleton.Input
                  active={true}
                  block={true}
                  style={{
                    width: "100%",
                    height: "80px",
                  }}
                />
              ) : (
                <>
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex justify-center items-center flex-col gap-2">
                      <Image
                        src={xrdImage}
                        width={38}
                        height={38}
                        quality={100}
                      />
                      <p className="text-base sm:text-lg min-[2000px]:text-2xl ">
                        XRD
                      </p>
                    </div>
                    <div className="flex justify-center items-end flex-col">
                      <p className="text:xs sm:text-sm text-end text-[#979797] min-[2000px]:text-xl">
                        Price
                      </p>
                      <p className="text-bold text-base sm:text-lg min-[2000px]:text-2xl">
                        ${tokenData?.xrd?.price_usd?.toFixed(3)}
                      </p>
                    </div>
                    <div className="flex justify-center items-end flex-col">
                      <p className="text:xs sm:text-sm text-end text-[#979797] min-[2000px]:text-xl">
                        24H%
                      </p>
                      <p
                        className={`text-bold text-base sm:text-lg min-[2000px]:text-2xl ${
                          tokenData?.xrd?.price_change_24h > 0
                            ? "text-[#04C976]"
                            : "text-[#FF0000]"
                        }`}
                      >
                        {tokenData?.xrd?.price_change_24h?.toFixed(3)}%
                      </p>
                    </div>
                    <div className="w-[100px] sm:w-[153px] min-[2000px]:w-[300px]">
                      <ChartComponent
                        xData={tokenData?.xrd?.chart_24h?.price_usd?.map(
                          (price) => ""
                        )}
                        yData={tokenData?.xrd?.chart_24h?.price_usd?.map(
                          (price) => price["value"]
                        )}
                        canvasHeight="80px"
                      />
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
          <div className="min-[2000px]:text-2xl font-medium text-base ml-5 absolute bottom-5 flex justify-center items-center gap-x-1">
            Powered by{" "}
            <span
              className="cursor-pointer"
              onClick={() => {
                window.open("https://caviarswap.io/", "_blank");
              }}
            >
              CaviarSwap
            </span>
            {""}
            <Image
              src={caviarSwapLogo}
              alt="caviarSwapLogo"
              width={20}
              height={20}
              quality={100}
              className="mt-[5px]"
            />
          </div>
        </main>
      </Layout>
    </>
  );
}
