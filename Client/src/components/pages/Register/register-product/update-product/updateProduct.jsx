import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  getProductById,
  updateProduct,
} from "../../../../../utils/axios-instance";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../../common/Input";
import ButtonComponent from "../../../../common/ButtonComponent";
import * as Yup from "yup";
import Loader from "../../../../common/Loader";
import { setLoader } from "../../../../../redux/actions/appActions";
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const { productID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const { seller } = useSelector((state) => state.role);
  const { loader } = useSelector((state) => state.app);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(productID);
        if (response.success) {
          setProduct(response.data);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error while fetching product", error);
      }
    };

    fetchProduct();
  }, [productID]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      dispatch(setLoader(true));

      const { success, error } = await updateProduct(product);

      if (success) {
        // console.log('Product updated successfully!');
        seller ? navigate("/seller-products") : navigate("/admin");
        toast.success("Product updated successfully");
      } else {
        console.error("Error updating product:", error);
        toast.error("Problem updating product, Please try after some time!");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      dispatch(setLoader(false));
    }
  };

  if (!product) {
    return (
      <div className="w-[min(90%,700px)] text-center mx-auto">
        <div className="text-lg md:text-xl lg:text-2xl mt-14">
          Problem fetching product details, Please try after some time!
        </div>
        <ButtonComponent
          type="button"
          buttonStyle="ml-3 border-gray-300 text-sm bg-white hover:bg-gray-200 text-[gray!important]"
          onClick={() => navigate(-1)}
        >
          Back
        </ButtonComponent>
      </div>
    );
  }

  return (
    <>
      {loader && <Loader />}
      <div className="flex justify-center items-center py-10">
        <div className="flex justify-center items-center bg-white py-8 px-5 md:px-[5rem] flex-col rounded-md">
          <h1 className="text-center text-3xl font-bold">Update Product</h1>
          <Formik
            initialValues={product}
            onSubmit={handleSubmit}
            validationSchema={ProductSchema}
          >
            <div>
              <Form className="flex justify-center items-center gap-2 flex-col rounded-md py-8 px-5 md:px-[5rem]">
                <div className="mb-3">
                  <label
                    htmlFor="title"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Title
                  </label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Product Title"
                    value={product.title}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="description"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Description
                  </label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Product Description"
                    value={product.description}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="price"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Price
                  </label>
                  <Input
                    type="text"
                    id="price"
                    name="price"
                    placeholder="Product Price"
                    value={product.price}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="discountPercentage"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Discount Percentage
                  </label>
                  <Input
                    type="text"
                    id="discountPercentage"
                    name="discountPercentage"
                    placeholder="Discount Percentage"
                    value={product.discountPercentage}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="discountPercentage"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="stock"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Stock
                  </label>
                  <Input
                    type="text"
                    id="stock"
                    name="stock"
                    placeholder="Product Stock"
                    value={product.stock}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="stock"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="brand"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Brand
                  </label>
                  <Input
                    type="text"
                    id="brand"
                    name="brand"
                    placeholder="Product Brand"
                    value={product.brand}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="brand"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="total_sell"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Total Sell
                  </label>
                  <Input
                    type="text"
                    id="total_sell"
                    name="total_sell"
                    placeholder="Total Sell"
                    value={product.total_sell}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="total_sell"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="images"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Images
                  </label>
                  <Input
                    type="text"
                    id="images"
                    name="images"
                    placeholder="Image URLs"
                    value={product.images}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-6">
                  <div className="w-full px-3">
                    <ButtonComponent type="submit" buttonStyle="mt-[0.6rem]">
                      Submit
                    </ButtonComponent>
                  </div>
                </div>
              </Form>
            </div>
          </Formik>
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;
