/* eslint-disable react/prop-types */

import { DateFormate } from "../../../utils/DateFormate";
import { printTable } from "../../../utils/printTable";

const NewApplyList = ({ loading, error, result, handleShow }) => {
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
        <table className="table table-hover align-middle">
          <thead className="table-primary text-center">
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
          <tbody className="text-center">
            {loading ? (
              <tr className="alert alert-info text-center">
                <td colSpan="7">Loading data...</td>
              </tr>
            ) : error ? (
              <tr className="alert alert-danger text-center">
                <td colSpan="7">{error}</td>
              </tr>
            ) : result.length === 0 ? (
              <tr className="alert alert-warning text-center">
                <td colSpan="7">No new applications found.</td>
              </tr>
            ) : (
              result.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data?.studentId}</td>
                  <td>{data?.registerId}</td>
                  <td>{data?.departmentName}</td>
                  <td>{data?.semester_id}</td>
                  <td>
                       {DateFormate(data?.application_date, true, true)}
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
    </div>
  );
};

export default NewApplyList;
