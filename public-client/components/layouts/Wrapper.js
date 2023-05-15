import { ConfigProvider, theme as antdTheme } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { io } from "socket.io-client";

export default function Wrapper({ children }) {
  const root = useSelector((state) => state.main.root);
  const { theme } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "root/toggleTheme",
      payload: theme,
    });
  }, [theme]);

  // store socket in redux
  useEffect(() => {
    dispatch({
      type: "root/setSocket",
      payload: io(process.env.NEXT_PUBLIC_API_BASE_URL),
    });
  }, []);

  // join socket room
  useEffect(() => {
    if (root.socket && root.user) {
      root.socket.emit("join", root.user._id);
      root.socket.emit("get-notifications", root.user._id);
    }
  }, [root.user, root.socket]);

  // socket listeners
  useEffect(() => {
    if (!root.socket || !root.user) return;

    // get all notifications
    root.socket.on("show-notifications", (notifications) => {
      dispatch({
        type: "root/setNotifications",
        payload: notifications,
      });
    });

    // get new individual notification
    root.socket.on("show-new-individual-notification", (newNotification) => {
      // console.log("newNotification", newNotification);
      dispatch({
        type: "root/appendNotification",
        payload: newNotification,
      });
    });
  }, [root.socket, root.user]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#DE345E",
          colorBgBase: root.theme === "light" ? "#fff" : "#030E17",
          colorBgContainer: root.theme === "light" ? "#fff" : "#030E17",
          colorBgContainerHover: root.theme === "light" ? "#fff" : "#030E17",
          colorBgContainerActive: root.theme === "light" ? "#fff" : "#030E17",
          colorBorder: root.theme === "light" ? "#CFDBD599" : "#CFDBD526",
          colorPrimaryBg: root.theme === "light" ? "#fff" : "#030E17",
          colorBgLayout: root.theme === "light" ? "#fff" : "#030E17",
          colorBgContainerDisabled: root.theme === "light" ? "#fff" : "#030E17",
          colorBgElevated: root.theme === "light" ? "#fff" : "#030E17",
          colorBorderBg: root.theme === "light" ? "#fff" : "#030E17",
          colorBorderSecondary:
            root.theme === "light" ? "#CFDBD599" : "#CFDBD526",
        },
        algorithm:
          root.theme === "light"
            ? antdTheme.defaultAlgorithm
            : antdTheme.darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
