import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import {
  getSellers,
  getUsers,
  registerSeller,
} from "../../../../utils/axios-instance";
import { setRole } from "../../../../redux/actions/roleAction";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaBusinessTime } from "react-icons/fa";
import { MdConfirmationNumber, MdEmail } from "react-icons/md";
import { TbBrandAirtable } from "react-icons/tb";
import { RiLockPasswordFill } from "react-icons/ri";
import Input from "../../../common/Input";
import ButtonComponent from "../../../common/ButtonComponent";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { setLoader } from "../../../../redux/actions/appActions";
import Loader from "../../../common/Loader";

const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
const gstinRules = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const sellerSchema = yup.object({
  name: yup
    .string()
    .required("*required")
    .min(2, "*Name must contain atleast 2 characters")
    .max(15, "*Name must not contain more than 15 characters")
    .trim(),
  businessName: yup
    .string()
    .required("*required")
    .min(5, "*Business name must contain atleast 5 characters")
    .trim(),
  gstin: yup
    .string()
    .required("*GSTIN required for selling products on Bac-Mart")
    .matches(gstinRules, "*GSTIN must be in the format of 22AAAAA0000A1Z5"),
  brand: yup
    .string()
    .required("*required")
    .min(2, "*Brand name must contain atleast 2 characters"),
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

const RegisterSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuth } = useSelector((state) => state.role);
  const { loader } = useSelector((state) => state.app);

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
      businessName: "",
      gstin: "",
      brand: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validationSchema: sellerSchema,
    onSubmit,
  });

  async function onSubmit(values) {
    const { name, businessName, gstin, brand, email, password } = values;

    const emailExistsInUsers = users.findIndex(
      (user) => user.email === values.email
    );
    const emailExistsInSellers = sellers.findIndex(
      (seller) => seller.email === values.email
    );

    if (emailExistsInUsers === -1 && emailExistsInSellers === -1) {
      let sellerObj = {
        id:
          sellers.length !== 0
            ? (parseInt(sellers[sellers.length - 1].id) + 1).toString()
            : "1",
        name: name.trim(),
        businessName: businessName.trim(),
        gstin,
        brand: brand.trim(),
        email: email.trim(),
        password,
        productsToSell: [],
      };

      try {
        dispatch(setLoader(true));
        const { success, data, error } = await registerSeller(sellerObj);
        if (success) {
          dispatch(setRole("seller", sellerObj));
          handleReset();
          toast.success("Seller registered successfully");
          navigate("/");
        } else {
          console.log("Failed to register seller ", error);
          toast.error(
            "Problem for registering seller, Please try after some time!"
          );
        }
      } catch (error) {
        console.log("Failed to register seller ", error);
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
        <h3 className="text-center text-3xl font-bold ">Register Seller</h3>

        <div className="flex justify-center items-center gap-10">
          <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <FaUser />
                <label htmlFor="name" className="font-semibold">
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
                <FaBusinessTime />
                <label htmlFor="businessName" className="font-semibold">
                  Business Name
                </label>
              </div>

              <Input
                type="text"
                name="businessName"
                id="businessName"
                value={values.businessName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Dhruv Mobile World"
              />
              {touched.businessName && errors.businessName ? (
                <p className="text-[14px] text-red-700">
                  {errors.businessName}
                </p>
              ) : (
                <p className="text-[14px] opacity-0">null</p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <MdConfirmationNumber />
                <label htmlFor="gstin" className="font-semibold">
                  GST NO
                </label>
              </div>

              <Input
                type="text"
                name="gstin"
                id="gstin"
                value={values.gstin}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="22AAAAA0000A1Z5"
              />

              {touched.gstin && errors.gstin ? (
                <p className="text-[14px] text-red-700">{errors.gstin}</p>
              ) : (
                <p className="text-[14px] opacity-0">null</p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <TbBrandAirtable />
                <label htmlFor="brand" className="font-semibold">
                  Brand
                </label>
              </div>

              <Input
                type="text"
                name="brand"
                id="brand"
                value={values.brand}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Samsung"
              />

              {touched.brand && errors.brand ? (
                <p className="text-[14px] text-red-700">{errors.brand}</p>
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

            <div className="flex flex-col">
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
                <div className="text-2xl absolute right-2 top-0 translate-y-1/2 bg-white pl-3 mt-[1px]">
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

            <div className="flex justify-between gap-2">
              <ButtonComponent
                type="submit"
                buttonStyle={
                  errors.name ||
                  errors.businessName ||
                  errors.gstin ||
                  errors.brand ||
                  errors.email ||
                  errors.password
                    ? "bg-[#59c2f3] cursor-not-allowed border-[#59c2f3] hover:text-[#59c2f3] px-5  w-full flex items-center justify-center gap-2 basis-[30%]"
                    : "w-full flex items-center justify-center gap-2 basis-[30%]"
                }
                disabled={
                  errors.name ||
                  errors.businessName ||
                  errors.gstin ||
                  errors.brand ||
                  errors.email ||
                  errors.password
                    ? true
                    : false
                }
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
                  onClick={() => window.scrollTo({ top, behavior: "smooth" })}
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

export default RegisterSeller;
