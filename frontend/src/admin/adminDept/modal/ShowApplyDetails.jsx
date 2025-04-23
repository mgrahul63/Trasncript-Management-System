/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { DateFormate } from "../../../utils/DateFormate";

const ShowApplyDetails = ({ modal, handleClose, fetchQuery }) => {
  const [rejected, setRejected] = useState(false);
  const [reason, setReason] = useState("");

  if (!modal.status) return null;

  const { data } = modal;

  const handleApproveApply = async (e, studentId, registerId, semesterId) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/versity/backend/api/admin/student-apply.php",
        {
          type: "applyApproveEdit",
          studentId,
          registerId,
          semesterId,
        }
      );

      if (response.data?.status === 1) {
        Swal.fire({
          icon: "success",
          title: "Application Approved",
          text: "The student's application has been approved.",
          confirmButtonColor: "#3085d6",
        });
        handleClose();
        fetchQuery();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Approve",
          text: response.data?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Server error occurred while approving.",
      });
    }
  };

  const handleRejectApply = async (
    e,
    studentId,
    registerId,
    semesterId,
    reason
  ) => {
    e.preventDefault();
    if (reason.trim()) {
      try {
        const response = await axios.post(
          "http://localhost/versity/backend/api/admin/student-apply.php",
          {
            type: "applyRejectEdit",
            studentId,
            registerId,
            semesterId,
            reason,
          }
        );

        if (response.data?.status === 1) {
          Swal.fire({
            icon: "success",
            title: "Application Rejected",
            text: "The student's application has been rejected.",
            confirmButtonColor: "#d33",
          });
          handleClose();
          fetchQuery();
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to Reject",
            text: response.data?.message || "Something went wrong.",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Server error occurred while rejecting.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Reason Required",
        text: "Please enter a reason for rejection.",
      });
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div
        className="modal-dialog modal-lg"
        role="document"
        style={{ maxWidth: "1100px", width: "100%" }}
      >
        <div className="modal-content shadow-lg rounded-3">
          {/* Modal Header */}
          <div className="modal-header border-bottom-0 bg-primary text-white">
            <h5 className="modal-title">Application Details</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-1 px-3">
            {/* Apply Details */}
            <div className="mb-5 border rounded">
              <h5
                className="rounded-top p-2 bg-success "
                style={{ marginBottom: "0px" }}
              >
                Apply Details
              </h5>

              <div className="col-12">
                <div className="card shadow-sm ">
                  <table className="table table-bordered table-striped">
                    <thead className="table-primary">
                      <tr>
                        <th>Roll</th>
                        <th>Register</th>
                        <th>Department</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Semester</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data ? (
                        <tr>
                          <td>{data?.studentId}</td>
                          <td>{data?.registerId}</td>
                          <td>{data?.departmentName}</td>
                          <td>
                            {DateFormate(data?.application_date, true, true)}
                          </td>
                          <td>{data?.apply_type}</td>
                          <td>{data?.semester_id}</td>
                          <td className="d-flex justify-content-center">
                            {rejected ? (
                              <>
                                <input
                                  type="text"
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                  className="form-control me-2"
                                  placeholder="Enter rejection reason"
                                  required
                                />
                                <button
                                  disabled={!reason.trim()}
                                  onClick={(e) =>
                                    handleRejectApply(
                                      e,
                                      data?.studentId,
                                      data?.registerId,
                                      data?.semester_id,
                                      reason
                                    )
                                  }
                                  className="btn btn-danger btn-sm me-2"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setRejected(false)}
                                  className="btn btn-secondary btn-sm"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                {data?.status.toLowerCase() === "approved" ? (
                                  <span className="badge bg-success text-white">
                                    Approved
                                  </span>
                                ) : data?.status.toLowerCase() ===
                                  "rejected" ? (
                                  <span className="badge bg-danger text-white">
                                    Rejected
                                  </span>
                                ) : (
                                  <>
                                    <button
                                      onClick={(e) =>
                                        handleApproveApply(
                                          e,
                                          data?.studentId,
                                          data?.registerId,
                                          data?.semester_id
                                        )
                                      }
                                      className="btn btn-success btn-sm me-2"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => setRejected(true)}
                                      className="btn btn-danger btn-sm"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center text-muted">
                            No Application Data Available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* rejection_reasons */}
            {data?.rejection_reasons && (
              <div className=" mb-5 border rounded">
                <h5
                  className="rounded-top p-2 bg-danger text-white"
                  style={{ marginBottom: "0px" }}
                >
                  Previous Rejection History
                </h5>

                <div className="table-responsive px-3">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>SN</th>
                        <th>Reason</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {JSON.parse(data?.rejection_reasons).map(
                        (item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item[0]}</td>
                            <td>{new Date(item[1]).toLocaleString()}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Documents Details */}
            <div className="mb-2 border rounded">
              <h5
                className="rounded-top p-2 bg-success"
                style={{ marginBottom: "0px" }}
              >
                Documents
              </h5>

              <div className="row g-4 p-3">
                <div className="col-6 text-center">
                  <h6 className="text-primary">Student Image</h6>
                  <img
                    src={data?.image_file}
                    alt="Student Image"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-6 text-center">
                  <h6 className="text-primary">Previous Transcript Image</h6>
                  <img
                    src={data?.previous_transcript_image}
                    alt="Transcript Image"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top-0">
            <button className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowApplyDetails;
