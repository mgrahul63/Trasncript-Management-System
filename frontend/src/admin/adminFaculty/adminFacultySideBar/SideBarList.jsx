/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";

const SideBarListFaculty = ({
  isSidebarVisible,
  setIsSidebarVisible,
  isMenu,
  setIsMenu,
}) => {
  const location = useLocation(); // Get the current path

  // Close the sidebar in mobile view after clicking a link
  const handleClick = () => {
    if (window.innerWidth <= 1000) {
      setIsSidebarVisible(false);
      setIsMenu(!isMenu);
    }
  };

  return (
    <div
      className={`${
        isSidebarVisible ? "d-block pt-3" : "d-none"
      } bg-info h-100  overflow-auto`}
      style={{
        // width: "200px",
        zIndex: 100,
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <ul className="list-unstyled mt-3">
        <li className="border">
          <Link
            to="/admin/faculty/profile"
            className={`text-white text-decoration-none d-block p-2 ${
              location.pathname === "/profile"
                ? "bg-warning"
                : "hover-bg-warning"
            }`}
            onClick={handleClick}
          >
            Profile
          </Link>
        </li>

        <li className="border">
          <Link
            to="/admin/faculty/dashboard"
            className={`text-white text-decoration-none d-block p-2 ${
              location.pathname === "/dashboard"
                ? "bg-warning"
                : "hover-bg-warning"
            }`}
            onClick={handleClick}
          >
            Dashboard
          </Link>
        </li>

        <li className="border">
          <Link
            to="/admin/faculty/apply"
            className={`text-white text-decoration-none d-block p-2 ${
              location.pathname === "/apply" ? "bg-warning" : "hover-bg-warning"
            }`}
            onClick={handleClick}
          >
            Apply
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBarListFaculty;

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
