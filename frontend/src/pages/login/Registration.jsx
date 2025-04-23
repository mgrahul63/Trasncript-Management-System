/* eslint-disable no-unused-vars */
import "animate.css";
import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useData } from "../../context/Context";

const Registration = () => {
  const myRef = useRef();
  const {
    faculties,
    facultiesError,
    facultiesLoading,
    departments,
    departmentsError,
    departmentsLoading,
    sections,
    sectionsError,
    sectionsLoading,
  } = useData();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      facultyName: "",
      departmentName: "",
      session_id: "",
      studentId: "",
      registerId: "",
      gender: "",
      dob: "",
      studentContact: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      fatherName: "",
      motherName: "",
      parentContact: "",
      parentAddress: "",
    },
  });

  const password = watch("password");
  const facultyName = watch("facultyName");
  const departmentName = watch("departmentName");

  const departmentId = departments?.find(
    (item) => item.name === departmentName
  )?.department_id;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost/versity/backend/api/addUser.php",
        data
      );
      const result = response.data;

      // Show SweetAlert with style
      Swal.fire({
        icon: result.status === 1 ? "success" : "error",
        title:
          result.status === 1
            ? "Registration Successful 🎉"
            : "Something Went Wrong 😢",
        text: result.message,
        confirmButtonColor: result.status === 1 ? "#3085d6" : "#d33",
        background: "#f9f9f9",
        color: "#333",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: true,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });

      if (result.status === 1) {
        setTimeout(() => {
          navigate("/");
        }, 1000); // add a slight delay for UX
      }
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Network Error 🌐",
        text: "Unable to connect. Please check your internet or try again later.",
        footer: '<a href="#">Need Help?</a>',
        confirmButtonColor: "#d33",
        background: "#fff3f3",
        color: "#000",
        timer: 6000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }
  };

  return (
    <div className="container-fluid mb-3 bg-light px-5 py-3">
      <form
        style={{ background: "#f8f4f4" }}
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border rounded shadow-sm container"
        method="POST"
        ref={myRef}
      >
        <h2 className="text-center mb-4 text-primary">Registration</h2>

        {/* Personal Information Section */}
        <div className="bg-white mb-4 rounded shadow-sm">
          <div className="card-header bg-primary rounded text-white p-2 mb-2">
            <h3 className="mb-0">Personal Information</h3>
          </div>
          {/* name info */}
          <div className="p-2">
            {/* name Row */}
            <div className="row g-3">
              {/* first name */}
              <div className="col-md-4 mb-2">
                <label className="form-label text-black" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="form-control border"
                />
                {errors.firstName && (
                  <span className="text-danger">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              {/* Middle Name */}
              <div className="col-md-4 mb-2">
                <label className="form-label text-black" htmlFor="middleName">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  {...register("middleName")}
                  className="form-control border"
                />
                {/* No error message since field is optional */}
              </div>

              {/* Last Name */}
              <div className="col-md-4 mb-3">
                <label className="form-label text-black" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className="form-control border"
                />
                {errors.lastName && (
                  <span className="text-danger">{errors.lastName.message}</span>
                )}
              </div>
            </div>

            {/* Academic Info Row */}
            <div className="row g-3">
              {/* Faculty Name */}
              <div className="col-md-4 mb-2">
                <label className="form-label text-black" htmlFor="facultyName">
                  Faculty Name
                </label>
                <select
                  id="facultyName"
                  {...register("facultyName", {
                    required: "Faculty is required",
                  })}
                  className="form-select border"
                >
                  <option value="" disabled>
                    Select Faculty
                  </option>
                  {!facultiesLoading && faculties && (
                    <>
                      {faculties.map((item) => (
                        <option key={item.faculty_id} value={item.name}>
                          {item.name}
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
              <div className="col-md-4 mb-3">
                <label
                  className="form-label text-black"
                  htmlFor="departmentName"
                >
                  Department Name
                </label>
                <select
                  id="departmentName"
                  {...register("departmentName", {
                    required: "Department is required",
                    disabled: !facultyName,
                  })}
                  className="form-select border"
                  disabled={!facultyName}
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  {departments &&
                    !facultiesLoading &&
                    departments.map((dept) => {
                      const facultyID = faculties.find(
                        (item) => item.name === facultyName
                      )?.faculty_id;
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

              {/* session */}
              <div className="col-md-4 mb-3">
                <label className="form-label text-black" htmlFor="session">
                  Session
                </label>
                <select
                  id="session"
                  {...register("session_id", {
                    required: "Session is required",
                    disabled: !departmentName,
                  })}
                  className="form-select border"
                  disabled={!departmentName}
                >
                  <option value="" disabled>
                    Select Session
                  </option>
                  {!facultiesLoading && !departmentsLoading && sections && (
                    <>
                      {sections
                        .filter((item) => item.department_id === departmentId)
                        .map((item) => {
                          return (
                            <option
                              key={item.session_id}
                              value={item.session_id}
                            >
                              {item.session_id}
                            </option>
                          );
                        })}
                    </>
                  )}
                </select>
                {errors.session_id && (
                  <span className="text-danger">
                    {errors.session_id.message}
                  </span>
                )}
              </div>
            </div>

            {/* Personal Details Row */}
            <div className="row g-2">
              {/* gender */}
              <div className="col-md-4 mb-3">
                <label className="form-label text-black" htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  {...register("gender", { required: "Gender is required" })}
                  className="form-select border"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <span className="text-danger">{errors.gender.message}</span>
                )}
              </div>

              {/* dob */}
              <div className="col-md-4 mb-3">
                <label className="form-label text-black" htmlFor="dob">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  {...register("dob", {
                    required: "Date of birth is required",
                  })}
                  className="form-control border"
                />
                {errors.dob && (
                  <span className="text-danger">{errors.dob.message}</span>
                )}
              </div>

              {/* contact */}
              <div className="col-md-4 mb-3">
                <label
                  className="form-label text-black"
                  htmlFor="student-contact"
                >
                  Contact number
                </label>
                <input
                  type="text"
                  id="student-contact"
                  {...register("studentContact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^(017|018|013|014|016|015)\d{8}$/, // Ensures it starts with one of the valid prefixes and has 8 more digits
                      message:
                        "Please enter a valid contact number starting with 017, 013, 014, 016, or 015",
                    },
                  })}
                  className="form-control border"
                />
                {errors.studentContact && (
                  <span className="text-danger">
                    {errors.studentContact.message}
                  </span>
                )}
              </div>
            </div>

            {/* Student ID Row */}
            <div className="row g-2">
              {/* roll */}
              <div className="col-md-4 mb-3">
                <label className="form-label text-black" htmlFor="rollNumber">
                  Roll Number
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  {...register("studentId", {
                    required: "Roll number is required",
                    pattern: {
                      value: /^\d{8}$/, // Ensures exactly 8 digits
                      message: "Roll number must be exactly 8 digits",
                    },
                  })}
                  className="form-control border"
                />
                {errors.studentId && (
                  <span className="text-danger">
                    {errors.studentId.message}
                  </span>
                )}
              </div>

              {/* register */}
              <div className="col-md-4 mb-3">
                <label className="form-label text-black" htmlFor="regNumber">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="regNumber"
                  {...register("registerId", {
                    required: "Registration number is required",
                    pattern: {
                      value: /^\d{4}$/, // Ensures exactly 8 digits
                      message: "Registration number must be exactly 4 digits",
                    },
                  })}
                  className="form-control border"
                />
                {errors.registerId && (
                  <span className="text-danger">
                    {errors.registerId.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="col-md-4 mb-3">
                <label className="form-label text-black" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[a-z][a-z0-9._]*@(gmail\.com|email\.com)$/,
                      message: "Please enter a valid email address.",
                    },
                  })}
                  className="form-control border"
                />
                {errors.email && (
                  <span className="text-danger">{errors.email.message}</span>
                )}
              </div>
            </div>

            {/* Password Row */}
            <div className="row g-2">
              {/* Password */}
              <div className="col-md-6">
                <label className="form-label text-black" htmlFor="password">
                  Password
                </label>
                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
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
                    className="form-control border"
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
              <div className="col-md-6">
                <label
                  className="form-label text-black"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <div style={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "Please confirm your password.",
                      validate: (value) =>
                        value === password || "Passwords do not match.",
                    })}
                    className="form-control border"
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

            {/* student address Row */}
            <div className="row g-3 mb-5">
              <div className="col-12">
                <label className="form-label text-black" htmlFor="address">
                  Address
                </label>
                <textarea
                  id="address"
                  {...register("address", { required: "Address is required" })}
                  className="form-control border"
                />
                {errors.address && (
                  <span className="text-danger">{errors.address.message}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Parent Details Section */}
        <div className="bg-white mb-4 rounded shadow-sm">
          <div className="card-header bg-primary rounded text-white p-2 mb-2">
            <h3 className="mb-0">Parent Details</h3>
          </div>

          {/* parent info */}
          <div className="p-2">
            <div className="row g-3">
              <div className="col-md-4 mb-2">
                <label className="form-label text-black" htmlFor="fatherName">
                  Father&apos;s Name
                </label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  placeholder="Father Name..."
                  className="form-control border"
                  {...register("fatherName", {
                    required: "Father's name is required",
                  })}
                />
                {errors.fatherName && (
                  <span className="text-danger">
                    {errors.fatherName.message}
                  </span>
                )}
              </div>

              <div className="col-md-4 mb-2">
                <label className="form-label text-black" htmlFor="motherName">
                  Mother&apos;s Name
                </label>
                <input
                  type="text"
                  id="motherName"
                  {...register("motherName", {
                    required: "Mother's name is required",
                  })}
                  className="form-control border"
                />
                {errors.motherName && (
                  <span className="text-danger">
                    {errors.motherName.message}
                  </span>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label
                  className="form-label text-black"
                  htmlFor="parentContact"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="parentContact"
                  {...register("parentContact", {
                    required: "Parent contact is required",
                    pattern: {
                      value: /^(017|018|013|014|016|015)\d{8}$/, // Ensures it starts with one of the valid prefixes and has 8 more digits
                      message:
                        "Please enter a valid contact number starting with 017, 013, 014, 016, or 015",
                    },
                  })}
                  className="form-control border"
                />
                {errors.parentContact && (
                  <span className="text-danger">
                    {errors.parentContact.message}
                  </span>
                )}
              </div>
            </div>

            {/* parent's address */}
            <div className="row g-3 mb-4">
              <div className="col-12">
                <label
                  className="form-label text-black"
                  htmlFor="parentAddress"
                >
                  Parent Address
                </label>
                <textarea
                  id="parentAddress"
                  {...register("parentAddress", {
                    required: "Parent address is required",
                  })}
                  className="form-control border"
                />
                {errors.parentAddress && (
                  <span className="text-danger">
                    {errors.parentAddress.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 ">
          <div className="col-md-6">
            <button
              type="reset"
              className="btn btn-outline-secondary w-100"
              onClick={() => reset()} // This will reset the form if using react-hook-form
            >
              Clear Form
            </button>
          </div>
          <div className="col-md-6">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={Object.keys(errors).length > 0} // Disable if there are errors
            >
              Register Now
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const styles = {
  input: {
    padding: "5px 0px;",
  },
  passwordContainer: {
    position: "relative",
    zIndex: "0",
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

export default Registration;
