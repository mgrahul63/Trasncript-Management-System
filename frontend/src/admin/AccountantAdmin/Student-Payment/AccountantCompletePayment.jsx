import axios from "axios";
import { useEffect, useState } from "react";
import ShowCompletePaymentDetails from "../modal/ShowCompletePaymentDetails";
import CompletePaymentRow from "./CompletePaymentRow";

const AccountantCompletePayment = () => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
            params: { type: "completepaymentData" },
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

    fetchQuery();
  }, []);

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
    <div className="container" style={{ minHeight: "90vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-2 px-3">
        <div className="">
          <h2 className="fw-bold text-success">✅ Complete Apply List</h2>
          <p className="text-muted">
            View all applications with their current apply and payment status.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary">
            <i className="fas fa-filter me-1"></i> Filter
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => window.print()}
          >
            <i className="fas fa-download me-1"></i> Export
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          {/* <caption className="text-muted fs-6">
            List of all completed applications with their payment status.
          </caption> */}
          <thead className="table-dark" style={{ fontSize: "14px" }}>
            <tr>
              <th>SN</th>
              <th>Roll</th>
              <th>Register</th>
              <th>Department</th>
              <th>Date</th>
              <th>Apply Type</th>
              <th>Apply Status</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center" style={{ fontSize: "14px" }}>
            {loading ? (
              <tr>
                <td colSpan={9} className="py-4">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-danger py-3">
                  {error}
                </td>
              </tr>
            ) : result?.length > 0 ? (
              result.map((data, index) => (
                <CompletePaymentRow
                  key={index}
                  data={data}
                  index={index}
                  onClick={() => handleShow(data)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-muted py-3">
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.status && (
        <ShowCompletePaymentDetails modal={modal} handleClose={handleClose} />
      )}
    </div>
  );
};

export default AccountantCompletePayment;
