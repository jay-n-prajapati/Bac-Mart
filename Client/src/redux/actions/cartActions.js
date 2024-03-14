export const ADD_TO_CART = 'ADD_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
export const QUANTITY = 'QUANTITY'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


////  Add to cart action creator
export const addToCart = (product) => {
    return({
      type:ADD_TO_CART,
      payload:product
    })
}

export const quantityOfProducts = (payload)=>{
  return(
    {
      type:QUANTITY,
      payload:payload
    }
  )
}

export const addProductInCart = (product) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const cartItems = state.CartReducer.cartItems;

      const productExistIndex = cartItems.findIndex(item => item.id === product.id);

      if (productExistIndex !== -1) {
        
         const updatedCartItems = [...cartItems];
         const prod= updatedCartItems[productExistIndex]
        updatedCartItems[productExistIndex].quantity += 1; 
        updatedCartItems[productExistIndex].stock -= 1; 
        dispatch(addToCart(prod)); 
        toast.success("Added to the cart!", {
          position: 'top-right',
        });
      } else {
        const newCartItem = { ...product, quantity: 1, stock: product.stock - 1 }; 
        dispatch(addToCart(newCartItem)); 
        toast.success("Added to the cart!", {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error("Error Occured!", {
        position: 'top-right',
      });
      console.log("Error occurred while adding product to cart:", error);
    }
  };
};

export const removeFromCart = (id) =>{
  return({
    type:REMOVE_FROM_CART,
    payload:id
  })
}