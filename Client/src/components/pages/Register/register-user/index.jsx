import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  getSellers,
  getUsers,
  registerUser,
} from "../../../../utils/axios-instance";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../../../../redux/actions/roleAction";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Input from "../../../common/Input";
import ButtonComponent from "../../../common/ButtonComponent";
import { GoEye, GoEyeClosed } from "react-icons/go";

const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
const userSchema = yup.object({
  name: yup
    .string()
    .required("*required")
    .min(2, "*Name must contain atleast 2 characters")
    .max(15, "*Name must not contain more than 15 characters")
    .trim(),
  email: yup.string().required("*required").email("*Email is not valid").trim(),
  password: yup
    .string()
    .required("*required")
    .matches(
      passwordRules,
      "*Password must contain 1 UpperCase, 1 Lowercase, 1 special characters and 1 number"
    ),
  cpassword: yup
    .string()
    .required("*required")
    .oneOf([yup.ref("password")], "*Passwords must match"),
});

const RegisterUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.role);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    handleReset,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validationSchema: userSchema,
    onSubmit,
  });

  async function onSubmit(values) {
    const { name, email, password } = values;

    const emailExistsInUsers = users.findIndex(
      (user) => user.email === values.email
    );
    const emailExistsInSellers = sellers.findIndex(
      (seller) => seller.email === values.email
    );

    if (emailExistsInUsers === -1 && emailExistsInSellers === -1) {
      // user not exists
      let userObj = {
        id:
          users.length !== 0
            ? (parseInt(users[users.length - 1].id) + 1).toString()
            : "1",
        name: name.trim(),
        email: email.trim(),
        password,
        favouriteProducts: [],
      };

      const { success, data, error } = await registerUser(userObj);
      if (success) {
        dispatch(setRole("user", userObj));
        handleReset();
        toast.success("User registered successfully");
        navigate("/");
      }
    } else {
      // user exists already
      toast.error("User already exists!!");
      handleReset();
    }
  }

  useEffect(() => {
    // if looged in then don't give access to this page
    isAuth ? navigate("/") : null;

    (async () => {
      const {
        success: usersSuccess,
        data: usersData,
        error: userError,
      } = await getUsers();
      const {
        success: sellerSuccess,
        data: sellersData,
        error: sellerError,
      } = await getSellers();

      if (userError) {
        // dispatch error
        toast.error("Something went wronge. Try again later!");
      }
      if (sellerError) {
        // dispatch error
        toast.error("Something went wronge. Try again later!");
      }

      setUsers(usersData);
      setSellers(sellersData);
    })();
  }, []);

  return (
    <div className="flex bg-white justify-center items-center py-10">
      <div className="flex flex-col gap-5 py-8 px-5 md:px-[5rem] shadow-2xl rounded-md">
        <h3 className="text-center text-3xl font-bold ">Register User</h3>
        <div className="flex justify-center items-center gap-10">
          <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <FaUser />
                <label htmlFor="role" className="font-semibold">
                  Name
                </label>
              </div>

              <Input
                type="text"
                name="name"
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Dhruv Prajapati"
              />
              {touched.name && errors.name ? (
                <p className="text-[14px] text-red-700">{errors.name}</p>
              ) : (
                <p className="text-[14px] opacity-0">null</p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <MdEmail />
                <label htmlFor="email" className="font-semibold">
                  Email
                </label>
              </div>

              <Input
                type="email"
                name="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="dhruv@example.com"
              />
              {touched.email && errors.email ? (
                <p className="text-[14px] text-red-700">{errors.email}</p>
              ) : (
                <p className="text-[14px] opacity-0">null</p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <RiLockPasswordFill />
                <label htmlFor="password" className="font-semibold">
                  Password
                </label>
              </div>

              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="randDom1$"
                />
                <div className="absolute right-2 top-0 translate-y-1/2">
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
              {touched.password && errors.password ? (
                <p className="text-[14px] text-red-700 w-[min(24rem,85vw)]">
                  {errors.password}
                </p>
              ) : (
                <p className="text-[14px] opacity-0">null</p>
              )}
            </div>

            <div className="flex flex-col relative">
              <div className="flex items-center gap-1">
                <RiLockPasswordFill />
                <label htmlFor="cpassword" className="font-semibold">
                  Confirm Password
                </label>
              </div>

              <div className="relative">
                <Input
                  type={showConfirmPass ? "text" : "password"}
                  name="cpassword"
                  id="cpassword"
                  value={values.cpassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="ranDom1$"
                />
                <div className="absolute right-2 top-0 translate-y-1/2">
                  {!showConfirmPass ? (
                    <GoEye
                      className="text-2xl cursor-pointer"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                    />
                  ) : (
                    <GoEyeClosed
                      className="text-2xl cursor-pointer"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                    />
                  )}
                </div>
              </div>
              {touched.cpassword && errors.cpassword ? (
                <p className="text-[14px] text-red-700">{errors.cpassword}</p>
              ) : (
                <p className="text-[14px] opacity-0">null</p>
              )}
            </div>

            <div className="flex justify-between gap-2">
              <ButtonComponent
                type="submit"
                buttonStyle="w-full flex items-center justify-center gap-2 basis-[30%]"
              >
                SUBMIT
              </ButtonComponent>

              <ButtonComponent
                type="reset"
                buttonStyle={
                  "border-[#b91c1c] bg-[#b91c1c] hover:text-[#b91c1c]"
                }
              >
                RESET
              </ButtonComponent>
            </div>

            <div className="pt-5">
              <p>
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  className="text-[#0295db]  border-[#0295db] hover:border-b-[1px]"
                  onClick={()=>window.scrollTo({ top, behavior: "smooth" })}
                >
                  Login here
                </NavLink>
              </p>
            </div>
          </form>

          <div className="hidden lg:block">
            <img src="/images/Mobile-login.gif" alt="Login Demo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
