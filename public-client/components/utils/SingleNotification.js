import { useMarkSingleNotificationAsReadMutation } from "@/redux/features/api/apiSlice";
import { Avatar, message } from "antd";
import { useRouter } from "next/router";
import { MdPersonOutline } from "react-icons/md";

export default function SingleNotification({ notification }) {
  const router = useRouter();
  const [
    markSingleNotificationAsRead,
    { isLoading: markSingleNotificationAsReadLoading },
  ] = useMarkSingleNotificationAsReadMutation();

  return (
    <div
      className={`flex my-2 items-center justify-between   border-solid border-b border-t-0 border-l-0 border-r-0 border-[#CFDBD54D] px-2 py-3 rounded-[12px] ${
        notification.isRead ? "" : "bg-neutral-50 dark:bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-x-2">
        <Avatar
          size={36}
          icon={<MdPersonOutline />}
          src={notification.referenceUser?.profilePicture}
        />
        <p className="text-secondaryGray">
          <span className="font-bold text-secondaryBlack dark:text-white">
            {notification.referenceUser.username ||
              notification.referenceUser.name}{" "}
          </span>{" "}
          {notification.message.type === "favourite" && "favourited your NFT"}
          {notification.message.type === "follow" && "started following you"}
          {notification.message.type === "mention" &&
            "mentioned you in a comment"}
          {notification.message.type === "comment" && "commented on your NFT"}
          {notification.message.type === "bid" && "placed a bid on your NFT"}
          {notification.message.type === "cancelBid" &&
            "cancelled a bid on your NFT"}
          {notification.message.type === "favouriteComment" &&
            "favourited your comment"}{" "}
          <span
            className="text-secondary font-bold cursor-pointer text-sm"
            onClick={() => {
              message.info("Redirecting...");
              markSingleNotificationAsRead({
                notificationId: notification._id,
              }).then((res) => {
                if (res.data?.success) {
                  router.push(notification.message.link);
                }
              });
            }}
          >
            {" "}
            {notification.message.type === "favourite" ||
            notification.message.type === "mention" ||
            notification.message.type === "comment" ||
            notification.message.type === "bid" ||
            notification.message.type === "cancelBid" ||
            notification.message.type === "favouriteComment"
              ? "(View NFT)"
              : "(View Profile)"}
          </span>
        </p>
      </div>
      <span className="text-secondaryGray">
        {
          // how many time ago
        }
      </span>
    </div>
  );
}
