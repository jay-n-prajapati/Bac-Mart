import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import {
  quantityOfProducts,
  removeFromCart,
} from "../../../redux/actions/cartActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "../../../utils/axios-instance";
import { setRole } from "../../../redux/actions/roleAction";
import Card from "../../common/Card";
import ButtonComponent from "../../common/ButtonComponent";

const Product = ({ product, handleClick, isAddToCart }) => {
  const user = useSelector((state) => state.role.user);
  const [quantity, setquantity] = useState(product.quantity);
  const dispatch = useDispatch();

  const heartHandle = async (item) => {
    if(user){
    const alreaydLiked = user.favouriteProducts.filter(
      (product) => product.id === item.id
    );

    if (alreaydLiked.length === 0) {
      user.favouriteProducts.push(item);
      try {
        const data = await API.patch(`/users/${user.id}`, user);
        dispatch(setRole("user", user));
      } catch (error) {
        console.log(error);
      }
      toast.success("Added to whishlist!", {
        position: "top-right",
      });
    } else {
      toast.success("Already in whishlist!", {
        position: "top-right",
      });
    }
  }else{
    toast.error("Please Login")
  }
  };

  function handleChangedQuantity(product, change) {
    if (change == "dec") {
      setquantity(quantity - 1);
      product.stock += 1;
      dispatch(quantityOfProducts({ id: product.id, quantity: quantity - 1 }));
      toast.info(" Product Quantity Decreased!", {
        position: "top-right",
      });
      if (quantity <= 1) {
        product.stock = product.stock + product.quantity;
        dispatch(removeFromCart(product.id));
        toast.success("Removed from the cart!", {
          position: "top-right",
        });
      }
    } else {
      if (product.stock > 0) {
        setquantity(quantity + 1);
        product.stock -= 1;
        dispatch(
          quantityOfProducts({ id: product.id, quantity: quantity + 1 })
        );
        toast.info(" Product Quantity Increased!", {
          position: "top-right",
        });
      } else {
        toast.error("No Stocks Available!");
      }
    }
  }

  return (
    <>
     <div className=" items-center lg:mx-auto mr-3  md:mr-0 ">
        <Card
          product={product}
          heartHandle={heartHandle}
          identifier={"usersCard"}
        >
          <div className="flex items-center justify-between ">
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            <ButtonComponent
              onClick={() => handleClick(product)}
              buttonStyle={`text-sm px-[8px!important] py-[5px!important] mt-[0!important] ${!isAddToCart ? `border-[#b91c1c] bg-[#b91c1c] hover:text-[#b91c1c]` :`` }`}
            >
              {isAddToCart ? "Add to cart" : "Remove"}
            </ButtonComponent>
          </div>
          {!isAddToCart ? (
            <>
              <div className="flex justify-center text-xl my-4 items-center w-[120px] h-[35px] mx-auto border-[2px] border-[#2590db] ">
                <button
                  className="p-2 font-bold text-[#2590db]"
                  onClick={() => handleChangedQuantity(product, "dec")}
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={quantity}
                  readOnly
                  className="text-center w-[50px] pl-4 text-base outline-none border-none font-bold"
                />
                <button
                  className="p-2 font-bold text-[#2590db]"
                  onClick={() => handleChangedQuantity(product, "inc")}
                >
                  +
                </button>
              </div>
              <div className=" text-lg md:text-xl font-bold text-gray-900  text-center mt-2">
                Grand Total:{" "}
                <span className="font-normal">
                  {" "}
                  ${quantity * product.price}
                </span>
              </div>
            </>
          ) : null}
        </Card>
      </div>
    </>
  );
};

export default Product;