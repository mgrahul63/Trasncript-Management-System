/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";

const SideBarList = ({
  isSidebarVisible,
  setIsSidebarVisible,
  isMenu,
  setIsMenu,
}) => {
  const location = useLocation();

  const menuItems = [
    { label: "🏠 Dashboard", path: "/admin/department/dashboard" },
    { label: "👤 Profile", path: "/admin/department/profile" },
    { label: "📝 Apply", path: "/admin/department/apply" },
    { label: "🆕 New Register", path: "/admin/department/new-register" },
    { label: "💼 New Account", path: "/admin/department/new-account" },
    { label: "📝 New Applications", path: "/admin/department/new-apply" },
    { label: "📋 Class List", path: "/admin/department/class-list" },
    { label: "📄 Assignments", path: "/admin/department/assignments" },
    { label: "📊 Online Exam", path: "/admin/department/onlineExam" },
    { label: "📢 Noticeboard", path: "/admin/department/noticeboard" },
  ];

  const handleClick = () => {
    if (window.innerWidth <= 1000) {
      setIsSidebarVisible(false);
      setIsMenu(!isMenu);
    }
  };

  return (
    <>
      <style>
        {`
          .hover-bg-warning:hover {
            background-color: #ffc107;
            color: #000 !important;
          }
        `}
      </style>

      <div
        className={`${
          isSidebarVisible ? "d-block" : "d-none"
        } bg-info h-100 pt-3 px-2 overflow-auto`}
        style={{
          minWidth: "200px",
          zIndex: 100,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {/* Sidebar Heading */}
        <h5 className="text-white fw-bold text-center mb-3">
          Department Panel
        </h5>

        <ul className="list-unstyled">
          {menuItems.map((item, index) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <li className="mb-1" key={index}>
                <Link
                  to={item.path}
                  onClick={handleClick}
                  className={`d-block p-2 rounded text-white text-decoration-none ${
                    isActive ? "bg-warning fw-bold" : "hover-bg-warning"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default SideBarList;
