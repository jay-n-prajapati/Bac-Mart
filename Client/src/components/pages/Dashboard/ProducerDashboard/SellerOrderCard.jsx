import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { worker } from "../../../../redux/actions/orderActions";
import { toast } from "react-toastify";
import Card from "../../../common/Card";
import ButtonComponent from "../../../common/ButtonComponent";

function SellerOrderCard({ card_data, hideButtons }) {
  const sellerState = useSelector((state) => state.orderReducer);
  const dispatch = useDispatch();
  const { cardData, order, sellerid, handleflag } = card_data;
  const [productdetails, setProductdetails] = useState(cardData);
  const [orderData, setorderData] = useState(order);
  const [selectedDate, setSelectedDate] = useState("");
  const [editable, seteditable] = useState(false);
  const [deliveryDateFilled, setDeliveryDateFilled] = useState(false);

  useEffect(() => {
    setProductdetails(cardData);
    setorderData(order);
  }, [cardData, order]);

  const date1 = new Date();
  const date2 = new Date(selectedDate);
  // let day = date.getDate();
  // let month = date.getMonth() + 1;
  // let year = date.getFullYear();
  // let currentDate = `${day}-${month}-${year}`;
  // console.log(date.getTime() - date1.getTime());
  const dateArray = parseInt(selectedDate);
  console.log(typeof selectedDate);

  function handleAccept(string) {
    if (
      (orderData &&
        orderData.order_accepted === "pending" &&
        deliveryDateFilled) ||
      string === "handlesubmit"
    ) {
      if (date2 >= date1) {
        const temporder = {
          ...orderData,
          order_accepted: "accepted",
          accepted_by: `${sellerid}`,
          expected_delivery: `${selectedDate}`,
        };
  
        setorderData(temporder);
  
        dispatch(
          worker(
            "UPDATE_ORDER",
            "UPDATE_ACCEPT_ORDER",
            `http://localhost:3000/orders/${temporder.id}`,
            temporder
          )
        );
        toast.success("Order accepted");
      }else{toast.error("Please choose Proper Date")}

     
    } else {
      toast.error("Please add a delivery date");
    }

    handleflag();
  }

  function handleDelay() {
    seteditable(true);
  }

  function handleSubmit() {
    if (deliveryDateFilled) {
      handleAccept("handlesubmit");
      seteditable(false);
    } else {
      toast.error("add delivery date");
    }
  }

  function handleReject() {
    if (orderData && orderData.order_accepted === "pending") {
      const temporder = {
        ...orderData,
        order_accepted: "rejected",
        accepted_by: "",
      };
      setorderData(temporder);
      dispatch(
        worker(
          "UPDATE_ORDER",
          "UPDATE_REJECT_ORDER",
          `http://localhost:3000/orders/${temporder.id}`,
          temporder
        )
      );
      toast.error("order rejected");
    }

    handleflag();
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
      {productdetails ? (
        <>
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
                <span className="text-2xl lg:text-2xl justify-start font-bold text-gray-900 ">
                  ${productdetails.price}
                </span>

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
                      <Button
                        onClick={handleAccept}
                        text="Accept"
                        buttonStyle="mt-[0!important]  "
                      />
                      <Button
                        onClick={handleReject}
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
