import React from "react"
import PrivateRoutesUser from "../utils/PrivateRoutes/PrivateRoutesUser/index.jsx"
import { createBrowserRouter } from "react-router-dom"
import UsersCart from "../components/pages/Home/UsersCart.jsx"
import Profile from "../components/pages/Profile/index.jsx"
import PrivateRoutesAdmin from "../utils/PrivateRoutes/PrivateRoutesAdmin/index.jsx"
import PrivateRoutesSeller from "../utils/PrivateRoutes/PrivateRoutesSeller/index.jsx"
import ProductViewDetails from "../components/pages/Home/ProductViewDetails.jsx"
import AdminCreateUser from "../components/pages/Dashboard/AdminDashboard/AdminUsers/AdminCreateUser.jsx"
import AdminUpdateUsers from "../components/pages/Dashboard/AdminDashboard/AdminUsers/AdminUpdateUsers.jsx"
import { useSelector } from "react-redux"
import AdminCreateCategories from "../components/pages/Register/register-categories/index.jsx"
import OrdersDashboard from "../components/pages/Dashboard/ProducerDashboard/OrdersDashboard.jsx"
import YourProducts from "../components/pages/Dashboard/ProducerDashboard/YourProducts.jsx"
import AdminCategories from "../components/pages/Dashboard/AdminDashboard/AdminCategories/index.jsx"
import UpdateCategories from "../components/pages/Register/register-categories/update-categories/index.jsx"
import MyOrders from "../components/pages/MyOrders/index.jsx"

const Layout = React.lazy(() => import("../components/layout/Layout"))
const Login = React.lazy(() => import("../components/pages/Login"))
const ErrorPage = React.lazy(() => import("../components/pages/ErrorPage"))
const Home = React.lazy(() => import("../components/pages/Home/Home.jsx"))
const Contact = React.lazy(() => import("../components/pages/Contact"))
const RegisterUser = React.lazy(() => import("../components/pages/Register/register-user"))
const RegisterSeller = React.lazy(() => import("../components/pages/Register/register-seller"))
const Admin = React.lazy(() => import("../components/pages/Dashboard/AdminDashboard/index"))
const AdminUsers = React.lazy(() => import("../components/pages/Dashboard/AdminDashboard/AdminUsers/index"))
const AdminProducts = React.lazy(() => import("../components/pages/Register/register-product/index"))
const AdminUpdateProducts = React.lazy(() => import("../components/pages/Register/register-product/update-product/updateProduct.jsx"))
const Wishlist = React.lazy(() => import("../components/pages/Wishlist/Wishlist.jsx"))

export const Router = () => {
	const role = useSelector((state) => state.role)
	return createBrowserRouter([
		{
			element: <Layout />,
			children: [
				{
					path: "/",
					element: <Home />,
				},
				{
					path: "/contact",
					element: <Contact />,
				},
				{
					path: "/products/:productId",
					element: <ProductViewDetails />,
				},
				{
					element: <PrivateRoutesUser isUserAuth={role.user !== null ? true : false} />,
					children: [
						// protected routes for user should be declared here
						{
							path: "wishlist",
							element: <Wishlist />,
						},
						{
							path: "cart",
							element: <UsersCart />,
						},
						{
							path: "profile",
							element: <Profile />,
						},
						{
							path: "orders",
							element: <MyOrders />,
						},
					],
				},
				{
					element: <PrivateRoutesAdmin isAdminAuth={role.admin !== null ? true : false} />,
					children: [
						// protected routes for admin should be declared here
						{
							path: "admin",
							element: <Admin />,
						},
						{
							path: "admin-users", //mansi admin homepage
							element: <AdminUsers />,
						},
						{
							path: "admin-createUser", // mansi admin createuserpage
							element: <AdminCreateUser />,
						},
						{
							path: "admin-update/:id", // mansi admin updateuserpage
							element: <AdminUpdateUsers />,
						},
						{
							path: "admin-create-products",
							element: <AdminProducts />,
						},
						{
							path: "admin-update-products/:productID",
							element: <AdminUpdateProducts />,
						},
						{
							path: "admin-createCategories",
							element: <AdminCreateCategories />,
						},
						{
							path: "admin-categories",
							element: <AdminCategories />,
						},

						{
							path: "admin-update-category/:categoryID",
							element: <UpdateCategories />,
						},
					],
				},
				{
					element: <PrivateRoutesSeller isSellerAuth={role.seller !== null ? true : false} />,
					children: [
						// protected routes for seller should be declared here
						{
							path: "seller/profile",
							element: <Profile />,
						},
						{
							path: "seller-dashboard/pendingorders",
							element: <OrdersDashboard whichcomponent={"pendingorders"} />,
						},
						{
							path: "seller-dashboard/acceptedorders",
							element: <OrdersDashboard whichcomponent={"acceptedorders"} />,
						},
						{
							path: "/seller-products",
							element: <YourProducts />,
						},
						{
							path: "/seller-create-products",
							element: <AdminProducts />,
						},
						{
							path: "/seller-update-products/:productID",
							element: <AdminUpdateProducts />,
						},
					],
				},
				{
					path: "login",
					element: <Login />,
				},
				{
					path: "register",
					element: <RegisterUser />,
				},
				{
					path: "business/register",
					element: <RegisterSeller />,
				},
			],
		},
		{
			path: "*",
			element: <ErrorPage />,
		},
	])
}

// export const Router = (isAuthenticated = false) => {
// 	return createBrowserRouter(
// 		createRoutesFromElements(
// 			<Route>
// 				<Route element={<Layout />}>
// 					<Route index element={<Home />} />
// 					<Route element={<PrivateRoutesCheck isAuthenticated={isAuthenticated} />}>
// 						<Route path="dashboard" element={<Dashboard />}>
// 							<Route path="nested" element={<Nested />} />
// 						</Route>
// 						<Route path="about" element={<About />} />
// 					</Route>
// 					<Route path="*" element={<ErrorPage />} />
// 				</Route>
// 				<Route path="login" element={<Login />} />
// 				<Route path="register" element={<Register />} />
// 			</Route>
// 		)
// 	)
// }
