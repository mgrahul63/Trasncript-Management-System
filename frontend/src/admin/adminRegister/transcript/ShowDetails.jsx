/* eslint-disable react/prop-types */

import axios from "axios";
import { useEffect, useState } from "react";
import TranscriptActionButton from "./TranscriptActionButton";

const ShowDetails = ({ data, setIsModalOpen, fetchData }) => {
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryData = async () => {
    try {
      const response = await axios.get(
        "http://localhost/versity/backend/api/admin/registerAdmin/newApplyTranscript.php",
        {
          params: {
            type: "imageData",
            studentId: data.studentId,
            registerId: data.registerId,
            semester_id: data.semester_id,
          },
        }
      );

      if (response?.data?.status === 1) {
        setResult(response.data?.data);
        setError("");
      } else {
        setError("No data found or status not 1.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch image data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen({ status: false, data: null });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    queryData();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [data]);

  const handleClose = () => {
    setIsModalOpen({ status: false, data: null });
  };

  return (
    <div
      className="modal show fade d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        role="document"
        style={{ maxWidth: "1100px", width: "100%" }}
      >
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Transcript Application Details</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            {loading && (
              <p className="text-center text-muted">Loading image data...</p>
            )}
            {error && <p className="text-danger text-center">{error}</p>}

            {/* Apply details */}
            <div className="mb-5 border rounded">
              <h6 className="rounded-top p-2 bg-success mb-0">Apply Details</h6>
              <div className="card shadow-sm">
                <table className="table table-bordered table-striped p-2">
                  <thead className="table-primary" style={{ fontSize: "14px" }}>
                    <tr>
                      <th>Full Name</th>
                      <th>Roll No.</th>
                      <th>Registration ID</th>
                      <th>Department</th>
                      <th>Semester</th>
                      <th>Session</th>
                      <th>Applied On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-center" style={{ fontSize: "14px" }}>
                    <tr>
                      <td>{data.name}</td>
                      <td>{data.studentId}</td>
                      <td>{data.registerId}</td>
                      <td>{data.departmentName}</td>
                      <td>{data.semester_id}</td>
                      <td>{data.session_id}</td>
                      <td>{data.application_date}</td>
                      <td>
                        <TranscriptActionButton
                          register={data}
                          onStatusChange={fetchData}
                          handleClose={handleClose}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Document details */}
            <div className="mb-5 border rounded">
              <h6 className="rounded-top p-2 bg-success mb-0">
                Document Details
              </h6>
              <div className="card shadow-sm">
                <div className="mb-2 border rounded">
                  <div className="row g-4 p-3">
                    <div className="col-4 text-center">
                      <h6 className="text-primary">Student Image</h6>
                      <img
                        src={
                          result?.image_file
                            ? `data:image/jpeg;base64,${result.image_file}`
                            : "/placeholder.jpg"
                        }
                        alt="Student Image"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "250px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-4 text-center">
                      <h6 className="text-primary">
                        Previous Transcript Image
                      </h6>
                      <img
                        src={
                          result?.previous_transcript_image
                            ? `data:image/jpeg;base64,${result.previous_transcript_image}`
                            : "/placeholder.jpg"
                        }
                        alt="Previous Transcript"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "250px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-4 text-center">
                      <h6 className="text-primary">Payment Slip Image</h6>
                      <img
                        src={
                          result?.payment_image_file
                            ? `data:image/jpeg;base64,${result.payment_image_file}`
                            : "/placeholder.jpg"
                        }
                        alt="Payment Slip"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "250px", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
