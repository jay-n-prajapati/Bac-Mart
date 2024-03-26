import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  DeleteProductbyId,
  getProducts,
} from "../../../../utils/axios-instance";
import Pagination from "../../../common/Pagination";
import Sorting from "../../../common/Sorting";
import Searching from "../../../common/Searching";
import Table from "../../../common/Table";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";
import ButtonComponent from "../../../common/ButtonComponent";
import RecordsPerPage from "../../../common/RecordsPerPage";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../../redux/actions/appActions";
import { toast } from "react-toastify";
import Loader from "../../../common/Loader";

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(6);

  const [searchResults, setSearchResults] = useState([]);
  const [sortingResult, setSortingResult] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [productIdToBeDeleted, setProductIdToBeDeleted] = useState(null);
  const { loader } = useSelector((state) => state.app);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const productsArray = [
    { key: "title", label: "Title" },
    { key: "price", label: "Price" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "rating", label: "Rating" },
  ];

  const shouldRenderPagination = sortingResult.length > recordsPerPage
  const handleUpdate = (productID) => {
    navigate(`/admin-update-products/${productID}`)
  }

  const handleDelete = async (productID) => {
    // console.log(productID);
    setProductIdToBeDeleted(productID)
    setShowConfirmationModal(true)
  }

  const deleteProduct = async (productID) => {
    try {
      dispatch(setLoader(true));
      const response = await DeleteProductbyId(productID);
      if (response.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productID)
        );
        toast.success("Product deleted successfully");
      } else {
        console.error("Failed to delete the Products Data", response.error);
        toast.error("Problem deleting product, Please try after some time!");
      }
    } catch (error) {
      console.error("Failed to delete the Products Data", error);
    } finally {
      setShowConfirmationModal(false);
      setProductIdToBeDeleted(null);
      dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProducts()
        if (response.success) {
          console.log(response.data)
          setProducts(response.data)
        } else {
          console.error("Failed to fetch the Products Data", response.error)
        }
      } catch (error) {
        console.error("Error while Fetching products", error)
      }
    }

    fetchData()
  }, []);

  
	return (
		<div>
			{loader && <Loader />}
			{showConfirmationModal && (
				<ConfirmDeleteModal
					itemType="Product"
					Id={productIdToBeDeleted}
					handleDelete={deleteProduct}
					setShowConfirmationModal={setShowConfirmationModal}
					setDataIdToBeDeleted={setProductIdToBeDeleted}
				/>
			)}
			<div className="p-10 px-6 md:p-10">
				<h1 className="text-center text-2xl font-bold mt-8 mb-8">Admin Dashboard</h1>
				<div className=" w-full flex flex-col gap-4 md:flex-row justify-between items-center mb-4">
					<div className="w-full flex flex-col justify-center md:justify-start items-center md:flex-row gap-4">
						<Searching dataToSearch={products} setSearchResults={setSearchResults} setCurrentPage={setCurrentPage} />
					</div>

          <div className="w-full flex flex-row items-center justify-between md:flex-row">
            <Sorting
              setSortingResult={setSortingResult}
              searchResults={searchResults}
            />
            <ButtonComponent buttonStyle="ml-0 sm:ml-4 bg-green-500 border-green-500 hover:text-green-500 text-base cursor-pointer mt-[0px!important]">
              <Link to="/admin-create-products">ADD</Link>
            </ButtonComponent>
            {/* <RecordsPerPage recordsPerPage={recordsPerPage} setCurrentPage={setCurrentPage} setRecordsPerPage={setRecordsPerPage}/> */}
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
        <div className="flex flex-row mt-5">
          <label>Rows Per Page :</label>{" "}
          <RecordsPerPage
            recordsPerPage={recordsPerPage}
            setCurrentPage={setCurrentPage}
            setRecordsPerPage={setRecordsPerPage}
          />
        </div>
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
