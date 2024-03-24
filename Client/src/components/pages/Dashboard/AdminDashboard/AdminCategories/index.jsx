import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Table from "../../../../common/Table"
import { DeleteCategoryById, getCategories } from "../../../../../utils/axios-instance"
import ConfirmDeleteModal from "../../../../common/ConfirmDeleteModal"
import ButtonComponent from "../../../../common/ButtonComponent"

const AdminCategories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [categoryIdToBeDeleted, setCategoryIdToBeDeleted] = useState(null);

    const categoriesArray = [
        { key: "name", label: " Name" },
    ];

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
                    Id={categoryIdToBeDeleted}
                    handleDelete={deleteCategory}
                    setShowConfirmationModal={setShowConfirmationModal}
                    setDataIdToBeDeleted={setCategoryIdToBeDeleted}
                />
            )}
            <div className="text-center text-2xl font-bold mt-8 mb-8">
                Manage Category
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <ButtonComponent buttonStyle="bg-green-500 border-green-500 hover:text-green-500 text-base mt-0 cursor-default">
                    <Link to="/admin-createCategories">+ ADD CATEGORY</Link>
                </ButtonComponent>
            </div>
            {/* <Table data={categories} handleUpdate={handleUpdate} handleProductDelete={handleProductDelete} type="category" /> */}
            <Table data={categories}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                headers={categoriesArray} />
        </>
    )
}

export default AdminCategories
