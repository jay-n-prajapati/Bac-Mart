import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

const Links = ({ children, linksToRender, toggleNavbar }) => {
	const { cartItems } = useSelector((state) => state.CartReducer)
	return (
		<>
			<ul className="font-medium text-base flex flex-col items-center gap-4 md:gap-0 md:flex-row">
				{linksToRender.map((element, idx) => {
					return (
						<li key={idx}>
							<NavLink
								to={element.slug}
								onClick={() => toggleNavbar()}
								className={({ isActive }) =>
									`${
										isActive ? "text-black bg-[#7CBCE9]" : "text-white"
									} flex items-center gap-1 text-[1rem] p-2 rounded transition-all duration-200 ease-in-out hover:text-black`
								}>
								{element?.icon}
								{element?.label}
								<span>{element.orderCount ? `(${cartItems.length})` : ""}</span>
							</NavLink>
						</li>
					)
				})}
				{children}
			</ul>
		</>
	)
}

export default Links
