import { NavLink } from "react-router-dom";

const linkClass =
  "w-full h-[3rem] text-white flex flex-col items-center justify-center font-medium text-[.95rem] transition-all duration-250 ease-in-out bg-[#2590db] rounded";

const ProfileLinks = ({ links }) => {
  const scrollToTop = () => {
    window.scrollTo({ top, behavior: "smooth" });
  };
  return (
    <>
      {links.map((link, idx) => {
        return (
          <NavLink
            key={idx}
            to={link.slug}
            className={linkClass}
            onClick={scrollToTop}
          >
            {link.icon}
            {link.label}
          </NavLink>
        );
      })}
    </>
  );
};

export default ProfileLinks;
