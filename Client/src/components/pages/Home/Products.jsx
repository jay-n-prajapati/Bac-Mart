import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import {
  addProductInCart,
  removeFromCart,
} from "../../../redux/actions/cartActions";
import Sorting from "../../common/Sorting";
import Product from "./Product";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searching from "../../common/Searching";

const Products = ({ productData, isAddToCart }) => {
  const user = useSelector((state) => state.role.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(6);

  const [searchResults, setSearchResults] = useState([]);
  const [sortingResult, setSortingResult] = useState([]);
  const dispatch = useDispatch();

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const role = JSON.parse(localStorage.getItem("role")) || "";
  const isLoggedIn = role.isAuth;
  const handleClick = (product) => {
    if (isAddToCart) {
      if (isLoggedIn) {
        dispatch(addProductInCart(product));
      } else {
        toast.warning("Please Login!!");
      }
    } else {
      dispatch(removeFromCart(product.id));
      toast.success("Removed from the cart!", {
        position: "top-right",
      });
    }
  };

  const shouldRenderPagination = sortingResult.length > recordsPerPage;

  return (
    <>
      <div className="display gap-5 flex flex-start flex-col px-4 md:flex-row justify-center items-start">
        <Searching
          dataToSearch={productData}
          setSearchResults={setSearchResults}
          setCurrentPage={setCurrentPage}
        />
        <Sorting
          setSortingResult={setSortingResult}
          searchResults={searchResults}
        />
      </div>
      
  <div className="mt-5 mx-auto grid gap-4 lg:gap-10  w-fit grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:lg:grid-cols-3">
    {sortingResult.length > 0 ? (
      sortingResult
        .slice(indexOfFirstRecord, indexOfLastRecord)
        .map((product) => (
          <Product
            product={product}
            key={product.id}
            handleClick={handleClick}
            isAddToCart={isAddToCart}
          />
        ))
    ) : (
      <div className="justify-center">Oops not found</div>
    )}
  </div>
      {shouldRenderPagination && (
        <div className="flex justify-center items-center w-auto h-10 my-6">
          <Pagination
            nPages={Math.ceil(sortingResult.length / recordsPerPage)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </>
  );
};

export default Products;