import {
  FaHeadphonesAlt,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const linkStyle =
    "hover:text-black font-bold transition-all flex items-center gap-1 mr-4";

  const scrollToTop = () => {
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0295db] shadow py-5 sticky top-full mt-5">
      <div className="w-full mx-auto p-4 md:py-3">
        <div className="text-center">
          <ul className="w-[min(90%,200px)] sm:w-3/4 md:w-[550px] mx-auto grid grid-cols-2 sm:grid-cols-4 place-items-center mb-4 text-xs sm:text-sm md:text-base font-medium text-white sm:mb-0 ">
            <li className="justify-self-center sm:justify-self-auto">
              <Link to="/" className={linkStyle} onClick={scrollToTop}>
                <FaHome /> Home
              </Link>
            </li>
            <li className="justify-self-start sm:justify-self-auto">
              <Link to="/contact" className={linkStyle} onClick={scrollToTop}>
                <FaHeadphonesAlt /> Contact Us
              </Link>
            </li>
            <li className="justify-self-center sm:justify-self-auto">
              <Link to="/login" className={linkStyle} onClick={scrollToTop}>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li className="justify-self-start sm:justify-self-auto">
              <Link to="/register" className={linkStyle} onClick={scrollToTop}>
                <FaUserPlus /> Sign Up
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-1 border-none bg-gradient-to-r from-transparent from-5% md:from-10% via-white to-transparent to:95% md:to-90% mx-auto h-[2px] sm:my-2" />
        <p className="w-full mx-auto text-sm text-white text-center mt-4 pt-2">
          &copy; {new Date().getFullYear()} Bac Mart | All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
