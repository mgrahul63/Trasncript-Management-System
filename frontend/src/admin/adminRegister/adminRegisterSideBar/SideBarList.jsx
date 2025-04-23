/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";

const SideBarListController = ({
  isSidebarVisible,
  setIsSidebarVisible,
  isMenu,
  setIsMenu,
}) => {
  const location = useLocation();

  const handleClick = () => {
    if (window.innerWidth <= 1000) {
      setIsSidebarVisible(false);
      setIsMenu(!isMenu);
    }
  };

  // List of sidebar links
  const links = [
    { to: "/admin/register/dashboard", label: "Dashboard" },
    { to: "/admin/register/applications", label: "Applications" },
    { to: "/admin/register/students", label: "Student Accounts" },
    { to: "/admin/register/profile", label: "Profile" },
    { to: "/admin/register/notice", label: "Noticeboard" },
  ];

  return (
    <div
      className={`${
        isSidebarVisible ? "d-block pt-3" : "d-none"
      }  h-100 overflow-auto`}
      style={{
        zIndex: 100,
        transition: "transform 0.3s ease-in-out",
        minHeight: "100vh",
        paddingLeft: "10px",
        paddingRight: "10px",
        backgroundColor:'#FFF8DC'
      }}
    >
      <h5
        className="text-black text-center mb-1 fw-bold"
        style={{
          fontSize: "18px",
        }}
      >
        Admin Panel
      </h5>
      <ul className="list-unstyled mt-1">
        {links.map((item, idx) => (
          <li
            key={idx}
            className="border border-secondary rounded mb-2"
            style={{ fontSize: "14px" }}
          >
            <Link
              to={item.to}
              className={`text-black text-decoration-none d-block p-2 rounded ${
                location.pathname === item.to
                  ? "bg-warning"
                  : "hover-bg-warning"
              }`}
              onClick={handleClick}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBarListController;

{
  /* Main Content */
}
{
  /* <div
        className="main-content"
        style={{ marginLeft: "200px", paddingTop: "60px" }} // Ensuring sidebar does not overlap content
      >
        Your content
        hdfhaslkfdasfdadf
      </div> */
}
