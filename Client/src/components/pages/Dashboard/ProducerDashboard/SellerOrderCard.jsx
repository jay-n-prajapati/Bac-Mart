import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { worker } from "../../../../redux/actions/orderActions";
import { toast } from "react-toastify";
import Card from "../../../common/Card";
import ButtonComponent from "../../../common/ButtonComponent";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";

function SellerOrderCard({ card_data, hideButtons }) {
  const sellerState = useSelector((state) => state.orderReducer);
  const dispatch = useDispatch();
  const { cardData, order, sellerId, handleFlag } = card_data;
  const [orderData, setOrderData] = useState(order);
  const [selectedDate, setSelectedDate] = useState("");
  const [editable, setEditable] = useState(false);
  const [deliveryDateFilled, setDeliveryDateFilled] = useState(false);
  const [mrp, setMrp] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const date1 = new Date();
  const date2 = new Date(selectedDate);

  useEffect(() => {
    setOrderData(order);

    let roundedDiscount =
      Math.round(orderData.product.discountPercentage) / 100;
    let descPrice = Math.round(orderData.product.price * (1 - roundedDiscount));
    setMrp(descPrice);
  }, [cardData, order]);

  function handleAccept(string) {
    if (
      (orderData &&
        orderData.order_accepted === "pending" &&
        deliveryDateFilled) ||
      string === "handleSubmit"
    ) {
      if (date2 >= date1) {
        const tempOrder = {
          ...orderData,
          order_accepted: "accepted",
          accepted_by: `${sellerId}`,
          expected_delivery: `${selectedDate}`,
        };

        setOrderData(tempOrder);

        dispatch(
          worker(
            "UPDATE_ORDER",
            "UPDATE_ACCEPT_ORDER",
            `http://localhost:3000/orders/${tempOrder.id}`,
            tempOrder
          )
        );
        toast.success("Order accepted");
      } else {
        toast.error("Please choose Proper Date");
      }
    } else {
      toast.error("Please add a delivery date");
    }

    handleFlag();
  }

  function handleDelay() {
    setEditable(true);
  }

  function handleSubmit() {
    if (deliveryDateFilled) {
      handleAccept("handleSubmit");
      setEditable(false);
    } else {
      toast.error("add delivery date");
    }
  }

  function handleReject() {
    if (orderData && orderData.order_accepted === "pending") {
      const tempOrder = {
        ...orderData,
        order_accepted: "rejected",
        accepted_by: "",
      };
      setOrderData(tempOrder);
      dispatch(
        worker(
          "UPDATE_ORDER",
          "UPDATE_REJECT_ORDER",
          `http://localhost:3000/orders/${tempOrder.id}`,
          tempOrder
        )
      );
      toast.error("order rejected");
    }

    handleFlag();
  }

  const DeliveryLabel = () => (
    <label
      className="text-black text-sm  md:text-base lg:text-lg mr-3
      "
      htmlFor="delivery_calender"
    >
      Delivery Date :
    </label>
  );

  function handleModal() {
    console.log("handleModal worked");
    setShowModal(true);
  }

  const DeliveryInput = ({ value, onChange, readOnly }) => {
    return (
      <input
        name="delivery_calender"
        type="date"
        placeholder="select date to deliver"
        value={value}
        autoFocus={editable}
        onChange={onChange}
        readOnly={readOnly}
        className={`bg-gray-200 px-3 py-1 rounded-md w-auto text-center tracking-tight text-sm  md:text-base lg:text-lg ${
          editable ? "cursor-not-allowed" : "cursor-text"
        }`}
        required
      />
    );
  };

  const Button = ({ onClick, text, buttonStyle }) => {
    return (
      <ButtonComponent buttonStyle={buttonStyle} onClick={onClick}>
        {text}
      </ButtonComponent>
    );
  };

  return (
    <>
      {orderData.product ? (
        <>
          {showModal && (
            <ConfirmDeleteModal
              Id={orderData.product.id}
              handleDelete={handleReject}
              setShowConfirmationModal={setShowModal}
              setDataIdToBeDeleted={orderData.product.id}
            />
          )}

          <div className="   mr-3  md:mr-0 ">
            <Card product={orderData.product} identifier={"ordersCard"}>
              {hideButtons ? (
                editable ? (
                  <div className="flex flex-col md:flex-row items-center justify-between text-black mb-4">
                    <DeliveryLabel />
                    <DeliveryInput
                      id="delivery_calender"
                      onChange={(e) => {
                        const formattedDate = e.target.value;

                        formattedDate.split("-").reverse().join("-");
                        setSelectedDate(formattedDate);
                        setDeliveryDateFilled(true);
                      }}
                      readOnly={!editable}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-between text-black mb-4 ">
                    <DeliveryLabel />
                    <DeliveryInput
                      id="delivery_calender"
                      value={orderData.expected_delivery}
                      readOnly={!editable}
                    />
                  </div>
                )
              ) : (
                //for pending orders
                <div className="flex flex-col md:flex-row items-center justify-between text-black mb-4 ">
                  <DeliveryLabel />
                  <DeliveryInput
                    onChange={(e) => {
                      const formattedDate = e.target.value;
                      formattedDate.split("-").reverse().join("-");
                      setSelectedDate(formattedDate);
                      setDeliveryDateFilled(true);
                    }}
                  />
                </div>
              )}

              <div className="flex flex-row items-center justify-between ">
                <div className="">
                  <span className="text-lg lg:text-2xl justify-start font-bold text-gray-900 mr-1 ">
                    ${orderData.product.price}
                  </span>
                  <span className="text-sm lg:text-sm  font-normal text-gray-700 line-through  ">
                    ${mrp}
                  </span>
                </div>
                <div className="   ">
                  {hideButtons ? (
                    editable ? (
                      <Button
                        onClick={handleSubmit}
                        text="submit"
                        buttonStyle="mt-[0!important]  "
                      />
                    ) : (
                      <Button
                        onClick={handleDelay}
                        text="Delay"
                        buttonStyle="mt-[0!important]  border-[#b91c1c] bg-[#b91c1c] hover:text-[#b91c1c]"
                      />
                    )
                  ) : (
                    <div className="flex flex-row space-x-2 ">
                      {orderData.product.stock === 0?(<>  <Button
                        onClick={handleAccept}
                        text="Accept"
                        buttonStyle="mt-[0!important] hidden  "
                      />
                      </>):(<>  <Button
                        onClick={handleAccept}
                        text="Accept"
                        buttonStyle="mt-[0!important]  "
                      />
                     </>)}
                    <Button
                        onClick={handleModal}
                        text="Reject"
                        buttonStyle="mt-[0!important]  border-[#b91c1c] bg-[#b91c1c] hover:text-[#b91c1c]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <h1>No data available</h1>
      )}
    </>
  );
}

export default SellerOrderCard;
