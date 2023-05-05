import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import { store } from "@/redux/store";
import Wrapper from "@/components/utils/Wrapper";
import NextNProgress from "nextjs-progressbar";
import { useEffect, useState } from "react";
import Loader from "@/components/utils/Loader";

export default function App({ Component, pageProps }) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    if (window !== undefined) {
      setDomLoaded(true);
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
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
    </Provider>
  );
}
