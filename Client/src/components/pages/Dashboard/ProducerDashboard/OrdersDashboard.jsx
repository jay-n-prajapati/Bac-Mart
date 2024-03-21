import React, { useEffect, useState } from "react";
import axios from "axios";
import SellerOrderCard from "./SellerOrderCard";
import { useDispatch, useSelector } from "react-redux";
import { worker, current_orders } from "../../../../redux/actions/orderActions";
function OrdersDashboard({ whichcomponent }) {
  const roleData = JSON.parse(localStorage.getItem("role"));
  let sellerId = parseInt(roleData.seller.id);
  let productidArray = roleData.seller.productsToSell || [];

  const [totalorders, settotalorders] = useState([]);
  const [acceptedorders, setacceptedorders] = useState([]);
  const [inventory, setinventory] = useState([]);
  const [availabeleorders, setavailabeleorders] = useState([]);
  const [cardData, setcardData] = useState([]);
  const [flag, setflag] = useState(false);
  const sellersState = useSelector((state) => state.orderReducer);
  const dispatch = useDispatch();

  function handleflag() {
    setflag(!flag);
  }

  useEffect(() => {
    dispatch(
      worker(
        "FETCH",
        "FETCH_SELLERS_DETAILS",
        `http://localhost:3000/sellers/${sellerId}`
      )
    );

    dispatch(
      worker("FETCH", "FETCH_TOTAL_ORDERS", "http://localhost:3000/orders")
    );
  }, [dispatch, flag]);

  useEffect(() => {
    settotalorders(sellersState.total_orders);
    // console.log(sellersState)
    setavailabeleorders(sellersState.current_orders);

    setacceptedorders(sellersState.accptedorders);
  }, [sellersState]);

  useEffect(() => {
    if (
      productidArray !== undefined &&
      sellersState.needed_products.length < productidArray.length
    ) {
      // console.log("if worked");

      const apitosend = productidArray.map(
        (id) => `http://localhost:3000/products/${id}`
      );

      // const api = ["http://localhost:3000/products/1",
      // "http://localhost:3000/products/2",
      // "http://localhost:3000/products/3"]
      dispatch(worker("FETCH_MULTI", "FETCH_NEEDED_PRODUCTS", apitosend));
    }

    setinventory(sellersState.needed_products);
  }, [productidArray, sellersState.needed_products]);

  useEffect(() => {
    const dummyavailableorders = totalorders.filter((order) => {
      if (order.order_accepted === "pending")
        return productidArray.includes(order.product_id);
    });
    // console.log(dummyavailableorders);
    dispatch(current_orders(dummyavailableorders));
  }, [totalorders]);

  useEffect(() => {
    let dummycardData = [];
    if (availabeleorders.length > 0) {
      dummycardData = availabeleorders.map((order) => {
        return inventory.find((product) => product.id === order.product_id);
      });
    }

    setcardData(dummycardData);
  }, [availabeleorders, inventory]);

  return (
    <>
      <div className="mt-5 mx-auto grid gap-4 lg:gap-10  w-fit grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:lg:grid-cols-3 p-6  ">
        {whichcomponent === "pendingorders" ? (
          availabeleorders &&
          availabeleorders.length &&
          cardData &&
          cardData.length !== 0 ? (
            availabeleorders.map((order, index) => (
              
                <SellerOrderCard
                  key={order.id}
                  card_data={{
                    cardData: cardData[index],
                    order: order,
                    sellerid: sellerId,
                    handleflag: handleflag,
                  }}
                />
            
            ))
          ) : (
            <h1>No Pending Orders</h1>
          )
        ) : whichcomponent === "acceptedorders" ? (
          totalorders && totalorders.length ? (
            totalorders.map((order, index) => {
              if (
                order.order_accepted === "accepted" &&
                productidArray.includes(order.product_id)
              ) {
                return (
                  <SellerOrderCard
                    key={order.id}
                    card_data={{
                      order: order,
                      cardData: inventory.find(
                        (product) => product.id === order.product_id
                      ),
                      sellerid: sellerId,
                      handleflag: handleflag,
                    }}
                    hideButtons={true}
                  />
                );
              } else {
                return null; // Return null if the condition is not met
              }
            })
          ) : (
            <h1>No Accepted Orders</h1>
          )
        ) : (
          <h1>No Orders</h1>
        )}
      </div>
    </>
  );
}

export default OrdersDashboard;
