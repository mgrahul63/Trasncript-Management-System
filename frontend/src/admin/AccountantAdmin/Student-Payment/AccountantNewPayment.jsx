import axios from "axios";
import { useEffect, useState } from "react";
import ShowPaymentDetails from "../modal/ShowPaymentDetails";

const AccountantNewPayment = () => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPayment, setIsPayment] = useState("");
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

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost/versity/backend/api/admin/student-apply.php",
          {
            params: { type: "newpaymentData" },
          }
        );

        if (response.data.status === 1) {
          setResult(response.data.data);
          setError("");
        }
        if (response.data.status === 0) {
          setError(response.data.message);
          setResult([]);
        }

        // console.log(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchQuery();
  }, [isPayment]);

  return (
    <div
      className="container"
      style={{
        minHeight: "90vh",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <div>
          <h2 className="fw-bold text-primary">
            📄 New Transcript Applications
          </h2>
          <p className="text-muted">
            Below is a list of students who have recently applied for their
            transcripts.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary">
            <i className="fas fa-filter me-1"></i> Filter
          </button>
          <button className="btn btn-sm btn-outline-primary">
            <i className="fas fa-download me-1"></i> Export
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead
            className="table-dark text-center"
            style={{ fontSize: "14px" }}
          >
            <tr>
              <th>SN</th>
              <th>Roll</th>
              <th>Register</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center" style={{ fontSize: "14px" }}>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center mt-3">
                  Loading...
                </td>
              </tr>
            ) : error && result.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-danger text-center mt-3">
                  {error}
                </td>
              </tr>
            ) : result?.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center mt-t text-danger">
                  There is no Availabe New Payment Found!
                </td>
              </tr>
            ) : (
              result?.map((data, index) => (
                <tr key={data.registerId}>
                  <td>{index + 1}</td>
                  <td>{data.applicationData.studentId}</td>
                  <td>{data.applicationData.registerId}</td>
                  <td>{data.applicationData.departmentName}</td>
                  <td>{data.applicationData.semester_id}</td>
                  <td>
                    {new Date(
                      data.applicationData.application_date
                    ).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleShow(data)}
                      className="btn btn-sm btn-outline-success"
                    >
                      Show Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal.status && (
        <ShowPaymentDetails
          modal={modal}
          handleClose={handleClose}
          setIsPayment={setIsPayment}
          isPayment={isPayment}
        />
      )}
    </div>
  );
};

export default AccountantNewPayment;
