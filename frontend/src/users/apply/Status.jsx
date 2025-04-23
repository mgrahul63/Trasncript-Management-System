/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import { DateFormate } from "../../utils/DateFormate";

const Status = ({ modal, setModal, onhandleTxId }) => {
  const navigate = useNavigate(); // ✅ INITIALIZE
  const { studentId, registerId, semester_id } = modal?.data;

  const [res, setRes] = useState();

  const [isApplyExpanded, setisApplyExpanded] = useState(false);
  const [isPaymentExpanded, setisPaymentExpanded] = useState(false);
  const [isProcessReje, setIsProcessReje] = useState(false);

  const toggleExpanded = () => {
    setisApplyExpanded((prev) => !prev);
  };
  const togglePaymentExpanded = () => {
    setisPaymentExpanded((prev) => !prev);
  };
  const toggleProcessReje = () => {
    setIsProcessReje((prev) => !prev);
  };

  const closeModal = () => {
    setModal((prev) => ({
      ...prev,
      status: false,
    }));
  };

  useEffect(() => {
    const query = async () => {
      try {
        const response = await axios.get(
          `http://localhost/versity/backend/api/status.php`,
          {
            params: { studentId, registerId, semester_id },
          }
        );

        if (response.data?.status === 1) {
          setRes(response.data?.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (studentId && registerId) {
      query();
    }
  }, [studentId, registerId, semester_id]);

  const handleReapply = () => {
    navigate("/apply", { state: { OldformData: modal?.data } });
  };

  const handleRePayment = (e) => {
    const action = "reapply_payment";
    onhandleTxId(
      modal?.data?.id,
      modal?.data?.studentId,
      modal?.data?.registerId,
      modal?.data?.payment_type,
      modal?.data?.apply_type,
      modal?.data?.semester_id,
      modal?.data?.amount,
      e,
      action
    );
    closeModal();
  };
 
  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="statusModalLabel"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content rounded-3 shadow-sm border-0">
          <div className="modal-header bg-light border-bottom-0">
            <h5 className="modal-title fw-semibold">
              Application Status Overview
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>

          <div
            className="modal-body px-4"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <table className="table table-hover table-bordered">
              <thead
                className="text-center table-light"
                style={{ fontSize: "15px" }}
              >
                <tr>
                  <th>Stage</th>
                  <th>Date</th>
                  <th>Current Status</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "15px" }}>
                {/* Application Submission */}
                <tr>
                  <td>Application Submission</td>
                  <td>{formatDate(res?.application_date)}</td>
                  <td>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span
                          className={getStatusClass(res?.application_status)}
                        >
                          {res?.application_status || "N/A"}
                        </span>

                        {res?.application_status?.toLowerCase() ===
                          "rejected" && (
                          <button
                            className="btn btn-outline-primary btn-sm ms-2"
                            onClick={handleReapply}
                          >
                            Resubmit Application
                          </button>
                        )}
                      </div>
                      <div>
                        {res?.application_reasons && (
                          <button
                            className="btn text-black btn-outline-secondary btn-sm"
                            onClick={toggleExpanded}
                            title={isApplyExpanded ? "Collapse" : "Expand"}
                          >
                            <span style={{ fontSize: "16px" }}>
                              {" "}
                              {isApplyExpanded ? "⬆︎" : "⬇︎"}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isApplyExpanded && (
                      <>
                        {" "}
                        {res?.application_reasons && (
                          <div className="mt-2 border rounded">
                            <p className="bg-danger text-white p-1 rounded-top small mb-0 fw-semibold">
                              Rejection History
                            </p>
                            <table className="table table-sm table-bordered mb-0">
                              <thead
                                className="table-light text-center"
                                style={{ fontSize: "12px" }}
                              >
                                <tr>
                                  <th>SN</th>
                                  <th>Reason</th>
                                  <th>Date</th>
                                </tr>
                              </thead>
                              <tbody style={{ fontSize: "11px" }}>
                                {JSON.parse(
                                  res?.application_reasons || "[]"
                                ).map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item[0]}</td>
                                    <td>
                                      {new Date(item[1]).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>

                {/* Payment Process */}
                <tr>
                  <td>Payment Process</td>
                  <td>{formatDate(res?.payment_date)}</td>
                  <td>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className={getStatusClass(res?.payment_status)}>
                          {res?.payment_status || "N/A"}
                        </span>

                        {res?.payment_status?.toLowerCase() === "rejected" && (
                          <button
                            className="btn btn-outline-danger btn-sm ms-2"
                            onClick={(e) => handleRePayment(e)}
                          >
                            Retry Payment
                          </button>
                        )}
                      </div>

                      <div>
                        {res?.payment_reason && (
                          <button
                            className="btn text-black btn-outline-secondary btn-sm"
                            onClick={togglePaymentExpanded}
                            title={isPaymentExpanded ? "Collapse" : "Expand"}
                          >
                            <span style={{ fontSize: "16px" }}>
                              {" "}
                              {isPaymentExpanded ? "⬆︎" : "⬇︎"}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isPaymentExpanded && (
                      <>
                        {res?.payment_reason && (
                          <div className="mt-2 border rounded">
                            <p className="bg-danger text-white p-1 rounded-top small mb-0 fw-semibold">
                              Rejection History
                            </p>
                            <table className="table table-sm table-bordered mb-0">
                              <thead
                                className="table-light text-center"
                                style={{ fontSize: "12px" }}
                              >
                                <tr>
                                  <th>SN</th>
                                  <th>Reason</th>
                                  <th>Transaction ID</th>
                                  <th>Date</th>
                                </tr>
                              </thead>
                              <tbody style={{ fontSize: "11px" }}>
                                {JSON.parse(res?.payment_reason || "[]").map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{item[1]}</td>
                                      <td>{item[0]}</td>
                                      <td>
                                        {new Date(item[2]).toLocaleString()}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>

                {/* Controller Processing */}
                <tr>
                  <td>Processing</td>
                  <td>{formatDate(res?.processing_date)}</td>
                  <td>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span
                          className={getStatusClass(res?.processing_status)}
                        >
                          {res?.processing_status || "N/A"}
                        </span>
                      </div>

                      <div>
                        {res?.reason && (
                          <button
                            className="btn text-black btn-outline-secondary btn-sm"
                            onClick={toggleProcessReje}
                            title={isProcessReje ? "Collapse" : "Expand"}
                          >
                            <span style={{ fontSize: "16px" }}>
                              {" "}
                              {isProcessReje ? "⬆︎" : "⬇︎"}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                    {isProcessReje && (
                      <>
                        {res?.reason && (
                          <div className="mt-2 border rounded">
                            <p className="bg-danger text-white p-1 rounded-top small mb-0 fw-semibold">
                              Rejection History
                            </p>
                            <table className="table table-sm table-bordered mb-0">
                              <thead
                                className="table-light text-center"
                                style={{ fontSize: "12px" }}
                              >
                                <tr>
                                  <th>Reason</th>
                                  <th>Date</th>
                                </tr>
                              </thead>
                              <tbody style={{ fontSize: "11px" }}>
                                <tr>
                                  <td>{res?.reason}</td>
                                  <td>
                                    {new Date(
                                      res?.processing_date
                                    ).toLocaleString()}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>

                {/* received transcript */}
                <tr>
                  <td>Received</td>
                  <td>{formatDate(res?.receive_date)}</td>
                  <td>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={getStatusClass(res?.receive_status)}>
                        {res?.receive_status}
                      </span>
                      {res?.transcript_file && (
                        <a
                          href={`data:application/pdf;base64,${res.transcript_file}`}
                          download={`transcript_.pdf`}
                          className="btn btn-success btn-sm ms-2"
                        >
                          Download PDF
                        </a>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Deleivered hardcopy Transcript  */}
                <tr>
                  <td>Delivered</td>
                  <td>{formatDate(res?.delivered_date)}</td>
                  <td>
                    <span className={getStatusClass(res?.delivered_status)}>
                      {res?.delivered_status.toLowerCase() === "delivered"
                        ? res?.delivered_status
                        : "N/R"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="modal-footer bg-light border-top-0">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "badge bg-warning text-dark fw-semibold";
    case "approved":
      return "badge bg-success text-white fw-semibold";
    case "rejected":
      return "badge bg-danger text-white fw-semibold";
    case "received":
      return "badge bg-info text-dark fw-semibold";
    case "not received":
      return "badge bg-secondary text-white fw-semibold";
    case "in progress":
      return "badge bg-primary text-white fw-semibold";
    case "completed":
      return "badge bg-success text-white fw-semibold";
    case "delivered":
      return "badge bg-success text-white fw-semibold"; // ✅ Add this line
    default:
      return "badge bg-dark text-white fw-semibold";
  }
};

const formatDate = (dateString) =>
  dateString && !isNaN(new Date(dateString)) ? DateFormate(dateString) : "--";
