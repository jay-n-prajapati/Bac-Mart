import React, { useState } from "react";
import { Rating, RatingStar } from "flowbite-react";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";

function Card({ product, heartHandle, identifier, children }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  let flag;

  identifier === "usersCard" || identifier === "wishlist"
    ? (flag = true)
    : (flag = false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  return (
    <div>
      <div
        key={product.id}
        className="w-full lg:max-w-[22rem]  h-[min(470px,100%)]  bg-white border border-gray-200 rounded-lg shadow relative"
      >
        {flag ? (
          <button className="flex justify-center items-center absolute h-10 w-10 md:w-11 lg:w-11 max-h-10  right-0 border-[1px] border-slate-300 m-2 bg-slate-100 rounded-full ">
            <CiHeart
              className="text-2xl text-slate-950"
              onClick={() => heartHandle(product)}
            />
          </button>
        ) : null}

        <div className="overflow-hidden p-4 ">
          <Link
            className={`${flag ? `` : `pointer-events-none`} `}
            to={`/products/${product.id}`}
          >
            <img
              className=" w-fit h-60 rounded-lg mx-auto"
              src={product.thumbnail}
              alt="product image"
            />
          </Link>
        </div>
        <div className="px-5 pb-5 ">
          <Link
            className={`${flag ? `` : `pointer-events-none`} `}
            to={`/products/${product.id}`}
          >
            <h5 className="text-xl font-semibold tracking-tight text-gray-900">
              {product.title}
            </h5>
          </Link>
          <p
            className={` font-normal text-gray-800  ${
              showFullDescription ? "" : "truncate"
            }`}
          >
            {product.description}
          </p>
          {!showFullDescription ? (
            <button className="text-blue-600" onClick={toggleDescription}>
              Read more
            </button>
          ) : (
            <button className="text-gray-500" onClick={toggleDescription}>
              Read less
            </button>
          )}
          <div className="flex flex-row   items-center justify-between  my-4 ">
            <span className="text-base font-normal text-gray-900 mt-2 md:mt-0 text-green-600/100">
              {product.discountPercentage} % Off
            </span>

            <Rating className="mt-2 md:mt-0">
              <RatingStar />

              <p className="ml-2 text-base font-bold text-gray-900">
                {product.rating}
              </p>
            </Rating>
            {!flag ? (
              <span className="text-base font-normal text-gray-900 mt-2 md:mt-0">
                <strong>Quantity :</strong> {product.quantity}
              </span>
            ) : null}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Card;