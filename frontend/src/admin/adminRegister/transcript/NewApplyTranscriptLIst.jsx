/* eslint-disable react/prop-types */
import { DateFormate } from "../../../utils/DateFormate";
import { printTable } from "../../../utils/printTable";

const NewApplyTranscriptLIst = ({ loading, error, data, setIsModalOpen }) => {
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
      <div className="table-responsive border rounded-3" id="printArea">
        <table
          className="table table-sm table-bordered table-hover align-middle rounded-3"
          id="printArea"
        >
          <thead className="table-primary text-center">
            <tr>
              <th scope="col">SN</th>
              <th scope="col">Full Name</th>
              <th scope="col">Roll No.</th>
              <th scope="col">Reg. ID</th>
              <th scope="col">Department</th>
              <th scope="col">Semester</th>
              <th scope="col">Session</th>
              <th scope="col">Applied On</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center text-muted py-4">
                  Loading applications...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="text-center text-danger py-4">
                  {error}
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-muted py-4">
                  No new transcript applications found.
                </td>
              </tr>
            ) : (
              data.map((register, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{register?.name}</td>
                  <td>{register.studentId}</td>
                  <td>{register.registerId}</td>
                  <td>{register.departmentName}</td>
                  <td>{register.semester_id}</td>
                  <td>{register.session_id}</td>
                  <td>{DateFormate(register.application_date)}</td>
                  <td>
                    <button
                      onClick={() =>
                        setIsModalOpen({
                          status: true,
                          data: register,
                        })
                      }
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
    </div>
  );
};

export default NewApplyTranscriptLIst;
