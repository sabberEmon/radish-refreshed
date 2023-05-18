import { useDispatch, useSelector } from "react-redux";
import Footer from "../common/Footer.jsx";
import Navbar from "../common/Navbar.jsx";
import { Button, Drawer, Modal, message, notification } from "antd";
import xidarLogo from "../../images/xidar_logo_rounded.png";
import z3usLogo from "../../images/z3us_logo_rounded.png";
import Image from "next/image.js";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import { useAuthInfoQuery } from "@/redux/features/api/apiSlice.js";
import { BsCart2 } from "react-icons/bs";
import CartItem from "../utils/CartItem.jsx";
import { Empty } from "antd";
import { useEffect } from "react";

function Container({ children, includesFooter = true }) {
  const { isError, isLoading } = useAuthInfoQuery();
  const root = useSelector((state) => state.main.root);
  const cart = useSelector((state) => state.main.cart);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  // socket listeners
  useEffect(() => {
    if (!root.socket || !root.user) return;

    // get new individual notification
    root.socket.on("show-new-individual-notification", (newNotification) => {
      // console.log("newNotification", newNotification);
      api["info"]({
        message: `${newNotification.referenceUser.name || "Guest User"} ${
          newNotification.message.text?.split(",")[1]
        }`,
        description: "",
        duration: 4,
        placement: "bottomRight",
      });
    });
  }, [root.socket, root.user]);

  // login handler
  const loginHandler = async (walletType) => {
    let walletAddress = "";
    let signedMessage = "";
    let wType = "";

    // xidar
    if (walletType === "xidar") {
      if (!window.xidar) {
        return message.error("XIDAR wallet not found");
      }
      walletAddress = await window.xidar.v1.connect();
      signedMessage = await window.xidar.v1.sign("Login to RadishSquare");
      wType = "xidar";
    }

    // z3us
    if (walletType === "z3us") {
      if (!window.z3us) {
        return message.error("Z3US wallet not found");
      }
      walletAddress = await window.z3us.v1.connect();
      signedMessage = await window.z3us.v1.sign("Login to RadishSquare");
      wType = "z3us";
    }

    try {
      // console.log(walletAddress, signedMessage);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        {
          primaryWallet: walletAddress,
          signedMessage,
        }
      );

      // console.log(res.data);
      if (res?.data?.success) {
        dispatch({
          type: "root/setIsLoginModalOpen",
          payload: false,
        });
        dispatch({
          type: "root/setUser",
          payload: res.data.data,
        });
        dispatch({
          type: "root/setActionWallet",
          payload: walletAddress,
        });
        dispatch({
          type: "root/setActionWalletType",
          payload: wType,
        });

        localStorage.setItem("radish_auth_token", res.data.token);

        message.success("Login successful");
      } else {
        message.error("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong. Please try again later.");
    }
  };

  const handleConnectWallet = async (walletType) => {
    if (walletType === "xidar") {
      if (!window.xidar) {
        message.error("XIDAR wallet not found");
        dispatch({
          type: "root/setIsConnectWalletModalOpen",
          payload: false,
        });
        return;
      }
      let w = await window.xidar.v1.connect();
      dispatch({
        type: "root/setActionWallet",
        payload: w,
      });
      dispatch({
        type: "root/setActionWalletType",
        payload: "xidar",
      });
      message.success("Wallet connected successfully");
      dispatch({
        type: "root/setIsConnectWalletModalOpen",
        payload: false,
      });
    }

    if (walletType === "z3us") {
      if (!window.z3us) {
        message.error("Z3US wallet not found");
        dispatch({
          type: "root/setIsConnectWalletModalOpen",
          payload: false,
        });
        return;
      }
      let w = await window.z3us.v1.connect();
      dispatch({
        type: "root/setActionWallet",
        payload: w,
      });
      dispatch({
        type: "root/setActionWalletType",
        payload: "z3us",
      });
      message.success("Wallet connected successfully");
      dispatch({
        type: "root/setIsConnectWalletModalOpen",
        payload: false,
      });
    }
  };

  return (
    <>
      <Navbar />
      {contextHolder}
      {children}
      {includesFooter && <Footer />}

      {/* login modal */}
      <Modal
        open={root.isLoginModalOpen}
        centered
        onOk={() => {}}
        onCancel={() => {
          dispatch({
            type: "root/setIsLoginModalOpen",
            payload: false,
          });
        }}
        className="!rounded-[16px]"
        style={{ borderRadius: "16px", width: "200px" }}
        footer={null}
        width={300}
      >
        <h2 className="font-extrabold text-[24px] text-center mt-3 mb-3">
          Login
        </h2>
        <div className="h-[1px] w-full bg-[#CFDBD599] my-3"></div>
        <div>
          <div
            className="rounded-[12px]  w-full py-3 px-3 bg-gray-100 dark:bg-[#CFDBD526] flex justify-around items-center cursor-pointer gap-x-3"
            onClick={() => {
              loginHandler("z3us");
            }}
          >
            <div className="flex items-center gap-x-3">
              <Image src={z3usLogo} width={30} height={30} alt="z3us" />
              <p className="font-bold ">Continue with Z3US</p>
            </div>
            <MdOutlineKeyboardArrowRight className="text-secondaryGray text-2xl" />
          </div>

          <div
            className="rounded-[12px] mt-4 w-full py-3 px-3 bg-gray-100 dark:bg-[#CFDBD526] flex justify-around items-center cursor-pointer gap-x-3"
            onClick={() => {
              loginHandler("xidar");
            }}
          >
            <div className="flex items-center gap-x-3">
              <Image src={xidarLogo} width={30} height={30} alt="xidar" />
              <p className="font-bold ">Continue with XIDAR</p>
            </div>
            <MdOutlineKeyboardArrowRight className="text-secondaryGray text-2xl" />
          </div>

          <p className="text-sm text-secondaryGray mt-4 mb-3 text-center">
            Learn more about{" "}
            <span
              className="text-primary font-bold cursor-pointer"
              onClick={() => {
                window.open("https://z3us.com/", "_blank");
              }}
            >
              Z3US
            </span>{" "}
            or{" "}
            <span
              className="text-primary font-bold cursor-pointer"
              onClick={() => {
                window.open("https://xidar.io/wallet", "_blank");
              }}
            >
              XIDAR
            </span>
          </p>
        </div>
      </Modal>

      {/* connect wallet modal */}
      <Modal
        open={root.isConnectWalletModalOpen}
        centered
        onOk={() => {}}
        onCancel={() => {
          dispatch({
            type: "root/setIsConnectWalletModalOpen",
            payload: false,
          });
        }}
        className="!rounded-[16px]"
        style={{ borderRadius: "16px", width: "200px" }}
        footer={null}
        width={300}
      >
        <h2 className="font-extrabold text-[24px] text-center mt-3 mb-3">
          Connect wallet
        </h2>
        <div className="h-[1px] w-full bg-[#CFDBD599] my-3"></div>
        <div>
          <div
            className="rounded-[12px]  w-full py-3 px-3 bg-gray-100 dark:bg-[#CFDBD526] flex justify-around items-center cursor-pointer gap-x-3"
            onClick={() => {
              handleConnectWallet("z3us");
            }}
          >
            <div className="flex items-center gap-x-3">
              <Image src={z3usLogo} width={30} height={30} alt="z3us" />
              <p className="font-bold ">Connect to Z3US</p>
            </div>
            <MdOutlineKeyboardArrowRight className="text-secondaryGray text-2xl" />
          </div>

          <div
            className="rounded-[12px] mt-4 w-full py-3 px-3 bg-gray-100 dark:bg-[#CFDBD526] flex justify-around items-center cursor-pointer gap-x-3"
            onClick={() => {
              handleConnectWallet("xidar");
            }}
          >
            <div className="flex items-center gap-x-3">
              <Image src={xidarLogo} width={30} height={30} alt="xidar" />
              <p className="font-bold ">Connect to XIDAR</p>
            </div>
            <MdOutlineKeyboardArrowRight className="text-secondaryGray text-2xl" />
          </div>
          <p className="text-sm text-secondaryGray mt-4 mb-3 text-center">
            Learn more about{" "}
            <span
              className="text-primary font-bold cursor-pointer"
              onClick={() => {
                window.open("https://z3us.com/", "_blank");
              }}
            >
              Z3US
            </span>{" "}
            or{" "}
            <span
              className="text-primary font-bold cursor-pointer"
              onClick={() => {
                window.open("https://xidar.io/wallet", "_blank");
              }}
            >
              XIDAR
            </span>
          </p>
        </div>
      </Modal>

      {/* cart drawer */}
      <Drawer
        title={
          <div className="font-extrabold text-[21px] flex justify-between items-center">
            <span>Your Cart </span>
            <BsCart2 className="text-2xl" />
          </div>
        }
        placement="right"
        onClose={() => {
          dispatch({
            type: "root/setIsCartOpen",
            payload: false,
          });
        }}
        open={root.isCartOpen}
      >
        {cart.items?.length > 0 ? (
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg">{cart.items.length} items</p>
              <Button
                danger
                type="default"
                className="text-sm font-bold"
                onClick={() => {
                  dispatch({
                    type: "cart/clearCart",
                  });
                }}
              >
                Clear cart
              </Button>
            </div>
            <div className="mt-8">
              {cart?.items?.map((item) => {
                return <CartItem key={item._id} item={item} />;
              })}
            </div>

            <Button
              className="w-full font-extrabold mt-4"
              type="primary"
              size="large"
            >
              Complete purchase
            </Button>
          </div>
        ) : (
          <Empty
            description={`No items in cart`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="mt-[20%]"
          />
        )}
      </Drawer>
    </>
  );
}

export default Container;
