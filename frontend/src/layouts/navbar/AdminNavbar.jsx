/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useData } from "../../context/Context";

const AdminNavbar = ({ onClickProfile }) => {
  const { setRole } = useData();
  const navigate = useNavigate();

  const FetchQuery = async () => {
    const jwt = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    try {
      if (jwt && role === "admin") {
        const { data } = await axios.post(
          "http://localhost/versity/backend/api/verifyToken.php",
          { jwt },
          { headers: { "Content-Type": "application/json" } }
        );
        return data.status === "success" ? data.data : null;
      }
      return null;
    } catch (error) {
      console.error("Error verifying token:", error);
      return null;
    }
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => setData(await FetchQuery());
    fetch();
  }, []);

  const handleLogOut = () => {
    onClickProfile();
    localStorage.clear();
    setRole("");
    navigate("/");
  };

  const renderNavLinks = () => {
    if (data?.role_type === "facultyAdmin") {
      return (
        <>
          <NavLinkItem to="admin/faculty/profile">Profile</NavLinkItem>
          <NavLinkItem to="admin/faculty/dashboard">Dashboard</NavLinkItem>
        </>
      );
    } else if (data?.role_type === "departmentAdmin") {
      return (
        <>
          <NavLinkItem to="admin/department/profile">Profile</NavLinkItem>
          <NavLinkItem to="admin/department/dashboard">Dashboard</NavLinkItem>
        </>
      );
    } else if (data?.role_type === "registerAdmin") {
      return (
        <>
          <NavLinkItem to="admin/register/profile">Profile</NavLinkItem>
          <NavLinkItem to="admin/register/dashboard">Dashboard</NavLinkItem>
        </>
      );
    }
    return null;
  };

  const NavLinkItem = ({ to, children }) => (
    <li className="py-2">
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? "text-warning fw-bold text-decoration-none"
            : "text-white text-decoration-none"
        }
        onClick={onClickProfile}
      >
        {children}
      </NavLink>
    </li>
  );

  return (
    <>
      {renderNavLinks()}
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

export default AdminNavbar;
