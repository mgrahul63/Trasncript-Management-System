/* eslint-disable react/prop-types */
import axios from "axios"; // Ensure axios is imported
import { useState } from "react";
import { toast } from "react-toastify"; // Ensure you have this for toast notifications

const CompleteRegisterRow = ({ register, index }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [status, setStatus] = useState(register?.action || "Pending"); // Default to current action

  const handleEdit = () => {
    setIsEdit(true); // Enable edit mode
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Update the status when select changes
  };

  const handleSaveClick = async () => {
    // Conditionally call the API based on the status value
    const url =
      status === "approved"
        ? "http://localhost/versity/backend/api/registers.php?type=approved"
        : "http://localhost/versity/backend/api/registers.php?type=rejected";

    try {
      const response = await axios.post(url, {
        studentId: register.studentId,
        registerId: register.registerId,
      });

      console.log(response.data.message);
      toast.success(
        `Student registration has been ${
          status === "approve" ? "approved" : "rejected"
        }.`
      );
    } catch (error) {
      console.error(
        `Error ${
          status === "approve" ? "approving" : "rejecting"
        } the student:`,
        error
      );
      toast.error(
        `Failed to ${status === "approve" ? "approve" : "reject"} student.`
      );
    }

    setIsEdit(false); // Exit edit mode after saving
  };

  const handleCancelClick = () => {
    setStatus(register?.action || "Pending"); // Revert to the initial status
    setIsEdit(false); // Exit edit mode
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
        {isEdit ? (
          <select
            value={status}
            onChange={handleStatusChange}
            name="status"
            id="status"
          >
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        ) : (
          <p>{status.charAt(0).toUpperCase() + status.slice(1)}</p>  
        )}
      </td>
      <td>
        {isEdit ? (
          <>
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={handleEdit}>Edit</button>
          </>
        )}
      </td>
    </tr>
  );
};

export default CompleteRegisterRow;
