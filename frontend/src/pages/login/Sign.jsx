import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomButton from "../../components/Loading";
import { useData } from "../../context/Context";
const SignIn = () => {
  const { setRole, setUserInfo, setIsAuthenticated } = useData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isloading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const handleSignIn = async (e) => {
    e.preventDefault();

    //remove before token
    localStorage.removeItem("authToken");

    try {
      setLoading(true);
      setError("");
      // Make the API request
      const response = await axios.post(
        "http://localhost/versity/backend/api/login.php",
        {
          email,
          password,
        }
      );

      const result = response.data;
      console.log(response.data);
      if (result?.status === 0) {
        setError(result?.message);
      }

      if (result.role === "admin") {
        setRole(result?.role);

        localStorage.setItem("authToken", result?.jwt);
        localStorage.setItem("role", result?.role);

        // Navigate based on admin role_type
        const adminPath =
          result.adminData?.role_type === "departmentAdmin"
            ? "/admin/department/dashboard"
            : result.adminData?.role_type === "facultyAdmin"
            ? "/admin/faculty/dashboard"
            : result.adminData?.role_type === "registerAdmin"
            ? "/admin/register/dashboard"
            : result.adminData?.role_type === "accountant"
            ? "/admin/accountant/dashboard"
            : null;

        if (adminPath) navigate(adminPath);

        toast.success(
          "🎉 Welcome back, you're successfully logged in! Let's get started."
        );
      } else if (result.role === "user") {
        if (result.error) {
          setError(result.error);
        } else {
          const { data, jwt } = result;
          // jwt store in localstorage
          localStorage.setItem("authToken", jwt);
          localStorage.setItem("role", result?.role);

          setRole(result?.role);
          setUserInfo(data);
          setIsAuthenticated(true);
          setLoading(false);

          navigate("/dashboard");
          toast.success(
            "🎉 Welcome back, you're successfully logged in! Let's get started."
          );
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("A network error occurred. Please try again later."); // Handle network or other errors
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignIn} style={styles.form}>
        <h2 style={styles.title}>Sign In</h2>
        {error && <span style={styles.errorMessage}>{error}</span>}
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="email">
            Username
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <CustomButton isLoading={isloading} type={"submit"} label="Sign In" />
        {/* Sign Up link with event handler */}
        <p style={styles.signUpMessage}>
          Don&apos;t have an account yet?{" "}
          <span>
            <Link to={"/registration"} style={styles.link}>
              Create an Account
            </Link>
          </span>
        </p>

        {/* <li className="py-1 ">
        <NavLink
          to="/registration"
          className={({ isActive }) =>
            isActive
              ? "text-warning fw-bold text-decoration-none"
              : "text-white text-decoration-none"
          }
        >
          Registration
        </NavLink>
      </li> */}

        {/* Forgot Password link with event handler */}
        <p style={styles.forgotMessage}>
          <span>Having trouble accessing your account? </span>
          <Link to={"/forgot-password"} style={styles.forgotLink}>
            Forgot your password?
          </Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "90vh",
    backgroundColor: "#f4f4f4",
  },
  form: {
    width: "500px",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  errorMessage: {
    color: "red",
    fontSize: "17px",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "bold",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#555",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    outline: "none",
  },
  signUpMessage: {
    fontSize: "14px",
    color: "#555",
    textAlign: "center",
  },
  link: {
    color: "#007BFF", // Blue color for the Create an Account link
    textDecoration: "none",
    cursor: "pointer",
  },
  forgotMessage: {
    fontSize: "14px",
    color: "#555",
    textAlign: "center",
    marginTop: "10px",
  },
  forgotLink: {
    color: "#007BFF", // Blue color for the Forgot your password link
    textDecoration: "none",
    cursor: "pointer",
  },
};

export default SignIn;
