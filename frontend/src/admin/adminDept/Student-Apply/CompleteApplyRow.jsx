import { DateFormate } from "../../../utils/DateFormate";

/* eslint-disable react/prop-types */
const CompleteApplyRow = ({ data, index, onClick }) => {
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{data?.studentId}</td>
      <td>{data?.registerId}</td>
      <td>{data?.departmentName}</td>
      <td>    {DateFormate(data?.application_date, true, true)}</td>
      <td>{data?.apply_type}</td>
      <td>{data?.status}</td>
      <td>
        <button onClick={onClick} className="btn btn-sm btn-outline-success">
          Show Details
        </button>
      </td>
    </tr>
  );
};

export default CompleteApplyRow;
