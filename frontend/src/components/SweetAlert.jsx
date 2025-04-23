import Swal from "sweetalert2";

const SweetAlert = () => {
  const showAlert = () => {
    Swal.fire({
      title: "Success!",
      text: "You have successfully completed this action.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  return (
    <div>
      <button onClick={showAlert} className="btn btn-primary">
        Show Alert
      </button>
    </div>
  );
};

export default SweetAlert;
