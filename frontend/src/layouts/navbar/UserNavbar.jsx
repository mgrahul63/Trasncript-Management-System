/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import { useData } from "../../context/Context";

const UserNavbar = ({ onClickProfile }) => {
  const { setRole, isAuthenticated, setIsAuthenticated } = useData();

  const handleLogOut = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("isAuthenticated"); // Remove authentication status
  };
  const handleProfile = () => {
    onClickProfile();
  };
  return (
    <>
      <li className="py-2 ">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "text-warning fw-bold text-decoration-none"
              : "text-white text-decoration-none"
          }
          onClick={handleProfile}
        >
          Profile
        </NavLink>
      </li>

      <li className="py-2 ">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-warning fw-bold text-decoration-none"
              : "text-white text-decoration-none"
          }
          onClick={handleProfile}
        >
          Dashboard
        </NavLink>
      </li>

      <li className="py-2">
        <NavLink
          to="#"
          className="text-white text-decoration-none"
          onClick={handleLogOut}
        >
          Log-out
        </NavLink>
      </li>
    </>
  );
};

export default UserNavbar;
