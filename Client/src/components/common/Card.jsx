import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { MdDelete } from "react-icons/md";

function Card({ product, heartHandle, identifier, children }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  let flag;

  identifier === "usersCard" || identifier === "wishlist"
    ? (flag = true)
    : (flag = false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  //const rating = product.rating;
  const rating= Math.round((product.rating)*10)/10;
  const descPercentage = Math.round((product.discountPercentage));

  return (
    <div>
      <div
        key={product.id}
        className="w-full lg:max-w-[22rem]  h-[min(470px,100%)]  bg-white border border-gray-200 rounded-lg shadow relative"
      >
        {flag && identifier !== 'wishlist' ? (
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
            className={` font-normal text-gray-800 bg-slate-100 shadow  ${
              showFullDescription ? "text-wrap z-40 " : "truncate"
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
          <div className="flex flex-row   items-center justify-between  my-4">
            <span className="text-base font-normal text-gray-900 mt-2 md:mt-0 text-green-600/100">
              {descPercentage}% Off
            </span>
            <div className="flex justify-center gap-2">
            <ReactStars
              count={5}
              value={product.rating}
              a11y={false}
              isHalf={true}
              edit={false}
              size={24}
              color={`rgb(156 163 175)`}
              activeColor={`#ffd700`}
            />
            <span className="flex justify-center items-center text-base font-semibold text-gray-800">{rating}</span>
            </div>
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
