import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const AdminPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Sidebar visibility
  const [isMobile, setIsMobile] = useState(false); // Track mobile view
  const [isMenu, setIsMenu] = useState(true);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsMenu(!isMenu);
  };

  // Handle window resize and toggle visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) {
        setIsMobile(true);
        setIsSidebarVisible(false); // Hide sidebar by default in mobile view
      } else {
        setIsMobile(false);
        setIsSidebarVisible(true); // Show sidebar in larger screens
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Content Layout */}
      <div style={{ display: "flex" }} className="">
        {/* Menu icon for mobile view */}
        {isMobile && (
          <div
            className="menu-icon position-fixed top-0 start-10 text-black p-2"
            style={{
              zIndex: 101,
              cursor: "pointer",
              marginTop: "70px",
              marginBottom: "10px",
            }}
            onClick={toggleSidebar}
          >
            {isMenu ? "☰" : "X"}
          </div>
        )}

        {/* Sidebar */}
        {isSidebarVisible && (
          <div
            className={` ${
              isMobile ? "position-fixed overflow-auto pt-3" : "col-2"
            } `}
            style={{
              width: isMobile ? "200px" : "16.666%", // Match Bootstrap column width
              top: "55px",
              left: "0px",
              overflowY: "auto", // Enable scrolling for sidebar content if needed
            }}
          >
            <SideBar
              isSidebarVisible={isSidebarVisible}
              setIsSidebarVisible={setIsSidebarVisible}
              isMenu={isMenu}
              setIsMenu={setIsMenu}
            />
          </div>
        )}

        {/* Content Area */}
        <div
          style={{
            padding: "20px",
            background: "white",
            // marginLeft: isSidebarVisible && !isMobile ? "200px" : "0",
            paddingTop: "20px",
            transition: "margin-left 0.3s ease-in-out", // Smooth transition
            // width: "100%",
          }}
          className="col-lg-10 col-12 text-black overflow-auto bg-body-secondary"
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminPage;
