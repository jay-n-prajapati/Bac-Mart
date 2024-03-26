import React, { useEffect, useState } from "react";
import SellerOrderCard from "./SellerOrderCard";
import { useDispatch, useSelector } from "react-redux";
import { worker, currentOrders } from "../../../../redux/actions/orderActions";

function OrdersDashboard({ whichComponent }) {
  const roleData = JSON.parse(localStorage.getItem("role"));
  let sellerId = parseInt(roleData.seller.id);
  let productIdArray = roleData.seller.productsToSell || [];
  const [totalOrders, setTotalOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [acceptedOrdersToShow, setAcceptedOrdersToShow] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [flag, setFlag] = useState(false);
  const sellersState = useSelector((state) => state.orderReducer);
  const dispatch = useDispatch();

  function handleFlag() {
    setFlag(!flag);
  }

  function starter() {
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
  }
  function getAcceptedOrders() {
    return totalOrders.filter(
      (order) =>
        order.order_accepted === "accepted" &&
        productIdArray.includes(order.product_id)
    );
  }
  useEffect(() => {
    starter();
  }, [flag]);

  useEffect(() => {
    setTotalOrders(sellersState.totalOrders);
    setAvailableOrders(sellersState.currentOrders);
    setAcceptedOrders(sellersState.acceptedOrders);
  }, [sellersState]);

  useEffect(() => {
    let dummyAvailableOrders = [];
    if (totalOrders) {
      dummyAvailableOrders = totalOrders.filter((order) => {
        if (order.order_accepted === "pending")
          return productIdArray.includes(order.product_id);
      });
    }

    dispatch(currentOrders(dummyAvailableOrders));

    const dummyAcceptedOrdersToShow = getAcceptedOrders();
    setAcceptedOrdersToShow(dummyAcceptedOrdersToShow);
  }, [totalOrders]);

  return (
    <>
      {whichComponent === "pendingOrders" ? (
        availableOrders && availableOrders.length ? (
          <div className="mt-5 mx-auto grid gap-4 lg:gap-10 w-fit grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:lg:grid-cols-3 p-6">
            {availableOrders.map((order) => (
              <SellerOrderCard
                key={order.id}
                card_data={{
                  order: order,
                  sellerId: sellerId,
                  handleFlag: handleFlag,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center font-bold text-2xl h-[100vh] w-full">
            No Pending Orders Found
          </div>
        )
      ) : whichComponent === "acceptedOrders" ? (
        acceptedOrdersToShow && acceptedOrdersToShow.length ? (
          <div className="mt-5 mx-auto grid gap-4 lg:gap-10 w-fit grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:lg:grid-cols-3 p-6">
            {acceptedOrdersToShow.map((order) => (
              <SellerOrderCard
                key={order.id}
                card_data={{
                  order: order,
                  sellerId: sellerId,
                  handleFlag: handleFlag,
                }}
                hideButtons={true}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center font-bold text-2xl h-[100vh] w-full">
            No Accepted Orders Found
          </div>
        )
      ) : null}
    </>
  );
}

export default OrdersDashboard;
