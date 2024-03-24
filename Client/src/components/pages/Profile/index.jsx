import { useDispatch, useSelector } from "react-redux";
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import placeholder from "/images/profileImg.gif";
import { NavLink } from "react-router-dom";
import { updateSeller, updateUser } from "../../../utils/axios-instance";
import { setRole } from "../../../redux/actions/roleAction";
import SellerDetails from "./SellerDetails";
import { toast } from "react-toastify";
import ButtonComponent from "../../common/ButtonComponent";

const Profile = () => {
  const role = useSelector((state) => state.role);
  const [showPass, setShowPass] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [user, setUser] = useState(role.user);
  const [seller, setSeller] = useState(role.seller);
  const dispatch = useDispatch();

  const scrollToTop = () => {
		window.scrollTo({ top, behavior: "smooth" })
	}
  
  const handleChange = (e) => {
    if (user !== null) {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
    if (seller !== null) {
      setSeller({
        ...seller,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (readOnly) {
      setReadOnly(!readOnly);
      return;
    }

    if (user !== null) {
      try {
        await updateUser(user);
        dispatch(setRole("user", user));
        setReadOnly(!readOnly);
        toast.success("Profile Updated !!");
      } catch (error) {
        toast.error("Something went wrong. Try again later!");
      }
    }
    if (seller !== null) {
      try {
        await updateSeller(seller);
        dispatch(setRole("seller", seller));
        setReadOnly(!readOnly);
        toast.success("Profile Updated !!");
      } catch (error) {
        toast.error("Something went wrong. Try again later!");
      }
    }
  };

  const linkClass =
    "w-full border-2 border-[#0295db] text-[#0295db] py-2 flex items-center justify-center gap-2 font-medium text-lg md:text-lg hover:bg-[#0295db] hover:text-white transition-all duration-250 ease-in-out basis-[48%] rounded-md";
  const labelClass =
    "mr-2 font-bold md:text-2xl text-[#2590db] flex items-center gap-2";
  const inputClass = `px-3 py-1 w-full text-lg md:text-xl font-medium border-none bg-transparent focus:outline-none`;
  const infoWrapperClass = `flex py-1 px-2 rounded-md items-center w-full ${
    readOnly
      ? "border-[2px] border-transparent"
      : "border-[2px] border-[#2590db] focus:border-black"
  }`;

  return (
    <div className="py-4 px-8 w-full h-[95vh] flex items-center">
      <div className="w-full h-fit flex items-center gap-4 shadow-2xl">
        <div className="hidden w-full h-full overflow-hidden rounded-md md:block">
          <img src={placeholder} alt="placeholder" className="w-full h-full" />
        </div>
        <div className="w-full h-full p-6 py-8 flex justify-between flex-col">
          <div className="mb-8">
            <h1 className=" text-xl md:text-2xl font-semibold text-slate-700 text-center">
              Welcome {user ? user.name : seller.name} !
            </h1>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full flex flex-col gap-2"
          >
            <div className={infoWrapperClass}>
              <label htmlFor="name" className={labelClass}>
                <FaUser />:
              </label>
              <input
                type="text"
                name="name"
                value={user ? user?.name : seller?.name}
                readOnly={readOnly}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div className={infoWrapperClass}>
              <label htmlFor="email" className={labelClass}>
                <IoIosMail /> :
              </label>
              <input
                type="email"
                name="email"
                value={user ? user?.email : seller?.email}
                readOnly={readOnly}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div className={`${infoWrapperClass} border-gray-400`}>
              <label htmlFor="password" className={labelClass}>
                <RiLockPasswordFill /> :
              </label>
              <div className="flex items-center w-full">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={user ? user?.password : seller?.password}
                  readOnly={true}
                  className={`${inputClass} text-red-600 w-[70%]`}
                  required
                />
                {!showPass ? (
                  <GoEye
                    className="text-2xl cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                  />
                ) : (
                  <GoEyeClosed
                    className="text-2xl cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                  />
                )}
              </div>
            </div>
            {role.seller !== null ? (
              <SellerDetails
                seller={seller}
                handleChange={handleChange}
                readOnly={readOnly}
                infoWrapperClass={infoWrapperClass}
              />
            ) : null}
            <div className="mt-4 w-full mr-auto">
              <ButtonComponent
                handleClick={handleClick}
                buttonStyle="flex gap-2 text-[white!important] hover:text-[#2590db!important] focus:outline-none"
              >
                {readOnly ? (
                  <>
                    Edit
                    <AiFillEdit className="text-xl" />
                  </>
                ) : (
                  "Update"
                )}
              </ButtonComponent>
            </div>
          </form>
          <div className="mt-6 w-full flex justify-center">
            <div className="w-full flex items-center gap-2 flex-col md:flex-row">
              {user ? (
                <>
                  <NavLink to="/cart" className={linkClass} onClick={scrollToTop}>
                    <FaShoppingCart />
                    Cart
                  </NavLink>
                  <NavLink to="/wishlist" className={linkClass} onClick={scrollToTop}>
                    <FaHeart />
                    Wishlist
                  </NavLink>
                  <NavLink to="/orders" className={linkClass} onClick={scrollToTop}>
                    <FaBoxOpen />
                    Orders
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/seller-products" className={linkClass} onClick={scrollToTop}>
                    Your Products
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
