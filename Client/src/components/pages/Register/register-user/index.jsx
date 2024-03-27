import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  getSellers,
  getUsers,
  registerUser,
  updateUserFromAdmin,
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
import { setLoader } from "../../../../redux/actions/appActions";
import Loader from "../../../common/Loader";

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

const userSchemaAdmin = yup.object({
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
});

const RegisterUser = ({ isFromAdmin = false, userData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuth } = useSelector((state) => state.role);
  const { loader } = useSelector((state) => state.app);

  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  let initialValuesUser = {
    name: "",
    email: "",
    password: "",
    cpassword: "",
  };

  let initialValuesAdmin = {
    name: "",
    email: "",
    password: "",
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    handleReset,
  } = useFormik({
    initialValues: !isFromAdmin ? initialValuesUser : initialValuesAdmin,
    validationSchema: !isFromAdmin ? userSchema : userSchemaAdmin,
    onSubmit,
  });

  userData?.name !== "" && !values.name
    ? (values.name = userData?.name) && (userData.name = "")
    : null;

  userData?.email !== "" && !values.email
    ? (values.email = userData?.email) && (userData.email = "")
    : null;

  userData?.password !== "" && !values.password
    ? (values.password = userData?.password) && (userData.password = "")
    : null;

  async function onSubmit(values) {
    const { name, email, password } = values;

    // handleSubmit for Update
    if (isFromAdmin && userData) {
      try {
        dispatch(setLoader(true));
        const { success, data, error } = await updateUserFromAdmin(
          userData?.id,
          {
            name: values.name.trim(),
            email: values.email,
            password: values.password.trim(),
          }
        );
        if (success) {
          toast.success("User updated successfully");
          handleReset();
          navigate("/admin-users");
        } else {
          console.log("Failed to update user ", error);
          toast.error("Problem for updating user, Please try after some time!");
        }
      } catch (error) {
        console.log("Failed to update user ", error);
      } finally {
        dispatch(setLoader(false));
      }
      return;
    }

    const emailExistsInUsers = users.findIndex(
      (user) => user.email === values.email
    );
    const emailExistsInSellers = sellers.findIndex(
      (seller) => seller.email === values.email
    );

    if (emailExistsInUsers === -1 && emailExistsInSellers === -1) {
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

      try {
        dispatch(setLoader(true));
        // setTimeout(async () => {
        const { success, data, error } = await registerUser(userObj);
        // }, 2000);
        if (success) {
          !isFromAdmin && dispatch(setRole("user", userObj));
          handleReset();
          toast.success("User registered successfully");
          !isFromAdmin ? navigate("/") : navigate("/admin-users");
        } else {
          console.log("Failed to register user ", error);
          toast.error(
            "Problem for registering user, Please try after some time!"
          );
        }
      } catch (error) {
        console.log("Failed to register user ", error);
      } finally {
        dispatch(setLoader(false));
      }
    } else {
      // user exists already
      toast.error("User already exists!!");
      handleReset();
    }
  }

  useEffect(() => {
    if (!isFromAdmin) {
      isAuth ? navigate("/") : null;
    }

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

      setUsers(usersData);
      setSellers(sellersData);
    })();
  }, []);

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex flex-col gap-5 bg-white py-8 px-5 md:px-[5rem] rounded-md">
        <h3 className="text-center text-3xl font-bold ">
          {userData
            ? "Update User"
            : isFromAdmin
            ? "Add User"
            : "Register User"}
        </h3>
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
                onChange={!userData ? handleChange : null}
                onBlur={handleBlur}
                placeholder="dhruv@example.com"
                autocomplete={userData && "off"}
                className={
                  userData &&
                  "bg-gray-300 border-transparent focus:border-transparent caret-transparent"
                }
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
                  autocomplete="off"
                />
                <div className="absolute right-2 top-0 translate-y-1/2 text-2xl bg-white pl-3 mt-[1px]">
                  {!showPass ? (
                    <GoEye
                      className="cursor-pointer"
                      onClick={() => setShowPass(!showPass)}
                    />
                  ) : (
                    <GoEyeClosed
                      className="cursor-pointer"
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

            {!isFromAdmin && (
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
                  <div className="absolute right-2 top-0 translate-y-1/2 text-2xl bg-white pl-3 mt-[1px]">
                    {!showConfirmPass ? (
                      <GoEye
                        className="cursor-pointer"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                      />
                    ) : (
                      <GoEyeClosed
                        className="cursor-pointer"
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
            )}

            <div className="flex justify-between gap-2">
              <ButtonComponent
                type="submit"
                buttonStyle={
                  errors.name || errors.password || errors.email
                    ? "bg-[#59c2f3] cursor-not-allowed border-[#59c2f3] hover:text-[#59c2f3] px-5  w-full flex items-center justify-center gap-2 basis-[30%]"
                    : "w-full flex items-center justify-center gap-2 basis-[30%]"
                }
                disabled={
                  errors.name || errors.password || errors.email ? true : false
                }
              >
                {!userData ? "SUBMIT" : "UPDATE"}
              </ButtonComponent>

              {!isFromAdmin ? (
                <ButtonComponent
                  type="reset"
                  buttonStyle={
                    "border-[#b91c1c] bg-[#b91c1c] hover:text-[#b91c1c]"
                  }
                >
                  RESET
                </ButtonComponent>
              ) : (
                <ButtonComponent
                  type="button"
                  buttonStyle="ml-3 border-gray-300 text-sm bg-white hover:bg-gray-200 text-[gray!important]"
                  onClick={() => navigate("/admin-users")}
                >
                  BACK
                </ButtonComponent>
              )}
            </div>

            {!isFromAdmin && (
              <div className="pt-5">
                <p>
                  Already have an account?{" "}
                  <NavLink
                    to="/login"
                    className="text-[#0295db]  border-[#0295db] hover:border-b-[1px]"
                    onClick={() => window.scrollTo({ top, behavior: "smooth" })}
                  >
                    Login here
                  </NavLink>
                </p>
              </div>
            )}
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
