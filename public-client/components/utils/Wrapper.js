import { ConfigProvider, theme as antdTheme } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "next-themes";

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
