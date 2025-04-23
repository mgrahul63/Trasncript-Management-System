/* eslint-disable react/prop-types */
import { printTable } from "../../../utils/printTable";
import CompleteRegisterRow from "./CompleteRegisterRow";

const CompleteRegisterList = ({ loading, error, result }) => {
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
      <div
        className="table-responsive shadow-sm border rounded-3"
        id="printArea"
      >
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>SN</th>
                <th>Name</th>
                <th>Roll</th>
                <th>Register</th>
                <th>Session</th>
                <th>Department</th>
                <th>Registration Date</th>
                <th>Action</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="text-center text-danger">
                    {error}
                  </td>
                </tr>
              ) : result?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                result?.map((register, index) => (
                  <CompleteRegisterRow
                    key={register.registerId}
                    register={register}
                    index={index}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegisterList;
