/* eslint-disable react/prop-types */
const CompletePaymentRow = ({ data, index, onClick }) => {
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{data.applicationDetails.studentId}</td>
      <td>{data.applicationDetails.registerId}</td>
      <td>{data.applicationDetails.departmentName}</td>
      <td>
        {new Date(
          data.applicationDetails.application_date
        ).toLocaleDateString()}
      </td>
      <td>{data.applicationDetails.apply_type}</td>
      <td>{data.applicationDetails.status}</td>
      <td>{data.paymentsDetails?.status || "N/A"}</td>
      <td>
        <button onClick={onClick} className="btn btn-success me-2" style={{ fontSize: "14px" }}>
          Show Details
        </button>
      </td>
    </tr>
  );
};

export default CompletePaymentRow;
