/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";

const AccountantSideBarList = ({
  isSidebarVisible,
  setIsSidebarVisible,
  isMenu,
  setIsMenu,
}) => {
  const location = useLocation();

  const menuItems = [
    { label: "🏠 Dashboard", path: "/admin/accountant/dashboard" },
    { label: "👤 Profile", path: "/admin/accountant/profile" },
    { label: "📝 Apply", path: "/admin/accountant/apply" },
    { label: "💰 New Payment", path: "/admin/accountant/new-payment" },
    {
      label: "📄 Complete Payment",
      path: "/admin/accountant/complete-payment",
    },
    { label: "📊 Reports", path: "/admin/accountant/payment-reports" },
    { label: "📢 Notices", path: "/admin/noticeboard" },
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
          Accountant Panel
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

export default AccountantSideBarList;

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
