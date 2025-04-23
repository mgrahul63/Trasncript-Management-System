/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

const RegisterRow = ({ index, register }) => {
  // const {adminData} = useAdminData();
  const [status, setStatus] = useState("");

  const handleApprove = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this student?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      const response = await axios.post(
        "http://localhost/versity/backend/api/registers.php?type=approved",
        {
          studentId: register.studentId,
          registerId: register.registerId,
        }
      );

      if (response.data.status === 1) {
        Swal.fire("Approved!", response.data.message, "success");
        setStatus("Approved");
      } else {
        Swal.fire("Error", response.data.error, "error");
      }
    }
  };

  const handleReject = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      const response = await axios.post(
        "http://localhost/versity/backend/api/registers.php?type=rejected",
        {
          studentId: register.studentId,
          registerId: register.registerId,
        }
      );

      if (response.data.status === 1) {
        Swal.fire("Rejected!", response.data.message, "success");
        setStatus("Rejected");
      } else {
        Swal.fire("Error", response.data.error, "error");
      }
    }
  };

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        {register?.firstName} {register?.middleName} {register?.lastName}
      </td>
      <td>{register?.studentId}</td>
      <td>{register?.registerId}</td>
      <td>{register?.session_id}</td>
      <td>{register?.departmentName}</td>
      <td>{new Date(register?.created_at).toLocaleDateString()}</td>
      <td>
        {status ? (
          <span
            className={`badge ${
              status === "Approved" ? "bg-success" : "bg-danger"
            }`}
          >
            {status}
          </span>
        ) : (
          <>
            <button onClick={handleApprove} className="btn btn-success me-2">
              Approve
            </button>
            <button onClick={handleReject} className="btn btn-danger">
              Reject
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default RegisterRow;
