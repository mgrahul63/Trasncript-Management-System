/* eslint-disable react/prop-types */
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentBox = ({ setShowPayment, formData }) => {
  const navigate = useNavigate();

  const handleOffline = async () => {
    try {
      formData.append("payment_type", "Offline");
      const response = await axios.post(
        "http://localhost/versity/backend/api/applicants.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;

      if (result.status === true) {
        setShowPayment(false);
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your offline payment application has been successfully submitted.",
          confirmButtonColor: "#28a745",
        });
        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed!",
          text: result.message || "There was an issue with your application.",
          confirmButtonColor: "#d33",
        });
        navigate("/dashboard/applyHistory");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleOnline = () => {
    Swal.fire({
      icon: "info",
      title: "Online Payment Unavailable",
      text: "Online payment is currently unavailable. Please choose offline payment.",
      confirmButtonColor: "#007bff",
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card p-4 shadow-lg border-0"
        style={{ maxWidth: "480px", width: "100%", borderRadius: "1rem" }}
      >
        <div className="card-body text-center">
          <h3 className="card-title mb-3 fw-bold">Choose Payment Method</h3>
          <p className="text-muted mb-4">
            Select a payment method to proceed with your transaction.
          </p>

          <div className="d-grid gap-3 mb-4">
            <button
              onClick={handleOffline}
              className="btn btn-outline-primary btn-lg rounded-pill"
            >
              💵 Offline Payment
            </button>
            <button
              onClick={handleOnline}
              className="btn btn-outline-success btn-lg rounded-pill"
            >
              💳 Online Payment
            </button>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={() => setShowPayment(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentBox;
