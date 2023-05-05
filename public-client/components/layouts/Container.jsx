import Footer from "../common/Footer.jsx";
import Navbar from "../common/Navbar.jsx";

function Container({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default Container;
