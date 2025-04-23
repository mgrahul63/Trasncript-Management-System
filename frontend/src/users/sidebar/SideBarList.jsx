/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";

const SideBarList = ({
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

  const menuItems = [
    { label: "👤 Profile", path: "/profile" },
    { label: "📊 Dashboard", path: "/dashboard" },
    { label: "📝 Apply", path: "/apply" },
  ];

  return (
    <div
      className={`${
        isSidebarVisible ? "d-block pt-3" : "d-none"
      } bg-info h-100 overflow-auto`}
      style={{
        zIndex: 100,
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <div className="px-2">
        <h5 className="text-primary fw-bold mb-4">🎓 Student Menu</h5>
        <ul className="list-unstyled">
          {menuItems.map(({ label, path }, index) => {
            const isActive = location.pathname === path;

            return (
              <li key={index} className="mb-2">
                <Link
                  to={path}
                  onClick={handleClick}
                  className={`d-block px-3 py-2 rounded fw-medium text-decoration-none ${
                    isActive ? "bg-primary text-white" : "bg-light text-dark"
                  }`}
                  style={{
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#e2e6ea";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                    }
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBarList;
