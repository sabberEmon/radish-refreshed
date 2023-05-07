import { Avatar, Badge, Button, Drawer, Dropdown, Popconfirm } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  MdOutlineSearch,
  MdOutlineMenuOpen,
  MdPersonOutline,
  MdPowerSettingsNew,
  MdOutlineSettings,
  MdOutlinePermIdentity,
} from "react-icons/md";
import { BsCart2 } from "react-icons/bs";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";
import useComponentVisible from "../utils/useComponentVisible";
import { ReactComponent as NightIcon } from "../../images/navbar/night.svg";
import { ReactComponent as NightActiveIcon } from "../../images/navbar/night-active.svg";
import { ReactComponent as NotificationIcon } from "../../images/navbar/notification.svg";
import { ReactComponent as NotificationActiveIcon } from "../../images/navbar/notification-active.svg";
import { ReactComponent as RadishLogo } from "../../images/radish.svg";

export default function Navbar() {
  const root = useSelector((state) => state.main.root);
  const cart = useSelector((state) => state.main.cart);

  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const [isProfileNavVisible, setIsProfileNavVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const avatarDropdownItems = [
    {
      label: <p className="font-semibold">View profile</p>,
      key: "0",
      icon: <MdOutlinePermIdentity className="w-5 h-5 text-secondaryGray" />,
    },
    {
      label: <p className="font-semibold">My account</p>,
      key: "1",
      icon: <MdOutlineSettings className="w-5 h-5 text-secondaryGray" />,
    },
    {
      type: "divider",
    },
    {
      label: (
        <Popconfirm
          title="Are you sure to logout?"
          onConfirm={() => {}}
          onCancel={() => {
            setIsProfileNavVisible(false);
          }}
          okText="Yes"
          placement="bottomRight"
          cancelText="No"
        >
          <p className="font-semibold">Logout</p>
        </Popconfirm>
      ),
      key: "3",
      icon: <MdPowerSettingsNew className="w-5 h-5 " />,
      danger: true,
    },
  ];

  return (
    <>
      <nav className="xl:flex items-center xl:justify-between xl:px-6 px-2  bg-white dark:bg-secondaryBlack w-full relative">
        <section className="xl:flex hidden items-center xl:gap-x-6 w-full gap-x-2 py-4 mr-8">
          <div className="w-10 h-10 flex items-center justify-center  rounded-full p-1 cursor-pointer">
            <RadishLogo className="w-[40px] h-[40px]" />
          </div>
          <div className="xl:flex xl:w-[420px] h-[40px] duration-1000 transition-width lg:focus-within:xl:w-[100%] hidden  items-center px-5 bg-[#ebf0f080] dark:bg-[#49606066] rounded-[8px]">
            <MdOutlineSearch className="w-5 h-5 text-secondaryGray dark:text-secondaryDarkGray" />
            <input
              placeholder="Search collections"
              className="flex flex-grow border-none outline-none h-full placeholder:font-normal px-2 font-normal"
              style={{
                backgroundColor: "transparent",
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const userSearch = search;
                  let actualSearch;
                  if (userSearch.includes("#")) {
                    actualSearch = userSearch.replace("#", "hashtag");
                  } else {
                    actualSearch = userSearch;
                  }
                  router.push(`/search?query=${actualSearch}`);
                  setSearch("");
                }
              }}
            />

            <div className="h-[25px] w-[25px] flex justify-center items-center text-secondaryGray font-bold cursor-pointer dark:bg-[#3D4E54] bg-[#eeeeeecc] rounded-[4px]">
              /
            </div>
          </div>
        </section>
        <section className=" items-center hidden xl:flex">
          <div className="h-full flex items-center mr-5">
            <div
              className={`text-secondaryGray font-bold  cursor-pointer px-2 py-6 mr-4 ${
                router.pathname === "/" &&
                "pb-5 border-b-4 border-solid border-secondaryBlack dark:border-white border-t-0 border-l-0 border-r-0 dark:text-white text-black"
              }`}
              onClick={() => {
                router.push("/");
              }}
            >
              <span>Home</span>
            </div>

            <div
              className={`text-secondaryGray  font-bold cursor-pointer px-2 py-6 mr-4 ${
                router.pathname === "/explore" &&
                "pb-5  border-b-4 border-solid border-secondaryBlack dark:border-white border-t-0 border-l-0 border-r-0 dark:text-white text-black"
              }`}
              onClick={() => {
                router.push("/explore");
              }}
            >
              <span>Explore</span>
            </div>

            <div
              className={`text-secondaryGray font-bold cursor-pointer px-2 py-6 mr-4 ${
                router.pathname === "/swap" &&
                " pb-5  border-b-4 border-solid border-secondaryBlack dark:border-white border-t-0 border-l-0 border-r-0 dark:text-white text-black"
              }`}
              onClick={() => {
                router.push("/swap");
              }}
            >
              <span>Swap</span>
            </div>
          </div>
          <div className="flex items-center h-full">
            {isComponentVisible ? (
              <IoNotifications
                className="w-6 h-6 text-primary mr-4 cursor-pointer"
                onClick={() => {}}
              />
            ) : (
              <Badge count={5} offset={[-33, 5]} size="small">
                <IoNotificationsOutline
                  className="w-6 h-6 text-secondaryGray mr-4 cursor-pointer"
                  onClick={() => {}}
                />
              </Badge>
            )}
            {root.theme === "dark" ? (
              <NightActiveIcon
                fill="#DE345E"
                className="w-6 h-6  mr-4 cursor-pointer"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              />
            ) : (
              <NightIcon
                className="w-6 h-6  mr-4 cursor-pointer"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              />
            )}

            {/* cart */}
            <Badge count={cart.items.length} offset={[-22, 5]} size="small">
              <BsCart2
                className="w-6 h-6 text-secondaryGray mr-4 cursor-pointer"
                onClick={() => {
                  dispatch({
                    type: "root/setIsCartOpen",
                    payload: !root.isCartOpen,
                  });
                }}
              />
            </Badge>

            <Button
              type="primary"
              style={{
                width: "130px",
                height: "40px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
              onClick={async function () {}}
            >
              {!root.actionWallet ? (
                "Connect Wallet"
              ) : (
                <span>
                  {root.actionWallet.slice(0, 6) +
                    "..." +
                    root.actionWallet.slice(-4)}
                </span>
              )}
            </Button>

            {/* profile */}
            {!root.user ? (
              <div
                className="h-[41px] w-[41px] flex justify-center items-center rounded-full ml-2 cursor-pointer"
                onClick={() => {
                  dispatch({
                    type: "root/setIsLoginModalOpen",
                    payload: true,
                  });
                }}
              >
                <Avatar
                  size={40}
                  // src={""}
                  icon={<MdPersonOutline />}
                  className=""
                />
              </div>
            ) : (
              <Dropdown
                menu={{
                  items: avatarDropdownItems,
                  onClick: (e) => {},
                }}
                trigger={["click"]}
                overlayStyle={{
                  marginTop: "14px",
                }}
                placement=""
                open={isProfileNavVisible}
                onOpenChange={(open) => {
                  setIsProfileNavVisible(open);
                }}
              >
                <div className="h-[41px] w-[41px] flex justify-center items-center rounded-full ml-2 cursor-pointer">
                  <Avatar
                    size={40}
                    // src={""}
                    icon={<MdPersonOutline />}
                    className=""
                  />
                </div>
              </Dropdown>
            )}
          </div>
        </section>

        <section className="xl:hidden flex items-center py-3 gap-x-2">
          <div
            className="w-10 h-10 flex items-center justify-center  rounded-full p-1 cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            <RadishLogo className="w-[40px] h-[40px]" />
          </div>
          <div
            className="flex  h-[40px] items-center flex-grow px-3"
            style={{
              backgroundColor:
                theme === "dark" ? "#49606066" : "rgba(235, 240, 240, 0.5)",
              borderRadius: "8px",
            }}
          >
            <MdOutlineSearch className="w-5 h-5 text-secondaryGray dark:text-secondaryDarkGray" />
            <input
              placeholder="Search collections"
              className="flex flex-grow border-none outline-none h-full placeholder:font-normal px-2 font-normal"
              style={{
                backgroundColor: "transparent",
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const userSearch = search;
                  // if # character is present in the search, then replace it with something else so that it works with query params
                  let actualSearch;
                  if (userSearch.includes("#")) {
                    actualSearch = userSearch.replace("#", "hashtag");
                  } else {
                    actualSearch = userSearch;
                  }
                  router.push(`/search?query=${actualSearch}`);
                  setSearch("");
                }
              }}
            />

            <div
              className="h-[25px] w-[25px] flex justify-center items-center text-secondaryGray font-bold"
              style={{
                backgroundColor:
                  theme === "dark" ? "#3D4E54" : "rgba(238, 238, 238, 0.8)",
                borderRadius: "4px",
              }}
            >
              /
            </div>
          </div>
          <MdOutlineMenuOpen
            className="w-7 h-7 text-secondaryGray"
            onClick={() => {
              setIsDrawerVisible(true);
            }}
          />
        </section>

        <section
          ref={ref}
          className="absolute right-36 top-16 z-[999999999999999999]"
        >
          {isComponentVisible && (
            <div
              className=" relative rounded-[16px] min-h-[400px] w-[285px] bg-white dark:bg-secondaryBlack border border-solid border-gray-200 px-4 pt-4"
              style={{
                boxShadow: "4px 4px 12px rgba(3, 14, 23, 0.06)",
              }}
            ></div>
          )}
        </section>
      </nav>

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <div
              className="h-[40px] w-[40px] rounded-full  cursor-pointer  ml-auto"
              onClick={() => {}}
            >
              <Avatar size={40} icon={<MdPersonOutline />} />
            </div>
          </div>
        }
        placement="right"
        onClose={() => {
          setIsDrawerVisible(false);
        }}
        open={isDrawerVisible}
        className="z-50"
      >
        <div className="flex flex-col gap-y-4">
          <p
            onClick={() => {
              router.push("/");
            }}
            className="font-bold text-secondaryGray"
          >
            Home
          </p>
          <p
            onClick={() => {
              router.push("/explore");
            }}
            className="font-bold text-secondaryGray"
          >
            Explore
          </p>
          <p
            onClick={() => {
              router.push("/swap");
            }}
            className="font-bold text-secondaryGray"
          >
            Swap
          </p>
          <div className="flex items-center justify-between">
            {root.isNotificationOpen ? (
              <NotificationActiveIcon
                className="w-6 h-6 text-secondaryGray mr-4 cursor-pointer"
                onClick={() => {}}
              />
            ) : (
              <NotificationIcon
                className="w-6 h-6 text-secondaryGray mr-4 cursor-pointer"
                onClick={() => {}}
              />
            )}
            {root.theme === "dark" ? (
              <NightActiveIcon
                fill="#DE345E"
                className="w-6 h-6  mr-4 cursor-pointer"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              />
            ) : (
              <NightIcon
                className="w-6 h-6  mr-4 cursor-pointer"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              />
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
