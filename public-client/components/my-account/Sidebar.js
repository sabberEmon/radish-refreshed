import { UserCircleIcon } from "@heroicons/react/24/outline";
import {
  MdAttachMoney,
  MdNotificationsNone,
  MdOutlineContactSupport,
} from "react-icons/md";
import { UserCircleIcon as UserCircleIconFilled } from "@heroicons/react/24/solid";
import { MdNavigateNext } from "react-icons/md";

export default function Sidebar({ tabIndex, setTabIndex, setShowTabIndex }) {
  return (
    <div className="">
      <p className="text-secondaryGray tracking-[2px] uppercase font-bold text-[12px] my-5 ml-1">
        My Account
      </p>

      <div className="transition-all ease-in-out duration-200">
        <div
          onClick={() => {
            setTabIndex(0);
            setShowTabIndex(true);
          }}
          className={`max-w-[100%] sm:max-w-[180px] h-[46px] rounded-t-xl  sm:rounded-xl flex items-center justify-between gap-x-2 px-3 sm:mt-3 cursor-pointer ${
            tabIndex === 0
              ? "bg-[#CFDBD526] sm:bg-[#CFDBD54D] font-bold"
              : "dark:text-white text-[#030E17CC] sm:text-secondaryGray  bg-[#CFDBD526] sm:bg-transparent font-semibold sm:font-normal"
          }`}
        >
          <div className="flex items-center gap-x-2">
            {tabIndex === 0 ? (
              <UserCircleIconFilled className="h-5 w-5 " />
            ) : (
              <UserCircleIcon className="h-5 w-5 " />
            )}
            <span>Profile</span>
          </div>
          <MdNavigateNext className="sm:hidden" />
        </div>

        <div
          onClick={() => {
            setTabIndex(1);
            setShowTabIndex(true);
          }}
          className={`max-w-[100%] sm:max-w-[180px] h-[46px] sm:rounded-xl flex items-center justify-between gap-x-2 px-3 sm:mt-3 cursor-pointer ${
            tabIndex === 1
              ? "bg-[#CFDBD526] sm:bg-[#CFDBD54D] font-bold"
              : "dark:text-white text-[#030E17CC] sm:text-secondaryGray  bg-[#CFDBD526] sm:bg-transparent font-semibold sm:font-normal"
          }`}
        >
          <div className="flex items-center gap-x-2">
            <MdAttachMoney
              className={`h-5 w-5 ${
                tabIndex === 1
                  ? ""
                  : "dark:text-white text-[#030E17CC] sm:text-secondaryGray"
              }`}
            />
            <span>Earnings</span>
          </div>
          <MdNavigateNext className="sm:hidden" />
        </div>

        <div
          onClick={() => {
            setTabIndex(2);
            setShowTabIndex(true);
          }}
          className={`max-w-[100%] sm:max-w-[180px] h-[46px] sm:rounded-xl flex items-center justify-between gap-x-2 px-3 sm:mt-3 cursor-pointer ${
            tabIndex === 2
              ? "bg-[#CFDBD526] sm:bg-[#CFDBD54D] font-bold"
              : "dark:text-white text-[#030E17CC] sm:text-secondaryGray bg-[#CFDBD526] sm:bg-transparent font-semibold sm:font-normal"
          }`}
        >
          <div className="flex items-center gap-x-2">
            <MdNotificationsNone
              className={`h-5 w-5 ${
                tabIndex === 2
                  ? ""
                  : "dark:text-white  text-[#030E17CC] sm:text-secondaryGray"
              }`}
            />
            <span>Notifications</span>
          </div>
          <MdNavigateNext className="sm:hidden" />
        </div>

        <div
          onClick={() => {
            setTabIndex(3);
            setShowTabIndex(true);
          }}
          className={`max-w-[100%] sm:max-w-[180px] h-[46px] rounded-b-xl sm:rounded-xl flex items-center justify-between gap-x-2 px-3 sm:mt-3 cursor-pointer ${
            tabIndex === 3
              ? "bg-[#CFDBD526] sm:bg-[#CFDBD54D] font-bold"
              : "dark:text-white text-[#030E17CC] sm:text-secondaryGray font-semibold sm:font-normal bg-[#CFDBD526] sm:bg-transparent"
          }`}
        >
          <div className="flex items-center gap-x-2">
            <MdOutlineContactSupport
              className={`h-5 w-5 ${
                tabIndex === 3
                  ? ""
                  : "dark:text-white text-[#030E17CC] sm:text-secondaryGray"
              }`}
            />
            <span>Account support</span>
          </div>
          <MdNavigateNext className="sm:hidden" />
        </div>
      </div>
    </div>
  );
}
