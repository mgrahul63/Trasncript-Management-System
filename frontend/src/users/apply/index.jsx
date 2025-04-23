/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationData from "./ApplicationData ";
import ApplicationFrom from "./ApplicationFrom";
import PaymentBox from "./PaymentBox";

const Apply = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState(null); // To store form data

  const handleModalClick = () => {
    setShowSuccessMessage(false);
    navigate("/");
  };

  return (
    <>
      {/* if backend side error pass */}
      {error && <span style={styles.errorMessage}>{error}</span>}

      {/* if backend side success pass */}
      {showSuccessMessage && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContainer}>
            <h3 style={styles.modalTitle}>Success!</h3>
            <p style={styles.modalMessage}>You have successfully signed up.</p>
            <button style={styles.modalButton} onClick={handleModalClick}>
              Close
            </button>
          </div>
        </div>
      )}

      {!showPayment ? (
        <>
          {!showData ? (
            <ApplicationFrom
              setShowData={setShowData}
              setFormData={setFormData}
            />
          ) : (
            <ApplicationData
              formData={formData}
              setShowData={setShowData}
              setShowPayment={setShowPayment}
            />
          )}
        </>
      ) : (
        <>
          <PaymentBox setShowPayment={setShowPayment} formData={formData} />
        </>
      )}
    </>
  );
};

// Inline styles for the SignUp component
const styles = {
  // Modal Styles
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "400px",
  },
  modalTitle: {
    fontSize: "20px",
    color: "#007BFF",
    marginBottom: "10px",
  },
  modalMessage: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "20px",
  },
  modalButton: {
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Apply;
