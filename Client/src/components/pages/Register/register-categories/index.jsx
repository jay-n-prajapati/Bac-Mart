import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { addCategory, getCategories } from "../../../../utils/axios-instance";
import Input from "../../../common/Input";
import ButtonComponent from "../../../common/ButtonComponent";
import * as Yup from "yup";

function AdminCreateCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.success) {
          console.log(res.data);
          setCategories(res.data);
        } else {
          console.log("Error fetching categories:", res.error);
        }
      })
      .catch((err) => console.log("Error fetching categories:", err));
  }, []);

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const handleSubmit = (values) => {
    try {
      const newCategoryId =
        categories.length === 0
          ? 1
          : parseInt(categories[categories.length - 1].id) + 1;
      addCategory({ id: newCategoryId.toString(), name: values.name })
        .then((res) => {
          navigate("/admin-categories");
        })
        .catch((err) => console.log(err));
    } catch (error) {
      // console.log("Error calculating new category ID:", error);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex justify-center items-center bg-white py-8 px-5 md:px-[5rem] flex-col rounded-md">
        <h1 className="text-3xl mb-5 font-bold">Create Categories</h1>
        <Formik
          initialValues={{ name: "" }}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
            resetForm();
          }}
          validationSchema={CategorySchema}
        >
          <Form className="flex justify-center items-center flex-col rounded-md py-8 px-5 md:px-[5rem]">
            <div className="mb-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Name
              </label>
              <Input type="text" id="name" name="name" autoComplete="name" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <ButtonComponent type="submit" buttonStyle="mt-[0.6rem] text-sm">
              Add category
            </ButtonComponent>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default AdminCreateCategories;
