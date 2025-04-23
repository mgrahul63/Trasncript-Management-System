/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { QueryFetchData } from "../api/QueryFetch";

// 1. Create context
const AdminDataContext = createContext(null);

// 2. Custom hook for using context
export const useAdminData = () => useContext(AdminDataContext);

// 3. Function to fetch admin data based on token
const FetchQuery = async () => {
  const jwt = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  try {
    if (jwt && role === "admin") {
      const response = await axios.post(
        "http://localhost/versity/backend/api/verifyToken.php",
        { jwt },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.status === "success") {
        return response.data.data; // return the user data
      } else {
        // Token invalid or expired
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("isAuthenticated");
      }
    }
    return null;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

// 4. Provider component
const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [adminRole, setAdminRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const fetch = async () => {
      const data = await FetchQuery();
      setAdminData(data);
      // console.log(data)
    };

    fetch();
  }, [adminRole]);

  const {
    data: departments,
    isError: departmentsError,
    isLoading: departmentsLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: QueryFetchData,
  });
 
  return (
    <AdminDataContext.Provider
      value={{
        adminRole,
        setAdminRole,
        adminData,
        setAdminData,
        departments,
        departmentsError,
        departmentsLoading,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export default AdminProvider;
