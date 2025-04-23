import { NavLink } from "react-router-dom";

const ComonNavbar = () => {
  return (
    <>
      {" "}
      <li className="py-1">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "text-warning fw-bold text-decoration-none"
              : "text-white text-decoration-none"
          }
        >
          Home
        </NavLink>
      </li>
      <li className="py-1 ">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "text-warning fw-bold text-decoration-none"
              : "text-white text-decoration-none"
          }
        >
          About
        </NavLink>
      </li>
      <li className="py-1 ">
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-warning fw-bold text-decoration-none"
              : "text-white text-decoration-none"
          }
        >
          Contact
        </NavLink>
      </li>
       
    </>
  );
};

export default ComonNavbar;
