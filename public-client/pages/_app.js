import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import { persistor, store } from "@/redux/store";
import NextNProgress from "nextjs-progressbar";
import { useEffect, useState } from "react";
import Loader from "@/components/utils/Loader";
import { PersistGate } from "redux-persist/integration/react";
import Wrapper from "@/components/layouts/Wrapper";

export default function App({ Component, pageProps }) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    if (window !== undefined) {
      setDomLoaded(true);
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="dark"
        >
          <Wrapper>
            {!domLoaded ? (
              <Loader />
            ) : (
              <>
                <NextNProgress
                  color="#DE345E"
                  options={{
                    showSpinner: false,
                  }}
                />
                <Component {...pageProps} />
              </>
            )}
          </Wrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
