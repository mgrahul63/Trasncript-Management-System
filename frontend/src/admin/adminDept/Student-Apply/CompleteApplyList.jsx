/* eslint-disable react/prop-types */
import { printTable } from "../../../utils/printTable";
import CompleteApplyRow from "./CompleteApplyRow";

const CompleteApplyList = ({ loading, error, result, handleShow }) => {
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
        <table className="table  table-hover align-middle">
          <thead className="table-primary text-center">
            <tr>
              <th>SN</th>
              <th>Roll</th>
              <th>Register</th>
              <th>Department</th>
              <th>Date</th>
              <th>Apply Type</th>
              <th>Apply Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center text-muted">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center text-danger">
                  {error}
                </td>
              </tr>
            ) : result?.length > 0 ? (
              result.map((data, index) => (
                <CompleteApplyRow
                  key={index}
                  data={data}
                  index={index}
                  onClick={() => handleShow(data)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-muted">
                  No Registration Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompleteApplyList;
