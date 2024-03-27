import axios from "axios";
import { API } from "../../utils/axios-instance";

export function fetchTotalOrders(data) {
  return { type: "FETCH_TOTAL_ORDERS", payload: data };
}

export function fetchSellersDetails(sellerData) {
  return { type: "FETCH_SELLERS_DETAILS", payload: sellerData };
}

export function currentOrders(currentOrdersData) {
  return { type: "CURRENT_ORDERS", payload: currentOrdersData };
}

export function updateAcceptOrder(orderId) {
  return { type: "UPDATE_ACCEPT_ORDER", payload: orderId };
}

export function updateRejectOrder(orderId) {
  return { type: "UPDATE_REJECT_ORDER", payload: orderId };
}

export function worker(taskName, actionName, api, data) {
  let task;
  if (taskName === "FETCH") {
    task = () =>
      API
        .get(api)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {});
  } else if (taskName === "FETCH_MULTI") {
    task = () =>
      Promise.all(api.map((link) => API.get(link)))
        .then((responses) => {
          const data = responses.map((response) => response.data);

          return data;
        })
        .catch((error) => {
          throw error;
        });
  } else if (taskName === "UPDATE_ORDER") {
    // const orderId =4;
    //     task = () =>{return orderId}

    if (actionName === "UPDATE_REJECT_ORDER") {
      const newApi = `http://localhost:3000/products/${data.product_id} `;
      const newProduct = {
        ...data.product,
        stock: data.product.stock + data.quantity + 1,
      };

      function productArrayUpdate() {
        return API
          .patch(newApi, newProduct)
          .then((res) => {
            return res.data;
          })
          .catch((err) =>
            console.error("Error updating product:", err.message)
          );
      }
      productArrayUpdate();
    }

    task = () => {
      return API
        .patch(api, data)
        .then((res) => {
          const orderId = parseInt(res.data.id, 10);

          return orderId;
        })
        .catch((err) => console.error("Error updating order:", err.message));
    };
  }

  return async function action_maker(dispatch) {
    try {
      const result = await task();

      switch (actionName) {
        case "FETCH_TOTAL_ORDERS":
          dispatch(fetchTotalOrders(result));
          break;

        case "FETCH_SELLERS_DETAILS":
          dispatch(fetchSellersDetails(result));
          break;

        case "UPDATE_ACCEPT_ORDER":
          dispatch(updateAcceptOrder(result));
          break;
        case "UPDATE_REJECT_ORDER":
          dispatch(updateRejectOrder(result));
          break;

        default:
          return;
      }
    } catch (err) {
      console.log(err.message);
    }
  };
}
