import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  addProduct,
  getProducts,
  updateSellerProducts,
} from "../../../../utils/axios-instance";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../../../../redux/actions/roleAction";
import Input from "../../../common/Input";
import ButtonComponent from "../../../common/ButtonComponent";
import * as Yup from "yup";

const InitialValues = {
  title: "",
  description: "",
  price: "",
  discountPercentage: "",
  stock: "",
  category: "",
  brand: "",
  total_sell: "",
  thumbnail: "",
};

const Index = () => {  
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { seller } = useSelector((state) => state.role);
  const dispatch = useDispatch();
  
  const inputStyle = "block uppercase tracking-wide text-gray-700 text-xs font-bold";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProducts();
        if (response.success) {
          setProducts(response.data);
        } else {
          console.error("Failed to fetch the Products Data", response.error);
        }
      } catch (error) {
        console.error("Error while Fetching products", error);
      }
    };

    fetchData();
  }, []);

  const ProductSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    discountPercentage: Yup.number()
      .min(0, "Discount percentage must be 0 or greater")
      .max(100, "Discount percentage cannot be greater than 100"),
    stock: Yup.number()
      .required("Stock is required")
      .integer("Stock must be an integer")
      .min(0, "Stock must be 0 or greater"),
    category: Yup.string().required("Category is required"),
    brand: Yup.string().required("Brand is required"),
    total_sell: Yup.number()
      .required("Total sell is required")
      .integer("Total sell must be an integer")
      .min(0, "Total sell must be 0 or greater"),
    thumbnail: Yup.string()
      .url("Thumbnail must be a valid URL")
      .required("Thumbnail URL is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const newProductId =
        products.length === 0
          ? 1
          : parseInt(products[products.length - 1].id) + 1;

      const newProduct = {
        ...values,
        id: newProductId.toString(),
      };

      const { success, error } = await addProduct(newProduct);

      if (success) {
        if (seller) {
          const { success, error, data } = await updateSellerProducts(
            seller,
            newProduct.id.toString()
          );
          dispatch(setRole("seller", data));
          if (success) {
            navigate("/seller-products");
          }
        } else {
          navigate("/admin");
        }
      } else {
        console.error("Error adding product:", error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex justify-center items-center bg-white py-8 px-5 md:px-[5rem] flex-col rounded-md">
        <h1 className="text-center text-3xl font-bold">Register Product</h1>

        <Formik
          initialValues={InitialValues}
          onSubmit={handleSubmit}
          validationSchema={ProductSchema}
        >
          <div>
            <Form className="flex justify-center items-center gap-2 flex-col rounded-md py-8 px-5 md:px-[5rem]">
              <div className="mb-3">
                <label htmlFor="title" className={inputStyle}>
                  Title
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Product Title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className={inputStyle}>
                  Description
                </label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Product Description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="price" className={inputStyle}>
                  Price
                </label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Product Price"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="discountPercentage" className={inputStyle}>
                  Discount Percentage
                </label>
                <Input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  placeholder="Discount Percentage"
                />
                <ErrorMessage
                  name="discountPercentage"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="stock" className={inputStyle}>
                  Stock
                </label>
                <Input
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="Product Stock"
                />
                <ErrorMessage
                  name="stock"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="category" className={inputStyle}>
                  Category
                </label>
                <Input
                  type="text"
                  id="category"
                  name="category"
                  placeholder="Product category"
                />
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="brand" className={inputStyle}>
                  Brand
                </label>
                <Input
                  type="text"
                  id="brand"
                  name="brand"
                  placeholder="Product Brand"
                />
                <ErrorMessage
                  name="brand"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="total_sell" className={inputStyle}>
                  Total Sell
                </label>
                <Input
                  type="number"
                  id="total_sell"
                  name="total_sell"
                  placeholder="Total Sell"
                />
                <ErrorMessage
                  name="total_sell"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="thumbnail" className={inputStyle}>
                  Add Image URL
                </label>
                <Input
                  type="text"
                  id="thumbnail"
                  name="thumbnail"
                  placeholder="Image URLs"
                />
                <ErrorMessage
                  name="thumbnail"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <ButtonComponent
                  type="submit"
                  buttonStyle="mt-[0.6rem] text-sm"
                >
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
            </Form>
          </div>
        </Formik>
      </div>
    </div>
  );
};

export default Index;
