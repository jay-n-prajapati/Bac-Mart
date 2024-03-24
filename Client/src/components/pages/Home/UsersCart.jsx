import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Products from "./Products";
import { getOrders, registerOrder } from "../../../utils/axios-instance";
import { toast } from "react-toastify";
import { clearCart } from "./../../../redux/actions/cartActions";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../common/ButtonComponent";

const UsersCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.CartReducer.cartItems);
  const user = useSelector((state) => state.role.user);

  const [orders, setOrders] = useState([]);

  const handleCheckout = async () => {
    let orderId =
      orders.length !== 0
        ? (parseInt(orders[orders.length - 1].id) + 1).toString()
        : "1";

    let gloableSuccess;

    for (let i = 0; i < cartItems.length; i++) {
      const newOrderObj = {
        id: orderId,
        user_id: user.id,
        product_id: cartItems[i].id,
        ordered_at: `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
        expected_delivery: "",
        order_accepted: "pending",
        accepted_by: "",
        quantity: cartItems[i].quantity,
        product: cartItems[i],
      };
      const { success, data, error } = await registerOrder(newOrderObj);
      gloableSuccess = success;

      orderId = (parseInt(orderId) + 1).toString();

      if (error) {
        toast.error("Something went wronge. Try again later!");
        return;
      }
    }

    if (gloableSuccess) {
      dispatch(clearCart());
      toast.success("Orders placed successfully");
      navigate("/");
    }
  };

  useEffect(() => {
    (async () => {
      const { success, data, error } = await getOrders();

      if (error) {
        toast.error("Something went wrong. Try again later!");
      }

      setOrders(data);
    })();
  }, []);

  return (
    <div>
      {cartItems.length > 0 ? (
        <div className="flex flex-col justify-center items-center px-6">
          <Products productData={cartItems} isAddToCart={false} />
          <ButtonComponent
            onClick={handleCheckout}
            buttonStyle="uppercase"
          >
            Checkout
          </ButtonComponent>
        </div>
      ) : (
        <div>
          <h1 className="text-center text-3xl font-bold">
            No Product Available!
          </h1>
        </div>
      )}
    </div>
  );
};

export default UsersCart;
