import { useEffect, useState } from "react";
import { getOrders } from "../../../utils/axios-instance";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "../../common/Pagination";
import { setLoader } from "../../../redux/actions/appActions";
import Loader from "../../common/Loader";

const MyOrders = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.role.user);
  const { loader } = useSelector((state) => state.app);
  const [orders, setOrders] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [recordPerPage] = useState(6);

  const indexOfLastRecord = currPage * recordPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordPerPage;
  const sliceOrders = orders.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(orders.length / recordPerPage);

  useEffect(() => {
    (async () => {
      try {
        dispatch(setLoader(true));
        const { success, data, error } = await getOrders();

        if (success) {
          const newOrders = data.filter((order) => order.user_id === user.id);
          setOrders(newOrders);
        } else {
          console.log("Failed to load orders ", error);
          toast.error(
            "Problem while fetching orders, Please try after some time!"
          );
        }
      } catch (error) {
        console.log("Failed to load orders ", error);
      } finally {
        dispatch(setLoader(false));
      }
    })();
  }, []);

  if (loader) {
    return <Loader />;
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-center mb-8 pb-2 text-5xl font-bold">
          No orders found !!
        </h2>
      </div>
    );
  }
  return (
    <div className="px-24 py-10">
      <h2 className="text-center mb-8 border-b-2 pb-2 text-3xl font-bold">
        Order Summary - {user.name}
      </h2>
      <div className="overflow-x-auto">
      <table className="w-full border-collapse overflow-x-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2 font-bold text-lg">Product Name</th>
            <th className="border px-4 py-2 font-bold text-lg">
              Requested Quantity
            </th>
            <th className="border px-4 py-2 font-bold text-lg">Order Date</th>
            <th className="border px-4 py-2 font-bold text-lg">Order Time</th>
            <th className="border px-4 py-2 font-bold text-lg">
              Expected Delivery
            </th>
            <th className="border px-4 py-2 font-bold text-lg">Status</th>
          </tr>
        </thead>
        <tbody>
          {sliceOrders.map((order, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{order.product?.title}</td>
              <td className="border px-4 py-2">{order.quantity}</td>
              <td className="border px-4 py-2">
                {order.ordered_at.split(", ")[0]}
              </td>
              <td className="border px-4 py-2">
                {order.ordered_at.split(" ")[1]}
              </td>
              <td className="border px-4 py-2">
                {order.expected_delivery ||
                  `${parseInt(order.ordered_at.split("")[0]) + 3}/14/2024`}
              </td>
              <td
                className={`border px-4 py-2 ${
                  order.order_accepted === "pending"
                    ? "text-[#f29339]"
                    : order.order_accepted === "accepted"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {order.order_accepted === "pending"
                  ? "Pending"
                  : order.order_accepted
                  ? "Accepted"
                  : "Rejected"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <Pagination
        nPages={nPages}
        currentPage={currPage}
        setCurrentPage={setCurrPage}
      />
    </div>
  );
};

export default MyOrders;
