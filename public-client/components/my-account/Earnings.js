import { Typography, Button, Tag, Empty } from "antd";
const { Paragraph } = Typography;
import Shape from "../../images/Diamond_Shape.png";
import Author from "../../images/creator.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import { MdOutlineNorthEast } from "react-icons/md";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";


const safelyWrapAmount = (amount) => {
  const bigAmount = new BigNumber(amount);
  const amountInput = bigAmount.shiftedBy(-18); // Atto
  const amountResult = amountInput.toFixed(4);

  return amountResult;
};


export default function Earnings() {
  const root = useSelector((state) => state.root);
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState("");

  useEffect(() => {
    if (!root?.actionWallet) return;

    const temp = async () => {
      // console.log("root?.actionWallet", window.xidar);
      if (root.walletType === "xidar") {
        const balances = await window.xidar.v1.balances();

        const balancesArray = balances?.account_balances?.liquid_balances;

        const xrdBalance = balancesArray?.find(
          (balance) => balance?.symbol === "xrd"
        );

        // console.log("xrdBalance", xrdBalance);

        setWalletBalance(safelyWrapAmount(xrdBalance?.amount) || 0);
      } else if (root.walletType === "z3us") {
        const balances = await window.z3us.v1.balances();

        const balancesArray = balances?.account_balances?.liquid_balances;

        const xrdBalance = balancesArray?.find(
          (balance) => balance?.symbol === "xrd"
        );

        // console.log("xrdBalance", xrdBalance);

        setWalletBalance(safelyWrapAmount(xrdBalance?.amount) || 0);
      }
    };

    temp();
  }, [root?.actionWallet]);

  const { theme, setTheme } = useTheme();

  return (
    <section className="min-h-[80vh]">
      <p className=" text-[24px] sm:text-[32px] font-extrabold">Earnings</p>
      <div className="flex items-start xl:items-center justify-between gap-1  sm:gap-6 flex-col xl:flex-row ">
        <div className="mt-5">
          <p className="text-sm sm:text-base font-bold mb-2">
            Account balance:
          </p>
          <div className="flex justify-start items-center gap-3">
            <Image src={Shape} width={28} height={28} />
            <p className="text-[32px] font-thin">
              {walletBalance} <span className="font-bold">XRD</span>
            </p>
            {/* <p className="text-sm text-[#979797] hidden sm:block self-end mb-1">
              ~$22,511.50
            </p> */}
          </div>
          {/* <p className="text-sm text-[#979797] sm:hidden self-end mb-1 mt-3">
            ~$22,511.50
          </p> */}
        </div>
        <div className="mt-5">
          <p className="font-bold mb-2">Wallet address:</p>
          <div className="flex justify-start items-center gap-3">
            <Paragraph
              copyable
              className={`${
                theme == "dark" ? "earn-walletD" : "earn-walletW"
              } text-[#979797]`}
            >
              {root.user?.wallet}
            </Paragraph>
          </div>
        </div>
      </div>
      <Button
        className="flex items-center gap-x-2 w-[182px] h-[43px] rounded-[12px] font-bold my-2 sm:my-6 text-secondary"
        style={{
          marginLeft: "-12px",
        }}
        type="link"
        onClick={() => router.push("/swap")}
      >
        Open DEX
        <MdOutlineNorthEast className="h-5 w-5 " />
      </Button>
      <div className="w-full earnings">
        {/* <p className="text-center my-10 text-secondaryDarkGray">
          No data available
        </p> */}
        {
          <Empty
            description="No data available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        }
        <div className="md:hidden">
          {/* <table className="w-full">
            <tr className="">
              <th className="text-start  text-[#979797] font-thin text-sm">
                Transactions
              </th>
              <th className="text-start  text-[#979797] font-thin text-sm">
                Items
              </th>
              <th className="text-end  text-[#979797] font-thin text-sm">
                Price
              </th>
            </tr>
            <tr>
              <td className="text-[#030E17] hidden md:block">0x5c2....28dd</td>
              <td className="">
                <Tag color="red">Transfer</Tag>
              </td>
              <td className="">
                <div className="flex justify-start items-center gap-2">
                  <Image
                    src={Author}
                    width={28}
                    height={28}
                    className="rounded-full hidden sm:block"
                  />
                  <p className="font-semibold text">Bubble Fluid NFT #228</p>
                </div>
              </td>
              <td className="text-[#030E17] hidden md:block">0x2a6....69e7</td>
              <td className="text-[#030E17] hidden md:block">0x2b5....6637</td>
              <td className="text-[#DE345E] text-end">21.52 RDS</td>
              <td className="text-end text-[#979797] hidden md:block">
                1 hour ago
              </td>
            </tr>
            <tr>
              <td className="text-[#030E17] hidden md:block">0x5c2....28dd</td>
              <td className="">
                <Tag color="green">Paid</Tag>
              </td>
              <td className="">
                <div className="flex justify-start items-center gap-2">
                  <Image
                    src={Author}
                    width={28}
                    height={28}
                    className="rounded-full hidden sm:block"
                  />
                  <p className="font-semibold text">Bubble Fluid NFT #228</p>
                </div>
              </td>
              <td className="text-[#030E17] hidden md:block">0x2a6....69e7</td>
              <td className="text-[#030E17] hidden md:block">0x2b5....6637</td>
              <td className="text-[#DE345E] text-end">-</td>
              <td className="text-end text-[#979797] hidden md:block">
                1 hour ago
              </td>
            </tr>
            <tr>
              <td className="text-[#030E17] hidden md:block">0x5c2....28dd</td>
              <td className="">
                <Tag color="blue">Buy</Tag>
              </td>
              <td className="">
                <div className="flex justify-start items-center gap-2">
                  <Image
                    src={Author}
                    width={28}
                    height={28}
                    className="rounded-full hidden sm:block"
                  />
                  <p className="font-semibold text">Bubble Fluid NFT #228</p>
                </div>
              </td>
              <td className="text-[#030E17] hidden md:block">0x2a6....69e7</td>
              <td className="text-[#030E17] hidden md:block">0x2b5....6637</td>
              <td className="text-[#DE345E] text-end">21.52 RDS</td>
              <td className="text-end text-[#979797] hidden md:block">
                1 hour ago
              </td>
            </tr>
          </table> */}
        </div>

        <div className="hidden md:block lg:hidden">
          {/* <table className="w-full">
            <tr className="">
              <th className="text-start  text-[#979797] font-thin text-sm">
                Transactions
              </th>
              <th className=""></th>
              <th className="text-start  text-[#979797] font-thin text-sm">
                Items
              </th>
              <th className="text-end  text-[#979797] font-thin text-sm">
                Price
              </th>
              <th className="text-end    text-[#979797] font-thin text-sm">
                Date
              </th>
            </tr>
            <tr>
              <td className="text-[#030E17] ">0x5c2....28dd</td>
              <td className="">
                <Tag color="red">Transfer</Tag>
              </td>
              <td className="">
                <div className="flex justify-start items-center gap-2">
                  <p className="font-semibold text">Bubble Fluid NFT #228</p>
                </div>
              </td>
              <td className="text-[#DE345E] text-end">21.52 RDS</td>
              <td className="text-end text-[#979797] ">1 hour ago</td>
            </tr>
            <tr>
              <td className="text-[#030E17] ">0x5c2....28dd</td>
              <td className="">
                <Tag color="green">Paid</Tag>
              </td>
              <td className="">
                <div className="flex justify-start items-center gap-2">
                  <p className="font-semibold text">Bubble Fluid NFT #228</p>
                </div>
              </td>
              <td className="text-[#DE345E] text-end">-</td>
              <td className="text-end text-[#979797] ">1 hour ago</td>
            </tr>
            <tr>
              <td className="text-[#030E17] ">0x5c2....28dd</td>
              <td className="">
                <Tag color="blue">Buy</Tag>
              </td>
              <td className="">
                <div className="flex justify-start items-center gap-2">
                  <p className="font-semibold text">Bubble Fluid NFT #228</p>
                </div>
              </td>
              <td className="text-[#DE345E] text-end">21.52 RDS</td>
              <td className="text-end text-[#979797] ">1 hour ago</td>
            </tr>
          </table> */}
        </div>

        <div className="hidden lg:block">
          {/* <table className="w-full">
            <tr className="">
              <th className="text-start  text-[#979797] font-thin text-sm">
                Transactions
              </th>
              <th className=""></th>
              <th className="text-start  text-[#979797] font-thin text-sm">
                Items
              </th>
              <th className="text-start  text-[#979797] font-thin text-sm">
                From
              </th>
              <th className="text-start    text-[#979797] font-thin text-sm">
                To
              </th>
              <th className="text-end  text-[#979797] font-thin text-sm">
                Price
              </th>
              <th className="text-end    text-[#979797] font-thin text-sm">
                Date
              </th>
            </tr>
            <tr>
              <td className="text-[#030E17] ">0x5c2....28dd</td>
              <td className="">
                <Tag color="red">Transfer</Tag>
              </td>
              <td className="">
                <div className="flex justify-start items-center gap-2">
                  <Image
                    src={Author}
                    width={28}
                    height={28}
                    className="rounded-full hidden sm:block"
                  />
                  <p className="font-semibold text">Bubble Fluid NFT #228</p>
                </div>
              </td>
              <td className="text-[#030E17] ">0x2a6....69e7</td>
              <td className="text-[#030E17] ">0x2b5....6637</td>
              <td className="text-[#DE345E] text-end">21.52 RDS</td>
              <td className="text-end text-[#979797] ">1 hour ago</td>
            </tr>
            <tr>
              <td className="text-[#030E17] ">0x5c2....28dd</td>
              <td className="">
                <Tag color="green">Paid</Tag>
              </td>
              <td className="">
                <div className="flex justify-start items-center gap-2">
                  <Image
                    src={Author}
                    width={28}
                    height={28}
                    className="rounded-full hidden sm:block"
                  />
                  <p className="font-semibold text">Bubble Fluid NFT #228</p>
                </div>
              </td>
              <td className="text-[#030E17] ">0x2a6....69e7</td>
              <td className="text-[#030E17] ">0x2b5....6637</td>
              <td className="text-[#DE345E] text-end">-</td>
              <td className="text-end text-[#979797] ">1 hour ago</td>
            </tr>
            <tr>
              <td className="text-[#030E17] ">0x5c2....28dd</td>
              <td className="">
                <Tag color="blue">Buy</Tag>
              </td>
              <td className="">
                <div className="flex justify-start items-center gap-2">
                  <Image
                    src={Author}
                    width={28}
                    height={28}
                    className="rounded-full hidden sm:block"
                  />
                  <p className="font-semibold text">Bubble Fluid NFT #228</p>
                </div>
              </td>
              <td className="text-[#030E17] ">0x2a6....69e7</td>
              <td className="text-[#030E17] ">0x2b5....6637</td>
              <td className="text-[#DE345E] text-end">21.52 RDS</td>
              <td className="text-end text-[#979797] ">1 hour ago</td>
            </tr>
          </table> */}
        </div>
      </div>
      <div className="flex items-center justify-center w-full">
        {/* <Button className="flex items-center gap-x-2 rounded-[8px] font-bold  my-6">
          Load more
        </Button> */}
      </div>
    </section>
  );
}
