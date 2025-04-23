/* eslint-disable react/prop-types */
 
// Custom button component with loading state
const CustomButton = ({ isLoading, type, label = "Submit", size = "16px", color = "#fff", backgroundColor = "#007BFF" }) => {
  const styles = {
    button: {
      width: "100%",
      padding: "10px",
      fontSize: size,
      color: color,
      backgroundColor: isLoading ? "#6c757d" : backgroundColor, // Change color when loading
      border: "none",
      borderRadius: "5px",
      cursor: isLoading ? "not-allowed" : "pointer", // Disable pointer when loading
      transition: "background-color 0.3s",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
    spinner: {
      border: "2px solid #f3f3f3", // Light gray border
      borderTop: "2px solid #fff", // White top border for the spinner
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      animation: "spin 1s linear infinite", // Spinner animation
      display: "inline-block",
      marginRight: "10px", // Space between spinner and text
    },
  };

  // Spinner animation in CSS
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, styleSheet.cssRules.length);

  return (
    <button
      style={styles.button}
      type={type}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div style={styles.spinner}></div>
          Loading...
        </>
      ) : (
        label
      )}
    </button>
  );
};

export default CustomButton;
