import axios from "axios";
import { useEffect, useState } from "react";
import { useAdminData } from "../../../context/AdminContext";
import FilterApply from "../../FilterApply";
import CompleteRegisterList from "./CompleteRegisterList";

const CompleteRegisters = () => {
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
              type: "old",
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
        console.log(response.data);
        setResult(response.data?.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchQuery();
  }, [
    searchQuery,
    department,
    adminData?.department_id,
    adminData?.faculty_id,
  ]);

  return (
    <div
      className="container mb-5"
      style={{
        minHeight:
          Array.isArray(result) && result.length === 0 ? "400px" : "80vh",
      }}
    >
      <div
        className="text-white p-4 mb-4 rounded-3 shadow-sm"
        style={{
          background: "linear-gradient(to right, #0f2027, #2c5364)",
          textAlign: "center",
        }}
      >
        <h2 className="mb-4 text-center">Complete Registrations</h2>
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
      <CompleteRegisterList loading={loading} error={error} result={result} />
    </div>
  );
};

export default CompleteRegisters;
