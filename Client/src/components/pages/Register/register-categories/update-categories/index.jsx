import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import {
  UpdateCategory,
  getCategoryById,
} from "../../../../../utils/axios-instance";
import Input from "../../../../common/Input";
import ButtonComponent from "../../../../common/ButtonComponent";

function UpdateCategories() {
  const navigate = useNavigate();
  const { categoryID } = useParams();
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(categoryID);
        if (response.success) {
          console.log(response.data);
          setCategoryData(response.data);
        } else {
          console.error("Category not found");
        }
      } catch (error) {
        console.error("Error while fetching category", error);
      }
    };

    fetchCategory();
  }, [categoryID]);

  const handleSubmit = async (values) => {
    try {
      const response = await UpdateCategory(values);
      if (response.success) {
        navigate("/admin-categories");
        console.log("Category updated successfully:", response.data);
      } else {
        console.error("Failed to update category:", response.error);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  return (
    <div className="flex justify-center items-center flex-col h-60">
      <h1 className="text-3xl mb-5">Update Category</h1>
      {categoryData && (
        <Formik initialValues={categoryData} onSubmit={handleSubmit}>
          <Form>
            <div className="mb-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Update Category Name
              </label>
              <Input type="text" id="name" name="name" />
            </div>
            <ButtonComponent
                  type="submit"
                  buttonStyle="mt-[0.6rem] text-sm"
                >
                  Update
                </ButtonComponent>
          </Form>
        </Formik>
      )}
    </div>
  );
}

export default UpdateCategories;
