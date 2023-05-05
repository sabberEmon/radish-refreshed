import { Button, Empty, message } from "antd";
import SingleNotification from "../utils/SingleNotification";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
} from "@/redux/features/api/apiSlice";

export default function Notifications() {
  const { data: notificationsData } = useGetNotificationsQuery({
    userId: session?.token?.sub,
  });
  const [markAllNotificationsAsRead, { isLoading }] =
    useMarkAllNotificationsAsReadMutation();

  console.log("notificationsData", notificationsData);

  return (
    <section className="min-h-[80vh]">
      <p className="text-[32px] font-extrabold">Notifications</p>
      <p className="text-[#979797] mt-2 ">
        Here is your latest notification on Radish.
      </p>

      {
        // if there are no notifications
        // then show this message
        notificationsData?.notifications?.length === 0 && (
          <Empty
            description="No notifications yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )
      }
      <div className="flex flex-col">
        {
          // if there are any notification where isRead is false
          // then show the button
          notificationsData?.notifications?.some(
            (notification) => notification.isRead === false
          ) && (
            <Button
              className="w-[150px] h-[43px] font-extrabold rounded-[12px] ml-auto my-3"
              loading={isLoading}
              onClick={() => {
                markAllNotificationsAsRead({
                  userId: session?.token?.sub,
                }).then(() => {
                  message.success("All notifications marked as read");
                });
              }}
            >
              Mark all as read
            </Button>
          )
        }
        <div className="mt-6">
          {notificationsData?.notifications?.map((notification) => (
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
