/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { printTable } from "../../../utils/printTable";
const CompleteApplyTranscriptList = ({ loading, error, data }) => {
  const [isReceived, setIsReceived] = useState(false);

  const handelTranscriptReceive = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this transcript as received?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(
          "http://localhost/versity/backend/api/admin/registerAdmin/newApplyTranscript.php",
          {
            id: item?.id,
            studentId: item?.studentId,
            registerId: item?.registerId,
            semester_id: item?.semester_id,
          }
        );

        if (response?.data?.status === 1) {
          Swal.fire("Success!", "Transcript marked as received.", "success");
          setIsReceived(true);
        } else {
          Swal.fire(
            "Error!",
            response?.data?.message || "Something went wrong.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire("Failed!", "Server error occurred.", "error");
        console.error(error);
      }
    }
  };

  return (
    <div className="mt-2">
      {" "}
      <div className="d-flex justify-content-end mb-2">
        <button
          onClick={() => printTable("printArea")}
          className="btn btn-primary"
        >
          <i className="bi bi-printer me-2"></i> Print
        </button>
      </div>
      <div className="table-responsive shadow-sm border rounded-3">
        <table
          className="table table-bordered table-striped table-hover align-middle text-center"
          id="printArea"
        >
          <thead className="table-dark">
            <tr>
              <th>SN</th>
              <th>Roll</th>
              <th>Register</th>
              <th>Semester</th>
              <th>Department</th>
              <th>Applied On</th>
              <th>Transcript File / Reason</th>
              <th>Hard Copy Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="alert alert-info text-center">
                <td> Loading data...</td>
              </tr>
            ) : error ? (
              <tr>
                <td>{error}</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-muted py-4">
                  No approved transcript applications found.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.studentId}</td>
                  <td>{item.registerId}</td>
                  <td>{item.semester_id}</td>
                  <td>{item.departmentName}</td>
                  <td>{item.application_date}</td>
                  <td>
                    {item.transcript_file ? (
                      <a
                        href={`data:application/pdf;base64,${item.transcript_file}`}
                        download={`transcript_${item.studentId}.pdf`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Download PDF
                      </a>
                    ) : item.reason ? (
                      <span className="badge bg-danger">{item?.reason}</span>
                    ) : (
                      <span className="text-muted">Unavailable</span>
                    )}
                  </td>
                  <td>
                    {item?.reason ? (
                      <span className="badge bg-danger">Not Availabe</span>
                    ) : (
                      <>
                        {item?.delivered_status.toLowerCase() ===
                        "delivered" ? (
                          <span className="bg-success p-2 rounded">
                            {" "}
                            {item?.delivered_status}
                          </span>
                        ) : (
                          <div className="d-flex justify-content-center gap-2">
                            {isReceived ? (
                              "Delivered"
                            ) : (
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() => handelTranscriptReceive(item)}
                              >
                                <FaCheckCircle className="me-1" />
                                Deliver transcript?
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}
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

export default CompleteApplyTranscriptList;
