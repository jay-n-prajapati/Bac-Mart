import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import App from "./App.jsx";
// import Card from "./components/pages/Dashboard/ProducerDashboard/Card.component.jsx"
// import Card from "./components/pages/Dashboard/ProducerDashboard/CCCardComponent.jsx"
import OrdersDashboard from "./components/pages/Dashboard/ProducerDashboard/OrdersDashboard.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      {/* <Card/> */}
      {/* <Card/> */}
      {/* <OrdersDashboard/> */}
    </Provider>
  </React.StrictMode>
);
