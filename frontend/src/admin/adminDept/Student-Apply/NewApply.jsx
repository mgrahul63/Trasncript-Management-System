/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { useAdminData } from "../../../context/AdminContext";
import FilterApply from "../../FilterApply";
import ShowApplyDetails from "../modal/ShowApplyDetails";
import NewApplyList from "./NewApplyList";

const NewApply = () => {
  const { adminData } = useAdminData();
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [modal, setModal] = useState({
    status: false,
    data: {},
  });

  const handleShow = (data) => {
    setModal((prev) => ({
      ...prev,
      status: true,
      data: data,
    }));
  };

  const handleClose = () => {
    setModal({
      status: false,
      data: {},
    });
  };

  const fetchQuery = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost/versity/backend/api/admin/student-apply.php",
        {
          params: {
            type: "applyData",
            department_id: adminData?.department_id,
            faculty_id: adminData?.faculty_id,
            searchQuery,
            department,
          },
        }
      );
      if (response?.data?.status === 1) {
        setResult(response.data?.data);
      }
      if (response?.data?.status === 0) {
        setResult([]);
        setError(response.data?.message);
      }

      // console.log(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuery();
  }, [adminData.department_id, adminData?.faculty_id, searchQuery, department]);

  return (
    <div
      className="container py-1"
      style={{
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <div
        className="text-white p-4 mb-3 rounded shadow"
        style={{
          background: "linear-gradient(to right, #0f2027, #2c5364)",
        }}
      >
        <h2 className="fw-bold text-primary mb-2">
          📋 Transcript Application Review
        </h2>
        <p className="fs-5 mb-0">
          Below is the list of transcript applications submitted by students.
          You may review and manage their approval status as needed.
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-2 shadow-sm border-0">
        <div className="card-body">
          <FilterApply
            onSearchChange={(value) => setSearchQuery(value)}
            onDepartmentChange={(value) => setDepartment(value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className=" bg-white border-2 p-2 shadow-sm border-0 rounded">
        <div className="card-body">
          <NewApplyList
            loading={loading}
            error={error}
            result={result}
            handleShow={handleShow}
          />
        </div>
      </div>

      {/* Modal */}
      {modal.status && (
        <ShowApplyDetails
          modal={modal}
          handleClose={handleClose}
          fetchQuery={fetchQuery}
        />
      )}
    </div>
  );
};

export default NewApply;
