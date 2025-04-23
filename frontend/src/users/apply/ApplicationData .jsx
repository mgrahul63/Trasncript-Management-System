/* eslint-disable react/prop-types */

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ApplicationData = ({ formData, setShowData, setShowPayment }) => {
  const navigate = useNavigate();
  // Log info by iterating over it
  const info = {};

  // Loop through the info entries and store them in the info object
  for (let pair of formData.entries()) {
    info[pair[0]] = pair[1];
  }
  // console.log(info.amount);
  // Log the info object
  const image_URL = info?.image_file
    ? URL.createObjectURL(info.image_file)
    : undefined;
  const previous_transcript_image = info?.previous_transcript_image
    ? URL.createObjectURL(info.previous_transcript_image)
    : undefined;

  const handleSubmitClick = () => {
    // console.log("object");
    setShowPayment(true);
  };

  console.log(formData.get("action"));

  const handleUpdateClick = async () => {
    try {
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
      console.log(result);
      
      if (result.status === true) {
        setShowPayment(false);
        // toas.success("Apply done!");

        // SweetAlert Success Message
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your offline payment application has been successfully submitted.",
          confirmButtonColor: "#28a745", // Green color for success
        });
        navigate("/dashboard");
      } else if (result.status === false) {
        // toast.error(result.message);

        // SweetAlert Error Message
        Swal.fire({
          icon: "error",
          title: "Submission Failed!",
          text: result.message || "There was an issue with your application.",
          confirmButtonColor: "#d33", // Red color for error
        });

        navigate("/dashboard/applyHistory");
      }
    } catch (error) {
      console.error("Error:", error);

      // SweetAlert for Network or Server Error
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Application Data</h2>
      <h3>Please review your information.</h3>
      <div style={styles.contentContainer}>
        {/* info  */}
        <div style={styles.infoContainer}>
          <table style={styles.table}>
            <tbody>
              <tr style={styles.tr}>
                <td style={styles.td}>
                  <span style={styles.label}>Student ID</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.value}>{info?.studentId}</span>
                </td>
              </tr>
              <tr style={styles.tr}>
                <td style={styles.td}>
                  <span style={styles.label}>Register ID</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.value}>{info?.registerId}</span>
                </td>
              </tr>
              <tr style={styles.tr}>
                <td style={styles.td}>
                  <span style={styles.label}>Faculty Name</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.value}>{info?.facultyName}</span>
                </td>
              </tr>
              <tr style={styles.tr}>
                <td style={styles.td}>
                  <span style={styles.label}>Department Name</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.value}>{info?.departmentName}</span>
                </td>
              </tr>
              <tr style={styles.tr}>
                <td style={styles.td}>
                  <span style={styles.label}>Session ID</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.value}>{info?.session_id}</span>
                </td>
              </tr>

              {info?.apply_type === "Transcript" && (
                <>
                  {/* <tr style={styles.tr}>
                    <td colSpan="2" style={styles.sectionHeader}>
                      Transcript Details
                    </td>
                  </tr> */}
                  <tr style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.label}>Apply Type</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.value}>{info?.apply_type}</span>
                    </td>
                  </tr>
                  <tr style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.label}>Semester ID</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.value}>{info?.semester_id}</span>
                    </td>
                  </tr>
                  <tr style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.label}>Transcript Fee</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.value}>{info?.amount}</span>
                    </td>
                  </tr>
                </>
              )}
              {info?.apply_type === "Certificate" && <p>certificate</p>}
            </tbody>
          </table>
        </div>

        {/* image */}
        <div style={styles.imageContainer}>
          <table style={styles.table}>
            <tbody>
              <tr style={styles.tr}>
                <td style={styles.middle}>
                  <img src={image_URL} alt="Uploaded" style={styles.image} />
                </td>
              </tr>
              <tr style={styles.tr}>
                <td style={styles.middle}>
                  <img
                    src={previous_transcript_image}
                    alt="Uploaded"
                    style={styles.image}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={() => setShowData(false)}
          style={styles.buttonEdit}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e67e22")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f39c12")}
        >
          Edit
        </button>
        {formData.get("action")?.trim() === "editApply" ? (
          <button
            onClick={handleUpdateClick}
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2980b9")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}
          >
            Update
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleSubmitClick}
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2980b9")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f1e8e8",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "900px",
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "24px",
    textAlign: "center",
    paddingBottom: "10px",
  },
  contentContainer: {
    width: "100%",
    display: "flex",
    gap: "10px",
    justifyContent: "space-bewteen",
    border: "2px solid #2980b9", // adds a border around contentContainer
    borderRadius: "10px", // optional rounded corners
    padding: "20px", // optional padding inside the border
    marginBottom: "20px",
  },

  imageContainer: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%", // Ensures the image takes up the full width of the container
    height: "140px", // Maintains the aspect ratio
    borderRadius: "10px",
    objectFit: "cover", // Ensures the image covers the area while maintaining its aspect ratio
  },
  middle: {
    padding: "8px",
    display: "flex", // Enable flexbox on td
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
  },
  infoContainer: {
    width: "70%",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tr: {
    border: "2px solid #6f6464", // Light border for row
  },

  td: {
    padding: "8px",
    border: "1px solid #6d6969",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#3498db",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.3s ease",
  },
  buttonEdit: {
    padding: "12px 24px",
    backgroundColor: "#f39c12",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.3s ease",
  },
};

export default ApplicationData;
