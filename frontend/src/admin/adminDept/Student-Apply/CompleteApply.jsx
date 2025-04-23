import axios from "axios";
import { useEffect, useState } from "react";
import { useAdminData } from "../../../context/AdminContext";
import FilterApply from "../../FilterApply";
import ShowCompleteApplyDetails from "../modal/ShowCompleteApplyDetails";
import CompleteApplyList from "./CompleteApplyList";

const CompleteApply = () => {
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

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost/versity/backend/api/admin/student-apply.php",
          {
            params: {
              type: "completeData",
              department_id: adminData?.department_id,
              faculty_id: adminData?.faculty_id,
              searchQuery,
              department,
            },
          }
        );

        if (response?.data?.status === 1) setResult(response.data.data);
        if (response?.data?.status === 0) setError(response.data.message);
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
    adminData?.department_id,
    adminData?.faculty_id,
    searchQuery,
    department,
  ]);

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
  return (
    <div
      className=" container py-1"
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
        <h2 className="mb-2 fw-bold text-primary">📄 Completed Applications</h2>
        <p className="fs-5 mb-0 ">
          This section displays all transcript applications that have been
          reviewed and finalized by the department.
        </p>
      </div>

      {/* Filters and Search Section */}
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
          <CompleteApplyList
            loading={loading}
            error={error}
            result={result}
            handleShow={handleShow}
          />
        </div>
      </div>

      {/* Modal Section */}
      {modal.status && (
        <ShowCompleteApplyDetails modal={modal} handleClose={handleClose} />
      )}
    </div>
  );
};

export default CompleteApply;
