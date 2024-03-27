import { FaBoxOpen, FaHeart, FaShoppingCart } from "react-icons/fa";

export const userProfileLinks = [
  {
    label: "Cart",
    slug: "/cart",
    icon: <FaShoppingCart />,
  },
  {
    label: "Wishlist",
    slug: "/wishlist",
    icon: <FaHeart />,
  },
  {
    label: "Orders",
    slug: "/orders",
    icon: <FaBoxOpen />,
  },
];
export const sellerProfileLinks = [
  {
    label: "Pending",
    slug: "/seller-dashboard/pendingorders",
    icon: null,
  },
  {
    label: "Accepted",
    slug: "/seller-dashboard/acceptedorders",
    icon: null,
  },
  {
    label: "Products",
    slug: "/seller-products",
    icon: null,
  },
];
