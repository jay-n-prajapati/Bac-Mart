import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DeleteProductbyId,
  getProducts,
} from "../../../../utils/axios-instance";
import Pagination from "../../../common/Pagination";
import Sorting from "../../../common/Sorting";
import Searching from "../../../common/Searching";
import Table from "../../../common/Table";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";
import Input from "../../../common/Input";
import ButtonComponent from "../../../common/ButtonComponent";

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(6);

  const [searchResults, setSearchResults] = useState([]);
  const [sortingResult, setSortingResult] = useState([]);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [productIdToBeDeleted, setProductIdToBeDeleted] = useState(null);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const productsArray = [
    { key: "id", label: "Product ID" },
    { key: "title", label: "Title" },
    { key: "price", label: "Price" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
  ];

  const shouldRenderPagination = sortingResult.length > recordsPerPage;

  const handleUpdate = (productID) => {
    navigate(`/admin-update-products/${productID}`);
  };

  const handleDelete = async (productID) => {
    // console.log(productID);
    setProductIdToBeDeleted(productID);
    setShowConfirmationModal(true);
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await DeleteProductbyId(productId);
      if (response.success) {
        // console.log("Product Deleted Successfully!");
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      } else {
        console.error("Failed to delete the Products Data", response.error);
      }
    } catch (error) {
      console.error("Failed to delete the Products Data", error);
    } finally {
      setShowConfirmationModal(false);
      setProductIdToBeDeleted(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProducts();
        if (response.success) {
          setProducts(response.data);
        } else {
          console.error("Failed to fetch the Products Data", response.error);
        }
      } catch (error) {
        console.error("Error while Fetching products", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {showConfirmationModal && (
        <ConfirmDeleteModal
          Id={productIdToBeDeleted}
          handleDelete={deleteProduct}
          setShowConfirmationModal={setShowConfirmationModal}
          setDataIdToBeDeleted={setProductIdToBeDeleted}
        />
      )}
      <div className="p-10 px-6 md:p-10">
      <h1 className="text-center text-2xl font-bold mt-8 mb-8">
        Admin Dashboard
      </h1>
      <div className=" w-full flex flex-col gap-4 md:flex-row justify-between items-center mb-4">
          <div className="w-full flex flex-col justify-center md:justify-start items-center md:flex-row gap-4">
            <Searching
              dataToSearch={products}
              setSearchResults={setSearchResults}
              setCurrentPage={setCurrentPage}
            />
          </div>

          <div className="w-full flex flex-row items-center justify-between md:flex-row">
          <Sorting
          
            setSortingResult={setSortingResult}
            searchResults={searchResults}
          />
        <ButtonComponent buttonStyle="ml-0 sm:ml-4 mt-3 bg-green-500 border-green-500 hover:text-green-500 text-base cursor-pointer mt-[0px!important]">
          <Link to="/admin-create-products">ADD</Link>
        </ButtonComponent>
        </div>
      </div>

      {sortingResult.length > 0 ? (
        <Table
          data={sortingResult.slice(indexOfFirstRecord, indexOfLastRecord)}
          headers={productsArray}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      ) : (
        <div className="justify-center">Oops not found</div>
      )}
      {shouldRenderPagination && (
        <div className="w-full">
        <Pagination
          nPages={Math.ceil(sortingResult.length / recordsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        </div>
      )}
      </div>
    </div>
  );
};

export default Index;
