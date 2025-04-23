import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

import FilterApply from "../../FilterApply";
import CompleteApplyTranscriptList from "./CompleteApplyTranscriptList";

const CompleteTranscript = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "http://localhost/versity/backend/api/admin/registerAdmin/newApplyTranscript.php",
        { params: { type: "approved", searchQuery, department } }
      );

      if (response?.data?.status === 0) {
        setError(response.data.message);
      } else {
        setData(response.data?.data || []);
        console.log("first");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, department]);

  return (
    <div
      className="container mt-1"
      style={{
        minHeight: Array.isArray(data) && data.length === 0 ? "400px" : "80vh",
      }}
    >
      <div
        className="text-white p-4 mb-4 rounded-3 shadow-sm"
        style={{
          background: "linear-gradient(to right, #0f2027, #2c5364)",
          textAlign: "center",
        }}
      >
        <h2 className="fw-bold text-uppercase">Approved Transcripts</h2>
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
      <CompleteApplyTranscriptList
        loading={loading}
        error={error}
        data={data}
      />
    </div>
  );
};

export default CompleteTranscript;
