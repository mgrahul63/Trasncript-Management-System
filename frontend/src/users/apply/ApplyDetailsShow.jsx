/* eslint-disable react/prop-types */
const ApplyDetailsShow = ({ showData }) => {
  return (
    <div className="mt-4">
      <div className="border bg-white rounded-top">
        <h3
          className="bg-success text-left p-2 rounded-top"
          style={{ fontSize: "17px", color: "#151615" }}
        >
          Application Details
        </h3>

        <table className="table table-bordered table-striped table-hover">
          <thead className="table-success">
            <tr>
              <th>Roll</th>
              <th>Reg</th>
              <th>Type</th>
              <th>Fee</th>
              <th>Semester</th>
              <th>Date</th>
              <th>Status</th>
              <th>Image</th>
              <th>Transcript</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{showData[0]?.studentId}</td>
              <td>{showData[0]?.registerId}</td>
              <td>{showData[0]?.apply_type}</td>
              <td>{showData[0]?.amount}</td>
              <td>{showData[0]?.semester_id}</td>
              <td>{showData[0]?.application_date}</td>
              <td>
                <span
                  className={`badge ${
                    showData[0]?.status?.toLowerCase() === "rejected"
                      ? "bg-danger"
                      : showData[0]?.status?.toLowerCase() === "approved"
                      ? "bg-success"
                      : showData[0]?.status?.toLowerCase() === "pending"
                      ? "bg-warning"
                      : "bg-secondary"
                  }`}
                >
                  {showData[0]?.status?.charAt(0).toUpperCase() +
                    showData[0]?.status.slice(1).toLowerCase()}
                </span>
              </td>

              <td className="text-center">
                <img
                  src={showData[0]?.image_file}
                  alt="Image"
                  className="img-thumbnail"
                  style={{ maxWidth: "60px" }}
                />
              </td>
              <td className="text-center">
                <img
                  src={showData[0]?.previous_transcript_image}
                  alt="Previous Transcript"
                  className="img-thumbnail"
                  style={{ maxWidth: "60px" }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplyDetailsShow;
