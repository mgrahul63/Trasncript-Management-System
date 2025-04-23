import axios from "axios";
import { useState } from "react";

/* eslint-disable react/prop-types */
const ShowPaymentDetails = ({
  modal,
  handleClose,
  setIsPayment,
  isPayment,
}) => {
  const [rejected, setRejected] = useState();
  const [reason, setReason] = useState("");

  if (!modal.status) return null;

  const { data } = modal;

  const handleApprovePayment = async (e, studentId, registerId, semesterId) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost/versity/backend/api/admin/student-apply.php",
      {
        type: "paymentApproveEdit",
        studentId,
        registerId,
        semesterId,
      }
    );
    console.log(response.data);
    setIsPayment("Approved");
    handleClose();
  };

  const handleRejectPayment = async (
    e,
    studentId,
    registerId,
    semesterId,
    reason
  ) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost/versity/backend/api/admin/student-apply.php",
      {
        type: "paymentRejectEdit",
        studentId,
        registerId,
        semesterId,
        reason,
      }
    );
    console.log(response.data);
    setIsPayment("Rejected");
    handleClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div
        className="modal-dialog modal-lg"
        role="document"
        style={{ maxWidth: "1100px", width: "100%" }}
      >
        <div className="modal-content border">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">Application Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body" style={{ width: "100%" }}>
            {/* apply details  */}
            {/* <div className="mb-3 border rounded">
              <h6 className="rounded-top p-2 bg-success ">Apply Details</h6>
              <div className="col-md-12 px-3">
                <table className="table table-bordered table-hover">
                  <thead className="table-light" style={{ fontSize: "14px" }}>
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
                  <tbody style={{ fontSize: "14px" }}>
                    {data?.applicationData ? (
                      <tr>
                        <td>{data.applicationData.studentId}</td>
                        <td>{data.applicationData.registerId}</td>
                        <td>{data.applicationData.departmentName}</td>
                        <td>
                          {new Date(
                            data.applicationData.application_date
                          ).toLocaleDateString()}
                        </td>
                        <td>{data.applicationData.apply_type}</td>
                        <td>{data.applicationData.semester_id}</td>
                        <td>
                          {data.applicationData.status.toLowerCase() ===
                          "approved" ? (
                            <span className="text-success fw-bold">
                              Approved
                            </span>
                          ) : data.applicationData.status.toLowerCase() ===
                            "rejected" ? (
                            <span className="text-danger fw-bold">
                              Rejected
                            </span>
                          ) : (
                            <span>Somthing wrong!</span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={7}>
                          <p className="text-muted text-center">
                            No Application Data Available
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div> */}

            {/* payment details  */}
            <div className="mb-3 border rounded">
              <h6 className="rounded-top p-2 bg-success ">Payment Details</h6>
              <div className="col-md-12 px-3">
                <table className="table table-bordered table-hover">
                  <thead className="table-light" style={{ fontSize: "14px" }}>
                    <tr>
                      <th>Roll</th>
                      <th>Register</th>
                      <th>Apply for</th>
                      <th>Semester</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Payment Type</th>
                      <th>Payment Method</th>
                      <th>Transaction ID</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "14px" }}>
                    <tr>
                      {data?.payments[0] ? (
                        <>
                          <td>{data.payments[0].studentId}</td>
                          <td>{data.payments[0].registerId}</td>
                          <td>{data.payments[0].apply_type}</td>
                          <td>{data.payments[0].semester_id}</td>
                          <td>
                            {new Date(
                              data.payments[0].payment_date
                            ).toLocaleDateString()}
                          </td>
                          <td>{data.payments[0].amount}</td>
                          <td>{data.payments[0].payment_type}</td>
                          <td>{data.payments[0].payment_method}</td>
                          <td>{data.payments[0].transaction_id}</td>
                          <td>
                            {rejected ? (
                              <>
                                <input
                                  type="text"
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                  required
                                />
                                <div className="pt-2">
                                  <button
                                    disabled={!reason.trim()}
                                    onClick={(e) =>
                                      handleRejectPayment(
                                        e,
                                        data?.applicationData?.studentId,
                                        data?.applicationData?.registerId,
                                        data?.applicationData?.semester_id,
                                        reason
                                      )
                                    }
                                    className="btn btn-success btn-sm me-2"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setRejected(false)}
                                    className="btn btn-cancel btn-sm me-2"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                {data.payments[0].status === "Approved" ? (
                                  <span className="text-success fw-bold">
                                    Approved
                                  </span>
                                ) : data.payments[0].status === "Rejected" ? (
                                  <span className="text-danger fw-bold">
                                    Rejected
                                  </span>
                                ) : (
                                  <>
                                    {isPayment ? (
                                      isPayment
                                    ) : (
                                      <>
                                        <button
                                          onClick={(e) =>
                                            handleApprovePayment(
                                              e,
                                              data?.applicationData?.studentId,
                                              data?.applicationData?.registerId,
                                              data?.applicationData?.semester_id
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
                              </>
                            )}
                          </td>
                        </>
                      ) : (
                        <td colSpan={9}>
                          {" "}
                          <p className="text-muted text-center">
                            No Payment Data Available
                          </p>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* before rejected */}
            {data.payments[0].reason && (
              <div className=" mb-3 border rounded">
                <h6 className="rounded-top p-2 bg-success bg-danger">
                  Previous Rejection History
                </h6>

                <div className="table-responsive px-3">
                  <table className="table table-bordered">
                    <thead className="table-light" style={{ fontSize: "14px" }}>
                      <tr>
                        <th>SN</th>
                        <th>Reason</th>
                        <th>Transaction Id</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "14px" }}>
                      {JSON.parse(data.payments[0].reason).map(
                        (item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item[1]}</td>
                            <td>{item[0]}</td>
                            <td>{new Date(item[2]).toLocaleString()}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* documents */}
            <div className="g-3 border rounded">
              <h6 className="rounded-top p-2 bg-success ">Documents</h6>
              <div className="row m-t-3 p-3">
                <div className="col-4 border-end text-center">
                  <h6>Student Image</h6>
                  <img
                    src={data?.applicationData?.image_file}
                    alt="Uploaded Document"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <div className="col-4 border-end text-center">
                  <h6>Previous Transcript Image</h6>
                  <img
                    src={data?.applicationData?.previous_transcript_image}
                    alt="Uploaded Document"
                    style={{
                      width: "300px",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <div className="col-4 text-center">
                  <h6>Payment Image</h6>
                  {data?.payments[0]?.payment_type === "Offline" ? (
                    <>
                      <img
                        src={data?.payments[0]?.image_file}
                        alt="Previous Transcript"
                        style={{
                          width: "300px",
                          height: "300px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </>
                  ) : (
                    <p>{data?.payments[0]?.payment_type}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPaymentDetails;
