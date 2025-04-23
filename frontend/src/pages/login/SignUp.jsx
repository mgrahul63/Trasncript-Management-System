import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form"; // Importing useForm from react-hook-form
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/Loading";
import { useData } from "../../context/Context";

const SignUp = () => {
  const navigate = useNavigate(); // For redirecting after successful signup
  const {
    faculties,
    facultiesLoading,
    departments,
    departmentsError,
    departmentsLoading,
  } = useData();
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState(""); // Error message state
  const [isLoading, setLoading] = useState(false);

  // useForm hook from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const password = watch("password");
  const facultyName = watch("facultyName");

  // Form submission handler
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        "http://localhost/versity/backend/api/addUserAccount.php",
        data
      );
      const result = response.data;
      // console.log("Response Data:", result);

      if (result.status === 1) {
        setShowSuccessMessage(true);
        setLoading(false);
        // Reset the form fields after a successful submission
        reset();
      }
    } catch (error) {
      setLoading(false);
      if (error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("A network error occurred. Please try again later."); // Handle network or other errors
      }
    }
  };

  // Handle modal close
  const handleModalClick = () => {
    setShowSuccessMessage(false); // Close the success modal
    navigate("/"); // Redirect to the homepage
  };
  if (departmentsLoading) return <div>Loading departments...</div>;
  if (departmentsError) return <div>Error loading departments</div>;

  return (
    <>
      {/* Success Message Modal */}
      {showSuccessMessage && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContainer}>
            <h3 style={styles.modalTitle}>Success!</h3>
            <p style={styles.modalMessage}>You have successfully signed up.</p>
            <button
              style={styles.modalButton}
              onClick={handleModalClick} // Close the modal
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="container-fluid bg-white px-5 py-3">
        {/* Sign Up Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 border rounded shadow-sm"
          style={{ maxWidth: "500px", width: "100%", margin: "auto" }}
        >
          <h2 className="text-center mb-4 text-primary">Sign Up</h2>

          {/* Error Message */}
          {error && <span className="text-rerd">{error}</span>}

          {/* Student ID */}
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label  text-black" htmlFor="studentId">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                placeholder="Roll Number..."
                className="form-control border-primary"
                {...register("studentId", {
                  required: "Student ID is required.",
                  minLength: {
                    value: 8,
                    message: "Student ID must be 8 digits.",
                  },
                  maxLength: {
                    value: 8,
                    message: "Student ID must be 8 digits.",
                  },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Student ID must be numeric.",
                  },
                })}
              />

              {errors.studentId && (
                <span className="text-danger">{errors.studentId.message}</span>
              )}
            </div>

            {/* Register ID */}
            <div className="col-12">
              <label className="form-label  text-black" htmlFor="registerID">
                Register ID
              </label>
              <input
                type="number"
                id="registerID"
                name="registerID"
                className="form-control border-primary"
                placeholder="regis Number..."
                {...register("registerId", {
                  required: "Register ID is required.",
                  minLength: {
                    value: 4,
                    message: "Register ID must be 4 digits.",
                  },
                  maxLength: {
                    value: 4,
                    message: "Register ID must be 4 digits.",
                  },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Register ID must be numeric.",
                  },
                })}
              />
              {errors.registerId && (
                <span className="text-danger">{errors.registerId.message}</span>
              )}
            </div>

            {/* Faculty Name */}
            <div className="col-12">
              <label className="form-label  text-black" htmlFor="facultyName">
                Faculty Name
              </label>
              <select
                id="facultyName"
                name="facultyName"
                className="form-select border-primary"
                {...register("facultyName", {
                  required: "Please select a faculty.",
                })}
              >
                <option value="">Select Faculty</option>
                {!facultiesLoading && faculties && (
                  <>
                    {faculties.map((faculty) => (
                      <option key={faculty.faculty_id} value={faculty.name}>
                        {faculty.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {errors.facultyName && (
                <span className="text-danger">
                  {errors.facultyName.message}
                </span>
              )}
            </div>

            {/* Department Name */}
            <div className="col-12 ">
              <label
                className="form-label  text-black"
                htmlFor="departmentName"
              >
                Department Name
              </label>
              <select
                type="text"
                id="departmentName"
                name="departmentName"
                className="form-select border-primary"
                {...register("departmentName", {
                  required: "Please select a department.",
                })}
              >
                <option value="">Select Department</option>
                {departments &&
                  faculties &&
                  departments.map((dept) => {
                    const facultyID = faculties.find(
                      (item) => item.name === facultyName
                    )?.faculty_id; // Optional chaining

                    if (dept.faculty_id === facultyID) {
                      return (
                        <option key={dept.department_id} value={dept.name}>
                          {dept.name}
                        </option>
                      );
                    }
                    return null;
                  })}
              </select>
              {errors.departmentName && (
                <span className="text-danger">
                  {errors.departmentName.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="col-12">
              <label className="form-label  text-black" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control border-primary"
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[a-z][a-z0-9._]*@(gmail\.com|email\.com)$/,
                    message: "Please enter a valid email address.",
                  },
                })}
              />
              {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="col-12">
              <label className="form-label  text-black" htmlFor="password">
                Password
              </label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-control border-primary"
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long.",
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must contain at least one lowercase, one uppercase, one digit, one special character.",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={styles.toggleButton}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="col-12 mb-4">
              <label
                className="form-label  text-black"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div style={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control border-primary"
                  {...register("confirmPassword", {
                    required: "Please confirm your password.",
                    validate: (value) =>
                      value === password || "Passwords do not match.", // Compare with watched password
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={styles.toggleButton}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-danger">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <CustomButton isLoading={isLoading} type={"submit"} label="Sign Up" />
        </form>
      </div>
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
    width: "500px",
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

  passwordContainer: {
    position: "relative",
  },

  toggleButton: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "18px",
  },
};

export default SignUp;
