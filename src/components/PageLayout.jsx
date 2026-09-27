import Navbar from "./Navbar";
import Footer from "./Footer";

const PageLayout = ({ children, className = "" }) => {
  return (
    <>
      <Navbar />
      <main className={`min-h-screen ${className}`}>{children}</main>
      <Footer />
    </>
  );
};

export default PageLayout;
