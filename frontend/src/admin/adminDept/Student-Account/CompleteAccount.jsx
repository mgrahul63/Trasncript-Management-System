import axios from "axios";
import { useEffect, useState } from "react";

const CompleteAccount = () => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost/versity/backend/api/admin/student-account.php",
          {
            params: { type: "old" },
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

    fetchQuery();
  }, []);

  const handleReject = async (studentId, registerId) => {
    const response = await axios.post(
      "http://localhost/versity/backend/api/registers.php?type=rejected",
      {
        studentId,
        registerId,
      }
    );

    console.log(response.data.message);
  };

  return (
    <div
      className="container mb-5"
      style={{
        minHeight:
          Array.isArray(result) && result.length === 0 ? "400px" : "80vh",
      }}
    >
      <h2 className="mb-4 text-center">Complete Registrations</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Roll</th>
              <th>Register</th>
              <th>Department</th>
              <th>Registration Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="text-center text-danger">
                  {error}
                </td>
              </tr>
            ) : result?.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No registrations found.
                </td>
              </tr>
            ) : (
              result.map((register, index) => (
                <tr key={register.registerId}>
                  <td>{index + 1}</td>
                  <td>
                    {register.firstName} {register.middleName}{" "}
                    {register.lastName}
                  </td>
                  <td>{register.studentId}</td>
                  <td>{register.registerId}</td>
                  <td>{register.departmentName}</td>
                  <td>{new Date(register.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleReject(register.studentId, register.registerId)
                      }
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompleteAccount;
