/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useData } from "../../context/Context";
import AdminNavbar from "./AdminNavbar";
import ComonNavbar from "./ComonNavbar";
import UserNavbar from "./UserNavbar";

const Navbar = () => {
  const { role, isAuthenticated, setIsAuthenticated } = useData();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [showIcon, setShowIcon] = useState(true);

  const handleProfile = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleMenu = () => {
    setShowIcon(!showIcon);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMenu(true);
      } else {
        setIsMenu(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
 
  return (
    <>
      <header
        className=" shadow-sm p-3 position-sticky top-0 z-index-100"
        style={{ backgroundColor: "#025c53" }}
      >
        <nav className="container-fluid d-flex align-items-center">
          {/* Logo */}
          <div className="col-2 d-flex align-items-center ps-5">
            <NavLink to="/home">
              <img
                src="/images/Logo.png"
                alt="Logo"
                className=""
                style={{
                  width: "60px",
                  height: "40px",
                  cursor: "pointer",
                }}
              />
            </NavLink>
          </div>

          {/* Mobile Menu */}
          {isMenu ? (
            <div
              className="text-white col-10 d-flex justify-content-end align-items-center"
              style={{ cursor: "pointer" }}
              onClick={toggleMenu}
            >
              <p className="fs-4 m-0">{showIcon ? "☰" : "X"}</p>
              {!showIcon && (
                <ul
                  className="list-unstyled bg-dark text-white rounded shadow mt-3 p-3 w-100 position-absolute text-center"
                  style={{ top: "60px", right: "0", zIndex: 101 }}
                >
                  <ComonNavbar />
                  {role === "user" ? (
                    <>
                      {isAuthenticated && (
                        <>
                          <UserNavbar onClickProfile={handleProfile} />
                        </>
                      )}
                    </>
                  ) : role === "admin" ? (
                    <>
                      <AdminNavbar onClickProfile={handleProfile} />
                    </>
                  ) : (
                    <NavLink
                      to="/sign"
                      className={({ isActive }) =>
                        isActive
                          ? "text-warning fw-bold text-decoration-none"
                          : "text-white text-decoration-none"
                      }
                    >
                      Sign In
                    </NavLink>
                  )}
                </ul>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Menu */}
              <ul className="list-unstyled d-flex justify-content-center gap-4 col-8 m-0">
                <ComonNavbar />
              </ul>

              {/* Profile Icon */}
              <div className="col-2 d-flex justify-content-end align-items-center">
                {role === "user" ? (
                  <div className="position-relative">
                    <img
                      src="/images/user.png"
                      alt="Profile"
                      className="rounded-circle border border-white"
                      style={{
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                      }}
                      onClick={handleProfile}
                    />
                    {showSidebar && (
                      <div
                        className="position-absolute bg-dark text-white rounded shadow mt-2 p-3"
                        style={{
                          top: "50px",
                          right: "0",
                          zIndex: 102,
                        }}
                      >
                        <ul className="list-unstyled m-0">
                          <UserNavbar onClickProfile={handleProfile} />
                        </ul>
                      </div>
                    )}
                  </div>
                ) : role === "admin" ? (
                  <div className="position-relative">
                    <img
                      src="/images/admin.png"
                      alt="Profile"
                      className="rounded-circle border border-white"
                      style={{
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                      }}
                      onClick={handleProfile}
                    />
                    {showSidebar && (
                      <div
                        className="position-absolute bg-dark text-white rounded shadow mt-2 p-3"
                        style={{
                          top: "50px",
                          right: "0",
                          zIndex: 102,
                        }}
                      >
                        <ul className="list-unstyled m-0">
                          <AdminNavbar onClickProfile={handleProfile} />
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to="/sign"
                    className={({ isActive }) =>
                      isActive
                        ? "text-warning fw-bold text-decoration-none"
                        : "text-white text-decoration-none"
                    }
                  >
                    Sign In
                  </NavLink>
                )}
              </div>
            </>
          )}
        </nav>
      </header>

      <Outlet />
    </>
  );
};

export default Navbar;
