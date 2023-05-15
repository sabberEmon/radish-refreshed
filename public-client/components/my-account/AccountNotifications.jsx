import { Button, Empty, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import SingleNotification from "../utils/SingleNotification";

export default function AccountNotifications() {
  const root = useSelector((state) => state.main.root);
  const dispatch = useDispatch();

  return (
    <section className="min-h-[80vh]">
      <p className="text-[32px] font-extrabold">Notifications</p>
      <p className="text-[#979797] mt-2 ">
        Here is your latest notification on Radish.
      </p>

      {root?.notifications?.length === 0 && (
        <div className="mt-4">
          <Empty
            description="No notifications yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}

      <div className="flex flex-col">
        {
          // if there are any notification where isRead is false
          // then show the button
          root?.notifications?.some(
            (notification) => notification.isRead === false
          ) && (
            <Button
              className="w-[150px] h-[43px] font-extrabold rounded-[12px] ml-auto my-3"
              onClick={() => {
                root.socket.emit(
                  "mark-all-notifications-as-read",
                  root.user._id
                );
                dispatch({
                  type: "root/markAllNotificationsAsRead",
                });
                message.success("All notifications marked as read");
              }}
            >
              Mark all as read
            </Button>
          )
        }
        <div className="mt-6">
          {root?.notifications?.map((notification) => (
            <SingleNotification
              key={notification._id}
              notification={notification}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
