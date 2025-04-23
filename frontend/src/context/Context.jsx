/* eslint-disable react/prop-types */

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { QueryFetchData } from "../api/QueryFetch";

//create context
const DataContext = createContext(null);

// Custom hooks for context consumption
export const useData = () => useContext(DataContext);

const jwt = localStorage.getItem("authToken");
const role = localStorage.getItem("role");

const FetchQuery = async () => {
  try {
    if (jwt && role === "user") {
      const response = await axios.post(
        "http://localhost/versity/backend/api/verifyToken.php",
        {
          jwt: jwt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data.error && response.data.status === "success") {
        return response.data.data; // Return user data if successful
      } else if (response.data.status === "error") {
        // console.log(response.data.message);
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("isAuthenticated"); // Remove authentication status
      }
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

const Provider = ({ children }) => {
  const [userInfo, setUserInfo] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true" // Load from localStorage
  );

  const [role, setRole] = useState(localStorage.getItem("role")); //user or admin

  useEffect(() => {
    const Fetch = async () => {
      const data = await FetchQuery();
      if (data) {
        // console.log("yes");
        setUserInfo(data);
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true"); // Store in localStorage
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated"); // Remove if not authenticated
      }
    };
    Fetch();
    return () => {
      setIsAuthenticated(false);
      setUserInfo([]);
    };
  }, []);

  const {
    data: faculties,
    isError: facultiesError,
    isLoading: facultiesLoading,
  } = useQuery({
    queryKey: ["faculties"],
    queryFn: QueryFetchData,
  });

  const {
    data: departments,
    isError: departmentsError,
    isLoading: departmentsLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: QueryFetchData,
  });

  const {
    data: sections,
    isError: sectionsError,
    isLoading: sectionsLoading,
  } = useQuery({
    queryKey: ["sections"],
    queryFn: QueryFetchData,
  });
  // console.log(userInfo);
  // console.log(sections);
  return (
    <DataContext.Provider
      value={{
        role,
        setRole,
        userInfo,
        setUserInfo,
        isAuthenticated,
        setIsAuthenticated,
        sections,
        sectionsError,
        sectionsLoading,
        faculties,
        facultiesError,
        facultiesLoading,
        departments,
        departmentsError,
        departmentsLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default Provider;
