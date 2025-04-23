/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

const TranscriptActionButton = ({ register, onStatusChange, handleClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [file, setFile] = useState(null);
  const [reason, setReason] = useState("");

  const handleApprove = async () => {
    if (!file) {
      Swal.fire("Error", "Please upload a file before approving.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("studentId", register.studentId);
    formData.append("registerId", register.registerId);
    formData.append("semester_id", register.semester_id);
    formData.append("transcript_file", file);
    formData.append("id", register.id);

    try {
      const res = await axios.post(
        "http://localhost/versity/backend/api/admin/registerAdmin/newApplyTranscript.php",
        formData
      );
      if (res.data?.status === 1) {
        Swal.fire("Success", "Transcript approved!", "success");
        onStatusChange();
        handleClose();
        resetState();
      } else {
        Swal.fire("Failed", res.data?.message || "Approval failed.", "error");
      }
    } catch (err) {
      console.error("Approval error:", err);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      Swal.fire("Error", "Please provide a reason.", "warning");
      return;
    }
    const formData = new FormData();
    formData.append("studentId", register.studentId);
    formData.append("registerId", register.registerId);
    formData.append("semester_id", register.semester_id);
    formData.append("id", register.id);
    formData.append("reason", reason); // 💡 Important

    try {
      const res = await axios.post(
        "http://localhost/versity/backend/api/admin/registerAdmin/newApplyTranscript.php",
        formData
      );
      if (res.data?.status === 1) {
        Swal.fire("Rejected", "Transcript rejected.", "info");
        onStatusChange();
        handleClose();
        resetState();
      } else {
        Swal.fire("Failed", res.data?.message || "Rejection failed.", "error");
      }
    } catch (err) {
      console.error("Rejection error:", err);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const resetState = () => {
    setIsOpen(false);
    setIsApproved(false);
    setIsRejected(false);
    setFile(null);
    setReason("");
  };

  return (
    <td>
      {isOpen ? (
        <>
          {isApproved && (
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          )}
          {isRejected && (
            <input
              type="text"
              placeholder="Reason for rejection"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          )}
          <div className="mt-1">
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={isApproved ? handleApprove : handleReject}
            >
              Save
            </button>
            <button className="btn btn-sm btn-secondary" onClick={resetState}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            className="btn btn-sm btn-success me-2"
            onClick={() => {
              setIsOpen(true);
              setIsApproved(true);
              setIsRejected(false);
            }}
          >
            Approve
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              setIsOpen(true);
              setIsApproved(false);
              setIsRejected(true);
            }}
          >
            Reject
          </button>
        </>
      )}
    </td>
  );
};

export default TranscriptActionButton;
