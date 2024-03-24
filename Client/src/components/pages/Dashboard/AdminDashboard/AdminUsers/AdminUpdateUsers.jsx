import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateUserFromAdmin } from "../../../../../utils/axios-instance";
import Input from "../../../../common/Input";
import ButtonComponent from "../../../../common/ButtonComponent";

function AdminUpdateUsers() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const passwordRules =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;

  const handleChange = (e) => {
    setValues((prevValue) => {
      return {
        ...prevValue,
        [e.target.name]: e.target.value,
      };
    });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/users/${id}`)
      .then((res) => {
        setValues(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

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
        await updateUserFromAdmin(id, values);
        toast.success("User updated successfully!");
        navigate("/admin-users");
      } catch (error) {
        toast.error("Error in updating the user");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <h1 className="text-3xl mb-5">Update User Details</h1>
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
          {errors.name && <p>{errors.name}</p>}
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
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div>
          <ButtonComponent type="submit" buttonStyle="mt-[0.6rem] text-sm">
            Update
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

export default AdminUpdateUsers;
