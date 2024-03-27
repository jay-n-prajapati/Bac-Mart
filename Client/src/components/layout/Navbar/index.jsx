import { useCallback, useEffect, useRef, useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/images/png/logo-no-background.png";
import { useDispatch, useSelector } from "react-redux";
import { removeRole } from "../../../redux/actions/roleAction";
import { toast } from "react-toastify";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import Links from "./Links/Links";

import {
  adminLinks,
  publicLinks,
  sellerLinks,
  userLinks,
} from "./Links/LinkData";
import ButtonComponent from "../../common/ButtonComponent";

const Navbar = () => {
  const { isAuth, user, seller, admin } = useSelector((state) => state.role);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const handleLogOut = (e) => {
    e.preventDefault();
    dispatch(removeRole());
    toast.success("Logout Successful !!");
    show === true ? setShow(!show) : null;
    scrollToTop();
    navigate("/");
  };

  const toggleNavbar = () => {
    scrollToTop();
    show === true ? setShow(!show) : null;
  };

  const navCloseHandler = (e) => {
    if (!navRef?.current.contains(e.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", navCloseHandler);
  });

  return (
    <nav className="bg-[#0295db] sticky top-0 left-0 z-50 ">
      <div
        className="flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6"
        ref={navRef}
      >
        <NavLink
          to={
            admin ? "/admin" : seller ? "/seller-dashboard/pendingorders" : "/"
          }
          className="flex items-center"
        >
          <div className="w-[95px] md:w-[110px]">
            <img src={logo} alt="logo" className="w-full" />
          </div>
        </NavLink>
        <ButtonComponent
          handleClick={() => setShow(!show)}
          buttonStyle="inline-flex items-center justify-center w-8 h-8 rounded-sm md:hidden m-[0px!important] p-[0px!important] hover:bg-[rgba(0,0,0,0)!important] hover:text-black"
          type="button"
        >
          {show ? (
            <IoClose className="h-full w-full" />
          ) : (
            <IoMenu className="h-full w-full" />
          )}
        </ButtonComponent>
        <div className={`${show ? "" : "hidden"} w-full md:block md:w-auto`}>
          <Links
            linksToRender={
              user
                ? userLinks
                : seller
                ? sellerLinks
                : admin
                ? adminLinks
                : publicLinks
            }
            toggleNavbar={toggleNavbar}
          >
            <li className="md:ml-2">
              {isAuth ? (
                <NavLink
                  onClick={(e) => handleLogOut(e)}
                  className="border-transparent bg-white py-[.5rem] px-2 text-[1rem]  text-[#0295db] rounded border-[2px] transition-all duration-300 ease-in-out hover:border-[2px] hover:border-white hover:bg-transparent hover:text-white"
                >
                  Logout
                </NavLink>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => toggleNavbar()}
                  className="border-transparent bg-white py-[.35rem] px-2 flex items-center gap-1 text-[1rem]  text-[#0295db] rounded border-[2px] transition-all duration-300 ease-in-out hover:border-[2px] hover:border-white hover:bg-transparent hover:text-white"
                >
                  <FaRegCircleUser />
                  Login
                </NavLink>
              )}
            </li>
          </Links>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
