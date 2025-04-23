/* eslint-disable react/prop-types */
const ShowCompletePaymentDetails = ({ modal, handleClose }) => {
  const { data } = modal;
  const { applicationDetails, paymentsDetails } = data;

  console.log(paymentsDetails);
  return (
    <div>
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
              <div className="mb-3 border rounded">
                <h6 className="rounded-top p-2 bg-success">Apply Details</h6>

                <div className="table-responsive p-3">
                  <table className="table table-bordered ">
                    <thead className="table-light" style={{ fontSize: "14px" }}>
                      <tr>
                        <th>Roll</th>
                        <th>Reg</th>
                        <th>Dept</th>
                        <th>Type</th>
                        <th>Semester</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Student</th>
                        <th>Transcript</th>
                      </tr>
                    </thead>
                    <tbody className="text-center" style={{ fontSize: "14px" }}>
                      <tr>
                        <td>{applicationDetails.studentId}</td>
                        <td>{applicationDetails.registerId}</td>
                        <td>{applicationDetails.departmentName}</td>
                        <td>{applicationDetails.apply_type}</td>
                        <td>{applicationDetails.semester_id}</td>
                        <td>
                          {new Date(
                            applicationDetails.application_date
                          ).toLocaleDateString()}
                        </td>
                        <td>{applicationDetails.amount}</td>
                        <td>
                          <span className="badge bg-info">
                            {applicationDetails.status}
                          </span>
                        </td>
                        <td>
                          <img
                            src={applicationDetails?.image_file}
                            alt="Student"
                            style={{
                              width: "100px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                            className="img-fluid rounded border mb-1"
                          />
                        </td>
                        <td>
                          <img
                            src={applicationDetails?.previous_transcript_image}
                            alt="Transcript"
                            style={{
                              width: "100px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                            className="img-fluid rounded border mb-1"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* before rejected */}
              {paymentsDetails.reason && (
                <div className=" mb-3 border rounded">
                  <h6 className="rounded-top p-2 bg-success ">
                    Previous Rejection History
                  </h6>

                  <div className="table-responsive p-3">
                    <table className="table table-bordered">
                      <thead
                        className="table-light"
                        style={{ fontSize: "14px" }}
                      >
                        <tr>
                          <th>Reason</th>
                          <th>Transaction Id</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody
                        className="text-center"
                        style={{ fontSize: "14px" }}
                      >
                        {JSON.parse(paymentsDetails.reason).map(
                          (item, index) => (
                            <tr key={index}>
                              <td>{item[0]}</td>
                              <td>{item[1]}</td>
                              <td>{new Date(item[2]).toLocaleString()}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* payment details  */}
              <div className="mb-3 border rounded">
                <h6 className="bg-success rounded-top p-2 ">Payment Details</h6>

                <div className="row p-3">
                  <div className="col-md-6" style={{ fontSize: "14px" }}>
                    <div className="p-3 border rounded bg-light">
                      <p>
                        <strong>Roll:</strong> {paymentsDetails.studentId}
                      </p>
                      <p>
                        <strong>Reg:</strong> {paymentsDetails.registerId}
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {paymentsDetails.payment_method}
                      </p>
                      <p>
                        <strong>Payment Type:</strong>{" "}
                        {paymentsDetails.payment_type}
                      </p>

                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(
                          paymentsDetails.payment_date
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Amount:</strong> {paymentsDetails.amount}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className="badge bg-info">
                          {paymentsDetails.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6" style={{ fontSize: "14px" }}>
                    <div className="p-3 border rounded bg-light d-flex flex-column align-items-center">
                      <img
                        src={paymentsDetails?.image_file}
                        alt="Previous Transcript"
                        style={{
                          width: "300px",
                          height: "300px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                      {paymentsDetails?.image_file && (
                        <span className="mt-2 text-center fw-bold">
                          Payment Slip
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleClose}
                style={{ fontSize: "13px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCompletePaymentDetails;
