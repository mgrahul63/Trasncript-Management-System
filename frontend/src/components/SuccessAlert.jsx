/* eslint-disable react/prop-types */
import { useEffect } from "react";
import Swal from "sweetalert2";

const SuccessAlert = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "Your offline payment application has been successfully submitted.",
        confirmButtonColor: "#28a745",
      }).then(() => {
        if (onClose) onClose(); // Callback function after alert closes
      });
    }
  }, [show, onClose]);

  return null; // This component does not render anything
};

export default SuccessAlert;
