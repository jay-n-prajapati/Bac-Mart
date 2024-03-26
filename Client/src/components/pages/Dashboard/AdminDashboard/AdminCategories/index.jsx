import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../../common/Table";
import {
  DeleteCategoryById,
  getCategories,
} from "../../../../../utils/axios-instance";
import ConfirmDeleteModal from "../../../../common/ConfirmDeleteModal";
import ButtonComponent from "../../../../common/ButtonComponent";
import Pagination from "../../../../common/Pagination";
import RecordsPerPage from "../../../../common/RecordsPerPage";
const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [categoryIdToBeDeleted, setCategoryIdToBeDeleted] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(6);
  const categoriesArray = [{ key: "name", label: " Name" }];
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const shouldRenderPagination = categories.length > recordsPerPage;
  const handleUpdate = (categoryID) => {
    // console.log(categoryID)
    navigate(`/admin-update-category/${categoryID}`);
  };

  const handleDelete = (categoryID) => {
    setCategoryIdToBeDeleted(categoryID);
    setShowConfirmationModal(true);
  };

  const deleteCategory = async (categoryID) => {
    try {
      const response = await DeleteCategoryById(categoryID);
      if (response.success) {
        // console.log("Product Deleted Successfully!");

        setCategories((prevCategory) =>
          prevCategory.filter((category) => category.id !== categoryID)
        );
      } else {
        console.error("Failed to delete the Products Data", response.error);
      }
    } catch (error) {
      console.error("Failed to delete the Products Data", error);
    } finally {
      setShowConfirmationModal(false);
      setCategoryIdToBeDeleted(null);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
          // console.log(response)
        } else {
          console.error("Failed to fetch the Products Data", response.error);
        }
      } catch (error) {
        console.error("Error while Fetching products", error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <>
      {showConfirmationModal && (
        <ConfirmDeleteModal
          itemType="Category"
          Id={categoryIdToBeDeleted}
          handleDelete={deleteCategory}
          setShowConfirmationModal={setShowConfirmationModal}
          setDataIdToBeDeleted={setCategoryIdToBeDeleted}
        />
      )}
      <div className="p-10 px-6 md:p-10">
      <div className="text-center text-2xl font-bold mt-8 mb-8">
        Manage Category
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end mb-4">
        <ButtonComponent buttonStyle="bg-green-500 border-green-500 hover:text-green-500 text-base mt-0 cursor-default">
          <Link to="/admin-createCategories">+ ADD CATEGORY</Link>
        </ButtonComponent>
      </div>
      {/* <Table data={categories} handleUpdate={handleUpdate} handleProductDelete={handleProductDelete} type="category" /> */}
      <Table
        data={categories.slice(indexOfFirstRecord, indexOfLastRecord)}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        headers={categoriesArray}
      />
      <div className="flex flex-row mt-5">
        <label>Rows Per Page :</label>{" "}
        <RecordsPerPage
          recordsPerPage={recordsPerPage}
          setCurrentPage={setCurrentPage}
          setRecordsPerPage={setRecordsPerPage}
        />
      </div>
      {shouldRenderPagination && (
        <Pagination
          nPages={Math.ceil(categories.length / recordsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      </div>
    </>
  );
};

export default AdminCategories;
