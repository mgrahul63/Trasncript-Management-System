import Swal from "sweetalert2";

const AutoCloseAlert = () => {
  const showAutoCloseAlert = () => {
    Swal.fire({
      title: "Auto close alert",
      text: "This alert will close in 3 seconds.",
      icon: "info",
      timer: 3000,
      showConfirmButton: false,
    });
  };

  return (
    <div>
      <button onClick={showAutoCloseAlert} className="btn btn-primary">
        Auto Close Alert
      </button>
    </div>
  );
};

export default AutoCloseAlert;
