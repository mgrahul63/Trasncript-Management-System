import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAdminData } from "../../../context/AdminContext";

const ClassesList = () => {
  const { adminData } = useAdminData();
  const [sessionList, setSessionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deptName, setDeptName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuery = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost/versity/backend/api/admin/departmentAdmin/session.php",
          {
            department_id: adminData.department_id,
            faculty_id: adminData.faculty_id,
          }
        );

        if (response.data.status === 1) {
          setSessionList(response.data.data);
          setDeptName(response.data?.department?.name);
          setError(null);
        } else {
          setError(response.data.message);
          setSessionList([]);
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error(err);
        setSessionList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuery();
  }, [adminData.department_id, adminData.faculty_id]);

  // Button click handler
  const handleButtonClick = (session, rowIndex, buttonNumber, deptName) => {
    navigate("/admin/department/course-schedule", {
      state: {
        sessionId: session.session_id,
        semesterId: buttonNumber,
        departmentId: session.department_id,
        deptName: deptName,
      },
    });
  };

  return (
    <div
      className="container mb-5"
      style={{
        minHeight:
          Array.isArray(sessionList) && sessionList.length === 0
            ? "400px"
            : "80vh",
      }}
    >
      <h4>{deptName}</h4>
      <table className="table table-bordered p-2">
        <thead>
          <tr>
            <th>Session </th>
            {/* Create 8 columns (buttons) */}
            {[...Array(8)].map((_, idx) => (
              <th key={idx}>Semester {idx + 1}</th>
            ))}
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9}>Loading...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={9}>{error}</td>
            </tr>
          ) : sessionList.length === 0 ? (
            <tr>
              <td colSpan={9}>Data not found.</td>
            </tr>
          ) : (
            <>
              {sessionList.map((session, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{session.session_id}</td>
                  {/* Create 8 buttons for each session row */}
                  {[...Array(8)].map((_, colIndex) => (
                    <>
                      <td key={colIndex}>
                        <button
                          className="btn btn-outline-primary  hover:opacity-100 transition-opacity duration-300"
                          onClick={() =>
                            handleButtonClick(
                              session,
                              rowIndex,
                              colIndex + 1,
                              deptName
                            )
                          }
                          style={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                            padding: "5px 10px",
                            border: "none", // Ensure button has no border unless hovered
                          }}
                        >
                          {colIndex + 1}
                        </button>
                      </td>
                    </>
                  ))}
                  <td>
                    <button>show</button>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClassesList;
