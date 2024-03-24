import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUser } from "../../../../../utils/axios-instance";
import Input from "../../../../common/Input";
import ButtonComponent from "../../../../common/ButtonComponent";

const errors = {};
const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
function AdminCreateUser() {
  const [data, setData] = useState([]);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setValues((prevValue) => {
      return {
        ...prevValue,
        [e.target.name]: e.target.value,
      };
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (values.name.length < 2) {
      validationErrors.name = "Name must be at least 2 characters";
    }

    if (!passwordRules.test(values.password)) {
      validationErrors.password =
        "Password must contain 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 4 characters long";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await createUser({
          id:
            data.length !== 0
              ? (parseInt(data[data.length - 1].id) + 1).toString()
              : "1",
          ...values,
          favouriteProducts: [],
        });
        toast.success("User created successfully!");
        navigate("/admin-users");
      } catch (error) {
        toast.error("Error in creating the user");
      }
    }
  };

  return (
    <div className="flex justify-center flex-col items-center mt-10">
      <h1 className="text-3xl mb-5">Add user</h1>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center gap-2 flex-col shadow-2xl rounded-md py-8 px-5 md:px-[5rem]"
      >
        <div className="mb-3">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            required
          />
          {errors.name !== "" ? <p>{errors.name}</p> : null}
        </div>
        <div className="mb-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            password
          </label>
          <Input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
          />
          {errors.password !== "" ? <p>{errors.password}</p> : ""}
        </div>
        <div>
          <ButtonComponent type="submit" buttonStyle="mt-[0.6rem] text-sm">
            Submit
          </ButtonComponent>
          <ButtonComponent
            type="button"
            buttonStyle="ml-3 border-gray-300 text-sm bg-white hover:bg-gray-200 text-[gray!important]"
            onClick={() => navigate("/admin-users")}
          >
            Back
          </ButtonComponent>
        </div>
      </form>
    </div>
  );
}

export default AdminCreateUser;
