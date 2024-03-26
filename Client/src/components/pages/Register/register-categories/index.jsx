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
    const fetchData = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
        } else {
          console.error("Error fetching categories:", response.error);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const handleSubmit = async (values) => {
    console.log("object")
    try {
      const newCategoryId =
        categories.length === 0
          ? 1
          : parseInt(categories[categories.length - 1].id) + 1;

      const response = await addCategory({
        id: newCategoryId.toString(),
        name: values.name,
      });

      if (response.success) {
        navigate("/admin-categories");
      } else {
        console.error("Error adding category:", response.error);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex justify-center items-center bg-white py-8 px-5 md:px-[5rem] flex-col rounded-md">
        <h1 className="text-3xl mb-5 font-bold">Create Categories</h1>
        <Formik
          initialValues={{ name: "" }}
          onSubmit={handleSubmit}
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
              <Field type="text" id="name" name="name" autoComplete="name" as={Input} />
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
