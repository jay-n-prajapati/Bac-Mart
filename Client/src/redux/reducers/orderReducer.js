const initialState = {
  totalOrders: [],
  sellersDetails: {},
  currentOrders: [],
  acceptedOrders: [],
};

export function orderReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_TOTAL_ORDERS": {
      return { ...state, totalOrders: action.payload };
    }
    case "FETCH_SELLERS_DETAILS": {
      return { ...state, sellersDetails: action.payload };
    }
    case "SET_SELLERS_INVENTORY": {
      return { ...state, inventory: action.payload };
    }
    case "CURRENT_ORDERS": {
      return { ...state, currentOrders: action.payload };
    }
    case "UPDATE_REJECT_ORDER": {
      const order_id = parseInt(action.payload, 10);
      const currentOrderArray = [...state.currentOrders];
      const Index = currentOrderArray.findIndex((order) => {
        const id = parseInt(order.id, 10);
        return id === order_id;
      });
      currentOrderArray.splice(Index, 1);
      const new_State = {
        ...state,
        currentOrders: currentOrderArray,
      };
      return new_State;
    }
    case "UPDATE_ACCEPT_ORDER": {
      const orderId = action.payload;
      const newCurrentOrderArray = [...state.currentOrders];
      const index = newCurrentOrderArray.findIndex((order) => {
        const id = parseInt(order.id, 10);
        return id === orderId;
      });
      const dummyAcceptedOrder = newCurrentOrderArray[index];
      newCurrentOrderArray.splice(index, 1);
      const newState = {
        ...state,
        currentOrders: newCurrentOrderArray,
        acceptedOrders: [...state.acceptedOrders, dummyAcceptedOrder],
      };
      return newState;
    }

    default:
      return state;
  }
}
