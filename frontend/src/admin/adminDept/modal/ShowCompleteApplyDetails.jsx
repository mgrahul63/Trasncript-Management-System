import { DateFormate } from "../../../utils/DateFormate";

/* eslint-disable react/prop-types */
const ShowCompleteApplyDetails = ({ modal, handleClose }) => {
  const { data } = modal;
  console.log(data);
  return (
    <div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div
          className="modal-dialog modal-lg"
          role="document"
          style={{ maxWidth: "1200px", width: "100%" }}
        >
          <div className="modal-content border-0 rounded-3 shadow-lg">
            {/* Modal Header */}
            <div className="modal-header border-bottom">
              <h5 className="modal-title text-primary fw-bold">
                Application Details
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Apply details card */}
              <div className="mb-5 border rounded">
                <h5 className="bg-success text-white p-2 rounded-top">
                  Apply Details
                </h5>

                <div className="card shadow-sm">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped mb-0">
                      <thead className="table-primary">
                        <tr>
                          <th>Roll</th>
                          <th>Register ID</th>
                          <th>Department</th>
                          <th>Apply Type</th>
                          <th>Semester ID</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{data.studentId}</td>
                          <td>{data.registerId}</td>
                          <td>{data.departmentName}</td>
                          <td>{data.apply_type}</td>
                          <td>{data.semester_id}</td>
                          <td>
                                {DateFormate(data?.application_date, true, true)}
                          </td>
                          <td>{data.amount}</td>
                          <td>
                            <span className="badge bg-info">{data.status}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* rejection_reasons */}
              {data?.rejection_reasons && (
                <div className=" mb-5 border rounded">
                  <h5 className="rounded-top p-2 bg-danger ">
                    Previous Rejection History
                  </h5>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-primary">
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

              {/* Documents */}
              <div className=" border rounded">
                <h5 className="bg-success text-white p-2 rounded-top">
                  Uploaded Documents
                </h5>

                <div className="card shadow-sm">
                  <div className="table-responsive">
                    <table className="table table-bordered mb-0 text-center align-middle">
                      <thead className="table-primary">
                        <tr>
                          <th>Student Image</th>
                          <th>Previous Transcript</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <img
                              src={data?.image_file}
                              alt="Student"
                              className="img-fluid rounded-3"
                              style={{
                                maxHeight: "200px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>
                            <img
                              src={data?.previous_transcript_image}
                              alt="Transcript"
                              className="img-fluid rounded-3"
                              style={{
                                maxHeight: "200px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary rounded-3 px-4 py-2"
                onClick={handleClose}
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

export default ShowCompleteApplyDetails;
