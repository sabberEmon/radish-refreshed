import "@/styles/globals.css";
import { Provider } from "react-redux";
import { ConfigProvider, theme } from "antd";
import NextNProgress from "nextjs-progressbar";
import { store } from "@/redux/store";

export default function App({ Component, pageProps }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#DE345E",
          colorBgBase: "#030E17",
          colorBgContainer: "#030E17",
          colorBgContainerHover: "#030E17",
          colorBgContainerActive: "#030E17",
          colorBorder: "#CFDBD526",
          colorPrimaryBg: "#030E17",
          colorBgLayout: "#030E17",
          colorBgContainerDisabled: "#030E17",
          colorBgElevated: "#030E17",
          colorBorderBg: "#030E17",
          colorBorderSecondary: "#CFDBD526",
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      <NextNProgress
        color="#DE345E"
        options={{
          showSpinner: false,
        }}
      />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ConfigProvider>
  );
}
