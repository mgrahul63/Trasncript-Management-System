/* eslint-disable react/prop-types */
import { MdClose } from "react-icons/md"; // Import Close icon

const CloseIcon = ({ onClose }) => {
  return (
    <button
      onClick={onClose} // Call the onClose function when clicked
      style={styles.closeButton}
    >
      <MdClose size={30} /> {/* Close Icon */}
    </button>
  );
};
const styles = {
  closeButton: {
    background: "none",
    border: "2px solid gray",
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
  },
};
export default CloseIcon;
