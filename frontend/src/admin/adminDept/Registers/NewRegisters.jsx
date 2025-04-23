import axios from "axios";
import { useEffect, useState } from "react";
import { useAdminData } from "../../../context/AdminContext";
import FilterApply from "../../FilterApply";
import NewRegisterList from "./NewRegisterList";

const NewRegisters = () => {
  const { adminData } = useAdminData();
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost/versity/backend/api/registers.php",
          {
            params: {
              type: "new",
              searchQuery,
              department,
              department_id: adminData?.department_id,
              faculty_id: adminData?.faculty_id,
            },
          }
        );

        if (response?.data?.status === 0) {
          setError(response.data.message);
        }
        setResult(response.data?.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (adminData?.department_id && adminData?.faculty_id) {
      fetchQuery();
    }
  }, [
    searchQuery,
    department,
    adminData?.department_id,
    adminData?.faculty_id,
  ]);
  console.log(result);
  return (
    <div
      className="container mb-5"
      style={{
        minHeight:
          Array.isArray(result) && result?.length === 0 ? "400px" : "80vh",
      }}
    >
      <div
        className="text-white p-4 mb-4 rounded-3 shadow-sm"
        style={{
          background: "linear-gradient(to right, #0f2027, #2c5364)",
          textAlign: "center",
        }}
      >
        <h2 className="mb-4 text-center">New Registrations</h2>
        <p className="fs-5 mb-0">
          Below are approved transcript applications. Download or review them.
        </p>
      </div>

      {/* Filters Section */}
      <FilterApply
        onSearchChange={(value) => setSearchQuery(value)}
        onDepartmentChange={(value) => setDepartment(value)}
      />

      {/* Table Section List*/}
      <NewRegisterList
        loading={loading}
        error={error}
        result={result} // Pass the result to the new component
      />
    </div>
  );
};

export default NewRegisters;
