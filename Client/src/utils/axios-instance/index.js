import axios from "axios";
import { setRole } from "../../redux/actions/roleAction";

export const API = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

export const getProducts = async () => {
  try {
    const res = await API.get("products");
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};

export const addProduct = async (product) => {
  try {
    const res = await API.post("products", product);
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const updateSellerProducts = async (seller, newProductId) => {
  try {
    const sellerProducts = seller.productsToSell;
    const updatedSellersProducts = [...sellerProducts, newProductId];
    const newSellerObj = {
      ...seller,
      productsToSell: updatedSellersProducts,
    };
    const res = await API.put(`sellers/${seller.id}`, newSellerObj);

    return {
      success: true,
      data: newSellerObj,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const getProductById = async (id) => {
  try {
    const res = await API.get(`products/${id}`);
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const updateProduct = async (product) => {
  try {
    const res = await API.put(`products/${product.id}`, product);
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};


// export const updateProduct = async (productId, updatedFields) => {
//   try {
//     const res = await API.patch(`products/${productId}`, updatedFields);
//     return {
//       success: true,
//       data: res.data,
//       error: null,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       data: null,
//       error: error.message,
//     };
//   }
// };
export const DeleteProductbyId = async (id) => {
  try {
    const res = await API.delete(`products/${id}`);
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const addCategory = async (category) => {
  try {
    const res = await API.post("categories", category);
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const getCategories = async () => {
  try {
    const res = await API.get("categories");
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const getCategoryById = async (id) => {
  try {
    const res = await API.get(`categories/${id}`);
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};
//fetch all users
export const UpdateCategory = async (category) => {
  try {
    const res = await API.put(`categories/${category.id}`, category);
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const DeleteCategoryById = async (id) => {
  try {
    const res = await API.delete(`categories/${id}`);
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};
export const getUsers = async () => {
  try {
    const res = await API.get("users");
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};

export const getSellers = async () => {
  try {
    const res = await API.get("sellers");
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};

export const registerUser = async (userObj) => {
  try {
    const res = await API.post("users", userObj);

    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};

export const registerSeller = async (sellerObj) => {
  try {
    const res = await API.post("sellers", sellerObj);

    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};

export const updateUser = async (updatedUser) => {
  try {
    const res = await API.patch(`users/${updatedUser.id}`, updatedUser);
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};
export const updateSeller = async (updatedSeller) => {
  try {
    const res = await API.patch(`sellers/${updatedSeller.id}`, updatedSeller);
    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};

export const getOrders = async () => {
  try {
    const res = await API.get("orders");

    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};

export const registerOrder = async (ordersObj) => {
  try {
    const res = await API.post("orders", ordersObj);

    return {
      success: true,
      data: res.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};
//delete user from admin
export const deleteUser = async (id) => {
  try {
      const res = await API.delete(`/users/${id}`);
      return {
          success: true,
          data: res.data,
          error: null,
      };
  } catch (error) {
      return {
          success: false,
          data: [],
          error: error.message,
      };
  }
};

//update user from admin
export const updateUserFromAdmin = async (id, userData) => {
  try {
      const res = await API.patch(`/users/${id}`, userData);
      return {
          success: true,
          data: res.data,
          error: null,
      };
  } catch (error) {
      return {
          success: false,
          data: [],
          error: error.message,
      };
  }
};

//create user from admin
export const createUser = async (userData) => {
  try {
      const res = await API.post(`/users`, userData);
      return {
          success: true,
          data: res.data,
          error: null,
      };
  } catch (error) {
      return {
          success: false,
          data: [],
          error: error.message,
      };
  }
};