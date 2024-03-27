import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiHeart } from "react-icons/ci";
import { Link,useNavigate } from "react-router-dom";
import {
  quantityOfProducts,
  removeFromCart,
} from "../../../redux/actions/cartActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API, updateProduct } from "../../../utils/axios-instance";
import { setRole } from "../../../redux/actions/roleAction";
import Card from "../../common/Card";
import ButtonComponent from "../../common/ButtonComponent";
import { MdDelete } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import { PiSmileySad } from "react-icons/pi";
import { RxLapTimer } from "react-icons/rx";

const Product = ({ product, handleClick, isAddToCart }) => {
  const user = useSelector((state) => state.role.user);
  const [quantity, setquantity] = useState(product.quantity);
  const[isAlreadyLiked,setIsAlreadyLiked] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate()

  

  const heartHandle = async (item) => {
    if (user) {
      const alreaydLiked = user.favouriteProducts.filter(
        (product) => product.id === item.id
      );

    if (alreaydLiked.length === 0) {
      user.favouriteProducts.push(item);
      try {
        await API.patch(`/users/${user.id}`, user);
        dispatch(setRole("user", user));
      } catch (error) {
        console.log(error);
      }
    } else {
      const updatedProducts = user.favouriteProducts.filter((product) => product.id != item.id)
      const updatedUser = {...user,favouriteProducts:updatedProducts}
      await API.patch(`/users/${user.id}`,updatedUser)
      dispatch(setRole("user",updatedUser))
      toast.success("Removed from whishlist!", {
        position: "top-right",
      });
    }
  }else{
    toast.warn("Please Login First")
    navigate('/login')
  }
  };
  

  function handleChangedQuantity(product, change) {
    if (change == "dec") {
      product.stock += 1;
      product.quantity -= 1;
      dispatch(
        quantityOfProducts({ id: product.id, quantity: product.quantity })
      );
      setquantity(quantity - 1);
      toast.info(" Product Quantity Decreased!", {
        position: "top-right",
      });
      if (quantity == 1) {
        product.stock = product.stock + product.quantity;
        product.quantity = 0;
        dispatch(removeFromCart(product.id));
        toast.success("Removed from the cart!", {
          position: "top-right",
        });
      }
    } else {
      product.stock -= 1;
      product.quantity += 1;
      if (product.stock >= 0) {
        dispatch(
          quantityOfProducts({ id: product.id, quantity: product.quantity })
        );
        setquantity(quantity + 1);
        toast.info(" Product Quantity Increased!", {
          position: "top-right",
        });
      } else {
        toast.error("No Stocks Available!");
      }
    }
    async function updateStock() {
      const { success, data, error } = await updateProduct(product);
      
    }
    updateStock();
  }

  return (
    <>
      <div className=" items-center lg:mx-auto mr-3  md:mr-0 ">
        <Card
          product={product}
          heartHandle={heartHandle}
          identifier={"usersCard"}
          user={user}
        >
          <div className="flex items-center justify-between ">
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.stock <= 0 ? (
              <div className="text-base lg:text-xl text-red-700 flex gap-2">Out of Stock!!  <PiSmileySad size={24} /></div>
            ) : (
              <ButtonComponent
                onClick={() => handleClick(product)}
                buttonStyle={`text-sm px-[10px!important] py-[5px!important] mt-[0!important] ${
                  !isAddToCart
                    ? `border-[#b91c1c] bg-[#b91c1c] hover:text-[#b91c1c] px-[10px!important]`
                    : ``
                } ${product.stock <=0 ? `pointer-events-none ` : null }` }
              >
                {isAddToCart ? (
                  <FaCartArrowDown size={25} />
                ) : (
                  <MdDelete size={25} />
                )}
              </ButtonComponent>
            )}
          </div>
          {!isAddToCart ? (
            <>
              <div className="flex justify-center text-xl my-4 items-center w-[120px] h-[35px] mx-auto border-[2px] border-[#2590db] ">
                <button
                  className={`p-2 font-bold text-[#2590db] ${product.stock <=0 ? `disabled:opacity-50`: null}`}
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
                  className={`p-2 font-bold text-[#2590db] ${product.stock <=0 ? `pointer-events-none ` : null }`}
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

          {product.stock <= 5 && product.stock >0 ? <div className=" text-base lg:text-xl flex justify-center items-center mt-3 gap-2 text-green-700 "> <RxLapTimer size={24}/> Hurry Up! Only {product.stock} {product.stock == 1 ? `item`: `items` }  left.</div> : null}
        </Card>
      </div>
    </>
  );
};

export default Product;
