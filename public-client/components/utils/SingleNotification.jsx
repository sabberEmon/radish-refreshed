import { useMarkSingleNotificationAsReadMutation } from "@/redux/features/api/apiSlice";
import { Avatar, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { MdPersonOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import profilePlaceholder from "../../images/avatar.png";

export default function SingleNotification({ notification }) {
  const router = useRouter();
  const root = useSelector((state) => state.main.root);
  const dispatch = useDispatch();

  return (
    <div
      className={`flex my-2 items-center justify-between border-solid border-b border-t-0 border-l-0 border-r-0 border-[#CFDBD54D] px-0 py-3 cursor-pointer  ${
        !notification.isRead ? "bg-gray-50 dark:bg-gray-900" : ""
      }`}
      onClick={() => {
        message.info("Redirecting...");
        root.socket.emit("mark-notification-as-read", notification._id);
        dispatch({
          type: "root/markNotificationAsRead",
          payload: notification._id,
        });
        // after marking as read, redirect to the link
        router.push(notification.message.link);
      }}
    >
      <div className="flex items-center gap-x-2">
        <div className="h-[34px] w-[34px] rounded-full">
          <Image
            src={
              notification.referenceUser?.profilePicture || profilePlaceholder
            }
            alt="profile"
            width={34}
            height={34}
            className="rounded-full"
          />
        </div>
        <div>
          <p className="text-secondaryGray text-sm">
            <span className="font-bold text-primary ">
              {notification.referenceUser.name || "Guest User"}
            </span>
            <span>{notification.message.text?.split(",")[1]}.</span>
          </p>
        </div>
      </div>
      <span className="text-secondaryGray">
        {
          // how many time ago
        }
      </span>
    </div>
  );
}
