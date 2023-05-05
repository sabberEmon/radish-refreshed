import Footer from "../common/Footer";
import Navbar from "../common/Navbar";

export default function Layout({ children, includesFooter = true }) {
  return (
    <>
      <Navbar />
      {children}
      {includesFooter && <Footer />}
    </>
  );
}
