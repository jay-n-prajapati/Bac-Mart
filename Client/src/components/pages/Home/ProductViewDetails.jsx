import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Carousel } from "flowbite-react";
import { Rating, RatingStar } from "flowbite-react";
import { addProductInCart } from "../../../redux/actions/cartActions";
import { API } from "../../../utils/axios-instance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonComponent from "../../common/ButtonComponent";

const ProductViewDetails = () => {
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem("productDetails");
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {};
    }
  });

  const params = useParams();
  const productId = params.productId;

  useEffect(() => {
    const getProductDetails = async () => {
      const response = await API.get(`/products/${productId}`);
      
      setData(response.data);
    };
    getProductDetails();
    localStorage.setItem("productDetails", JSON.stringify(data));
  }, []);

  const requiredProd = data;

  const dispatch = useDispatch();
  const auth = JSON.parse(localStorage.getItem("role")) || false;
  const isAuth = auth.isAuth;
  function handleClick(product) {
    if (isAuth) {
      dispatch(addProductInCart(product));
    } else {
      toast.warning("Please Login!!");
    }
  }

  return (
    <>
      <div className="container mx-auto p-8 w-full h-full flex justify-center items-center sm:p-16 md:p-16">
        <div className=" my-4 w-[100%] md:w-[75%] lg:w-[50%]  h-full border-[1px] border-[#2590db] rounded-md shadow-2xl md:flex-col overflow-hidden">
          <div className="h-60 md:h-80 w-[100%] ">
            <Carousel slideInterval={5000}>
              {requiredProd?.images?.map((image, index) => {
                return (
                  <img
                    key={index}
                    className="w-full h-full object-cover self-center p-4"
                    src={image}
                    alt="..."
                  />
                );
              })}
            </Carousel>
          </div>
          <div className="flex flex-col items-center bg-white border border-gray-200 hover:bg-gray-100 ">
            <div className="flex flex-col justify-between p-4 leading-normal w-full">
              <h5 className="mb-2  text:2xl md:text-3xl font-bold tracking-tight text-gray-900 ">
                {requiredProd.title}
              </h5>
              <Rating>
                <RatingStar />
                <p className="ml-2 text-sm md:text-lg font-bold text-gray-900 ">
                  {requiredProd.rating}
                </p>
              </Rating>
              <p className="mt-2 mb-4 font-normal text-gray-600 text-base md:text-xl ">
                {requiredProd.description}
              </p>
              <p className="font-normal text-green-800 text-sm md:text-lg">
                Special Price:
              </p>
              <span className="flex flex-row justify-start items-center gap-4 flex-wrap mb-4">
                <p className="text-2xl font-bold text-gray-900 ">
                  ${requiredProd.price}
                </p>
                <p className="text-sky-600/100 text-sm md:text-lg">
                  {requiredProd.discountPercentage} % Off
                </p>
              </span>
              <span className="flex flex-row justify-items-start gap-4 items-center flex-wrap text-base md:text-lg">
                <p className="capitalize text-base md:text-lg">Brand:</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">
                  {requiredProd.brand}
                </p>
                <p className="capitalize font-bold-300 text-base md:text-lg">
                  Category: ({requiredProd.category})
                </p>
              </span>
            </div>
            <div className="mb-4">
              <ButtonComponent onClick={() => handleClick(requiredProd)}>
                Add to Cart
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductViewDetails;
