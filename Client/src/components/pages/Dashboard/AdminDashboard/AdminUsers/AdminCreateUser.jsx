import RegisterUser from "../../../Register/register-user";

function AdminCreateUser() {
  return <RegisterUser isFromAdmin={true} />;
}

export default AdminCreateUser;

/*********************CUSTOM VALIDATION ************************/

// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { createUser } from "../../../../../utils/axios-instance";
// import Input from "../../../../common/Input";
// import ButtonComponent from "../../../../common/ButtonComponent";
// import { GoEye, GoEyeClosed } from "react-icons/go";

// const passwordRules =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
// const emailRules =
// /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// function AdminCreateUser() {
//   const [data, setData] = useState([]);
//   const [values, setValues] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [showPass, setShowPass] = useState(false);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/users")
//       .then((res) => setData(res.data))
//       .catch((err) => console.log(err));
//   }, []);

//   const handleChange = (e) => {
//     const validationErrors = {};

//     if (e.target.name === "name" && e.target.value.length < 2) {
//       validationErrors.name = "Name must be at least 2 characters";
//     } else if (e.target.name === "name" && e.target.value.length >= 2) {
//       validationErrors.name = "";
//     } else {
//       validationErrors.name = errors.name;
//     }

//     if (e.target.name === "email" && !emailRules.test(e.target.value)) {
//       validationErrors.email =
//         "Invalid email address!";
//     } else if (
//       e.target.name === "email" &&
//       emailRules.test(e.target.value)
//     ) {
//       validationErrors.email = "";
//     } else {
//       validationErrors.email = errors.email;
//     }

//     if (e.target.name === "password" && !passwordRules.test(e.target.value)) {
//       validationErrors.password =
//         "Password must contain 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 4 characters long";
//     } else if (
//       e.target.name === "password" &&
//       passwordRules.test(e.target.value)
//     ) {
//       validationErrors.password = "";
//     } else {
//       validationErrors.password = errors.password;
//     }

//     setErrors(validationErrors);

//     setValues((prevValue) => {
//       return {
//         ...prevValue,
//         [e.target.name]: e.target.value,
//       };
//     });
//   };

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (errors.name === "" && errors.email === "" && errors.password === "") {
//       try {
//         await createUser({
//           id:
//             data.length !== 0
//               ? (parseInt(data[data.length - 1].id) + 1).toString()
//               : "1",
//           ...values,
//           favouriteProducts: [],
//         });
//         toast.success("User created successfully!");
//         navigate("/admin-users");
//       } catch (error) {
//         toast.error("Error in creating the user");
//       }
//     }
//   };

//   return (
//     <div className="flex justify-center flex-col items-center mt-10">
//       <h1 className="text-3xl mb-5">Add user</h1>
//       <form
//         onSubmit={handleSubmit}
//         className="flex justify-center items-center gap-2 flex-col shadow-2xl rounded-md py-8 px-5 md:px-[5rem]"
//       >
//         <div>
//           <label
//             htmlFor="name"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Name
//           </label>
//           <Input
//             id="name"
//             name="name"
//             value={values.name}
//             onChange={handleChange}
//             required
//           />
//           {errors.name ? (
//             <p className="text-[14px] text-red-700">{errors.name}</p>
//           ) : (
//             <p className="text-[14px] opacity-0">null</p>
//           )}
//         </div>
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Email
//           </label>
//           <Input
//             type="text"
//             id="email"
//             name="email"
//             value={values.email}
//             onChange={handleChange}
//             required
//           />
//           {errors.email ? (
//                 <p className="text-[14px] text-red-700">{errors.email}</p>
//               ) : (
//                 <p className="text-[14px] opacity-0">null</p>
//           )}
//         </div>
//         <div>
//           <label
//             htmlFor="phone"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Password
//           </label>
//           <div className="relative">
//             <Input
//               type={showPass ? "text" : "password"}
//               id="password"
//               name="password"
//               value={values.password}
//               onChange={handleChange}
//               required
//             />
//             <div className="absolute right-2 top-0 translate-y-1/2">
//               {!showPass ? (
//                 <GoEye
//                   className="text-2xl cursor-pointer"
//                   onClick={() => setShowPass(!showPass)}
//                 />
//               ) : (
//                 <GoEyeClosed
//                   className="text-2xl cursor-pointer"
//                   onClick={() => setShowPass(!showPass)}
//                 />
//               )}
//             </div>
//           </div>
//           {errors.password ? (
//             <p className="text-[14px] text-red-700 w-[min(24rem,85vw)]">
//               {errors.password}
//             </p>
//           ) : (
//             <p className="text-[14px] opacity-0">null</p>
//           )}
//         </div>
//         <div>
//           <ButtonComponent type="submit" buttonStyle="mt-[0.6rem] text-sm">
//             Submit
//           </ButtonComponent>
//           <ButtonComponent
//             type="button"
//             buttonStyle="ml-3 border-gray-300 text-sm bg-white hover:bg-gray-200 text-[gray!important]"
//             onClick={() => navigate("/admin-users")}
//           >
//             Back
//           </ButtonComponent>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default AdminCreateUser;
