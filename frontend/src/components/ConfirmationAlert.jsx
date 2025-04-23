 
import Swal from "sweetalert2";

const ConfirmationAlert = () => {
    const showConfirmation = () => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to undo this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Deleted!", "Your item has been deleted.", "success");
          }
        });
      };

  return (
    <div>
      <button onClick={showConfirmation} className="btn btn-primary">
      Confirmation Alert
      </button>
    </div>
  );
};

export default ConfirmationAlert;
  