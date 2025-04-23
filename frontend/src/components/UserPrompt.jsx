import Swal from "sweetalert2";

const UserPrompt = () => {
  const showPrompt = () => {
    Swal.fire({
      title: "Enter your name",
      input: "text",
      inputPlaceholder: "Type your name here...",
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        Swal.fire(`Hello, ${result.value}!`);
      }
    });
  };

  return (
    <div>
      <button onClick={showPrompt} className="btn btn-primary">
        User Prompt
      </button>
    </div>
  );
};

export default UserPrompt;
