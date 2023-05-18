import { Button, Empty, message } from "antd";
import Image from "next/image";
import profilePlaceholder from "../../images/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Notifications({
  notifications,
  userId,
  setIsComponentVisible,
}) {
  const root = useSelector((state) => state.main.root);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div
      className=" relative rounded-[16px] min-h-[400px] w-[285px] bg-white dark:bg-secondaryBlack border border-solid border-gray-200  pt-4 pb-4"
      style={{
        boxShadow: "4px 4px 12px rgba(3, 14, 23, 0.06)",
      }}
    >
      <div className="flex justify-between items-center px-4">
        <span className="font-extrabold  text-sm">Notifications</span>
        {notifications?.length > 0 &&
          // and if there are notifications that are not read
          notifications?.filter((notification) => notification.isRead === false)
            .length > 0 && (
            <Button
              type="text"
              onClick={() => {
                root.socket.emit("mark-all-notifications-as-read", userId);
                dispatch({
                  type: "root/markAllNotificationsAsRead",
                });
                message.success("All notifications marked as read");
                setIsComponentVisible(false);
              }}
            >
              <span className="text-secondaryDarkGray font-bold text-sm">
                Mark all as read
              </span>
            </Button>
          )}
      </div>

      <div className="w-full h-[1px] mt-1 bg-[#94999D26] "></div>

      <div className="mt-2 space-y-1 ">
        {
          // if no notifications
          notifications?.length === 0 && (
            <div className="w-full h-[300px] flex justify-center items-center">
              <Empty
                description="No notifications yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )
        }
        {notifications?.length > 0 &&
          notifications.slice(0, 4).map((notification) => {
            return (
              <div
                key={notification._id}
                className={` px-3 py-2 cursor-pointer ${
                  !notification.isRead ? "bg-gray-50 dark:bg-gray-900" : ""
                }`}
                onClick={() => {
                  message.info("Redirecting...");
                  root.socket.emit(
                    "mark-notification-as-read",
                    notification._id
                  );
                  dispatch({
                    type: "root/markNotificationAsRead",
                    payload: notification._id,
                  });
                  // after marking as read, redirect to the link
                  router.push(notification.message.link);
                  setIsComponentVisible(false);
                }}
              >
                <div className="flex items-center gap-x-2">
                  <div className="h-[34px] w-[34px] rounded-full">
                    <Image
                      src={
                        notification.referenceUser?.profilePicture ||
                        profilePlaceholder
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
              </div>
            );
          })}

        {notifications?.length > 4 && (
          <div
            className=" absolute mt-4 bottom-3 text-sm font-extrabold text-center flex justify-center items-center cursor-pointer text-primary h-[30px] w-full rounded-[12px]"
            onClick={() => {
              router.push(`/my-account/${userId}?ref=notifications`);
            }}
          >
            View all
          </div>
        )}
      </div>
    </div>
  );
}
