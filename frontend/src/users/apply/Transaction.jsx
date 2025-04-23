/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import CloseIcon from "../../components/CloseIcon";
import FormField from "../../components/FormField";

const Transaction = ({ isShowTxID, setIsShowTxId }) => {
  const {
    status,
    id,
    studentId,
    registerId,
    payment_type,
    apply_type,
    semester_id,
    amount,
    action,
  } = isShowTxID;

  const handleClose = () => {
    setIsShowTxId((prev) => ({
      ...prev,
      status: false,
      id: "",
      studentId: "",
      registerId: "",
      payment_type: "",
      apply_type: "",
      semester_id: "",
      amount: 0,
    }));
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Function to handle form submission
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append form fields and image
    formData.append("transaction_id", data.transaction_id);
    formData.append("payment_method", data.payment_method);
    formData.append("studentId", studentId);
    formData.append("registerId", registerId);
    formData.append("payment_type", payment_type);
    formData.append("apply_type", apply_type);
    formData.append("semester_id", semester_id);
    formData.append("amount", amount);

    // Convert image to object URL before appending
    if (data.image_file && data.image_file[0]) {
      formData.append("image_file", data.image_file[0]);
    }

    if (formData) {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
    }

    try {
      const response = await axios.post(
        "http://localhost/versity/backend/api/payment.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      const result = response.data;

      if (result.status === true) {
        console.log(result.message);
        toast.success(result.message);
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Watch for changes in the image file input
  let image_file = watch("image_file");

  return (
    <>
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <h3 style={styles.modalHeader}>Transaction Details</h3>
          <CloseIcon onClose={handleClose} />

          {/* Transaction ID Input */}
          <FormField
            label={"Transaction Id"}
            htmlFor={"transaction_id"}
            error={errors.transaction_id}
          >
            <input
              type="text"
              id="transaction_id"
              name="transaction_id"
              placeholder="Enter transaction ID"
              style={styles.input}
              {...register("transaction_id", {
                required: "Transaction ID is ",
              })}
            />
          </FormField>

          {/* Payment Method Selection */}
          <FormField
            label={"Payment Method"}
            htmlFor={"payment_method"}
            error={errors.payment_method}
          >
            <select
              id="payment_method"
              name="payment_method"
              style={styles.input}
              {...register("payment_method", {
                required: "Payment method is required",
              })}
            >
              <option value="">Select payment method</option>
              <option value="Bkash">Bkash</option>
              <option value="Nagad">Nagad</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </FormField>

          {/* Image Upload Input */}
          <FormField
            label={"Upload Image"}
            htmlFor={"image_file"}
            error={errors.image_file}
          >
            <input
              type="file"
              id="image_file"
              name="image_file"
              accept="image/*"
              style={styles.input}
              {...register("image_file", {
                required: "Image is required",
                validate: {
                  lessThan1MB: (files) =>
                    (files && files[0].size < 1024 * 1024) ||
                    "File size should be less than 1MB",
                },
              })}
            />
          </FormField>

          {/* Button Group */}
          <div style={styles.btnGroup}>
            <Button onClick={handleClose} text="Close" />
            <Button onClick={handleSubmit(onSubmit)} text="Submit" />
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#60605edd",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    color: "white",
  },
  modalContent: {
    paddingBottom: "20px",
  },
  modalHeader: {
    fontSize: "1.5em",
    marginBottom: "15px",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  input: {
    width: "100%", // Full width of the modal content
    padding: "10px",
    border: "1px solid #0d0e1a",
    borderRadius: "4px",
    fontSize: "1em",
    boxSizing: "border-box", // Ensures padding does not cause overflow
  },
  btnGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
  },
  error: { color: "red", fontSize: "12px" },
};

export default Transaction;
