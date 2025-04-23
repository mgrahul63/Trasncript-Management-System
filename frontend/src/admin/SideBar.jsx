/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import AccountantSideBarList from "./AccountantAdmin/adminAccountantSideBar/AccountantSideBarList";
import SideBarList from "./adminDept/sidebar/SideBarList";
import SideBarListFaculty from "./adminFaculty/adminFacultySideBar/SideBarList";
import SideBarListRegister from "./adminRegister/adminRegisterSideBar/SideBarList";

const SideBar = ({
  isSidebarVisible,
  setIsSidebarVisible,
  isMenu,
  setIsMenu,
}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const jwt = localStorage.getItem("authToken");
      const role = localStorage.getItem("role");
      if (jwt && role === "admin") {
        try {
          const { data } = await axios.post(
            "http://localhost/versity/backend/api/verifyToken.php",
            { jwt },
            { headers: { "Content-Type": "application/json" } }
          );
          setData(data.status === "success" ? data.data : null);
        } catch (error) {
          console.error("Error verifying token:", error);
        }
      }
    };
    fetchData();
  }, []);
  console.log(data?.role_type);
  return data?.role_type === "departmentAdmin" ? (
    <SideBarList
      {...{ isSidebarVisible, setIsSidebarVisible, isMenu, setIsMenu }}
    />
  ) : data?.role_type === "facultyAdmin" ? (
    <SideBarListFaculty
      {...{ isSidebarVisible, setIsSidebarVisible, isMenu, setIsMenu }}
    />
  ) : data?.role_type === "registerAdmin" ? (
    <SideBarListRegister
      {...{ isSidebarVisible, setIsSidebarVisible, isMenu, setIsMenu }}
    />
  ) : data?.role_type === "accountant" ? (
    <AccountantSideBarList
      {...{ isSidebarVisible, setIsSidebarVisible, isMenu, setIsMenu }}
    />
  ) : (
    <p>d</p>
  );
};

export default SideBar;
